/*
 * Fixture generator for front-end test suite.
 */

// Module dependencies.
var fs = require('fs');
var jade = require('jade');


/*
 * ----------------
 * Render fixtures.
 * ----------------
 */


describe('Fixtures', function() {

  it('render js.jade template and write result', function(done) {

    fs.readFile(
      'app/views/poem/templates.jade',
      'utf8', function(err, data) {

        // Compile template function.
        var template = jade.compile(data);

        // Write file.
        fs.writeFile(
          'spec/javascripts/fixtures/fixtures.html',
          template(), function(err) {
            done();
        });

    });

  });

});
