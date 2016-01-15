(function () {
  var express = require('express');
  var app = express();
  var path = require('path');

  app.use(express.static(__dirname + '/static'));

  app.get('/m', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
  });

  app.listen(8000, function () {
    console.log('started server');
  });
})();
