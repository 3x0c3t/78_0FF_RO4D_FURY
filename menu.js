// ===== MENU BURGER & SLIDERS =====
const menuButton = document.getElementById('menu-button');
const menuPanel = document.getElementById('menu-panel');

if(menuButton && menuPanel){
    // ouvrir/fermer menu
    menuButton.addEventListener('click', () => {
        menuPanel.style.display = menuPanel.style.display === 'block' ? 'none' : 'block';
    });

    // fermer si clic en dehors
    document.addEventListener('click', e => {
        if(!menuPanel.contains(e.target) && !menuButton.contains(e.target)){
            menuPanel.style.display = 'none';
        }
    });

    // TABS (Audio, Vidéo, Autre)
    document.querySelectorAll('#menu-panel ul li').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            document.querySelectorAll('#menu-panel ul li').forEach(t => t.classList.remove('active'));
            tabBtn.classList.add('active');
            const target = tabBtn.dataset.tab;
            document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
            const activeTab = document.getElementById('tab-' + target);
            if(activeTab) activeTab.style.display = 'block';
        });
    });

    // SLIDERS AUDIO (iframe contrôle la musique parent)
    const musicSlider = document.getElementById("musicVolume");
    const musicFill = document.getElementById("musicFill");
    const sfxSlider = document.getElementById("sfxVolume");
    const sfxFill = document.getElementById("sfxFill");

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

    // initialiser sliders
    if(musicSlider && musicFill){
        updateSlider(musicSlider, musicFill);
        musicSlider.addEventListener("input", () => {
            updateSlider(musicSlider, musicFill);
            if(window.parent.music){
                window.parent.music.volume = musicSlider.value / 100;
            }
        });
    }

    if(sfxSlider && sfxFill){
        updateSlider(sfxSlider, sfxFill);
        sfxSlider.addEventListener("input", () => {
            updateSlider(sfxSlider, sfxFill);
            if(window.parent.selectSound){
                window.parent.selectSound.volume = sfxSlider.value / 100;
            }
        });
    }
}
