/**
 * ui.js - Manipulação do DOM
 */

let timerToast = null;

function mostrarEcra(id) {
  const ecras = document.querySelectorAll(".ecra");
  ecras.forEach((e) => e.classList.remove("ativo"));
  document.getElementById("ecra-" + id).classList.add("ativo");
}

function mostrarLoading() {
  document.getElementById("loading").hidden = false;
}

function esconderLoading() {
  document.getElementById("loading").hidden = true;
}

function mostrarToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("visivel");
  if (timerToast) clearTimeout(timerToast);
  timerToast = setTimeout(() => el.classList.remove("visivel"), 2500);
}

function atualizarHUD() {
  document.getElementById("hud-modo").textContent = estadoJogo.modo;
  document.getElementById("hud-pontos").textContent = estadoJogo.pontos;
  document.getElementById("hud-streak").textContent = "🔥 " + estadoJogo.streak;
  document.getElementById("num-ronda").textContent = estadoJogo.ronda;

  const vidas = document.querySelectorAll(".vida");
  vidas.forEach((v, i) => {
    if (i >= estadoJogo.vidas) v.classList.add("perdida");
    else v.classList.remove("perdida");
  });
}

function atualizarTemporizador(seg, total) {
  document.getElementById("tempo-texto").textContent = seg;
  const caixa = document.getElementById("caixa-tempo");
  if (seg / total < 0.3) caixa.classList.add("perigo");
  else caixa.classList.remove("perigo");
}

function limparDisplay() {
  document.getElementById("display-pokemon").innerHTML = "";
  document.getElementById("area-pistas").innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";
}

function mostrarSilhueta(id) {
  const img = document.createElement("img");
  img.src = getImagem(id);
  img.alt = "Silhueta do Pokémon";
  img.className = "img-silhueta";
  document.getElementById("display-pokemon").appendChild(img);
  return img;
}

function revelarPokemon(id) {
  const img = document.querySelector(".img-silhueta");
  if (img) {
    img.src = getImagem(id);
    img.classList.add("revelado");
  }
}

function mostrarEstatisticas(stats) {
  const cores = {
    hp: "#ff5f5f",
    attack: "#f5a623",
    defense: "#4a90e2",
    "special-attack": "#b06fdb",
    "special-defense": "#3dd68c",
    speed: "#ffd740",
  };
  const labels = {
    hp: "HP",
    attack: "ATQ",
    defense: "DEF",
    "special-attack": "EATQ",
    "special-defense": "EDEF",
    speed: "VEL",
  };

  const grelha = document.createElement("div");
  grelha.className = "grelha-stats";

  stats.forEach((s) => {
    const key = s.stat.name;
    const val = s.base_stat;
    const pct = Math.round((val / 255) * 100);

    const item = document.createElement("div");
    item.className = "item-stat";
    item.innerHTML = `<label>${labels[key] || key}</label>
                      <strong>${val}</strong>
                      <div class="barra-fundo">
                        <div class="barra-fill" style="background:${cores[key] || "#ffd740"}" data-pct="${pct}"></div>
                      </div>`;
    grelha.appendChild(item);
  });

  document.getElementById("display-pokemon").appendChild(grelha);

  setTimeout(() => {
    grelha.querySelectorAll(".barra-fill").forEach((b) => {
      b.style.width = b.getAttribute("data-pct") + "%";
    });
  }, 50);
}

function mostrarTipoGen(tipos, geracao) {
  const div = document.createElement("div");
  div.className = "info-tipogen";

  const badges = document.createElement("div");
  badges.className = "badges";

  tipos.forEach((t) => {
    const b = document.createElement("span");
    b.className = "badge tipo-" + t;
    b.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    badges.appendChild(b);
  });

  const gen = document.createElement("p");
  gen.className = "label-gen";
  gen.textContent = "Geração " + geracao;

  div.appendChild(badges);
  div.appendChild(gen);
  document.getElementById("display-pokemon").appendChild(div);
}

