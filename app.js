
/**
 * Application runner.
 */

// Module dependencies.
var express = require('express');
var socket = require('socket.io');
var config = require('yaml-config');
var http = require('http');
var fs = require('fs');

// Read config, connect to database.
var configPath = '/config/config.yaml';
global.config = config.readConfig(process.cwd()+configPath);
require('./config/db-connect');

// Create server.
var app = module.exports.app = express(express.favicon());
require('./settings')(app);

// Bootstrap models.
var modelsPath = __dirname + '/app/models';
var modelFiles = fs.readdirSync(modelsPath);
modelFiles.forEach(function(file) {
  require(modelsPath + '/' + file);
});

// Run server and socket.io.
var server = app.listen(global.config.port);
var io = socket.listen(server, { log: false });

// Start poems.
require('./config/init')(app, io);

// Bootstrap controllers.
var controllersPath = __dirname + '/app/controllers';
var controllerFiles = fs.readdirSync(controllersPath);
controllerFiles.forEach(function(file) {
  require(controllersPath + '/' + file)(app, io);
});

console.log("Listening on port %d in %s mode",
  global.config.port, app.settings.env);
