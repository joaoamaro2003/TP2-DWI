var stats = {
  pokemon: null,
  especie: null,
  callback: null,

  iniciar: function (dados, callback) {
    this.pokemon = dados.pokemon;
    this.especie = dados.especie;
    this.callback = callback;

    limparDisplay();
    mostrarEstatisticas(this.pokemon.stats);
    mostrarInput();
  },

  pista: function () {
    var usadas = getPistas();

    if (usadas === 0) {
      usarPista();
      var tipos = this.pokemon.types.map(function (t) {
        return t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1);
      });
      adicionarPista("Tipo(s): " + tipos.join(", "));
      return true;
    }

    if (usadas === 1) {
      usarPista();
      adicionarPista(
        "Geração: " + getNumeroGeracao(this.especie.generation.name),
      );
      return true;
    }

    mostrarToast("Sem mais pistas!");
    return false;
  },

  verificar: function (resposta) {
    var certo = nomesIguais(resposta, this.pokemon.name);

    if (certo) {
      mostrarFeedback("✅ " + formatarNome(this.pokemon.name) + "!", "certo");
    } else {
      tremerInput();
      mostrarFeedback("❌ Errado!", "errado");
    }

    desativarResposta();
    this.callback(certo);
    return certo;
  },
};
