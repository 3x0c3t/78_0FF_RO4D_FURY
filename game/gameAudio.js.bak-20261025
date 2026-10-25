// gameAudio.js

export let musicStarted = false;

export function startMusic() {
    if (musicStarted) return;

    window.music = new Audio('../media/music/ambiance.mp3');
    window.music.loop = true;
    window.music.volume = 0.7;

    window.selectSound = new Audio('../media/music/select_menu.mp3');
    window.selectSound.volume = 0.6;

    window.music.play().then(() => musicStarted = true).catch(() => {});
}
