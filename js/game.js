document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-iniciar").addEventListener("click", iniciarJogo);
});

function iniciarJogo() {
  reiniciarEstado();

  estadoJogo.jogoAtivo = true;

  document.getElementById("ecra-inicio").classList.remove("ativo");
  document.getElementById("ecra-jogo").classList.add("ativo");

  iniciarRonda();
}

async function iniciarRonda() {
  const pokemon = await obterPokemonAleatorio();

  estadoJogo.pokemonAtual = pokemon;

  document.getElementById("display-pokemon").innerHTML = `
    <img class="img-silhueta" src="${pokemon.sprites.front_default}">
  `;

  document.getElementById("hud-pontos").textContent = estadoJogo.pontos;
  document.getElementById("num-ronda").textContent = estadoJogo.ronda;
  document.getElementById("hud-streak").textContent = "🔥 " + estadoJogo.streak;

  iniciarTimer(60, perderVida);
}

function respostaCorreta() {
  estadoJogo.pontos += 10;
  estadoJogo.streak++;
  estadoJogo.ronda++;

  pararTimer();
  iniciarRonda();
}

function respostaErrada() {
  perderVida();
}

function perderVida() {
  estadoJogo.vidas--;
  estadoJogo.streak = 0;

  atualizarVidas();

  if (estadoJogo.vidas <= 0) {
    terminarJogo();
    return;
  }

  estadoJogo.ronda++;
  iniciarRonda();
}

function atualizarVidas() {
  const vidas = document.querySelectorAll(".vida");

  vidas.forEach((v, i) => {
    if (i >= estadoJogo.vidas) {
      v.classList.add("perdida");
    }
  });
}

function terminarJogo() {
  pararTimer();

  estadoJogo.jogoAtivo = false;

  document.getElementById("ecra-jogo").classList.remove("ativo");
  document.getElementById("ecra-fim").classList.add("ativo");

  document.getElementById("fim-pontos").textContent = estadoJogo.pontos;
  document.getElementById("fim-acertos").textContent = estadoJogo.streak;
  document.getElementById("fim-rondas").textContent = estadoJogo.ronda;
  document.getElementById("fim-streak").textContent = estadoJogo.streak;
}
