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
      socket.emit('getUser', $.cookie('userId'));
    });

    socket.on('roomNotFound', function() {
      console.log('room closed');
    });

    socket.on('userNotFound', function() {
      console.log('user not found, prompting for info...');
      var name = 'NAME'; // TODO: get this from frontend
      socket.emit('addUser', {userId: $.cookie('userId'), name: name});
    });

    socket.on('foundUser', function(iUser) {
      console.log('found user');
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