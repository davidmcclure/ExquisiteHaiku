/*
 * Testing helpers.
 */

_t = {};
_t.reset = function() {

  // Globals.
  Ov.global = {
    isDragging: false,
    isFrozen: false,
    isVoting: null
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

};
