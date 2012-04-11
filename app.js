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

// Bootstrap models.
var modelsPath = __dirname + '/app/models';
var modelFiles = fs.readdirSync(modelsPath);
modelFiles.forEach(function(file) {
  require(modelsPath + '/' + file);
});

// Create server and do settings.
var app = module.exports = express.createServer();
require('./settings').boot(app);

// Initialize timers.
require('./init').boot(app);

// Bootstrap controllers.
var controllersPath = __dirname + '/app/controllers';
var controllerFiles = fs.readdirSync(controllersPath);
controllerFiles.forEach(function(file) {
  require(controllersPath + '/' + file)(app);
});

// Run.
app.listen(3000);
console.log(
  "Listening on port %d in %s mode",
  app.address().port,
  app.settings.env
);
