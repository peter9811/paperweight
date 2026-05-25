#!/usr/bin/env bash
#
# Make the Linux AppImage updatable by *external* tools (AppImageUpdate,
# AppImageLauncher, AM/AppMan).
#
# Background
# ----------
# There are two unrelated update systems for our AppImage:
#
#   1. electron-updater (in-app)  - the app reads dist/latest-linux.yml from the
#      GitHub release on launch and updates itself. This already works.
#   2. Native AppImage updates    - external tools read an "update information"
#      string baked into a reserved ELF section of the AppImage (.upd_info) and
#      a sibling .zsync file. This is what GitHub issue #35 asks for.
#
# electron-builder ships (1) and deliberately leaves (2) empty: it reserves a
# 1 KiB, zero-filled .upd_info section but never writes to it, and produces no
# .zsync. This script fills that gap as a post-build step.
#
# How it embeds the string
# ------------------------
# It writes the update-information string directly into the .upd_info section at
# its file offset. This is byte-for-byte what `appimagetool -u` does internally
# (it fseek()s to the section and fwrite()s the string after a size check), so
# the result is identical to a tool-built AppImage. We do it in place so we do
# NOT disturb electron-builder's runtime or its appended delta blockmap.
#
# Note: we intentionally do NOT use `objcopy --update-section`. An AppImage is an
# ELF runtime with a squashfs filesystem appended after it; objcopy rewrites the
# ELF and would drop/misplace that appended data, corrupting the AppImage. A
# direct in-place write leaves every other byte untouched (verified: file size
# is unchanged and only the section's bytes differ).
#
# Because the bytes change, the AppImage's sha512 changes too. electron-updater
# verifies that sha512 against latest-linux.yml, so we recompute it there (the
# file size is unchanged, so size/blockMapSize stay valid).
#
# Usage: scripts/embed-appimage-update-info.sh [DIST_DIR]   (default: dist)
# Requires: readelf (binutils), zsyncmake (the `zsync` package), openssl.

set -euo pipefail

# --- configuration -----------------------------------------------------------
GH_OWNER="wslyvh"
GH_REPO="paperweight"
# Wildcard matches every versioned .zsync we publish (Paperweight-0.3.2.AppImage.zsync, ...).
ZSYNC_PATTERN="Paperweight-*.AppImage.zsync"
UPDATE_INFO="gh-releases-zsync|${GH_OWNER}|${GH_REPO}|latest|${ZSYNC_PATTERN}"

DIST_DIR="${1:-dist}"
YML="${DIST_DIR}/latest-linux.yml"

# --- preflight ---------------------------------------------------------------
for tool in readelf zsyncmake openssl; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "::error::'$tool' not found. Install it first (zsyncmake comes from the 'zsync' package)." >&2
    exit 1
  fi
done

APPIMAGE=$(ls "${DIST_DIR}"/*.AppImage 2>/dev/null | head -n1 || true)
if [ -z "$APPIMAGE" ]; then
  echo "::error::no AppImage found in ${DIST_DIR}/" >&2
  exit 1
fi
if [ ! -f "$YML" ]; then
  echo "::error::${YML} not found (electron-updater manifest expected)" >&2
  exit 1
fi

echo "AppImage:        $APPIMAGE"
echo "Update info:     $UPDATE_INFO"

# --- 1. embed update information into the reserved .upd_info section ----------
# Locate the section's file offset and size (hex) the same way libappimage's
# appimage_get_elf_section_offset_and_length() does.
section=$(readelf -SW "$APPIMAGE" | awk '/ \.upd_info /{print $5, $6}')
off_hex=$(echo "$section" | awk '{print $1}')
size_hex=$(echo "$section" | awk '{print $2}')
if [ -z "$off_hex" ]; then
  echo "::error::.upd_info section not found in $APPIMAGE" >&2
  exit 1
fi
offset=$((16#$off_hex))
size=$((16#$size_hex))

if [ "${#UPDATE_INFO}" -gt "$size" ]; then
  echo "::error::update info (${#UPDATE_INFO} bytes) does not fit in .upd_info (${size} bytes)" >&2
  exit 1
fi

# conv=notrunc => write in place, keep the file size and everything after the section.
printf '%s' "$UPDATE_INFO" | dd of="$APPIMAGE" bs=1 seek="$offset" conv=notrunc status=none

# Read it back to be sure (strip the trailing NUL padding of the reserved section).
embedded=$(dd if="$APPIMAGE" bs=1 skip="$offset" count="$size" status=none | tr -d '\0')
if [ "$embedded" != "$UPDATE_INFO" ]; then
  echo "::error::verification failed; embedded '$embedded'" >&2
  exit 1
fi
echo "Embedded update information into .upd_info (offset ${offset}, ${size} bytes reserved)."

# --- 2. recompute the AppImage sha512 in latest-linux.yml --------------------
# electron-updater stores the AppImage's sha512 as base64 in two places (the
# files[] entry and the top-level key); both equal each other. The .deb has a
# different sha512 we must not touch.
old_sha=$(grep -E '^sha512:' "$YML" | awk '{print $2}')
if [ -z "$old_sha" ]; then
  echo "::error::no top-level sha512 found in ${YML}" >&2
  exit 1
fi
new_sha=$(openssl dgst -sha512 -binary "$APPIMAGE" | base64 -w0)
sed -i "s|${old_sha}|${new_sha}|g" "$YML"

# Guard: the new sha must now appear exactly twice and the old one not at all.
# -F: match the base64 hashes literally, not as regexes.
new_count=$(grep -Fc -- "$new_sha" "$YML" || true)
old_count=$(grep -Fc -- "$old_sha" "$YML" || true)
if [ "$new_count" -ne 2 ] || [ "$old_count" -ne 0 ]; then
  echo "::error::latest-linux.yml sha512 rewrite looks wrong (new x${new_count}, old x${old_count})" >&2
  exit 1
fi
echo "Updated ${YML}: AppImage sha512 -> ${new_sha}"

# --- 3. generate the .zsync delta map (AFTER patching, so it matches) --------
# The relative -u URL resolves against the .zsync's own release-download
# location, i.e. the AppImage sitting next to it on the GitHub release.
appimage_name=$(basename "$APPIMAGE")
( cd "$DIST_DIR" && zsyncmake -u "$appimage_name" "$appimage_name" )
echo "Wrote ${DIST_DIR}/${appimage_name}.zsync"
