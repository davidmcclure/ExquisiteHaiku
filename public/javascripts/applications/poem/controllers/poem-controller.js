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
  Poem.init = function() {
    Poem.Poem = new Ov.Views.Poem();
    Poem.Blank = new Ov.Views.Blank();
  };


  // -------
  // Events.
  // -------

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
   * When a word is hovered, render the poem preview.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  Ov.vent.on('words:hover', function(word) {
    if (!Ov.global.isDragging) Poem.Blank.showPreview(word);
  });

  /*
   * When a word is unhovered, clear the poem preview.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  Ov.vent.on('words:unhover', function(word) {
    if (!Ov.global.isDragging) Poem.Blank.hidePreview();
  });


  // Export.
  Ov.addInitializer(function() { Poem.init(); });
  return Poem;

})(Backbone, Ov);
