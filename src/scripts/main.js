import { initApp } from "./app.js";
import { reportStartupError } from "./shared/startup-error.js";

function start() {
  try {
    initApp();
  } catch (error) {
    reportStartupError(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
