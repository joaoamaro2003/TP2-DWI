/* historico.js */

// Obtém o histórico guardado no localStorage
function obterHistorico() {
  const historico = localStorage.getItem("pokeguess_historico");

  // Se não existir histórico devolve um array vazio
  if (!historico) {
    return [];
  }

  // Converte JSON para objeto JavaScript
  return JSON.parse(historico);
}

// Guarda uma partida no histórico
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

  // Atualiza o localStorage
  localStorage.setItem("pokeguess_historico", JSON.stringify(historico));
}

// Mostra o histórico no ecrã
function mostrarHistorico() {
  const lista = document.getElementById("lista-historico");

  // Se não existir o elemento, sai
  if (!lista) {
    return;
  }

  const historico = obterHistorico();

  // Limpa a lista
  lista.innerHTML = "";

  // Se não houver dados
  if (historico.length === 0) {
    lista.innerHTML = "<p>Ainda não jogaste nenhuma partida.</p>";
    return;
  }

  // Mostra do mais recente para o mais antigo
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

// Exporta o histórico para CSV
function exportarCSV() {
  const historico = obterHistorico();

  // Se não houver partidas
  if (historico.length === 0) {
    alert("Não há partidas para exportar.");
    return;
  }

  // Cabeçalho CSV
  let csv = "Data,Modo,Dificuldade,Pontos,Rondas,Streak\n";

  // Adiciona cada linha
  historico.forEach((partida) => {
    csv += `${partida.data},${partida.modo},${partida.dificuldade},${partida.pontos},${partida.ronda},${partida.streak}\n`;
  });

  // Cria ficheiro CSV
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  // Cria link de download
  const link = document.createElement("a");

  link.href = url;
  link.download = "historico_pokeguess.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Limpa memória
  URL.revokeObjectURL(url);
}
