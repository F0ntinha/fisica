const g = 9.8;

const simCanvas = document.getElementById("simCanvas");
const ctx = simCanvas.getContext("2d");

const graphCanvas = document.getElementById("graphCanvas");
const gctx = graphCanvas.getContext("2d");

let sliders = ["massa","mu","raio","angulo","vel"];

sliders.forEach(id=>{
    document.getElementById(id).addEventListener("input",updateLabels);
});

function updateLabels(){
    sliders.forEach(id=>{
        document.getElementById(id+"Val").innerText =
        document.getElementById(id).value;
    });
}
updateLabels();

let animation;
let progress = 0;
let graphData = [];

function calcularVmax(R, mu, theta){

let num = R * g * (Math.sin(theta) + mu * Math.cos(theta));
let den = (Math.cos(theta) - mu * Math.sin(theta));

if(den <= 0) return 100; // evita divisão inválida

return Math.sqrt(num/den);
}

function startSimulation(){

cancelAnimationFrame(animation);
progress = 0;
graphData = [];

let m = parseFloat(massa.value);
let muVal = parseFloat(mu.value);
let R = parseFloat(raio.value);
let theta = parseFloat(angulo.value) * Math.PI/180;
let v = parseFloat(vel.value);

let vmax = calcularVmax(R, muVal, theta);
let derrapa = v > vmax;

infoBox.innerHTML =
"Velocidade Máxima Teórica: " + vmax.toFixed(2) + " m/s<br>" +
(derrapa ? "❌ Derrapa" : "✅ Completa a curva");

function animate(){

ctx.clearRect(0,0,simCanvas.width,simCanvas.height);
drawGround();

let scale = 20;
let cx = simCanvas.width/2;
let cy = simCanvas.height - 80;

drawTrack(R,theta,cx,cy,scale);

if(progress <= Math.PI/2){

let x = cx + Math.cos(progress)*R*scale;
let y = cy - Math.sin(progress)*R*scale*Math.cos(theta);

if(derrapa && progress > Math.PI/3){
    x += progress*40;
}

drawCar(x,y,progress);

progress += v/(R*60);

// atualizar gráfico em tempo real
graphData.push({x: progress, y: v});
drawGraphLive();

}else{
cancelAnimationFrame(animation);
}

animation = requestAnimationFrame(animate);
}

animate();
}

function drawGround(){
ctx.fillStyle="#2e2e2e";
ctx.fillRect(0,simCanvas.height-120,simCanvas.width,120);
}

function drawTrack(R,theta,cx,cy,scale){

ctx.save();
ctx.translate(cx,cy);
ctx.rotate(-theta);

ctx.beginPath();
ctx.arc(0,0,R*scale,Math.PI,Math.PI*1.5);
ctx.strokeStyle="#aaaaaa";
ctx.lineWidth=14;
ctx.stroke();

ctx.restore();
}

function drawCar(x,y,angle){

ctx.save();
ctx.translate(x,y);
ctx.rotate(-angle);

ctx.fillStyle="#e10600";
ctx.fillRect(-30,-12,60,24);

ctx.fillStyle="black";
ctx.fillRect(-25,-18,15,8);
ctx.fillRect(10,-18,15,8);
ctx.fillRect(-25,10,15,8);
ctx.fillRect(10,10,15,8);

ctx.restore();
}

function drawGraphLive(){

gctx.clearRect(0,0,graphCanvas.width,graphCanvas.height);

gctx.beginPath();
gctx.moveTo(40,160);

graphData.forEach(point=>{
    let x = 40 + point.x * 100;
    let y = 160 - point.y * 4;
    gctx.lineTo(x,y);
});

gctx.strokeStyle="cyan";
gctx.lineWidth=2;
gctx.stroke();

gctx.fillStyle="white";
gctx.fillText("Velocidade durante a curva",10,20);
gctx.fillText("Progresso",300,190);
gctx.fillText("Velocidade",5,100);
}

startBtn.addEventListener("click",startSimulation);
