/*
 * Socket.io mock.
 */

var io = {

  /*
   * Connect socket.
   *
   * @return {Object} socket: The socket instance.
   */
  connect: function() {

    return {

      /*
       * Event handler.
       *
       * @param {String} event: The event name.
       * @param {Function} cb: The callback.
       *
       * @return void.
       */
      on: function(event, cb) {

      }

    };

  }

};
