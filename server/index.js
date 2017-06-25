const express = require('express');
const http = require('http')
const socketServer =require('socket.io')
const app = express();
var serve = http.createServer(app);
var io = socketServer(serve);
serve.listen(8000,()=> {console.log("server listening on port 8000")})

// TODO: move classes into seperate directories

// class Player {

// 	constructor(room, client, playerNumber) {
// 		this.client = client;
// 		this.client.room = room;
// 		this.room = room;
// 		this.playerNumber = playerNumber;
// 	}
// }

var correctAnswer = 5;
var goodDraw = 2;
var TIME;

class Room {
	constructor(CODE, player) {
		this.code = CODE;
		this.player1 = player;
		this.player1.room = this;
		this.player1.playerNumber = 1;
		this.player1.sketchy = true
		this.player2 = null;
		this.player1.points = 0;
		this.timer;

		this.player1.send({ OP: 'CREATE', CODE,  SKETCHY: true });
	}

	playerJoined(player) {
		var success = true;
		// this.player2 = new Player(this, player, 2);
		this.player2 = player;
		this.player2.playerNumber = 2;
		this.player2.sketchy = false
		this.player2.points = 0;
		this.player2.room = this;

		this.player2.emit('message', { OP: 'JOIN', success, SKETCHY: false });
		this.player1.emit('message', { OP: 'PLAYER2_JOINED' });
	}

	timer(player) {
		return function() {
			if(!player.room.pauseTimer) {
    	  		player.room.count=player.room.count-1;
    			TIME = player.room.count;
    		}
    		if (player.room.count <= 0) {
    		  	clearInterval(player.room.counter);
    		  	TIME = null;
    		  	player.room.player1.emit('message', { OP: 'TIMER', TIME });
    			player.room.player2.emit('message', { OP: 'TIMER', TIME });
    		  	return;
    		}
    		player.room.player1.emit('message', { OP: 'TIMER', TIME });
    		player.room.player2.emit('message', { OP: 'TIMER', TIME });
		}
    	
	}

	playerSketched(player, data) {

		switch(player) {
			case this.player1:
				this.player2.emit('message', { OP: 'PLAYER_SKETCHED', data });
				break;
			case this.player2:
				this.player1.emit('message', { OP: 'PLAYER_SKETCHED', data });
				break;
			default:
				break;
		}

	}

	emitNewWord(player, WORD) {
		this.player1.emit('message', { OP: 'NEW_WORD', WORD });
		this.player2.emit('message', { OP: 'NEW_WORD', WORD });
		this.count = 10;
		this.counter = setInterval(this.timer(player), 1000);
	}

	setSketchyPerson(player) {
		this.player1.sketchy = this.player1.sketchy ? false : true;
		this.player2.sketchy = this.player2.sketchy ? false : true;
		this.player1.emit('message', { OP: 'SKETCHY_PLAYER', SKETCHY: this.player1.sketchy });
		this.player2.emit('message', { OP: 'SKETCHY_PLAYER', SKETCHY: this.player2.sketchy });
	}

	givePoints(player) {
		clearInterval(this.counter);

		switch(player) {
			case this.player1:
				this.player1.points += correctAnswer;
				this.player2.points += goodDraw;
				this.player1.emit('message', { OP: 'CORRECT_ANSWER', POINTS: this.player1.points, OPPONENT_POINTS: this.player2.points });
				this.player2.emit('message', { OP: 'GOOD_DRAW', POINTS: this.player2.points, OPPONENT_POINTS: this.player1.points });
				break;
			case this.player2:
				this.player2.points += correctAnswer;
				this.player1.points += goodDraw;
				this.player2.emit('message', { OP: 'CORRECT_ANSWER', POINTS: this.player2.points, OPPONENT_POINTS: this.player1.points });
				this.player1.emit('message', { OP: 'GOOD_DRAW', POINTS: this.player1.points, OPPONENT_POINTS: this.player2.points });
				break;
			default:
				break;
		}
	}

	pushToChat(player, data) {
		var PLAYER_NUM = player.playerNumber;
		var DATA = data;

		console.log(PLAYER_NUM)
		console.log(DATA)
		this.player1.emit('message', { OP: 'CHAT', PLAYER_NUM, DATA });
		this.player2.emit('message', { OP: 'CHAT', PLAYER_NUM, DATA });
	}

}

var rooms = {};

var generateCode = function() {
	var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 5; i++)  {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return code;
}

var selectWord = function() {
	var word = "";
	var words = [
		"cat",
		"dog",
		"bird",
		"plane",
		"superman",
		"boat",
		"car",
		"stormtrooper",
		"beer"
	];

	word += words[Math.floor(Math.random() * words.length)];
	return word;
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
	},
	selectWord: function(player) {
		var word = selectWord();
		player.room.emitNewWord(player, word);
	},
	playerSketched: function(player, data) {
		player.room.playerSketched(player, data);
	},
	setSketchyPerson(player) {
		player.room.setSketchyPerson(player);
		this.selectWord(player);
	},
	givePoints(player) {
		player.room.givePoints(player);
	},
	pushToChat(player, data) {
		player.room.pushToChat(player, data);
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

			case 'START_GAME': {
				console.log('starting game');
				game.selectWord(socket);
				break;
			}

			case 'PLAYER_SKETCHED': {
				console.log('updating canvas');
				game.playerSketched(socket, data.i);
				break;
			}

			case 'END_ROUND': {
				console.log('selecting new word');
				game.setSketchyPerson(socket);
				break;
			}

			case 'CORRECT_ANSWER': {
				console.log('correct answer');
				game.givePoints(socket);
			}

			case 'CHAT': {
				console.log('chat');
				game.pushToChat(socket, data.value);
			}
		}
	})
	
});