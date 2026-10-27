// editorMapData.js
// Convention logique :
// X = longueur
// Y = largeur
// Z = hauteur (mappée sur Y Three.js)

import * as THREE from '../../libs/three.module.js';

// ==================
// PARAMÈTRES MAP
// ==================
export const MAP_LENGTH = 20;   // X
export const MAP_WIDTH  = 20;   // Y (logique)
export const CELL_SIZE  = 5;
export const RESOLUTION = 20;

// ==================
// TERRAIN
// Plan X / Y logique → X / Z Three.js
// Hauteur = Y Three.js
// ==================
export const geometry = new THREE.PlaneGeometry(
  MAP_LENGTH * CELL_SIZE,
  MAP_WIDTH  * CELL_SIZE,
  RESOLUTION,
  RESOLUTION
);

// On met le plan à plat (X/Z)
geometry.rotateX(-Math.PI / 2);

export const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
export const terrain = new THREE.Mesh(geometry, material);

// ==================
// SPAWN
// ==================
export const spawn = new THREE.Mesh(
  new THREE.BoxGeometry(2, 4, 2),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
spawn.position.y = 2;

// ==================
// MARQUEUR
// ==================
export const marker = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 8, 8),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
marker.visible = false;

// ==================
// TEXTURES
// ==================
const textureLoader = new THREE.TextureLoader();

const textures = {
  sand1: textureLoader.load('../../media/textures/sand1.jpg'),
  sand2: textureLoader.load('../../media/textures/sand2.jpg'),
  sand3: textureLoader.load('../../media/textures/sand3.jpg'),
  sand4: textureLoader.load('../../media/textures/sand4.jpg'),
  sand5: textureLoader.load('../../media/textures/sand5.jpg'),
  sand6: textureLoader.load('../../media/textures/sand6.jpg'),
  sand7: textureLoader.load('../../media/textures/sand7.jpg'),
  geo1: textureLoader.load('../../media/textures/geo1.jpg'),
  geo2: textureLoader.load('../../media/textures/geo2.jpg'),
  geo3: textureLoader.load('../../media/textures/geo3.jpg'),
  geo4: textureLoader.load('../../media/textures/geo4.jpg'),
  geo5: textureLoader.load('../../media/textures/geo5.jpg'),
  geo6: textureLoader.load('../../media/textures/geo6.jpg'),
  geo7: textureLoader.load('../../media/textures/geo7.jpg'),
  geo8: textureLoader.load('../../media/textures/geo8.jpg'),
  geo9: textureLoader.load('../../media/textures/geo9.jpg'),
  metal1: textureLoader.load('../../media/textures/metal1.jpg')
};

Object.values(textures).forEach(tex => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 10);
});

let customTexture = null;

// ==================
// VERTICES
// ==================
export function getClosestVertex(worldPoint) {
  const pos = geometry.attributes.position;
  const local = terrain.worldToLocal(worldPoint.clone());

  let closest = 0;
  let minDist = Infinity;

  for (let i = 0; i < pos.count; i++) {
    const dx = pos.getX(i) - local.x; // X = longueur
    const dz = pos.getZ(i) - local.z; // Z = largeur logique
    const d = dx * dx + dz * dz;

    if (d < minDist) {
      minDist = d;
      closest = i;
    }
  }
  return closest;
}

export function modifyVertex(index, deltaHeight) {
  const pos = geometry.attributes.position;
  pos.setY(index, pos.getY(index) + deltaHeight); // Z logique
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

export function setVertex(index, height) {
  const pos = geometry.attributes.position;
  pos.setY(index, height);
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

export function smoothVertex(index) {
  const pos = geometry.attributes.position;
  const cx = pos.getX(index);
  const cz = pos.getZ(index);

  for (let i = 0; i < pos.count; i++) {
    const dx = pos.getX(i) - cx;
    const dz = pos.getZ(i) - cz;
    const d = Math.sqrt(dx * dx + dz * dz);

    if (d < CELL_SIZE) {
      pos.setY(i, pos.getY(i) * (d / CELL_SIZE));
    }
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

// ==================
// MAP IMPORT / EXPORT
// ==================
export function loadMap(file) {
  const reader = new FileReader();

  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    const pos = geometry.attributes.position;

    if (data.vertices) {
      for (let i = 0; i < pos.array.length; i++) {
        pos.array[i] = data.vertices[i] ?? pos.array[i];
      }
      pos.needsUpdate = true;
      geometry.computeVertexNormals();
    }

    if (data.spawn) {
      spawn.position.fromArray(data.spawn);
    }

    if (typeof data.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(data.color)) {
      material.color.set(data.color);
      window.dispatchEvent(new CustomEvent('map-color-loaded', {
        detail: { color: data.color.toLowerCase() }
      }));
    }

    material.map = null;
    customTexture = null;
    material.needsUpdate = true;
  };

  reader.readAsText(file);
}

export function saveMap() {
  const data = {
    spawn: spawn.position.toArray(),
    texture: customTexture
      ? 'custom'
      : material.map
      ? material.map.image.src
      : null,
    color: '#' + material.color.getHexString(),
    vertices: Array.from(geometry.attributes.position.array)
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  );

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'map.json';
  a.click();
}

// ==================
// MAP COLOR / TEXTURE
// ==================
export function setMapColor(value) {
  const colors = {
    desert: '#f0e68c',
    forest: '#228b22',
    suburb: '#888888',
    mountain: '#aaaaaa'
  };

  const color = colors[value] || value;

  if (typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color)) {
    material.color.set(color);
  }
}

export function getMapColor() {
  return '#' + material.color.getHexString();
}

export function setTexture(value) {
  customTexture = null;
  material.map = value === 'none' ? null : textures[value];
  material.needsUpdate = true;
}

export function uploadTexture(file) {
  const url = URL.createObjectURL(file);

  textureLoader.load(url, tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    customTexture = tex;
    material.map = tex;
    material.needsUpdate = true;
  });
}
