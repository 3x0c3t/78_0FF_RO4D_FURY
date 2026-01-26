// ===== ÉLÉMENTS DOM =====
const audio = document.getElementById("audio");
const screen = document.getElementById("screen");

const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const volumeSlider = document.getElementById("volume");
const volumeDisplay = document.getElementById("volumeDisplay");
const volumeWrapper = document.getElementById("volumeWrapper");

const playPauseBtn = document.getElementById("playPause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const shuffleStatus = document.getElementById("shuffleStatus");
const repeatStatus = document.getElementById("repeatStatus");

const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");

// ===== PLAYLIST (fichiers renommés) =====
const playlist = [
    { file: "../media/music/OFF_RO4D_FURY_mainTheme.mp3", title: "OFF_RO4D_FURY Main Theme", artist: "-3x0c3t-" },
    { file: "../media/music/Game_Ambiance-3x0c3t.mp3", title: "Game Ambiance", artist: "-3x0c3t-" },
    { file: "../media/music/SOUND_Test-3x0c3t.mp3", title: "Sound Test", artist: "-3x0c3t-" },
    { file: "../media/music/SUNDAY_somewhere-3x0c3t.mp3", title: "Sunday Somewhere", artist: "-3x0c3t-" },
    { file: "../media/music/ShiKiKiBoum-3x0c3t.mp3", title: "ShiKiKiBoum", artist: "-3x0c3t-" },
    { file: "../media/music/WEDNESDAY_MooD-3x0c3t.mp3", title: "Wednesday MooD", artist: "-3x0c3t-" },
    { file: "../media/music/ambiance-3x0c3t.mp3", title: "Ambiance 1", artist: "-3x0c3t-" },
    { file: "../media/music/ambiance4-3x0c3t.mp3", title: "Ambiance 4", artist: "-3x0c3t-" },
    { file: "../media/music/shrutiBox_Test-3x0c3t.mp3", title: "ShrutiBox Test", artist: "-3x0c3t-" }
];

let current = 0; // premier morceau = OFF_RO4D_FURY_mainTheme
let playing = false;
let shuffle = false;
let repeat = false;

// ===== WEB AUDIO POUR ANIMATION =====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
let source = null;
analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);

function connectAudio() {
    if (!source) {
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
}

// ===== UTILITAIRES =====
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function loadTrack(i) {
    const track = playlist[i];
    audio.src = track.file;
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    audio.play().catch(()=>{}); // lance la musique si autorisé
    updatePlayIcons(true);
}

// ===== CONTRÔLES =====
function updatePlayIcons(isPlaying) {
    playIcon.style.display = isPlaying ? "none" : "block";
    pauseIcon.style.display = isPlaying ? "block" : "none";
    playing = isPlaying;
}

playPauseBtn.onclick = () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (audio.paused) audio.play();
    else audio.pause();
    updatePlayIcons(!audio.paused);
};

nextBtn.onclick = () => {
    current = shuffle ? Math.floor(Math.random() * playlist.length) : (current + 1) % playlist.length;
    loadTrack(current);
};

prevBtn.onclick = () => {
    current = (current - 1 + playlist.length) % playlist.length;
    loadTrack(current);
};

shuffleBtn.onclick = () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active", shuffle);
    shuffleStatus.textContent = shuffle ? "SHF ON" : "SHF OFF";
};

repeatBtn.onclick = () => {
    repeat = !repeat;
    repeatBtn.classList.toggle("active", repeat);
    repeatStatus.textContent = repeat ? "REP ON" : "REP OFF";
};

// ===== VOLUME =====
volumeSlider.oninput = () => {
    audio.volume = volumeSlider.value / 100;
    volumeDisplay.textContent = `VOL ${volumeSlider.value}%`;
    const t = volumeSlider.value / 100;
    const r = Math.round(17 + (255 - 17) * t);
    const g = Math.round(17 + (204 - 17) * t);
    const b = Math.round(7 + (0 - 7) * t);
    volumeWrapper.style.background = `rgb(${r},${g},${b})`;
};

// ===== ÉVÉNEMENTS AUDIO =====
audio.addEventListener("loadedmetadata", () => durationEl.textContent = formatTime(audio.duration));
audio.addEventListener("timeupdate", () => currentTimeEl.textContent = formatTime(audio.currentTime));
audio.addEventListener("ended", () => {
    if (repeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextBtn.click();
    }
});

// ===== ANIMATION BACKGROUND =====
function animateBackground() {
    requestAnimationFrame(animateBackground);
    if (!playing) return;
    analyser.getByteFrequencyData(dataArray);
    let avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    avg = avg / 255;
    const r = Math.floor(17 + (255 - 17) * avg);
    const g = Math.floor(17 + (204 - 17) * avg);
    const b = Math.floor(7 + (0 - 7) * avg);
    screen.style.background = `radial-gradient(circle, rgba(${r},${g},${b},1) 0%, #070707 46%, rgba(${r},${g},${b},1) 100%)`;
}

// ===== POSTMESSAGE =====
window.addEventListener('message', (e) => {
    const msg = e.data;
    if(!msg || !msg.action) return;

    switch(msg.action) {
        case 'play': 
            if(audioCtx.state === 'suspended') audioCtx.resume();
            audio.play().catch(()=>{});
            updatePlayIcons(true);
            break;
        case 'pause': 
            audio.pause();
            updatePlayIcons(false);
            break;
        case 'next': nextBtn.click(); break;
        case 'prev': prevBtn.click(); break;
        case 'setVolume': 
            audio.volume = msg.value;
            volumeSlider.value = msg.value * 100;
            volumeDisplay.textContent = `VOL ${Math.round(msg.value*100)}%`;
            break;
        case 'loadTrack':
            if(msg.index >= 0 && msg.index < playlist.length) loadTrack(msg.index);
            break;
    }
});

// ===== INIT =====
audio.volume = 0.5;
loadTrack(current);
connectAudio();
animateBackground();

// ===== AUTO-PLAY DU PREMIER MORCEAU =====
window.addEventListener('DOMContentLoaded', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audio.play().catch(() => {
        console.log("Auto-play bloqué par le navigateur, attendre interaction utilisateur.");
    });
    updatePlayIcons(true);
});
