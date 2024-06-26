// Scene. Updates and draws a single scene of the game.
function Scene2(lives) {//85421
	// Loading texture to use in a TileMap
	var tilesheet = new Texture("imgs/fondo.png");
	this.cantMoney = 0;
	this.listStar = [];
	this.listHongoUp = [];
	this.listHongoMax = [];
	this.listCoinCub = [];
	// Create a deep copy of level01
	this.level = JSON.parse(JSON.stringify(level02));

	// Create tilemap
	this.map = new Tilemap(tilesheet, [32, 32], [4, 9], [0, 0], this.level);

	// Create entities
	this.player = new Player(128, 352, this.map, lives);


	//max Camara
	this.maxCameraX = 0;

	//enemigos
	this.enemiskoopa = [];
	this.enemiskoopa[0] =new KoopaTroopa(58, 260, this.map);
	this.enemiskoopa[1] = new KoopaTroopa(1280, 200, this.map);

	this.enemisGommba = [];
	this.enemisGommba[0] = new Goomba(512, 352, this.map);
	this.enemisGommba[1] = new Goomba(704, 352, this.map);
	this.enemisGommba[2] = new Goomba(800, 352, this.map);
	this.enemisGommba[3] = new Goomba(960, 352, this.map);
	this.enemisGommba[4] = new Goomba(1280, 352, this.map);
	this.enemisGommba[5] = new Goomba(1600, 352, this.map);
	this.enemisGommba[6] = new Goomba(1632, 352, this.map);
	this.enemisGommba[7] = new Goomba(512, 20, this.map);
	this.enemisGommba[8] = new Goomba(2500, 20, this.map);
	this.enemisGommba[9] = new Goomba(512, 70, this.map);
	this.enemisGommba[10] = new Goomba(2000, 20, this.map);
	this.enemisGommba[11] = new Goomba(1800, 80, this.map);
	this.enemisGommba[12] = new Goomba(1700, 20, this.map);

	// Prepare sounds
	this.music = AudioFX('sounds/01.Ground_Theme.mp3', { loop: true });
	this.jumpSound = AudioFX('sounds/smb_jump-small.wav');
	this.jumpSoundSuper = AudioFX('sounds/smb_jump-super.wav');
	this.coinSound = AudioFX('sounds/smb_coin.wav');
	this.brickSound = AudioFX('sounds/smb_bump.wav');
	this.breakblock = AudioFX('sounds/smb_breakblock.wav');

	// Store current time
	this.currentTime = 0

}


