import { ipcMain, shell } from "electron";
import { IPC } from "@shared/ipc";
import { isLicenseKey, isString } from "@shared/validation";
import { activateLicense, getLicenseStatus, deleteLicense, applyAutoLaunch } from "../services/settings";
import { getSetting, saveSetting } from "../services/settings";
import { getGlobalSetting, saveGlobalSetting } from "../services/globalSettings";
import { loadCredentials, getActiveEmail } from "../credentials";
import { dataLog } from "../utils/log";

function getSettings() {
  const hasAccount = !!getActiveEmail();
  const creds = hasAccount ? loadCredentials() : undefined;
  const registered = hasAccount ? !!getSetting("registeredAt") : false;
  const autoLaunchVal = getGlobalSetting("autoLaunch");
  const launchMinimizedVal = getGlobalSetting("launchMinimized");
  const colorTheme = getGlobalSetting("colorTheme");
  return {
    providerType: creds?.providerType || "none",
    autoLaunch: autoLaunchVal !== undefined ? autoLaunchVal : registered,
    launchMinimized: launchMinimizedVal !== undefined ? launchMinimizedVal : registered,
    userName: hasAccount ? (getSetting("userName") ?? "") : "",
    colorTheme: colorTheme === "silk" ? "silk" : "dim",
  };
}

export function registerSettingsHandlers(): void {
  // --- License ---

  ipcMain.handle(IPC.activateLicense, async (_event, key: unknown) => {
    if (!isLicenseKey(key)) throw new Error("Invalid license key");
    return activateLicense(key);
  });

  ipcMain.handle(IPC.getLicenseStatus, () => getLicenseStatus());

  ipcMain.handle(IPC.deactivateLicense, () => {
    deleteLicense();
  });

  // --- App settings ---

  ipcMain.on(IPC.getSettings, (event) => {
    event.returnValue = getSettings();
  });

  ipcMain.handle(IPC.saveSettings, (_event, settings: unknown) => {
    if (!settings || typeof settings !== "object") {
      throw new Error("Invalid settings");
    }
    const s = settings as Record<string, unknown>;
    const changedKeys = Object.keys(s).join(", ");
    dataLog.info(`Settings saved: ${changedKeys}`);

    if (s.autoLaunch !== undefined) {
      if (typeof s.autoLaunch !== "boolean") throw new Error("Invalid autoLaunch");
      saveGlobalSetting("autoLaunch", s.autoLaunch);
    }

    if (s.launchMinimized !== undefined) {
      if (typeof s.launchMinimized !== "boolean") throw new Error("Invalid launchMinimized");
      saveGlobalSetting("launchMinimized", s.launchMinimized);
    }

    if (s.autoLaunch !== undefined || s.launchMinimized !== undefined) {
      const autoLaunch = getGlobalSetting("autoLaunch") ?? false;
      const minimized = getGlobalSetting("launchMinimized") ?? false;
      applyAutoLaunch(autoLaunch, minimized);
    }

    if (s.userName !== undefined) {
      if (typeof s.userName !== "string") throw new Error("Invalid userName");
      saveSetting("userName", s.userName);
    }

    if (s.colorTheme !== undefined) {
      if (s.colorTheme !== "dim" && s.colorTheme !== "silk") {
        throw new Error("Invalid colorTheme");
      }
      saveGlobalSetting("colorTheme", s.colorTheme);
    }
  });

  // --- Shell ---

  ipcMain.handle(IPC.openExternal, (_event, url: unknown) => {
    if (!isString(url) || url.trim() === "") return;

    try {
      const parsed = new URL(url);
      if (["https:", "http:", "mailto:"].includes(parsed.protocol)) {
        shell.openExternal(url);
      }
    } catch {
      // Invalid URL, ignore
    }
  });
}
