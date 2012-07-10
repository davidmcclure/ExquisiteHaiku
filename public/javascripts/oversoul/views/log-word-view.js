/*
 * Log word view.
 */

Ov.Views.LogWord = Backbone.View.extend({

  tagName: 'div',
  className: 'log-row',

  template: function() {
    return _.template($('#log-word').html());
  },

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {

  }

});
