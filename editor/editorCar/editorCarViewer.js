import * as THREE from '../../libs/three.module.js';
import { OrbitControls } from '../../libs/OrbitControls.js';

let scene, camera, renderer, controls;

export function initRenderer(canvas) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(6, 5, 8);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5, 10, 7);
  scene.add(dir);

  scene.add(new THREE.AxesHelper(5));
}

export function getScene() {
  return scene;
}

export function render() {
  controls.update();
  renderer.render(scene, camera);
}

export function resize() {
  const w = renderer.domElement.clientWidth;
  const h = renderer.domElement.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
