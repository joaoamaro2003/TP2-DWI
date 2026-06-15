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

    var evoUrl = this.especie.evolution_chain.url;

    getCadeiaEvolucao(evoUrl)
      .then(function (evoData) {
        self.nomesCadeia = aplanarCadeia(evoData.chain);
        var idx = self.nomesCadeia.indexOf(self.pokemon.name);

        var temAnterior = idx > 0;
        var temSeguinte = idx < self.nomesCadeia.length - 1;

        if (!temAnterior && !temSeguinte) {
          throw new Error("Sem evoluções");
        }

        var direcao;
        if (temAnterior && temSeguinte) {
          direcao = Math.random() < 0.5 ? "anterior" : "seguinte";
        } else {
          direcao = temAnterior ? "anterior" : "seguinte";
        }

        self.indiceAlvo = direcao === "anterior" ? idx - 1 : idx + 1;

        var promessas = [];
        for (var i = 0; i < self.nomesCadeia.length; i++) {
          promessas.push(getPokemon(self.nomesCadeia[i]));
        }

        return Promise.all(promessas).then(function (resultados) {
          for (var i = 0; i < self.nomesCadeia.length; i++) {
            self.cacheIds[self.nomesCadeia[i]] = resultados[i].id;
          }
          return direcao;
        });
      })
      .then(function (direcao) {
        limparDisplay();
        var wrap = mostrarCadeia(self.nomesCadeia, self.indiceAlvo);
        self._preencherImagens(wrap);
        adicionarPista(
          "Qual é a forma " +
            direcao +
            " de " +
            formatarNome(self.pokemon.name) +
            "?",
        );
        mostrarInput();
      })
      .catch(function (err) {
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
      img.src = getImagem(id);
      if (i === this.indiceAlvo) {
        img.style.filter = "grayscale(100%) contrast(1000%) brightness(0%)";
      }
    }
  },

  pista: function () {
    var usadas = getPistas();
    var alvo = this.nomesCadeia[this.indiceAlvo];

    if (usadas === 0) {
      usarPista();
      adicionarPista("Começa por: " + alvo[0].toUpperCase());
      return true;
    }

    if (usadas === 1) {
      usarPista();
      adicionarPista(alvo.replace(/-/g, " ").length + " letras");
      return true;
    }

    mostrarToast("Sem mais pistas!");
    return false;
  },

  verificar: function (resposta) {
    var alvo = this.nomesCadeia[this.indiceAlvo];
    var certo = nomesIguais(resposta, alvo);

    var mons = document.querySelectorAll(".mon");
    for (var i = 0; i < mons.length; i++) {
      if (i === this.indiceAlvo) {
        var img = mons[i].querySelector("img");
        if (img) img.style.filter = "none";
        var nomeEl = mons[i].querySelector(".nome-mon");
        if (nomeEl) nomeEl.textContent = formatarNome(alvo);
        mons[i].classList.remove("misterio");
      }
    }

    if (certo) {
      mostrarFeedback("✅ " + formatarNome(alvo) + "!", "certo");
    } else {
      tremerInput();
      mostrarFeedback("❌ Era " + formatarNome(alvo), "errado");
    }

    desativarResposta();
    this.callback(certo);
    return certo;
  },
};
