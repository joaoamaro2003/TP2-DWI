/* game.js - Motor do jogo */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-iniciar").addEventListener("click", iniciarJogo);
});

// Inicia uma nova partida
function iniciarJogo() {
  reiniciarEstado();

  estadoJogo.jogoAtivo = true;

  // Guarda o modo e dificuldade selecionados
  estadoJogo.modo = document.querySelector(".btn-modo.ativo").dataset.modo;
  estadoJogo.dificuldade = document.querySelector(".btn-dif.ativo").dataset.dif;

  document.getElementById("ecra-inicio").classList.remove("ativo");
  document.getElementById("ecra-jogo").classList.add("ativo");

  iniciarRonda();
}

// Prepara uma nova ronda
async function iniciarRonda() {
  limparDisplay();

  // Escolhe o max de pokémon consoante a dificuldade
  let max = 151;
  if (estadoJogo.dificuldade === "medio") max = 251;
  if (estadoJogo.dificuldade === "dificil") max = 898;

  const pokemon = await obterPokemonAleatorio(max);
  estadoJogo.pokemonAtual = pokemon;

  // Atualiza HUD
  document.getElementById("hud-modo").textContent = estadoJogo.modo;
  document.getElementById("hud-pontos").textContent = estadoJogo.pontos;
  document.getElementById("num-ronda").textContent = estadoJogo.ronda;
  document.getElementById("hud-streak").textContent = "🔥 " + estadoJogo.streak;

  // Inicia o modo correto
  const dados = { pokemon: pokemon, especie: null };

  if (estadoJogo.modo === "silhueta") {
    mostrarSilhueta(pokemon.id);
    mostrarInput();
    adicionarPista(pokemon.name.replace(/-/g, "").length + " letras");
  } else if (estadoJogo.modo === "estatisticas") {
    mostrarEstatisticas(pokemon.stats);
    mostrarInput();
  } else if (estadoJogo.modo === "tipogen") {
    const tipos = pokemon.types.map((t) => t.type.name);
    mostrarTipoGen(tipos, "?");
    mostrarOpcoes(_gerarOpcoes(pokemon.name), function (escolha) {
      _verificarOpcao(escolha);
    });
  } else if (estadoJogo.modo === "evolucao") {
    mostrarSilhueta(pokemon.id);
    mostrarInput();
  }

  // Inicia o timer
  const tempo =
    estadoJogo.dificuldade === "facil"
      ? 60
      : estadoJogo.dificuldade === "medio"
        ? 45
        : 25;
  iniciarTimer(tempo, perderVida);
}

// Gera opções para escolha múltipla
function _gerarOpcoes(nomeCorreto) {
  const max =
    estadoJogo.dificuldade === "facil"
      ? 151
      : estadoJogo.dificuldade === "medio"
        ? 251
        : 898;
  const opcoes = [nomeCorreto];
  while (opcoes.length < 4) {
    const id = Math.floor(Math.random() * max) + 1;
    const nome = "pokemon-" + id;
    if (!opcoes.includes(nome)) opcoes.push(nome);
  }
  opcoes.sort(() => Math.random() - 0.5);
  return opcoes;
}

// Verifica a opção escolhida
function _verificarOpcao(escolha) {
  const certo = escolha === estadoJogo.pokemonAtual.name;
  destacarOpcao(escolha, certo);
  if (!certo) destacarOpcao(estadoJogo.pokemonAtual.name, true);
  desativarResposta();
  if (certo) {
    mostrarFeedback(
      "✅ " + formatarNome(estadoJogo.pokemonAtual.name) + "!",
      "certo",
    );
    respostaCorreta();
  } else {
    mostrarFeedback(
      "❌ Era " + formatarNome(estadoJogo.pokemonAtual.name),
      "errado",
    );
    respostaErrada();
  }
}

// Valida a resposta do jogador
function submeterResposta() {
  if (!estadoJogo.jogoAtivo) return;
  if (estadoJogo.modo === "tipogen") return;

  const resposta = document.getElementById("input-resposta").value.trim();
  if (!resposta) return;

  document.getElementById("input-resposta").value = "";

  const nomeCorreto = estadoJogo.pokemonAtual.name;

  if (nomesIguais(resposta, nomeCorreto)) {
    revelarPokemon(estadoJogo.pokemonAtual.id);
    mostrarFeedback("✅ " + formatarNome(nomeCorreto) + "!", "certo");
    desativarResposta();
    setTimeout(() => respostaCorreta(), 1500);
  } else {
    tremerInput();
    mostrarFeedback("❌ Errado!", "errado");
    respostaErrada();
  }
}

