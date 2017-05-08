var Game = function (game) {};


//Whatever you touch here touch
// socket.on('requestedPlayer')
// server function player
//game player = function
var Player = (function () {
function Player(x, y, uuid, scale, spritetype) {
    this.x = x;
    this.y = y;
    this.uuid = uuid;
    this.scale = scale;
    this.skin = 0;
    this.name = "defaultClient";
    this.health = 0;
}
return Player;
}());

var text; //Player coordinates DEBUG
var coordString;

//Player object
var mPlayer = {};

//Arrays for players and sprites
var players = [];
var playerSprites = [];

//Array for item collection
var collectables = [];
var collectableUpdates = [];

var collectablesInit = false;
var playerInitLocation = false;

var rightAttack , leftAttack;
var isAttackingRight = false;
var isAttackingLeft = false;

var gameWidth = 800;
var gameHeight = 600;



/////////////////////////////////////////
//               SOCKET.IO            //
////////////////////////////////////////
/*
* @params player object from server
* Get intial player obejct
*/
//Whatever you touch here touch
// socket.on('requestedPlayer')
// server function player
//game player = function
socket.on('requestedPlayer', function (data) {
  mPlayer.x = data.x;
  mPlayer.y = data.y;
  mPlayer.scale = data.scale;
  mPlayer.uuid = data.uuid;
  mPlayer.skin = data.skin;
  mPlayer.name = data.name;
  mPlayer.health = data.health;

  console.log("Should have received my player data");
  console.log(mPlayer.x);
  console.log(mPlayer.y);
  console.log(mPlayer.scale);
  console.log(mPlayer.name);
});

/*
* @params Get array of current players on server
*/
socket.on('requestedServerPlayers' , function(v){
   //Assign array value from server
   players = v;

   console.log('Players in the server: ');
      for (var i = 0 ; i < players.length ; i++)
      {
       console.log(players[i].uuid);
      }
});

/*
* Receive initial collectables
*/
socket.on('requestedCollectables' , function(data) {
  collectables = data;
});

/*
* @params player object from server
* new player joins add user to array add spriteRef
*/
socket.on('newUser' , function(join) {

  players.push(join);

  var i = playerSprites.length;

  if (players[i].skin == 1)
  {
    var newPlayer = game.add.sprite(players[i].x, players[i].y, 'knight');
    newPlayer.animations.add('idle', Phaser.Animation.generateFrameNames('RightIdle', 1, 4), 2, true);
    newPlayer.animations.play('idle');
  }
  if (players[i].skin == 2)
  {
    var newPlayer = game.add.sprite(players[i].x, players[i].y, 'knight' , 'RightIdle1.png');
    newPlayer.animations.add('idle', Phaser.Animation.generateFrameNames('RightIdle', 1, 4), 2, true);
    newPlayer.animations.play('idle');

  }

  playerSprites.push(newPlayer);
  playerSprites[i].anchor.setTo(0.5);

  players[players.length - 1].spriteRef = i;
  console.log('Player Joined, UUID: ' + join.uuid);

    //this.obstacleGroup.add(newPlayer);
});

/*
* @params updatesArray from server
* Get all update events (locations/ probably change for more events
* velocity attacking) ?
*/
socket.on('updateEvents' , function(updates) {
  //console.log('updates');
       for (var i = 0 ; i < updates.length ; i++)
       {
             //Get User's position from server and checks against self
             if (updates[i].uuid == mPlayer.uuid)
             {
                 mPlayer.x =  updates[i].x;
                 mPlayer.y =  updates[i].y;
                 mPlayer.scale =  updates[i].scale;
             }
             // If not self update players array
             else {
                   for (v = 0 ; v < players.length ; v++ )
                   {
                       if (updates[i].uuid == players[v].uuid)
                       {
                              players[v].x = updates[i].x;
                              players[v].y = updates[i].y;
                              players[v].scale = updates[i].scale;
                        }
                    }
             }
       }

       //wipe updates
       updates = [];
});

//kill player
socket.on('playerKilled', function(data) {
//on death kill and wipe all data
//send to gamveover
});

