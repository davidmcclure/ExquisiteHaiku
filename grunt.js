/*
 * Grunt file.
 */

module.exports = function(grunt) {

  // File prefixes.
  var vendor =    'public/javascripts/vendor/';
  var boot =      'public/stylesheets/bootstrap/js/';
  var build =     'public/javascripts/payloads/';
  var poem =      'public/javascripts/applications/poem/';
  var add =       'public/javascripts/applications/add/';

  // Vendor load order.
  var vendorOrder = [
    vendor+'jquery/jquery.js',
    vendor+'underscore/underscore.js',
    vendor+'d3/d3.js',
    vendor+'backbone/backbone.js',
    vendor+'backbone/marionette.js',
    vendor+'backbone/localstorage.js'
  ];

  grunt.initConfig({

    concat: {

      poem: {
        src: vendorOrder.concat([
          poem+'**/*.js'
        ]),
        dest: build+'poem.js'
      },

      admin: {
        src: vendorOrder.concat([
          boot+'bootstrap.min.js',
          add+'**/*.js'
        ]),
        dest: build+'admin.js'
      },

      test: {
        src: vendorOrder.concat([
          boot+'bootstrap.min.js',
          poem+'**/*.js',
          add+'**/*.js'
        ]),
        dest: build+'test.js'
      }

    },

    min: {

      poem: {
        src: ['<config:concat.poem.src>'],
        dest: build+'poem.js',
        separator: ';'
      },

      admin: {
        src: ['<config:concat.admin.src>'],
        dest: build+'admin.js',
        separator: ';'
      },

      test: {
        src: ['<config:concat.test.src>'],
        dest: build+'test.js',
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
