// gameMap.js

import * as THREE from '../libs/three.module.js';
import { scene, controls } from './gameScene.js';
import { vehicleGroup, setVehicleSpawn } from './gameVehicle.js';

export let terrain;

export async function loadMap(name) {
    // Accepter une map à la racine ou dans un sous-dossier de maps/
    const safeName = String(name || 'map');

    if (
        safeName.startsWith('/') ||
        safeName.includes('..') ||
        !/^[a-zA-Z0-9_/-]+$/.test(safeName)
    ) {
        throw new Error(`Nom de map invalide : ${safeName}`);
    }

    const mapURL = new URL(`../maps/${safeName}.json`, import.meta.url);
    const res = await fetch(mapURL);

    if (!res.ok) {
        throw new Error(`Chargement de la map impossible : ${res.status} ${mapURL}`);
    }

    const data = await res.json();

    if (!Array.isArray(data.vertices) || data.vertices.length !== 1323) {
        throw new Error(`Géométrie invalide dans ${safeName}.json : 1323 valeurs attendues.`);
    }

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

    let material;

    if (data.texture) {
        const textureURL = new URL(data.texture, mapURL);
        const texture = await new THREE.TextureLoader().loadAsync(textureURL.href);
        texture.colorSpace = THREE.SRGBColorSpace;

        material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            map: texture
        });
    } else {
        material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    }

    // Supprimer l'ancien terrain si une autre map est chargée
    if (terrain) {
        scene.remove(terrain);
        terrain.geometry.dispose();
        terrain.material.dispose();
    }

    terrain = new THREE.Mesh(geometry, material);
    scene.add(terrain);

    if (vehicleGroup) {
        if (
            Array.isArray(data.spawn) &&
            data.spawn.length >= 3 &&
            data.spawn.every(Number.isFinite)
        ) {
            vehicleGroup.position.set(
                data.spawn[0],
                data.spawn[1] ?? 2,
                data.spawn[2]
            );
        }

        // Avec ou sans spawn défini dans le JSON, mémoriser
        // la position effective comme point de redémarrage.
        setVehicleSpawn(vehicleGroup.position);

        if (controls) {
            controls.target.copy(vehicleGroup.position);
            controls.update();
        }
    }

    console.log(`Map chargée : ${safeName}`);
}
