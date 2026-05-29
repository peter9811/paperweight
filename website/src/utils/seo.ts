import type { Metadata } from "next";
import { SITE_CONFIG } from "@/utils/config";

interface PageMetadataOptions {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/guides". Defaults to the home page. */
  path?: string;
  /** Open Graph type. Use "article" for content pages like guides and breaches. */
  type?: "website" | "article";
  /**
   * Set when the route provides its own image via the file-based
   * `opengraph-image` convention, so we don't emit a duplicate og:image.
   */
  hasOwnImage?: boolean;
}

const DEFAULT_IMAGE = `${SITE_CONFIG.URL}/og.png`;

/**
 * Builds page metadata with a complete Open Graph block.
 *
 * Next.js merges metadata shallowly and replaces nested objects like
 * `openGraph` wholesale rather than deep-merging them, so a page that sets its
 * own `openGraph` loses the defaults from the root layout. This helper
 * re-composes the full block (type, siteName, image) for every page that needs
 * a page-specific title, description, or URL.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  type = "website",
  hasOwnImage = false,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_CONFIG.URL}${path}`;
  const image = hasOwnImage ? undefined : DEFAULT_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: SITE_CONFIG.NAME,
      ...(image ? { images: image } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_CONFIG.SOCIAL_TWITTER,
      title,
      description,
      ...(image ? { images: image } : {}),
    },
  };
}
