// ===== AUDIO =====
let musicStarted = false;
window.music = new Audio('media/music/ambiance.mp3');
window.music.loop = true;
window.music.volume = 0.7;

window.selectSound = new Audio('media/music/select_menu.mp3');
window.selectSound.volume = 0.6;

// Vérifie si l'utilisateur a autorisé le son depuis la page index
const audioAllowed = sessionStorage.getItem('audioAllowed') === 'true';

// Fonction pour lancer la musique si autorisée
function startMusic() {
    if (musicStarted || !audioAllowed) return;
    window.music.play().then(() => musicStarted = true).catch(() => {});
}

// Lancer dès que la page est prête
document.addEventListener('DOMContentLoaded', () => startMusic());

// ===== MENU PRINCIPAL =====
document.querySelectorAll('.menu-option').forEach(opt => {
    opt.addEventListener('click', () => {
        startMusic();
        if (audioAllowed) {
            window.selectSound.currentTime = 0;
            window.selectSound.play().catch(() => {});
        }

        const group = opt.dataset.menu;
        document.querySelectorAll(`.menu-option[data-menu="${group}"]`)
                .forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
    });
});

// ===== BOUTONS =====
document.getElementById('play').addEventListener('click', () => {
    startMusic();
    window.location.href = 'game/game.html';  // <--- REDIRECTION CORRECTE
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
    fill.querySelector(".value").textContent = value + "%";
}

// Initialisation des sliders
if(musicSlider && musicFill){
    updateSlider(musicSlider, musicFill);
    musicSlider.addEventListener("input", () => {
        updateSlider(musicSlider, musicFill);
        window.music.volume = musicSlider.value / 100;
    });
}

if(sfxSlider && sfxFill){
    updateSlider(sfxSlider, sfxFill);
    sfxSlider.addEventListener("input", () => {
        updateSlider(sfxSlider, sfxFill);
        window.selectSound.volume = sfxSlider.value / 100;
    });
}
