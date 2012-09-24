/*
 * Grunt file.
 */

module.exports = function(grunt) {

  var vendor =    'public/javascripts/components/';
  var poemApp =   'public/javascripts/applications/poem/';
  var addApp =    'public/javascripts/applications/add/';
  var bootstrap = 'public/stylesheets/bootstrap/js/';
  var payload =   'public/javascripts/payloads/';

  var adminVendor = [
    vendor+'jquery/jquery.js',
    vendor+'underscore/underscore-min.js',
    vendor+'backbone/backbone-min.js',
    vendor+'backbone.marionette/lib/backbone.marionette.min.js'
  ];

  var poemVendor = adminVendor.concat([
    vendor+'Backbone.localStorage/backbone.localStorage.js',
    vendor+'d3/d3.v2.min.js'
  ]);

  grunt.initConfig({

    concat: {

      poem: {
        src: poemVendor.concat([
          poemApp+'**/*.js'
        ]),
        dest: payload+'poem.js',
        separator: ';'
      },

      admin: {
        src: adminVendor.concat([
          bootstrap+'bootstrap.min.js',
          addApp+'**/*.js'
        ]),
        dest: payload+'admin.js',
        separator: ';'
      },

      test: {
        src: poemVendor.concat([
          bootstrap+'bootstrap.min.js',
          poemApp+'**/*.js',
          addApp+'**/*.js'
        ]),
        dest: payload+'test.js',
        separator: ';'
      }

    },

    min: {

      poem: {
        src: ['<config:concat.poem.src>'],
        dest: payload+'poem.js',
        separator: ';'
      },

      admin: {
        src: ['<config:concat.admin.src>'],
        dest: payload+'admin.js',
        separator: ';'
      },

      test: {
        src: ['<config:concat.test.src>'],
        dest: payload+'test.js',
        separator: ';'
      }

    },

    watch: {
      poem: {
        files: ['<config:concat.poem.src>'],
        tasks: ['concat:poem']
      },
      admin: {
        files: ['<config:concat.admin.src>'],
        tasks: ['concat:admin']
      }
    }

  });

  grunt.registerTask('default', 'min');

};
