var Preload = function (game) {};

/*
* Preload all assets before jumping into game.
* Add a loading sprite!!!!!!
* CAN ALL OF THIS JUST BE MOVED TO PRELOAD OF TITLESCREEN
*/
Preload.prototype = {

  preload: function () {

    // THIS WILL ALL BE CHANGED TO SPRITEMAP OR W/E
    game.load.image('dragon' , 'assets/dragon.png');
    game.load.atlas('knight' , 'assets/BlackKnightSprite.png' , 'assets/BlackKnightSprite.json' , Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    game.load.image('tile', 'assets/background.png');

    ///////////////////////////////
    ///  Title screen assets    ///
    //////////////////////////////
    game.load.image('character_box_1' , 'assets/UI_Characterbox_1.png');
    game.load.image('character_box_2' , 'assets/UI_Characterbox_2.png');
    game.load.image('character_box_3' , 'assets/UI_Characterbox_3.png');

    game.load.image('UI_HealthBar' , 'assets/UI_Bar_Health.png');
    game.load.image('UI_ExpBar' , 'assets/UI_Bar_Exp.png')


    game.load.image('rightAttack', 'assets/FireballRight.png', 96 , 54);
    game.load.image('leftAttack', 'assets/FireballLeft.png', 96 , 54);
    //game.load.image('tile', 'assets/tile.jpg');
    game.load.image('gem' , 'assets/gem.png');

    //DO I NEED?
  //  game.load.start();


  },

  create: function () {
    game.state.start('TitleScreen');
  }

};
