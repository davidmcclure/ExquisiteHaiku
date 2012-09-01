/*
 * Unit tests for round model.
 */

// Modules
// -------
var mocha = require('mocha');
var should = require('should');
var assert = require('assert');
var async = require('async');
var sinon = require('sinon');
var config = require('yaml-config');
var mongoose = require('mongoose');
var helpers = require('../../helpers');
var _ = require('underscore');


// Models
// ------

// Round.
require('../../../app/models/round');
var Round = mongoose.model('Round');


// Config
// ------

var root = config.readConfig('test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
var server = require('../../../app');


// Specs
// -----

describe('Round', function() {

  var round;

  // Create round.
  beforeEach(function() {
    round = new Round();
  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create round, override defaults.
      var round = new Round();
      round.started = null;

      // Save.
      round.save(function(err) {

        // Check for errors.
        err.errors.started.type.should.eql('required');

        // Check for 0 documents.
        Round.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('field defaults', function() {

    it('should set "started" by default', function() {
      round.started.should.be.ok;
    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        assert.exist(round.id);
      });

      it('should be a string', function() {
        round.id.should.be.a('string');
      });

    });

  });

  describe('methods', function() {

    describe('register', function() {

      it('should create the empty votes tracker', function() {
        round.register();
        global.Oversoul.votes.should.have.keys(round.id);
      }); 

    });

  });

});
