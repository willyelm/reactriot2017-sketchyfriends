const express = require('express');
// const bodyParser = require('body-parser');
const http = require('http')
const socketServer =require('socket.io')

const app = express();

// app.use(bodyParser.urlencoded({extended:true}))
// app.use(bodyParser.json())


var serve = http.createServer(app);
var io = socketServer(serve);
serve.listen(8000,()=> {console.log("server listening on port 8000")})


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
	
});