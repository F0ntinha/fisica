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
let t = 0;
let progress = 0;

function startSimulation(){

cancelAnimationFrame(animation);

t = 0;
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

drawTrack(R,theta);

if(progress < Math.PI/2){

let x = 350 + Math.cos(progress)*R*30;
let y = 350 - Math.sin(progress)*R*30*Math.cos(theta);

if(derrapa && progress > Math.PI/4){
    x += progress*20;
}

drawCar(x,y,progress);

progress += v/(R*40);

}else{
    cancelAnimationFrame(animation);
}

animation = requestAnimationFrame(animate);
}

animate();
}

function drawTrack(R,theta){

ctx.save();
ctx.translate(350,350);
ctx.rotate(-theta);
ctx.beginPath();
ctx.arc(0,0,R*30,Math.PI,Math.PI*1.5);
ctx.strokeStyle="white";
ctx.lineWidth=4;
ctx.stroke();
ctx.restore();
}

function drawCar(x,y,angle){

ctx.save();
ctx.translate(x,y);
ctx.rotate(-angle);
ctx.fillStyle="red";
ctx.fillRect(-20,-10,40,20);

ctx.fillStyle="black";
ctx.fillRect(-15,-15,10,5);
ctx.fillRect(5,-15,10,5);
ctx.fillRect(-15,10,10,5);
ctx.fillRect(5,10,10,5);

ctx.restore();
}

function drawGraph(muVal,R,theta){

gctx.clearRect(0,0,graphCanvas.width,graphCanvas.height);

gctx.beginPath();
gctx.moveTo(0,150);

for(let m=1;m<=5;m+=0.1){

let N = m*g*Math.cos(theta);
let vmax = Math.sqrt((muVal*N*R)/m);

let x = (m-1)*175;
let y = 150 - vmax*3;

gctx.lineTo(x,y);
}

gctx.strokeStyle="cyan";
gctx.stroke();

gctx.fillText("Gráfico: Velocidade Máxima vs Massa",
10,20);
}

startBtn.addEventListener("click",startSimulation);


startBtn.addEventListener("click", simular);

