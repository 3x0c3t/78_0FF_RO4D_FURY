// editorMap.js
// Glue code UI + interactions
// Convention logique :
// X = longueur | Y = largeur | Z = hauteur

import {
  terrain,
  spawn,
  marker,
  loadMap,
  saveMap,
  setMapColor,
  setTexture,
  uploadTexture,
  getClosestVertex,
  modifyVertex,
  setVertex,
  smoothVertex
} from './editorMapData.js';

import {
  scene,
  camera,
  raycaster,
  mouse,
  resize,
  animate
} from './editorMapViewer.js';

// ==================
// SCENE SETUP
// ==================
scene.add(terrain);
scene.add(spawn);
scene.add(marker);

// ==================
// TOOLS
// ==================
let currentTool = 'select';

// ==================
// UI : MAP IMPORT
// ==================
document.getElementById('map-import').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) loadMap(file);
});

// ==================
// UI : MAP SELECTOR
// ==================
document.getElementById('map-selector').addEventListener('change', e => {
  setMapColor(e.target.value);
});

// ==================
// UI : TEXTURES
// ==================
document.getElementById('texture-selector').addEventListener('change', e => {
  setTexture(e.target.value);
});

document.getElementById('texture-upload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) uploadTexture(file);
});

// ==================
// UI : TOOLS
// ==================
document.querySelectorAll('.menu-option').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.menu-option')
      .forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentTool = btn.dataset.tool;
  };
});

// ==================
// TERRAIN CLICK
// ==================
const canvas = document.getElementById('map-canvas');

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();

  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(terrain);
  if (!hits.length) return;

  const point = hits[0].point;

  // Définition du spawn
  if (currentTool === 'set-spawn') {
    spawn.position.set(
      point.x,        // X = longueur
      point.y + 2,    // Z logique = hauteur → Y Three.js
      point.z         // Y = largeur
    );
    return;
  }

  const vertexIndex = getClosestVertex(point);

  if (currentTool === 'raise')   modifyVertex(vertexIndex, 0.5);
  if (currentTool === 'lower')   modifyVertex(vertexIndex, -0.5);
  if (currentTool === 'flatten') setVertex(vertexIndex, 0);
  if (currentTool === 'smooth')  smoothVertex(vertexIndex);
});

// ==================
// SAVE / BACK
// ==================
document.getElementById('save').onclick = saveMap;

document.getElementById('back').onclick = () => {
  window.location.href = '../editor.html';
};

// ==================
// START
// ==================
window.addEventListener('resize', resize);
resize();
animate();
