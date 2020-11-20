var Coord = function(){
    this.finalPositionX = 0;
    this.finalPositionY = 0;
};

var pos = [];

pos[1] = new Coord();
pos[1].finalPositionX = 368;
pos[1].finalPositionY = 121;

pos[2] = new Coord();
pos[2].finalPositionX = 465;
pos[2].finalPositionY = 121;

pos[3] = new Coord();
pos[3].finalPositionX = 538;
pos[3].finalPositionY = 121;

pos[4] = new Coord();
pos[4].finalPositionX = 368;
pos[4].finalPositionY = 218;

pos[5] = new Coord();
pos[5].finalPositionX = 440;
pos[5].finalPositionY = 218;

pos[6] = new Coord();
pos[6].finalPositionX = 561;
pos[6].finalPositionY = 193;

pos[7] = new Coord();
pos[7].finalPositionX = 368;
pos[7].finalPositionY = 314;

pos[8] = new Coord();
pos[8].finalPositionX = 465;
pos[8].finalPositionY = 293;

pos[9] = new Coord();
pos[9].finalPositionX = 535;
pos[9].finalPositionY = 314;

var Scoreboard = function(game) {
  
  var gameover;
  
  Phaser.Group.call(this, game);
  gameover = this.create(this.game.width / 2, 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);

  this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
  this.scoreboard.anchor.setTo(0.5, 0.5);
  
  this.scoreText = this.game.add.bitmapText(this.scoreboard.width+20, 180, 'flappyfont', '', 18);
  this.add(this.scoreText);
  
  this.bestText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
  this.add(this.bestText);

  // add our start button with a callback
  this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5,0.5);

  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;
  
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) {
  var coin, bestScore;
  this.scoreText.setText(score.toString());
  if(!!localStorage) {
    bestScore = localStorage.getItem('bestScore');
    if(!bestScore || bestScore < score) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
    }
  } else {
    bestScore = 'N/A';
  }

  //this.bestText.setText(bestScore.toString());
  this.bestText.setText("");

  if(score >= 3 && score < 20)
  {
    coin = this.game.add.sprite(-65 , 7, 'medals', 1);
  } else if(score >= 20) {
    coin = this.game.add.sprite(-65 , 7, 'medals', 0);
  }

  this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

  if (coin) {
    
    coin.anchor.setTo(0.5, 0.5);
    this.scoreboard.addChild(coin);
    
     // Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    var emitter = this.game.add.emitter(coin.x, coin.y, 400);
    this.scoreboard.addChild(emitter);
    emitter.width = coin.width;
    emitter.height = coin.height;


    //  This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
    // emitter.width = 800;

    emitter.makeParticles('particle');

    // emitter.minParticleSpeed.set(0, 300);
    // emitter.maxParticleSpeed.set(0, 600);

    emitter.setRotation(-100, 100);
    emitter.setXSpeed(0,0);
    emitter.setYSpeed(0,0);
    emitter.minParticleScale = 0.25;
    emitter.maxParticleScale = 0.5;
    emitter.setAll('body.allowGravity', false);

    emitter.start(false, 1000, 1000);
    
  }
};

Scoreboard.prototype.startClick = function() {
    this.game.state.start('Boot');
};

Scoreboard.prototype.update = function() {
  // write your prefab's specific update code here
};

