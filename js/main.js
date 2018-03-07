/*
Jim Alan McBrayer
Inspired by GwG MurderMystery QuiZ
TODO: 

Fix wall collision
Possibly change game logic all togther, at least have the basics in 
Add better (graphics)
Change font/texts, and button
Add splash Screen with start button
Possibly have to take clues to random NPC
NPC's walking (Pathing)
Insert RPG Elements

...and more thoughts...



*/

let width = window.innerWidth;
let height = window.innerHeight;

let obstacleGroup, player;
let marker, marker2, marker3, marker4, marker5, bow, axe, poison, gem, itemGroup;
let floorGroup;

let bossMan;
let juliaBody;

let nextLevel = false;
let freeRoam = true;

let marbleGroup;

let itemsTxt, msgTxt;
let txt = "";
let finalTxt = "";
let alertTxt = ""; // 
let speed = 200; // default of 200 speed

let currentItemCount = 0; // starting number of collected items
let totalItemCount = 4; // total number of items to be collected
let currentLevel = 1;

let check; // checking for collision with bossman

let killer; // randomly selected killer

let controls; // controls 

// for testing locations and random numbers
let playerLOC = () => {
	console.log('X:' + player.x);
	console.log('Y:' + player.y);
};

let testNum = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	console.log(Math.floor(Math.random() * (max - min)) + min);
};


let Ndown = false,
	Sdown = false,
	Edown = false,
	Wdown = false;

