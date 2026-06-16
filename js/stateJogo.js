/* estado.js */

const estadoJogo = {
  modo: "silhueta",
  dificuldade: "facil",
  pontos: 0,
  vidas: 3,
  streak: 0,
  ronda: 1,
  pokemonAtual: null,
  tempoRestante: 60,
  jogoAtivo: false,
};

// Reinicia o estado para um novo jogo
function reiniciarEstado() {
  estadoJogo.pontos = 0;
  estadoJogo.vidas = 3;
  estadoJogo.streak = 0;
  estadoJogo.ronda = 1;
  estadoJogo.pokemonAtual = null;
  estadoJogo.tempoRestante = 60;
  estadoJogo.jogoAtivo = false;
}
