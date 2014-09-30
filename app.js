
/**
 * Construct the application instance.
 */

var express = require('express');
var config = require('yaml-config');
var socket = require('socket.io');

var app = express();

// Apply the configuration.
global.config = config.readConfig(
  process.cwd()+'/config/config.yaml'
);

// Connect to Mongo.
require('./config/mongo');

// Configure Express.
require('./config/express')(app);

// Bootstrap models.
require('./app/models');

// Start Express.
var server = app.listen(app.get('port'), function() {
  console.log(
    'Listening on port %d in %s mode.',
    app.get('port'),
    app.get('env')
  );
});

// Start socket.io.
var io = socket.listen(server, { log: false });

// Attach the routes.
require('./app/controllers')(app, io);

// Start poems.
require('./config/restart')(app, io);
