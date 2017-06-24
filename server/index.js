const express = require('express');
const http = require('http')
const socketServer =require('socket.io')
const app = express();
var serve = http.createServer(app);
var io = socketServer(serve);
serve.listen(8000,()=> {console.log("server listening on port 8000")})


class Room {
	constructor(CODE, client) {
		this.code = CODE;
		this.player1 = client;

		this.player1.send({ OP: 'CREATE', CODE });
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
				break;
			}
		}
	})
	
});