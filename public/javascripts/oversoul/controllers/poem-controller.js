/*
 * Poem controller.
 */

Ov.Controllers.Poem = (function(Backbone, Ov) {

  var Poem = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate poem and blank.
   *
   * @return void.
   */
  Ov.addInitializer(function() {
    Poem.Poem = new Ov.Views.Poem();
    Poem.Blank = new Ov.Views.Blank();
  });


  // -------
  // Events.
  // -------

  /*
   * Switch the blank into submission mode.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function() {
    Poem.Blank.activateSubmit();
  });

  /*
   * Switch the blank into voting mode.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Poem.Blank.activateVote();
  });

  /*
   * Detach the blank before the poems is rendered.
   *
   * @return void.
   */
  Ov.vent.on('poem:render:before', function() {
    Poem.Blank.detach();
  });

  /*
   * Re-insert the blank after the poem is rendered.
   *
   * @param {Element} line: The current active line.
   *
   * @return void.
   */
  Ov.vent.on('poem:render:after', function(line) {
    Poem.Blank.insert(line);
  });

  /*
   * Update the poem words.
   *
   * @param {Object} data: The incoming slice data.
   *
   * @return void.
   */
  Ov.vent.on('socket:slice', function(data) {
    Poem.Poem.update(data.poem, data.syllables);
  });

  /*
   * When a word is selected, freeze the words:.
   *
   * @return void.
   */
  Ov.vent.on('words:select', function() {
    Poem.Blank.freeze();
  });

  /*
   * When a word is deselected, unfreeze the words:.
   *
   * @return void.
   */
  Ov.vent.on('words:unselect', function() {
    Poem.Blank.unFreeze();
  });

  /*
   * When a word is hovered, render the poem preview.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  Ov.vent.on('words:hover', function(word) {
    Poem.Blank.showPreview(word);
  });

  /*
   * When a word is unhovered, clear the poem preview.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  Ov.vent.on('words:unhover', function(word) {
    Poem.Blank.hidePreview();
  });

  return Poem;

})(Backbone, Ov);
