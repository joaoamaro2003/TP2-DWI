/* timer.js */

let intervaloTimer = null;

// Inicia o temporizador
function iniciarTimer(segundos, aoTerminar) {
  // Define o tempo inicial
  estadoJogo.tempoRestante = segundos;

  // Atualiza o texto no ecrã
  atualizarTempo();

  // Cria o intervalo que decrementa o tempo a cada segundo
  intervaloTimer = setInterval(() => {
    estadoJogo.tempoRestante--;

    // Atualiza o HUD do tempo
    atualizarTempo();

    // Quando chega a zero, para o timer e executa callback
    if (estadoJogo.tempoRestante <= 0) {
      pararTimer();
      aoTerminar();
    }
  }, 1000);
}

// Para o temporizador
function pararTimer() {
  clearInterval(intervaloTimer);
}

// Atualiza o valor do tempo no HTML
function atualizarTempo() {
  const el = document.getElementById("tempo-texto");
  if (el) el.textContent = estadoJogo.tempoRestante;
}
