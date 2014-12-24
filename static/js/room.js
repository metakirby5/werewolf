(function($, _, io) {

  var socket = io.connect();

  function prepareSocket() {
    socket.on('connect', function (data) {
      console.log('connected');
      //socket.emit('joinRoom', room);
    });
  }

  $(function() {
    prepareSocket();
  });
})(window.jQuery, window._, window.io);