BasicGame.Game = function (game) {

    //	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;        //      the tween manager
    this.state;         //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

	create: function () {

        this.piecesleft = 9;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add graphics
        this.bg = this.add.sprite(0, 0, 'bg');
        this.interiorTitle = this.add.sprite(40, 8, 'interiorTitle');
        this.backButton = this.add.button(568, 19, 'backButton', this.backToMenu, this, 1, 0, 1);
        this.backButton.input.useHandCursor = true;
        this.bg_dark = this.add.sprite(0, 72, 'bg_dark');
        this.base = this.game.add.sprite(368, 121, 'base');


        // Add Draggable Pieces 
        // Initial position is hard coded, 
        // it would be nice to disposed them randomly :)
        this.piece1 = this.game.add.sprite(24, 269, 'piece1');
        this.piece2 = this.game.add.sprite(244, 149, 'piece2');
        this.piece3 = this.game.add.sprite(161, 115, 'piece3');
        this.piece4 = this.game.add.sprite(27, 104, 'piece4');
        this.piece5 = this.game.add.sprite(70, 161, 'piece5');
        this.piece6 = this.game.add.sprite(203, 291, 'piece6');
        this.piece7 = this.game.add.sprite(203, 201, 'piece7');
        this.piece8 = this.game.add.sprite(154, 249, 'piece8');
        this.piece9 = this.game.add.sprite(58, 331, 'piece9');


        // Pieces final position (Hard coded)
        this.piece1.myIndex = 1;
        this.piece1.finalPositionX = 368;
        this.piece1.finalPositionY = 121;

        this.piece2.myIndex = 2;
        this.piece2.finalPositionX = 465;
        this.piece2.finalPositionY = 121;

        this.piece3.myIndex = 3;
        this.piece3.finalPositionX = 538;
        this.piece3.finalPositionY = 121;

        this.piece4.myIndex = 4;
        this.piece4.finalPositionX = 368;
        this.piece4.finalPositionY = 218;

        this.piece5.myIndex = 5;
        this.piece5.finalPositionX = 440;
        this.piece5.finalPositionY = 218;

        this.piece6.myIndex = 6;
        this.piece6.finalPositionX = 561;
        this.piece6.finalPositionY = 193;

        this.piece7.myIndex = 7;
        this.piece7.finalPositionX = 368;
        this.piece7.finalPositionY = 314;

        this.piece8.myIndex = 8;
        this.piece8.finalPositionX = 465;
        this.piece8.finalPositionY = 293;

        this.piece9.myIndex = 9;
        this.piece9.finalPositionX = 535;
        this.piece9.finalPositionY = 314;

        // Remember the original position 
        for (var i = 1; i <= 9; i++) {

            this['piece' + i].originX = this['piece' + i].x;
            this['piece' + i].inputEnabled = true;
            this['piece' + i].input.enableDrag(false, true);
            this['piece' + i].events.onDragStop.add(this.pieceDragStop, this);

        };

	},


    // When we release a piece do this...
    pieceDragStop: function(item) {

        // Calculate the distance between the piece and its final spot
        //this.totalDistance = this.game.physics.arcade.distanceToXY(item , item.finalPositionX, item.finalPositionY);
        var i;
        for(i=1; i<=9; i++){
            this.totalDistance = this.game.physics.arcade.distanceToXY(item , pos[i].finalPositionX, pos[i].finalPositionY);
            if (this.totalDistance < 50) break;
        }

        // If the distance is minor than 50 pixels the piece is placed in its final spot,
        // otherwise the piece return to its original position
        if (this.totalDistance < 50) {

            //this.game.add.tween(item).to({x: item.finalPositionX, y: item.finalPositionY }, 500, Phaser.Easing.Back.Out, true);
            this.game.add.tween(item).to({x: pos[i].finalPositionX, y: pos[i].finalPositionY }, 500, Phaser.Easing.Back.Out, true);
            
            if(item.myIndex === i) {                
                // This piece is not draggable anymore
                item.inputEnabled = false;
                // Pieces to finish minus one
                this.piecesleft--;
            }

            // If all the pieces are assembled the puzzle is finished :)
            if (this.piecesleft === 0) {

                // Show a greeting message 
                //this.basecolor = this.game.add.sprite(368, 121, 'basecolor');
                this.welldone = this.game.add.sprite(179.5, 251.5, 'welldone');
                this.welldone.anchor.setTo(0.5, 0.5);
                this.game.add.tween(this.welldone.scale).from({x: 0, y: 0 }, 500, Phaser.Easing.Back.Out, true);

                // Play the final animation
                //this.animationWin = this.game.add.sprite(366, 119, 'jigsawWin_anim');
                //this.animationWin.animations.add('win');
                //this.animationWin.animations.play('win', 24, true);
            
                this.scoreboard = new Scoreboard(this.game);
                this.game.add.existing(this.scoreboard);
                //this.scoreboard.show(this.score);       
                this.scoreboard.show(9);
            };

        } else { 

            this.game.add.tween(item).to({x: item.originX, y: item.originY }, 500, Phaser.Easing.Back.Out, true);

        };
    },

	update: function () {

	},

    backToMenu: function (pointer) {

        this.state.start('MainMenu');

    }

};
