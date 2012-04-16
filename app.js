/*
 * Application runner.
 */

 // Module dependencies.
var express = require('express');
var connect = require('connect');
var configFile = require('yaml-config');
var fs = require('fs');

// Load configuration.
config = configFile.readConfig('config/config.yaml');

// Connect to database.
require('./db-connect');

// Create server and do settings.
var app = module.exports = express.createServer();
require('./settings')(app);

// Initialize timers.
require('./init')(app);

// Run server.
app.listen(3000);
console.log(
  "Listening on port 3000 in %s mode",
  app.settings.env
);

// Run sockets.
var io = require('socket.io').listen(app);
require('./sockets')(io);

// Bootstrap models.
var modelsPath = __dirname + '/app/models';
var modelFiles = fs.readdirSync(modelsPath);
modelFiles.forEach(function(file) {
  require(modelsPath + '/' + file);
});

// Bootstrap controllers.
var controllersPath = __dirname + '/app/controllers';
var controllerFiles = fs.readdirSync(controllersPath);
controllerFiles.forEach(function(file) {
  require(controllersPath + '/' + file)(app);
});
