// ====================================================
// Fichier : gameAudio.js
// Description : Gestion des musiques et sons du jeu
// ====================================================

export let musicStarted = false;

export function startMusic(options = {}) {
    if (musicStarted) return;

    const ambiancePath =
        options.ambiance || '../media/music/ambiance4-3x0c3t.mp3';

    const selectMenuPath =
        options.selectMenu || '../media/sound/select_menu.mp3';

    window.music = new Audio(ambiancePath);
    window.music.loop = true;
    window.music.volume = 0.7;

    window.selectSound = new Audio(selectMenuPath);
    window.selectSound.volume = 0.6;

    window.music.play()
        .then(() => {
            musicStarted = true;
        })
        .catch(error => {
            console.warn(
                'Lecture de la musique impossible :',
                error.message
            );
        });
}

// === gameAudio.js - END
