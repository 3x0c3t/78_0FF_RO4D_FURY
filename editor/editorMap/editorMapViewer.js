// editorMapViewer.js
// Viewer Three.js
// Convention logique respectée (X longueur / Y largeur / Z hauteur)

import * as THREE from '../../libs/three.module.js';
import { OrbitControls } from '../../libs/OrbitControls.js';

// ==================
// SCENE
// ==================
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ==================
// CAMERA
// ==================
export const camera = new THREE.PerspectiveCamera(
  60,
  1,
  0.1,
  2000
);

// Vue en hauteur oblique
camera.position.set(120, 140, 120);

// ==================
// RENDERER
// ==================
export const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('map-canvas'),
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);

// ==================
// LIGHTS
// ==================
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(100, 200, 100);
scene.add(sun);

// ==================
// CONTROLS
// ==================
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ==================
// RAYCAST
// ==================
export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();

// ==================
// RESIZE
// ==================
export function resize() {
  const c = renderer.domElement;
  camera.aspect = c.clientWidth / c.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(c.clientWidth, c.clientHeight);
}

// ==================
// LOOP
// ==================
export function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
