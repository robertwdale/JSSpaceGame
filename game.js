var Game = {} //global object stores everything for the game

var width = window.innerWidth; // hold the window size, needs to be the same as in index
var height = window.innerHeight;
var rightDown = false; //for use in keyboard controls
var leftDown = false;
var upDown = false;
var downDown = false;
var shipImg = new Image();
var t;
shipImg.src = 'ship.png';

//set rightDown or leftDown if the right or left keys are down
function onKeyDown(evt) {
  	if (evt.keyCode == 39) rightDown = true;
  	else if (evt.keyCode == 37) leftDown = true;
	else if (evt.keyCode == 38) upDown = true;
	else if (evt.keyCode == 40) downDown = true;
}

//and unset them when the right or left key is released
function onKeyUp(evt) {
  	if (evt.keyCode == 39) rightDown = false;
  	else if (evt.keyCode == 37) leftDown = false;
	else if (evt.keyCode == 38) upDown = false;
	else if (evt.keyCode == 40) downDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);
$(document).tap(restart);

Game.init = (function() {
	t = 0;
	Game.context =  $("#gameCanvas")[0].getContext("2d");
	Game.context.width = window.innerWidth;
	Game.context.height = window.innerHeight;
	Game.intervalID = window.setInterval(Game.gameloop, 10);
	Game.timer = setInterval(timer, 1000); // run timer() every second
	
	Game.ship = new ship();
	enemyTopArray = new Array();
	enemyBottomArray = new Array();
	enemyLeftArray = new Array();
	enemyRightArray = new Array();
	for (var i=0; i<10; i++) {
		enemyTopArray[i] = new enemyTop();
		enemyBottomArray[i] = new enemyBottom();
		enemyLeftArray[i] = new enemyLeft();
		enemyRightArray[i] = new enemyRight();
	}
});

Game.bg = {
	draw: function() { //clears the screen
		var context = Game.context;
		context.fillStyle = "black";
		context.fillRect(0,0,width,height);
		
		context.beginPath(); // timer
		context.fillStyle = "white";
		context.font="60px Arial";
		context.fillText(t,(width - 120),80); // print timer
		context.closePath();
	}
}

function ship() {
	this.x = ((width / 2) - 40); //start in middle
	this.y = ((height / 2) - 40);
	this.dist = 5; // distance to move in 1 gameloop
}

ship.prototype = {
	constructor: ship,

	draw: function(context) {
		context.drawImage(shipImg, this.x, this.y);
	},
	move: function() {
        if(window.DeviceMotionEvent != undefined) { //check for accellerometer support
	        window.ondevicemotion = function(evt) { //called on accellerometer
		    if(evt.acceleration) {
			    Game.ship.x += evt.accelerationIncludingGravity.x; //move ship according to movement
			    Game.ship.y -= evt.accelerationIncludingGravity.y;
		    }
	    }
}
		if (rightDown) {
			if (this.x < (width - 80)) { //stop from leaving game area
				this.x += this.dist;
			}		
		}
        else if (leftDown) { 
			if (this.x > 0) { //stop from leaving game area
				this.x -= this.dist;
			}
        }
		if (upDown) {
			if (this.y > 0) { //stop from leaving game area
				this.y -= this.dist;
			}
		}
		else if (downDown) {
			if (this.y < (height - 80)) { //stop from leaving game area
				this.y += this.dist;
			}
		}
	}
}

function enemyTop() {
	this.x = Math.floor(Math.random()*width);
	this.y = -Math.floor(Math.random()*height);
}

enemyTop.prototype = {
	constructor: enemyTop,

	draw: function(context) {
		context.beginPath();
		context.fillStyle = "white";
		context.rect(this.x, this.y, 8, 8);
		context.closePath();
		context.fill();
	},
	move: function(ship) {
		if (ship.x < this.x + 8 && ship.x + 80  > this.x &&
		    ship.y < this.y + 8 && ship.y + 80 > this.y) {
			gameOver();
		}
		else if (this.y > height) {
			this.reset();
		}
		else this.y += 1;
	},
	reset: function() {
		this.x = Math.floor(Math.random()*width);
		this.y = -Math.floor(Math.random()*height);
	}
}

