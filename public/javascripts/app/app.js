/*
 * Connect sockets and run application.
 */

// Connect socket.io.
Poem.socket = io.connect();

// Run application view.
var appView = new AppView();
