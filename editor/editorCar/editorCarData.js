import * as THREE from '../../libs/three.module.js';
import { getScene } from './editorCarViewer.js';

let carBody;
const suspensions = {};

export function loadCar() {
  const scene = getScene();
  const carGroup = new THREE.Group();
  scene.add(carGroup);

  carBody = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.8, 1.6),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  carGroup.add(carBody);

  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 24);
  const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
  const springGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 12);

  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const rodMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const springMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

  ['frontLeft','frontRight','rearLeft','rearRight'].forEach(key => {
    const group = new THREE.Group();

    const rod = new THREE.Mesh(rodGeo, rodMat);
    const spring = new THREE.Mesh(springGeo, springMat);
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);

    wheel.rotation.z = Math.PI / 2;

    group.add(rod);
    group.add(spring);
    group.add(wheel);

    carGroup.add(group);

    suspensions[key] = { group, rod, spring, wheel };
  });
}

export function getCarBody() {
  return carBody;
}

export function getSuspensions() {
  return suspensions;
}
