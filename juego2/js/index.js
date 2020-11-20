var game = new Phaser.Game(672, 496, Phaser.AUTO, 'phaser-game');

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

        this.game.load.tilemap('matching', 'assets/tilemaps/maps/phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/phaser_tiles.png');//, 100, 100, -1, 1, 1);   

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

BasicGame.MatchingPairs = function (game) {
    this.timeCheck = 0;
    this.flipFlag = false;

    this.startList = new Array();
    this.squareList = new Array();

    this.masterCounter = 0;
    this.squareCounter = 0;
    this.square1Num;
    this.square2Num;
    this.savedSquareX1;
    this.savedSquareY1;
    this.savedSquareX2;
    this.savedSquareY2;

    this.map;
    this.tileset;
    this.layer;

    this.marker;
    this.currentTile;
    this.currentTilePosition;

    this.tileBack = 25;
    this.timesUp = '+';
    this.youWin = '+';

    this.myCountdownSeconds;
    this.currentNum;
};

BasicGame.MatchingPairs.prototype = {
    
    preload: function() {


    },
    
    create: function() {

        this.map = this.game.add.tilemap('matching');

        this.map.addTilesetImage('Desert', 'tiles');

        //tileset = game.add.tileset('tiles');

        this.layer = this.map.createLayer('Ground');//.tilemapLayer(0, 0, 600, 600, tileset, map, 0);

        //layer.resizeWorld();

        this.marker = this.game.add.graphics();
        this.marker.lineStyle(2, 0x00FF00, 1);
        this.marker.drawRect(0, 0, 100, 100);

        randomizeTiles();

    },
    
    update: function() {

        countDownTimer();

        if (this.layer.getTileX(this.game.input.activePointer.worldX) <= 5) // to prevent the marker from going out of bounds
        {
            this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 100;
            this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 100;
        }

        if (this.flipFlag === true) 
        {
            if (this.game.time.totalElapsedSeconds() - this.timeCheck > 0.5)
            {
                flipBack();
            }
        }
        else
        {
            processClick();
        }
    },
    
    countDownTimer: function() {

        var timeLimit = 300;

        var mySeconds = this.game.time.totalElapsedSeconds();
        this.myCountdownSeconds = timeLimit - mySeconds;

        if (this.myCountdownSeconds <= 0) 
        {
            // time is up
            this.timesUp = 'Tiempo finalizado!';
            this.youWin = 'F5 para refrescar'
        }
    },
    

    processClick: function() {
        if (this.myCountdownSeconds <= 0) return;

        this.currentTile = this.map.getTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y));
        this.currentTilePosition = ((this.layer.getTileY(this.game.input.activePointer.worldY)+1)*6)-(6-(this.layer.getTileX(this.game.input.activePointer.worldX)+1));

        if (this.game.input.mousePointer.isDown)
            {
            // check to make sure the tile is not already flipped
            if (this.currentTile.index === tileBack)
            {
                // get the corresponding item out of squareList
                this.currentNum = squareList[this.currentTilePosition-1];
                flipOver();
                    this.squareCounter++;
                // is the second tile of pair flipped?
                if  (this.squareCounter === 2) 
                {
                    // reset this.squareCounter
                    this.squareCounter = 0;
                    this.square2Num = this.currentNum;
                    // check for match
                    if (this.square1Num === this.square2Num)
                    {
                        this.masterCounter++;    

                        if (this.masterCounter === 18) 
                        {
                            // go "win"
                            this.youWin = 'Ganaste!';
                        }                       
                    }
                    else
                    {
                        this.savedSquareX2 = this.layer.getTileX(this.marker.x);
                        this.savedSquareY2 = this.layer.getTileY(this.marker.y);
                            this.flipFlag = true;
                            this.timeCheck = this.game.time.totalElapsedSeconds();
                    }   
                }   
                else
                {
                    this.savedSquareX1 = this.layer.getTileX(this.marker.x);
                    this.savedSquareY1 = this.layer.getTileY(this.marker.y);
                        this.square1Num = this.currentNum;
                }           
            }           
        }    
    },
    
    flipOver: function() {

        this.map.putTile(this.currentNum, this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y));
    },
 
    flipBack: function() {

        this.flipFlag = false;

        this.map.putTile(this.tileBack, this.savedSquareX1, this.savedSquareY1);
        this.map.putTile(this.tileBack, this.savedSquareX2, this.savedSquareY2);

    },
    
    randomizeTiles: function() {

        var num;
        for (num = 1; num <= 18; num++)
        {
            this.startList.push(num);
        }
        for (num = 1; num <= 18; num++)
        {
            this.startList.push(num);
        }

        // for debugging
        //var myString1 = this.startList.toString();

        // randomize squareList
        for (var i = 1; i <=36; i++)
        {
            var randomPosition = this.game.rnd.integerInRange(0,this.startList.length - 1);

            var thisNumber = this.startList[ randomPosition ];

            this.squareList.push(thisNumber);
            var a = this.startList.indexOf(thisNumber);

            this.startList.splice( a, 1 );
        }

        // for debugging
        //var myString2 = this.squareList.toString();

        for (var col = 0; col < 6; col++)
        {
            for (var row = 0; row < 6; row++)
            {
                this.map.putTile(tileBack, col, row);
            }
        }
    },
    
    getHiddenTile: function() {
        
        var thisTile = this.squareList[this.currentTilePosition-1];
        return thisTile;
    },
    
    render: function() {

        this.game.debug.text(this.timesUp, 610, 208, 'rgb(0,255,0)');
        this.game.debug.text(this.youWin, 610, 240, 'rgb(0,255,0)');

        var mySeconds = this.myCountdownSeconds < 0 ? 0 : parseInt(this.myCountdownSeconds);
        this.game.debug.text('Tiempo: ' + mySeconds + ' seg', 610, 20, 'rgb(0,255,0)');

        //game.debug.text('squareCounter: ' + squareCounter, 620, 272, 'rgb(0,0,255)');
        this.game.debug.text('Encontrados: ' + this.masterCounter, 610, 304, 'rgb(0,255,0)');

        //game.debug.text('startList: ' + myString1, 620, 208, 'rgb(255,0,0)');
        //game.debug.text('squareList: ' + myString2, 620, 240, 'rgb(255,0,0)');

        /*
        game.debug.text('Tile: ' + map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)).index, 620, 48, 'rgb(255,0,0)');

        game.debug.text('LayerX: ' + layer.getTileX(marker.x), 620, 80, 'rgb(255,0,0)');
        game.debug.text('LayerY: ' + layer.getTileY(marker.y), 620, 112, 'rgb(255,0,0)');

        game.debug.text('Tile Position: ' + currentTilePosition, 620, 144, 'rgb(255,0,0)');
        game.debug.text('Hidden Tile: ' + getHiddenTile(), 620, 176, 'rgb(255,0,0)');
        */
    }
    
};

//	Add the States your game has.
//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
game.state.add('Boot', BasicGame.Boot);
game.state.add('Preloader', BasicGame.Preloader);
//game.state.add('MainMenu', BasicGame.MainMenu);
game.state.add('Game', BasicGame.MatchingPairs);

//	Now start the Boot state.
game.state.start('Boot');
