const enterButton = document.getElementById('enter');

enterButton.addEventListener('click', () => {
    // autorisation audio pour la page home
    sessionStorage.setItem('audioAllowed', 'true');

    // redirection vers home.html
    window.location.href = 'home.html';
});
