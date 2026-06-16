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

    // Extrai tipos do Pokémon (ex: fire, water)
    var tipos = this.pokemon.types.map(function (t) {
      return t.type.name;
    });

    // Converte geração para número legível
    var gen = getNumeroGeracao(this.especie.generation.name);

    // Limpa o ecrã antes de renderizar o modo
    limparDisplay();

    // Mostra informação de tipo e geração
    mostrarTipoGen(tipos, gen);

    // Gera opções de resposta
    var opcoes = this._gerarOpcoes();

    var self = this;

    // Mostra botões de escolha múltipla
    mostrarOpcoes(opcoes, function (escolha) {
      self._escolher(escolha);
    });
  },

  _gerarOpcoes: function () {
    var correto = this.pokemon.name;
    var candidatos = [];

    // Cria lista de nomes possíveis (menos o correto)
    for (var i = 0; i < this.pool.length; i++) {
      if (this.pool[i].name !== correto) {
        candidatos.push(this.pool[i].name);
      }
    }

    // Embaralha candidatos
    candidatos.sort(function () {
      return Math.random() - 0.5;
    });

    // Escolhe 3 errados + 1 correto
    var opcoes = [correto, candidatos[0], candidatos[1], candidatos[2]];

    // Mistura ordem final das opções
    opcoes.sort(function () {
      return Math.random() - 0.5;
    });

    return opcoes;
  },

  _escolher: function (nome) {
    // Verifica se a escolha está correta
    var certo = nomesIguais(nome, this.pokemon.name);

    // Destaca opção escolhida
    destacarOpcao(nome, certo);

    // Mostra a correta se errar
    if (!certo) destacarOpcao(this.pokemon.name, true);

    // Bloqueia respostas após escolha
    desativarResposta();

    // Feedback visual
    if (certo) {
      mostrarFeedback("✅ " + formatarNome(this.pokemon.name) + "!", "certo");
    } else {
      mostrarFeedback("❌ Era " + formatarNome(this.pokemon.name), "errado");
    }

    // Envia resultado ao motor do jogo
    this.callback(certo);
  },

  pista: function () {
    // Neste modo não existem pistas
    mostrarToast("Neste modo escolhe uma das opções!");
    return false;
  },

  verificar: function () {
    // Não usado neste modo (é múltipla escolha)
    return false;
  },
};
