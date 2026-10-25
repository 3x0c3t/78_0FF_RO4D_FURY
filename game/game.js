import * as THREE from '../libs/three.module.js';

import {
    initScene,
    scene,
    renderer,
    camera,
    controls,
    handleResize
} from './gameScene.js';

import { loadMap } from './gameMap.js';
import { loadVehicle, moveVehicle, resetVehicle, vehicleGroup } from './gameVehicle.js';
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
    resetVehicle();
    restartBtn.style.display = 'none';
});

// ===== LOAD SEQUENTIEL =====
let vehicleLoaded = false;
(async () => {
    await loadVehicle(carSelector);
    vehicleLoaded = true;
    await loadMap(mapSelector);
})();

// ===== CAMERA 3E PERSONNE : SUIVI + ORBITCONTROLS =====
let cameraInitialized = false;

function updateCamera() {
    if (!vehicleGroup || !controls) return;

    const target = vehicleGroup.position.clone();
    target.y += 1;

    // Positionner la caméra derrière le véhicule au premier passage.
    if (!cameraInitialized) {
        camera.position.copy(target).add(
            new THREE.Vector3(0, 5, -10)
        );
        controls.target.copy(target);
        controls.update();
        cameraInitialized = true;
        return;
    }

    // Déplacer la caméra avec le véhicule sans écraser
    // la rotation et le zoom choisis par le joueur.
    const delta = target.clone().sub(controls.target);
    camera.position.add(delta);
    controls.target.copy(target);
    controls.update();
}

// ===== ZOOM CLAVIER : + ET - =====
function zoomCamera(factor) {
    if (!camera || !controls) return;

    const offset = camera.position.clone().sub(controls.target);
    const distance = offset.length();

    if (distance === 0) return;

    const nextDistance = THREE.MathUtils.clamp(
        distance * factor,
        controls.minDistance,
        controls.maxDistance
    );

    offset.setLength(nextDistance);
    camera.position.copy(controls.target).add(offset);
    controls.update();
}

window.addEventListener('keydown', event => {
    if (event.repeat) return;

    if (
        event.key === '+' ||
        event.key === '=' ||
        event.code === 'NumpadAdd'
    ) {
        event.preventDefault();
        zoomCamera(0.85);
    } else if (
        event.key === '-' ||
        event.key === '_' ||
        event.code === 'NumpadSubtract'
    ) {
        event.preventDefault();
        zoomCamera(1.15);
    }
});

// ===== VÉRIFIER SI LE VÉHICULE EST RETOURNÉ =====
function checkVehicleUpsideDown() {
    if (!vehicleGroup || !restartBtn) return;

    const up = new THREE.Vector3(0, 1, 0);
    const vehicleUp = new THREE.Vector3(0, 1, 0)
        .applyQuaternion(vehicleGroup.quaternion);

    // Afficher le bouton si le véhicule est retourné ou tombe dans le vide.
    const upsideDown = vehicleUp.dot(up) < 0.5;
    const fallenIntoVoid = vehicleGroup.position.y < -5;

    restartBtn.style.display =
        (upsideDown || fallenIntoVoid) ? 'block' : 'none';
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
