var silhouette = {
  pokemon: null,
  especie: null,
  callback: null,

  iniciar: function (dados, callback) {
    this.pokemon = dados.pokemon;
    this.especie = dados.especie;
    this.callback = callback;

    limparDisplay();
    mostrarSilhueta(this.pokemon.id);
    mostrarInput();

    var numLetras = this.pokemon.name.replace(/-/g, "").length;
    adicionarPista(numLetras + " letras");
  },

  pista: function () {
    var usadas = getPistas();

    if (usadas === 0) {
      usarPista();
      adicionarPista("Começa por: " + this.pokemon.name[0].toUpperCase());
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
      revelarPokemon(this.pokemon.id);
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