function enemyBottom() {
	this.x = Math.floor(Math.random()*width);
	this.y = Math.floor(Math.random()*height) + height;
}

enemyBottom.prototype = {
	constructor: enemyBottom,

	draw: function(context) {
		context.beginPath();
		context.fillStyle = "white";
		context.rect(this.x, this.y, 8, 8);
		context.closePath();
		context.fill();
	},
	move: function(ship) {
		if (ship.x < this.x + 8 && ship.x + 80  > this.x &&
		    ship.y < this.y + 8 && ship.y + 80 > this.y) {
			gameOver();
		}
		else if (this.y < 0) {
			this.reset();
		}
		else this.y -= 1;
	},
	reset: function() {
		this.x = Math.floor(Math.random()*width);
		this.y = Math.floor(Math.random()*height) + height;
	}
}

function enemyLeft() {
	this.x = -Math.floor(Math.random()*width);
	this.y = Math.floor(Math.random()*height);
}

enemyLeft.prototype = {
	constructor: enemyLeft,

	draw: function(context) {
		context.beginPath();
		context.fillStyle = "white";
		context.rect(this.x, this.y, 8, 8);
		context.closePath();
		context.fill();
	},
	move: function(ship) {
		if (ship.x < this.x + 8 && ship.x + 80  > this.x &&
		    ship.y < this.y + 8 && ship.y + 80 > this.y) {
			gameOver();
		}
		else if (this.x > width) {
			this.reset();
		}
		else this.x += 1;
	},
	reset: function() {
		this.x = -Math.floor(Math.random()*width);
		this.y = Math.floor(Math.random()*height);
	}
}

function enemyRight() {
	this.x = Math.floor(Math.random()*width) + width;
	this.y = Math.floor(Math.random()*height);
}

enemyRight.prototype = {
	constructor: enemyRight,

	draw: function(context) {
		context.beginPath();
		context.fillStyle = "white";
		context.rect(this.x, this.y, 8, 8);
		context.closePath();
		context.fill();
	},
	move: function(ship) {
		if (ship.x < this.x + 8 && ship.x + 80  > this.x &&
		    ship.y < this.y + 8 && ship.y + 80 > this.y) {
			gameOver();
		}
		else if (this.x < 0) {
			this.reset();
		}
		else this.x -= 1;
	},
	reset: function() {
		this.x = Math.floor(Math.random()*height) + height;
		this.y = Math.floor(Math.random()*height);
	}
}

function timer() {
	t++; // increment t by 1 every second;
}

function gameOver() {
	Game.timer = window.clearInterval(Game.timer);
	Game.intervalID = window.clearInterval(Game.intervalID);
	var context = Game.context;
	context.beginPath();
	context.fillStyle = "white";
	context.font = "30px Arial";
	context.fillText("Game Over!", (width / 4), (height / 3));
	context.fillText("Score: " + t, (width / 4), (height / 2));
	context.fillText("Tap to Restart", (width / 4), (height /3)*2);
	context.closePath();
}

function restart() {
	Game.timer = window.clearInterval(Game.timer);
	Game.intervalID = window.clearInterval(Game.intervalID);
	Game.init();
}

Game.gameloop = (function() {
	Game.bg.draw();
	Game.ship.draw(Game.context);
	Game.ship.move();
	for (var i=0; i<10; i++) { //Game.ship is passed to move for collision detection
		enemyTopArray[i].draw(Game.context);
		enemyTopArray[i].move(Game.ship);
		enemyBottomArray[i].draw(Game.context);
		enemyBottomArray[i].move(Game.ship);
		enemyLeftArray[i].draw(Game.context);
		enemyLeftArray[i].move(Game.ship);
		enemyRightArray[i].draw(Game.context);
		enemyRightArray[i].move(Game.ship);
	}
});

$(document).ready(function() {
    // this is where the code is started from
    Game.init();
});