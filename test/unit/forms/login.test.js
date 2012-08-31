/*
 * Unit tests for login form.
 */

require('../../dependencies');

describe('Login Form', function() {

  var form, user1, user2;

  beforeEach(function(done) {

    // Create the form.
    form = loginForm.form();

    // Create admin user.
    user1 = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Create nont-admin user.
    user2 = new User({
      username: 'kara',
      password: 'password',
      email: 'kara@test.org'
    });

    // Save.
    async.map([
      user1,
      user2
    ], helpers.save, function(err, documents) {
      done()
    });

  });

  // Clear collections.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('username', function() {

    it('should have a name attribute', function() {
      form.fields.username.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        username: ''
      }).validate(function(err, form) {
        form.fields.username.error.should.be.ok;
        done();
      });

    });

    it('should match a user in the database', function(done) {

      form.bind({
        username: 'rosie'
      }).validate(function(err, form) {
        form.fields.username.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        username: 'david'
      }).validate(function(err, form) {
        assert(!form.fields.username.error);
        done();
      });

    });

  });

  describe('password', function() {

    it('should have a name attribute', function() {
      form.fields.password.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        password: ''
      }).validate(function(err, form) {
        form.fields.password.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        username: 'david',
        password: 'password'
      }).validate(function(err, form) {
        assert(!form.fields.password.error);
        done();
      });

    });

  });

});
