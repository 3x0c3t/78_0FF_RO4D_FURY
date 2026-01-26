// gameMap.js

import * as THREE from '../libs/three.module.js';
import { scene, controls } from './gameScene.js';
import { vehicleGroup } from './gameVehicle.js';

export let terrain;

export async function loadMap(name) {
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

    if (data.spawn && vehicleGroup) {
        vehicleGroup.position.set(data.spawn[0], 0, data.spawn[2]);
        controls.target.copy(vehicleGroup.position);
        controls.update();
    }
}
