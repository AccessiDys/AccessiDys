module.exports = function(io) {

  'use strict';
  io.on('connection', function(socket) {
    socket.broadcast.emit('user connected');

    // socket.on('allProduct', function() {
    //   io.sockets.emit('broadcast', {
    //     name: 'msg'
    //   });
    // });
  });
};