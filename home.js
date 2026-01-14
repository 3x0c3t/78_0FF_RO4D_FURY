let musicStarted = false;

// musique de fond
const music = new Audio('media/music/ambiance.mp3');
music.loop = true;
music.volume = 0.4;

// son de sélection menu
const selectSound = new Audio('media/music/select_menu.mp3');
selectSound.volume = 0.6;

// autorisation venant de la page index
const audioAllowed = sessionStorage.getItem('audioAllowed') === 'true';

function startMusic() {
  if (musicStarted || !audioAllowed) return;

  music.play().then(() => {
    musicStarted = true;
  }).catch(() => {
    // autoplay refusé, on attendra une interaction
  });
}

// tentative immédiate au chargement
document.addEventListener('DOMContentLoaded', () => {
  startMusic();
});

document.querySelectorAll('.menu-option').forEach(opt => {
  opt.addEventListener('click', () => {
    // démarre la musique si besoin
    startMusic();

    // joue le son de sélection
    if (audioAllowed) {
      selectSound.currentTime = 0;
      selectSound.play().catch(() => {});
    }

    const group = opt.dataset.menu;
    document
      .querySelectorAll(`.menu-option[data-menu="${group}"]`)
      .forEach(o => o.classList.remove('active'));

    opt.classList.add('active');
  });
});

document.getElementById('play').addEventListener('click', () => {
  startMusic();
  console.log('Lancer le jeu');
});

document.getElementById('editor').addEventListener('click', () => {
  window.location.href = 'editor/editor.html';
});
