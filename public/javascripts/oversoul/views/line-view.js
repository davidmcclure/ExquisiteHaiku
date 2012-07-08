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
    this.line = null;

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
    this.$el.detach();
    this.clear();
  },

  /*
   * Render the line.
   *
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   *
   * @return void.
   */
  render: function(initEvent, dragEvent) {

    // Get vertical offset.
    var height = dragEvent.pageY - initEvent.pageY;

    // Set line style.
    if (height >= 0) this.setNegative();
    else this.setPositive();

    // Draw line.
    this.clear();
    this.line = this.svg.append('svg:line')
      .attr('x1', initEvent.pageX)
      .attr('y1', initEvent.pageY)
      .attr('x2', dragEvent.pageX)
      .attr('y2', dragEvent.pageY);

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
   * Clear the line.
   *
   * @return void.
   */
  clear: function() {
    if (!_.isNull(this.line)) this.line.remove();
  },

  /*
   * Set positive drag.
   *
   * @return void.
   */
  setPositive: function() {
    this.$el.addClass('positive');
    this.$el.removeClass('negative');
  },

  /*
   * Set negative drag.
   *
   * @return void.
   */
  setNegative: function() {
    this.$el.addClass('negative');
    this.$el.removeClass('positive');
  }

});
