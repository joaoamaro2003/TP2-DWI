function obterHistorico() {
  const historico = localStorage.getItem("pokeguess_historico");

  if (!historico) {
    return [];
  }

  return JSON.parse(historico);
}

function guardarPartida() {
  const historico = obterHistorico();

  historico.push({
    data: new Date().toLocaleString("pt-PT"),
    modo: estadoJogo.modo,
    dificuldade: estadoJogo.dificuldade,
    pontos: estadoJogo.pontos,
    ronda: estadoJogo.ronda,
    streak: estadoJogo.streak,
  });

  localStorage.setItem("pokeguess_historico", JSON.stringify(historico));
}

function mostrarHistorico() {
  const lista = document.getElementById("lista-historico");

  if (!lista) {
    return;
  }

  const historico = obterHistorico();

  lista.innerHTML = "";

  if (historico.length === 0) {
    lista.innerHTML = "<p>Ainda não jogaste nenhuma partida.</p>";
    return;
  }

  historico
    .slice()
    .reverse()
    .forEach((partida) => {
      lista.innerHTML += `
        <div class="item-historico">
          <p><strong>${partida.data}</strong></p>
          <p>Modo: ${partida.modo}</p>
          <p>Dificuldade: ${partida.dificuldade}</p>
          <p>Pontos: ${partida.pontos}</p>
          <p>Rondas: ${partida.ronda}</p>
          <p>Streak: ${partida.streak}</p>
        </div>
      `;
    });
}

function exportarCSV() {
  const historico = obterHistorico();

  if (historico.length === 0) {
    alert("Não há partidas para exportar.");
    return;
  }

  let csv = "Data,Modo,Dificuldade,Pontos,Rondas,Streak\n";

  historico.forEach((partida) => {
    csv += `${partida.data},${partida.modo},${partida.dificuldade},${partida.pontos},${partida.ronda},${partida.streak}\n`;
  });

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "historico_pokeguess.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
