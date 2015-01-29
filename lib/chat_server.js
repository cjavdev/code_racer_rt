module.exports = function (server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('some_other_event_name', function (data) {
      console.log(data);
    });
  });
};
