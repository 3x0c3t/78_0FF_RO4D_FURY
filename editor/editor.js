// Bouton Éditeur Map
document.getElementById('map-editor').addEventListener('click', () => {
  // Redirection vers l'éditeur de map
  window.location.href = 'editorMap/editorMap.html';
});

// Bouton Éditeur Véhicule
document.getElementById('car-editor').addEventListener('click', () => {
  // Redirection vers l'éditeur de véhicule
  window.location.href = 'editorCar/editorCar.html';
});

// Bouton Retour vers l'accueil
document.getElementById('editor-back').addEventListener('click', () => {
  window.location.href = '../index.html';
});
