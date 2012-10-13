/*
 * Line view.
 */

Ov.Views.Drag = Backbone.View.extend({

  tagName: 'div',
  className: 'drag-line',

  /*
   * Initialize SVG element.
   *
   * @return void.
   */
  initialize: function() {

    // Getters.
    this.window = $(window);
    this.body = $('body');

    // Create SVG element.
    this.svg = d3.select(this.el).append('svg:svg');
    this.total = this.svg.append('svg:text');

    // Trackers.
    this.line = null;
    this.lines = [];

  },

  /*
   * Inject the element.
   *
   * @return void.
   */
  show: function() {
    this.fitContainer();
    this.body.append(this.$el);
  },

  /*
   * Detach the element.
   *
   * @return void.
   */
  hide: function() {
    this.lockCurrent();
    this.clear();
  },

  /*
   * Fit the container to fill the window.
   *
   * @return void.
   */
  fitContainer: function() {

    var width = this.window.width();
    var height = this.window.height();

    // Fit the container.
    this.$el.css({ width: width, height: height });

    // Fit the SVG element.
    this.svg.attr('width', width);
    this.svg.attr('height', height);
  },

  /*
   * Render the line.
   *
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   * @param {Number} total: The current drag total.
   *
   * @return void.
   */
  render: function(initEvent, dragEvent, total) {

    // Get constants.
    var height = dragEvent.pageY - initEvent.pageY;
    var scrollTop = this.body.scrollTop();
    var absTotal = Math.abs(total);

    // Create line.
    if (_.isNull(this.line))
      this.line = this.svg.append('svg:line');

    // Set colors.
    if (Ov.global.points - absTotal < 0) this.setInvalid();
    else this.setColor(-height, total);

    // Counter.
    this.total.text(total).attr({
      style: 'font-size:' + (12 + absTotal*0.1),
      y: dragEvent.pageY - scrollTop - 10,
      x: dragEvent.pageX + 10
    });

    // Line.
    this.line.attr({
      x1: initEvent.pageX,
      y1: initEvent.pageY - scrollTop,
      x2: dragEvent.pageX,
      y2: dragEvent.pageY - scrollTop
    });

  },

  /*
   * Set the color of the line and total.
   *
   * @param {Number} height: The line height.
   * @param {Number} total: The drag magnitude.
   *
   * @return void.
   */
  setColor: function(height, total) {

    // Line.
    if (height >= 0) this.line.attr('class', 'positive');
    else this.line.attr('class', 'negative');

    // Circle, total.
    var sign = (total >= 0) ? 'positive' : 'negative';
    this.total.attr('class', sign);

  },

  /*
   * Set insufficient points for current quantity.
   *
   * @return void.
   */
  setInvalid: function() {

    // Render line.
    if (!_.isNull(this.line))
      this.line.attr('class', 'blocked');

    // Render total.
    this.total.attr('class', 'blocked');

  },

  /*
   * Clear all lines.
   *
   * @return void.
   */
  clear: function() {

    // Clear lines.
    _.each(this.lines, function(line) {
      line.remove(); });
    this.lines = [];

    // Clear counter.
    this.total.text('');

    // Remove container.
    this.$el.detach();

  },

  /*
   * Clear the current line.
   *
   * @return void.
   */
  clearCurrent: function() {
    if (!_.isNull(this.line)) this.line.remove();
  },

  /*
   * Freeze the current line.
   *
   * @return void.
   */
  lockCurrent: function() {
    if (!_.isNull(this.line)) {
      this.lines.push(this.line);
      this.line = null;
    }
  }

});
