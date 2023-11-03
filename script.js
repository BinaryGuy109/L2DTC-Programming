var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

// Load the images for the snake head, body, and apple
var snakeHeadImg = document.getElementById("snake-head");
var snakeBodyImg = document.getElementById("snake-body");
var appleImg = document.getElementById("apple");

var grid = 20;
var count = 0;

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4,
};

var apples = [
  {
    x: 320,
    y: 320,
  },
];

var dangerCells = [];

var frameRate = 20; // Speed of the snake
var score = 0; // Initialize the score variable

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Function to place a new apple on the canvas
function placeApple() {
  var newApple;

  do {
    newApple = {
      x: getRandomInt(0, 35) * grid,
      y: getRandomInt(0, 35) * grid,
    };
    // Ensure that the new apple does not overlap with snake cells or danger cells
  } while (
    snake.cells.some(
      (cell) => cell.x === newApple.x && cell.y === newApple.y
    ) ||
    dangerCells.some((cell) => cell.x === newApple.x && cell.y === newApple.y)
  );

  apples[0] = newApple; // Update the apple's position in the apples array
}

// Inside your code where the apple placement logic is called, replace the existing placement logic with:
placeApple();

// Function to place a new danger cell
function placeDangerCell() {
  var minDistance = 3; // Minimum distance in grid units between player and danger cell

  var newDangerCell;
  do {
    newDangerCell = {
      x: getRandomInt(0, 35) * grid,
      y: getRandomInt(0, 35) * grid,
    };
  } while (
    // Check if the new danger cell is too close to the player
    Math.abs(newDangerCell.x - snake.x) < minDistance * grid ||
    Math.abs(newDangerCell.y - snake.y) < minDistance * grid
  );

  dangerCells.push(newDangerCell);
}

// Initial placement of danger cells
for (var i = 0; i < 3; i++) {
  placeDangerCell();
}

function loop() {
  setTimeout(function () {
    requestAnimationFrame(loop);

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
      snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
      snake.x = 0;
    }

    if (snake.y < 0) {
      snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
      snake.y = 0;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    for (var i = 1; i < snake.cells.length; i++) {
      if (snake.cells[i].x === snake.x && snake.cells[i].y === snake.y) {
        alert("Game Over! Your score: " + score);
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apples[0].x = getRandomInt(0, 35) * grid;
        apples[0].y = getRandomInt(0, 35) * grid;
        score = 0; // Reset the score
        document.getElementById("score").innerHTML = "Score: " + score; // Update the displayed score
        dangerCells = [];
        for (var j = 0; j < 3; j++) {
          placeDangerCell();
        }
      }
    }

    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    context.drawImage(appleImg, apples[0].x, apples[0].y, grid, grid); // Draw the apple

    snake.cells.forEach(function (cell, index) {
      if (index === 0) {
        context.drawImage(snakeHeadImg, cell.x, cell.y, grid, grid);
      } else {
        context.drawImage(snakeBodyImg, cell.x, cell.y, grid, grid);
      }

      if (cell.x === apples[0].x && cell.y === apples[0].y) {
        score++; // Increase the score
        document.getElementById("score").innerHTML = "Score: " + score; // Update the displayed score

        // Play the sound when the snake eats an apple
        var eatSound = document.getElementById("eatSound");
        eatSound.play();

        snake.maxCells++;
        apples[0].x = getRandomInt(0, 35) * grid;
        apples[0].y = getRandomInt(0, 35) * grid;

        // Place a new danger cell
        placeDangerCell();

        if (score > highScore) {
          highScore = score;
          saveHighScore(); // Save the new high score to localStorage
          updateHighScoreDisplay(); // Update the high score display
        }
      }
    });

    // Draw and check collisions with danger cells
    for (var i = 0; i < dangerCells.length; i++) {
      context.fillStyle = "red"; // Use a red square as the danger cell
      context.fillRect(dangerCells[i].x, dangerCells[i].y, grid, grid);

      if (snake.x === dangerCells[i].x && snake.y === dangerCells[i].y) {
        alert("Game Over! Your score: " + score);
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apples[0].x = getRandomInt(0, 35) * grid;
        apples[0].y = getRandomInt(0, 35) * grid;
        score = 0; // Reset the score
        document.getElementById("score").innerHTML = "Score: " + score; // Update the displayed score
        dangerCells = [];
        for (var j = 0; j < 3; j++) {
          placeDangerCell();
        }
      }
    }
  }, 1000 / frameRate);
}

document.addEventListener("keydown", function (e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Define a variable to hold the high score
var highScore = 0;

// Function to save the high score to localStorage
function saveHighScore() {
  localStorage.setItem("highScore", highScore.toString());
}

// Function to load the high score from localStorage
function loadHighScore() {
  var savedHighScore = localStorage.getItem("highScore");
  if (savedHighScore !== null) {
    highScore = parseInt(savedHighScore);
  }
  updateHighScoreDisplay();
}

// Function to update the high score display
function updateHighScoreDisplay() {
  var highScoreElement = document.getElementById("high-score");
  highScoreElement.textContent = "High Score: " + highScore;
}

// Call loadHighScore to initialize the high score from localStorage
loadHighScore();

requestAnimationFrame(loop);
