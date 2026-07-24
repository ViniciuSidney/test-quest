import { loadSettings, saveSettings } from "./settings.repository.js";

export function createThemeController({
  root = globalThis.document,
  target = globalThis.document?.body,
  onPersistenceError = () => {}
} = {}) {
  let initialized = false;

  function init() {
    if (initialized || !root || !target) return;
    initialized = true;

    const settings = loadSettings();
    apply(settings.tema || "light");

    root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", toggle);
    });
  }

  function apply(theme) {
    const normalized = theme === "dark" ? "dark" : "light";
    target.dataset.theme = normalized;

    root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.textContent = normalized === "dark" ? "☀️ Tema" : "🌙 Tema";
      button.setAttribute(
        "aria-label",
        normalized === "dark" ? "Alternar para tema claro" : "Alternar para tema escuro"
      );
    });

    return normalized;
  }

  function toggle() {
    const theme = apply(target.dataset.theme === "dark" ? "light" : "dark");
    const current = loadSettings();
    const saved = saveSettings({ ...current, tema: theme });

    if (!saved.ok) {
      onPersistenceError({ errorCode: saved.errorCode, error: saved.error });
    }
  }

  return { init, apply, toggle };
}
