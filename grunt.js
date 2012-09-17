/*
 * Grunt file.
 */

module.exports = function(grunt) {

  // File prefixes.
  var vendor = 'public/javascripts/vendor/';
  var payload = 'public/javascripts/payloads/';
  var poem = 'public/javascripts/applications/poem/';

  grunt.initConfig({

    concat: {
      poem: {
        src: [
          vendor+'jquery/jquery.js',
          vendor+'underscore/underscore.js',
          vendor+'d3/d3.js',
          vendor+'backbone/backbone.js',
          vendor+'backbone/backbone-localstorage.js',
          poem+'app.js',
          poem+'collections/round-collection.js',
          poem+'views/poem-view.js',
          poem+'views/blank-view.js',
          poem+'views/stack-view.js',
          poem+'views/stack-word-view.js',
          poem+'views/log-view.js',
          poem+'views/log-word-view.js',
          poem+'views/line-view.js',
          poem+'views/points-view.js',
          poem+'views/timer-view.js',
          poem+'controllers/poem-controller.js',
          poem+'controllers/socket-controller.js',
          poem+'controllers/round-controller.js',
          poem+'controllers/stack-controller.js',
          poem+'controllers/log-controller.js',
          poem+'controllers/info-controller.js'
        ],
        dest: payload+'poem.min.js'
      },
      admin: {

      }
    }

  });

  grunt.registerTask('default', 'lint');

};
