// ===== IMPORTS =====
import * as THREE from '../../libs/three.module.js';
import { OrbitControls } from '../../libs/OrbitControls.js';
import { GLTFLoader } from '../../libs/GLTFLoader.js';

// ===== CANVAS / SCÈNE =====
const canvas = document.getElementById('car-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

// ===== CAMÉRA =====
const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.set(10, 5, 10);

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ===== LUMIÈRES =====
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// ===== CONTROLS =====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== HELPERS =====
scene.add(new THREE.AxesHelper(5));
scene.add(new THREE.GridHelper(20, 20));

// ===== LOADERS =====
const gltfLoader = new GLTFLoader();

// ===== OBJETS =====
let vehicleMesh = null;
let wheelMesh = null;

// ===== UI ROUE =====
const wheelX = document.getElementById('wheel-x');
const wheelY = document.getElementById('wheel-y');
const wheelZ = document.getElementById('wheel-z');
const wheelCoords = document.getElementById('wheel-coords');

// ===== CAMÉRA =====
function centerCameraOnVehicle(size) {
  camera.position.set(size.x * 2, size.y * 2, size.z * 2);
  controls.target.set(0, size.y / 2, 0);
  controls.update();
}

// ===== VÉHICULE GLB =====
function loadVehicleGLB(filename) {
  gltfLoader.load(`../../cars/${filename}`, gltf => {
    if (vehicleMesh) scene.remove(vehicleMesh);

    vehicleMesh = gltf.scene;
    scene.add(vehicleMesh);

    const box = new THREE.Box3().setFromObject(vehicleMesh);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    vehicleMesh.position.sub(center);
    vehicleMesh.position.y = size.y / 2;

    centerCameraOnVehicle(size);

    if (wheelMesh) vehicleMesh.add(wheelMesh);
  });
}

// ===== ROUE =====
function loadWheel() {
  gltfLoader.load('../../cars/wheels/wheel1.glb', gltf => {
    wheelMesh = gltf.scene;
    wheelMesh.scale.set(1, 1, 1);

    wheelMesh.position.set(
      -5.5,
      0.0,
      -7.0
    );

    if (vehicleMesh) vehicleMesh.add(wheelMesh);
    updateWheelUI();
  });
}

// ===== UI ROUE =====
function updateWheelUI() {
  if (!wheelMesh) return;

  wheelX.value = wheelMesh.position.x;
  wheelY.value = wheelMesh.position.y;
  wheelZ.value = wheelMesh.position.z;

  wheelCoords.textContent =
    `X:${wheelMesh.position.x.toFixed(2)} ` +
    `Y:${wheelMesh.position.y.toFixed(2)} ` +
    `Z:${wheelMesh.position.z.toFixed(2)}`;
}

[wheelX, wheelY, wheelZ].forEach(input => {
  input.addEventListener('input', () => {
    if (!wheelMesh) return;

    wheelMesh.position.set(
      parseFloat(wheelX.value),
      parseFloat(wheelY.value),
      parseFloat(wheelZ.value)
    );

    updateWheelUI();
  });
});

// ===== MENUS =====
document.getElementById('car-type').addEventListener('change', e => {
  const val = e.target.value.toLowerCase();
  if (val === 'car01') loadVehicleGLB('car01.glb');
});

document.getElementById('car-color').addEventListener('input', e => {
  if (!vehicleMesh) return;
  vehicleMesh.traverse(m => {
    if (m.isMesh && m.material) {
      m.material.color.set(e.target.value);
    }
  });
});

document.getElementById('back').addEventListener('click', () => {
  window.location.href = '../editor.html';
});

// ===== RESIZE =====
window.addEventListener('resize', () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ===== INIT =====
loadVehicleGLB('car01.glb');
loadWheel();
