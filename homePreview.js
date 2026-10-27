import * as THREE from './libs/three.module.js';

const container = document.getElementById('preview-block');
const mapSelect = document.getElementById('map-select');

if (!container || !mapSelect) {
    console.error('[MapPreview] Conteneur ou sélecteur de map introuvable.');
} else {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.set(100, 90, 120);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.borderRadius = '4px';

    container.replaceChildren(renderer.domElement);
    container.style.overflow = 'hidden';

    scene.add(new THREE.HemisphereLight(0xffffff, 0x383838, 2));

    const sunlight = new THREE.DirectionalLight(0xffffff, 2);
    sunlight.position.set(100, 150, 100);
    scene.add(sunlight);

    let terrain = null;
    let spawnMarker = null;
    let currentRequest = 0;
    let cameraAngle = 0;
    let terrainRadius = 100;

    function resize() {
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener('resize', resize);
    resize();

    function clearTerrain() {
        if (terrain) {
            scene.remove(terrain);
            terrain.geometry.dispose();

            const materials = Array.isArray(terrain.material)
                ? terrain.material
                : [terrain.material];

            for (const material of materials) {
                if (material.map) material.map.dispose();
                material.dispose();
            }

            terrain = null;
        }

        if (spawnMarker) {
            scene.remove(spawnMarker);
            spawnMarker.geometry.dispose();
            spawnMarker.material.dispose();
            spawnMarker = null;
        }
    }

    async function loadPreview(name) {
        const requestId = ++currentRequest;

        container.dataset.loading = 'true';

        try {
            if (
                typeof name !== 'string' ||
                name.startsWith('/') ||
                name.split('/').some(part =>
                    !part || part === '.' || part === '..'
                ) ||
                !/^[a-zA-Z0-9_ /()-]+$/.test(name)
            ) {
                throw new Error('Nom de map invalide.');
            }

            const mapURL = new URL(
                `./maps/${name}.json`,
                window.location.href
            );

            const response = await fetch(mapURL, { cache: 'no-store' });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} lors du chargement.`);
            }

            const data = await response.json();

            if (!Array.isArray(data.vertices) || data.vertices.length !== 1323) {
                throw new Error('Géométrie invalide : 1323 valeurs attendues.');
            }

            let texture = null;

            if (data.texture) {
                const textureURL = new URL(data.texture, mapURL);
                texture = await new THREE.TextureLoader().loadAsync(
                    textureURL.href
                );
                texture.colorSpace = THREE.SRGBColorSpace;
            }

            // Une sélection plus récente annule cette prévisualisation.
            if (requestId !== currentRequest) {
                if (texture) texture.dispose();
                return;
            }

            clearTerrain();

            const mapSize = 20;
            const blockSize = 5;

            const geometry = new THREE.PlaneGeometry(
                mapSize * blockSize,
                mapSize * blockSize,
                mapSize,
                mapSize
            );

            geometry.rotateX(-Math.PI / 2);

            const positions = geometry.attributes.position;

            for (let i = 0; i < positions.array.length; i++) {
                positions.array[i] = Number.isFinite(data.vertices[i])
                    ? data.vertices[i]
                    : positions.array[i];
            }

            positions.needsUpdate = true;
            geometry.computeVertexNormals();

            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                map: texture,
                roughness: 1,
                metalness: 0
            });

            terrain = new THREE.Mesh(geometry, material);
            terrain.rotation.y = 0;
            scene.add(terrain);

            // Repère du point de spawn.
            const spawn = Array.isArray(data.spawn) &&
                data.spawn.length >= 3 &&
                data.spawn.every(Number.isFinite)
                ? data.spawn
                : [0, 2, 0];

            const markerGeometry = new THREE.ConeGeometry(2.5, 6, 12);
            const markerMaterial = new THREE.MeshStandardMaterial({
                color: 0xff9900,
                emissive: 0x552200
            });

            spawnMarker = new THREE.Mesh(markerGeometry, markerMaterial);
            spawnMarker.position.set(
                spawn[0],
                spawn[1] + 5,
                spawn[2]
            );
            scene.add(spawnMarker);

            terrainRadius = 100;
            cameraAngle = 0;

            camera.position.set(100, 90, 120);
            camera.lookAt(0, 0, 0);

            console.log(`[MapPreview] Map affichée : ${name}`);
        } catch (error) {
            if (requestId === currentRequest) {
                console.error('[MapPreview] Échec :', error);
            }
        } finally {
            if (requestId === currentRequest) {
                container.dataset.loading = 'false';
            }
        }
    }

    mapSelect.addEventListener('change', () => {
        loadPreview(mapSelect.value);
    });

    // Animation indépendante du moteur de jeu.
    function animate() {
        requestAnimationFrame(animate);

        if (terrain) {
            cameraAngle += 0.0018;

            const distance = terrainRadius * 1.1;

            camera.position.x = Math.sin(cameraAngle) * distance;
            camera.position.z = Math.cos(cameraAngle) * distance;
            camera.position.y = terrainRadius * 0.75;

            camera.lookAt(0, 0, 0);

            if (spawnMarker) {
                spawnMarker.rotation.y += 0.01;
            }
        }

        renderer.render(scene, camera);
    }

    loadPreview(mapSelect.value || 'map');
    animate();
}
