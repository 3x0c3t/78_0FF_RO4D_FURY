document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('enter');

  playButton.addEventListener('click', () => {
    sessionStorage.setItem('audioAllowed', 'true');
    window.location.href = 'home.html';
  });
});
