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
var config = configFile.readConfig('config.yaml');
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
var server = app.listen(config.port);
var io = socket.listen(server, { log: false });

// Start poems.
require('./init')(app, config, io, function() {});

// Bootstrap controllers.
var controllersPath = __dirname + '/app/controllers';
var controllerFiles = fs.readdirSync(controllersPath);
controllerFiles.forEach(function(file) {
  require(controllersPath + '/' + file)(app, io);
});

console.log("Listening on port %d in %s mode",
  config.port, app.settings.env);
