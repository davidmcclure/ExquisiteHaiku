/*
 * Grunt file.
 */

module.exports = function(grunt) {

  // File prefixes.
  var vendor = 'public/javascripts/vendor/';
  var bootstrap = 'public/stylesheets/bootstrap/js/';
  var payload = 'public/javascripts/payloads/';
  var poem = 'public/javascripts/applications/poem/';
  var add = 'public/javascripts/applications/add/';

  grunt.initConfig({

    min: {

      poem: {
        src: [
          vendor+'jquery/jquery.js',
          vendor+'underscore/underscore.js',
          vendor+'d3/d3.js',
          vendor+'backbone/backbone.js',
          vendor+'backbone/marionette.js',
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
        dest: payload+'poem.min.js',
        separator: ';'
      },

      admin: {
        src: [
          vendor+'jquery/jquery.js',
          vendor+'underscore/underscore.js',
          vendor+'backbone/backbone.js',
          bootstrap+'bootstrap.min.js',
          vendor+'backbone/marionette.js',
          add+'app.js',
          add+'views/form-view.js',
          add+'controllers/form-controller.js'
        ],
        dest: payload+'admin.min.js',
        separator: ';'
      },

      test: {
        src: [
          vendor+'jquery/jquery.js',
          vendor+'underscore/underscore.js',
          vendor+'d3/d3.js',
          vendor+'backbone/backbone.js',
          vendor+'backbone/marionette.js',
          vendor+'backbone/backbone-localstorage.js',
          bootstrap+'bootstrap.min.js',
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
          poem+'controllers/info-controller.js',
          add+'app.js',
          add+'views/form-view.js',
          add+'controllers/form-controller.js'
        ],
        dest: payload+'test.min.js',
        separator: ';'
      }

    },

    watch: {
      files: ['<config:min.test.src>'],
      tasks: ['min:poem', 'min:admin', 'min:test']
    }

  });

  grunt.registerTask('default', 'lint');

};
