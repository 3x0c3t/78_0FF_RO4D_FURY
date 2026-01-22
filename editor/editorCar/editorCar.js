// editorMap.js

import { initRenderer, render, resize } from './editorCarViewer.js';
import { loadCar, getCarBody, getSuspensions } from './editorCarData.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('car-canvas');
  initRenderer(canvas);
  loadCar();

  const inputs = {
    sizeX: document.getElementById('car-size-x'),
    sizeY: document.getElementById('car-size-y'),
    sizeZ: document.getElementById('car-size-z'),
    color: document.getElementById('car-color'),
    rest: document.getElementById('suspension-rest'),
    travel: document.getElementById('suspension-travel'),
    compression: document.getElementById('suspension-compression')
  };

  const buttons = {
    save: document.getElementById('save'),
    back: document.getElementById('back'),
    import: document.getElementById('import-car')
  };

  function updateCar() {
    const body = getCarBody();
    const susp = getSuspensions();
    if (!body) return;

    const x = +inputs.sizeX.value;
    const y = +inputs.sizeY.value;
    const z = +inputs.sizeZ.value;

    body.scale.set(x / 3, y / 0.8, z / 1.6);
    body.position.y = y / 2;
    body.material.color.set(inputs.color.value);

    const halfX = x / 2;
    const halfZ = z / 2;

    const rest = +inputs.rest.value;
    const travel = +inputs.travel.value;
    const compression = +inputs.compression.value;

    const layout = {
      frontLeft:  [-halfX,  halfZ],
      frontRight: [ halfX,  halfZ],
      rearLeft:   [-halfX, -halfZ],
      rearRight:  [ halfX, -halfZ]
    };

    Object.entries(layout).forEach(([key, pos]) => {
      const s = susp[key];
      if (!s) return;

      const yPos = rest - compression;

      s.group.position.set(pos[0], 0, pos[1]);

      s.rod.scale.y = travel;
      s.spring.scale.y = travel;

      s.rod.position.y = yPos + travel / 2;
      s.spring.position.y = yPos + travel / 2;
      s.wheel.position.y = yPos;
    });
  }

  Object.values(inputs).forEach(el => {
    if (!el) return;
    ['input','change'].forEach(evt => el.addEventListener(evt, updateCar));
  });

  window.addEventListener('resize', resize);

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  animate();
  updateCar();

  // ===== SAUVEGARDE =====
  if (buttons.save) buttons.save.addEventListener('click', () => {
    const data = {
      sizeX: +inputs.sizeX.value,
      sizeY: +inputs.sizeY.value,
      sizeZ: +inputs.sizeZ.value,
      color: inputs.color.value,
      suspRest: +inputs.rest.value,
      suspTravel: +inputs.travel.value,
      suspCompression: +inputs.compression.value
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicle.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // ===== CHARGEMENT =====
  if (buttons.import) buttons.import.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.sizeX !== undefined) inputs.sizeX.value = data.sizeX;
        if (data.sizeY !== undefined) inputs.sizeY.value = data.sizeY;
        if (data.sizeZ !== undefined) inputs.sizeZ.value = data.sizeZ;
        if (data.color !== undefined) inputs.color.value = data.color;
        if (data.suspRest !== undefined) inputs.rest.value = data.suspRest;
        if (data.suspTravel !== undefined) inputs.travel.value = data.suspTravel;
        if (data.suspCompression !== undefined) inputs.compression.value = data.suspCompression;

        updateCar();
      } catch (err) {
        alert('Fichier invalide');
        console.error(err);
      }
    };
    reader.readAsText(file);
  });

  // ===== BOUTON RETOUR =====
  if (buttons.back) buttons.back.addEventListener('click', () => {
    window.history.back();
  });
});
