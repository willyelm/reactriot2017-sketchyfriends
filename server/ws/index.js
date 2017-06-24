const ws = require('ws');
const service = require('./client');

module.exports = function(server) {
  new ws.Server({server}).on('connection', function(connection) {

    service(connection);

    console.log('Client CONNECTED');

    connection.on('close', function() {
      console.log('Connection HANGUP');
    });

  });

};
