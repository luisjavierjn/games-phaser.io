
BasicGame.Preloader = function (game) {

        this.bg = null;
	this.background = null;
	this.preloadBar = null;

	this.ready = false;
};

BasicGame.Preloader.prototype = {
	
	preload: function () {

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

		//	Here we load the rest of the assets our game needs.
		// Main Menu Assets
		this.load.spritesheet('playButton', 'assets/play_button.png', 287, 57);
		this.load.spritesheet('backButton', 'assets/back_button.png', 92, 43);
                this.load.image('title', 'assets/title.png');
                this.load.image('interiorTitle', 'assets/interior_title.png');
                this.load.image('welldone', 'assets/welldone.png');
                this.load.image('organigrama', 'assets/organigrama.png');
                this.load.image('logo', 'assets/logo.png');
                
                // Respuestas
                this.load.image('r1', 'assets/respuestas/1.png');
                this.load.image('r2', 'assets/respuestas/2.png');
                this.load.image('r3', 'assets/respuestas/3.png');
                this.load.image('r4', 'assets/respuestas/4.png');
                this.load.image('r5', 'assets/respuestas/5.png');
                this.load.image('r6', 'assets/respuestas/6.png');
                
                this.load.image('startButton', 'assets/start-button.png');
                this.load.image('scoreboard', 'assets/scoreboard.png');
                this.load.spritesheet('medals', 'assets/medals.png',44, 46, 2);                    
                this.load.image('gameover', 'assets/gameover.png');
                this.load.image('particle', 'assets/particle.png');                    
                this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');
                
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
