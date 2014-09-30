
/**
 * Application runner.
 */

var express = require('express');
var socket = require('socket.io');
var config = require('yaml-config');


// Read config, connect to database.
var configPath = '/config/config.yaml';
global.config = config.readConfig(process.cwd()+configPath);
require('./config/db-connect');

// Create server.
var app = express(express.favicon());
require('./settings')(app);

// Run server and socket.io.
var server = app.listen(global.config.port);
var io = socket.listen(server, { log: false });

// Start the application.
require('./app/models');
require('./app/controllers')(app, io)
require('./config/init')(app, io);

console.log(
  'Listening on port %d in %s mode',
  global.config.port,
  app.settings.env
);

module.exports = app;
