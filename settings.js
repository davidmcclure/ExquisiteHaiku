
/*
 * Define application settings and middleware.
 */

// Module dependencies.
var express = require('express');
var MongoStore = require('connect-mongo')(express);

// Start-up routine.
module.exports = function(app) {

  var env = app.get('env');

  // Set view directory and template directory.
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');

  // Configure sessions.
  app.use(express.bodyParser());
  app.use(express.cookieParser('dev'));
  app.use(express.session({
    store: new MongoStore({ url: global.config.db }),
    secret: 'dev'
  }));

  app.use(express.methodOverride());
  app.use(app.router);

  // Set stylus source.
  app.use(require("stylus").middleware({
    src: __dirname + "/stylus",
    dest: __dirname + "/public",
    compress: true
  }));

  // Set public directory.
  app.use(express.static(__dirname + '/public'));

  // Development.
  if (env == 'development') {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  }

  // Production.
  if (env == 'production') {
    app.use(express.errorHandler());
  }

};
