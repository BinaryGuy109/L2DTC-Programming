const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const cellSize = 20;
const gridSize = canvas.width / cellSize;

let snake = [{ x: 5, y: 5 }];
let direction = 'right';

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });
}

function moveSnake() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === 'right') headX++;
    if (direction === 'left') headX--;
    if (direction === 'up') headY--;
    if (direction === 'down') headY++;

    snake.unshift({ x: headX, y: headY });
    snake.pop();
}

function gameLoop() {
    drawSnake();
    moveSnake();
    setTimeout(gameLoop, 200);
}

gameLoop();

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});
