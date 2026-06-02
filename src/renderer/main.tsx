import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/global.css";
import { applyColorTheme, loadSavedColorTheme } from "./utils/colorTheme";

applyColorTheme(loadSavedColorTheme());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
