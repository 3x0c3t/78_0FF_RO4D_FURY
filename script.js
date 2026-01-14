// état actuel des choix
const state = {
  map: 'Désert',
  vehicle: 'Buggy',
  mode: 'Free Ride',
  options: 'Par défaut'
};

// bloc aperçu unique
const preview = document.getElementById('preview-block');

// images pour les previews
const images = {
  'Désert': 'thumbs/desert.jpg',
  'Forêt': 'thumbs/forest.jpg',
  'Banlieue': 'thumbs/suburb.jpg',
  'Montagne': 'thumbs/mountain.jpg',
  'Buggy': 'thumbs/buggy.jpg',
  '4x4': 'thumbs/4x4.jpg',
  'Camion': 'thumbs/truck.jpg',
  'Free Ride': 'thumbs/freeride.jpg',
  'Time Trial': 'thumbs/timetrial.jpg',
  'Par défaut': 'thumbs/default.jpg',
  'Facile': 'thumbs/easy.jpg',
  'Difficile': 'thumbs/hard.jpg'
};

// initialisation des options
document.querySelectorAll('.menu-option').forEach(opt => {
  const menu = opt.dataset.menu;

  // selection initiale
  if (opt.dataset.value === state[menu]) opt.classList.add('selected');

  // click -> sélection
  opt.addEventListener('click', () => {
    state[menu] = opt.dataset.value;
    document.querySelectorAll(`.menu-option[data-menu="${menu}"]`).forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
  });

  // hover -> mise à jour du bloc aperçu
  opt.addEventListener('mouseenter', () => {
    preview.style.backgroundImage = `url(${images[opt.dataset.value] || ''})`;
  });

  // leave -> reset preview
  opt.addEventListener('mouseleave', () => {
    preview.style.backgroundImage = '';
  });
});

// bouton JOUER
document.getElementById('play').addEventListener('click', () => {
  alert(
    `Lancement du jeu\n` +
    `Map: ${state.map}\n` +
    `Véhicule: ${state.vehicle}\n` +
    `Mode: ${state.mode}\n` +
    `Options: ${state.options}`
  );
});

// bouton ÉDITEUR
document.getElementById('editor').addEventListener('click', () => {
  window.location.href = 'editor.html'; // ouvre la page éditeur
});
