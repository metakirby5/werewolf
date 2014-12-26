(function($ww, $, _, io) {

  var socket = io.connect();
  var user;

  function prepareSocket() {
    socket.on('connect', function() {
      console.log('connected - joining ' + $ww.id);
      socket.emit('joinRoom', $ww.id);
    });

    socket.on('joinedRoom', function() {
      console.log('joined room - adding user ' + $.cookie('userId'));
      socket.emit('addOrGetUser', $.cookie('userId'));
    });

    socket.on('assignUser', function(iUser) {
      console.log('got user');
      console.log(iUser);
      user = iUser;
    });

    socket.on('roomFull', function() {
      console.log('room full')
    });
  }

  $(function() {
    prepareSocket();
  });
})(window.$ww, window.jQuery, window._, window.io);