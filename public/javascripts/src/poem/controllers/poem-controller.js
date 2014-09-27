
/**
 * Poem controller.
 */

Ov.Controllers.Poem = (function(Backbone, Ov) {

  var Poem = {};


  // ---------------
  // Initialization.
  // ---------------

  /**
   * Instantiate poem and blank.
   */
  Poem.init = function() {
    Poem.Poem = new Ov.Views.Poem();
    Poem.Blank = new Ov.Views.Blank();
  };


  // -------
  // Events.
  // -------

  /**
   * Detach the blank before the poems is rendered.
   */
  Ov.vent.on('poem:render:before', function() {
    Poem.Blank.detach();
  });

  /**
   * Re-insert the blank after the poem is rendered.
   *
   * @param {Element} line: The current active line.
   */
  Ov.vent.on('poem:render:after', function(line) {
    Poem.Blank.insert(line);
  });

  /**
   * Update the poem words.
   *
   * @param {Object} data: The incoming slice data.
   */
  Ov.vent.on('socket:slice', function(data) {
    Poem.Poem.update(data.poem, data.syllables);
  });

  /**
   * When a word is hovered, render the poem preview.
   *
   * @param {String} word: The word.
   */
  Ov.vent.on('words:hover', function(word) {
    if (!Ov.global.isDragging) Poem.Blank.showPreview(word);
  });

  /**
   * When a word is unhovered, clear the poem preview.
   *
   * @param {String} word: The word.
   */
  Ov.vent.on('words:unhover', function(word) {
    if (!Ov.global.isDragging) Poem.Blank.hidePreview();
  });

  /**
   * Clear the blank on new round.
   */
  Ov.vent.on('state:newRound', function() {
    Poem.Blank.clear();
  });


  // Export.
  Ov.addInitializer(function() { Poem.init(); });
  return Poem;

})(Backbone, Ov);
