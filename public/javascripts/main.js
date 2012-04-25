/*
 * Include libraries and run application.
 */

// Connect socket.io.
var socket = io.connect();

// Run application view.
var appView = new AppView(socket);
