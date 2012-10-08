/*
 * Grunt file.
 */

// Get package configuration.
var config = require('yaml-config');
var c = config.readConfig('public/javascripts/config.yaml');

module.exports = function(grunt) {

  var adminVendor = [
    c.components+c.vendor.jquery,
    c.components+c.vendor.underscore,
    c.components+c.vendor.backbone,
    c.components+c.vendor.eventbinder,
    c.components+c.vendor.wreqr,
    c.components+c.vendor.marionette
  ];

  var poemVendor = adminVendor.concat([
    c.components+c.vendor.localstorage,
    c.components+c.vendor.d3
  ]);

  grunt.initConfig({

    concat: {

      poem: {
        src: poemVendor.concat([
          c.apps.poem+'app.js',
          c.apps.poem+'views/*.js',
          c.apps.poem+'collections/*.js',
          c.apps.poem+'controllers/*.js'
        ]),
        dest: c.payload+'poem.js',
        separator: ';'
      },

      admin: {
        src: adminVendor.concat([
          c.components+c.vendor.bootstrap,
          c.apps.add+'app.js',
          c.apps.add+'views/*.js',
          c.apps.add+'controllers/*.js'
        ]),
        dest: c.payload+'admin.js',
        separator: ';'
      },

      test: {
        src: poemVendor.concat([
          c.components+c.vendor.bootstrap,
          c.apps.poem+'app.js',
          c.apps.poem+'views/*.js',
          c.apps.poem+'collections/*.js',
          c.apps.poem+'controllers/*.js',
          c.apps.add+'app.js',
          c.apps.add+'views/*.js',
          c.apps.add+'controllers/*.js'
        ]),
        dest: c.payload+'test.js',
        separator: ';'
      }

    },

    min: {

      poem: {
        src: ['<config:concat.poem.src>'],
        dest: c.payload+'poem.js',
        separator: ';'
      },

      admin: {
        src: ['<config:concat.admin.src>'],
        dest: c.payload+'admin.js',
        separator: ';'
      },

      test: {
        src: ['<config:concat.test.src>'],
        dest: c.payload+'test.js',
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
