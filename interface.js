let canvasOverlay, ctx;

const score = 0;

function initInterface() {
  // Создание и размещение Canvas
  canvasOverlay = document.getElementById('canvas-overlay');
  canvasOverlay.width = window.innerWidth;
  canvasOverlay.height = window.innerHeight;
  ctx = canvasOverlay.getContext('2d');
}

function updateScore() {
  score += 10;
}

function drawScore() {
  ctx.font = '72px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 10, 72);
}
