/*
 * Fixture generator for front-end test suite.
 */

// Module dependencies.
var fs = require('fs');
var jade = require('jade');

// Models.
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');


/*
 * ----------------
 * Render fixtures.
 * ----------------
 */


describe('Fixtures', function() {

  it('render index.jade', function(done) {

    // User.
    var user = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Mock poem.
    var poem = new Poem({
      user:             user.id,
      started:          true,
      running:          true,
      complete:         false,
      roundLength :     1000,
      sliceInterval :   300,
      minSubmissions :  10,
      submissionVal :   100,
      decayLifetime :   10000,
      seedCapital :     1000,
      visibleWords :    100
    });

    fs.readFile(
      'app/views/poem/base.jade',
      'utf8', function(err, data) {

        // Compile template function.
        var template = jade.compile(data);

        // Write file.
        fs.writeFile(
          'spec/javascripts/fixtures/index.html',
          template({
            title: 'hash',
            poem: poem
          }), function(err) {
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