//Initialize function
let init = function () {
	// TODO:: Do your initialization job
	//console.log("init() called");



	let game = new Phaser.Game(width, height, Phaser.AUTO, 'test', null, false, true);

	let BasicGame = function (game) {};

	BasicGame.Boot = function (game) {};

	BasicGame.Boot.prototype = {
		preload: function () {
			game.load.image('button', 'images/tiles/button.png');
			game.load.image('backpack', 'images/tiles/backpack.png');
			game.load.image('revolver', 'images/tiles/find2_revolver.png');
			game.load.image('badge', 'images/tiles/find3_badge.png');
			game.load.image('sword', 'images/tiles/sword.png');

			game.load.image('poison', 'images/tiles/potionGreen.png');
			game.load.image('gem', 'images/tiles/gemBlue.png');
			game.load.image('axe', 'images/tiles/axe.png');
			game.load.image('bow', 'images/tiles/bow.png');


			game.load.image('tile', 'images/tiles/ground_tile1.png');

			game.load.image('marble1', 'images/tiles/tile2.png');
			game.load.image('marble2', 'images/tiles/tile3.png');


			game.load.image('bed', 'images/tiles/bed.png');
			game.load.image('dresser', 'images/tiles/dresser.png');
			game.load.image('clock', 'images/tiles/clock.png');
			game.load.image('boss', 'images/tiles/boss.png');
			game.load.image('bed2', 'images/tiles/bed2.png');
			game.load.image('lampTable', 'images/tiles/lamptable.png');
			game.load.image('chair', 'images/tiles/chair.png');
			game.load.image('skele', 'images/tiles/skele.png');
			game.load.image('julia', 'images/tiles/julia.png')
			game.load.image('dresser2', 'images/tiles/dresser2.png');
			game.load.image('table', 'images/tiles/table.png');
			game.load.image('james', 'images/tiles/james.png');
			game.load.image('pirate', 'images/tiles/pirate.png');
			game.load.image('mage', 'images/tiles/mage.png');


			game.load.image('E', 'images/controls/E.png');
			game.load.image('N', 'images/controls/N.png');
			game.load.image('S', 'images/controls/S.png');
			game.load.image('W', 'images/controls/W.png');

			game.load.image('wall', 'images/tiles/wall4.png');
			game.load.image('wall2', 'images/tiles/wall5.png');

			game.load.spritesheet('characterAnim', 'images/tiles/hero.png', 24, 32, 32);

			game.time.advancedTiming = true;

			// Add the Isometric plug-in to Phaser
			game.plugins.add(new Phaser.Plugin.Isometric(game));

			// Set the world size
			game.world.setBounds(0, 0, 3000, 3000);

			// Start the physical system
			game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

			// set the middle of the world in the middle of the screen
			game.iso.anchor.setTo(0.5, 0);
		},
		create: function () {

			// game timer
			if (currentLevel > 1) {
				totalItemCount += 2;
			}
			game.input.addPointer();

			let createTimer = () => {
				this.timeLabel = this.game.add.text(300, 8, "00", {
					font: "18px Arial",
					fill: "#fff"
				});
				this.timeLabel.fixedToCamera = true;
				this.timeLabel.anchor.setTo(0.5, 0);
				this.timeLabel.align = 'center';
			};
			let updateTimer = () => {
				var me = this;

				if (me.timeElapsed >= me.totalTime) {
					me.timeLabel.text = "TIMES UP!";
				} else {
					var currentTime = new Date();
					var timeDifference = me.startTime.getTime() - currentTime.getTime();

					//Time elapsed in seconds
					me.timeElapsed = Math.abs(timeDifference / 1000);

					//Time remaining in seconds
					var timeRemaining = me.totalTime - me.timeElapsed;

					//Convert seconds into minutes and seconds
					var minutes = Math.floor(timeRemaining / 60);
					var seconds = Math.floor(timeRemaining) - (60 * minutes);

					//Display minutes, add a 0 to the start if less than 10
					//var result = (minutes < 10) ? "0" + minutes : minutes;

					//Display seconds, add a 0 to the start if less than 10
					result = (seconds < 10) ? "0" + seconds : "" + seconds;

					me.timeLabel.text = result;
				}

			};

			this.startTime = new Date();
			this.totalTime = 30;
			this.timeElapsed = 0;

			if (!freeRoam) {
				this.gameTimer = game.time.events.loop(100, function () {
					updateTimer();

				});
			}

			// Restarting the game, and setting everything back to defaults. 
			let restartGame = () => {

				timer.add(3000, () => {
					console.log('game resetting...');
					removeAlertText();
					nextLevel = false;
					currentItemCount = 0;
					totalItemCount = 4;
					currentLevel = 0;
					speed = 200;
					game.state.start('Boot');

				}, this);
				timer.start();

			};

			// Free Roam game mode is so you don't have a timer
			if (!freeRoam) {
				let countDownTimer = game.time.create(false);
				console.log(nextLevel);

				let gameCountDown = countDownTimer.add(Phaser.Timer.SECOND * 30, () => {

					if (nextLevel == false) {
						speed = 0;
						alertTxt = "You didn't find the killer fast enough!!! Game Over.";
						msgTxt.setText(alertTxt);
						msgTxt.x = player.x + 80;
						msgTxt.y = player.y - 20;

						restartGame();
						console.log('gameover')
					} else {
						//..moving on
					}
				}, this);
				countDownTimer.start();

				//....
			}


			// set the Background color of our game
			game.stage.backgroundColor = "#50545f";


			floorGroup = game.add.group();
			itemGroup = game.add.group();
			marbleGroup = game.add.group();
			obstacleGroup = game.add.group();
			bossGroup = game.add.group();
			juliaGroup = game.add.group();
			jamesGroup = game.add.group();
			lucyGroup = game.add.group();
			mageGroup = game.add.group();


			// set the gravity in our game
			game.physics.isoArcade.gravity.setTo(0, 0, -500);


			// create the floor tiles
			let floorTile;
			for (let xt = 1500; xt > 0; xt -= 35) {
				for (let yt = 1500; yt > 0; yt -= 35) {
					floorTile = game.add.isoSprite(xt, yt, 0, 'tile', 0, floorGroup);
					floorTile.anchor.set(0.5);

				}
			}

			//game.world.sendToBack(floorGroup); // testing the floor in the background
			//	create the marble tiles randomly
			let marbleTile;
			for (let xt = 1500; xt > 0; xt -= 35) {
				for (let yt = 1500; yt > 0; yt -= 35) {

					let rnd = rndNum(20);

					if (rnd == 0) {
						marbleTile = game.add.isoSprite(xt, yt, 0, 'marble1', 0, marbleGroup);
						marbleTile.anchor.set(0.5);
					} else if (rnd == 1) {
						marbleTile = game.add.isoSprite(xt, yt, 0, 'marble2', 0, marbleGroup);
						marbleTile.anchor.set(0.5);
					}
				}
			}


			// game objects here 
			let bed = game.add.isoSprite(20, 200, 0, 'bed', 0, obstacleGroup);
			bed.scale.setTo(0.5, 0.5);
			bed.anchor.set(0.5);
			game.physics.isoArcade.enable(bed);
			bed.body.collideWorldBounds = true;
			bed.body.immovable = true;

			let dresser = game.add.isoSprite(0, 150, 0, 'dresser', 0, obstacleGroup);
			dresser.scale.setTo(0.5, 0.5);
			dresser.anchor.set(0.5);
			game.physics.isoArcade.enable(dresser);
			dresser.body.collideWorldBounds = true;
			dresser.body.immovable = true;

			let clock = game.add.isoSprite(0, 300, 0, 'clock', 0, obstacleGroup);
			clock.scale.setTo(0.5, 0.5);
			clock.anchor.set(0.5);
			game.physics.isoArcade.enable(clock);
			clock.body.collideWorldBounds = true;
			clock.body.immovable = true;

			let bed2 = game.add.isoSprite(245, 1200, 0, 'bed2', 0, obstacleGroup);
			bed2.scale.setTo(0.5, 0.5);
			bed2.anchor.set(0.5);
			game.physics.isoArcade.enable(bed2);
			bed2.body.collideWorldBounds = true;
			bed2.body.immovable = true;

			let lampTable = game.add.isoSprite(295, 1150, 0, 'lampTable', 0, obstacleGroup);
			lampTable.scale.setTo(0.5, 0.5);
			lampTable.anchor.set(0.5);
			game.physics.isoArcade.enable(lampTable);
			lampTable.body.collideWorldBounds = true;
			lampTable.body.immovable = true;

			let chair = game.add.isoSprite(430, 1150, 0, 'chair', 0, obstacleGroup);
			chair.scale.setTo(0.5, 0.5);
			chair.anchor.set(0.5);
			game.physics.isoArcade.enable(chair);
			chair.body.collideWorldBounds = true;
			chair.body.immovable = true;

			let skele = game.add.isoSprite(380, 200, 0, 'skele', 0, obstacleGroup);
			skele.scale.setTo(0.5, 0.5);
			skele.anchor.set(0.5);
			game.physics.isoArcade.enable(skele);
			skele.body.collideWorldBounds = true;
			skele.body.immovable = true;

			let dresser2 = game.add.isoSprite(930, 1100, 0, 'dresser2', 0, obstacleGroup);
			dresser2.scale.setTo(0.5, 0.5);
			dresser2.anchor.set(0.5);
			game.physics.isoArcade.enable(dresser2);
			dresser2.body.collideWorldBounds = true;
			dresser2.body.immovable = true;

			let table = game.add.isoSprite(1100, 100, 0, 'table', 0, obstacleGroup);
			table.scale.setTo(0.3, 0.3);
			table.anchor.set(0.5);
			game.physics.isoArcade.enable(table);
			table.body.collideWorldBounds = true;
			table.body.immovable = true;


			// choosing a random killer each new game restart
			let randomKiller = randNum(0, 6);

			if (randomKiller == 0) {
				killer = 'Julia';

			} else if (randomKiller == 1) {
				killer = 'James';

			} else if (randomKiller == 2) {
				killer = 'Mr. Parkes';

			} else if (randomKiller == 3) {
				killer = 'Ms. Van Cleve';

			} else {
				killer = 'Mr. Kalehoff';

			}

			console.log(killer);



			// generated walls with a for loop, probably could have completed this differently. 
			let wall_1;

			for (let xt = 20; xt < 300; xt += 36) {

				wall_1 = game.add.isoSprite(xt, 350, 0, 'wall', 0, obstacleGroup);
				wall_1.scale.setTo(2, 2);

				wall_1.anchor.set(0.5);

				game.physics.isoArcade.enable(wall_1);

				wall_1.body.collideWorldBounds = true;


				wall_1.body.immovable = true;

			}

			let wall_2;

			for (let xt = 20; xt < 297; xt += 32) {

				wall_2 = game.add.isoSprite(350, xt, 0, 'wall2', 0, obstacleGroup);
				wall_2.scale.setTo(2, 2);

				wall_2.anchor.set(0.5);

				game.physics.isoArcade.enable(wall_2);

				wall_2.body.collideWorldBounds = true;

				wall_2.body.immovable = true;

			}
			let wall_3;

			for (let xy = 25; xy < 350; xy += 36) {


				wall_3 = game.add.isoSprite(xy, 900, 0, 'wall', 0, obstacleGroup);
				wall_3.scale.setTo(2, 2);

				wall_3.anchor.set(0.5);

				game.physics.isoArcade.enable(wall_3);
				wall_3.body.collideWorldBounds = true;
				wall_3.body.immovable = true;

			}
			let wall_4;

			for (let xy = 1500; xy > 1000; xy -= 32) {


				wall_4 = game.add.isoSprite(400, xy, 0, 'wall2', 0, obstacleGroup);
				wall_4.scale.setTo(2, 2);

				wall_4.anchor.set(0.5);

				game.physics.isoArcade.enable(wall_4);
				wall_4.body.collideWorldBounds = true;
				wall_4.body.immovable = true;

			}
			let wall_5;

			for (let xy = 1420; xy > 1000; xy -= 36) {


				wall_5 = game.add.isoSprite(xy, 900, 0, 'wall', 0, obstacleGroup);
				wall_5.scale.setTo(2, 2);

				wall_5.anchor.set(0.5);

				game.physics.isoArcade.enable(wall_5);
				wall_5.body.collideWorldBounds = true;
				wall_5.body.immovable = true;

			}

			let wall_6;

			for (let xy = 1450; xy > 950; xy -= 32) {


				wall_6 = game.add.isoSprite(900, xy, 0, 'wall2', 0, obstacleGroup);
				wall_6.scale.setTo(2, 2);

				wall_6.anchor.set(0.5);

				game.physics.isoArcade.enable(wall_6);
				wall_6.body.collideWorldBounds = true;
				wall_6.body.immovable = true;

			}

			let wall_7;

			for (let xy = 1430; xy > 1000; xy -= 36) {


				wall_7 = game.add.isoSprite(xy, 500, 0, 'wall', 0, obstacleGroup);
				wall_7.scale.setTo(2, 2);

				wall_7.anchor.set(0.5);

				game.physics.isoArcade.enable(wall_7);
				wall_7.body.collideWorldBounds = true;
				wall_7.body.immovable = true;
				//wall_7.body.setSize(50, 50, 0.5, 0.5); // testing collision

			}
			let wall_8;

			for (let xy = 25; xy < 400; xy += 36) {


				wall_8 = game.add.isoSprite(1000, xy, 0, 'wall2', 0, obstacleGroup);
				wall_8.scale.setTo(2, 2);

				wall_8.anchor.set(0.5);

				game.physics.isoArcade.enable(wall_8);
				wall_8.body.collideWorldBounds = true;
				wall_8.body.immovable = true;

			}



			//NPC Section. Creating NPC's. 

			let bossMan = game.add.isoSprite(600, 600, 0, 'boss', 0, bossGroup);
			bossMan.scale.setTo(1, 1);
			bossMan.anchor.set(0.5);
			game.physics.isoArcade.enable(bossMan);
			bossMan.body.setSize(50, 50, 0.5, 0.5);
			bossMan.body.collideWorldBounds = true;
			bossMan.body.immovable = true;

			let juliaBody = game.add.isoSprite(200, 200, 0, 'julia', 0, juliaGroup); /// add 'sprite' put it at loc 200x 200y, sprite texture, group
			juliaBody.scale.setTo(0.9, 0.9);
			juliaBody.anchor.set(0.5);
			game.physics.isoArcade.enable(juliaBody);
			juliaBody.body.setSize(50, 50, 0.5, 0.5);
			juliaBody.body.collideWorldBounds = true;
			juliaBody.body.immovable = true;

			let jamesBody = game.add.isoSprite(1200, 200, 0, 'james', 0, jamesGroup);
			jamesBody.scale.setTo(0.9, 0.9);
			jamesBody.anchor.set(0.5);
			game.physics.isoArcade.enable(jamesBody);
			jamesBody.body.setSize(50, 50, 0.5, 0.5);
			jamesBody.body.collideWorldBounds = true;
			jamesBody.body.immovable = true;

			let lucyBody = game.add.isoSprite(1300, 1300, 0, 'pirate', 0, lucyGroup);
			lucyBody.scale.setTo(2, 2);
			lucyBody.anchor.set(0.5);
			game.physics.isoArcade.enable(lucyBody);
			lucyBody.body.setSize(25, 25, 0.5, 0.5);
			lucyBody.body.collideWorldBounds = true;
			lucyBody.body.immovable = true;

			let mageBody = game.add.isoSprite(245, 1300, 0, 'mage', 0, mageGroup);
			mageBody.scale.setTo(2, 2);
			mageBody.anchor.set(0.5);
			game.physics.isoArcade.enable(mageBody);
			mageBody.body.setSize(25, 25, 0.5, 0.5);
			mageBody.body.collideWorldBounds = true;
			mageBody.body.immovable = true;

			var style = {
				font: "32px Courier",
				fill: "#00ff44"
			};

			button = game.add.button(165, 28, 'button', actionOnClick, this, 2, 1, 0);
			button.fixedToCamera = true;
			button.anchor.setTo(0.5, 0);
			button.align = 'center';

			function actionOnClick() {
				if (freeRoam) {
					freeRoam = false;
				} else {
					freeRoam = true;
				}
				restartGame();
				console.log(freeRoam);
			}
			// create the collected item text for the top left
			itemsTxt = game.add.text(100, 8, txt, {
				font: "18px Arial",
				fill: "#FFFFFF",
				align: "center"
			});
			itemsTxt.fixedToCamera = true; // Won't move with camera

			// create the information text field about the status of the game   
			msgTxt = game.add.text(0, 8, alertTxt, {
				font: "18px Arial",
				fill: "#FFFFFF",
				align: "center",
				backgroundColor: "rgba(255, 255, 255, 0.3)",

			});
			msgTxt.anchor.set(0.5);

			updateText(); // update the text 



			cW = game.add.sprite(100, 500, 'W');
			cW.fixedToCamera = true;
			cW.inputEnabled = true;
			cW.events.onInputDown.add(onDown, this);
			cW.events.onInputOver.add(onDown, this);
			cW.events.onInputUp.add(onUp, this);
			cW.events.onInputOut.add(onUp, this);

			cN = game.add.sprite(150, 450, 'N');
			cN.fixedToCamera = true;
			cN.inputEnabled = true;
			cN.events.onInputDown.add(onDown, this);
			cN.events.onInputOver.add(onDown, this);
			cN.events.onInputUp.add(onUp, this);
			cN.events.onInputOut.add(onUp, this);

			cS = game.add.sprite(150, 550, 'S');
			cS.fixedToCamera = true;
			cS.inputEnabled = true;
			cS.events.onInputDown.add(onDown, this);
			cS.events.onInputOver.add(onDown, this);
			cS.events.onInputUp.add(onUp, this);
			cS.events.onInputOut.add(onUp, this);

			cE = game.add.sprite(200, 500, 'E');
			cE.fixedToCamera = true;
			cE.inputEnabled = true;
			cE.events.onInputDown.add(onDown, this);
			cE.events.onInputOver.add(onDown, this);
			cE.events.onInputUp.add(onUp, this);
			cE.events.onInputOut.add(onUp, this);


			// create control functions for the control buttons
			function onDown(sprite, pointer) {

				if (sprite.key == "N") {

					Ndown = true;

				}

				if (sprite.key == "S") {

					Sdown = true;

				}

				if (sprite.key == "E") {

					Edown = true;

				}

				if (sprite.key == "W") {

					Wdown = true;

				}


			}


			function onUp(sprite, pointer) {

				Ndown = false;
				Sdown = false;
				Edown = false;
				Wdown = false;

			}

			controls = game.add.group();
			controls.add(cN);
			controls.add(cS);
			controls.add(cW);
			controls.add(cE);


			controls.alpha = 0.6;

			// Create the player section**********************************************************
			player = game.add.isoSprite(500, 500, 0, 'characterAnim', 0, obstacleGroup);

			player.alpha = 1;

			player.scale.setTo(1.5);


			// add the animations from the spritesheet
			let walk = player.animations.add('walk');
			player.animations.add('S', [0, 1, 2, 3, 4, 5, 6, 7], 30, true);
			player.animations.add('SW', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
			player.animations.add('W', [16, 17, 18, 19, 20, 21, 22, 23], 30, true);
			player.animations.add('NW', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
			player.animations.add('N', [8, 9, 10, 11, 12, 13, 14, 15], 30, true);
			player.animations.add('NE', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
			player.animations.add('E', [24, 25, 26, 27, 28, 29, 30, 31], 30, true);
			player.animations.add('SE', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);

			// arcade iso physics enabled

			game.physics.isoArcade.enable(player);
			player.body.collideWorldBounds = true;
			//player.body.setSize(15, 15, 15, 0.5);


			// set camera to follow player. 
			game.camera.follow(player);

			// PLAYER SECTION *******************************************************************
			if (!freeRoam) {
				createTimer();
			}

			this.createItems();
			if (currentLevel >= 2) {
				for (let i = 0; i <= 1; i++) {
					this.createItems();
				}
			}
			if (currentLevel > 3) {
				for (let i = 0; i <= 3; i++) {
					this.createItems();
				}
			}
			if (currentLevel > 8) {
				for (let i = 0; i < 4; i++) {
					this.createItems();
				}
			}
		},
		createItems: function (item) {
			// create clue items
			marker = game.add.isoSprite(rndNum(1500), rndNum(1500), 25, 'backpack', 0, itemGroup);
			game.physics.isoArcade.enable(marker);
			marker.body.collideWorldBounds = true;
			marker.anchor.set(0.5);

			marker2 = game.add.isoSprite(rndNum(1500), rndNum(1500), 25, 'revolver', 0, itemGroup);
			game.physics.isoArcade.enable(marker2);
			marker2.body.collideWorldBounds = true;
			marker2.anchor.set(0.5);

			marker3 = game.add.isoSprite(rndNum(1500), rndNum(1500), 25, 'badge', 0, itemGroup);
			game.physics.isoArcade.enable(marker3);
			marker3.body.collideWorldBounds = true;
			marker3.anchor.set(0.5);

			marker4 = game.add.isoSprite(rndNum(1500), rndNum(1500), 25, 'sword', 0, itemGroup);
			game.physics.isoArcade.enable(marker4);
			marker4.body.collideWorldBounds = true;
			marker4.anchor.set(0.5);

			poison = game.add.isoSprite(rndNum(1500), rndNum(1500), 25, 'poison', 0, itemGroup);
			poison.scale.setTo(1, 1);
			poison.anchor.set(0.5);
			game.physics.isoArcade.enable(poison);
			poison.body.collideWorldBounds = true;
			poison.body.immovable = true;

			gem = game.add.isoSprite(rndNum(1500), rndNum(1500), 25, 'gem', 0, itemGroup);
			gem.scale.setTo(1, 1);
			gem.anchor.set(0.5);
			game.physics.isoArcade.enable(gem);
			gem.body.collideWorldBounds = true;
			gem.body.immovable = true;

			axe = game.add.isoSprite(rndNum(1500), rndNum(1500), 25, 'axe', 0, itemGroup);
			axe.scale.setTo(1, 1);
			axe.anchor.set(0.5);
			game.physics.isoArcade.enable(axe);
			axe.body.collideWorldBounds = true;
			axe.body.immovable = true;

			bow = game.add.isoSprite(rndNum(1500), rndNum(1500), 25, 'bow', 0, itemGroup);
			bow.scale.setTo(1, 1);
			bow.anchor.set(0.5);
			game.physics.isoArcade.enable(bow);
			bow.body.collideWorldBounds = true;
			bow.body.immovable = true;

			//game.world.bringToTop(itemGroup); // send the items to the top so the tiles don't overlap them

			// console.log(itemGroup.children[0].key);

		},
		update: function () {


			timer = game.time.create(false); // timer for removing messages

			let cursors = game.input.keyboard.createCursorKeys();
			// jumping *****
			let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

			space.onDown.add(function () {
				if (player.body.onFloor()) {
					player.body.velocity.z = 200;
				}
				// nada to prevent double jumping

			}, this);

			// Jumping ******** ^^^^^^^

			if (Ndown == true || cursors.up.isDown) {
				player.animations.play('N');
				player.body.velocity.y = -speed;
				player.body.velocity.x = -speed;
			} else if (Sdown == true || cursors.down.isDown) {

				player.body.velocity.y = speed;
				player.body.velocity.x = speed;
				player.animations.play('S');
			} else if (Edown == true || cursors.right.isDown) {
				player.animations.play('E');
				player.body.velocity.x = speed;
				player.body.velocity.y = -speed;
			} else if (Wdown == true || cursors.left.isDown) {
				player.animations.play('W');
				player.body.velocity.x = -speed;
				player.body.velocity.y = speed;
			} else {
				player.body.velocity.x = 0;
				player.body.velocity.y = 0;
				player.animations.stop();
			}


			//for touch
			if (Ndown == true || cursors.up.isDown) {
				player.animations.play('N');
			} else if (Sdown == true || cursors.down.isDown) {
				player.animations.play('S');
			} else if (Edown == true || cursors.right.isDown) {
				player.animations.play('E');
			} else if (Wdown == true || cursors.left.isDown) {
				player.animations.play('W');
			} else {
				player.animations.stop();
			}


			game.physics.isoArcade.collide(obstacleGroup);


			// NPC killer section


			// collision with julia
			game.physics.isoArcade.collide(juliaGroup, player, function (a, b) {
				if (a === player) {

					alertTxt = "Julia: I didn't do it!!!";

					msgTxt.setText(alertTxt);
					msgTxt.x = Math.floor(b.x + 80);
					msgTxt.y = Math.floor(b.y - 20);

					timer.add(3000, () => {
						removeAlertText();
					}, this);
					timer.start();

				}
			});

			// collosion with james

			game.physics.isoArcade.collide(jamesGroup, player, function (a, b) {
				if (a === player) {

					alertTxt = "James: It was Julia!!!!";

					msgTxt.setText(alertTxt);
					msgTxt.x = Math.floor(b.x + 80);
					msgTxt.y = Math.floor(b.y - 20);

					timer.add(3000, () => {
						removeAlertText();
					}, this);
					timer.start();

				}
			});

			// collision with lucy

			game.physics.isoArcade.collide(lucyGroup, player, function (a, b) {
				if (a === player) {

					alertTxt = "Lucy: It was James!!!!";

					msgTxt.setText(alertTxt);
					msgTxt.x = Math.floor(b.x + 80);
					msgTxt.y = Math.floor(b.y - 20);

					timer.add(3000, () => {
						removeAlertText();
					}, this);
					timer.start();

				}
			});

			// collision testing with mage

			game.physics.isoArcade.collide(mageGroup, player, function (a, b) {
				if (a === player) {

					alertTxt = "Mage: It might have been me, to be honest!!!!";

					msgTxt.setText(alertTxt);
					msgTxt.x = Math.floor(b.x + 80);
					msgTxt.y = Math.floor(b.y - 20);

					timer.add(3000, () => {
						removeAlertText();
					}, this);
					timer.start();

				}
			});

			// collision with bossman

			check = game.physics.isoArcade.collide(bossGroup, player, function (a, b) {

				if (a === player) {


					if (currentItemCount >= totalItemCount) {
						alertTxt = "Sherrif: You found all the clues! " + killer + " was the murderer!!!";
						nextLevel = true;
						console.log(nextLevel);
						msgTxt.setText(alertTxt);
						msgTxt.x = Math.floor(b.x + 200);
						msgTxt.y = Math.floor(b.y - 20);

						timer.add(5000, () => {
							removeAlertText();
							currentLevel += 1;
							currentItemCount = 0;
							speed = 200;
							game.state.start('Boot');
						}, this);
						timer.start();


					} else {

						// Moving the boss once you collide, because he's annoyed.
						let newX = b.position.x;
						let newY = b.position.y;

						if ((newX > 1000 || newY > 1000) && (newX < 0 || newY < 0)) {
							newX = b.position.x - Math.floor(randNum(0, 100));
							newY = b.position.y - Math.floor(randNum(0, 100));
						} else {
							newX = b.position.x + Math.floor(randNum(0, 100));
							newY = b.position.y + Math.floor(randNum(0, 100));
						}
						if (newX > 1500 || newX < 0) {
							newX = 0;
						}
						if (newY > 1000 || newY < 0) {
							newY = 0;
						}
						console.log('New X ' + newX);
						console.log('New Y ' + newY);

						alertTxt = "Sherrif: Go AWAY! You need to keep searching for clues!!";
						game.physics.arcade.moveToXY(b, newX, newY);
						msgTxt.setText(alertTxt);
						msgTxt.x = Math.floor(b.x + 200);
						msgTxt.y = Math.floor(b.y - 20);

						// remove chat message after 3 seconds
						timer.add(3000, () => {
							removeAlertText();
						}, this);
						timer.start();
					}
				}

				// make him stop moving after 2 seconds, because he likes to go forever. 
				timer.add(2000, () => {
					b.body.velocity.x = 0;
					b.body.velocity.y = 0;
				});

			});

			// go through each item, and add collision to them, because who does it manually. 
			itemGroup.forEach(function (item) {
				game.physics.isoArcade.overlap(item, player, function () {

					addItem(item);

					if (item.key == "backpack") {
						alertTxt = "Speed Boost!!!";
						speed = 500;
						msgTxt.setText(alertTxt);
						msgTxt.x = player.x;
						msgTxt.y = player.y;
						timer.add(3000, () => {
							speed = 200;
							removeAlertText();
						});
						timer.start();
					}
					item.destroy();

				});
			})


			game.iso.topologicalSort(obstacleGroup);

		},
		render: function () {

			// obstacleGroup.forEach(function (currentWall) {
			// 	game.debug.body(currentWall);
			// });
			// lucyGroup.forEach(function (item){
			// 	game.debug.body(item);
			// });

			// not'a mucho
		}
	};

	game.state.add('Boot', BasicGame.Boot);
	game.state.start('Boot');


	// add the collected item
	function addItem(e) {


		currentItemCount++;
		updateText();

	}

	// update the item text field
	function updateText() {

		txt = "Clues: " + currentItemCount + "/" + totalItemCount + " Level: " + currentLevel;
		itemsTxt.setText(txt);

	}

	// update the end text field


	// generate random number
	function rndNum(num) {

		return Math.round(Math.random() * num);

	}

	// generate a random number between two numbers. 
	let randNum = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	let removeAlertText = () => {
		msgTxt.setText('');
	};


};

// window.onload can work without <body onload="">
window.onload = init;