/*
* @params socketId
* Handle players disconnect
*/
socket.on('disconnect', function(socketId){

    for (i = 0 ; i < players.length ; i++)
    {
        //Check socketId with array of socketIds
        if (players[i].uuid == socketId)
        {
            //Get ref to sprite and kill it from array
            playerSprites[players[i].spriteRef].body = null;
            playerSprites[players[i].spriteRef].destroy();

            playerSprites.splice(players[i].spriteRef , 1);
            players.splice(i ,1);
        }
    }

});

/*
* Get updates of collectable items
*/
socket.on('collectableUpdates' , function(inCollectableUpdate) {

  collectableUpdates = inCollectableUpdate;

});

/*
* Game goodies
*/
Game.prototype = {

  preload: function () {



            //this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));
            game.physics.startSystem(Phaser.Physics.ARCADE);
            //this.game.anchor.setTo(0.5);



            //this.game.scale.refresh();
            game.scale.minWidth = 240;
            game.scale.minHeight = 170;
            game.scale.maxWidth = 7000;
            game.scale.maxHeight = 4000;
            game.world.setBounds(0, 0, 20000, 20000);

            game.time.advancedTiming = true;
            //game.time.desiredFps = 60;

            game.renderer.renderSession.roundPixels = true;


            /*
            while (collectables.length == 0)
            {
              this.sleep(3000);
            }
            */
            //setInterval(function() {  if (collectables.length == 0) { console.log('waiting'); } }, 3000);

            /*
            do{
              console.log("Waiting...");
            }while (players.length == 0);
            */

            console.log("spriteSelector: " + spriteSelector);
  },











  create: function () {


    game.stage.backgroundColor = "0xde6712";


    cursors = game.input.keyboard.createCursorKeys();

    var tileSprites = game.add.tileSprite(100 , 100  , 19500, 19500, 'tile');

    //////////////////////////
    ///        GUI         ///
    //////////////////////////
    var healthbar = game.add.sprite(20 , 20 , 'UI_HealthBar');
    var expbar = game.add.sprite(20 , healthbar.height * 2 , 'UI_ExpBar' );
    healthbar.fixedToCamera = true;
    expbar.fixedToCamera = true;

    var style = { font: 'bold 15pt Arial', fill: 'black', align: 'center'};
    var startGame = game.add.text ( 0 , (window.innerHeight / 2) ,"Leaderboard" , style );
    startGame.fixedToCamera = true;
    startGame.cameraOffset.x = 100;




    obstacleGroup = game.add.group();
    playerGroup = game.add.group();

    //FOLLOW LEGEND FOR SPRITE NUMBERS IN TitleScreen
    if (spriteSelector == 1){
      //charSprite = game.add.sprite(0, 0, 'dragon' , playerGroup);
      charSprite = game.add.sprite(0, 0, 'knight' , 'RightIdle1');
      charSprite.animations.add('right_idle', Phaser.Animation.generateFrameNames('RightIdle', 1, 4), 20, true);
      charSprite.animations.add('left_idle', Phaser.Animation.generateFrameNames('LeftIdle', 1, 4), 20, true);
      charSprite.animations.add('right_walk', Phaser.Animation.generateFrameNames('RightWalk', 1, 4), 20, true);
      charSprite.animations.add('left_walk', Phaser.Animation.generateFrameNames('LeftWalk', 1, 4), 20, true);


      charSprite.animations.play('right_idle');
    }
    if (spriteSelector == 2){
      //charSprite = game.add.sprite(0, 0, 'dragon' , playerGroup);
      charSprite = game.add.sprite(0, 0, 'knight' , 'RightIdle1');
      charSprite.animations.add('right_idle', Phaser.Animation.generateFrameNames('RightIdle', 1, 4), 20, true);
      charSprite.animations.add('left_idle', Phaser.Animation.generateFrameNames('LeftIdle', 1, 4), 20, true);
      charSprite.animations.add('right_walk', Phaser.Animation.generateFrameNames('RightWalk', 1, 4), 20, true);
      charSprite.animations.add('left_walk', Phaser.Animation.generateFrameNames('LeftWalk', 1, 4), 20, true);


      charSprite.animations.play('right_idle');


    }
    charSprite.anchor.setTo( 0.5 );
    game.physics.enable(charSprite, Phaser.Physics.ARCADE);
    charSprite.enableBody = true;
    charSprite.body.moves = false;
    charSprite.body.collideWorldBounds = true;


    //to ensure that socket game has received initial players from server check if array is empty
    //if so give em life!
    if (playerSprites.length == 0 )
    {
          this.createLivePlayers();
    }

    //init collectables to ensure they do not draw before loaded
    //change after game state is impl
    if (collectablesInit == false)
    {
      collectablesInit = true;

      temp = collectables;
      collectables = [];

      for (var i = 0 ; i < temp.length ; i++)
      {
          var collectable = game.add.sprite(temp[i].x , temp[i].y, 'gem', obstacleGroup);
          collectable.anchor.setTo(0.5);
          game.physics.enable(collectable, Phaser.Physics.ARCADE);
          collectable.body.moves = false;
          collectables.push(collectable);

          obstacleGroup.add(collectables[i]);
      }

    }

    if (playerInitLocation == false)
    {
      charSprite.position.setTo(mPlayer.x , mPlayer.y , 0);

      playerInitLocation = true;
    }

  this.createAttackButtons();



  coordString = "( " + mPlayer.x + " , " + mPlayer.y + ")";

  text = game.add.text(0, 20, coordString, {
    font: "14px Arial",
    fill: "#00ff00",
    align: "center"
  });

  GUI_PlayerHealth = game.add.text(window.innerWidth / 2, window.innerHeight / 2, mPlayer.health, {
    font: "15px Arial",
    fill: "#ffffff",
    align: "center"
  });


  text.fixedToCamera = true;
  game.camera.follow(charSprite, Phaser.Camera.FOLLOW_LOCKON);

  },










  update: function () {

    //game.world.bringToTop(obstacleGroup);

    if (game.physics.arcade.collide(charSprite, obstacleGroup, this.collisionHandler, null, this.game))
    {
    console.log('boom');
    }




    //collision with mPlayer hitboxes and
    /*
    if (game.physics.arcade.collide(charSprite, obstacleGroup, this.collisionHandler, null, this.game))
    {
    console.log('boom');
    }
    */


    //game.scale.setGameSize((gameWidth + (mPlayer.scale * 500)) , (gameHeight + (mPlayer.scale * 500)));

    /*
    *   INPUT DETECTION
    */
    game.input.update();

    if (cursors.down.isDown) {
        this.down();
        charSprite.y += 3;
        charSprite.x += 3;
    }
    if (cursors.up.isDown) {
        this.up();
        charSprite.y -= 3;
        charSprite.x -= 3;
    }
    if (cursors.left.isDown) {
        this.left();
        charSprite.x -= 3;
        charSprite.y += 3;
        charSprite.animations.play('left_walk');
    }
    if (cursors.right.isDown) {
        this.right();
        charSprite.x += 3;
        charSprite.y -= 3;
        charSprite.animations.play('right_walk');
    }

    if (isAttackingRight)
    {
      rightAttack.exists = false;
    }
    if (isAttackingLeft)
    {
      leftAttack.exists = false;
    }
    if (attackbutton.isDown && cursors.right.isDown)
    {
      console.log('ATTACK FUCKER!!!');
      rightAttack.exists = true;
      isAttackingRight = true;
    }
    if (attackbutton.isDown && cursors.left.isDown)
    {
      console.log('ATTACK FUCKER!!!');
      leftAttack.exists = true;
      isAttackingLeft = true;
    }

    /*

    if hitbox.exists
    {
     if (game.physics.arcade.collide(charSprite, hitboxes, this.collisionHandler, null, this.game))
        {
               console.log('boom');
        }
    }

    */


    //Handle directional idling after movement is complete.
    if ((cursors.right.isDown != true && cursors.left.isDown != true) && charSprite.animations.currentAnim.name == 'left_walk'){
      charSprite.animations.play('left_idle');
    }

    if ((cursors.right.isDown != true && cursors.left.isDown != true) && charSprite.animations.currentAnim.name == 'right_walk'){
      charSprite.animations.play('right_idle');
    }

    if (cursors.down.isDown == true  && charSprite.animations.currentAnim.name == 'left_idle'){
      charSprite.animations.play('left_walk');
    }

    if (cursors.down.isDown == true  && charSprite.animations.currentAnim.name == 'right_idle'){
      charSprite.animations.play('right_walk');
    }





    if (playerSprites.length > 0)
    {

         //Possibly throttle data by only working with changes from previous states
         for (var p = 0 ; p < players.length ; p++)
         {
             /* Do i need to check for undefined?
              if (typeof playerSprites[p] != 'undefined'){
              playerSprites[p].isoPosition.setTo(players[p].x , players[p].y, 0);
              }
              */
               playerSprites[players[p].spriteRef].position.setTo(players[p].x, players[p].y, 0);
               playerSprites[players[p].spriteRef].scale.setTo(players[p].scale, players[p].scale);

         }
    }

    charSprite.scale.setTo(mPlayer.scale, mPlayer.scale);

    text.setText("( " + mPlayer.x + " , " + mPlayer.y + ")" );
    GUI_PlayerHealth.x = charSprite.x - (charSprite.width / 2);
    GUI_PlayerHealth.y = charSprite.y + 16;;

  },

  render: function () {

    game.debug.text('render FPS: ' + (game.time.fps || '--') , 2, 14, "#00ff00");
    //game.debug.body(charSprite);

     //this.obstacleGroup.forEach(function (tile) {
     //  game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
   //  });

   //debug attack boxes
   /*
   if (leftAttack.exists = true)
   {
     game.debug.body(leftAttack);
   }
   if (rightAttack.exists = true)
   {
     game.debug.body(rightAttack);
   }
  */

  },




  collisionHandler: function (colChar, colCollectable)
  {
    var collectableCollisionEvent = {playerX: colChar.x, playerY: colChar.y,
                         uuid: mPlayer.uuid,
                         collectableX: colCollectable.x, collectableY: colCollectable.y}

    console.log(colCollectable.x + " " + colCollectable.y);
    socket.emit('collectableCollision' , collectableCollisionEvent);
    colCollectable.destroy();
  },





  // ADD TO OBSTACLE GROUP
  // MAKE OBSTACLE GROUP FOR JUST PLAYERS
  createLivePlayers: function()
  {
      if (players.length != 0)
      {
           for (i = 0 ; i < players.length ; i++)
          {

            if (players[i].skin == 1)
            {
              var newPlayer = game.add.sprite(players[i].x, players[i].y, 'knight');
              newPlayer.animations.add('idle', Phaser.Animation.generateFrameNames('RightIdle', 1, 4), 2, true);
              newPlayer.animations.play('idle');

            }
            if (players[i].skin == 2)
            {
              var newPlayer = game.add.sprite(players[i].x, players[i].y, 'knight');
              newPlayer.animations.add('idle', Phaser.Animation.generateFrameNames('RightIdle', 1, 4), 2, true);
              newPlayer.animations.play('idle');
            }

            tempChar.anchor.setTo(0.5);

            playerSprites[i] = tempChar;

            //Assign the sprite ref to keep track of index in SpriteRef []
            players[i].spriteRef = i;

          }
      }
  },

  createAttackButtons: function () {

    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    charSprite.addChild(hitboxes);

    rightAttack = hitboxes.create(0,0,'rightAttack' , 0, false);
    rightAttack.body.setSize(50, 50, charSprite.width, charSprite.height / 2);
    rightAttack.name = "rightAttack";

    leftAttack = hitboxes.create(0,0,'leftAttack' , 0, false);
    leftAttack.body.setSize(50, 50, charSprite.width, charSprite.height / 2);
    leftAttack.name = "leftAttack";

    attackbutton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  },

  /////////////////////////////////
  ///                           ///
  ///                           ///
  ///          MOVEMENT         ///
  ///                           ///
  ///                           ///
  /////////////////////////////////

  left: function () {
      socket.emit('update' , 'moveLeft');
  },

  right: function () {
      socket.emit('update' , 'moveRight');
  },

  up: function () {
      socket.emit('update' , 'moveUp');
  },

  down: function () {
      socket.emit('update' , 'moveDown');
  },
};
