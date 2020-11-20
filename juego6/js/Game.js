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
        
        this.piecesleft = 7;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add graphics
        this.bg = this.add.sprite(0, 0, 'bg');
        this.interiorTitle = this.add.sprite(40, 8, 'interiorTitle');
        //this.backButton = this.add.button(568, 19, 'backButton', this.backToMenu, this, 1, 0, 1);
        //this.backButton.input.useHandCursor = true;
        this.preguntas = this.game.add.sprite(0, 240, 'preguntas');
        
        // Add Draggable Answers
        // Initial position is hard coded
        this.answer1 = this.game.add.sprite(625, 10, 'actitudes');
        this.answer2 = this.game.add.sprite(625, 40, 'actividades');
        this.answer3 = this.game.add.sprite(625, 70, 'adecuado');
        this.answer4 = this.game.add.sprite(625, 100, 'aptitudes');
        this.answer5 = this.game.add.sprite(625, 130, 'basicos');
        this.answer6 = this.game.add.sprite(625, 160, 'categoria');
        this.answer7 = this.game.add.sprite(625, 190, 'cliente');
        this.answer8 = this.game.add.sprite(625, 220, 'elementos');
        this.answer9 = this.game.add.sprite(625, 250, 'estilo');
        this.answer10 = this.game.add.sprite(625, 280, 'etiquetarla');
        this.answer11 = this.game.add.sprite(625, 310, 'mecanismos');
        this.answer12 = this.game.add.sprite(625, 340, 'normales');
        this.answer13 = this.game.add.sprite(625, 370, 'propiedades');
        this.answer14 = this.game.add.sprite(625, 400, 'satisfaccion');
        this.answer15 = this.game.add.sprite(625, 430, 'sistemas');
        this.answer16 = this.game.add.sprite(625, 460, 'valorarla');
        
        // Pieces final position (Hard coded)
        this.answer2.finalPositionX = 200;
        this.answer2.finalPositionY = 245;

        this.answer7.finalPositionX = 230;
        this.answer7.finalPositionY = 281;

        this.answer3.finalPositionX = 136;
        this.answer3.finalPositionY = 317;

        this.answer13.finalPositionX = 198;
        this.answer13.finalPositionY = 376;

        this.answer16.finalPositionX = 215;
        this.answer16.finalPositionY = 412;

        this.answer6.finalPositionX = 38;
        this.answer6.finalPositionY = 448;

        this.answer14.finalPositionX = 396;
        this.answer14.finalPositionY = 448;
        
        // Remember the original position 
        for (var i = 1; i <= 16; i++) {

            this['answer' + i].originX = this['answer' + i].x;
            this['answer' + i].originY = this['answer' + i].y;
            this['answer' + i].inputEnabled = true;
            this['answer' + i].input.enableDrag(false, true);
            this['answer' + i].events.onDragStop.add(this.pieceDragStop, this);

        };
        
    },
    
    // When we release a piece do this...
    pieceDragStop: function(item) {
        
        // Calculate the distance between the piece and its final spot
        this.totalDistance = this.game.physics.arcade.distanceToXY( item , item.finalPositionX, item.finalPositionY);

        // If the distance is minor than 50 pixels the piece is placed in its final spot,
        // otherwise the piece return to its original position
        if (this.totalDistance < 50) {

            this.game.add.tween(item).to({x: item.finalPositionX, y: item.finalPositionY }, 500, Phaser.Easing.Back.Out, true);
            // This piece is not draggable anymore
            item.inputEnabled = false;
            // Pieces to finish minus one
            this.piecesleft--;

            // If all the pieces are assembled the puzzle is finished :)
            if (this.piecesleft === 0) {

                // Show a greeting message 
                //this.basecolor = this.game.add.sprite(368, 121, 'basecolor');
                this.welldone = this.game.add.sprite(179.5, 151.5, 'welldone');
                this.welldone.anchor.setTo(0.5, 0.5);
                this.game.add.tween(this.welldone.scale).from({x: 0, y: 0 }, 500, Phaser.Easing.Back.Out, true);

                // Play the final animation
                //this.animationWin = this.game.add.sprite(366, 119, 'jigsawWin_anim');
                //this.animationWin.animations.add('win');
                //this.animationWin.animations.play('win', 24, true);
            
                this.scoreboard = new Scoreboard(this.game);
                this.game.add.existing(this.scoreboard);
                //this.scoreboard.show(this.score);       
                this.scoreboard.show(7);            
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