import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader";

let scene, camera, renderer, light, spaceship, meteors, aliens, controls;
let bullets = [];
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
    camera = new THREE.OrthographicCamera(window.innerWidth / -100, window.innerWidth / 100, window.innerHeight / 100, window.innerHeight / -100, 1, 1000);
    camera.position.set(0, 0, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    renderer.setClearColor(0x000000, 1);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;

  
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
 

    light = new THREE.AmbientLight(0xffffff, 10);
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('http://localhost:8080/spaceship.gltf', function(gltf) {
        spaceship = gltf.scene;
        spaceship.position.set(0,(-6), 0);
        spaceship.scale.set(1, 1, 1);
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

    // Создаем метеориты
    meteors = [];
    const meteorGeometry = new THREE.BoxGeometry(1, 1, 2);
    const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    for (let i = 0; i < 5; i++) {
        const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
        meteor.position.set(Math.random() * 20 - 10,Math.random() * 10 + 30, 0);
        meteors.push(meteor);
        scene.add(meteor);
    }

    // Создаем инопланетян
    aliens = [];
    const alienGeometry = new THREE.BoxGeometry(1, 1, 2);
    const alienMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    for (let i = 0; i < 2; i++) {
        const alien = new THREE.Mesh(alienGeometry, alienMaterial);
        alien.position.set(Math.random() * 20 - 10,Math.random() * 15 + 30, 0);
        aliens.push(alien);
        scene.add(alien);
    }
}

let lastShotTime = 0;
const shootDelay = 200; // Delay between shots in milliseconds

function handleShoot() {
  const currentTime = Date.now();
  if (currentTime - lastShotTime > shootDelay) {
    const bulletGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xfffff0 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.set(spaceship.position.x, spaceship.position.y+3, 0);
    scene.add(bullet);

    function animateBullet() {
      bullet.position.y += 0.1;
      if (bullet.position.y > 10) {
        scene.remove(bullet);
      } else {
        requestAnimationFrame(animateBullet);
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

function animate() {
    requestAnimationFrame(animate);

    updateSpaceshipPosition();  

    ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height); 

    if (keys.Space) {
      handleShoot();
    }

    meteors.forEach((meteor) => {
        meteor.position.y -= 0.1;
        if (meteor.position.y < -10) {
            meteor.position.set(Math.random() * 20 - 10,Math.random() * 10 + 10, 0);
        }
    });

    aliens.forEach((alien) => {
        alien.position.y -= 0.05;
        if (alien.position.y < -10) {
            alien.position.set(Math.random() * 20 - 10,Math.random() * 10 + 10 , 0);
        }
    });

     // Move bullets
  bullets.forEach((bullet) => {
    bullet.position.y += 0.1;
    if (bullet.position.y > 10) {
      // Remove the bullet when it goes out of bounds
      scene.remove(bullet);
      bullets.splice(bullets.indexOf(bullet), 1);
    } else {
      // Check for collision with meteors
      meteors.forEach((meteor) => {
        if (bullet.position.distanceTo(meteor.position) < 1) {
          // Remove the meteor and bullet when they collide
          scene.remove(meteor);
          scene.remove(bullet);
          meteors.splice(meteors.indexOf(meteor), 1);
          bullets.splice(bullets.indexOf(bullet), 1);
        }
      });

      // Check for collision with aliens
      aliens.forEach((alien) => {
        if (bullet.position.distanceTo(alien.position) < 1) {
          // Remove the alien and bullet when they collide
          scene.remove(alien);
          scene.remove(bullet);
          aliens.splice(aliens.indexOf(alien), 1);
          bullets.splice(bullets.indexOf(bullet), 1);
        }
      });
    }
  });

    drawScore();
    renderer.render(scene, camera);
}

init();
animate();
