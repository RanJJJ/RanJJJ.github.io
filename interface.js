let canvasOverlay, ctx;
let score = 0;
let spaceshipHP = 30;
let dist = 0;
let lastDist = 0;
let one = true;

function initInterface() {
  // Создание и размещение Canvas
  canvasOverlay = document.getElementById('canvas-overlay');
  canvasOverlay.width = 1920;
  canvasOverlay.height = 1080;
  ctx = canvasOverlay.getContext('2d');
}

// Функция обновления счёта
function updateScore(bonus) {
  score = bonus + score;
}

// Функция отрисовки счёта
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

// Функция обновления здоровья
function updateSpaceshipHP() {
  spaceshipHP -= 10;
}

// Функция отрисовки здоровья игрока
function drawPlayerHP() {
  ctx.font = '24px Orbitron';
  ctx.fillStyle = 'white';
  
  if (spaceshipHP<=0) {
    return;
  } else {
    ctx.fillText('HP: ' + spaceshipHP, 40, 100);
  }
}

// Функция интерфейса в конце игры
function gameOverInt() {
  ctx.font = '130px Orbitron';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GAME OVER', canvasOverlay.width / 2, canvasOverlay.height / 2);
  ctx.font = '30px Orbitron';
  ctx.fillText('Press f5 to restart', canvasOverlay.width / 2,canvasOverlay.height / 2 + 190);
}

// Функция обновления пройденой дистанции
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