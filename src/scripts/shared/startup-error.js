export function reportStartupError(error) {
  console.error("Falha crítica ao iniciar o Test Quest.", error);

  if (typeof document === "undefined" || !document.body) {
    return;
  }

  const existing = document.querySelector("[data-startup-error]");

  if (existing) {
    return;
  }

  const alert = document.createElement("section");
  alert.className = "startup-error";
  alert.dataset.startupError = "true";
  alert.setAttribute("role", "alert");
  alert.innerHTML = `
    <div class="startup-error__content">
      <strong>Não foi possível iniciar o Test Quest.</strong>
      <p>Recarregue a página. Se o problema continuar, preserve suas exportações antes de limpar os dados do site.</p>
      <button type="button" class="primary" data-startup-reload>Recarregar aplicação</button>
    </div>
  `;

  alert.querySelector("[data-startup-reload]")?.addEventListener("click", () => {
    globalThis.location?.reload();
  });

  document.body.prepend(alert);
}
