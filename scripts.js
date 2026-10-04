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
