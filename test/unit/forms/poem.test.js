/*
 * Unit tests for poem form.
 */

require('../../dependencies');

describe('Poem Form', function() {

  var form;

  beforeEach(function() {
    form = poemForm.form();
  });

  // Clear collections.
  afterEach(function(done) {

    // Truncate.
    async.map([
      User,
      Poem
    ], helpers.remove, function(err, models) {
      done();
    });

  });

  describe('roundLength', function() {

    it('should have a name attribute', function() {
      form.fields.roundLength.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        roundLength: ''
      }).validate(function(err, form) {
        form.fields.roundLength.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        roundLength: -5
      }).validate(function(err, form) {
        form.fields.roundLength.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        roundLength: 1000
      }).validate(function(err, form) {
        assert(!form.fields.roundLength.error);
        done();
      });

    });

  });

  describe('minSubmissions', function() {

    it('should have a name attribute', function() {
      form.fields.minSubmissions.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        minSubmissions: ''
      }).validate(function(err, form) {
        form.fields.minSubmissions.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        minSubmissions: -5
      }).validate(function(err, form) {
        form.fields.minSubmissions.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        minSubmissions: 5
      }).validate(function(err, form) {
        assert(!form.fields.minSubmissions.error);
        done();
      });

    });

  });

  describe('submissionVal', function() {

    it('should have a name attribute', function() {
      form.fields.submissionVal.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        submissionVal: ''
      }).validate(function(err, form) {
        form.fields.submissionVal.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        submissionVal: -5
      }).validate(function(err, form) {
        form.fields.submissionVal.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        submissionVal: 5
      }).validate(function(err, form) {
        assert(!form.fields.submissionVal.error);
        done();
      });

    });

  });

  describe('decayLifetime', function() {

    it('should have a name attribute', function() {
      form.fields.decayLifetime.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        decayLifetime: ''
      }).validate(function(err, form) {
        form.fields.decayLifetime.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        decayLifetime: -5
      }).validate(function(err, form) {
        form.fields.decayLifetime.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        decayLifetime: 5
      }).validate(function(err, form) {
        assert(!form.fields.decayLifetime.error);
        done();
      });

    });

  });

  describe('seedCapital', function() {

    it('should have a name attribute', function() {
      form.fields.seedCapital.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        seedCapital: ''
      }).validate(function(err, form) {
        form.fields.seedCapital.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        seedCapital: -5
      }).validate(function(err, form) {
        form.fields.seedCapital.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        seedCapital: 5
      }).validate(function(err, form) {
        assert(!form.fields.seedCapital.error);
        done();
      });

    });

  });

});