function mostrarCadeia(nomes, indiceAlvo) {
  const cadeia = document.createElement("div");
  cadeia.className = "cadeia";

  nomes.forEach((nome, i) => {
    if (i > 0) {
      const seta = document.createElement("span");
      seta.className = "seta";
      seta.textContent = "→";
      cadeia.appendChild(seta);
    }

    const mon = document.createElement("div");
    mon.className = "mon";
    mon.dataset.nome = nome;
    if (i === indiceAlvo) mon.classList.add("misterio");

    const img = document.createElement("img");
    img.src = "";
    img.alt = i === indiceAlvo ? "???" : formatarNome(nome);
    mon.appendChild(img);

    const nomeEl = document.createElement("span");
    nomeEl.className = "nome-mon";
    nomeEl.textContent = i === indiceAlvo ? "???" : formatarNome(nome);
    mon.appendChild(nomeEl);

    cadeia.appendChild(mon);
  });

  document.getElementById("display-pokemon").appendChild(cadeia);
  return cadeia;
}

function adicionarPista(texto) {
  const chip = document.createElement("span");
  chip.className = "chip-pista";
  chip.textContent = texto;
  document.getElementById("area-pistas").appendChild(chip);
}

function mostrarInput() {
  document.getElementById("zona-input").hidden = false;
  document.getElementById("zona-opcoes").hidden = true;
  document.getElementById("input-resposta").value = "";
  document.getElementById("input-resposta").focus();
}

function mostrarOpcoes(opcoes, callback) {
  document.getElementById("zona-input").hidden = true;
  document.getElementById("zona-opcoes").hidden = false;

  const zona = document.getElementById("zona-opcoes");
  zona.innerHTML = "";

  opcoes.forEach((nome) => {
    const btn = document.createElement("button");
    btn.className = "btn-opcao";
    btn.textContent = formatarNome(nome);
    btn.dataset.nome = nome;
    btn.addEventListener("click", () => callback(nome));
    zona.appendChild(btn);
  });
}

function desativarResposta() {
  document.getElementById("input-resposta").disabled = true;
  document.getElementById("btn-adivinhar").disabled = true;
  document.getElementById("btn-pista").disabled = true;
  document.querySelectorAll(".btn-opcao").forEach((b) => (b.disabled = true));
}

function destacarOpcao(nome, certo) {
  document.querySelectorAll(".btn-opcao").forEach((btn) => {
    if (btn.dataset.nome === nome)
      btn.classList.add(certo ? "certo" : "errado");
  });
}

function tremerInput() {
  const inp = document.getElementById("input-resposta");
  inp.classList.remove("errado");
  void inp.offsetWidth;
  inp.classList.add("errado");
}

function mostrarFeedback(msg, tipo) {
  const el = document.getElementById("feedback");
  el.textContent = msg;
  el.className = "feedback " + tipo;
}

function mostrarFim() {
  document.getElementById("fim-pontos").textContent = estadoJogo.pontos;
  document.getElementById("fim-acertos").textContent = estadoJogo.acertos || 0;
  document.getElementById("fim-rondas").textContent = estadoJogo.ronda - 1;
  document.getElementById("fim-streak").textContent =
    estadoJogo.maiorStreak || 0;
  mostrarEcra("fim");
}

function renderizarHistorico() {
  const historico = JSON.parse(
    localStorage.getItem("pokeguess_historico") || "[]",
  );
  const lista = document.getElementById("lista-historico");
  const vazio = document.getElementById("historico-vazio");
  lista.innerHTML = "";

  if (historico.length === 0) {
    vazio.hidden = false;
    return;
  }
  vazio.hidden = true;

  historico.forEach((s) => {
    const data = new Date(s.inicio).toLocaleDateString("pt-PT");
    const item = document.createElement("div");
    item.className = "item-historico";
    item.innerHTML = `<div>
                        <strong>${s.modo} — ${s.dificuldade}</strong>
                        <small>${data} · ${s.acertos || 0} acertos · Streak: ${s.maiorStreak || 0}</small>
                      </div>
                      <span class="pontos">${s.pontos || 0} pts</span>`;
    lista.appendChild(item);
  });
}
