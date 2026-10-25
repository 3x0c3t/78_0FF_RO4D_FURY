// ====================================================
// Fichier : footer.js
// Description : Chargement des blocs du footer et menu
// ====================================================

// Répertoire réel de ce script
const footerScriptURL = document.currentScript.src;
const footerBaseURL = new URL('./', footerScriptURL);

const footerContainer = document.getElementById('footer-container');

const footerBlocs = [
    { html: 'bloc1.html', css: 'bloc1.css' },
    { html: 'bloc2.html', css: 'bloc2.css' },
    { html: 'bloc3.html', css: 'bloc3.css' }
];

// Charger une feuille CSS depuis le répertoire du footer
function loadCSS(cssPath) {
    const href = new URL(cssPath, footerBaseURL).href;

    // Éviter de charger plusieurs fois la même feuille
    if ([...document.querySelectorAll('link[rel="stylesheet"]')]
        .some(link => link.href === href)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Charger les styles nécessaires à l'interface
loadCSS('../reset.css');
loadCSS('../index.css');
loadCSS('footer.css');

// Charger un bloc HTML
async function loadHTML(container, htmlPath) {
    if (!container) {
        console.error('Conteneur du footer introuvable.');
        return;
    }

    const url = new URL(htmlPath, footerBaseURL);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        container.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        console.error(
            `Erreur de chargement du bloc ${url.href} :`,
            error
        );
    }
}

// Charger les blocs dans l'ordre
async function loadFooter() {
    if (!footerContainer) {
        console.error('Élément #footer-container introuvable.');
        return;
    }

    for (const bloc of footerBlocs) {
        await loadHTML(footerContainer, bloc.html);
        loadCSS(bloc.css);
    }

    const menuButton = document.getElementById('menu-button');
    const gameMenu = document.getElementById('game-menu');

    if (menuButton && gameMenu) {
        menuButton.addEventListener('click', event => {
            event.stopPropagation();
            gameMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', event => {
            if (
                !gameMenu.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                gameMenu.classList.add('hidden');
            }
        });
    }

    console.log('Footer chargé avec tous ses blocs et menu prêt !');
}

loadFooter();

// === footer.js - END
