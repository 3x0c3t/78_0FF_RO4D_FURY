// footer.js

const footerContainer = document.getElementById("footer-container");

// Liste des blocs avec leurs fichiers HTML et CSS
const footerBlocs = [
    { html: "bloc1.html", css: "bloc1.css" },
    { html: "bloc2.html", css: "bloc2.css" },
    { html: "bloc3.html", css: "bloc3.css" }
];


// Fonction pour charger un fichier HTML dans un container
async function loadHTML(container, htmlPath) {
    try {
        const response = await fetch(htmlPath);
        if (!response.ok) throw new Error(`Erreur chargement ${htmlPath}: ${response.status}`);
        const html = await response.text();
        container.innerHTML += html;
    } catch (err) {
        console.error(err);
    }
}

// Fonction pour charger un fichier CSS dans <head>
function loadCSS(cssPath) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    document.head.appendChild(link);
}

// Charger les blocs **séquentiellement**
async function loadFooter() {
    for (let i = 0; i < footerBlocs.length; i++) {
        const bloc = footerBlocs[i];
        await loadHTML(footerContainer, bloc.html);
        loadCSS(bloc.css);
    }

    // Installer le listener pour le menu après que bloc3 est chargé
    const menuButton = document.getElementById("menu-button");
    const gameMenu = document.getElementById("game-menu");

    if (menuButton && gameMenu) {
        menuButton.addEventListener("click", () => {
            gameMenu.classList.toggle("hidden");
        });
    }

    console.log("Footer chargé avec tous ses blocs et menu prêt !");
}

// Lancer le chargement
loadFooter();
