var http = require('http');

module.exports = function (urlBase, callback) {
  http.get(urlBase + '/api/tracks', function (res) {
    var body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
      callback(JSON.parse(body));
    });
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });
};
