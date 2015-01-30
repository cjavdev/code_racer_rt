var _ = require('lodash');
var fetchTracks = require('./rails_api');
var tracks;
fetchTracks('http://localhost:3000', function (resp) {
  tracks = resp;
});

function randomTrack() {
  return _.sample(tracks);
}

module.exports = function (server) {
  var io = require('socket.io')(server);
  var users = {};
  var races = {};
  var stages = {};

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
      io.sockets.emit('online_users', _.values(users));
    });

    socket.on('disconnect', function () {
      console.log('Disconnected');
      logout(socket);
      io.sockets.emit('online_users', _.values(users));
    });

    socket.on('invite', function (data) {
      io.sockets.emit('invite', data);
    });

    socket.on('join_stage', function (stage) {
      var token = stage.token;
      if(!stages[token]) {
        stages[token] = [];
      }
      if(stages[token].map(function (s) { return s.id }).indexOf(stage.id) == -1) {
        stages[token].push(stage);
      }
      io.sockets.emit('update_stage_' + token, stages[token]);

      socket.on('start_race_' + stage.token, function (data) {
        var track = randomTrack();
        io.sockets.emit('start_race_' + stage.token, {
          track_id: track.id
        });
      });
    });

    socket.on('add_car', function (data) {
      var updateSpeed = 'update_' + data.race_id + '_speed';
      socket.on(updateSpeed, function (data) {
        io.sockets.emit(updateSpeed, data);
      });

      if(!races[data.race_id]) {
        races[data.race_id] = [];
      }
      races[data.race_id].push(data);
      io.sockets.emit('race_' + data.race_id + '_update', races[data.race_id]);
    });
  });
};
