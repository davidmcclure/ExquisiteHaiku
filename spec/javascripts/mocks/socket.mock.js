
/**
 * Socket.io mock.
 */

io = {

  /**
   * Connect socket.
   *
   * @return {Object} socket: The socket instance.
   */
  connect: function() {

    return {

      /**
       * Event handler.
       *
       * @param {String} event: The event name.
       * @param {Function} cb: The callback.
       */
      on: function(event, cb) {},

      /**
       * Emit event.
       *
       * @param {String} event: The event name.
       */
      emit: function(event) {

        switch (event) {

          case 'validate':

            // Valid words.
            var valid = [
              'valid1',
              'valid2',
              'valid3',
              'valid4',
              'valid5'
            ];

            // Valid word.
            if (_.contains(valid, arguments[2])) {
              arguments[3](true);
            }

            // Invalid word.
            else arguments[3](false);

          break;

        }

      }

    };

  }

};