Scene2.prototype.update = function (deltaTime) {
	// Keep track of time
	this.currentTime += deltaTime;

	// Update entities
	this.player.update(deltaTime);

	//poweUp
	this.listStar.forEach(star => { star.update(deltaTime); });
	this.listHongoUp.forEach(hongoUp => { hongoUp.update(deltaTime); });
	this.listHongoMax.forEach(hongoMax => { hongoMax.update(deltaTime); });
	this.listCoinCub.forEach(coin => {coin.update(deltaTime)})
	
	//enemigos
	this.enemiskoopa.forEach(koopa => { koopa.update(deltaTime); });
	this.enemisGommba.forEach(goomba => { goomba.update(deltaTime); });
	
	//mapa
	this.map.bricks.forEach(brick => { brick.update(deltaTime); });
	this.map.interrogation.forEach(interrogation => { interrogation.update(deltaTime); });
	this.map.coin.forEach(coin => { coin.update(deltaTime); });
	if(this.map.flag) this.map.flag.update(deltaTime);
	this.map.poles.forEach(pole=>{pole.update(deltaTime)});

	// Init music once user has interacted
	if (interacted)
	this.music.play();

		// Play jumpSound sound when spacebar pressed
	if (keyboard[32] && interacted) {
		if (this.player.state == STATE_MAX || this.player.state == STATE_START_MAX) {
			this.jumpSoundSuper.play();
		}
		if (this.player.state == STATE_MINI || this.player.state == STATE_START_MINI) {
			this.jumpSound.play();
		}
	}

	var cameraWidth = document.getElementById("game-layer").width;

	if (this.maxCameraX > this.player.collisionBox().min_x) this.player.leftColision = true;
	if (this.maxCameraX + cameraWidth < this.player.collisionBox().max_x) this.player.rigthColision = true;

	//coliciones
	this.listStar.forEach(star => { 
		if(star.collisionBox().intersect(this.player.collisionBox()) && star.active){
			this.player.star();
			puntaje= puntaje + 1000;
			star.active = false;
		}
	});

	this.listHongoMax.forEach(hongoM => { 
		if(hongoM.collisionBox().intersect(this.player.collisionBox()) && hongoM.active){
			this.player.big();
			puntaje= puntaje + 1000;
			hongoM.active = false;
		}
	});

	this.listHongoUp.forEach(hongoUp => { 
		if(hongoUp.collisionBox().intersect(this.player.collisionBox()) && hongoUp.active){
			this.player.liveUp();
			hongoUp.active = false;
		}
	});

	this.map.bricks.forEach(brick => {
		var colisionBrick = brick.collisionBox().intersectSide(this.player.collisionBox());
		if (!!colisionBrick) {
			if (colisionBrick[1] === 'abajo' && this.player.live) {
				if((this.player.state == STATE_MAX || this.player.state == STATE_START_MAX )&& brick.live){
					this.breakblock.play();
					brick.clean();
				}
				// this.brick.sprite.y -= 0.5; 
				brick.bouncing = true;
				// this.player.sprite.y -= 2
				if (interacted && brick.live){
					if (this.player.state == STATE_MINI || this.player.state == STATE_START_MINI) {
						this.brickSound.play();
					}
				}
			}
		}
	});

	this.map.interrogation.forEach(interrogation => {
		var colitionInterrogation = interrogation.collisionBox().intersectSide(this.player.collisionBox());
		if (!!colitionInterrogation && colitionInterrogation[1] === 'abajo' && this.player.live) {
			if(interrogation.recompensa) {
				puntaje= puntaje +100;

				var random = getRandomInt(4);
				switch (random) {
					case 0:
						var star = new Star(interrogation.sprite.x,interrogation.sprite.y -32, this.map);
						this.listStar.push(star);
						break;
					case 1:
						var hongo = new HomgoLive(interrogation.sprite.x,interrogation.sprite.y-32, this.map);
						this.listHongoUp.push(hongo);
						break;
					case 2:
						var hongo = new HomgoMax(interrogation.sprite.x,interrogation.sprite.y-32, this.map);
						this.listHongoMax.push(hongo);
						break;
					case 3:
						var coin = new CoinCub(interrogation.sprite.x+ 8,interrogation.sprite.y-32);
						puntaje = puntaje + 200;
						this.listCoinCub.push(coin)
					default:
						break;
				}
			}
			interrogation.die();
			interrogation.bouncing = true;
		}
	});

	this.map.coin.forEach(coin => {
		this.map.bricks.forEach((brick) => {
			if (coin.collisionBox().intersect(brick.collisionBox()) && this.player.live) {
				if(coin.take){
					monedas = monedas+1;
					puntaje=puntaje+100;
					coin.take = false
				}
				if (interacted && coin.active){
					this.coinSound.play();
				}
				setTimeout(() => {
					coin.active = false;
				}, 200);
			}
		})
		if (coin.collisionBox().intersect(this.player.collisionBox()) && this.player.live) {
			if (interacted && coin.active){
				this.coinSound.play();
			}
			if(coin.take){
				monedas = monedas+1;
				puntaje=puntaje+100;
				coin.take = false
			}
			setTimeout(() => {
				coin.active = false;
			}, 200);
		}
	})

	this.enemisGommba.forEach((goomba) => {
		var colision = goomba.collisionBox().intersectSide(this.player.collisionBox());
		if (!!colision && this.player.live) {
			if((this.player.state == STATE_START_MINI || this.player.state == STATE_START_MAX) && goomba.live){
				goomba.die();
				puntaje=puntaje+100;
			}else{
				if (colision[1] === 'arriba'  && goomba.live) {
					goomba.die();
					puntaje=puntaje+100;
				} else if (goomba.active && goomba.live) {
					this.player.die();
				}
			}
		}
		this.enemiskoopa.forEach((koopa) =>{
			if(koopa.collisionBox().intersect(goomba.collisionBox()) && koopa.state == DIE_KOOPA ){
				goomba.die();
			}
		})
		if (goomba.sprite.x >= this.maxCameraX && goomba.sprite.x <= this.maxCameraX + cameraWidth) {
			goomba.move = true;
		}

	})

	this.enemiskoopa.forEach(koopa =>{
		var colision = koopa.collisionBox().intersectSide(this.player.collisionBox());
		if (!!colision && this.player.live) {
			if(koopa.state == LIVE_KOOPA){
				if(this.player.state == STATE_START_MINI || this.player.state == STATE_START_MAX){
					koopa.die();
					puntaje= puntaje + 100;
				}else{
					if (colision[1] === 'arriba') {
						koopa.die();
						puntaje= puntaje + 100;
					}else if (koopa.active && koopa.move) {
						this.player.die();
					}
				}
			}else if(!koopa.move){
				koopa.direction = colision[2] == 'derecha'? 'right': 'left';
				koopa.move= true;
				
			}else{
				if (colision[1] === 'arriba' || this.player.state == STATE_START_MINI || this.player.state == STATE_START_MAX)  koopa.move = false;
				else{ this.player.die()}
			}
		}
	})
	this.map.poles.forEach((pole, index)=>{
		if(pole.collisionBox().intersect(this.player.collisionBox())){
			this.player.movePlayer = false;
			if(this.player.prize){
				puntaje=puntaje + prize_pole[index];
				this.player.prize = false;
				this.player.movePole = true;
			}
			if(index<8){
				this.player.listSprit[this.player.state].x = pole.sprite.x - 8
			}
			if(index==8){
				this.player.movePole = false;
				win= true;
			}
		}
	})

	if(win){
		if(count<94){
			this.player.moveRigth = true;
			count+=1;
		}else{
			this.player.moveRigth = false;
			restartDatosJuego();
			goToCreditos();
			currentStateMario = 0;
		}
	}
	if((this.currentTime / 1000)> TIMEOUT  && this.player.live){
		this.player.timeOut();
	}
}

