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
    this.svg = d3.select(this.el).append('svg:svg');
    this.line = null;
  },

  /*
   * Inject the element.
   *
   * @return void.
   */
  show: function() {
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

    // Compute dimensions.
    var width = dragEvent.pageX - initEvent.pageX;
    var height = dragEvent.pageY - initEvent.pageY;
    var absWidth = Math.abs(width);
    var absHeight = Math.abs(height);

    // Size the container and svg.
    this.svg.attr('width', absWidth);
    this.svg.attr('height', absHeight);
    this.$el.css({
      width: absWidth,
      height: absHeight
    });

    var top = null;
    var left = null;
    var x1 = null;
    var y1 = null;
    var x2 = null;
    var y2 = null;

    // Dragging down.
    if (height >= 0) {
      this.setNegative();
      top = initEvent.pageY;
      y1 = 0;
      y2 = height;
    }

    // Dragging up.
    else {
      this.setPositive();
      top = initEvent.pageY + height;
      y1 = -height;
      y2 = 0;
    }

    // Dragging right.
    if (width >= 0) {
      left = initEvent.pageX;
      x1 = 0;
      x2 = width;
    }

    // Dragging left.
    else {
      left = initEvent.pageX + width;
      x1 = -width;
      x2 = 0;
    }

    // Render position.
    this.$el.css({ top: top, left: left });

    // Draw line.
    this.clear();
    this.line = this.svg.append('svg:line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2);

    console.log(absHeight);
    console.log(this.$el.height());

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
