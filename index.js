(function () {
  var express = require('express');
  var app = express();
  var path = require('path');

  app.use(express.static(__dirname + '/static'));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
  });

  var server = app.listen(3000, function () {
    console.log('started server');
  });
})();