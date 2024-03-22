class Ball {
	constructor(x, y, dx, dy, color) {
			this.x = x;
			this.y = y;
			this.dx = dx;
			this.dy = dy;
			this.color = color;
			this.history = [];
	}

	move() {
			this.x += this.dx;
			this.y += this.dy;
	}

	draw(ctx) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, BALL_SIZE, 0, Math.PI * 2);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
	}

	checkBounds(width, height) {
			if (this.x - BALL_SIZE < 0) {
					this.x = BALL_SIZE;
					this.dx = -this.dx;
			} else if (this.x + BALL_SIZE > width) {
					this.x = width - BALL_SIZE;
					this.dx = -this.dx;
			}

			if (this.y - BALL_SIZE < 0) {
					this.y = BALL_SIZE;
					this.dy = -this.dy;
			} else if (this.y + BALL_SIZE > height) {
					this.y = height - BALL_SIZE;
					this.dy = -this.dy;
			}
	}

	checkBrickCollision() {
		for (let y = 0; y < BRICK_ROWS; y++) {
			for (let x = 0; x < BRICK_COLS; x++) {
					const brickColor = BRICK_MAP[x + (y*BRICK_COLS)] == 1 ? WHITE: BLACK;
					if (this.color != brickColor) { continue;}

					const brickX = x * BRICK_WIDTH;
					const brickY = y * BRICK_HEIGHT;
					if (this.x + BALL_SIZE >= brickX && this.x - BALL_SIZE <= brickX + BRICK_WIDTH &&
							this.y + BALL_SIZE >= brickY && this.y - BALL_SIZE <= brickY + BRICK_HEIGHT) {
							const hitFromLeftOrRight = (this.x + BALL_SIZE <= brickX + BRICK_WIDTH/2) || (this.x - BALL_SIZE >= brickX + BRICK_WIDTH/2);
							const hitFromTopOrBottom = (this.y + BALL_SIZE <= brickY + BRICK_HEIGHT/2) || (this.y - BALL_SIZE >= brickY + BRICK_HEIGHT/2);
							if (hitFromLeftOrRight) { this.dx = -this.dx; }
							if (hitFromTopOrBottom) { this.dy = -this.dy; }
							BRICK_MAP[x + (y*BRICK_COLS)] = brickColor == WHITE ? 0 : 1;
					}
			}
		}
	}

	isStuck() {
			if (this.history.length > 10) {
					this.history.shift();
			}
			for (let i = 0; i < this.history.length; i++) {
					if (this.history[i].x === this.x && this.history[i].y === this.y) {
							return true;
					}
			}
			this.history.push({ x: this.x, y: this.y });
			return false;
	}
}

const canvas = document.getElementById('breakerCanvas');
const ctx = canvas.getContext('2d');
var scores = [128,128];
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BALL_SIZE = 10;
const BRICK_ROWS = 16;
const BRICK_COLS = 16;
const BRICK_WIDTH = Math.round(canvas.width / BRICK_COLS);
const BRICK_HEIGHT = Math.round(canvas.height / BRICK_ROWS);
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const BRICK_MAP = [
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
];

let balls = [
	new Ball(canvas.width / 4, canvas.height / 2, 5 + Math.random()*3, -5+ Math.random()*3, BLACK),
	new Ball(3 * canvas.width / 4, canvas.height / 2, -5+ Math.random()*3, 5+ Math.random()*3, WHITE)
];

function getScore() {
	scores[1]= BRICK_MAP.filter(x=> x==0).length;
	scores[0]= BRICK_MAP.filter(x=> x==1).length;
	const score0 = scores[0] * 400 / 256;
	const score1 = scores[1] * 400 / 256;

	document.getElementById('score0').innerText = scores[0];
	document.getElementById('score0').style.color = BLACK;
	document.getElementById('score0').style.backgroundColor = WHITE;
	document.getElementById('score0').style.width = score0 + 'px';

	document.getElementById('score1').style.color = WHITE;
	document.getElementById('score1').style.backgroundColor = BLACK;
	document.getElementById('score1').innerText = scores[1];
	document.getElementById('score1').style.width = score1 + 'px';
}

function checkBallsCollision() {
	let dx = balls[1].x - balls[0].x;
	let dy = balls[1].y - balls[0].y;
	let distance = Math.sqrt(dx * dx + dy * dy);

	if (distance < BALL_SIZE * 2) {
			let nx = dx / distance;
			let ny = dy / distance;

			let separationDistance = BALL_SIZE * 3;

			balls[0].x -= nx * separationDistance;
			balls[0].y -= ny * separationDistance;
			balls[1].x += nx * separationDistance;
			balls[1].y += ny * separationDistance;

			balls[0].dx = -balls[0].dx;
			balls[0].dy = -balls[0].dy;
			balls[1].dx = -balls[1].dx;
			balls[1].dy = -balls[1].dy;
	}
}

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let y = 0; y < BRICK_ROWS; y++) {
			for (let x = 0; x < BRICK_COLS; x++) {
					ctx.fillStyle = BRICK_MAP[x + (y*BRICK_COLS)] == 1 ? WHITE: BLACK;
					ctx.fillRect(x*BRICK_WIDTH, y * BRICK_HEIGHT, BRICK_WIDTH, BRICK_HEIGHT);
			}
	}
	balls.forEach(ball => {
			ball.move();
			ball.checkBrickCollision();			
	});
	checkBallsCollision();
	balls.forEach(ball => {
		ball.checkBounds(canvas.width, canvas.height);
		ball.draw(ctx);
});

	getScore();	
	requestAnimationFrame(gameLoop);
}

gameLoop();
