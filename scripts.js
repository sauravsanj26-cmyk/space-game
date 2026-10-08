"use strict";
/*
============================================================
                    COSMIC ASSAULT
                 SPACE SHOOTER GAME
============================================================
Main features:
- Player spaceship
- Keyboard / mouse / touch controls
- Multiple enemy types
- Enemy AI
- Different weapons
- Power-ups
- Enemy waves
- Boss battles
- Health and lives
- Sheild system
- Score multiplier
- Combo system
- Particles
- Explosions
- Screen shake
- Starfield
- Background nebula
- Enemy bullets
- Player bullets
- Collision detection
- High-score storage
- Pause / resume
- Game over screen
- Game statistics
============================================================
*/

// ============================================================
// 1. CANVAS SETUP
// ============================================================

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d");

let WIDTH = window.innerWidth;
let Height = window.innerHeight;
let DPR = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
    WIDTH = window.innerWidth;
    Height = window.innerHeight;

    DPR = Math.min(window.devicePixelRatio || 1, 2);
    
    canvas.width = WIDTH * DPR;
    canvas.height = Height * DPR;

    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${Height}px`;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    if (player) {
        player.x = clamp(player.x, 30, WIDTH - 30);
        player.y = clamp(player.y, HEIGHT * 0.4, HEIGHT - 40);
    }
}
window.addEventListener("resize", resizeCanvas);
// ============================================================
// 2. UI ELEMENTS
// ============================================================

const ui = {
    score: document.getElementById("score"),
    highScore: document.getElementById("highScore"),
    wave: document.getElementById("wave"),
    lives: document.getElementById("healthFill"),

    healthFill: document.getElementById("healthFill"),

    bossBar: document.getElementById("bossBar"),
    bossHealthFill: document.getElementsById("bossHealthFill"),

    toast: document.getElementById("toast"),

    startScreen: document.getElementById("startScreen"),
    pauseScreen: document.gitElemenetById("pauseScreen"),
    gameOverScreen: document.getElementById("gameOverScreen"),
    victoryScreen: document.getElementById("victoryScreen"),


    finalScore: document.getElementById("finalScore"),
    victoryScore: document.getElementById("victoryScore"),
    recordText: document.getElementById("recordText"),

    startBtn: document.getElementById("startBtn"),
    resumeBtn: document.getElementById("resumeBtn"),
    restartBtn: document.getElementById("restartBtn"),
    victoryRestartBtn: document.getElementById("victoryRestartBtn"),
    pauseBtn: document.getElementById("pauseBtn")
};

// ============================================================
// 3. GAME STATE
// ============================================================

const game = {
    running: false,
    paused: false,
    gameOver: false,
    victory: false,
    score: 0,
    highScore: Number(
        localStorage.getItem("cosmicAssaultHighScore") || 0
    ),

    wave: 1,

    enemiesKilled: 0,
    wavesKills: 0,
    waveTarget: 10,
    spawnTimer: 0,
    waveDelay: 0,
    elapsed: 0,
    bossActive: false,
    screenShake: 0,
    screenFlash: 0,
    combo: 0,
    comboTimer: 0,
    totalShots: 0,
    totalHits: 0,
    damageTaken: 0,
    powerUpsCollected: 0,
    bossesDefeated: 0,
    startTime: 0,,
    difficulty: 1
};
// ============================================================
// 4. INPUT
// ============================================================

const keys = {};

const mouse = {
    x: WIDTH / 2,
    y: HEIGHT - 100,
    down: false,
    active: false 
};

window.addEventListener("keydown", event => {
    keys[event.key] = true;
    if(
        [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            " "
        ].includes(event.key)
    ) {
        event.preventDefault();
    }
    if (event.key.toLowerCase() === "p") {
        togglePause();   
    }
    if (event.key === "Escape") {
        togglePause();
    } 
});
window.addEventListener("keyup", event => {
    keys[event.key] = false;
});
// ============================================================
// MOUSE INPUT
// ============================================================

canvas.addEventListener("mousemove",event => {
    const rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    mouse.active = true;
});

canvas.addEventListener("mousedown", () => {
    initializeAudio();

    mouse.down = true;
    mouse.active = true;
});

window.addEventListener("mouseup", () => {
    mouse.down = false;
});

// ============================================================
// TOUCH INPUT
// ============================================================

canvas.addEventListener(
    "touchstart",
    event => {

        event.preventDefault();

        initializeAudio();

        const touch = event.touches[0];

        const rect = canvas.getBoundingClientRect();

        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;

        mouse.down = true;
        mouse.active = true;
    },
    { passive: false }
);

canvas.addEventListener(
    "touchmove",
    event => {

        event.preventDefault();

        const touch = event.touches[0];

        const rect = canvas.getBoundingClientReact();

        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    },
    { passive: false }
);

canvas.addEventListener(
    "touchend",
    event => {

        event.preventDefault();

        mouse.down = false;
    },
    { passive: false }
);

// ============================================================
// 5. UTILITY FUNCTIONS
// ============================================================

function random(min, max) {
    return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function distance(x1, y1, x2) {
    return Math.hypot(x1 - x2, y1 - y2);
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
function removeDeal(array) {
    for (let i = array.length -1; i >= 0; i--) {
        if (
            array[i].dead ||
            array[i].life <= 0
        ){
            array.splice(i, 1);
        }
    }
}
function circleCollection(a, b) {
    return distance(
        a.x,
        a.y,
        b.x,
        b.y
    ) < a.radius + b.radius;
}
// ============================================================
// 6. AUDIO SYSTEM
// ============================================================

let audioContext = null;
function initializeAudio() {
    if (!audioContex) {
      try{
        audioContext = 
        new(
            window.AudioContext ||
            window.webkitAudioContext
        )();
      } catch (error) {
        audioContext = null;
      }
    }
    if(
        audioContext &&
        audioContext.state === "suspended"
    ) {
        audioContext.resume();
    }
}
function sound(
    frequency,
    duration,
    type = "sine"
    volume = 0.03,
    slide = 0
){
    if (!audioContext) {
        return;
    }
    const oscillator =
         audioContext.createOscillator();

    const gain =
         audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(30, frequency + slide),
        audioContext.currentTime + duration
    );
    
    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(
        audioContext.currentTime + duration
    );
}
function shootSound() {
    sound(600, 0.05, "square", 0.025, -200);
}
function explosionSound(big = false) {
    sound(
        big ? 65 : 100,
        big ? 0.35 : 0.15,
        "sawtooth",
        big ? 0.055 : 0.03,
        -50
    );
}
function powerUpSound() {
    sound(450, 0.08, "sine", 0.035, 200);
    setTimeout(() => {
        sound(
            700,
            0.12,
            "sine",
            0.03,
            250
        );
    }, 50);
}
function bossSound() {
    sound(
        80,
        0.5,
        "sawtooth"
        0.06,
        30
    );
}
// ============================================================
// 7. STARFIELD
// ============================================================

const stars = [];

function createStars() {
    starts.length = 0;

    const amount =
    Math.floor(
        WIDTH * HEIGHT / 6500
    );
    for (let i = 0; i <amount; i++) {
        stars.push({
            x: random(0, WIDTH),
            y: random(0, HEIGHT),
            size: random(0.4, 2.2),
            speed: random(15, 90),
            alpha: random(0.25, 1),
            twinkle: random(1, 4),
            phase: random(0, Math.PI * 2)
        });
    }
}

function updateStars(delta) {
    for (const star of starts) {

        start.y +=
        star.speed *
        delta *
        (game.running ? 1 : 0.15);
         if (star.y > HEIGHT) {
            star.y = -5;
            star.x = random(

                0,
                WIDTH
            );
         }
    }
}
function drawStars() {
    for (const start of stars) {
        const alpha =
        clamp(
            start.alpha +
            Math.sin(
                game.elapsed *
                star.twinklw +
                star.phase
            ) * 0.2,
            0.05,
            1
        );
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#d8f6ff";
        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );
    }
    ctx.globalAlpha = 1;
}
// ============================================================
// 8. BACKGROUND
// ============================================================
function drawBackground() {
    ctx.fillStyle = "#02040d";
    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );

    const gradient1 =
    ctx.createRadialGradient(
       WIDTH * 0.2,
       HEIGHT * 0.3
       0,
       WIDTH * 0.2,
       HEIGHT * 0.3,
       WIDTH * 0.55
    );
    gradient1.addColorStop(
        0,
        "rgba(30,80,180,0.14)"
    );
    gradient1.addColorStop(
        1,
        "rgba(30,80,180,0.14)"
    );
    ctx.fillStyle = gradient1;
    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );
    const gradient2 =
    ctx.createRadialGradient(
        WIDTH * 0.8,
        HEIGHT * 0.7
        0,
        WIDTH * 0.8
        HEIGHT * 0.7
        WIDTH * 0.5
    );
    gradient2.addColorStop(
        0,
        "rgba(130,30,160,0.1)"
    );
    gradient2.addColorStop(
        1,
        "rgba(130,30,160,0)"
    );
    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );
    drawStars();
}
// ============================================================
// 9. PARTICLE SYSTEM
// ============================================================
class Particle {
    constructor(
        x,
        y,
        options = {}
    ){
        this.x = x;
        this.y = y;
        this.vx =
        options.vx ??
        random(-100, 100);
        this.vy =
        options.vy ??
        random(-100, 100);

        this.size =
        options.size ??
        random(1, 4);

        this.color =
        options.color ??
        "#58eaff";

        this.life =
        options.life ??
        random(0.3, 0.8);

        this.maxLife = this.life;

        this.gravity =
        options.gravity ??
        0;

        this.drag =
        options.drag ??
        0.97;
    }
    update(delta) {
        this.vx *=
        Math.pow(
            this.drag,
            delta * 60
        );
        this.vy *=
        Math.pow(
            this.drag,
            delta * 60
        );
        this.vy +=
        this.gravity * delta;

        this.x +=
        this.vx * delta;

        this.y +=
        this.vy * delta;

        this.life -= delta;
    }
    draw() {
        const alpha =
        clamp(
            this.life /
            this.maxLife,
            0,
            1
        );
        ctx.save();
        ctx.fillStyle = 
        this.color;

        ctx.shadowBlur = 8;
         
        ctx.shadowColor =
        this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size * alpha,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}
const particles = [];
