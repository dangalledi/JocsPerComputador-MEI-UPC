
const MARIO_STAND_LEFT = 0;
const MARIO_STAND_RIGHT = 1;
const MARIO_WALK_LEFT = 2;
const MARIO_WALK_RIGHT = 3;
const MARIO_STAND_DIE = 4;
const MARIO_JUMP_LEFT = 5;
const MARIO_JUMP_RIGHT = 6;

function Player(x, y, map) {
	// // Loading spritesheets
	// Loading spritesheets
	var mario = new Texture("imgs/mario.png");
	// Set attributes for vivo y activo
	this.live = true;
	this.upBrick = false; //piso brick
	this.downBrick = false; //choque arriba ladrillo
	this.leftBrick = false;
	this.rigthBrick = false;
	//this.active = true;
	// Prepare Bub sprite & its animations
	this.sprite = new Sprite(x, y, 32, 32, 17, mario);

	this.sprite.addAnimation();
	this.sprite.addKeyframe(MARIO_STAND_LEFT, [64, 32, 16, 16]);

	this.sprite.addAnimation();
	this.sprite.addKeyframe(MARIO_STAND_RIGHT, [0, 0, 16, 16]);

	this.sprite.addAnimation();
	this.sprite.addKeyframe(MARIO_WALK_LEFT, [16, 32, 16, 16]);
	this.sprite.addKeyframe(MARIO_WALK_LEFT, [32, 32, 16, 16]);
	this.sprite.addKeyframe(MARIO_WALK_LEFT, [48, 32, 16, 16]);

	this.sprite.addAnimation();
	this.sprite.addKeyframe(MARIO_WALK_RIGHT, [16, 0, 16, 16]);
	this.sprite.addKeyframe(MARIO_WALK_RIGHT, [32, 0, 16, 16]);
	this.sprite.addKeyframe(MARIO_WALK_RIGHT, [48, 0, 16, 16]);

	this.sprite.addAnimation();
	this.sprite.addKeyframe(MARIO_STAND_DIE, [32, 16, 16, 16]);

	this.sprite.addAnimation();
	this.sprite.addKeyframe(MARIO_JUMP_LEFT, [48, 48, 16, 16]);

	this.sprite.addAnimation();
	this.sprite.addKeyframe(MARIO_JUMP_RIGHT, [16, 16, 16, 16]);

	this.sprite.setAnimation(MARIO_STAND_RIGHT);

	// Set tilemap for collisions
	this.map = map;

	// Set attributes for jump
	this.bJumping = false;
	this.jumpAngle = 0;
}


