/*
 * Unit tests for RoundCollection.
 */

describe('Round Collection', function() {

  var roundCollection;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('index.html');
    loadFixtures('templates.html');
    Ov.start();
  });

  // Construct collection.
  beforeEach(function() {
    roundCollection = new Ov.Collections.Round();
  });

  describe('getCurrentRound', function() {

    beforeEach(function() {
      Poem.rounds = [{_id: 'round1'}, {_id: 'round2'}];
      Poem.seedCapital = 1000;
    });

    describe('when currentRound is not null', function() {

      beforeEach(function() {
        roundCollection.currentRound = 1;
      });

      it('should return currentRound', function() {
        expect(roundCollection.getCurrentRound()).toEqual(1);
      });

    });

    describe('when currentRound is null', function() {

      it('should return Poem._id', function() {
        expect(roundCollection.getCurrentRound()).toEqual('round2');
      });

    });

  });

  describe('recordSubmission', function() {

    it('should add a record with the current round id', function() {

      // Set current round.
      roundCollection.currentRound = 1;
      roundCollection.recordSubmission();

      // Check for record.
      var records = roundCollection.where({id:1});
      expect(records.length).toEqual(1);
      expect(records[0].get('points')).toEqual(1000);

    });

  });

});
