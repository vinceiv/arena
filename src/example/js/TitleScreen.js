var TitleScreen = function (game) {};

// Ref to user sprite selection
var spriteSelector = 0;
var playerName;
var input;

/*
* @params UUID from server
* Emits **connected** to server
*/
socket.on('connected', function (data) {
    //socket.emit('requestNewPlayer', spriteSelector);
    console.log("UUID: " + data);
 });

socket.on('confirmedUser' , function() {
  game.state.start('Game');
});


/*
* Preload all assets before jumping into game.
* Add a loading sprite!!!!!!
*/
TitleScreen.prototype = {

  create: function () {
    //implement plugin for game input!
    game.add.plugin(Fabrique.Plugins.InputField);


    var bg = game.add.tileSprite(0 , 0  , window.innerWidth, window.innerHeight, 'tile');


    // Add buttons
    var box1 = game.add.sprite(0 , 0 , 'character_box_1');
    var button = game.add.button(game.world.centerX - box1.width/2, 400, 'knight', this.thor, this);
    button.addChild(box1);

    var box2 = game.add.sprite(0 , 0 , 'character_box_2');
    var button2 = game.add.button(game.world.centerX + box2.width/2 , 400, 'knight' , this.dragon, this);
    button2.addChild(box2);

	  var style = { font: 'bold 60pt Arial', fill: 'black', align: 'center', wordWrap: true, wordWrapWidth: 450 };
    var startGame = game.add.text ( (window.innerWidth / 2 ) - 225  , 0 ," PIXELS & PAPER " , style );

    input = game.add.inputField(game.world.centerX, game.world.centerY - (button.width / 2 ), {
        font: '18px Arial',
        fill: '#212121',
        fontWeight: 'bold',
        width: 300,
        padding: 8,
        borderWidth: 10,
        borderColor: '#000',
        borderRadius: 6,
        placeHolder: 'UserName',
    });
  },


  //     SPRITE GUIDE    //
  /////////////////////////
  /// 1 = thor          ///
  /// 2 = dragon        ///
  ///                   ///
  ////////////////////////
  thor: function () {
    playerName = input.value;

    spriteSelector = 1;
    socket.emit('requestNewPlayer', spriteSelector, playerName);
  },

  dragon: function () {
    playerName = input.value;

    spriteSelector = 2;
    socket.emit('requestNewPlayer', spriteSelector, playerName);
  }

};
