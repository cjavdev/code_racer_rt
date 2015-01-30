var _ = require('lodash');

module.exports = function (server) {
  var io = require('socket.io')(server);
  var users = {};
  var races = {};

  function userFor(socket) {
    return users[socket.id];
  }

  function login(socket, data) {
    users[socket.id] = data;
    console.log("users: ", users);
  }

  function logout(socket) {
    delete users[socket.id];
    console.log("users: ", users);
  }

  io.on('connection', function (socket) {
    socket.on('register', function (data) {
      login(socket, data);
      console.log("Registered ", data.nickname);
    });

    socket.on('disconnect', function () {
      console.log('Disconnected');
      logout(socket);
    });

    socket.on('add_car', function (data) {
      console.log('Adding car: ', data);
      if(!races[data.race_id]) {
        races[data.race_id] = [];
      }
      races[data.race_id].push(data);
      io.sockets.emit('race_' + data.race_id + '_update', races[data.race_id]);
    });
  });
};
