module.exports = function(client) {

  client.on('close', function(reason) {
    console.log('client disconnected', reason);
  });

  client.on('message', function(data) {
    console.log(data)
  });

};
