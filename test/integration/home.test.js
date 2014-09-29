
/**
 * Integration tests for index controller.
 */

var _t = require('../dependencies.js');
var Browser = require('zombie');
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');


describe('Index Controller', function() {

  var browser, user;

  // Create documents.
  beforeEach(function(done) {

    // Create browser.
    browser = new Browser();

    // Create user.
    user = new User({
      username: 'user',
      password: 'password',
      email: 'user1@test.org'
    });

    // Save.
    user.save(function(err) {
      done();
    });

  });

  // Clear users.
  afterEach(function(done) {
    User.remove(function(err) {
      done();
    });
  });

  describe('GET /', function() {

    describe('for anonymous user', function() {

      it('should show login link', function(done) {
        browser.visit(_t.root, function() {
          browser.query('a[href="/admin/login"]').should.be.ok;
          done();
        });
      });

      it('should show register link', function(done) {
        browser.visit(_t.root, function() {
          browser.query('a[href="/admin/register"]').should.be.ok;
          done();
        });
      });

    });

    describe('for logged in user', function() {

      // Log user in.
      beforeEach(function(done) {
        browser.visit(_t.root+'admin/login', function() {
          browser.fill('username', 'user');
          browser.fill('password', 'password');
          browser.pressButton('Login', function() {
            done();
          });
        });
      });

      it('should not show login link', function(done) {
        browser.visit(_t.root, function() {
          should(!browser.query('a[href="/admin/login"]'));
          done();
        });
      });

      it('should not show register link', function(done) {
        browser.visit(_t.root, function() {
          should(!browser.query('a[href="/admin/register"]'));
          done();
        });
      });

      it('should show logout link', function(done) {
        browser.visit(_t.root, function() {
          browser.query('a[href="/admin/logout"]').should.be.ok;
          done();
        });
      });

    });

  });

});
