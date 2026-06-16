var stats = {
  pokemon: null,
  especie: null,
  callback: null,

  iniciar: function (dados, callback) {
    this.pokemon = dados.pokemon;
    this.especie = dados.especie;
    this.callback = callback;

    // Limpa o ecrã antes de mostrar o modo
    limparDisplay();

    // Mostra as estatísticas do Pokémon (HP, ATK, DEF, etc.)
    mostrarEstatisticas(this.pokemon.stats);

    // Mostra o input para resposta
    mostrarInput();
  },

  pista: function () {
    var usadas = getPistas();

    // Primeira pista: tipos do Pokémon
    if (usadas === 0) {
      usarPista();

      var tipos = this.pokemon.types.map(function (t) {
        return t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1);
      });

      adicionarPista("Tipo(s): " + tipos.join(", "));
      return true;
    }

    // Segunda pista: geração do Pokémon
    if (usadas === 1) {
      usarPista();
      adicionarPista(
        "Geração: " + getNumeroGeracao(this.especie.generation.name),
      );
      return true;
    }

    // Sem mais pistas disponíveis
    mostrarToast("Sem mais pistas!");
    return false;
  },

  verificar: function (resposta) {
    // Verifica se a resposta está correta
    var certo = nomesIguais(resposta, this.pokemon.name);

    if (certo) {
      // Feedback de acerto
      mostrarFeedback("✅ " + formatarNome(this.pokemon.name) + "!", "certo");
    } else {
      // Feedback de erro
      tremerInput();
      mostrarFeedback("❌ Errado!", "errado");
    }

    // Bloqueia input depois da resposta
    desativarResposta();

    // Envia resultado para o jogo principal
    this.callback(certo);

    return certo;
  },
};
