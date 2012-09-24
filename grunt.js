/*
 * Grunt file.
 */

// Get package configuration.
var config = require('yaml-config');
var c = config.readConfig('public/javascripts/config.yaml');

module.exports = function(grunt) {

  var bootstrap = 'public/stylesheets/bootstrap/js/';

  var adminVendor = [
    c.vendor+c.vendor.jquery,
    c.vendor+c.vendor.underscore,
    c.vendor+c.vendor.backbone,
    c.vendor+c.vendor.marionette
  ];

  var poemVendor = adminVendor.concat([
    vendor+c.vendor.localstorage,
    vendor+c.vendor.d3
  ]);

  grunt.initConfig({

    concat: {

      poem: {
        src: poemVendor.concat([
          c.apps.poem+'**/*.js'
        ]),
        dest: payload+'poem.js',
        separator: ';'
      },

      admin: {
        src: adminVendor.concat([
          bootstrap+'bootstrap.min.js',
          c.apps.add+'**/*.js'
        ]),
        dest: payload+'admin.js',
        separator: ';'
      },

      test: {
        src: poemVendor.concat([
          bootstrap+'bootstrap.min.js',
          c.apps.poem+'**/*.js',
          c.apps.add+'**/*.js'
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