Scene2.prototype.draw = function () {
	//console.log(this.currentTime)
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Calculate the position of the camera. The camera follows the player, staying a certain distance away.
	var cameraX = this.player.listSprit[this.player.state].x - canvas.width / 2;
	cameraX = Math.max(0, cameraX); // Don't go beyond the left edge of the map
	cameraX = Math.min(this.map.map.width * 32 - canvas.width, cameraX); // Don't go beyond the right edge of the map

	// Ensure the camera never moves back
	cameraX = Math.max(cameraX, this.maxCameraX);

	this.maxCameraX = cameraX;

	// Apply transformation to context
	context.save();
	context.translate(-Math.floor(cameraX), 0);


	// Clear background
	context.fillStyle = "#87CEEB";
	context.fillRect(0, 0, this.map.map.width * 32, canvas.height);

	// Draw tilemap
	this.map.draw();
	//powerUp
	this.listStar.forEach(star => { star.draw(); });
	this.listHongoUp.forEach(hongoUp => { hongoUp.draw(); });
	this.listHongoMax.forEach(hongoMax => { hongoMax.draw(); });
	this.listCoinCub.forEach(coin => {coin.draw()})
	//enemigos
	this.enemiskoopa.forEach((koopa)=>{koopa.draw()});
	this.enemisGommba.forEach(goomba => {goomba.draw();})
	//plyer
	this.player.draw();

	// Draw text
	if (!this.player.live) {
		var text = "GAME OVER";
		context.font = "50px Mario";
		var textSize = context.measureText(text);
		context.fillStyle = "#000";
		context.fillText(text, 256 - textSize.width / 2, 224 + 12);
	}
	// Restore the context
	context.restore();

	text = "Puntaje: " + completeNumbre(puntaje, 6) + "  Monedas: " +monedas +"  Vidas: " + vidas;
	text2 ="Time: "+ completeNumbre(TIMEOUT - Math.floor(this.currentTime / 1000), 3) + " seconds"
	context.font = "10px Mario";
	context.fillStyle = "#fff";
	context.fillText(text, 10, 25);
	context.fillText(text2, 10, 40);
}



