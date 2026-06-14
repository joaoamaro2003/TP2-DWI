const estadoJogo = {
  modo: "silhueta",
  dificuldade: "facil",
  pontos: 0,
  vidas: 3,
  streak: 0,
  ronda: 1,
  pokemonAtual: null,
};

function guardarEstado() {
  localStorage.setItem("pokeguess_estado", JSON.stringify(estadoJogo));
}

function carregarEstado() {
  const dados = localStorage.getItem("pokeguess_estado");

  if (dados) {
    Object.assign(estadoJogo, JSON.parse(dados));
  }
}

function reiniciarEstado() {
  estadoJogo.pontos = 0;
  estadoJogo.vidas = 3;
  estadoJogo.streak = 0;
  estadoJogo.ronda = 1;
  estadoJogo.pokemonAtual = null;

  guardarEstado();
}
