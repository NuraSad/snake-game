const snakeboard = document.getElementById("gameCanvas");
const snakeboardCtx = gameCanvas.getContext("2d");
let canvasHeight = Math.round(document.documentElement.clientHeight * 0.55);
const btnStart = document.getElementById("btnStart");
const popUp = document.getElementById("popUp");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const btnOK = document.getElementById("btnOK");
const eatSound = new Audio("eatFood.wav");
const endGame = new Audio("lose.wav");
eatSound.volume = 0.3;
endGame.volume = 0.5;
let score = 0;
let maxScore = 0;
const step = Math.floor(canvasHeight / 40);
snakeboard.height = step * 40;
snakeboard.width = snakeboard.height;
console.log(snakeboard.height);
const startPosition = step * 20;

let snake = [
  { x: startPosition, y: startPosition },
  { x: startPosition - step, y: startPosition },
  { x: startPosition - step * 2, y: startPosition },
  { x: startPosition - step * 3, y: startPosition },
  { x: startPosition - step * 4, y: startPosition },
];

const food = { x: undefined, y: undefined };
const boardBorder = "black";
const boardBackground = "white";
const snakeCol = "lightgreen";
const snakeBorder = "darkgreen";
let dx = step;
let dy = 0;
let changingDirection = false;

clearCanvas();

btnStart.addEventListener("click", startGame);

function startGame() {
  btnStart.style.visibility = "hidden";
  start();
  foodCoordinate();
}

document.addEventListener("keydown", changeDirection);
btnYes.addEventListener("click", restart);
btnNo.addEventListener("click", showGameStats);
btnOK.addEventListener("click", reloadPage);

function start() {
  changingDirection = false;
  setTimeout(function onSnakeMove() {
    clearCanvas();
    drawSnake();
    drawFood();
    moveSnake();
    if (hasGameEnded()) {
      endGame.play();
      console.log(snake);
      maxScore = Math.max(maxScore, score);
      popUp.classList.add("popUp-gameover");
      return;
    }
    start();
  }, 100);
}

function clearCanvas() {
  snakeboardCtx.fillStyle = boardBackground;
  snakeboardCtx.strokestyle = boardBorder;
  snakeboardCtx.fillRect(0, 0, snakeboard.height, snakeboard.height);
  snakeboardCtx.strokeRect(0, 0, snakeboard.height, snakeboard.height);
}

function drawSnakePart(snakePart) {
  snakeboardCtx.fillStyle = snakeCol;
  snakeboardCtx.strokestyle = snakeBorder;
  snakeboardCtx.fillRect(snakePart.x, snakePart.y, step, step);
  snakeboardCtx.strokeRect(snakePart.x, snakePart.y, step, step);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawFood() {
  snakeboardCtx.fillStyle = "lightblue";
  snakeboardCtx.strokestyle = "darkblue";
  snakeboardCtx.fillRect(food.x, food.y, step, step);
  snakeboardCtx.strokeRect(food.x, food.y, step, step);
}

function generateRandomCoordinate(min, max) {
  return Math.round((Math.random() * (max - min) + min) / step) * step;
}

function foodCoordinate() {
  food.x = generateRandomCoordinate(0, snakeboard.height - step);
  food.y = generateRandomCoordinate(0, snakeboard.height - step);
  snake.forEach(function ifSnakePart(part) {
    const snakePart = part.x == food.x && part.y == food.y;
    if (snakePart) foodCoordinate();
  });
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const hasEatenFood = snake[0].x == food.x && snake[0].y == food.y;
  if (hasEatenFood) {
    eatSound.play();
    score += 10;
    document.getElementById("score").textContent = "Score: " + score;
    // Generate new food location
    foodCoordinate();
  } else {
    // Remove the last part of snake body
    snake.pop();
  }
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changingDirection) return;
  changingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -step;
  const goingDown = dy === step;
  const goingRight = dx === step;
  const goingLeft = dx === -step;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -step;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -step;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = step;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = step;
  }
}

function hasGameEnded() {
  for (let i = 4; i < snake.length; i++) {
    const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (hasCollided) {
      return true;
    }
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.height - step;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - step;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function restart() {
  popUp.classList.remove("popUp-gameover");
  score = 0;
  document.getElementById("score").textContent = "Score: " + score;
  snake = [
    { x: startPosition, y: startPosition },
    { x: startPosition - step, y: startPosition },
    { x: startPosition - step * 2, y: startPosition },
    { x: startPosition - step * 3, y: startPosition },
    { x: startPosition - step * 4, y: startPosition },
  ];
  dx = step;
  dy = 0;
  changingDirection = false;
  start();
  foodCoordinate();
}

function showGameStats() {
  document.getElementById("popUpTitle").textContent = "Thank you for playing!";
  document.getElementById("popUpMessage").textContent =
    "Your max score is: " + maxScore;
  btnNo.parentNode.removeChild(btnNo);
  btnYes.parentNode.removeChild(btnYes);
  btnOK.style.visibility = "visible";
  btnOK.style.width = "120px";
}

function reloadPage() {
  window.location.reload();
}
