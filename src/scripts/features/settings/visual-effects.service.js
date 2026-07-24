export const VISUAL_EFFECTS_MODES = Object.freeze({
  SYSTEM: "system",
  FULL: "full",
  REDUCED: "reduced"
});

const VALID_MODES = new Set(Object.values(VISUAL_EFFECTS_MODES));
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function normalizeVisualEffectsMode(mode) {
  return VALID_MODES.has(mode) ? mode : VISUAL_EFFECTS_MODES.SYSTEM;
}

export function resolveVisualEffectsMode(mode, systemPrefersReduced = false) {
  const normalized = normalizeVisualEffectsMode(mode);

  if (normalized === VISUAL_EFFECTS_MODES.REDUCED) {
    return VISUAL_EFFECTS_MODES.REDUCED;
  }

  if (normalized === VISUAL_EFFECTS_MODES.FULL) {
    return VISUAL_EFFECTS_MODES.FULL;
  }

  return systemPrefersReduced
    ? VISUAL_EFFECTS_MODES.REDUCED
    : VISUAL_EFFECTS_MODES.FULL;
}

export function getSystemReducedMotionPreference(matchMedia = globalThis.matchMedia) {
  if (typeof matchMedia !== "function") {
    return false;
  }

  try {
    return Boolean(matchMedia(REDUCED_MOTION_QUERY).matches);
  } catch {
    return false;
  }
}

export function applyVisualEffectsPreference(
  mode,
  {
    target = globalThis.document?.body,
    matchMedia = globalThis.matchMedia
  } = {}
) {
  const normalized = normalizeVisualEffectsMode(mode);
  const resolved = resolveVisualEffectsMode(
    normalized,
    getSystemReducedMotionPreference(matchMedia)
  );

  if (target?.dataset) {
    target.dataset.motion = normalized;
    target.dataset.motionResolved = resolved;
  }

  return { mode: normalized, resolved };
}

export function shouldReduceVisualEffects(target = globalThis.document?.body) {
  if (target?.dataset?.motionResolved) {
    return target.dataset.motionResolved === VISUAL_EFFECTS_MODES.REDUCED;
  }

  return getSystemReducedMotionPreference();
}

export function getVisualEffectsLabel(mode) {
  switch (normalizeVisualEffectsMode(mode)) {
    case VISUAL_EFFECTS_MODES.FULL:
      return "Completos";
    case VISUAL_EFFECTS_MODES.REDUCED:
      return "Reduzidos";
    default:
      return "Sistema";
  }
}

export function getReducedMotionMediaQuery() {
  return REDUCED_MOTION_QUERY;
}
