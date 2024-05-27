let ball, leftPaddle, rightPaddle, gameStarted = false, timer;
let score = 0;
let gameOverFlag = false;
let showInstructions = true;
let balls = [];
let obstacles = [];
let leftLives = 3;
let rightLives = 3;


function setup() {
createCanvas(600, 400);
ball = createBall();
leftPaddle = createPaddle(true);
rightPaddle = createPaddle(false);
createObstacles();
}


function draw() {
if (showInstructions) {
showInstructionsPage();
return;
}
background(0);
if (gameOverFlag) {
showGameOverScreen();
return;
}


updateBall(ball);
checkBallEdges(ball);
checkBallObstacles(ball);
showBall(ball);


showPaddle(leftPaddle);
showPaddle(rightPaddle);
updatePaddle(leftPaddle);
updatePaddle(rightPaddle);


if (keyIsDown(87)) movePaddle(leftPaddle, -10); // W
if (keyIsDown(83)) movePaddle(leftPaddle, 10); // S
if (keyIsDown(UP_ARROW)) movePaddle(rightPaddle, -10); // Up arrow
if (keyIsDown(DOWN_ARROW)) movePaddle(rightPaddle, 10); // Down arrow


showObstacles();
showLives();
showTimer();
textSize(50);


if (leftLives == 0 || rightLives == 0) {
gameOverFlag = true;
createRandomBalls();
}
}


function showInstructionsPage() {
background(0, 0, 100); // Dark blue background
fill(25, 176, 0); // Dark orange text
textAlign(CENTER, CENTER);
textSize(24);
textStyle(BOLD);
text("Welcome to the Pong Game!\n\nInstructions:\n\n- Use W/S keys to move the left paddle\n\n- Use UP/DOWN arrow keys to move the right paddle\n\n- The objective is to hit the ball with your paddle\n\n- If the ball passes your paddle, you lose a life\n\n- Avoid obstacles to make it harder\n\n- Game ends when either player loses all lives\n\nPress ENTER to start", width / 2, height / 2);
}


function showGameOverScreen() {
background(0);
for (let b of balls) {
updateRandomBall(b);
showRandomBall(b);
}
fill(255);
textAlign(CENTER, CENTER);
textSize(32);
text("Game Over", width / 2, height / 2 - 20);
textSize(16);
text("You're Done", width / 2, height / 2 + 20);
text("Press ENTER to Replay", width / 2, height / 2 + 50);
if (leftLives == 0) {
  text("Player 1 Wins", 300, 300)
}
if (rightLives == 0) {
  text("Player 2 Wins", 300, 300)
}
}


function showLives() {
fill(255);
textSize(16);
text(`Right Lives: ${leftLives}`, width - 100, 20);
text(`Left Lives: ${rightLives}`, 50, 20);
}


function showTimer() {
fill(255);
textSize(16);
text(`Time: ${floor((millis() - timer) / 1000)}s`, 50, 50);
}


function keyPressed() {
if (keyCode === ENTER && showInstructions) {
showInstructions = false;
} else if (keyCode === ENTER && (gameOverFlag || !gameStarted)) {
gameStarted = true;
gameOverFlag = false;
leftLives = 3;
rightLives = 3;
score = 0; // Reset the score
timer = millis();
resetBall(ball);
balls = []; // Clear the random balls array
createObstacles(); // Reset obstacles
}
}


function createBall() {
return {
x: 100,
y: 100,
xspeed: random(3, 5) * (random(1) > 0.5 ? 1 : -1),
yspeed: random(3, 5) * (random(1) > 0.5 ? 1 : -1)
};
}


function updateBall(ball) {
ball.x += ball.xspeed;
ball.y += ball.yspeed;


if (ball.y < 0 || ball.y > height) ball.yspeed *= -1;


if ((ball.x - 10 < leftPaddle.x + leftPaddle.w && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.h) ||
(ball.x + 10 > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.h)) {
ball.xspeed *= -1.1; // Increases speed on paddle hit
score += 1;
}
}


function resetBall(ball) {
ball.x = width / 2;
ball.y = height / 2;
ball.xspeed = random(3, 5) * (random(1) > 0.5 ? 1 : -1);
ball.yspeed = random(3, 5) * (random(1) > 0.5 ? 1 : -1);
}


function checkBallEdges(ball) {
if (ball.x < 0) {
rightLives--;
if (rightLives > 0) resetBall(ball);
else gameOver();
} else if (ball.x > width) {
leftLives--;
if (leftLives > 0) resetBall(ball);
else gameOver();
}
}


function checkBallObstacles(ball) {
for (let obs of obstacles) {
if (ball.x + 10 > obs.x && ball.x - 10 < obs.x + obs.w && ball.y + 10 > obs.y && ball.y - 10 < obs.y + obs.h) {
if (ball.x > obs.x && ball.x < obs.x + obs.w) {
ball.yspeed *= -1;
} else {
ball.xspeed *= -1;
}
}
}
}


function showBall(ball) {
fill(255);
ellipse(ball.x, ball.y, 20, 20);
}


function createPaddle(left) {
return {
w: 10,
h: 100,
y: height / 2 - 50,
x: left ? 0 : width - 10
};
}


function showPaddle(paddle) {
fill(255);
rect(paddle.x, paddle.y, paddle.w, paddle.h);
}


function updatePaddle(paddle) {
paddle.y = constrain(paddle.y, 0, height - paddle.h);
}


function movePaddle(paddle, steps) {
paddle.y += steps;
}


function gameOver() {
gameOverFlag = true;
}


function createObstacles() {
obstacles = [];
for (let i = 0; i < 5; i++) {
obstacles.push({
x: random(100, width - 200),
y: random(50, height - 50),
w: random(20, 50),
h: random(20, 50),
color: color(random(255), random(255), random(255))
});
}
}


function showObstacles() {
for (let obs of obstacles) {
fill(obs.color);
rect(obs.x, obs.y, obs.w, obs.h);
}
}


function createRandomBalls() {
for (let i = 0; i < 10; i++) {
balls.push(createRandomBall());
}
}


function createRandomBall() {
return {
x: random(width),
y: random(height),
xspeed: random(-2, 2),
yspeed: random(-2, 2),
color: color(random(255), random(255), random(255)),
radius: random(10, 20)
};
}


function updateRandomBall(b) {
b.x += b.xspeed;
b.y += b.yspeed;


if (b.x < 0 || b.x > width) b.xspeed *= -1;
if (b.y < 0 || b.y > height) b.yspeed *= -1;
}


function showRandomBall(b) {
fill(b.color);
ellipse(b.x, b.y, b.radius * 2, b.radius * 2);
}
