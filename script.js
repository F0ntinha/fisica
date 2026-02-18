const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const g = 9.8;
let angle = 0;
let animation;

function atualizarValores(){
    document.getElementById("massaVal").innerText = massa.value;
    document.getElementById("muVal").innerText = mu.value;
    document.getElementById("raioVal").innerText = raio.value;
    document.getElementById("anguloVal").innerText = angulo.value;
    document.getElementById("velVal").innerText = vel.value;
}

document.querySelectorAll("input").forEach(slider=>{
    slider.addEventListener("input", atualizarValores);
});

atualizarValores();

function desenharPista(R){
    ctx.beginPath();
    ctx.arc(300,250,R*20,0,Math.PI*2);
    ctx.strokeStyle="white";
    ctx.lineWidth=3;
    ctx.stroke();
}

function desenharCarro(R, derrapa){
    let x = 300 + Math.cos(angle)*R*20;
    let y = 250 + Math.sin(angle)*R*20;

    ctx.beginPath();
    ctx.arc(x,y,10,0,Math.PI*2);
    ctx.fillStyle = derrapa ? "red" : "lime";
    ctx.fill();

    // vetor centrípeto
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(300,250);
    ctx.strokeStyle="cyan";
    ctx.stroke();
}

function simular(){

    cancelAnimationFrame(animation);
    angle = 0;

    let m = parseFloat(massa.value);
    let muVal = parseFloat(mu.value);
    let R = parseFloat(raio.value);
    let theta = parseFloat(angulo.value) * Math.PI/180;
    let v = parseFloat(vel.value);

    let N = m * g * Math.cos(theta);
    let Fmax = muVal * N;
    let Fc = (m*v*v)/R;
    let vmax = Math.sqrt((muVal*N*R)/m);

    let derrapa = Fc > Fmax;

    infoBox.innerHTML = `
    Velocidade Máxima Teórica: ${vmax.toFixed(2)} m/s <br>
    ${derrapa ? "❌ Derrapa" : "✅ Estável"}
    `;

    function animar(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        desenharPista(R);
        desenharCarro(R, derrapa);

        if(!derrapa){
            angle += v/(R*20);
        }else{
            angle += v/(R*10);
        }

        animation = requestAnimationFrame(animar);
    }

    animar();
}

startBtn.addEventListener("click", simular);

