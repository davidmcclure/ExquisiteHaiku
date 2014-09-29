
/**
 * Fixture generator for front-end test suite.
 */

var _t = require('../dependencies.js');
var fs = require('fs');
var jade = require('jade');


describe('Fixtures', function() {

  it('render index.jade', function(done) {

    fs.readFile(
      'app/views/poem/base.jade',
      'utf8', function(err, data) {

        // Compile template function.
        var template = jade.compile(data);

        // Write file.
        fs.writeFile(
          'spec/javascripts/fixtures/base.html',
          template(), function(err) {
            done();
        });

    });

  });

  it('render templates.jade', function(done) {

    fs.readFile(
      'app/views/poem/templates.jade',
      'utf8', function(err, data) {

        // Compile template function.
        var template = jade.compile(data);

        // Write file.
        fs.writeFile(
          'spec/javascripts/fixtures/templates.html',
          template(), function(err) {
            done();
        });

    });

  });

});
