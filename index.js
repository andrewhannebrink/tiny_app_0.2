(function () {
  var express = require('express');
  var app = express();
  var path = require('path');

  app.use('/m', express.static(__dirname + '/static'));


  app.get('/m', function (req, res) {
    console.log('hit /m in express');
    res.sendFile(path.join(__dirname + '/static/index.html'));
  });

  /*app.get('/', function (req, res) {
    console.log('express redirecting');
    res.redirect('/m');
  });*/

  app.get('*', function (req, res) {
    console.log('express redirecting');
    res.redirect('/m');
  });

  app.listen(8000, function () {
    console.log('started server');
  });
})();
