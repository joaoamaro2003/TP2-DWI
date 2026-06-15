let intervaloTimer = null;

function iniciarTimer(segundos, aoTerminar) {
  estadoJogo.tempoRestante = segundos;

  atualizarTempo();

  intervaloTimer = setInterval(() => {
    estadoJogo.tempoRestante--;

    atualizarTempo();

    if (estadoJogo.tempoRestante <= 0) {
      pararTimer();
      aoTerminar();
    }
  }, 1000);
}

function pararTimer() {
  clearInterval(intervaloTimer);
}

function atualizarTempo() {
  const el = document.getElementById("tempo-texto");
  if (el) el.textContent = estadoJogo.tempoRestante;
}
