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

function startSimulation(){

cancelAnimationFrame(animation);
progress = 0;

let m = parseFloat(massa.value);
let muVal = parseFloat(mu.value);
let R = parseFloat(raio.value);
let theta = parseFloat(angulo.value)*Math.PI/180;
let v = parseFloat(vel.value);

let N = m*g*Math.cos(theta);
let Fmax = muVal*N;
let Fc = (m*v*v)/R;
let vmax = Math.sqrt((muVal*N*R)/m);
let derrapa = Fc > Fmax;

infoBox.innerHTML =
"Velocidade Máxima: "+vmax.toFixed(2)+" m/s<br>"+
(derrapa?"❌ Derrapa":"✅ Completa a curva");

drawGraph(muVal,R,theta);

function animate(){

ctx.clearRect(0,0,simCanvas.width,simCanvas.height);

// fundo pista
drawGround();

// escala automática da pista
let scale = 20;
let centerX = simCanvas.width/2;
let centerY = simCanvas.height - 80;

drawTrack(R,theta,centerX,centerY,scale);

if(progress <= Math.PI/2){

let x = centerX + Math.cos(progress)*R*scale;
let y = centerY - Math.sin(progress)*R*scale*Math.cos(theta);

// derrapagem visível
if(derrapa && progress > Math.PI/3){
    x += progress*40;
}

drawCar(x,y,progress);

progress += v/(R*60);

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
ctx.lineWidth=12;
ctx.stroke();

ctx.restore();
}

function drawCar(x,y,angle){

ctx.save();
ctx.translate(x,y);
ctx.rotate(-angle);

ctx.fillStyle="#e10600"; // vermelho F1
ctx.fillRect(-30,-12,60,24);

// rodas
ctx.fillStyle="black";
ctx.fillRect(-25,-18,15,8);
ctx.fillRect(10,-18,15,8);
ctx.fillRect(-25,10,15,8);
ctx.fillRect(10,10,15,8);

ctx.restore();
}

function drawGraph(muVal,R,theta){

gctx.clearRect(0,0,graphCanvas.width,graphCanvas.height);

gctx.beginPath();
gctx.moveTo(40,160);

for(let m=1;m<=5;m+=0.1){

let N = m*g*Math.cos(theta);
let vmax = Math.sqrt((muVal*N*R)/m);

let x = 40 + (m-1)*120;
let y = 160 - vmax*4;

gctx.lineTo(x,y);
}

gctx.strokeStyle="cyan";
gctx.lineWidth=2;
gctx.stroke();

gctx.fillStyle="white";
gctx.fillText("Velocidade Máxima vs Massa",10,20);
gctx.fillText("Massa (kg)",300,190);
gctx.fillText("Velocidade",5,100);
}

startBtn.addEventListener("click",startSimulation);


