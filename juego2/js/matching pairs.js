// mods by Patrick OReilly 
// twitter: @pato_reilly
// modificado por Luis J.

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-game', { init: init, preload: preload, create: create, update: update, render: render });

function init() {

    // Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    this.input.maxPointers = 1;

    // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    this.stage.disableVisibilityChange = false;

    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.scale.pageAlignHorizontally = true;

}

function preload() {
    
                    this.load.image('startButton', 'assets/start-button.png');
                    this.load.image('scoreboard', 'assets/scoreboard.png');
                    this.load.spritesheet('medals', 'assets/medals.png',44, 46, 2); 
                    this.load.spritesheet('medallas', 'assets/medallas.png',141, 47, 3); 
                    this.load.image('gameover', 'assets/gameover.png');
                    this.load.image('particle', 'assets/particle.png');                    
                    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');    

    game.load.tilemap('matching', 'assets/tilemaps/maps/phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/phaser_tiles.png');//, 100, 100, -1, 1, 1);    
}

var timeCheck = 0;
var flipFlag = false;

var startList = new Array();
var squareList = new Array();

var masterCounter = 0;
var squareCounter = 0;
var square1Num;
var square2Num;
var savedSquareX1;
var savedSquareY1;
var savedSquareX2;
var savedSquareY2;

var map;
var tileset;
var layer;

var marker;
var currentTile;
var currentTilePosition;

var tileBack = 25;
var timesUp = '+';
var youWin = '+';

var myCountdownSeconds;


function create() {

        map = game.add.tilemap('matching');

        map.addTilesetImage('Desert', 'tiles');

        //tileset = game.add.tileset('tiles');
    
        layer = map.createLayer('Ground');//.tilemapLayer(0, 0, 600, 600, tileset, map, 0);

        //layer.resizeWorld();

        marker = game.add.graphics();
        marker.lineStyle(2, 0x00FF00, 1);
        marker.drawRect(0, 0, 100, 100);
    
    randomizeTiles();

}

function update() {
    
    countDownTimer();
    
    if (layer.getTileX(game.input.activePointer.worldX) <= 5) // to prevent the marker from going out of bounds
    {
        marker.x = layer.getTileX(game.input.activePointer.worldX) * 100;
        marker.y = layer.getTileY(game.input.activePointer.worldY) * 100;
    }

    if (flipFlag == true) 
    {
        if (game.time.totalElapsedSeconds() - timeCheck > 0.5)
        {
            flipBack();
        }
    }
    else
    {
        processClick();
    }
}
   
   
function countDownTimer() {
  
    var timeLimit = 400;
  
    mySeconds = game.time.totalElapsedSeconds();
    myCountdownSeconds = timeLimit - mySeconds;
    
    if (myCountdownSeconds <= 0) 
    {
        // time is up
        timesUp = 'Tiempo finalizado!';
        youWin = 'F5 para refrescar';
    }
}

function processClick() {
    if (myCountdownSeconds <= 0) return;
   
    currentTile = map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y));
    currentTilePosition = ((layer.getTileY(game.input.activePointer.worldY)+1)*6)-(6-(layer.getTileX(game.input.activePointer.worldX)+1));
        
    if (game.input.mousePointer.isDown)
        {
        // check to make sure the tile is not already flipped
        if (currentTile.index == tileBack)
        {
            // get the corresponding item out of squareList
                currentNum = squareList[currentTilePosition-1];
            flipOver();
                squareCounter++;
            // is the second tile of pair flipped?
            if  (squareCounter == 2) 
            {
                // reset squareCounter
                squareCounter = 0;
                square2Num = currentNum;
                // check for match
                if (square1Num == square2Num)
                {
                    masterCounter++;      
                    
                    if (masterCounter == 18) 
                    {
                        // go "win"
                        youWin = 'Ganaste!';     
                        
                        this.scoreboard = new Scoreboard(game);
                        game.add.existing(this.scoreboard);
                        this.scoreboard.show(myCountdownSeconds);                         
                    }                       
                }
                else
                {
                    savedSquareX2 = layer.getTileX(marker.x);
                    savedSquareY2 = layer.getTileY(marker.y);
                        flipFlag = true;
                        timeCheck = game.time.totalElapsedSeconds();
                }   
            }   
            else
            {
                savedSquareX1 = layer.getTileX(marker.x);
                savedSquareY1 = layer.getTileY(marker.y);
                    square1Num = currentNum;
            }           
        }           
    }    
}
 
function flipOver() {
 
    map.putTile(currentNum, layer.getTileX(marker.x), layer.getTileY(marker.y));
}
 
function flipBack() {
        
    flipFlag = false;
    
    map.putTile(tileBack, savedSquareX1, savedSquareY1);
    map.putTile(tileBack, savedSquareX2, savedSquareY2);
 
}
 
function randomizeTiles() {

    for (num = 1; num <= 18; num++)
    {
        startList.push(num);
    }
    for (num = 1; num <= 18; num++)
    {
        startList.push(num);
    }

    // for debugging
    myString1 = startList.toString();
  
    // randomize squareList
    for (i = 1; i <=36; i++)
    {
        var randomPosition = game.rnd.integerInRange(0,startList.length - 1);

        var thisNumber = startList[ randomPosition ];

        squareList.push(thisNumber);
        var a = startList.indexOf(thisNumber);

        startList.splice( a, 1);
    }
    
    // for debugging
    myString2 = squareList.toString();
  
    for (col = 0; col < 6; col++)
    {
        for (row = 0; row < 6; row++)
        {
            map.putTile(tileBack, col, row);
        }
    }
}

function getHiddenTile() {
        
    thisTile = squareList[currentTilePosition-1];
    return thisTile;
}

function render() {

    game.debug.text(timesUp, 610, 208, 'rgb(0,255,0)');
    game.debug.text(youWin, 610, 240, 'rgb(0,255,0)');

    var mySeconds = myCountdownSeconds < 0 ? 0 : parseInt(myCountdownSeconds);
    game.debug.text('Tiempo: ' + mySeconds + ' seg', 610, 20, 'rgb(0,255,0)');

    //game.debug.text('squareCounter: ' + squareCounter, 620, 272, 'rgb(0,0,255)');
    game.debug.text('Encontrados: ' + masterCounter, 610, 304, 'rgb(0,255,0)');

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

var Scoreboard = function(game) {
  
  var gameover;
  
  Phaser.Group.call(this, game);
  gameover = this.create(this.game.width / 2, 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);

  this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
  this.scoreboard.anchor.setTo(0.5, 0.5);
  
  this.scoreText = this.game.add.bitmapText(this.scoreboard.width+100, 180, 'flappyfont', '', 18);
  //this.add(this.scoreText);
  
  this.bestText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
  //this.add(this.bestText);

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

//  if(score >= 3 && score < 20)
//  {
//    coin = this.game.add.sprite(-65 , 7, 'medals', 1);
//  } else if(score >= 20) {
//    coin = this.game.add.sprite(-65 , 7, 'medals', 0);
//  }
  
  if(score >= 200){
      coin = this.game.add.sprite(-65 , 7, 'medallas', 2);
  }
  else if(score >= 100){
      coin = this.game.add.sprite(-65 , 7, 'medallas', 1);
  }
  else{
      coin = this.game.add.sprite(-65 , 7, 'medallas', 0);
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
    game.world.removeAll();
    game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-game', { init: init, preload: preload, create: create, update: update, render: render });
};

Scoreboard.prototype.update = function() {
  // write your prefab's specific update code here
};