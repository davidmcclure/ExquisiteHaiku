
/**
 * Form view.
 */

Add.Views.Form = Backbone.View.extend({

  el: '#new',

  events: {
    'input input[name="roundLengthValue"]': 'setCapital',
    'change input[name="roundLengthUnit"]': 'setCapital'
  },

  /**
   * Get components.
   */
  initialize: function() {
    this.rLenVal = this.$el.find('input[name="roundLengthValue"]');
    this.seedCap = this.$el.find('input[name="seedCapital"]');
  },

  /**
   * Update defaults based on round length.
   */
  setCapital: function() {

    // Get new value.
    var val = this._getLength();
    val = !_.isNaN(val) ? val/10 : '';

    // Update seed capital.
    this.seedCap.val(val);

  },

  /**
   * Get round length in milliseconds.
   */
  _getLength: function() {
    var ms = Number(this.rLenVal.val()) * 1000;
    if (this._getUnit() == 'minutes') ms *= 60;
    return ms;
  },

  /**
   * Get the current unit value.
   */
  _getUnit: function() {
    return $('input[name="roundLengthUnit"]:checked').val();
  }

});
