document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("simulacao");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth - 300;
  canvas.height = window.innerHeight * 0.65;

  const massa = document.getElementById("massa");
  const mu = document.getElementById("mu");
  const raio = document.getElementById("raio");
  const angulo = document.getElementById("angulo");
  const velocidade = document.getElementById("velocidade");
  const vmax = document.getElementById("vmax");
  const status = document.getElementById("status");
  const iniciarBtn = document.getElementById("iniciarBtn");

  let animacao;
  let tempo = 0;
  const g = 9.81;

  const grafico = new Chart(document.getElementById("grafico"), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: "Velocidade (m/s)",
        data: [],
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      animation: false,
      scales: {
        x: { title: { display: true, text: "Tempo (s)" }},
        y: { title: { display: true, text: "Velocidade (m/s)" }, beginAtZero: true }
      }
    }
  });

  function iniciar() {

    cancelAnimationFrame(animacao);
    grafico.data.labels = [];
    grafico.data.datasets[0].data = [];
    tempo = 0;

    const m = parseFloat(massa.value);
    const muVal = parseFloat(mu.value);
    const r = parseFloat(raio.value);
    const ang = parseFloat(angulo.value) * Math.PI / 180;
    let v = parseFloat(velocidade.value);

    // Velocidade máxima com atrito na curva
    const vMax = Math.sqrt(r * g * (Math.tan(ang) + muVal) / (1 - muVal * Math.tan(ang)));
    vmax.innerText = "Velocidade Máxima: " + vMax.toFixed(2) + " m/s";

    // Posição angular do carro na pista
    let theta = 0;

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      desenharPista(r);
      desenharCarro(r, theta);
      desenharVetores(m, v, r);

      // Status
      if (v > vMax) {
        status.innerText = "🚨 Derrapou!";
        status.style.color = "red";
      } else {
        status.innerText = "✅ Estável";
        status.style.color = "lime";
      }

      // Atualiza gráfico
      tempo += 0.016;
      grafico.data.labels.push(tempo.toFixed(2));
      grafico.data.datasets[0].data.push(v);
      if (grafico.data.labels.length > 200) {
        grafico.data.labels.shift();
        grafico.data.datasets[0].data.shift();
      }
      grafico.update();

      // Atualiza posição angular com velocidade
      theta += v / r * 0.016;

      animacao = requestAnimationFrame(loop);
    }

    loop();
  }

  function desenharPista(r) {
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2 + 50);

    ctx.beginPath();
    ctx.arc(0, 0, r*10, 0, 2*Math.PI); // escala x10 para caber no canvas
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#444";
    ctx.stroke();

    ctx.restore();
  }

  function desenharCarro(r, theta) {
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2 + 50);
    const x = r*10 * Math.cos(theta);
    const y = r*10 * Math.sin(theta);
    ctx.fillStyle = "red";
    ctx.fillRect(x - 20, y - 10, 40, 20);
    ctx.restore();
  }

  function desenharVetores(m, v, r) {
    const Fc = m * v*v / r;
    ctx.save();
    ctx.fillStyle = "yellow";
    ctx.font = "16px Arial";
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(100 + Fc/10, 100);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.fillText("Força Centrípeta", 100, 90);
    ctx.restore();
  }

  iniciarBtn.addEventListener("click", iniciar);

});

