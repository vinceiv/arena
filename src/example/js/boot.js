

//var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, ' ');
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, ' ');
var Boot = function (game) {};
var socket = io();


/*
var game=new Phaser.Game(	640, 480, Phaser.AUTO, 'gameContainer');
var state = function(game) {  };
state.prototype = {	preload:function() {},	create:function() {},	update:function() {}}
game.state.add('state', state);
game.state.start('state');
*/


Boot.prototype = {

  preload: function () {
     game.load.script('Preload', 'js/Preload.js');
     game.load.script('TitleScreen', 'js/TitleScreen.js');
     game.load.script('Game', 'js/Game.js');
     //game.load.script('GameOver', 'js/GameOver.js');

  },

  create: function () {
    game.state.add('Preload', Preload)
    game.state.add('TitleScreen', TitleScreen);
    game.state.add('Game', Game);
    //game.state.add('GameOver', GameOver);


    game.state.start('Preload');
  }

}

game.state.add('Boot', Boot);
game.state.start('Boot');
