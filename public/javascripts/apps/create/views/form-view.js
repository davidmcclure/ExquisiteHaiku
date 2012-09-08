/*
 * Form view.
 */

Create.Views.Form = Backbone.View.extend({

  el: '#new',

  /*
   * Get components.
   *
   * @return void.
   */
  initialize: function() {

    // Get inputs.
    this.rLenVal = this.$el.find('input.rLenVal');
    this.rLenUnit = this.$el.find('input.rLenUnit');
    this.rLenSec = this.$el.find('button.seconds');
    this.rLenMin = this.$el.find('button.minutes');
    this.seedCap = this.$el.find('input.seedCap');
    this.minSub = this.$el.find('input.minSub');
    this.subVal = this.$el.find('input.subVal');
    this.decLife = this.$el.find('input.decLife');
    this.published = this.$el.find('input.published');

  }

});
