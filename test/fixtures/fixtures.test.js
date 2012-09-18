/*
 * Fixture generator for front-end test suite.
 */

var _t = require('../dependencies.js');

describe('Fixtures', function() {

  it('render index.jade', function(done) {

    _t.fs.readFile(
      'app/views/poem/base.jade',
      'utf8', function(err, data) {

        // Compile template function.
        var template = _t.jade.compile(data);

        // Write file.
        _t.fs.writeFile(
          'spec/javascripts/fixtures/base.html',
          template(), function(err) {
            done();
        });

    });

  });

  it('render templates.jade', function(done) {

    _t.fs.readFile(
      'app/views/poem/templates.jade',
      'utf8', function(err, data) {

        // Compile template function.
        var template = _t.jade.compile(data);

        // Write file.
        _t.fs.writeFile(
          'spec/javascripts/fixtures/templates.html',
          template(), function(err) {
            done();
        });

    });

  });

  // it('render new.jade', function(done) {

  //   _t.fs.readFile(
  //     'app/views/admin/new.jade',
  //     'utf8', function(err, data) {

  //       // Construct form.
  //       var form = _t.poemForm.form();

  //       // Compile template function.
  //       var template = _t.jade.compile(data, {
  //         locals: { form: form }
  //       });

  //       // Write file.
  //       _t.fs.writeFile(
  //         'spec/javascripts/fixtures/new.html',
  //         template(), function(err) {
  //           done();
  //       });

  //   });

  // });

});
