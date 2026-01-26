import * as THREE from '../libs/three.module.js';

import {
    initScene,
    scene,
    renderer,
    camera,
    handleResize
} from './gameScene.js';

import { loadMap } from './gameMap.js';
import { loadVehicle, moveVehicle, vehicleGroup } from './gameVehicle.js';
import { initControls } from './gameControls.js';
import { startMusic } from './gameAudio.js';

// ===== PARAMÈTRES =====
const defaultMap = 'map';
const mapSelector = sessionStorage.getItem('selectedMap') || defaultMap;
const carSelector = sessionStorage.getItem('selectedCar') || 'car1';

// ===== INITIALISATION =====
initScene();
initControls();
startMusic({
    ambiance: '../media/music/ambiance4-3x0c3t.mp3',
    selectMenu: '../media/sound/select_menu.mp3'
});

// ===== HUD / RESTART BUTTON =====
const restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', () => {
    if (vehicleGroup) vehicleGroup.rotation.set(0, 0, 0);
    if (vehicleGroup) vehicleGroup.position.set(0, 6, 0);
    restartBtn.style.display = 'none';
});

// ===== LOAD SEQUENTIEL =====
let vehicleLoaded = false;
(async () => {
    await loadVehicle(carSelector);
    vehicleLoaded = true;
    await loadMap(mapSelector);
})();

// ===== CAMERA 3E PERSONNE =====
const cameraOffset = new THREE.Vector3(0, 5, -10);

function updateCamera() {
    if (!vehicleGroup) return;
    const relativeCameraOffset = cameraOffset.clone();
    const cameraPosition = relativeCameraOffset.applyMatrix4(vehicleGroup.matrixWorld);
    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(vehicleGroup.position);
}

// ===== VÉRIFIER SI LE VÉHICULE EST RETOURNÉ =====
function checkVehicleUpsideDown() {
    if (!vehicleGroup) return;
    const up = new THREE.Vector3(0, 1, 0);
    const vehicleUp = new THREE.Vector3(0, 1, 0).applyQuaternion(vehicleGroup.quaternion);
    restartBtn.style.display = vehicleUp.dot(up) < 0.5 ? 'block' : 'none';
}

// ===== FOOTER / HUD =====
const footer = document.getElementById('game-footer');
if (footer) {
    fetch('./interface/79_GAMEinterface/footer/footer.html')
        .then(res => {
            if (!res.ok) throw new Error(`Footer non trouvé: ${res.status}`);
            return res.text();
        })
        .then(html => {
            footer.innerHTML = html;

            // Charger le JS du footer
            const script = document.createElement('script');
            script.src = './interface/79_GAMEinterface/footer/footer.js';
            document.body.appendChild(script);

            script.onload = () => {
                console.log('Footer HUD chargé avec tous ses blocs !');
            };
        })
        .catch(err => console.error('Impossible de charger le footer :', err));
}

// ===== ANIMATION LOOP =====
function animate() {
    requestAnimationFrame(animate);

    if (vehicleLoaded) {
        moveVehicle();
        updateCamera();
        checkVehicleUpsideDown();

        // Mettre à jour le HUD si la fonction existe
        if (window.updateHUD && vehicleGroup) {
            window.updateHUD({
                speed: vehicleGroup.userData.speed || Math.floor(Math.random() * 200),
                inclineX: vehicleGroup.rotation.x * (180 / Math.PI),
                inclineY: vehicleGroup.rotation.y * (180 / Math.PI),
                inclineZ: vehicleGroup.rotation.z * (180 / Math.PI),
                weight: vehicleGroup.userData.weight || 1200,
                battery: vehicleGroup.userData.battery || 85
            });
        }
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', handleResize);
animate();
