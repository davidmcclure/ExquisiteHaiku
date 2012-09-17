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

    min: {

      poem: {
        src: vendorOrder.concat([
          poem+'**/*.js'
        ]),
        dest: payload+'poem.min.js',
        separator: ';'
      },

      admin: {
        src: vendorOrder.concat([
          bootstrap+'bootstrap.min.js',
          add+'**/*.js'
        ]),
        dest: payload+'admin.min.js',
        separator: ';'
      },

      test: {
        src: vendorOrder.concat([
          '<config:min.poem.src>',
          '<config:min.admin.src>'
        ]),
        dest: payload+'test.min.js',
        separator: ';'
      }

    },

    watch: {
      files: ['<config:min.test.src>'],
      tasks: ['min:poem', 'min:admin']
    }

  });

  grunt.registerTask('default', 'min');

};
