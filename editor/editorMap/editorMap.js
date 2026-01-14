import * as THREE from '../../libs/three.module.js';
import { OrbitControls } from '../../libs/OrbitControls.js';

// ===== SCÈNE =====
const canvas = document.getElementById('map-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ===== CAMÉRA =====
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
camera.position.set(120, 140, 120);

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

// ===== LUMIÈRES =====
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(100, 200, 100);
scene.add(sun);

// ===== CONTROLS =====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== RAYCAST =====
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ===== PARAMÈTRES =====
const mapSize = 20;
const blockSize = 5;
const resolution = mapSize;

// ===== OUTILS =====
let currentTool = 'select';
let selectedVertex = -1;

// ===== TEXTURES =====
const textureLoader = new THREE.TextureLoader();
const textures = {
  sand1: textureLoader.load('../../media/textures/sand1.jpg')
};

Object.values(textures).forEach(t => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 10);
});

let customTexture = null;

// ===== TERRAIN =====
const geometry = new THREE.PlaneGeometry(
  mapSize * blockSize,
  mapSize * blockSize,
  resolution,
  resolution
);
geometry.rotateX(-Math.PI / 2);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const terrain = new THREE.Mesh(geometry, material);
scene.add(terrain);

// ===== MARQUEUR =====
const marker = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 8, 8),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
marker.visible = false;
scene.add(marker);

// ===== SPAWN =====
const spawn = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
spawn.position.y = 0.5;
scene.add(spawn);

// ===== IMPORT MAP =====
document.getElementById('map-import').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    const data = JSON.parse(ev.target.result);
    const pos = geometry.attributes.position;

    for (let i = 0; i < pos.array.length; i++) {
      pos.array[i] = data.vertices[i] ?? pos.array[i];
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    if (data.spawn) {
      spawn.position.fromArray(data.spawn);
      spawn.position.y += 0.5;
    }

    terrain.material.map = null;
    customTexture = null;
    terrain.material.needsUpdate = true;
  };
  reader.readAsText(file);
});

// ===== MENUS =====
document.getElementById('map-selector').addEventListener('change', e => {
  const colors = {
    desert: 0xf0e68c,
    forest: 0x228b22,
    suburb: 0x888888,
    mountain: 0xaaaaaa
  };
  terrain.material.color.set(colors[e.target.value]);
});

document.getElementById('texture-selector').addEventListener('change', e => {
  customTexture = null;
  terrain.material.map =
    e.target.value === 'none' ? null : textures[e.target.value];
  terrain.material.needsUpdate = true;
});

document.getElementById('texture-upload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  textureLoader.load(url, tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    customTexture = tex;
    terrain.material.map = tex;
    terrain.material.needsUpdate = true;
    document.getElementById('texture-selector').value = 'none';
  });
});

// ===== OUTILS =====
document.querySelectorAll('.menu-option').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.menu-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentTool = btn.dataset.tool;
  };
});

// ===== CLIC TERRAIN =====
canvas.addEventListener('click', e => {
  const r = canvas.getBoundingClientRect();
  mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObject(terrain);
  if (!hit.length) return;

  const point = hit[0].point;

  if (currentTool === 'set-spawn') {
    spawn.position.copy(point);
    spawn.position.y += 0.5;
    return;
  }

  selectedVertex = getClosestVertex(point);
  updateMarker(selectedVertex);

  if (currentTool === 'raise') modifyVertex(selectedVertex, 0.5);
  if (currentTool === 'lower') modifyVertex(selectedVertex, -0.5);
  if (currentTool === 'flatten') setVertex(selectedVertex, 0);
  if (currentTool === 'smooth') smoothVertex(selectedVertex);
});

// ===== VERTICES =====
function getClosestVertex(p) {
  const pos = geometry.attributes.position;
  const l = terrain.worldToLocal(p.clone());

  let best = 0, min = Infinity;
  for (let i = 0; i < pos.count; i++) {
    const dx = pos.getX(i) - l.x;
    const dz = pos.getZ(i) - l.z;
    const d = dx * dx + dz * dz;
    if (d < min) { min = d; best = i; }
  }
  return best;
}

function updateMarker(i) {
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
  terrain.localToWorld(v);
  marker.position.copy(v);
  marker.visible = true;
}

function modifyVertex(i, a) {
  const pos = geometry.attributes.position;
  pos.setY(i, pos.getY(i) + a);
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

function setVertex(i, y) {
  const pos = geometry.attributes.position;
  pos.setY(i, y);
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

function smoothVertex(i) {
  const pos = geometry.attributes.position;
  const cx = pos.getX(i), cz = pos.getZ(i);
  for (let j = 0; j < pos.count; j++) {
    const dx = pos.getX(j) - cx;
    const dz = pos.getZ(j) - cz;
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d < blockSize) pos.setY(j, pos.getY(j) * (d / blockSize));
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

// ===== SAVE =====
document.getElementById('save').onclick = () => {
  const data = {
    spawn: spawn.position.toArray(),
    texture: customTexture ? 'custom' :
             terrain.material.map ? terrain.material.map.image.src : null,
    vertices: Array.from(geometry.attributes.position.array)
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'map.json';
  a.click();
};

// ===== BACK =====
document.getElementById('back').onclick = () => {
  window.location.href = '../editor.html';
};

// ===== RESIZE =====
function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', resize);
resize();

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
