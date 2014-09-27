/*
 * Grunt file.
 */

// Get package configuration.
var config = require('yaml-config');
var configPath = '/public/javascripts/config.yaml';
var c = config.readConfig(process.cwd()+configPath);

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var adminVendor = [
    c.components+c.vendor.jquery,
    c.components+c.vendor.underscore,
    c.components+c.vendor.backbone,
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
        dest: c.dist+'poem.js',
        separator: ';'
      },

      admin: {
        src: adminVendor.concat([
          c.components+c.vendor.bootstrap,
          c.apps.add+'app.js',
          c.apps.add+'views/*.js',
          c.apps.add+'controllers/*.js'
        ]),
        dest: c.dist+'admin.js',
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
        dest: c.dist+'test.js',
        separator: ';'
      }

    },

    uglify: {

      poem: {
        src: ['<%= concat.poem.src %>'],
        dest: c.dist+'poem.js',
        separator: ';'
      },

      admin: {
        src: ['<%= concat.admin.src %>'],
        dest: c.dist+'admin.js',
        separator: ';'
      },

      test: {
        src: ['<%= concat.test.src %>'],
        dest: c.dist+'test.js',
        separator: ';'
      }

    },

    watch: {
      poem: {
        files: ['<%= concat.poem.src %>'],
        tasks: ['concat:poem']
      },
      admin: {
        files: ['<%= concat.admin.src %>'],
        tasks: ['concat:admin']
      },
      test: {
        files: ['<%= concat.test.src %>'],
        tasks: ['concat:test']
      }
    }

  });

  grunt.registerTask('default', 'uglify');

};
