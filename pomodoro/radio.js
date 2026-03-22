// Variabler för radiomenyn
const musicToggle = document.getElementById('music-toggle');
const musicContent = document.getElementById('music-content');

// Variabler för ljudet
const radioAudio = document.getElementById('focus-radio');
const playBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-btn');

// Öppna/stäng radiomenyn
musicToggle.addEventListener('click', () => {
    musicContent.classList.toggle('open');
});

// Sätt startvolym till 50%
radioAudio.volume = volumeSlider.value;

// Spela / Pausa
playBtn.addEventListener('click', () => {
    if (radioAudio.paused) {
        radioAudio.play();
        playBtn.innerHTML = '⏸️ Pausa';
    } else {
        radioAudio.pause();
        playBtn.innerHTML = '▶️ Spela';
    }
});

// Ändra volym
volumeSlider.addEventListener('input', (e) => {
    radioAudio.volume = e.target.value;
    // Uppdatera emoji
    if (radioAudio.volume == 0) muteBtn.innerHTML = '🔇';
    else if (radioAudio.volume < 0.5) muteBtn.innerHTML = '🔉';
    else muteBtn.innerHTML = '🔊';
});

// Klicka på emojin för ljud av/på
muteBtn.addEventListener('click', () => {
    if (radioAudio.volume > 0) {
        radioAudio.dataset.lastVolume = radioAudio.volume;
        radioAudio.volume = 0;
        volumeSlider.value = 0;
        muteBtn.innerHTML = '🔇';
    } else {
        const lastVol = radioAudio.dataset.lastVolume || 0.5;
        radioAudio.volume = lastVol;
        volumeSlider.value = lastVol;
        muteBtn.innerHTML = lastVol < 0.5 ? '🔉' : '🔊';
    }
});