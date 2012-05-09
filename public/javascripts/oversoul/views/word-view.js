/*
 * Word view.
 */

Ov.Views.Word = Backbone.View.extend({

  tagName: 'tr',
  className: 'stack-word',

  template: function() {
    return _.template($('#stack-word').html());
  },

  /*
   * Render new values.
   *
   * @return void.
   */
  update: function() {

  }

});

