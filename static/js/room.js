(function($, _, io) {

  var socket = io.connect();

  socket.on('connect', function(data) {
    console.log(' connected');
    socket.emit('joinRoom', room);
  });
})(window.jQuery, window._, window.io);