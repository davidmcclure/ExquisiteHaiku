/*
 * Unit tests for user forms.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  sinon = require('sinon');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');

// Form.
var userForms = require('../../../helpers/forms/user');


/*
 * ----------------------
 * User forms unit tests.
 * ----------------------
 */


describe('User Forms', function() {

  var form;

  // Clear users.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('newUser', function() {

    beforeEach(function() {
      form = userForms.newUser();
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

      it('should be >= 4 characters', function(done) {

        form.bind({
          username: 'dav'
        }).validate(function(err, form) {
          form.fields.username.error.should.be.ok;
          done();
        });

      });

      it('should be <= 20 characters', function(done) {

        form.bind({
          username: 'supercalafragalisticexpialadocious'
        }).validate(function(err, form) {
          form.fields.username.error.should.be.ok;
          done();
        });

      });

      it('should be unique', function(done) {

        // Create a user.
        var user = new User({
          username:   'david',
          email:      'david@spyder.com',
          password:   'password',
          superUser:  true,
          active:     true
        });

        // Save.
        user.save(function(err) {

          form.bind({
            username: 'david'
          }).validate(function(err, form) {
            form.fields.username.error.should.be.ok;
            done();
          });

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

      it('should be greater than 6 characters', function(done) {

        form.bind({
          password: 'short'
        }).validate(function(err, form) {
          form.fields.password.error.should.be.ok;
          done();
        });

      });

      it('should validate when valid', function(done) {

        form.bind({
          password: 'password'
        }).validate(function(err, form) {
          assert(!form.fields.password.error);
          done();
        });

      });

    });

    describe('confirm', function() {

      it('should have a name attribute', function() {
        form.fields.confirm.name.should.be.ok;
      });

      it('should exist', function(done) {

        form.bind({
          confirm: ''
        }).validate(function(err, form) {
          form.fields.confirm.error.should.be.ok;
          done();
        });

      });

      it('should match the password', function(done) {

        form.bind({
          password: 'password',
          confirm: 'mismatch'
        }).validate(function(err, form) {
          form.fields.confirm.error.should.be.ok;
          done();
        });

      });

      it('should validate when valid', function(done) {

        form.bind({
          password: 'password',
          confirm: 'password'
        }).validate(function(err, form) {
          assert(!form.fields.confirm.error);
          done();
        });

      });

    });

    describe('email', function() {

      it('should have a name attribute', function() {
        form.fields.email.name.should.be.ok;
      });

      it('should exist', function(done) {

        form.bind({
          email: ''
        }).validate(function(err, form) {
          form.fields.email.error.should.be.ok;
          done();
        });

      });

      it('should be valid', function(done) {

        form.bind({
          email: 'invalid'
        }).validate(function(err, form) {
          form.fields.email.error.should.be.ok;
          done();
        });

      });

      it('should validate when valid', function(done) {

        form.bind({
          email: 'david@spyder.com'
        }).validate(function(err, form) {
          assert(!form.fields.email.error);
          done();
        });

      });

    });

    describe('superUser', function() {

      it('should have a name attribute', function() {
        form.fields.superUser.name.should.be.ok;
      });

    });

    describe('active', function() {

      it('should have a name attribute', function() {
        form.fields.active.name.should.be.ok;
      });

    });

  });

  describe('editInfo', function() {

    beforeEach(function(done) {

      // Create a user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Save and create form.
      user.save(function(err) {
        form = userForms.editInfo(user);
        done();
      });

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

      it('should be >= 4 characters', function(done) {

        form.bind({
          username: 'dav'
        }).validate(function(err, form) {
          form.fields.username.error.should.be.ok;
          done();
        });

      });

      it('should be <= 20 characters', function(done) {

        form.bind({
          username: 'supercalafragalisticexpialadocious'
        }).validate(function(err, form) {
          form.fields.username.error.should.be.ok;
          done();
        });

      });

      it('should be unique', function(done) {

        // Create a user.
        var user = new User({
          username:   'kara',
          email:      'kara@spyder.com',
          password:   'password',
          superUser:  true,
          active:     true
        });

        // Save.
        user.save(function(err) {

          form.bind({
            username: 'kara'
          }).validate(function(err, form) {
            form.fields.username.error.should.be.ok;
            done();
          });

        });

      });

      it('should validate when it does not match current username', function(done) {

        form.bind({
          username: 'rosie'
        }).validate(function(err, form) {
          assert(!form.fields.username.error);
          done();
        });

      });

      it('should validate when it matches current username', function(done) {

        form.bind({
          username: 'david'
        }).validate(function(err, form) {
          assert(!form.fields.username.error);
          done();
        });

      });

    });

    describe('email', function() {

      it('should have a name attribute', function() {
        form.fields.email.name.should.be.ok;
      });

      it('should exist', function(done) {

        form.bind({
          email: ''
        }).validate(function(err, form) {
          form.fields.email.error.should.be.ok;
          done();
        });

      });

      it('should be unique', function(done) {

        // Create a user.
        var user = new User({
          username:   'kara',
          email:      'kara@spyder.com',
          password:   'password',
          superUser:  true,
          active:     true
        });

        // Save.
        user.save(function(err) {

          form.bind({
            email: 'kara@spyder.com'
          }).validate(function(err, form) {
            form.fields.email.error.should.be.ok;
            done();
          });

        });

      });

      it('should be valid', function(done) {

        form.bind({
          email: 'invalid'
        }).validate(function(err, form) {
          form.fields.email.error.should.be.ok;
          done();
        });

      });

      it('should validate when it does not match current email', function(done) {

        form.bind({
          email: 'rosie@spyder.com'
        }).validate(function(err, form) {
          assert(!form.fields.email.error);
          done();
        });

      });

      it('should validate when it matches current email', function(done) {

        form.bind({
          email: 'david@spyder.com'
        }).validate(function(err, form) {
          assert(!form.fields.email.error);
          done();
        });

      });

    });

  });

  describe('editSelfInfo', function() {

    beforeEach(function(done) {

      // Create a user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Save and create form.
      user.save(function(err) {
        form = userForms.editSelfInfo(user);
        done();
      });

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

      it('should be >= 4 characters', function(done) {

        form.bind({
          username: 'dav'
        }).validate(function(err, form) {
          form.fields.username.error.should.be.ok;
          done();
        });

      });

      it('should be <= 20 characters', function(done) {

        form.bind({
          username: 'supercalafragalisticexpialadocious'
        }).validate(function(err, form) {
          form.fields.username.error.should.be.ok;
          done();
        });

      });

      it('should be unique', function(done) {

        // Create a user.
        var user = new User({
          username:   'kara',
          email:      'kara@spyder.com',
          password:   'password',
          superUser:  true,
          active:     true
        });

        // Save.
        user.save(function(err) {

          form.bind({
            username: 'kara'
          }).validate(function(err, form) {
            form.fields.username.error.should.be.ok;
            done();
          });

        });

      });

      it('should validate when it does not match current username', function(done) {

        form.bind({
          username: 'rosie'
        }).validate(function(err, form) {
          assert(!form.fields.username.error);
          done();
        });

      });

      it('should validate when it matches current username', function(done) {

        form.bind({
          username: 'david'
        }).validate(function(err, form) {
          assert(!form.fields.username.error);
          done();
        });

      });

    });

    describe('email', function() {

      it('should have a name attribute', function() {
        form.fields.email.name.should.be.ok;
      });

      it('should exist', function(done) {

        form.bind({
          email: ''
        }).validate(function(err, form) {
          form.fields.email.error.should.be.ok;
          done();
        });

      });

      it('should be unique', function(done) {

        // Create a user.
        var user = new User({
          username:   'kara',
          email:      'kara@spyder.com',
          password:   'password',
          superUser:  true,
          active:     true
        });

        // Save.
        user.save(function(err) {

          form.bind({
            email: 'kara@spyder.com'
          }).validate(function(err, form) {
            form.fields.email.error.should.be.ok;
            done();
          });

        });

      });

      it('should be valid', function(done) {

        form.bind({
          email: 'invalid'
        }).validate(function(err, form) {
          form.fields.email.error.should.be.ok;
          done();
        });

      });

      it('should validate when it does not match current email', function(done) {

        form.bind({
          email: 'rosie@spyder.com'
        }).validate(function(err, form) {
          assert(!form.fields.email.error);
          done();
        });

      });

      it('should validate when it matches current email', function(done) {

        form.bind({
          email: 'david@spyder.com'
        }).validate(function(err, form) {
          assert(!form.fields.email.error);
          done();
        });

      });

    });

  });

  describe('editPassword', function() {

    beforeEach(function(done) {

      // Create a user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Save and create form.
      user.save(function(err) {
        form = userForms.editPassword(user);
        done();
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

      it('should be <= 6 characters', function(done) {

        form.bind({
          password: 'pass'
        }).validate(function(err, form) {
          form.fields.password.error.should.be.ok;
          done();
        });

      });

      it('should validate when valid', function(done) {

        form.bind({
          password: 'password'
        }).validate(function(err, form) {
          assert(!form.fields.password.error);
          done();
        });

      });

    });

    describe('confirm', function() {

      it('should have a name attribute', function() {
        form.fields.confirm.name.should.be.ok;
      });

      it('should exist', function(done) {

        form.bind({
          confirm: ''
        }).validate(function(err, form) {
          form.fields.confirm.error.should.be.ok;
          done();
        });

      });

      it('should match the password', function(done) {

        form.bind({
          password: 'password',
          confirm: 'mismatch'
        }).validate(function(err, form) {
          form.fields.confirm.error.should.be.ok;
          done();
        });

      });

      it('should validate when valid', function(done) {

        form.bind({
          password: 'password',
          confirm: 'password'
        }).validate(function(err, form) {
          assert(!form.fields.confirm.error);
          done();
        });

      });

    });

  });

});
