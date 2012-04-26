/*
 * State manager and data router.
 */

var AppView = Backbone.View.extend({

  /*
   * Application template.
   */
  appTemplate: function() {
    return _.template($('#app-view').html());
  },

  /*
   * Application startup.
   *
   * @return void.
   */
  initialize: function(socket) {

    // Render application template.
    this.renderAppTemplate();

    // Construct poem.
    this.poem = new PoemView();

    // ** dev.
    // Construct stacks.
    // Construct search.
    // Construct tickers.

    // Connect to socket.io.
    this.initializeSockets(socket);

  },

  /*
   * Render the application shell.
   *
   * @return void.
   */
  renderAppTemplate: function() {
    $('body').prepend(this.appTemplate());
  },

  /*
   * Subscribe to poem room, handle incoming slices.
   *
   * @param {Object} socket: Connected socket instance.
   *
   * @return void.
   */
  initializeSockets: function(socket) {

    // Connect to poem.
    socket.on('connect', function() {
      socket.emit('join', Poem.slug);
    });

    // Ingest slice.
    socket.on('slice', _.bind(function(data) {
      this.ingestSlice(data);
    }, this));

  },

  /*
   * Process an incoming data slice.
   *
   * @param {Object} data: The slice data.
   *
   * @return void.
   */
  ingestSlice: function(data) {
    console.log(data);
  }

});
