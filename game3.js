import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader";

let scene, camera, renderer, light, spaceship, controls;
let meteors = [];
let aliens = [];
let bullets = [];


const maxMeteors = 5; 
const maxAliens = 2;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Space: false
};

function init() {
    scene = new THREE.Scene();
    initInterface();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(1920, 1080);

    function updateRendererSize() {
      const { width, height } = gameContainer.getBoundingClientRect();
      renderer.setSize(width, height);
    }
    
    updateRendererSize();
    gameContainer.appendChild(renderer.domElement);
    window.addEventListener('resize', updateRendererSize);

    document.getElementById('game-container').appendChild(renderer.domElement);
    
    const canvas = document.querySelector('canvas[data-engine="three.js r136"]');
    canvas.style.zIndex = "1";
    canvas.style.position = "relative";

    camera = new THREE.OrthographicCamera(1920 / -100, 1920 / 100, 1080 / 100, 1080 / -100, 1, 1000);
    camera.position.set(0, 0, 10);

    renderer.setClearColor(0x000000,0);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;

  
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
 

    light = new THREE.AmbientLight(0xffffff, 10);
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

  generateSpaceship();
  generateMeteor();
  generateAlien();
}

function generateSpaceship(){
  const loader = new GLTFLoader();
  loader.load('spaceship.gltf', function(gltf) {
      spaceship = gltf.scene;
      spaceship.position.set(0,(-6), 0);
      spaceship.scale.set(1, 1, 1);
      spaceship.hp = 30;
      scene.add(spaceship);
        // Получите анимации из glTF
const animations = gltf.animations;

// Создайте объект анимации Three.js
const mixer = new THREE.AnimationMixer(spaceship);

// Добавьте все анимации к объекту анимации
animations.forEach((animation) => {
  const action = mixer.clipAction(animation);
  action.play();
});

const clock = new THREE.Clock();

const update = () => {
  const deltaTime = clock.getDelta();
  requestAnimationFrame(update);
  mixer.update(deltaTime);
  renderer.render(scene, camera);
};

update();
});

}
function generateMeteor(){

   // Создаем метеориты
   const meteorLoader = new GLTFLoader();
   for (let i = meteors.length; i < maxMeteors; i++){
     meteorLoader.load("meteor.gltf", function (gltf) {
       const meteor = gltf.scene;
       meteor.position.set(null);
       meteor.rotation.set(Math.random()* 360 ,Math.random() * 360, Math.random()* 360);
       meteor.hp = 30; // Присваиваем здоровье метеориту
       scene.add(meteor);
       meteors.push(meteor);
     });
    }
}

function generateAlien(){

  for (let b = aliens.length; b < maxAliens; b++){
  const alienLoader = new GLTFLoader();
    alienLoader.load("alien.gltf", function (gltf) {
      const alien = gltf.scene;
     // alien.position.set(Math.random() * 20 - 10, 20, 0);
      alien.position.set(null);
      alien.rotation.set(0 ,0 , Math.PI);
      alien.hp = 50;
      scene.add(alien);
      aliens.push(alien);
      const animations = gltf.animations;
  
      // Создайте объект анимации Three.js
      const mixer = new THREE.AnimationMixer(alien);
      
      // Добавьте все анимации к объекту анимации
      animations.forEach((animation) => {
        const action = mixer.clipAction(animation);
        action.play();
      });
    
      const clock = new THREE.Clock();
    
      const update = () => {
        const deltaTime = clock.getDelta();
        requestAnimationFrame(update);
        mixer.update(deltaTime);
        renderer.render(scene, camera);
      };
      
      update();
      });
  }
}

let lastShipHitTime = 0; // Время последнего попадания в корабль

let flashCount = 0; // Counter for flash iterations

function handleCollisions() {
  // Проверка столкновений с метеоритами
  meteors.forEach((meteor) => {
    if (
      spaceship.position.distanceTo(meteor.position) < 4 && Date.now() - lastShipHitTime > 2000 // Задержка в 2 секунды
    ) {
      meteor.position.set(null);
      meteor.rotation.set(Math.random() * 360, Math.random() * 360, Math.random() * 360);
      currentMeteorIndex = meteors.indexOf(meteor);
      lastShipHitTime = Date.now();
      spaceship.hp -= 10;
      updateSpaceshipHP(spaceship.hp);
      console.log(spaceship.hp);
      if (spaceship.hp <= 0) {
        gameOver();
      } else {
        flashCount = 0; // Reset the flash counter
        flashSpaceship(); // Call the function to flash the spaceship
      }
    }
  });

  // Проверка столкновений с инопланетянами
  aliens.forEach((alien) => {
    if (
      spaceship.position.distanceTo(alien.position) < 4 && Date.now() - lastShipHitTime > 2000 // Задержка в 2 секунды
    ) {
      alien.position.set(null);
      alien.rotation.set(0, 0, Math.PI);
      currentAlienIndex = aliens.indexOf(alien);
      lastShipHitTime = Date.now();
      spaceship.hp -= 10;
      updateSpaceshipHP();
      console.log(spaceship.hp);
      if (spaceship.hp <= 0) {
        gameOver();
      } else {
        flashCount = 0; // Reset the flash counter
        flashSpaceship(); // Call the function to flash the spaceship
      }
    }
  });
}

// Функция для мигания корабля
function flashSpaceship() {
  spaceship.visible = !spaceship.visible;
  flashCount++;

  if (flashCount < 4) { // Repeat the flash 4 times (8 iterations)
    setTimeout(flashSpaceship, 500); // Delay for 500ms between each flash iteration
  }
}


let End = false;
function gameOver() {
  scene.remove(spaceship);
  spaceship.position.set(null);
  End = true;
}

