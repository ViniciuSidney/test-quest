import { loadSettings, saveSettings } from "./settings.repository.js";
import {
  applyVisualEffectsPreference,
  getReducedMotionMediaQuery,
  getVisualEffectsLabel,
  resolveVisualEffectsMode,
  VISUAL_EFFECTS_MODES
} from "./visual-effects.service.js";

export function createVisualEffectsController({
  root = globalThis.document,
  target = globalThis.document?.body,
  onPersistenceError = () => {}
} = {}) {
  const reducedMotionMedia = globalThis.matchMedia?.(getReducedMotionMediaQuery());
  let previousFocus = null;
  let initialized = false;

  function init() {
    if (initialized || !root || !target) return;
    initialized = true;

    const settings = loadSettings();
    apply(settings.efeitosVisuais || VISUAL_EFFECTS_MODES.SYSTEM);

    root.querySelectorAll("[data-motion-settings-open]").forEach((button) => {
      button.addEventListener("click", open);
    });
    root.querySelectorAll("[data-motion-settings-close]").forEach((button) => {
      button.addEventListener("click", close);
    });
    root.querySelector("#btnCancelarEfeitosVisuais")?.addEventListener("click", close);
    root.querySelector("#formEfeitosVisuais")?.addEventListener("submit", submit);
    root.querySelectorAll('input[name="efeitosVisuais"]').forEach((input) => {
      input.addEventListener("change", () => updateStatus(input.value));
    });
    root.addEventListener("keydown", handleKeydown);

    const syncSystemPreference = () => {
      if (target.dataset.motion === VISUAL_EFFECTS_MODES.SYSTEM) {
        apply(VISUAL_EFFECTS_MODES.SYSTEM);
      }
    };

    if (typeof reducedMotionMedia?.addEventListener === "function") {
      reducedMotionMedia.addEventListener("change", syncSystemPreference);
    } else if (typeof reducedMotionMedia?.addListener === "function") {
      reducedMotionMedia.addListener(syncSystemPreference);
    }
  }

  function apply(mode) {
    const result = applyVisualEffectsPreference(mode, {
      target,
      matchMedia: () => reducedMotionMedia || { matches: false }
    });
    const label = getVisualEffectsLabel(result.mode);

    root.querySelectorAll("[data-motion-settings-label]").forEach((element) => {
      element.textContent = `Efeitos: ${label}`;
    });
    root.querySelectorAll("[data-motion-settings-open]").forEach((button) => {
      button.setAttribute("aria-label", `Configurar efeitos visuais. Preferência atual: ${label}.`);
      button.title = `Efeitos visuais: ${label}`;
    });

    return result;
  }

  function open(event) {
    const modal = root.querySelector("#modalEfeitosVisuais");
    if (!modal) return;

    previousFocus = event?.currentTarget || root.activeElement;
    const mode = target.dataset.motion || VISUAL_EFFECTS_MODES.SYSTEM;
    const input = modal.querySelector(`input[name="efeitosVisuais"][value="${mode}"]`)
      || modal.querySelector('input[name="efeitosVisuais"][value="system"]');

    if (input) input.checked = true;
    updateStatus(mode);
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    target.classList.add("modal-open");
    globalThis.requestAnimationFrame?.(() => input?.focus());
  }

  function close() {
    const modal = root.querySelector("#modalEfeitosVisuais");
    if (!modal || modal.classList.contains("hidden")) return;

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    syncBodyModalState();

    const focusTarget = previousFocus instanceof globalThis.HTMLElement && previousFocus.isConnected
      ? previousFocus
      : root.querySelector("[data-motion-settings-open]");

    previousFocus = null;
    focusTarget?.focus();
  }

  function submit(event) {
    event.preventDefault();
    const selected = root.querySelector('input[name="efeitosVisuais"]:checked');
    const mode = selected?.value || VISUAL_EFFECTS_MODES.SYSTEM;
    const result = apply(mode);
    const current = loadSettings();
    const saved = saveSettings({ ...current, efeitosVisuais: result.mode });

    if (!saved.ok) {
      onPersistenceError({ errorCode: saved.errorCode, error: saved.error });
    }

    close();
  }

  function updateStatus(mode) {
    const status = root.querySelector("#statusEfeitosVisuais");
    if (!status) return;

    const systemReduced = Boolean(reducedMotionMedia?.matches);
    const resolved = resolveVisualEffectsMode(mode, systemReduced);

    if (mode === VISUAL_EFFECTS_MODES.SYSTEM) {
      status.textContent = resolved === VISUAL_EFFECTS_MODES.REDUCED
        ? "O sistema deste dispositivo está solicitando efeitos reduzidos."
        : "O sistema deste dispositivo está permitindo efeitos completos.";
      return;
    }

    status.textContent = mode === VISUAL_EFFECTS_MODES.REDUCED
      ? "Animações e transições serão exibidas imediatamente."
      : "Todas as animações e transições visuais permanecerão ativas.";
  }

  function handleKeydown(event) {
    const modal = root.querySelector("#modalEfeitosVisuais");
    if (!modal || modal.classList.contains("hidden")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "Tab") {
      keepFocus(event, modal);
    }
  }

  function keepFocus(event, modal) {
    const focusable = [...modal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )].filter((element) => !element.hasAttribute("hidden"));

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && root.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && root.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function syncBodyModalState() {
    const hasOpenModal = Boolean(root.querySelector(".modal:not(.hidden)"));
    target.classList.toggle("modal-open", hasOpenModal);
  }

  return { init, apply, open, close };
}
