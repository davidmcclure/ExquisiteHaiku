/*
 * Application runner.
 */

 // Module dependencies.
var express = require('express');
var socket = require('socket.io');
var configFile = require('yaml-config');
var http = require('http');
var fs = require('fs');

// Connect to database.
var config = configFile.readConfig('config/config.yaml');
require('./db-connect')(config);

// Create server.
var app = module.exports.app = express(express.favicon());
require('./settings')(app, config);

// Bootstrap models.
var modelsPath = __dirname + '/app/models';
var modelFiles = fs.readdirSync(modelsPath);
modelFiles.forEach(function(file) {
  require(modelsPath + '/' + file);
});

// Run server and socket.io.
var server = app.listen(3000);
var io = module.exports.io = socket.listen(server);

// Start poems.
require('./init')(app, config, io, function() {});

// Bootstrap controllers.
var controllersPath = __dirname + '/app/controllers';
var controllerFiles = fs.readdirSync(controllersPath);
controllerFiles.forEach(function(file) {
  require(controllersPath + '/' + file)(app, io);
});

console.log("Listening on port 3000 in %s mode",
  app.settings.env);
