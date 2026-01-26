// gameVehicle.js

import * as THREE from '../libs/three.module.js';
import { scene } from './gameScene.js';
import { keys } from './gameControls.js';
import { terrain } from './gameMap.js';

export let vehicleGroup, carBody;
export const suspensions = {};

// ===== PARAMÈTRES =====
const speed = 0.5;         // vitesse de déplacement
const turnSpeed = 0.04;    // vitesse de rotation

const suspensionRest = 1.2;
const suspensionMax = 2.0;
const gravity = 0.12;

let verticalVelocity = 0;
let vehicleRotation = 0;   // angle actuel du véhicule

// ===== RAYCAST =====
const raycaster = new THREE.Raycaster();
raycaster.far = suspensionMax + 2;
const down = new THREE.Vector3(0, -1, 0);

// ================= LOAD VEHICLE =================
export async function loadVehicle(name) {
    const res = await fetch(`../cars/${name}.json`);
    const data = await res.json();

    vehicleGroup = new THREE.Group();
    vehicleGroup.position.set(0, 6, 0); // spawn
    scene.add(vehicleGroup);

    // ----- BODY -----
    carBody = new THREE.Mesh(
        new THREE.BoxGeometry(data.sizeX, data.sizeY, data.sizeZ),
        new THREE.MeshStandardMaterial({ color: data.color || '#ff0000' })
    );
    carBody.position.y = data.sizeY / 2;
    vehicleGroup.add(carBody);

    // ----- SUSPENSIONS VISUELLES -----
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 20);
    const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const springGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 12);

    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const springMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    const halfX = data.sizeX / 2;
    const halfZ = data.sizeZ / 2;

    const layout = {
        frontLeft:  [-halfX,  halfZ],
        frontRight: [ halfX,  halfZ],
        rearLeft:   [-halfX, -halfZ],
        rearRight:  [ halfX, -halfZ]
    };

    Object.entries(layout).forEach(([key, pos]) => {
        const group = new THREE.Group();

        const rod = new THREE.Mesh(rodGeo, rodMat);
        const spring = new THREE.Mesh(springGeo, springMat);
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);

        wheel.rotation.z = Math.PI / 2;

        rod.position.y = 0.5;
        spring.position.y = 0.5;
        wheel.position.y = 0;

        group.add(rod, spring, wheel);
        group.position.set(pos[0], 0, pos[1]);

        vehicleGroup.add(group);
        suspensions[key] = { group };
    });
}

// ================= PHYSIQUE =================
function applySuspensionPhysics() {
    if (!terrain || !vehicleGroup) return;

    let hitPoints = [];
    let avgHeight = 0;

    Object.values(suspensions).forEach(s => {
        const origin = new THREE.Vector3();
        s.group.getWorldPosition(origin);
        origin.y += suspensionMax;

        raycaster.set(origin, down);
        const hits = raycaster.intersectObject(terrain, false);

        if (hits.length) {
            hitPoints.push(hits[0].point);
            avgHeight += hits[0].point.y;
        }
    });

    if (!hitPoints.length) {
        verticalVelocity -= gravity;
        verticalVelocity = Math.max(verticalVelocity, -3);
        vehicleGroup.position.y += verticalVelocity;
        return;
    }

    avgHeight /= hitPoints.length;
    const targetY = avgHeight + suspensionRest;

    verticalVelocity += (targetY - vehicleGroup.position.y) * 0.2;
    verticalVelocity *= 0.65;
    vehicleGroup.position.y += verticalVelocity;

    if (hitPoints.length >= 3) {
        const v1 = new THREE.Vector3().subVectors(hitPoints[1], hitPoints[0]);
        const v2 = new THREE.Vector3().subVectors(hitPoints[2], hitPoints[0]);
        const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

        const targetQuat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            normal
        );

        vehicleGroup.quaternion.slerp(targetQuat, 0.2);
    }
}

// ================= MOUVEMENT =================
export function moveVehicle() {
    if (!vehicleGroup) return;

    // ----- DÉTERMINER DIRECTION -----
    let moveDir = 0; // 1 = forward, -1 = backward, 0 = immobile
    if (keys.forward)  moveDir += 1;
    if (keys.backward) moveDir -= 1;

    // ----- ROTATION FLUIDE -----
    if (moveDir !== 0) {
        if (keys.left)  vehicleRotation += turnSpeed * moveDir;
        if (keys.right) vehicleRotation -= turnSpeed * moveDir;
    }

    vehicleGroup.rotation.y = vehicleRotation;

    // ----- VECTEUR AVANT -----
    const forward = new THREE.Vector3(
        Math.sin(vehicleRotation),
        0,
        Math.cos(vehicleRotation)
    );

    // ----- DÉPLACEMENT -----
    if (keys.forward)  vehicleGroup.position.addScaledVector(forward, speed);
    if (keys.backward) vehicleGroup.position.addScaledVector(forward, -speed);

    // ----- PHYSIQUE -----
    applySuspensionPhysics();
}
