var typeGen = {
  pokemon: null,
  especie: null,
  pool: null,
  callback: null,

  iniciar: function (dados, pool, callback) {
    this.pokemon = dados.pokemon;
    this.especie = dados.especie;
    this.pool = pool;
    this.callback = callback;

    var tipos = this.pokemon.types.map(function (t) {
      return t.type.name;
    });
    var gen = getNumeroGeracao(this.especie.generation.name);

    limparDisplay();
    mostrarTipoGen(tipos, gen);

    var opcoes = this._gerarOpcoes();
    var self = this;
    mostrarOpcoes(opcoes, function (escolha) {
      self._escolher(escolha);
    });
  },

  _gerarOpcoes: function () {
    var correto = this.pokemon.name;
    var candidatos = [];
    for (var i = 0; i < this.pool.length; i++) {
      if (this.pool[i].name !== correto) {
        candidatos.push(this.pool[i].name);
      }
    }
    candidatos.sort(function () {
      return Math.random() - 0.5;
    });
    var opcoes = [correto, candidatos[0], candidatos[1], candidatos[2]];
    opcoes.sort(function () {
      return Math.random() - 0.5;
    });
    return opcoes;
  },

  _escolher: function (nome) {
    var certo = nomesIguais(nome, this.pokemon.name);
    destacarOpcao(nome, certo);
    if (!certo) destacarOpcao(this.pokemon.name, true);
    desativarResposta();
    if (certo) {
      mostrarFeedback("✅ " + formatarNome(this.pokemon.name) + "!", "certo");
    } else {
      mostrarFeedback("❌ Era " + formatarNome(this.pokemon.name), "errado");
    }
    this.callback(certo);
  },

  pista: function () {
    mostrarToast("Neste modo escolhe uma das opções!");
    return false;
  },

  verificar: function () {
    return false;
  },
};
