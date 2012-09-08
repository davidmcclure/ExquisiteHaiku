/*
 * Form view.
 */

Create.Views.Form = Backbone.View.extend({

  el: '#new',

  events: {
    'keyup input.rLenVal': 'processKeyStroke',
    'click button.seconds': 'setUnitSeconds',
    'click button.minutes': 'setUnitMinutes'
  },

  /*
   * Get components.
   *
   * @return void.
   */
  initialize: function() {
    this.rLenVal = this.$el.find('input.rLenVal');
    this.rLenUnit = this.$el.find('input.rLenUnit');
    this.seedCap = this.$el.find('input.seedCap');
  },

  /*
   * Update defaults based on round length.
   *
   * @return void.
   */
  processKeyStroke: function() {

    // Get new value.
    var val = this._getRoundLengthMs();
    val = !_.isNaN(val) ? val/10 : '';

    // Update seed capital.
    this.seedCap.val(val);

  },

  /*
   * Set round length unit to 'seconds'.
   *
   * @return void.
   */
  setUnitSeconds: function() {
    this.rLenUnit.val('seconds');
    this.processKeyStroke();
  },

  /*
   * Set round length unit to 'minutes'.
   *
   * @return void.
   */
  setUnitMinutes: function() {
    this.rLenUnit.val('minutes');
    this.processKeyStroke();
  },

  /*
   * Get round length in milliseconds.
   *
   * @return void.
   */
  _getRoundLengthMs: function() {
    var ms = parseInt(this.rLenVal.val(), 10) * 1000;
    if (this.rLenUnit.val() == 'minutes') ms *= 60;
    return ms;
  }

});
