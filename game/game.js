// ===== PARAMÈTRES =====
const defaultMap = 'map';
const mapSelector = sessionStorage.getItem('selectedMap') || defaultMap;
const carSelector = sessionStorage.getItem('selectedCar') || 'car1';

// ===== AUDIO =====
let musicStarted = false;
window.music = new Audio('../media/music/ambiance.mp3');
window.music.loop = true;
window.music.volume = 0.7;

window.selectSound = new Audio('../media/music/select_menu.mp3');
window.selectSound.volume = 0.6;

function startMusic() {
    if (musicStarted) return;
    window.music.play().then(() => musicStarted = true).catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => startMusic());

// ===== THREE.JS SETUP =====
import * as THREE from '../libs/three.module.js';
import { OrbitControls } from '../libs/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.set(120, 140, 120);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(100, 200, 100);
scene.add(sun);

// ===== CONTROLS =====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.target.set(0, 0, 0);
controls.update();

// ===== TERRAIN & VEHICLE =====
let terrain;
let vehicle;

// ===== LOAD VEHICLE =====
async function loadVehicle(name) {
    const res = await fetch(`../cars/${name}.json`);
    const data = await res.json();

    const geometry = new THREE.BoxGeometry(data.sizeX, data.sizeY, data.sizeZ);
    const material = new THREE.MeshLambertMaterial({ color: data.color || '#ff0000' });

    vehicle = new THREE.Mesh(geometry, material);
    vehicle.position.set(0, data.sizeY/2, 0); // temporaire
    scene.add(vehicle);

    // Charger la map après le véhicule pour placer spawn correctement
    await loadMap(mapSelector);
}

// ===== LOAD MAP =====
async function loadMap(name) {
    const res = await fetch(`../maps/${name}.json`);
    const data = await res.json();

    const mapSize = 20;
    const blockSize = 5;
    const geometry = new THREE.PlaneGeometry(
        mapSize * blockSize,
        mapSize * blockSize,
        mapSize,
        mapSize
    );
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.array.length; i++) {
        pos.array[i] = data.vertices[i] ?? pos.array[i];
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    terrain = new THREE.Mesh(geometry, material);
    scene.add(terrain);

    // Spawn si présent
    if (data.spawn && vehicle) {
        vehicle.position.set(data.spawn[0], vehicle.geometry.parameters.height/2, data.spawn[2]);
        // recaler la caméra sur le véhicule
        controls.target.set(vehicle.position.x, vehicle.position.y, vehicle.position.z);
        controls.update();
    }
}

// ===== ANIMATION LOOP =====
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera); // rendre même si terrain pas encore prêt
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== START =====
loadVehicle(carSelector);
animate();
