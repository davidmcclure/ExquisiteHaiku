/*
 * Stack word view.
 */

Ov.Views.StackWord = Ov.Views.DragWord.extend({

  tagName: 'tr',
  className: 'stack-row',

  template: function() {
    return _.template($('#stack-word').html());
  },

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {

    // Call parent.initialize().
    Ov.Views.DragWord.prototype.initialize.call(this);

    // Inject template.
    this.$el.append(this.template()());

    // Get components.
    this.posChurnMarkup = this.$el.find('.churn.pos');
    this.negChurnMarkup = this.$el.find('.churn.neg');
    this.ratioMarkup = this.$el.find('.ratio');
    this.wordMarkup = this.$el.find('.word');

    // Trackers.
    this.word = null;
    this.posChurn = null;
    this.negChurn = null;
    this.value = null;
    this.ratio = null;

    // Construct drag manager on word.
    this.dragger = new Ov.Views.DragWord({
      el: this.wordMarkup
    });

  },

  /*
   * Render new values, set word tracker.
   *
   * @param {Array} data: Array of [word, value].
   *
   * @return void.
   */
  update: function(data) {

    // Capture data.
    this.word = data[0];
    this.posChurn = data[2];
    this.negChurn = data[3];
    this.ratio = data[4];

    // Compute aggregate churn.
    this.value = this.posChurn + this.negChurn;

    // Render values.
    this.wordMarkup.text(this.word);
    this.posChurnMarkup.text(this.posChurn);
    this.negChurnMarkup.text(this.negChurn);
    this.ratioMarkup.text(this.ratio);

    // Render styles.
    this.renderSize();
    this.renderColor();

  }

});
