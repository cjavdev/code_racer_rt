var http = require('http'),
  static = require('node-static'),
  file = new static.Server('./public'),
  rooms = require('./rooms');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

server.listen(process.env.PORT || 8000);
rooms(server);
