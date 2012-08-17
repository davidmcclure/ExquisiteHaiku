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

    // Create SVG element.
    this.svg = d3.select(this.el).append('svg:svg');
    this.total = this.svg.append('svg:text');

    // Trackers.
    this.line = null;
    this.circle = null;
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

    // Clear current shapes.
    // this.clearCurrent();

    // If no line, create one.
    if (_.isNull(this.line))
      this.line = this.svg.append('svg:line');

    // If no circle, create one.
    if (_.isNull(this.circle))
      this.circle = this.svg.append('svg:circle');

    // Line.
    this.line
      .attr('x1', initEvent.pageX)
      .attr('y1', initEvent.pageY - scrollTop)
      .attr('x2', dragEvent.pageX)
      .attr('y2', dragEvent.pageY - scrollTop);

    // Circle.
    this.circle
      .attr('cx', initEvent.pageX)
      .attr('cy', initEvent.pageY)
      .attr('r', Math.abs(currentTotal))
      .attr('opacity', 0.05);

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

    // Clear lines.
    _.each(this.lines, function(line) {
      line.remove();
    });

    // Clear circle.
    if (!_.isNull(this.circle))
      this.circle.remove();

    // Clear counter.
    this.total.text('');
    this.circle = null;
    this.lines = [];

  },

  /*
   * Clear the current line.
   *
   * @return void.
   */
  clearCurrent: function() {

    // Clear line.
    if (!_.isNull(this.line))
      this.line.remove();

    // Clear circle.
    if (!_.isNull(this.circle))
      this.circle.remove();

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
  },

  /*
   * Set the color of the line.
   *
   * @param {Number} height: The line height.
   *
   * @return void.
   */
  setLineColor: function(height) {
    if (height >= 0) this.line.attr('class', 'positive');
    else this.line.attr('class', 'negative');
  },

  /*
   * Set the color of the total and circle.
   *
   * @param {Number} currentTotal: The drag value.
   *
   * @return void.
   */
  setTotalColor: function(currentTotal) {

    // Positive.
    if (currentTotal >= 0) {
      this.total.attr('class', 'positive');
      this.circle.attr('class', 'positive');
    }

    // Negative.
    else {
      this.total.attr('class', 'negative');
      this.circle.attr('class', 'negative');
    }

  },

  /*
   * Set insufficient points for current quantity.
   *
   * @return void.
   */
  setInvalid: function() {
    if (!_.isNull(this.line))
      this.line.attr('class', 'blocked');
    this.total.attr('class', 'blocked');
  }

});
