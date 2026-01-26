// bloc1

const bloc1 = document.querySelector(".bloc1");

if (bloc1) {
    // Références des éléments du HUD
    const vehicleData = {
        speed: document.querySelector("#speed"),
        incline: document.querySelector("#incline"),
        weight: document.querySelector("#weight"),
        battery: document.querySelector("#battery"),
    };

    // Crée un label flottant au hover (optionnel)
    function createLabel(parent, text) {
        const span = document.createElement("span");
        span.className = "percent-label"; // on réutilise le style HUD
        span.textContent = text;
        parent.style.position = "relative";
        parent.appendChild(span);
    }

    // Hover effect : agrandit le bloc et ajoute les labels
    bloc1.addEventListener("mouseenter", () => {
        bloc1.style.transform = "translateY(70px)";
        bloc1.style.width = "380px";
        bloc1.style.padding = "20px";

        Object.values(vehicleData).forEach(el => {
            if (el && !el.querySelector(".percent-label")) {
                createLabel(el, el.textContent);
            }
        });
    });

    // Retour à l'état normal
    bloc1.addEventListener("mouseleave", () => {
        bloc1.style.transform = "translateY(0)";
        bloc1.style.width = "320px";
        bloc1.style.padding = "14px";

        Object.values(vehicleData).forEach(el => {
            const label = el.querySelector(".percent-label");
            if (label) label.remove();
        });
    });

    // Mise à jour des valeurs HUD (simulation pour le moment)
    function updateHUD() {
        vehicleData.speed.textContent = `${Math.floor(Math.random() * 200)} km/h`;
        vehicleData.incline.textContent = `X:${(Math.random() * 20 - 10).toFixed(1)}° Y:${(Math.random() * 20 - 10).toFixed(1)}° Z:${Math.floor(Math.random() * 360)}°`;
        vehicleData.weight.textContent = `${Math.floor(1000 + Math.random() * 500)} kg`;
        vehicleData.battery.textContent = `${Math.floor(20 + Math.random() * 80)}%`;
    }

    // Update HUD toutes les 0.5 secondes
    setInterval(updateHUD, 500);
}
