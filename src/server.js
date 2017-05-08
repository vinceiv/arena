var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

//Holds all active users for verification
var users = [];

//Holds all update objects
var updates = [];

function player(uuid)
{
    var that = {};

    that.x = Math.floor(Math.random() * 4600);
    that.y = Math.floor(Math.random() * 2880);
    that.scale = 1.0;
    that.uuid = uuid;
    that.skin = 0;
    that.name = "default";
    that.health = 100;
    that.score = 0;

    return that;
};

app.get('/', function(req, res){
  res.sendFile( __dirname + '/example/index.html');
}).use(express.static(__dirname + '/example/'));

io.sockets.on('connection', function(socket){
  //Log user login
  console.log('A user connected' + socket.id);

  //Send user their UUID
  socket.emit('connected' , socket.id);

  socket.on('requestNewPlayer', function(spriteNum, name) {
    console.log('User: ' + socket.id + ' connected.');

    var p = new player(socket.id);

    console.log(spriteNum);
    p.skin = spriteNum;
    p.name = name;

    io.to(socket.id).emit('confirmedUser');

    //send player object to client
    io.to(socket.id).emit('requestedPlayer', p);
    io.to(socket.id).emit('requestedServerPlayers', users);
    //create player object, push to array
    users.push(p);

    //emits to everyone except this socket
    socket.broadcast.emit('newUser' , p);
  });

   socket.on('disconnect' , function() {

        io.sockets.emit('disconnect' , socket.id);
        console.log('User: ' + socket.id + ' disconnected.');

        for (var i = 0 ; i < users.length ; i++)
        {
            var cUser = users[i];
            if (cUser.uuid == socket.id)
            {
                users.splice(i , 1);
            }
        }
   });

   socket.on('update' , function(update){

     for (i = 0; i < users.length ; i++)
     {
         if (users[i].uuid == socket.id)
         {
             switch (update)
             {
                 case 'moveRight' : users[i].x += 3;
                                    users[i].y -= 3;
                                    updates.push(users[i]);
                                    break;

                 case 'moveLeft'  : users[i].x -= 3;
                                    users[i].y += 3;
                                    updates.push(users[i]);
                                    break;

                 case 'moveUp'    :  users[i].y -= 3;
                                     users[i].x -= 3;
                                    updates.push(users[i]);
                                    break;

                 case 'moveDown'  : users[i].y += 3;
                                    users[i].x += 3;
                                    updates.push(users[i]);
                                    break;
             }
         }
     }
   });
});

/*
* @function sendUpdates to users
*/
setInterval( function() {
       //console.log("set timeout");
       if (updates.length > 1 ) {
            io.sockets.emit('updateEvents' , updates);
            updates = [];
       }
} , 5);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function init()
{};

init();