let lastShotTime = 0;
const shootDelay = 200; // Delay between shots in milliseconds
let lastMeteorHitTime = 0; // Время последнего попадания в метеорит
let lastAlienHitTime = 0; // Время последнего попадания в алиена

function handleShoot() {
  const currentTime = Date.now();
  if (currentTime - lastShotTime > shootDelay) {
    const bulletGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xfffff0 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.set(spaceship.position.x, spaceship.position.y+3, 0);
    scene.add(bullet);

    function animateBullet() {
      bullet.position.y += 0.5;
      if (bullet.position.y > 10) {
        scene.remove(bullet);
      } else {
        requestAnimationFrame(animateBullet);

        // Check for collision with meteors
  meteors.forEach((meteor) => {
      if (
        bullet.position.distanceTo(meteor.position) < 2 &&
        Date.now() - lastMeteorHitTime > 100 // Задержка в 100 миллисекунд
      ) {
        lastMeteorHitTime = Date.now();
        bullets.splice(bullets.indexOf(bullet), 1);
        scene.remove(bullet);
        meteor.hp -= 10;
        console.log(meteor.hp);
        if (meteor.hp <= 0) {
          meteor.position.set(null);
          meteor.rotation.set(Math.random() * 360, Math.random() * 360, Math.random() * 360);
          currentMeteorIndex = meteors.indexOf(meteor);
          updateScore(10); // Увеличиваем счет на 10 очков
        }
      }
    });

// Check for collision with aliens
aliens.forEach((alien) => {
  if (
    bullet.position.distanceTo(alien.position) < 2 &&
    Date.now() - lastAlienHitTime > 100 // Задержка в 100 миллисекунд
  ) {
    lastAlienHitTime = Date.now();
    bullets.splice(bullets.indexOf(bullet), 1);
    scene.remove(bullet);
    alien.hp -= 10;
    console.log(alien.hp);
    if (alien.hp <= 0) {
      alien.position.set(null);
      alien.rotation.set(0, 0, Math.PI);
      currentAlienIndex = aliens.indexOf(alien);
      updateScore(20); // Увеличиваем счет на 20 очков
    }
  }
});

   }
 }

    animateBullet();
    lastShotTime = currentTime;
  }
}



function handleKeyDown(event) {
  const key = event.key;
  if (key in keys) {
    keys[key] = true;
  }
  if (key === " ") {
    // Проверяем, если стрельба уже активна, не делаем ничего
    if (keys.Space) {
      return;
    }
    keys.Space = true;
    handleShoot(); // Вызываем функцию стрельбы при нажатии клавиши "Пробел"
  }
}

function handleKeyUp(event) {
  const key = event.key;
  if (key in keys) {
    keys[key] = false;
  }
  if (key === " ") {
    keys.Space = false;
  }
}

function updateSpaceshipPosition() {
  const speed = 0.1; // Movement speed
  const tiltAngle = Math.PI / 12; // Tilt angle in radians
  if (spaceship) {
  if (keys.ArrowUp) {
    spaceship.position.y += speed;
  }
  if (keys.ArrowDown) {
    spaceship.position.y -= speed;
  }
  if (keys.ArrowLeft) {
    spaceship.position.x -= speed;
    spaceship.rotation.y = -tiltAngle; // Tilt the model to the left
  }
  if (keys.ArrowRight) {
    spaceship.position.x += speed;
    spaceship.rotation.y = tiltAngle; // Tilt the model to the right
  }

  // Reset the tilt when no arrow keys are pressed
  if (!keys.ArrowLeft && !keys.ArrowRight) {
    spaceship.rotation.y = 0;
  }
}
}
let lastGenerationTime = 0;
let currentMeteorIndex = 0;
let currentAlienIndex = 0;

function reGeneration() {

  const generateObjects = (timestamp) => {
    if (timestamp - lastGenerationTime > 1000) {
      if (currentMeteorIndex < meteors.length) {
        const meteor = meteors[currentMeteorIndex];
        if (meteor.position.x === null) {
          meteor.position.y -=0.2;
          meteor.position.set(Math.random() * 20 - 10, 20, 0);
          meteor.rotation.set(Math.random() * 360, Math.random() * 360, Math.random() * 360);
          currentMeteorIndex++;
        }
      }else currentMeteorIndex=0;
      

      if (currentAlienIndex < aliens.length) {
        const alien = aliens[currentAlienIndex];
        if (alien.position.x === null) {
          alien.position.y -=0.1;
          alien.position.set(Math.random() * 20 - 10, 20, 0);
          alien.rotation.set(0, 0, Math.PI);
          currentAlienIndex++;
        }
      }else currentAlienIndex=0;

      lastGenerationTime = timestamp;
    }

    requestAnimationFrame(generateObjects);
  };

  requestAnimationFrame(generateObjects);
}

function animate() {
    requestAnimationFrame(animate);

    updateSpaceshipPosition();  
    
    ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height); 

    if (keys.Space) {
      handleShoot();
    }

    meteors.forEach((meteor) => {
      meteor.position.y -=0.2;
      if (meteor.position.y <= -15) {
        meteor.position.set(null);
        meteor.rotation.set(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        currentMeteorIndex = meteors.indexOf(meteor);
      }
    });

    aliens.forEach((alien) => {
      alien.position.y -=0.1;
      if (alien.position.y <= -15) {
        alien.position.set(null);
        alien.rotation.set(0, 0, Math.PI);
        currentAlienIndex = aliens.indexOf(alien);
      }
    });
    handleCollisions();
    drawDistance();
    drawScore();
    drawPlayerHP();
    if(End == true)
    gameOverInt();
    renderer.render(scene, camera);
}

reGeneration();
init();
animate();
