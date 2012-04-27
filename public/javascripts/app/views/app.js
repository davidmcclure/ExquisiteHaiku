/*
 * State manager and data router.
 */

var AppView = Backbone.View.extend({

  /*
   * Application startup.
   *
   * @return void.
   */
  initialize: function() {

    // Build templates.
    this.buildTemplates();

    // Insert application shell.
    this.render();

    // Construct poem.
    this.poem = new PoemView($('#left'));

    // Connect to socket.io.
    this.initializeSockets();

  },

  /*
   * Build templates.
   *
   * @return void.
   */
  buildTemplates: function() {

    // Application.
    this.appTemplate = _.template(
      $('#app-view').html()
    );

  },

  /*
   * Insert application shell.
   *
   * @return void.
   */
  render: function() {
    $('body').prepend(this.appTemplate());
  },

  /*
   * Subscribe to poem room, handle incoming slices.
   *
   * @param {Object} socket: Connected socket instance.
   *
   * @return void.
   */
  initializeSockets: function() {

    // Connect socket.io.
    this.socket = io.connect();

    // Connect to poem.
    this.socket.on('connect', _.bind(function() {
      socket.emit('join', Poem.slug);
    }, this));

    // Ingest slice.
    this.socket.on('slice', _.bind(function(data) {
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
