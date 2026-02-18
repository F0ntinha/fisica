const canvas = document.getElementById("simulacao");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 300;
canvas.height = window.innerHeight * 0.65;

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
  const mu = parseFloat(mu.value);
  const r = parseFloat(raio.value);
  const ang = parseFloat(angulo.value) * Math.PI / 180;
  let v = parseFloat(velocidade.value);

  const vMax = Math.sqrt(r * g * (Math.tan(ang) + mu) / (1 - mu * Math.tan(ang)));
  vmax.innerText = "Velocidade Máxima: " + vMax.toFixed(2) + " m/s";

  function loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharPista(ang);
    desenharCarro(v, r);
    desenharVetores(m, v, r);

    if (v > vMax) {
      status.innerText = "🚨 Derrapou!";
      status.style.color = "red";
    } else {
      status.innerText = "✅ Estável";
      status.style.color = "lime";
    }

    tempo += 0.016;
    grafico.data.labels.push(tempo.toFixed(2));
    grafico.data.datasets[0].data.push(v);
    if (grafico.data.labels.length > 200) {
      grafico.data.labels.shift();
      grafico.data.datasets[0].data.shift();
    }
    grafico.update();

    animacao = requestAnimationFrame(loop);
  }

  loop();
}

function desenharPista(angulo) {

  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2 + 50);
  ctx.rotate(-angulo);

  ctx.beginPath();
  ctx.arc(0, 0, 200, Math.PI/4, Math.PI);
  ctx.lineWidth = 40;
  ctx.strokeStyle = "#444";
  ctx.stroke();

  ctx.restore();
}

function desenharCarro(v, r) {

  const x = canvas.width/2 + 150 * Math.cos(tempo);
  const y = canvas.height/2 + 150 * Math.sin(tempo);

  ctx.fillStyle = "red";
  ctx.fillRect(x, y, 40, 20);
}

function desenharVetores(m, v, r) {

  const Fc = m * v*v / r;

  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(100 + Fc/50, 100);
  ctx.strokeStyle = "yellow";
  ctx.stroke();

  ctx.fillText("Força Centrípeta", 100, 90);
}
