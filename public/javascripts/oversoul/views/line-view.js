/*
 * Line view.
 */

Ov.Views.Line = Backbone.View.extend({

  tagName: 'div',
  className: 'drag-line',

  /*
   * Initialize SVG element.
   *
   * @return void.
   */
  initialize: function() {

    // Get window element.
    this.window = $(window);

    // Create SVG element and text element for total.
    this.svg = d3.select(this.el).append('svg:svg');
    this.total = this.svg.append('svg:text');

    // Trackers.
    this.currentLine = null;
    this.lines = [];

  },

  /*
   * Inject the element.
   *
   * @return void.
   */
  show: function() {
    this.fitContainer();
    $('body').append(this.$el);
  },

  /*
   * Detach the element.
   *
   * @return void.
   */
  hide: function() {
    this.lockCurrent();
    this.$el.detach();
    this.clear();
  },

  /*
   * Render the line.
   *
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   * @param {Number} currentTotal: The current drag total.
   *
   * @return void.
   */
  render: function(initEvent, dragEvent, currentTotal) {

    // Get vertical offset and scrolltop.
    var height = dragEvent.pageY - initEvent.pageY;
    var scrollTop = $('body').scrollTop();

    // Draw line.
    this.clearCurrent();
    this.currentLine = this.svg.append('svg:line')
      .attr('x1', initEvent.pageX)
      .attr('y1', initEvent.pageY - scrollTop)
      .attr('x2', dragEvent.pageX)
      .attr('y2', dragEvent.pageY - scrollTop);

    // Set positive/negative colors.
    this.setLineColor(-height);
    this.setTotalColor(currentTotal);

    // Compute font-size.
    var fontSize = 12 + Math.abs(currentTotal)*0.1;

    // Position counter.
    this.total.text(currentTotal);
    this.total.attr('style', 'font-size:'+fontSize);
    this.total.attr('y', dragEvent.pageY - scrollTop - 10);
    this.total.attr('x', dragEvent.pageX + 10);

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
   * Clear all lines.
   *
   * @return void.
   */
  clear: function() {

    // Remove lines.
    _.each(this.lines, function(line) {
      line.remove();
    });

    // Clear counter.
    this.total.text('');
    this.lines = [];

  },

  /*
   * Clear the current line.
   *
   * @return void.
   */
  clearCurrent: function() {
    if (!_.isNull(this.currentLine))
      this.currentLine.remove();
  },

  /*
   * Freeze the current line.
   *
   * @return void.
   */
  lockCurrent: function() {
    if (!_.isNull(this.currentLine)) {
      this.lines.push(this.currentLine);
      this.currentLine = null;
    }
  },

  /*
   * Set positive drag.
   *
   * @param {Number} height: The line height.
   *
   * @return void.
   */
  setLineColor: function(height) {
    if (height >= 0) this.currentLine.attr('class', 'positive');
    else this.currentLine.attr('class', 'negative');
  },

  /*
   * Set negative drag.
   *
   * @param {Number} currentTotal: The drag value.
   *
   * @return void.
   */
  setTotalColor: function(currentTotal) {
    if (currentTotal >= 0) this.total.attr('class', 'positive');
    else this.total.attr('class', 'negative');
  },

  /*
   * Set insufficient points for current quantity.
   *
   * @return void.
   */
  setInvalid: function() {
    if (!_.isNull(this.currentLine))
      this.currentLine.attr('class', 'blocked');
    this.total.attr('class', 'blocked');
  }

});
