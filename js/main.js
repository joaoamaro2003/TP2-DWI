/**
 * main.js - Event listeners e arranque
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Seleção de modo ---
  document.querySelectorAll(".btn-modo").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-modo")
        .forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      estadoJogo.modo = btn.dataset.modo;
    });
  });

  // --- Seleção de dificuldade ---
  document.querySelectorAll(".btn-dif").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-dif")
        .forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      estadoJogo.dificuldade = btn.dataset.dif;
    });
  });

  // --- Iniciar partida ---
  document.getElementById("btn-iniciar").addEventListener("click", iniciarJogo);

  // --- Histórico ---
  document.getElementById("btn-historico").addEventListener("click", () => {
    renderizarHistorico();
    mostrarEcra("historico");
  });

  document.getElementById("btn-voltar").addEventListener("click", () => {
    mostrarEcra("inicio");
  });

  document.getElementById("btn-exportar").addEventListener("click", () => {
    exportarCSV();
  });

  // --- Submeter resposta ---
  document.getElementById("btn-adivinhar").addEventListener("click", () => {
    submeterResposta();
  });

  document.getElementById("input-resposta").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submeterResposta();
  });

  // --- Pista ---
  document.getElementById("btn-pista").addEventListener("click", () => {
    pedirPista();
  });

  // --- Fim de jogo ---
  document
    .getElementById("btn-jogar-novamente")
    .addEventListener("click", () => {
      iniciarJogo();
    });

  document.getElementById("btn-menu").addEventListener("click", () => {
    mostrarEcra("inicio");
  });

  // --- Atalhos de teclado ---
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName.toLowerCase();
    if (tag === "input") return;
    if (e.key === "Enter") submeterResposta();
    if (e.key === "h" || e.key === "H") pedirPista();
  });

  // --- Mostra ecrã inicial ---
  mostrarEcra("inicio");
});
