const express = require('express');
const http = require('http')
const socketServer =require('socket.io')
const app = express();
var serve = http.createServer(app);
var io = socketServer(serve);
serve.listen(8000,()=> {console.log("server listening on port 8000")})

class Player {

	constructor(room, client, playerNumber) {
		this.client = client;
		this.client.room = room;
		this.room = room;
		this.playerNumber = playerNumber;
	}
}

class Room {
	constructor(CODE, client) {
		this.code = CODE;
		this.player1 = client;
		console.log(this.player1)
		this.player2 = null;

		this.player1.send({ OP: 'CREATE', CODE });
	}

	playerJoined(client) {
		var success = true;
		// this.player2 = new Player(this, client, 2);
		this.player2 = client;
		this.player2.number = 2;
		this.player2.room = this;
		this.player2.emit('message', { OP: 'JOIN', success });
		this.player1.emit('message', { OP: 'PLAYER2_JOINED' });
	}
}

var rooms = {};

var generateCode = function() {
	var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )  {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return code;
}

var game = {
	rooms,
	createRoom: function(host) {
		var code = generateCode();
		rooms[code] = new Room(code, host);
	},
	joinRoom: function(opponent, code) {
		if(!rooms.hasOwnProperty(code)) {
			var success = false;
			var reason = 'Room ' + code + ' does not exist.';
			opponent.send({ OP: 'JOIN', success, reason });
		}
		rooms[code].playerJoined(opponent);
	}
}


/***************************************************************************************** */
/* Socket logic starts here																   */
/***************************************************************************************** */
const connections = [];
io.on('connection', function (socket) {

	console.log("Connected to Socket!!"+ socket.id)

	connections.push(socket)

	socket.on('disconnect', function(){
		console.log('Disconnected - '+ socket.id);
	});

	socket.on('message', function(data) {
		console.log(data)

		switch(data.OP) {

			case 'CREATE': {
				console.log('create game');
				game.createRoom(socket);
				break;
			}

			case 'JOIN': {
				console.log('joining game');
				game.joinRoom(socket, data.code);
				break;
			}
		}
	})
	
});