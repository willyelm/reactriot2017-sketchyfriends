var http = require('http');
var app = require('./app');
var initializeSocket = require('./ws');
var server = http.createServer(app);
var PORT = process.env.PORT || 5000;

initializeSocket(server);

server.listen(PORT, function() {
  console.log('Server listening on port: ' + PORT);
});
