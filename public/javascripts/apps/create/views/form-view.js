/*
 * Form view.
 */

Create.Views.Form = Backbone.View.extend({

  el: '#new',

  events: {
    'click button.seconds': 'setUnitSeconds',
    'click button.minutes': 'setUnitMinutes'
  },

  /*
   * Get components.
   *
   * @return void.
   */
  initialize: function() {
    this.rLenUnit = this.$el.find('input.rLenUnit');
  },

  /*
   * Set round length unit to 'seconds'.
   *
   * @return void.
   */
  setUnitSeconds: function() {
    this.rLenUnit.val('seconds');
  },

  /*
   * Set round length unit to 'minutes'.
   *
   * @return void.
   */
  setUnitMinutes: function() {
    this.rLenUnit.val('minutes');
  }

});
