/*
 * Testing helpers.
 */

_t = {};


// --------------------
// Application loaders.
// --------------------

/*
 * Load poem application.
 */
_t.loadPoem = function() {

  // Globals.
  Ov.global = {
    isDragging: false,
    isFrozen: false
  };

  // Restart components.
  Ov.Controllers.Socket.init();
  Ov.Controllers.Round.init();
  Ov.Controllers.Poem.init();
  Ov.Controllers.Stack.init();
  Ov.Controllers.Log.init();
  Ov.Controllers.Info.init();

  // Shortcut components
  _t.socket = Ov.Controllers.Socket.s;
  _t.rounds = Ov.Controllers.Round.Rounds;
  _t.poem = Ov.Controllers.Poem.Poem;
  _t.blank = Ov.Controllers.Poem.Blank;
  _t.rank = Ov.Controllers.Stack.Rank;
  _t.line = Ov.Controllers.Stack.Line;
  _t.log = Ov.Controllers.Log.Stack;
  _t.points = Ov.Controllers.Info.Points;
  _t.timer = Ov.Controllers.Info.Timer;

  // Set testing constants.
  _t.rounds.reset();
  _t.log.options.maxLength = 5;
  _t.points.balance = 1000;

};


// --------------------
// Application loaders.
// --------------------

/*
 * Activate voting state.
 */
_t.isVoting = function() {
  _t.rounds.recordSubmission();
  Ov.global.isVoting = true;
};
