const express = require('express');
const http = require('http')
const socketServer =require('socket.io')
const app = express();
var serve = http.createServer(app);
var io = socketServer(serve);
var PORT = process.env.PORT || 8000
serve.listen(PORT,()=> {console.log("server listening on port " + PORT)})

// TODO: move classes into seperate directories

// class Player {

// 	constructor(room, client, playerNumber) {
// 		this.client = client;
// 		this.client.room = room;
// 		this.room = room;
// 		this.playerNumber = playerNumber;
// 	}
// }

var correctAnswer = 3;
var goodDraw = 1;
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
		this.maxRounds = 5;
		this.round = 0;

		this.player1.send({ OP: 'CREATE', CODE,  SKETCHY: true });
	}

	playerJoined(player) {
		if(this.player2 === null) {
			var SUCCESS = true;
			// this.player2 = new Player(this, player, 2);
			this.player2 = player;
			this.player2.playerNumber = 2;
			this.player2.sketchy = false
			this.player2.points = 0;
			this.player2.room = this;
	
			this.player2.emit('message', { OP: 'JOIN', SUCCESS, SKETCHY: false });
			this.player1.emit('message', { OP: 'PLAYER2_JOINED' });
		} else {
			var SUCCESS = false;
			var REASON = 'Room is full';
			player.emit('message', { OP: 'JOIN', SUCCESS, REASON });
		}
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
		if(this.round === this.maxRounds) {
			clearInterval(this.counter);
			game.endGame(this.player1, this.player2);
		} else {
			this.round++
			this.player1.emit('message', { OP: 'NEW_WORD', WORD });
			this.player2.emit('message', { OP: 'NEW_WORD', WORD });
			this.count = 40;
			this.counter = setInterval(this.timer(player), 1000);
		}
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

		this.player1.emit('message', { OP: 'CHAT', PLAYER_NUM, DATA });
		this.player2.emit('message', { OP: 'CHAT', PLAYER_NUM, DATA });
	}

}

var rooms = {};
var words = [
	"cat",
	"dog",
	"bird",
	"plane",
	"superman",
	"boat",
	"car",
	"stormtrooper",
	"beer",
	"Angry",
	"Fireworks",
	"Pumpkin",
	"Baby",
	"Flower",
	"Rainbow",
	"Beard",
	"Flying saucer",
	"Recycle",
	"Bible",
	"Giraffe",
	"Sand castle",
	"Bikini",
	"Glasses",
	"Snowflake",
	"Book",
	"High heel",
	"Stairs",
	"Bucket",
	"Ice cream",
	"Starfish",
	"Bumble bee",
	"Igloo",
	"Strawberry",
	"Butterfly",
	"Lady bug",
	"Sun",
	"Camera",
	"Lamp",
	"Tire",
	"Lion",
	"Toast",
	"Church",
	"Mailbox",
	"Toothbrush",
	"Crayon",
	"Night",
	"Toothpaste",
	"Dolphin",
	"Nose",
	"Truck",
	"Egg",
	"Olympics",
	"Volleyball",
	"Eiffel Tower",
	"Pirate",
	"Space",
	"WIFI",
	"Hole",
	"Pilgram",
	"Tourist",
	"Hockey",
	"Burrito"
];

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
	

	word += words[Math.floor(Math.random() * words.length)];
	var i = words.indexOf(word);
	words.splice(i, 1);
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
			var SUCCESS = false;
			var REASON = 'Room ' + code + ' does not exist.';
			opponent.send({ OP: 'JOIN', SUCCESS, REASON });
		} else {
			rooms[code].playerJoined(opponent);
		}
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
	},
	endGame(player1, player2) {
		player1.emit('message', { OP: 'GAME_OVER' });
		player2.emit('message', { OP: 'GAME_OVER' });
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
				game.createRoom(socket);
				break;
			}

			case 'JOIN': {
				game.joinRoom(socket, data.code);
				break;
			}

			case 'START_GAME': {
				game.selectWord(socket);
				break;
			}

			case 'PLAYER_SKETCHED': {
				game.playerSketched(socket, data.i);
				break;
			}

			case 'END_ROUND': {
				game.setSketchyPerson(socket);
				break;
			}

			case 'CORRECT_ANSWER': {
				game.givePoints(socket);
			}

			case 'CHAT': {
				game.pushToChat(socket, data.value);
			}
		}
	})
	
});