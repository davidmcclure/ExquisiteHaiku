/*
 * Unit tests for user model.
 */

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../../../app');

// Bootstrap models.
var User = mongoose.model('User');

describe('User', function() {

  describe('uniqueness constraints', function() {

    beforeEach(function() {

      // Create user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com'
      });

    });

    it('should block duplicate usernames', function() {

      // Create a new user with a duplicate username.
      var dupUser = new User({ username: 'david' });

      // Save and check for error.
      dupUser.save(function(err) {
        expect(err).toBeNull();
      });

    });

  });

});
