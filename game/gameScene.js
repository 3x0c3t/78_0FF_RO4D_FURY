// gameScene.js
import * as THREE from '../libs/three.module.js';
import { OrbitControls } from '../libs/OrbitControls.js';

export let scene;
export let camera;
export let renderer;
export let controls;

export function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(120, 140, 120);

    // Utiliser le canvas existant dans game.html.
    // Cela évite de créer un second canvas qui intercepterait la souris.
    const gameCanvas = document.getElementById('game-canvas');

    if (!gameCanvas) {
        throw new Error('Canvas #game-canvas introuvable dans game.html');
    }

    renderer = new THREE.WebGLRenderer({
        canvas: gameCanvas,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(100, 200, 100);
    scene.add(sun);

    controls = new OrbitControls(camera, renderer.domElement);

    // Souris : rotation orbitale.
    controls.enabled = true;
    controls.enableRotate = true;

    // Molette : zoom avant / arrière.
    controls.enableZoom = true;
    controls.minDistance = 4;
    controls.maxDistance = 40;
    controls.zoomSpeed = 1.0;

    // Désactiver le déplacement latéral involontaire.
    controls.enablePan = false;

    // Rotation amortie pour un mouvement plus fluide.
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    controls.target.set(0, 0, 0);
    controls.update();
}

export function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
