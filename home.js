// ===== SONS DE SÉLECTION =====
window.selectSound = new Audio('media/sound/select_menu.mp3');
window.selectSound.volume = 0.6;

// Vérifie si l'utilisateur a autorisé le son
const audioAllowed = sessionStorage.getItem('audioAllowed') === 'true';

// ===== MENU PRINCIPAL =====
document.querySelectorAll('.menu-option').forEach(opt => {
    opt.addEventListener('click', () => {
        if (audioAllowed) {
            window.selectSound.currentTime = 0;
            window.selectSound.play().catch(() => {});
        }

        const group = opt.dataset.menu;
        document.querySelectorAll(`.menu-option[data-menu="${group}"]`)
                .forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        // Mémoriser la map sélectionnée
        if (group === 'map' && opt.dataset.value) {
            sessionStorage.setItem('selectedMap', opt.dataset.value);
        }
    });
});

// ===== SELECTION DYNAMIQUE DES MAPS =====
const mapSelect = document.getElementById('map-select');

async function loadMapOptions() {
    if (!mapSelect) return;

    const savedMap = sessionStorage.getItem('selectedMap') || 'map';
    mapSelect.replaceChildren();

    try {
        const response = await fetch(`maps/index.json?v=${Date.now()}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const maps = await response.json();

        if (!Array.isArray(maps) ||
            !maps.some(map => map && map.value === 'map')) {
            throw new Error('Manifeste invalide ou carte par défaut absente.');
        }

        for (const map of maps) {
            if (
                !map ||
                typeof map.value !== 'string' ||
                typeof map.label !== 'string' ||
                map.value.startsWith('/') ||
                map.value.split('/').some(part => !part || part === '.' || part === '..') ||
                !/^[a-zA-Z0-9_ /()-]+$/.test(map.value)
            ) {
                continue;
            }

            const option = document.createElement('option');
            option.value = map.value;
            option.textContent = map.label;
            mapSelect.appendChild(option);
        }

        if (!Array.from(mapSelect.options).some(option => option.value === 'map')) {
            throw new Error('La carte par défaut est absente des options valides.');
        }

        const selectedExists = Array.from(mapSelect.options)
            .some(option => option.value === savedMap);

        mapSelect.value = selectedExists ? savedMap : 'map';
        sessionStorage.setItem('selectedMap', mapSelect.value);

        mapSelect.addEventListener('change', () => {
            sessionStorage.setItem('selectedMap', mapSelect.value);

            if (audioAllowed) {
                window.selectSound.currentTime = 0;
                window.selectSound.play().catch(() => {});
            }
        });

        console.log(`${mapSelect.options.length} carte(s) disponible(s).`);
    } catch (error) {
        console.error('Impossible de charger la liste des cartes :', error);

        const option = document.createElement('option');
        option.value = 'map';
        option.textContent = 'Désert (classique) - liste indisponible';
        mapSelect.appendChild(option);
        mapSelect.value = 'map';
        sessionStorage.setItem('selectedMap', 'map');
    }
}

loadMapOptions();

// ===== BOUTONS PRINCIPAUX =====
document.getElementById('play').addEventListener('click', () => {
    const mp3Frame = document.getElementById('mp3player-container').querySelector('iframe');
    if (mp3Frame && mp3Frame.contentWindow) {
        mp3Frame.contentWindow.postMessage({ action: 'play' }, '*');
    }
    // Utiliser la map sélectionnée, ou la map par défaut
    if (!sessionStorage.getItem('selectedMap')) {
        sessionStorage.setItem('selectedMap', 'map');
    }

    window.location.href = 'game/game.html';
});

document.getElementById('editor').addEventListener('click', () => {
    window.location.href = 'editor/editor.html';
});

// ===== SLIDERS AUDIO =====
const musicSlider = document.getElementById("musicVolume");
const musicFill   = document.getElementById("musicFill");
const sfxSlider   = document.getElementById("sfxVolume");
const sfxFill     = document.getElementById("sfxFill");

function colorFor(value){
    if(value < 33) return "#ff3b3b";
    if(value < 66) return "#ff9f1c";
    return "#2ecc71";
}

function updateSlider(slider, fill){
    const value = slider.value;
    fill.style.width = value + "%";
    fill.style.backgroundColor = colorFor(value);
    const valueDisplay = fill.querySelector(".value");
    if(valueDisplay) valueDisplay.textContent = value + "%";
}

// Initialisation des sliders
if(musicSlider && musicFill){
    updateSlider(musicSlider, musicFill);
    musicSlider.addEventListener("input", () => {
        updateSlider(musicSlider, musicFill);
        const mp3Frame = document.getElementById('mp3player-container').querySelector('iframe');
        if(mp3Frame && mp3Frame.contentWindow){
            mp3Frame.contentWindow.postMessage({ action: 'setVolume', value: musicSlider.value / 100 }, '*');
        }
    });
}

if(sfxSlider && sfxFill){
    updateSlider(sfxSlider, sfxFill);
    sfxSlider.addEventListener("input", () => {
        updateSlider(sfxSlider, sfxFill);
        window.selectSound.volume = sfxSlider.value / 100;
    });
}

// ===== TOGGLE LECTEUR MP3 =====
const mp3Toggle = document.getElementById('mp3-toggle');
const mp3Container = document.getElementById('mp3player-container');

mp3Toggle.addEventListener('click', () => {
    mp3Container.classList.toggle('active');
    const mp3Frame = mp3Container.querySelector('iframe');
    if(mp3Frame && mp3Frame.contentWindow){
        mp3Frame.contentWindow.postMessage({ action: 'play' }, '*');
    }
});

// ===== AUTO-PLAY MP3 SI AUTORISÉ =====
window.addEventListener('DOMContentLoaded', () => {
    if(audioAllowed){
        const mp3Frame = document.getElementById('mp3player-container').querySelector('iframe');
        if(mp3Frame && mp3Frame.contentWindow){
            mp3Frame.contentWindow.postMessage({ action: 'play' }, '*');
        }
    }
});
