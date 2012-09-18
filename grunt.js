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
        dest: payload+'poem.js'
      },

      admin: {
        src: vendorOrder.concat([
          bootstrap+'bootstrap.min.js',
          add+'**/*.js'
        ]),
        dest: payload+'admin.js'
      },

      test: {
        src: vendorOrder.concat([
          bootstrap+'bootstrap.min.js',
          poem+'**/*.js',
          add+'**/*.js'
        ]),
        dest: payload+'test.js'
      }

    },

    min: {

      poem: {
        src: vendorOrder.concat([
          poem+'**/*.js'
        ]),
        dest: payload+'poem.js',
        separator: ';'
      },

      admin: {
        src: vendorOrder.concat([
          bootstrap+'bootstrap.min.js',
          add+'**/*.js'
        ]),
        dest: payload+'admin.js',
        separator: ';'
      },

      test: {
        src: vendorOrder.concat([
          bootstrap+'bootstrap.min.js',
          poem+'**/*.js',
          add+'**/*.js'
        ]),
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
