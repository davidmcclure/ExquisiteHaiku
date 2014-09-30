
/**
 * Define application settings and middleware.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var path = require('path');


module.exports = function(app) {

  // Get the root directory.
  var root = path.normalize(__dirname+'/..');
  var env = app.get('env');

  // Assign the port.
  app.set('port', process.env.port || 3000);

  // Set view / template directory.
  app.set('views', root + '/app/views');
  app.set('view engine', 'jade');

  // Configure sessions.
  app.use(cookieParser('dev'));
  app.use(cookieSession({
    store: new MongoStore({ url: global.config.db }),
    secret: 'dev'
  }));

  app.use(methodOverride());
  app.use(app.router);

  // Set stylus source.
  app.use(require("stylus").middleware({
    src: root + "/stylus",
    dest: root + "/public",
    compress: true
  }));

  // Set public directory.
  app.use(express.static(root + '/public'));

  // Development.
  if (env == 'development') {

    // Show errors.
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