Player.prototype.update = function (deltaTime) {
	var canvas = document.getElementById("game-layer");

	if (this.live) {
		// Move Mario sprite left/right
		// var colicionT = this.map.bricks.forEach(brick => {
		// 	var col = this.player.collisionBox().intersectSide(brick.collisionBox());
		// 	if(col[1]=== 'arriba'){
				
		// 	}
		// });

		for(var i = 0; i < this.map.bricks.length; i++) {
			var brick = this.map.bricks[i];
			var col = this.collisionBox().intersectSide(brick.collisionBox());

			if(!!col && col[1]==='arriba'){
				this.bJumping = false;
				this.downBrick =true
			}
			if(!!col && col[1]=== 'abajo') {
				// If the player is colliding with the brick, move the player to the top of the brick
				this.sprite.y = brick.sprite.y - this.sprite.height;
				// this.bJumping = false;
				this.upBrick = true
			}
			if(!!col && col[0]==='derecha'){
				if(!!col && col[1] != 'abajo') this.sprite.x -= 2;
				// this.bJumping = false;
			}
			if(!!col && col[0]==='izquierda'){
				if(!!col && col[1] != 'abajo') this.sprite.x += 2;
				// this.bJumping = false;
			}
		}

		if (keyboard[37]) // KEY_LEFT
		{
			if (this.sprite.currentAnimation != MARIO_WALK_LEFT)
				this.sprite.setAnimation(MARIO_WALK_LEFT);
			this.sprite.x -= 2;
			if (this.map.collisionMoveLeft(this.sprite) ||this.downBrick||  this.sprite.x + 2 < 0) //choque con coliciones o salida de pantalla
				this.sprite.x += 2;this.downBrick = false;
			if(this.bJumping){
				if(this.sprite.currentAnimation != MARIO_JUMP_LEFT){
					this.sprite.setAnimation(MARIO_JUMP_LEFT);
				}
			}
		}
		else if (keyboard[39]) // KEY_RIGHT
		{
			if (this.sprite.currentAnimation != MARIO_WALK_RIGHT)
				this.sprite.setAnimation(MARIO_WALK_RIGHT);
			this.sprite.x += 2;
			if (this.map.collisionMoveRight(this.sprite)  ||this.downBrick|| this.sprite.x + this.sprite.width - 4 > canvas.width) //choque con coliciones o salida de pantalla
				this.sprite.x -= 2;this.downBrick = false;
			
			if(this.bJumping){
				if(this.sprite.currentAnimation != MARIO_JUMP_RIGHT){
					this.sprite.setAnimation(MARIO_JUMP_RIGHT);
				}
			}
		}
		else {
			if (this.sprite.currentAnimation == MARIO_WALK_LEFT || this.sprite.currentAnimation == MARIO_JUMP_LEFT){
				if(!this.bJumping)
					this.sprite.setAnimation(MARIO_STAND_LEFT);
			}
			if (this.sprite.currentAnimation == MARIO_WALK_RIGHT || this.sprite.currentAnimation == MARIO_JUMP_RIGHT){
				if(!this.bJumping)
					this.sprite.setAnimation(MARIO_STAND_RIGHT);
			}
		}

		if (this.bJumping) {
			this.jumpAngle += 4;
			if (this.jumpAngle == 180) {
				this.bJumping = false;
				this.sprite.y = this.startY;
			}
			else {
				this.sprite.y = this.startY - 96 * Math.sin(3.14159 * this.jumpAngle / 180); //salta

				if (this.jumpAngle > 90)
					this.bJumping = (!this.map.collisionMoveDown(this.sprite) && !this.upBrick); //se queda en la plataforma
				if(this.map.collisionMoveUp(this.sprite)) { //Intento de que se salga del mapa por arriba
					this.bJumping = false;
				};
			}
		}
		else {
			// Move Bub so that it is affected by gravity
			this.sprite.y += 2;
			
			if (this.map.collisionMoveDown(this.sprite)) {
				this.upBrick = false
				// Check arrow up key. If pressed, jump.
				if (keyboard[32]) {
					this.bJumping = true;
					this.jumpAngle = 0;
					this.startY = this.sprite.y;
					if(this.sprite.currentAnimation == MARIO_WALK_LEFT || this.sprite.currentAnimation == MARIO_STAND_LEFT )
						this.sprite.setAnimation(MARIO_JUMP_LEFT);
					if(this.sprite.currentAnimation == MARIO_WALK_RIGHT || this.sprite.currentAnimation == MARIO_STAND_RIGHT )
						this.sprite.setAnimation(MARIO_JUMP_RIGHT);
				}
			}
			if(this.upBrick){
				this.upBrick = false
				// Check arrow up key. If pressed, jump.
				if (keyboard[32]) {
					this.bJumping = true;
					this.jumpAngle = 0;
					this.startY = this.sprite.y;
					if(this.sprite.currentAnimation == MARIO_WALK_LEFT || this.sprite.currentAnimation == MARIO_STAND_LEFT )
						this.sprite.setAnimation(MARIO_JUMP_LEFT);
					if(this.sprite.currentAnimation == MARIO_WALK_RIGHT || this.sprite.currentAnimation == MARIO_STAND_RIGHT )
						this.sprite.setAnimation(MARIO_JUMP_RIGHT);
				}
			}
		}
	}
	else {
		// Die
		if (this.sprite.currentAnimation != MARIO_STAND_DIE) {
			this.sprite.setAnimation(MARIO_STAND_DIE);
		}
	}
	// Update sprites
	this.sprite.update(deltaTime);
}

Player.prototype.die = function die () {
	this.live = false;
}

Player.prototype.draw = function () {
	this.sprite.draw();
}

Player.prototype.collisionBox = function () {
	var box = new Box(this.sprite.x + 2, this.sprite.y, this.sprite.x + this.sprite.width - 4, this.sprite.y + this.sprite.height);
	return box;
}




