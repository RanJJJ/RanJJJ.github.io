let canvasOverlay, ctx;
let score = 0;
let spaceshipHP = 30;
let dist = 0;
let lastDist = 0;
let one = true;

function initInterface() {
  // Создание и размещение Canvas
  canvasOverlay = document.getElementById('canvas-overlay');
  canvasOverlay.width = window.innerWidth;
  canvasOverlay.height = window.innerHeight;
  ctx = canvasOverlay.getContext('2d');
}

function updateScore(bonus) {
  score = bonus + score;
}

function drawScore() {

  ctx.fillStyle = 'white';
  
  if (spaceshipHP<=0) {
    ctx.font = '80px Orbitron';
    ctx.fillText('Your score: ' + score, canvasOverlay.width / 2, canvasOverlay.height / 2 + 90);
  } else {
    ctx.font = '72px Orbitron';
    ctx.fillText('Score: ' + score, 10, 72);
  }
}


function updateSpaceshipHP() {
  spaceshipHP -= 10;
}


function drawPlayerHP() {
  ctx.font = '24px Orbitron';
  ctx.fillStyle = 'white';
  
  if (spaceshipHP<=0) {
    return;
  } else {
    ctx.fillText('HP: ' + spaceshipHP, 40, 100);
  }
}


function gameOverInt() {
  ctx.font = '130px Orbitron';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GAME OVER', canvasOverlay.width / 2, canvasOverlay.height / 2);
}


function drawDistance(){
  dist += 1;
  
  
  ctx.fillStyle = 'white';

  if (spaceshipHP<=0) {
    if(one == true){
    lastDist = dist; 
    one = false;
    }
    ctx.font = '40px Orbitron';
    ctx.fillText('Your distance: ' + lastDist, canvasOverlay.width / 2, canvasOverlay.height / 2 + 150);
  } else {
    ctx.font = '20px Orbitron';
    ctx.fillText('Distance: ' + dist, 20,130);
  }

}