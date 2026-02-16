// Sound Kit Configuration
const kits = {
  drums: [
    { key: 'w', sound: 'sounds/tom-1.mp3', label: 'Tom 1' },
    { key: 'a', sound: 'sounds/tom-2.mp3', label: 'Tom 2' },
    { key: 's', sound: 'sounds/tom-3.mp3', label: 'Tom 3' },
    { key: 'd', sound: 'sounds/tom-4.mp3', label: 'Tom 4' },
    { key: 'j', sound: 'sounds/snare.mp3', label: 'Snare' },
    { key: 'k', sound: 'sounds/crash.mp3', label: 'Crash' },
    { key: 'l', sound: 'sounds/kick-bass.mp3', label: 'Kick' }
  ],
  guitar: [
    { key: 'w', sound: 'sounds/1.wav', label: 'Chord 1' },
    { key: 'a', sound: 'sounds/2.wav', label: 'Chord 2' },
    { key: 's', sound: 'sounds/3.wav', label: 'Chord 3' },
    { key: 'd', sound: 'sounds/4.wav', label: 'Chord 4' },
    { key: 'j', sound: 'sounds/5.wav', label: 'Chord 5' },
    { key: 'k', sound: 'sounds/6.wav', label: 'Chord 6' }
  ]
};

// State
let activeKit = 'drums';
let globalVolume = 0.5;

// DOM Elements
const display = document.getElementById('instrument-display');
const switchers = document.querySelectorAll('.switch-btn');
const volumeInput = document.getElementById('volume');
const canvas = document.getElementById('visualizer-canvas');
const ctx = canvas.getContext('2d');

// Resize Canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Render Active Kit
function renderKit(kitName) {
  display.innerHTML = '';
  const currentKit = kits[kitName];

  currentKit.forEach(item => {
    const pad = document.createElement('div');
    pad.classList.add('pad');
    pad.classList.add(item.key);
    pad.dataset.key = item.key;

    pad.innerHTML = `
      <div class="pad-key">${item.key}</div>
      <div class="pad-label">${item.label}</div>
    `;

    pad.addEventListener('mousedown', () => {
      triggerInstrument(item.key);
    });

    display.appendChild(pad);
  });
}

// Trigger Instrument (Sound + Animation + Visualizer)
function triggerInstrument(key) {
  const currentKit = kits[activeKit];
  const item = currentKit.find(i => i.key === key);

  if (item) {
    playSound(item.sound);
    animatePad(key);
    triggerVisualizerPulse();
  }
}

// Play Sound using HTML5 Audio (Works locally without CORS)
function playSound(path) {
  const audio = new Audio(path);
  audio.volume = globalVolume;
  audio.currentTime = 0;
  audio.play()
    .then(() => console.log("Audio played successfully: " + path))
    .catch(e => console.error("Audio play failed:", e));
}

// Button Animation
function animatePad(key) {
  const pad = document.querySelector(`.${key}`);
  if (pad) {
    pad.classList.add('pressed');
    setTimeout(() => pad.classList.remove('pressed'), 100);
  }
}

// Simulated Visualizer (Particle/Wave simulated effect)
let visualizerActive = false;
let waveOffset = 0;

function triggerVisualizerPulse() {
  visualizerActive = true;
  // Reset after animation
  setTimeout(() => { visualizerActive = false; }, 200);
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Base wave
  ctx.beginPath();
  const amplitude = visualizerActive ? 100 : 20; // Pulse if active
  const frequency = 0.01;
  const yBase = canvas.height * 0.8;

  ctx.moveTo(0, yBase);

  for (let x = 0; x < canvas.width; x++) {
    const y = yBase + Math.sin(x * frequency + waveOffset) * amplitude;
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = `rgba(0, 243, 255, ${visualizerActive ? 0.8 : 0.2})`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mirror wave
  ctx.beginPath();
  ctx.moveTo(0, yBase);
  for (let x = 0; x < canvas.width; x++) {
    const y = yBase - Math.sin(x * frequency + waveOffset) * amplitude;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = `rgba(255, 0, 85, ${visualizerActive ? 0.8 : 0.2})`;
  ctx.stroke();

  waveOffset += 0.1;
}
drawVisualizer();

// Event Listeners
switchers.forEach(btn => {
  btn.addEventListener('click', (e) => {
    switchers.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeKit = e.target.dataset.kit;
    renderKit(activeKit);
  });
});

volumeInput.addEventListener('input', (e) => {
  globalVolume = parseFloat(e.target.value);
});

document.addEventListener('keydown', (event) => {
  triggerInstrument(event.key.toLowerCase());
});

// Initialize
renderKit(activeKit);
