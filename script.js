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
  const g = 9.81;

  const grafico = new Chart(document.getElementById("grafico"), {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: "Velocidade (m/s)", data: [], borderColor: "#3a86ff", borderWidth: 2, tension: 0.3, pointRadius: 0 },
        { label: "Força Centrípeta (N)", data: [], borderColor: "#ffbe0b", borderWidth: 2, tension: 0.3, pointRadius: 0 },
        { label: "Aceleração (m/s²)", data: [], borderColor: "#fb5607", borderWidth: 2, tension: 0.3, pointRadius: 0 }
      ]
    },
    options: { animation: false, responsive: true,
      scales: {
        x: { title: { display: true, text: "Tempo (s)" }},
        y: { title: { display: true, text: "Valores" }, beginAtZero: true }
      }
    }
  });

  function iniciar() {

    cancelAnimationFrame(animacao);
    grafico.data.labels = [];
    grafico.data.datasets.forEach(ds => ds.data = []);
    let tempo = 0;

    const m = parseFloat(massa.value);
    const muVal = parseFloat(mu.value);
    const r = parseFloat(raio.value);
    const ang = parseFloat(angulo.value) * Math.PI / 180;
    let v = parseFloat(velocidade.value);

    const vMax = Math.sqrt(r * g * (Math.tan(ang) + muVal) / (1 - muVal * Math.tan(ang)));
    vmax.innerText = "Velocidade Máxima: " + vMax.toFixed(2) + " m/s";

    let theta = 0; // posição angular

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      desenharPista(r, ang);
      desenharCarro(r, theta, ang, v, vMax);
      desenharVetores(m, v, r, theta, ang);

      // Atualiza status
      if (v > vMax) {
        status.innerText = "🚨 Derrapou!";
        status.style.color = "red";
      } else {
        status.innerText = "✅ Estável";
        status.style.color = "lime";
      }

      // Atualiza gráfico
      grafico.data.labels.push(tempo.toFixed(2));
      grafico.data.datasets[0].data.push(v);
      grafico.data.datasets[1].data.push(m * v*v / r);
      grafico.data.datasets[2].data.push(v*v / r);
      if (grafico.data.labels.length > 200) {
        grafico.data.labels.shift();
        grafico.data.datasets.forEach(ds => ds.data.shift());
      }
      grafico.update();

      // Física: calcula deslocamento angular
      theta += v / r * 0.016;
      tempo += 0.016;

      animacao = requestAnimationFrame(loop);
    }

    loop();
  }

  function desenharPista(r, ang) {
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2 + 50);
    ctx.rotate(-ang); // inclinação visual

    ctx.beginPath();
    ctx.arc(0, 0, r*10, 0, 2*Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#444";
    ctx.stroke();

    ctx.restore();
  }

  function desenharCarro(r, theta, ang, v, vMax) {
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2 + 50);
    ctx.rotate(-ang);
    const x = r*10 * Math.cos(theta);
    const y = r*10 * Math.sin(theta);
    ctx.fillStyle = v > vMax ? "red" : "lime";
    ctx.fillRect(x-20, y-10, 40, 20);

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(v.toFixed(2) + " m/s", x-20, y-15);

    ctx.restore();
  }

  function desenharVetores(m, v, r, theta, ang) {
    const Fc = m * v*v / r;
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2 + 50);
    ctx.rotate(-ang);

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Fc/50, 0);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.font = "16px Arial";
    ctx.fillText("Fc", Fc/50 + 5, 5);

    ctx.restore();
  }

  iniciarBtn.addEventListener("click", iniciar);

});



