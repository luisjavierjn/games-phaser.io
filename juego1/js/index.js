    //var game = new Phaser.Game(448, 496, Phaser.AUTO);
    var game = new Phaser.Game(672, 496, Phaser.AUTO, 'phaser-game');    
    var palabras = ["CALIDAD", "CANALES", "PROCESOS", "SERVICIO"];
    var isready = [false, false, false, false];
    var alfabeto = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function dump(obj) {
        var out = '';
        for (var i in obj) {
            out += i + ": " + obj[i] + "\n";
            alert(i + " " + obj[i]);
        }

        //alert(out);

        // or, if you wanted to avoid alerts...

        //var pre = document.createElement('pre');
        //pre.innerHTML = out;
        //document.body.appendChild(pre)
    }
    
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
    game.state.start('Boot');
};

Scoreboard.prototype.update = function() {
  // write your prefab's specific update code here
};

    
    var Enemy = function(player, game) {
        this.game = game;
        this.player = player;
        this.speed = 100;
        this.threshold = 10;
        this.movingTime = 7000; // seg
        
        this.current = Phaser.NONE;        
        this.turning = Phaser.NONE;
        
        this.lastxy = new Phaser.Point();
        this.marker = new Phaser.Point();
        this.turnPoint = new Phaser.Point();

        this.decisions = [ null, null, null, null, null ];
        this.directions = [ null, null, null, null, null ];
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];        
        
        this.chkwall = false;
        this.intentos = 0;
    };
    
    Enemy.prototype = {

        update: function() {
            
            if(this.chkwall)
            {
                this.lastxy.x = this.game.math.snapToFloor(Math.floor(this.player.x), this.game.gridsize) / this.game.gridsize;
                this.lastxy.y = this.game.math.snapToFloor(Math.floor(this.player.y), this.game.gridsize) / this.game.gridsize;

                this.decisions[1] = this.game.map.getTileLeft(this.game.layer.index, this.lastxy.x, this.lastxy.y);
                this.decisions[2] = this.game.map.getTileRight(this.game.layer.index, this.lastxy.x, this.lastxy.y);
                this.decisions[3] = this.game.map.getTileAbove(this.game.layer.index, this.lastxy.x, this.lastxy.y);
                this.decisions[4] = this.game.map.getTileBelow(this.game.layer.index, this.lastxy.x, this.lastxy.y);

                if((this.decisions[this.current].index >=0 && this.decisions[this.current].index < 14) ||
                   (this.decisions[this.current].index >14 && this.decisions[this.current].index < 34)) {
                    
                    this.chkwall = false;                    
                }
            }
            
            this.end = new Date().getTime();            
            this.movingTime = getRandomInt(1,5) * 1000;
            
            if(this.end > this.start + this.movingTime || !this.chkwall)
            {                                
                this.marker.x = this.game.math.snapToFloor(Math.floor(this.player.x), this.game.gridsize) / this.game.gridsize;
                this.marker.y = this.game.math.snapToFloor(Math.floor(this.player.y), this.game.gridsize) / this.game.gridsize;

                this.directions[1] = this.game.map.getTileLeft(this.game.layer.index, this.marker.x, this.marker.y);
                this.directions[2] = this.game.map.getTileRight(this.game.layer.index, this.marker.x, this.marker.y);
                this.directions[3] = this.game.map.getTileAbove(this.game.layer.index, this.marker.x, this.marker.y);
                this.directions[4] = this.game.map.getTileBelow(this.game.layer.index, this.marker.x, this.marker.y);
            
                var randomIdx = getRandomInt(0,4);

                if(this.opposites[randomIdx] !== this.current || this.intentos > 50)
                {
                    this.checkKeys(randomIdx);
                    
                    if (this.turning !== Phaser.NONE)
                    {
                        this.chkwall = true;
                        this.start = new Date().getTime();
                        this.turn();                                
                    }                    
                }
            }
        },

        checkKeys: function (direction) {
            
            if (direction !== Phaser.NONE)
            {                
                this.checkDirection(direction);
            }
            else
            {
                //  This forces them to hold the key down to turn the corner
                this.turning = Phaser.NONE;
            }                        
        },

        checkDirection: function (turnTo) {                        

            if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.game.safetile)
            {
                //  Invalid direction if they're already set to turn that way
                //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
                //console.log(this.turning + " " + turnTo + " " + this.directions[turnTo].index + " " + (this.turning === turnTo) + " " + (this.directions[turnTo] === null) + " " + (this.directions[turnTo].index !== this.safetile));
                
                if(this.directions[turnTo].index !== this.game.safetile){
                    this.intentos++;
                }
            
                return;
            }
            
            this.intentos = 0;
            this.turning = turnTo;

            this.turnPoint.x = (this.marker.x * this.game.gridsize) + (this.game.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.game.gridsize) + (this.game.gridsize / 2);
        },

        turn: function () {

            var cx = Math.floor(this.player.x);
            var cy = Math.floor(this.player.y);

            //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
            if (!this.game.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.game.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
            {
                return false;
            }

            //  Grid align before turning
            this.player.x = this.turnPoint.x;
            this.player.y = this.turnPoint.y;

            this.player.body.reset(this.turnPoint.x, this.turnPoint.y);

            this.move(this.turning);

            this.turning = Phaser.NONE;

            return true;

        },
        
        move: function (direction) {
            
            var speed = this.speed;

            if (direction === Phaser.LEFT || direction === Phaser.UP)
            {
                speed = -speed;
            }
            
            if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
            {
                this.player.body.velocity.x = speed;
            }
            else
            {
                this.player.body.velocity.y = speed;
            }

            //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
            this.player.scale.x = 1;
            this.player.angle = 0;

            if (direction === Phaser.LEFT)
            {
                //this.player.scale.x = -1;
                this.player.animations.play('left');
            }
            else if (direction === Phaser.UP)
            {
                //this.player.angle = 270;
                this.player.animations.play('up');
            }
            else if (direction === Phaser.DOWN)
            {
                //this.player.angle = 90;
                this.player.animations.play('down');
            }
            else
            {
                this.player.animations.play('right');
            }

            this.current = direction;
            //console.log(this.current);
        },
        
        stop: function () {            
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.frame = 0;
        }
        
    };
    
    // Constructor
    function Estado () {
        // Constructor code
    }

    // Static property    
    Estado.START = "START";
    Estado.INICIO = "INICIO";
    Estado.CONCATENAR = "CONCATENAR";
    Estado.COMPROBAR = "COMPROBAR";
    Estado.END = "END";
    Estado.NEUTRO = "NEUTRO";
    
    // Constructor
    function Evento () {
        // Constructor code
    }
    
    Evento.NEUTRO = 1;
    Evento.SPACEBAR_DOWN = 2;
    Evento.SPACEBAR_UP = 3;
    Evento.VALID_KEY = 4;
    Evento.INVALID_KEY = 5;
    Evento.VALID_WORD = 6;
    Evento.INVALID_WORD = 7;
    
    var Lexer = function (words){
        this.Buffer = '';   // se reinicia en en el estado Inicio
        this.Key = '';      // se reinicia en en el estado Inicio
        this.Index = 0;
        this.LastIndex = -1;
        this.Words = words;
        this.Estado_Actual = Estado.START;
        this.Estado_Previo = Estado.START;
        this.Abc = null;
        this.AbcArray = [];
        this.detected = 0;
    };
    
    Lexer.prototype = {

        Init: function(index) {
            
            if(index >= 0 && index < this.Words.length)
            {
                this.Index = index;
                this.LastIndex = this.Index;
                this.Estado_Actual = Estado.START;
                this.Estado_Previo = Estado.START;
            
                this.Exec(this.T(this.Estado_Actual,Evento.NEUTRO));
            }                        
        },
        
        Check: function(evento, abc) {
            
            this.Abc = abc;
            
            this.Key = typeof(abc)==='undefined' ? '' : abc.key;
            
            this.Exec(this.T(this.Estado_Actual,evento));
        },
        
        T: function(initial_state, evento) {
            
            switch(initial_state) 
            {
                case Estado.START:
                    if(evento === Evento.NEUTRO) return Estado.INICIO;
                    break;
                case Estado.INICIO:
                    if(evento === Evento.SPACEBAR_DOWN) return Estado.CONCATENAR;
                    break;
                case Estado.CONCATENAR:
                    if(evento === Evento.SPACEBAR_DOWN) return Estado.CONCATENAR;
                    if(evento === Evento.SPACEBAR_UP) return Estado.INICIO;
                    if(evento === Evento.INVALID_KEY) return Estado.INICIO;
                    if(evento === Evento.VALID_KEY) return Estado.COMPROBAR;
                    break;
                case Estado.COMPROBAR:
                    if(evento === Evento.INVALID_WORD) return Estado.CONCATENAR;
                    if(evento === Evento.VALID_WORD) return Estado.END;
                    break;
                case Estado.END:
                    if(evento === Evento.NEUTRO) return Estado.INICIO;
                    break;
            }
            
            return Estado.NEUTRO;
        },
        
        Exec: function(state) {            
            
            if(state!==Estado.NEUTRO) 
            {
                this.Estado_Previo = this.Estado_Actual;
                this.Estado_Actual = state;
            }
        
            switch(state) 
            {
                case Estado.START: this._start(); break;
                case Estado.INICIO: this._inicio(); break;
                case Estado.CONCATENAR: this._concatenar(); break;
                case Estado.COMPROBAR: this._comprobar(); break;
                case Estado.END: this._end(); break;
                default: break; // NEUTRO
            }
        },

        _start: function() {
            //console.log("START AGAIN");
        },
        
        _inicio: function() {
            this.Buffer = '';
            this.Key = '';
            this.Abc = null;
            this.AbcArray = [];
        },
        
        _concatenar: function() {
            var idx = alfabeto.indexOf(this.Key);
            
            if(idx >= 0) // encontró el Key en el alfabeto
            { 
                this.Buffer += this.Key;
                this.Key = '';
                
                this.AbcArray.push(this.Abc);
                
                this.Exec(this.T(this.Estado_Actual,Evento.VALID_KEY));
            }
            else 
            {
                if(this.Estado_Previo !== Estado.COMPROBAR)
                {
                    this.Exec(this.T(this.Estado_Actual,Evento.INVALID_KEY));
                }
            }
        },
        
        _comprobar: function() {
            var n = palabras[this.Index].localeCompare(this.Buffer);
            //console.log(this.Buffer);
            if(n === 0)
            {
                //console.log(this.Buffer + " " + n);
                //console.log("Valid Word: " + this.Estado_Actual + " " + Evento.VALID_WORD);
                this.Exec(this.T(this.Estado_Actual,Evento.VALID_WORD));                
            }
            else
            {
                //console.log("Invalid Word");
                this.Exec(this.T(this.Estado_Actual,Evento.INVALID_WORD));                
            }
        },
        
        _end: function() {
            //console.log(this.Buffer);
            this.detected++;
            isready[this.Index] = true;
            
            for(var i = 0; i < this.AbcArray.length; i++) {
                this.AbcArray[i].kill();
            }
            this.AbcArray = [];
            
            this.Exec(this.T(this.Estado_Actual,Evento.NEUTRO));
        }
    };
    
    var BasicGame = {};
    
    BasicGame.Boot = function (game) {

    };

    BasicGame.Boot.prototype = {

        init: function () {

            // Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
            this.input.maxPointers = 1;

            // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = false;

            this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
            this.scale.pageAlignHorizontally = true;

        },

        preload: function () {

            // Here we load the assets required for our preloader (in this case a background and a loading bar)
            this.load.image('preloaderBackground', 'assets/preloader_background.png');
            this.load.image('preloaderBar', 'assets/preloader_bar.png');     
            this.load.image('usualsuspectsLogo', 'assets/usualsuspects_logo.png');
            this.load.image('bg', 'assets/background.png');

        },

        create: function () {

            // By this point the preloader assets have loaded to the cache, we've set the game settings
            // So now let's start the real preloader going
            this.state.start('Preloader');

        }

    };
    

    BasicGame.Preloader = function (game) {

            this.bg = null;
            this.background = null;
            this.preloadBar = null;

            this.ready = false;
    };

    BasicGame.Preloader.prototype = {

            preload: function () {
                    //alert("Hola");

                    //	These are the assets we loaded in Boot.js
                    //	A nice  background and a loading progress bar
                    this.bg = this.add.sprite(0, 0, 'bg');
                    this.background = this.add.sprite(260, 295, 'preloaderBackground');
                    this.preloadBar = this.add.sprite(260, 295, 'preloaderBar');		
                    this.usualsuspectsLogo = this.add.sprite(230, 139, 'usualsuspectsLogo');

                    //	This sets the preloadBar sprite as a loader sprite.
                    //	What that does is automatically crop the sprite from 0 to full-width
                    //	as the files below are loaded in.
                    this.load.setPreloadSprite(this.preloadBar);

                    this.load.image('A', 'assets/alfabeto/A.png');
                    this.load.image('B', 'assets/alfabeto/B.png');
                    this.load.image('C', 'assets/alfabeto/C.png');
                    this.load.image('D', 'assets/alfabeto/D.png');
                    this.load.image('E', 'assets/alfabeto/E.png');
                    this.load.image('F', 'assets/alfabeto/F.png');
                    this.load.image('G', 'assets/alfabeto/G.png');
                    this.load.image('H', 'assets/alfabeto/H.png');
                    this.load.image('I', 'assets/alfabeto/I.png');
                    this.load.image('J', 'assets/alfabeto/J.png');
                    this.load.image('K', 'assets/alfabeto/K.png');
                    this.load.image('L', 'assets/alfabeto/L.png');
                    this.load.image('M', 'assets/alfabeto/M.png');
                    this.load.image('N', 'assets/alfabeto/N.png');
                    this.load.image('Ñ', 'assets/alfabeto/Ñ.png');
                    this.load.image('O', 'assets/alfabeto/O.png');
                    this.load.image('P', 'assets/alfabeto/P.png');
                    this.load.image('Q', 'assets/alfabeto/Q.png');
                    this.load.image('R', 'assets/alfabeto/R.png');
                    this.load.image('S', 'assets/alfabeto/S.png');
                    this.load.image('T', 'assets/alfabeto/T.png');
                    this.load.image('U', 'assets/alfabeto/U.png');
                    this.load.image('V', 'assets/alfabeto/V.png');
                    this.load.image('W', 'assets/alfabeto/W.png');
                    this.load.image('X', 'assets/alfabeto/X.png');
                    this.load.image('Y', 'assets/alfabeto/Y.png');
                    this.load.image('Z', 'assets/alfabeto/Z.png');

                    this.load.image('1', 'assets/alfabeto/1.png');
                    this.load.image('2', 'assets/alfabeto/2.png');
                    this.load.image('3', 'assets/alfabeto/3.png');
                    this.load.image('4', 'assets/alfabeto/4.png');

                    this.load.image('dot', 'assets/dot.png');
                    this.load.image('tiles', 'assets/pacman-tiles.png');
                    //this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
                    //this.load.spritesheet('pacman', 'assets/dude.png', 21, 32);
                    this.load.spritesheet('pacman', 'assets/personajes.png', 32, 32);
                    this.load.spritesheet('knight', 'assets/personajes.png', 32, 32);
                    this.load.spritesheet('thief', 'assets/personajes.png', 32, 32);
                    this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
                    //this.load.spritesheet('dude', 'assets/dude.png', 21, 31);
                    //  Needless to say, graphics (C)opyright Namco

                    this.load.image('_A', 'assets/grandes/A.png');
                    this.load.image('_B', 'assets/grandes/B.png');
                    this.load.image('_C', 'assets/grandes/C.png');
                    this.load.image('_D', 'assets/grandes/D.png');
                    this.load.image('_E', 'assets/grandes/E.png');
                    this.load.image('_F', 'assets/grandes/F.png');
                    this.load.image('_G', 'assets/grandes/G.png');
                    this.load.image('_H', 'assets/grandes/H.png');
                    this.load.image('_I', 'assets/grandes/I.png');
                    this.load.image('_J', 'assets/grandes/J.png');
                    this.load.image('_K', 'assets/grandes/K.png');
                    this.load.image('_L', 'assets/grandes/L.png');
                    this.load.image('_M', 'assets/grandes/M.png');
                    this.load.image('_N', 'assets/grandes/N.png');
                    this.load.image('_Ñ', 'assets/grandes/Ñ.png');
                    this.load.image('_O', 'assets/grandes/O.png');
                    this.load.image('_P', 'assets/grandes/P.png');
                    this.load.image('_Q', 'assets/grandes/Q.png');
                    this.load.image('_R', 'assets/grandes/R.png');
                    this.load.image('_S', 'assets/grandes/S.png');
                    this.load.image('_T', 'assets/grandes/T.png');
                    this.load.image('_U', 'assets/grandes/U.png');
                    this.load.image('_V', 'assets/grandes/V.png');
                    this.load.image('_W', 'assets/grandes/W.png');
                    this.load.image('_X', 'assets/grandes/X.png');
                    this.load.image('_Y', 'assets/grandes/Y.png');
                    this.load.image('_Z', 'assets/grandes/Z.png');
                    
                    this.load.image('startButton', 'assets/start-button.png');
                    this.load.image('scoreboard', 'assets/scoreboard.png');
                    this.load.spritesheet('medals', 'assets/medals.png',44, 46, 2);                    
                    this.load.image('gameover', 'assets/gameover.png');
                    this.load.image('particle', 'assets/particle.png');                    
                    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');

                    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

            },

            create: function () {

                    //	Once the load has finished we disable the crop
                    this.preloadBar.cropEnabled = false;
                    //this.state.start('MainMenu');
                    this.state.start('Game');

            },

            update: function () {

                    //	You don't actually need to do this, but I find it gives a much smoother game experience.
                    //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
                    //	You can jump right into the menu if you want and still play the music, but you'll have a few
                    //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
                    //	it's best to wait for it to decode here first, then carry on.

                    //	If you don't have any music in your game then put the game.state.start line into the create function and delete
                    //	the update function completely.

                    // if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
                    // {
                    // 	this.ready = true;
                    // 	this.state.start('MainMenu');
                    // }

            }

    };


    BasicGame.Pacman = function (game) {

        this.map = null;
        this.layer = null;
        this.pacman = null;
        
        this.knight = null;
        this.knight_handler = null;

        this.thief = null;
        this.thief_handler = null;

        this.safetile = 14;
        this.gridsize = 16;

        this.speed = 120; //150
        this.threshold = 10;

        this.marker = new Phaser.Point();
        this.turnPoint = new Phaser.Point();

        this.directions = [ null, null, null, null, null ];
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

        this.current = Phaser.NONE;
        this.turning = Phaser.NONE;
        this.lastdir = Phaser.NONE;
        this.lastkey = "";
        
        this.analyzer;// = new Lexer(palabras);        
        
        this.num1 = null;
        this.num2 = null;
        this.num3 = null;
        this.num4 = null;
        this.score = 0;
        this.scoreText;
        this.lives = 3;
        this.livesText;
        this.titulo;
        this.oracion1;
        this.oracion2;
        this.oracion3;
        this.oracion4;
        this.ganaste;
        this.perdiste;
        
        this.idxsel = 0;
        this.selection = [];
        this.safetiles = [];
    };
    
    BasicGame.Pacman.prototype = {

        init: function () {                        

            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.pageAlignHorizontally = true;
            //this.scale.pageAlignVertically = true;

            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

            this.physics.startSystem(Phaser.Physics.ARCADE);            
            
        },


        preload: function () {

            //  We need this because the assets are on Amazon S3
            //  Remove the next 2 lines if running locally
            //this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue005/';
            //this.load.crossOrigin = 'anonymous';


            //this.scale.setGameSize(window.innerWidth, window.innerHeight);
            this.analyzer = new Lexer(palabras);  
            this.ganaste = false;
            isready[0] = false;
            isready[1] = false;
            isready[2] = false;
            isready[3] = false;
        },

        create: function () {

            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('pacman-tiles', 'tiles');

            this.layer = this.map.createLayer('Pacman');
            
            this.dots = this.add.physicsGroup();            
            this.alfa = this.add.physicsGroup();
            this.nums = this.add.physicsGroup();

            //this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);
            
            this.map.createFromTiles(35, this.safetile, 'A', this.layer, this.alfa);
            this.map.createFromTiles(36, this.safetile, 'B', this.layer, this.alfa);
            this.map.createFromTiles(37, this.safetile, 'C', this.layer, this.alfa);
            this.map.createFromTiles(38, this.safetile, 'D', this.layer, this.alfa);
            this.map.createFromTiles(39, this.safetile, 'E', this.layer, this.alfa);
            this.map.createFromTiles(40, this.safetile, 'F', this.layer, this.alfa);
            this.map.createFromTiles(41, this.safetile, 'G', this.layer, this.alfa);
            this.map.createFromTiles(42, this.safetile, 'H', this.layer, this.alfa);
            this.map.createFromTiles(43, this.safetile, 'I', this.layer, this.alfa);
            this.map.createFromTiles(44, this.safetile, 'J', this.layer, this.alfa);
            this.map.createFromTiles(45, this.safetile, 'K', this.layer, this.alfa);
            this.map.createFromTiles(46, this.safetile, 'L', this.layer, this.alfa);
            this.map.createFromTiles(47, this.safetile, 'M', this.layer, this.alfa);
            this.map.createFromTiles(48, this.safetile, 'N', this.layer, this.alfa);
            this.map.createFromTiles(49, this.safetile, 'Ñ', this.layer, this.alfa);
            this.map.createFromTiles(50, this.safetile, 'O', this.layer, this.alfa);
            this.map.createFromTiles(51, this.safetile, 'P', this.layer, this.alfa);
            this.map.createFromTiles(52, this.safetile, 'Q', this.layer, this.alfa);
            this.map.createFromTiles(53, this.safetile, 'R', this.layer, this.alfa);
            this.map.createFromTiles(54, this.safetile, 'S', this.layer, this.alfa);
            this.map.createFromTiles(55, this.safetile, 'T', this.layer, this.alfa);
            this.map.createFromTiles(56, this.safetile, 'U', this.layer, this.alfa);
            this.map.createFromTiles(57, this.safetile, 'V', this.layer, this.alfa);
            this.map.createFromTiles(58, this.safetile, 'W', this.layer, this.alfa);
            this.map.createFromTiles(59, this.safetile, 'X', this.layer, this.alfa);
            this.map.createFromTiles(60, this.safetile, 'Y', this.layer, this.alfa);
            this.map.createFromTiles(61, this.safetile, 'Z', this.layer, this.alfa);
            
            this.map.createFromTiles(62, this.safetile, '1', this.layer, this.nums);
            this.map.createFromTiles(63, this.safetile, '2', this.layer, this.nums);
            this.map.createFromTiles(64, this.safetile, '3', this.layer, this.nums);
            this.map.createFromTiles(65, this.safetile, '4', this.layer, this.nums);

            //  The dots will need to be offset by 6px to put them back in the middle of the grid
            this.dots.setAll('x', 6, false, false, 1);
            this.dots.setAll('y', 6, false, false, 1);

            //  Pacman should collide with everything except the safe tile
            this.map.setCollisionByExclusion([this.safetile], true, this.layer);
            
            /************** PAC-MAN *************/
            
            //  Position Pacman at grid location 14x17 (the +8 accounts for his anchor)
            this.pacman = this.add.sprite((14 * 16), (14 * 16) + 8, 'pacman', 7);
            this.pacman.anchor.set(0.5);
            //this.pacman.animations.add('munch', [0, 1, 2, 1], 20, true);
            
            //  Our two animations, walking left and right.
            //this.pacman.animations.add('left', [0, 1, 2, 3], 10, true);
            //this.pacman.animations.add('down', [0, 1, 2, 3], 10, true);
            //this.pacman.animations.add('right', [5, 6, 7, 8], 10, true);
            //this.pacman.animations.add('up', [5, 6, 7, 8], 10, true);            
            this.pacman.animations.add('left', [18, 19, 20], 10, true);
            this.pacman.animations.add('down', [6, 7, 8], 10, true);
            this.pacman.animations.add('right', [30, 31, 32], 10, true);
            this.pacman.animations.add('up', [42, 43, 44], 10, true);

            this.physics.arcade.enable(this.pacman);
            this.pacman.body.setSize(16, 16, 0, 0);
            
            /************** KNIGHT *************/

            this.knight = this.add.sprite((1 * 16) + 8, (14 * 16) + 8, 'knight', 24);
            this.knight.anchor.set(0.5);
            
            this.knight.animations.add('left', [12, 13, 14], 10, true);
            this.knight.animations.add('down', [0, 1, 2], 10, true);
            this.knight.animations.add('right', [24, 25, 26], 10, true);
            this.knight.animations.add('up', [36, 37, 38], 10, true);
            
            this.physics.arcade.enable(this.knight);
            this.knight.body.setSize(16, 16, 0, 0);            
            this.knight_handler = new Enemy(this.knight, this);

            /************** THIEF *************/

            this.thief = this.add.sprite((26 * 16) + 8, (14 * 16) + 8, 'thief', 24);
            this.thief.anchor.set(0.5);
            
            this.thief.animations.add('left', [69, 70, 71], 10, true);
            this.thief.animations.add('down', [57, 58, 59], 10, true);
            this.thief.animations.add('right', [81, 82, 83], 10, true);
            this.thief.animations.add('up', [93, 94, 95], 10, true);
            
            this.physics.arcade.enable(this.thief);
            this.thief.body.setSize(16, 16, 0, 0);            
            this.thief_handler = new Enemy(this.thief, this);
            
            /***********************************/
            
            this.num1 = this.add.sprite((10 * 16) + 8, (14 * 16) + 8, '1');
            this.num1.anchor.set(0.5);
            this.physics.arcade.enable(this.num1);
            this.num1.body.setSize(16, 16, 0, 0);
            this.num1.body.immovable = true;                      

            this.num2 = this.add.sprite((12 * 16) + 8, (16 * 16) + 8, '2');
            this.num2.anchor.set(0.5);
            this.physics.arcade.enable(this.num2);
            this.num2.body.setSize(16, 16, 0, 0);
            this.num2.body.immovable = true;                      

            this.num3 = this.add.sprite((15 * 16) + 8, (16 * 16) + 8, '3');
            this.num3.anchor.set(0.5);
            this.physics.arcade.enable(this.num3);
            this.num3.body.setSize(16, 16, 0, 0);
            this.num3.body.immovable = true;                      

            this.num4 = this.add.sprite((17 * 16) + 8, (14 * 16) + 8, '4');
            this.num4.anchor.set(0.5);
            this.physics.arcade.enable(this.num4);
            this.num4.body.setSize(16, 16, 0, 0);
            this.num4.body.immovable = true;                      
            
            /***********************************/
           
            this.cursors = this.input.keyboard.createCursorKeys();
            
            this.sbar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);            
            
            //this.input.keyboard.onDown.add(processKey, this);

            //this.pacman.play('munch');
            //this.move(Phaser.LEFT);
            //this.knight_handler.move(Phaser.LEFT);
            
            //  The score
            this.scoreText = this.add.text((3 * 16), (2 * 16) + 8, 'Puntaje:0/4', { fontSize: '24px', fill: '#fff' });
            this.livesText = this.add.text((18 * 16), (2 * 16) + 8, 'Vidas:3/3', { fontSize: '24px', fill: '#fff' });
            this.titulo = this.add.text((29 * 16), (0 * 16) + 8, 'Busque las palabras que\ncompleten las siguientes\noraciones', { fontSize: '16px', fill: '#ffffff' });
            
            this.ganaste = this.add.text((11 * 16), (14 * 16), 'GANASTE!!', { fontSize: '18px', fill: '#fff' });
            this.perdiste = this.add.text((11 * 16) + 8, (13 * 16) + 8, 'F5 para volver\n  a intentarlo', { fontSize: '12px', fill: '#fff' });
            this.ganaste.visible = false;
            this.perdiste.visible = false;
            
            this.oracion1 = this.add.text((29 * 16), (5 * 16) + 8, '1) ___________ está relacionada\na los niveles de satisfacción\nobtenidos debido a las atenciones\nrecibidas.', { fontSize: '12px', fill: '#fff' });
            this.oracion2 = this.add.text((29 * 16), (11 * 16) + 8, '2) Los ____________ son puntos\nde contacto con el cliente, que\npueden ser espacios físicos,\nvirtuales o Contact Center.', { fontSize: '12px', fill: '#fff' });
            this.oracion3 = this.add.text((29 * 16), (17 * 16) + 8, '3) Las Políticas, Normas y\nprocedimientos son llamadas\ntambién __________________', { fontSize: '12px', fill: '#fff' });
            this.oracion4 = this.add.text((29 * 16), (22 * 16) + 8, '4) Cuando se da algo que proviene\nde nosotros, pero no en forma\nmaterial, sino cosas intangibles\ncomo  atención, amabilidad\ny disposición, estamos hablando\nde ________________.', { fontSize: '12px', fill: '#fff' });
                        
        },
        
        checkKeys: function () {
            
            if (this.cursors.left.isDown && this.current !== Phaser.LEFT)
            {
                this.checkDirection(Phaser.LEFT);
            }
            else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT)
            {
                this.checkDirection(Phaser.RIGHT);
            }
            else if (this.cursors.up.isDown && this.current !== Phaser.UP)
            {
                this.checkDirection(Phaser.UP);
            }
            else if (this.cursors.down.isDown && this.current !== Phaser.DOWN)
            {
                this.checkDirection(Phaser.DOWN);
            }
            else
            {
                //  This forces them to hold the key down to turn the corner
                this.turning = Phaser.NONE;
            }
                        
        },

        checkDirection: function (turnTo) {                        

            if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)            
            {
                //  Invalid direction if they're already set to turn that way
                //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
                return;
            }

            //  Check if they want to turn around and can
            if (this.current === this.opposites[turnTo])
            {                
                this.move(turnTo);
            }
            else
            {                
                this.turning = turnTo;

                this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
                this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
            }
            
            this.lastdir = turnTo;

        },

        turn: function () {

            var cx = Math.floor(this.pacman.x);
            var cy = Math.floor(this.pacman.y);

            //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
            if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
            {
                return false;
            }

            //  Grid align before turning
            this.pacman.x = this.turnPoint.x;
            this.pacman.y = this.turnPoint.y;

            this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);

            this.move(this.turning);

            this.turning = Phaser.NONE;

            return true;

        },

        move: function (direction) {

            var speed = this.speed;

            if (direction === Phaser.LEFT || direction === Phaser.UP)
            {
                speed = -speed;
            }
            
            if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
            {
                this.pacman.body.velocity.x = speed;
            }
            else
            {
                this.pacman.body.velocity.y = speed;
            }

            //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
            this.pacman.scale.x = 1;
            this.pacman.angle = 0;

            if (direction === Phaser.LEFT)
            {
                //this.pacman.scale.x = -1;
            }
            else if (direction === Phaser.UP)
            {
                //this.pacman.angle = 270;
            }
            else if (direction === Phaser.DOWN)
            {
                //this.pacman.angle = 90;
            }

            this.current = direction;

        },

        selPreg1: function (pacman, num1) {
            if(!isready[0]){
                
                this.analyzer.Init(0);
                this.score = this.analyzer.detected;

                this.oracion1.fill = '#FFC90E';
                if(!isready[1]){this.oracion2.fill = '#ffffff';}
                if(!isready[2]){this.oracion3.fill = '#ffffff';}
                if(!isready[3]){this.oracion4.fill = '#ffffff';}
                console.log("Pregunta #1");
            }
        },

        selPreg2: function (pacman, num1) {
            if(!isready[1]){
                
                this.analyzer.Init(1);
                this.score = this.analyzer.detected;

                if(!isready[0]){this.oracion1.fill = '#ffffff';}
                this.oracion2.fill = '#FFC90E';
                if(!isready[2]){this.oracion3.fill = '#ffffff';}
                if(!isready[3]){this.oracion4.fill = '#ffffff';}
                console.log("Pregunta #2");
            }
        },

        selPreg3: function (pacman, num1) {
            if(!isready[2]){
                
                this.analyzer.Init(2);
                this.score = this.analyzer.detected;

                if(!isready[0]){this.oracion1.fill = '#ffffff';}
                if(!isready[1]){this.oracion2.fill = '#ffffff';}
                this.oracion3.fill = '#FFC90E';
                if(!isready[3]){this.oracion4.fill = '#ffffff';}
                console.log("Pregunta #3");
            }
        },
        
        selPreg4: function (pacman, num1) {
            if(!isready[3]){
                
                this.analyzer.Init(3);
                this.score = this.analyzer.detected;

                if(!isready[0]){this.oracion1.fill = '#ffffff';}
                if(!isready[1]){this.oracion2.fill = '#ffffff';}
                if(!isready[2]){this.oracion3.fill = '#ffffff';}
                this.oracion4.fill = '#FFC90E';            
                console.log("Pregunta #4");
            }
        },
        
        getKill: function (pacman, player) {

            pacman.kill();
            this.lives--;
            
            if(this.lives > 0) {
                
                //  Position Pacman at grid location 14x17 (the +8 accounts for his anchor)
                this.pacman = this.add.sprite((14 * 16), (14 * 16) + 8, 'pacman', 7);
                this.pacman.anchor.set(0.5);
                //this.pacman.animations.add('munch', [0, 1, 2, 1], 20, true);

                //  Our two animations, walking left and right.
                //this.pacman.animations.add('left', [0, 1, 2, 3], 10, true);
                //this.pacman.animations.add('down', [0, 1, 2, 3], 10, true);
                //this.pacman.animations.add('right', [5, 6, 7, 8], 10, true);
                //this.pacman.animations.add('up', [5, 6, 7, 8], 10, true);            
                this.pacman.animations.add('left', [18, 19, 20], 10, true);
                this.pacman.animations.add('down', [6, 7, 8], 10, true);
                this.pacman.animations.add('right', [30, 31, 32], 10, true);
                this.pacman.animations.add('up', [42, 43, 44], 10, true);

                this.physics.arcade.enable(this.pacman);
                this.pacman.body.setSize(16, 16, 0, 0);
            }
            else
            {
                this.perdiste.visible = true;
            }
        },

        eatDot: function (pacman, dot) {

            if(this.sbar.isDown) {
                dot.kill();
            }

            if (this.dots.total === 0)
            {
                this.dots.callAll('revive');
            }

        },

        eatAbc: function (pacman, abc) {

            if(this.sbar.isDown) {
                //abc.kill();
                //dump(abc);
                //alert(abc.key);
                //console.log(abc.body.index);
                
                var n = this.physics.arcade.distanceBetween(this.pacman, abc);
                //console.log(abc.key + " " + num);
                if(n <= 10){
                    if(this.lastkey !== abc.key)
                    {                        
                        this.analyzer.Check(Evento.SPACEBAR_DOWN,abc);
                        this.lastkey = abc.key;                              
                        //console.log(abc.key);                        

                        this.selection[this.idxsel] = this.add.sprite(abc.position.x, abc.position.y, '_'+abc.key);                        
                        this.physics.arcade.enable(this.selection[this.idxsel]);
                        //this.selection[this.idxsel].body.setSize(16, 16, 0, 0);
                        this.selection[this.idxsel].body.immovable = true;
                        
                        this.safetiles[this.idxsel] = abc;
                        this.safetiles[this.idxsel].visible = false;
                        
                        this.idxsel++;
                    }                    
                }
                
                /*
                if(this.lastkey === ""){
                    this.lastkey="-";
                    this.analyzer.Check(Evento.SPACEBAR_DOWN,"C");
                    this.analyzer.Check(Evento.SPACEBAR_DOWN,"A");
                    this.analyzer.Check(Evento.SPACEBAR_DOWN,"L");
                    this.analyzer.Check(Evento.SPACEBAR_DOWN,"I");
                    this.analyzer.Check(Evento.SPACEBAR_DOWN,"D");
                    this.analyzer.Check(Evento.SPACEBAR_DOWN,"A");
                    this.analyzer.Check(Evento.SPACEBAR_DOWN,"D");
                }
                */
            }
            
            if(this.sbar.isUp){
                
                this.analyzer.Check(Evento.SPACEBAR_UP);
                
                for(var i = 0; i < this.selection.length; i++) {
                    this.selection[i].kill();
                    this.safetiles[i].visible = true;
                }
                
                this.selection = [];
                this.safetiles = [];
                this.idxsel = 0;
            }

        },
        
        controller: function() {
            
            if(this.lastdir === Phaser.LEFT)
            {
                if (this.cursors.left.isDown) 
                {
                    this.pacman.body.velocity.x = -this.speed;
                    this.pacman.animations.play('left');
                }
                else 
                {
                    this.pacman.body.velocity.x = 0;                    
                    this.pacman.frame = 7;
                }
            }
            
            if(this.lastdir === Phaser.RIGHT)
            {
                if (this.cursors.right.isDown) 
                {
                    this.pacman.body.velocity.x = this.speed;
                    this.pacman.animations.play('right');
                }
                else 
                {
                    this.pacman.body.velocity.x = 0;
                    this.pacman.frame = 7;
                }
            }

            if(this.lastdir === Phaser.UP)
            {
                if (this.cursors.up.isDown) 
                {
                    this.pacman.body.velocity.y = -this.speed;
                    this.pacman.animations.play('up');
                }
                else 
                {
                    this.pacman.body.velocity.y = 0;
                    this.pacman.frame = 7;
                }
            }

            if(this.lastdir === Phaser.DOWN)
            {
                if (this.cursors.down.isDown) 
                {
                    this.pacman.body.velocity.y = this.speed;
                    this.pacman.animations.play('down');
                }
                else 
                {
                    this.pacman.body.velocity.y = 0;
                    this.pacman.frame = 7;
                }
            }
        },

        update: function () {
            
            this.scoreText.text = 'Puntaje:' + this.analyzer.detected + '/4';
            this.livesText.text = 'Vidas:' + this.lives + '/3';
            
            if(this.analyzer.detected > this.score) {
                
                this.score = this.analyzer.detected;
                
                switch(this.analyzer.Index){
                    case 0:              
                        this.oracion1.text = '1) CALIDAD está relacionada\na los niveles de satisfacción\nobtenidos debido a las atenciones\nrecibidas.';
                        this.oracion1.fill = '#999999';
                        break;
                    case 1:
                        this.oracion2.text = '2) Los CANALES son puntos\nde contacto con el cliente, que\npueden ser espacios físicos,\nvirtuales o Contact Center.';
                        this.oracion2.fill = '#999999';
                        break;
                    case 2:      
                        this.oracion3.text = '3) Las Políticas, Normas y\nprocedimientos son llamadas\ntambién PROCESOS';
                        this.oracion3.fill = '#999999';
                        break;
                    case 3:      
                        this.oracion4.text = '4) Cuando se da algo que proviene\nde nosotros, pero no en forma\nmaterial, sino cosas intangibles\ncomo  atención, amabilidad\ny disposición, estamos hablando\nde SERVICIO.';
                        this.oracion4.fill = '#999999';
                        break;
                }
            }
            
            if(this.analyzer.detected === 4){
                if(!this.ganaste.visible){
                    this.scoreboard = new Scoreboard(this.game);
                    this.game.add.existing(this.scoreboard);
                    this.scoreboard.show(this.score);
                }
                //----
                this.knight.kill();
                this.thief.kill();
                this.ganaste.visible = true;
            }

            this.physics.arcade.collide(this.knight, this.num1); // two sprites
            this.physics.arcade.collide(this.knight, this.num2); // two sprites
            this.physics.arcade.collide(this.knight, this.num3); // two sprites
            this.physics.arcade.collide(this.knight, this.num4); // two sprites
            this.physics.arcade.collide(this.knight, this.layer);

            this.physics.arcade.collide(this.thief, this.num1); // two sprites
            this.physics.arcade.collide(this.thief, this.num2); // two sprites
            this.physics.arcade.collide(this.thief, this.num3); // two sprites
            this.physics.arcade.collide(this.thief, this.num4); // two sprites
            this.physics.arcade.collide(this.thief, this.layer);
            
            this.physics.arcade.collide(this.pacman, this.layer);            
            //this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);
            this.physics.arcade.overlap(this.pacman, this.alfa, this.eatAbc, null, this);
            this.physics.arcade.overlap(this.pacman, this.knight, this.getKill, null, this);
            this.physics.arcade.overlap(this.pacman, this.thief, this.getKill, null, this);
            this.physics.arcade.overlap(this.pacman, this.num1, this.selPreg1, null, this);
            this.physics.arcade.overlap(this.pacman, this.num2, this.selPreg2, null, this);
            this.physics.arcade.overlap(this.pacman, this.num3, this.selPreg3, null, this);
            this.physics.arcade.overlap(this.pacman, this.num4, this.selPreg4, null, this);

            this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
            this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;

            //  Update our grid sensors
            this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
            this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
            this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
            this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);
                       
            this.checkKeys();
                       
            if (this.turning !== Phaser.NONE)
            {
                this.turn();                                
            }
                        
            this.controller();
            
            this.knight_handler.update();
            this.thief_handler.update();
        }

    };

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	game.state.add('Boot', BasicGame.Boot);
        game.state.add('Preloader', BasicGame.Preloader);
        //game.state.add('MainMenu', BasicGame.MainMenu);
        game.state.add('Game', BasicGame.Pacman);

	//	Now start the Boot state.
	game.state.start('Boot');
        
    //game.state.add('Game', BasicGame.Pacman, true);    
    //alert("UTILICE LAS FLECHAS DEL TECLADO PARA MOVILIZARSE\nY MANTENGA PRESIONADA LA BARRA ESPACIADORA\nPARA SELECCIONAR LA RESPUESTA");