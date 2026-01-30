// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    null,
    '#8B4513', // I - Oak Wood
    '#7CFC00', // O - Lime/Slime
    '#A0522D', // T - Dirt
    '#808080', // S - Stone
    '#FF0000', // Z - Redstone
    '#4169E1', // J - Lapis Lazuli
    '#FFD700'  // L - Gold Block
];

// Tetromino shapes
const SHAPES = [
    null,
    [[1, 1, 1, 1]], // I
    [[2, 2], [2, 2]], // O
    [[0, 3, 0], [3, 3, 3]], // T
    [[0, 4, 4], [4, 4, 0]], // S
    [[5, 5, 0], [0, 5, 5]], // Z
    [[6, 0, 0], [6, 6, 6]], // J
    [[0, 0, 7], [7, 7, 7]]  // L
];

// Game state
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop = null;
let dropInterval = 1000;
let lastDropTime = 0;

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');

// UI elements
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverDiv = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

// Initialize board
function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Piece class
class Piece {
    constructor(shape) {
        this.shape = shape;
        this.type = shape;
        this.matrix = SHAPES[shape];
        this.x = Math.floor(COLS / 2) - Math.floor(this.matrix[0].length / 2);
        this.y = 0;
    }

    rotate() {
        const rotated = this.matrix[0].map((_, i) =>
            this.matrix.map(row => row[i]).reverse()
        );

        const previousMatrix = this.matrix;
        this.matrix = rotated;

        // Wall kick
        if (this.collides()) {
            this.matrix = previousMatrix;
        }
    }

    collides() {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] !== 0) {
                    const newX = this.x + x;
                    const newY = this.y + y;

                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return true;
                    }

                    if (newY >= 0 && board[newY][newX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

// Generate random piece
function randomPiece() {
    const shapeIndex = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
    return new Piece(shapeIndex);
}

// Draw block
function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] !== 0) {
                drawBlock(ctx, x, y, COLORS[board[y][x]]);
            }
        }
    }
}

// Draw current piece
function drawPiece() {
    if (!currentPiece) return;

    for (let y = 0; y < currentPiece.matrix.length; y++) {
        for (let x = 0; x < currentPiece.matrix[y].length; x++) {
            if (currentPiece.matrix[y][x] !== 0) {
                drawBlock(ctx, currentPiece.x + x, currentPiece.y + y, COLORS[currentPiece.matrix[y][x]]);
            }
        }
    }
}

// Draw next piece
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!nextPiece) return;

    const offsetX = (nextCanvas.width / BLOCK_SIZE - nextPiece.matrix[0].length) / 2;
    const offsetY = (nextCanvas.height / BLOCK_SIZE - nextPiece.matrix.length) / 2;

    for (let y = 0; y < nextPiece.matrix.length; y++) {
        for (let x = 0; x < nextPiece.matrix[y].length; x++) {
            if (nextPiece.matrix[y][x] !== 0) {
                drawBlock(nextCtx, offsetX + x, offsetY + y, COLORS[nextPiece.matrix[y][x]]);
            }
        }
    }
}

// Merge piece to board
function mergePiece() {
    for (let y = 0; y < currentPiece.matrix.length; y++) {
        for (let x = 0; x < currentPiece.matrix[y].length; x++) {
            if (currentPiece.matrix[y][x] !== 0) {
                board[currentPiece.y + y][currentPiece.x + x] = currentPiece.matrix[y][x];
            }
        }
    }
}

// Clear lines
function clearLines() {
    let linesCleared = 0;

    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++; // Check the same row again
        }
    }

    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * level;

        // Level up every 10 lines
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);

        updateScore();
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

// Move piece
function movePiece(dx, dy) {
    currentPiece.x += dx;
    currentPiece.y += dy;

    if (currentPiece.collides()) {
        currentPiece.x -= dx;
        currentPiece.y -= dy;

        if (dy > 0) {
            mergePiece();
            clearLines();
            spawnPiece();
        }
    }
}

// Drop piece
function dropPiece() {
    movePiece(0, 1);
}

// Hard drop
function hardDrop() {
    while (!currentPiece.collides()) {
        currentPiece.y++;
    }
    currentPiece.y--;
    mergePiece();
    clearLines();
    spawnPiece();
}

// Spawn new piece
function spawnPiece() {
    currentPiece = nextPiece || randomPiece();
    nextPiece = randomPiece();
    drawNextPiece();

    if (currentPiece.collides()) {
        gameOver();
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    gamePaused = false;
    cancelAnimationFrame(gameLoop);

    finalScoreElement.textContent = score;
    gameOverDiv.classList.remove('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Start game
function startGame() {
    board = createBoard();
    currentPiece = null;
    nextPiece = null;
    score = 0;
    level = 1;
    lines = 0;
    dropInterval = 1000;
    gamePaused = false;

    updateScore();
    gameOverDiv.classList.add('hidden');

    spawnPiece();
    gameRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    lastDropTime = performance.now();
    gameLoop = requestAnimationFrame(update);
}

// Pause game
function togglePause() {
    if (!gameRunning) return;

    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';

    if (!gamePaused) {
        lastDropTime = performance.now();
        gameLoop = requestAnimationFrame(update);
    }
}

// Game loop
function update(currentTime) {
    if (!gameRunning || gamePaused) return;

    const deltaTime = currentTime - lastDropTime;

    if (deltaTime > dropInterval) {
        dropPiece();
        lastDropTime = currentTime;
    }

    drawBoard();
    drawPiece();

    gameLoop = requestAnimationFrame(update);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;

    switch (e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            dropPiece();
            lastDropTime = performance.now();
            break;
        case 'ArrowUp':
            currentPiece.rotate();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            lastDropTime = performance.now();
            break;
    }

    drawBoard();
    drawPiece();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        togglePause();
    }
});

// Button event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', startGame);

// Initial draw
drawBoard();
