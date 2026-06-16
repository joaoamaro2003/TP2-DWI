var evolution = {
  pokemon: null,
  especie: null,
  callback: null,
  nomesCadeia: null,
  indiceAlvo: null,
  cacheIds: {},

  iniciar: function (dados, callback) {
    this.pokemon = dados.pokemon;
    this.especie = dados.especie;
    this.callback = callback;

    var self = this;

    // URL da cadeia de evolução vinda da API
    var evoUrl = this.especie.evolution_chain.url;

    // Vai buscar toda a cadeia de evolução
    getCadeiaEvolucao(evoUrl)
      .then(function (evoData) {
        // Achata a estrutura da cadeia para um array simples de nomes
        self.nomesCadeia = aplanarCadeia(evoData.chain);

        // Encontra a posição do Pokémon atual na cadeia
        var idx = self.nomesCadeia.indexOf(self.pokemon.name);

        var temAnterior = idx > 0;
        var temSeguinte = idx < self.nomesCadeia.length - 1;

        // Se não tiver evoluções possíveis, erro
        if (!temAnterior && !temSeguinte) {
          throw new Error("Sem evoluções");
        }

        // Escolhe aleatoriamente se vai pedir evolução anterior ou seguinte
        var direcao;
        if (temAnterior && temSeguinte) {
          direcao = Math.random() < 0.5 ? "anterior" : "seguinte";
        } else {
          direcao = temAnterior ? "anterior" : "seguinte";
        }

        // Define o índice da evolução alvo
        self.indiceAlvo = direcao === "anterior" ? idx - 1 : idx + 1;

        var promessas = [];

        // Vai buscar dados de todos os Pokémon da cadeia
        for (var i = 0; i < self.nomesCadeia.length; i++) {
          promessas.push(getPokemon(self.nomesCadeia[i]));
        }

        // Resolve todas as promessas em paralelo
        return Promise.all(promessas).then(function (resultados) {
          // Guarda os IDs dos Pokémon no cache
          for (var i = 0; i < self.nomesCadeia.length; i++) {
            self.cacheIds[self.nomesCadeia[i]] = resultados[i].id;
          }
          return direcao;
        });
      })
      .then(function (direcao) {
        // Limpa o ecrã antes de mostrar novo conteúdo
        limparDisplay();

        // Mostra a cadeia de evolução no UI
        var wrap = mostrarCadeia(self.nomesCadeia, self.indiceAlvo);

        // Preenche imagens dos Pokémon
        self._preencherImagens(wrap);

        // Mostra pista ao utilizador
        adicionarPista(
          "Qual é a forma " +
            direcao +
            " de " +
            formatarNome(self.pokemon.name) +
            "?",
        );

        // Mostra input para resposta
        mostrarInput();
      })
      .catch(function (err) {
        // Se algo falhar na evolução
        console.log("Erro evolucao:", err);
        self.callback("erro");
      });
  },

  _preencherImagens: function (wrap) {
    var mons = wrap.querySelectorAll(".mon");

    for (var i = 0; i < mons.length; i++) {
      var nome = mons[i].dataset.nome;
      var id = this.cacheIds[nome];
      var img = mons[i].querySelector("img");

      if (!img || !id) continue;

      // Define imagem do Pokémon
      img.src = getImagem(id);

      // Esconde o Pokémon alvo (desafio)
      if (i === this.indiceAlvo) {
        img.style.filter = "grayscale(100%) contrast(1000%) brightness(0%)";
      }
    }
  },

  pista: function () {
    var usadas = getPistas();
    var alvo = this.nomesCadeia[this.indiceAlvo];

    // Primeira pista: inicial do nome
    if (usadas === 0) {
      usarPista();
      adicionarPista("Começa por: " + alvo[0].toUpperCase());
      return true;
    }

    // Segunda pista: número de letras
    if (usadas === 1) {
      usarPista();
      adicionarPista(alvo.replace(/-/g, " ").length + " letras");
      return true;
    }

    // Sem mais pistas disponíveis
    mostrarToast("Sem mais pistas!");
    return false;
  },

  verificar: function (resposta) {
    var alvo = this.nomesCadeia[this.indiceAlvo];
    var certo = nomesIguais(resposta, alvo);

    var mons = document.querySelectorAll(".mon");

    // Revela o Pokémon correto
    for (var i = 0; i < mons.length; i++) {
      if (i === this.indiceAlvo) {
        var img = mons[i].querySelector("img");
        if (img) img.style.filter = "none";

        var nomeEl = mons[i].querySelector(".nome-mon");
        if (nomeEl) nomeEl.textContent = formatarNome(alvo);

        mons[i].classList.remove("misterio");
      }
    }

    // Feedback visual
    if (certo) {
      mostrarFeedback("✅ " + formatarNome(alvo) + "!", "certo");
    } else {
      tremerInput();
      mostrarFeedback("❌ Era " + formatarNome(alvo), "errado");
    }

    // Bloqueia respostas
    desativarResposta();

    // Devolve resultado ao jogo principal
    this.callback(certo);

    return certo;
  },
};
