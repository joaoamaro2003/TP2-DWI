var silhouette = {
  pokemon: null,
  especie: null,
  callback: null,

  iniciar: function (dados, callback) {
    this.pokemon = dados.pokemon;
    this.especie = dados.especie;
    this.callback = callback;

    // Limpa o ecrã antes de iniciar o modo
    limparDisplay();

    // Mostra o Pokémon em modo silhueta
    mostrarSilhueta(this.pokemon.id);

    // Mostra input para resposta
    mostrarInput();

    // Primeira pista: número de letras do nome
    var numLetras = this.pokemon.name.replace(/-/g, "").length;
    adicionarPista(numLetras + " letras");
  },

  pista: function () {
    var usadas = getPistas();

    // Primeira pista extra: inicial do nome
    if (usadas === 0) {
      usarPista();
      adicionarPista("Começa por: " + this.pokemon.name[0].toUpperCase());
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

    // Sem pistas disponíveis
    mostrarToast("Sem mais pistas!");
    return false;
  },

  verificar: function (resposta) {
    // Verifica se a resposta está correta
    var certo = nomesIguais(resposta, this.pokemon.name);

    if (certo) {
      // Revela o Pokémon se acertou
      revelarPokemon(this.pokemon.id);
      mostrarFeedback("✅ " + formatarNome(this.pokemon.name) + "!", "certo");
    } else {
      // Feedback de erro
      tremerInput();
      mostrarFeedback("❌ Errado!", "errado");
    }

    // Bloqueia input depois da resposta
    desativarResposta();

    // Envia resultado para o motor do jogo
    this.callback(certo);

    return certo;
  },
};
