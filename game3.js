import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader";

let scene, camera, renderer, light, spaceship, meteors, aliens, controls;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

function init() {
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(window.innerWidth / -100, window.innerWidth / 100, window.innerHeight / 100, window.innerHeight / -100, 1, 1000);
    camera.position.set(0, 0, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    renderer.setClearColor(0xeeeeee, 1);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;

  
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
 

    light = new THREE.AmbientLight(0xffffff, 6);
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('http://localhost:8080/hudi.gltf', function(gltf) {
        spaceship = gltf.scene;
        spaceship.scale.set(0.5, 0.5, 0.5);
        scene.add(spaceship);
    });

    // Создаем метеориты
    meteors = [];
    const meteorGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    for (let i = 0; i < 2; i++) {
        const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
        meteor.position.set(Math.random() * 20 - 10,Math.random() * 10 + 20, Math.random() * 20 - 10);
        meteors.push(meteor);
        scene.add(meteor);
    }

    // Создаем инопланетян
    aliens = [];
    const alienGeometry = new THREE.BoxGeometry(1, 1, 1);
    const alienMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    for (let i = 0; i < 5; i++) {
        const alien = new THREE.Mesh(alienGeometry, alienMaterial);
        alien.position.set(Math.random() * 20 - 10,Math.random() * 15 + 30, Math.random() * 20 - 10);
        aliens.push(alien);
        scene.add(alien);
    }
}

function handleKeyDown(event) {
  const key = event.key;
  if (key in keys) {
    keys[key] = true;
  }
}

function handleKeyUp(event) {
  const key = event.key;
  if (key in keys) {
    keys[key] = false;
  }
}

function updateSpaceshipPosition() {
  const speed = 0.1; // Скорость передвижения
  if (keys.ArrowUp) {
    spaceship.position.y += speed;
  }
  if (keys.ArrowDown) {
    spaceship.position.y -= speed;
  }
  if (keys.ArrowLeft) {
    spaceship.position.x -= speed;
  }
  if (keys.ArrowRight) {
    spaceship.position.x += speed;
  }
}

function animate() {
    requestAnimationFrame(animate);

    updateSpaceshipPosition();

    meteors.forEach((meteor) => {
        meteor.position.y -= 0.1;
        if (meteor.position.y < -10) {
            meteor.position.set(Math.random() * 20 - 10,Math.random() * 10 + 10, Math.random() * 20 - 10);
        }
    });

    aliens.forEach((alien) => {
        alien.position.y -= 0.2;
        if (alien.position.y < -10) {
            alien.position.set(Math.random() * 20 - 10,Math.random() * 10 + 10 , Math.random() * 20 - 10);
        }
    });

    renderer.render(scene, camera);
}

init();
animate();
