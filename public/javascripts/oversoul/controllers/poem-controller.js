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
    Poem.PoemView = new Ov.Views.Poem();
    Poem.BlankView = new Ov.Views.Blank();
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
    Poem.BlankView.activateSubmit();
    Poem.BlankView.voting = false;
  });

  /*
   * Switch the blank into voting mode.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Poem.BlankView.activateVote();
    Poem.BlankView.voting = true;
  });

  /*
   * Detach the blank before the poems is rendered.
   *
   * @return void.
   */
  Ov.vent.on('poem:render:before', function() {
    Poem.BlankView.detach();
  });

  /*
   * Re-insert the blank after the poem is rendered.
   *
   * @param {Element} line: The current active line.
   *
   * @return void.
   */
  Ov.vent.on('poem:render:after', function(line) {
    Poem.BlankView.insert(line);
  });

  /*
   * Update the poem words.
   *
   * @param {Object} data: The incoming slice data.
   *
   * @return void.
   */
  Ov.vent.on('socket:slice', function(data) {
    Poem.PoemView.update(data.poem, data.syllables);
  });

  /*
   * When a word is selected, freeze the stacks.
   *
   * @return void.
   */
  Ov.vent.on('stacks:select', function() {
    Poem.BlankView.freeze();
  });

  /*
   * When a word is deselected, unfreeze the stacks.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unselect', function() {
    Poem.BlankView.unFreeze();
  });

  /*
   * When a word is hovered, render the poem preview.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:hover', function(word) {
    Poem.BlankView.showPreview(word);
  });

  /*
   * When a word is unhovered, clear the poem preview.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unhover', function(word) {
    Poem.BlankView.hidePreview();
  });

  return Poem;

})(Backbone, Ov);
