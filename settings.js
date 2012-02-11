/*
 * Define application settings and middleware.
 */

 // Module dependencies and import hook.
var express = require('express'),
  mongoStore = require('connect-mongodb');

// Boot hook.
exports.boot = function(app) {
  bootApplication(app);
};

// Start-up routine.
function bootApplication(app) {

  // Configure express.
  app.configure(function() {

    // Set view directory and template directory.
    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'jade');

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        store: mongoStore(config.db.uri),
        secret: 'dev'
    }));

    app.use(express.methodOverride());
    app.use(app.router);

    // Set stylus source and public directory.
    app.use(require("stylus").middleware({
        src: __dirname + "/public",
        compress: true }));
    app.use(express.static(__dirname + '/public'));

  });

  // Development.
  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  // Production.
  app.configure('production', function() {
    app.use(express.errorHandler());
  });

  // Register view helpers.
  require('./helpers/views').boot(app);

}
