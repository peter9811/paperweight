export type ColorTheme = "dim" | "silk";

export function readColorTheme(): ColorTheme {
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "silk" ? "silk" : "dim";
}

export function applyColorTheme(theme: ColorTheme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function loadSavedColorTheme(): ColorTheme {
  const saved = window.api.getSettings().colorTheme;
  return saved === "silk" ? "silk" : "dim";
}

export function setColorTheme(theme: ColorTheme): void {
  applyColorTheme(theme);
  void window.api.saveSettings({ colorTheme: theme });
}
