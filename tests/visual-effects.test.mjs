import assert from "node:assert/strict";
import {
  applyVisualEffectsPreference,
  getVisualEffectsLabel,
  normalizeVisualEffectsMode,
  resolveVisualEffectsMode,
  VISUAL_EFFECTS_MODES
} from "../src/scripts/features/settings/visual-effects.service.js";

assert.equal(normalizeVisualEffectsMode("invalid"), VISUAL_EFFECTS_MODES.SYSTEM);
assert.equal(normalizeVisualEffectsMode("full"), VISUAL_EFFECTS_MODES.FULL);
assert.equal(normalizeVisualEffectsMode("reduced"), VISUAL_EFFECTS_MODES.REDUCED);

assert.equal(resolveVisualEffectsMode("system", false), "full");
assert.equal(resolveVisualEffectsMode("system", true), "reduced");
assert.equal(resolveVisualEffectsMode("full", true), "full");
assert.equal(resolveVisualEffectsMode("reduced", false), "reduced");

const target = { dataset: {} };
const reducedResult = applyVisualEffectsPreference("system", {
  target,
  matchMedia: () => ({ matches: true })
});
assert.deepEqual(reducedResult, { mode: "system", resolved: "reduced" });
assert.equal(target.dataset.motion, "system");
assert.equal(target.dataset.motionResolved, "reduced");

const fullResult = applyVisualEffectsPreference("full", {
  target,
  matchMedia: () => ({ matches: true })
});
assert.deepEqual(fullResult, { mode: "full", resolved: "full" });
assert.equal(target.dataset.motionResolved, "full");

assert.equal(getVisualEffectsLabel("system"), "Sistema");
assert.equal(getVisualEffectsLabel("full"), "Completos");
assert.equal(getVisualEffectsLabel("reduced"), "Reduzidos");

console.log("Visual effects: todos os testes passaram.");