// Mostra uma pista ao jogador
function pedirPista() {
  if (!estadoJogo.jogoAtivo) return;

  const pokemon = estadoJogo.pokemonAtual;
  const pistasUsadas = estadoJogo.pistasUsadas || 0;

  if (estadoJogo.modo === "silhueta") {
    if (pistasUsadas === 0) {
      adicionarPista("Começa por: " + pokemon.name[0].toUpperCase());
    } else if (pistasUsadas === 1) {
      adicionarPista(
        "Tipo: " + pokemon.types.map((t) => t.type.name).join(", "),
      );
    } else {
      mostrarToast("Sem mais pistas!");
      return;
    }
  } else if (estadoJogo.modo === "estatisticas") {
    if (pistasUsadas === 0) {
      adicionarPista(
        "Tipo: " + pokemon.types.map((t) => t.type.name).join(", "),
      );
    } else {
      mostrarToast("Sem mais pistas!");
      return;
    }
  } else {
    mostrarToast("Sem mais pistas neste modo!");
    return;
  }

  estadoJogo.pistasUsadas = pistasUsadas + 1;
}

// Trata uma resposta correta
function respostaCorreta() {
  estadoJogo.pontos += calcularPontos();
  estadoJogo.streak++;
  estadoJogo.ronda++;
  estadoJogo.pistasUsadas = 0;

  pararTimer();
  setTimeout(() => iniciarRonda(), 1500);
}

// Trata uma resposta errada
function respostaErrada() {
  perderVida();
}

// Remove uma vida ao jogador
function perderVida() {
  estadoJogo.vidas--;
  estadoJogo.streak = 0;
  estadoJogo.pistasUsadas = 0;

  atualizarVidas();

  if (estadoJogo.vidas <= 0) {
    terminarJogo();
    return;
  }

  estadoJogo.ronda++;
  pararTimer();
  setTimeout(() => iniciarRonda(), 1500);
}

// Calcula os pontos da ronda
function calcularPontos() {
  const pistasUsadas = estadoJogo.pistasUsadas || 0;
  const tempo =
    estadoJogo.dificuldade === "facil"
      ? 60
      : estadoJogo.dificuldade === "medio"
        ? 45
        : 25;
  const mult = Math.min(1 + estadoJogo.streak * 0.1, 2.0);
  const pts =
    (100 - 15 * pistasUsadas) * (estadoJogo.tempoRestante / tempo) * mult;
  return Math.max(10, Math.round(pts));
}

// Atualiza a visualização das vidas
function atualizarVidas() {
  const vidas = document.querySelectorAll(".vida");
  vidas.forEach((v, i) => {
    if (i >= estadoJogo.vidas) v.classList.add("perdida");
    else v.classList.remove("perdida");
  });
}

// Termina o jogo
function terminarJogo() {
  pararTimer();
  estadoJogo.jogoAtivo = false;

  // Guarda no histórico
  guardarHistorico();

  document.getElementById("ecra-jogo").classList.remove("ativo");
  document.getElementById("ecra-fim").classList.add("ativo");

  document.getElementById("fim-pontos").textContent = estadoJogo.pontos;
  document.getElementById("fim-acertos").textContent = estadoJogo.acertos || 0;
  document.getElementById("fim-rondas").textContent = estadoJogo.ronda - 1;
  document.getElementById("fim-streak").textContent =
    estadoJogo.maiorStreak || estadoJogo.streak;
}

// Guarda a partida no histórico
function guardarHistorico() {
  const historico = JSON.parse(
    localStorage.getItem("pokeguess_historico") || "[]",
  );
  historico.unshift({
    modo: estadoJogo.modo,
    dificuldade: estadoJogo.dificuldade,
    pontos: estadoJogo.pontos,
    acertos: estadoJogo.acertos || 0,
    maiorStreak: estadoJogo.maiorStreak || estadoJogo.streak,
    inicio: new Date().toISOString(),
  });
  localStorage.setItem("pokeguess_historico", JSON.stringify(historico));
}

// Compara dois nomes de Pokémon
function nomesIguais(a, b) {
  const norm = (s) => s.toLowerCase().replace(/[-\s]/g, "");
  return norm(a) === norm(b);
}

// Formata o nome para apresentação
function formatarNome(nome) {
  return nome
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

// Obtém a imagem oficial do Pokémon
function getImagem(id) {
  return (
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
    id +
    ".png"
  );
}
