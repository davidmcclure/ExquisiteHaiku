
/**
 * Define application settings and middleware.
 */

var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
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
  app.use(cookieParser());
  app.use(session({
    store: new MongoStore({ url: global.config.db }),
    secret: process.env.EH_SECRET,
    saveUninitialized: true,
    resave: true
  }));

  // Set stylus source.
  app.use(require("stylus").middleware({
    src: root + "/stylus",
    dest: root + "/public",
    compress: true
  }));

  // Set public directory.
  app.use(express.static(root + '/public'));

};
