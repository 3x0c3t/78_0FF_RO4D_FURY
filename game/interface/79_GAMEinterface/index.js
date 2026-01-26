/* ====================================================
 * Fichier : index.js
 * Créé le : 2026-01-20 15:42
 * Description : Charge tous les blocs header, footer, body et gère le menu
 * ==================================================== */

// Fonction pour charger un fichier HTML dans un container
async function loadHTML(container, htmlPath) {
    const response = await fetch(htmlPath);
    const html = await response.text();
    container.innerHTML += html;
}

// Fonction pour charger un fichier CSS dans <head>
function loadCSS(cssPath) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    document.head.appendChild(link);
}

// Containers
const headerContainer = document.getElementById("header-container");
const footerContainer = document.getElementById("footer-container");
const mainContainer = document.getElementById("main-container");

// Blocs Header, Footer et Body
const headerBlocs = [
    { html: "header/bloc1.html", css: "header/bloc1.css" },
    { html: "header/bloc2.html", css: "header/bloc2.css" },
    { html: "header/bloc3.html", css: "header/bloc3.css" }
];

const footerBlocs = [
    { html: "footer/bloc1.html", css: "footer/bloc1.css" },
    { html: "footer/bloc2.html", css: "footer/bloc2.css" },
    { html: "footer/bloc3.html", css: "footer/bloc3.css" }
];

const bodyFiles = [
    { html: "body/body.html", css: "body/body.css" }
];

// Fonction pour charger les blocs séquentiellement
async function loadBlocks(container, blocks) {
    for (let bloc of blocks) {
        await loadHTML(container, bloc.html);
        loadCSS(bloc.css);
    }
}

// Fonction pour initialiser le menu du header
function initHeaderMenu() {
    const menuButton = document.getElementById("menu-button");
    const gameMenu = document.getElementById("game-menu");

    if (menuButton && gameMenu) {
        menuButton.addEventListener("click", (e) => {
            e.stopPropagation(); // pour ne pas fermer immédiatement
            gameMenu.classList.toggle("hidden");
        });

        // Fermer le menu si on clique en dehors
        document.addEventListener("click", (e) => {
            if (!gameMenu.contains(e.target) && !menuButton.contains(e.target)) {
                gameMenu.classList.add("hidden");
            }
        });
    }
}

// Fonction principale pour charger l'interface
async function loadInterface() {
    await loadBlocks(headerContainer, headerBlocs);
    initHeaderMenu(); // menu prêt après bloc3
    await loadBlocks(footerContainer, footerBlocs);
    await loadBlocks(mainContainer, bodyFiles);
    console.log("Interface de jeu prête et tous les blocs chargés !");
}

loadInterface();
