var express = require('express');
var packageInfo = require('./package.json');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});

var server = app.listen(process.env.PORT, "0.0.0.0", function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Web server started at http://%s:%s', host, port);
});
