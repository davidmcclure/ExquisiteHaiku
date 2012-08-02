/*
 * Application runner.
 */

 // Module dependencies.
var express = require('express');
var configFile = require('yaml-config');
var http = require('http');
var fs = require('fs');

// Connect to database.
var config = configFile.readConfig('config/config.yaml');
require('./db-connect')(config);

// Create server.
var app = module.exports = express(express.favicon());
var server = http.createServer(app);

// Boot settings.
require('./settings')(app);
require('./init')(app, config);

// Run server.
app.listen(3000);
console.log(
  "Listening on port 3000 in %s mode",
  app.settings.env
);

// Bootstrap models.
var modelsPath = __dirname + '/app/models';
var modelFiles = fs.readdirSync(modelsPath);
modelFiles.forEach(function(file) {
  require(modelsPath + '/' + file);
});

// Run Socket.io.
var io = require('socket.io').listen(server);

// Bootstrap controllers.
var controllersPath = __dirname + '/app/controllers';
var controllerFiles = fs.readdirSync(controllersPath);
controllerFiles.forEach(function(file) {
  require(controllersPath + '/' + file)(app, io);
});
