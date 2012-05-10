/*
 * Poem controller.
 */

Ov.Controllers.Poem = (function(Backbone, Ov) {

  var Poem = {};


  // ---------------
  // Initialization.
  // ---------------

  Ov.addInitializer(function() {

    // Instantiate poem and blank.
    Poem.PoemView = new Ov.Views.Poem();
    Poem.BlankView = new Ov.Views.Blank();

  });


  // -------
  // Events.
  // -------

  /*
   * Before the poem is re-rendered.
   *
   * @return void.
   */
  Ov.vent.on('poem:render:before', function() {

    // Detach blank.
    Poem.BlankView.detach();

  });

  /*
   * After the poem is re-rendered.
   *
   * @param {Element} line: The current active line.
   *
   * @return void.
   */
  Ov.vent.on('poem:render:after', function(line) {

    // Insert blank.
    Poem.BlankView.insert(line);

  });

  /*
   * On incoming data slice.
   *
   * @param {Object} data: The incoming slice data.
   *
   * @return void.
   */
  Ov.vent.on('socket:slice', function(data) {

    // Update poem.
    Poem.PoemView.update(data.poem, data.syllables);

  });

  /*
   * When a word is selected.
   *
   * @return void.
   */
  Ov.vent.on('stacks:select', function() {

    // Freeze the blank.
    Poem.BlankView.freeze();

  });

  /*
   * When a word is unselected.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unselect', function() {

    // Unfreeze the blank.
    Poem.BlankView.unFreeze();

  });

  /*
   * When a word is hovered in the stacks.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:hover', function(word) {

    // Render preview.
    Poem.BlankView.showPreview(word);

  });

  /*
   * When a word is unhovered in the stacks.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unhover', function(word) {

    // Render preview.
    Poem.BlankView.hidePreview();

  });

  return Poem;

})(Backbone, Ov);
