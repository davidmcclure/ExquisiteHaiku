/*
 * Grunt file.
 */

module.exports = function(grunt) {

  var vendor =    'public/javascripts/vendor/';
  var poemApp =   'public/javascripts/applications/poem/';
  var addApp =    'public/javascripts/applications/add/';
  var bootstrap = 'public/stylesheets/bootstrap/js/';
  var payload =   'public/javascripts/payloads/';

  var adminVendor = [
    vendor+'jquery/jquery.js',
    vendor+'underscore/underscore.js',
    vendor+'backbone/backbone.js',
    vendor+'backbone/marionette.js'
  ];

  var poemVendor = adminVendor.concat([
    vendor+'d3/d3.js',
    vendor+'backbone/localstorage.js'
  ]);

  grunt.initConfig({

    concat: {

      poem: {
        src: poemVendor.concat([
          poemApp+'**/*.js'
        ]),
        dest: payload+'poem.js'
      },

      admin: {
        src: adminVendor.concat([
          bootstrap+'bootstrap.min.js',
          addApp+'**/*.js'
        ]),
        dest: payload+'admin.js'
      },

      test: {
        src: poemVendor.concat([
          bootstrap+'bootstrap.min.js',
          poemApp+'**/*.js',
          addApp+'**/*.js'
        ]),
        dest: payload+'test.js'
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
