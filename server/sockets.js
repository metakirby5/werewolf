var cookieParser = require('cookie-parser');
var secret = process.env.COOKIE_SECRET;
var rooms = require('../logic/rooms');
var User = require('../logic/user').User;

module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('connected');

    var room, user;

    socket.on('disconnect', function() {
      // TODO: if mod d/cs, end the game and delete the room
      console.log('disconnected');
    });

    socket.on('room:join', function(roomId) {
      room = rooms.getRoom(roomId);
      if (room) {
        socket.join(roomId);
        console.log('socket ' + socket.id + ' joined channel ' + roomId + ': ' + room.getName());
        socket.emit('room:joined');
      } else {
        console.log('roomId ' + roomId + ' not found, aborting');
        socket.emit('notif:danger', 'Room not found!');
      }
    });

    // Helper function to get signed cookie or null
    function parseSignedCookie(cookie) {
      var parsed = cookieParser.signedCookie(cookie, secret);
      if (cookie === parsed)
        return null;
      return parsed;
    }

    socket.on('user:get', function(userId) {
      var parsedId = parseSignedCookie(userId);
      if (!parsedId) {
        console.log('cookie ' + userId + ' was invalid!');
        socket.emit('notif:danger', 'Please clear your cookies.');
        return;
      }

      console.log('getting user ' + parsedId);
      user = room.getUser(parsedId);
      if (user) {
        console.log('found user');
        console.log(user.repr());
        socket.emit('user:found', user.repr());
        socket.emit('notif:success', 'Rejoined room as ' + user.getName() + '!');
      } else {
        console.log('user not found, requesting info');
        socket.emit('notif:warning', 'Please enter your username.');
        socket.emit('user:notFound');
      }
    });

    socket.on('user:add', function(data) {
      // Safety checks
      if (!data || !('userId' in data && 'name' in data)) {
        socket.emit('notif:danger', 'Oops! Please try again.');
        return;
      }

      var userId = data.userId,
          name = data.name;

      // Try to get or add user
      var parsedId = parseSignedCookie(userId);
      if (!parsedId) {
        console.log('cookie ' + userId + ' was invalid!');
        socket.emit('notif:danger', 'Please clear your cookies.');
        return;
      }

      console.log('adding user ' + parsedId + ': ' + name);
      user = new User(parsedId, socket, name);
      try {
        room.addUser(user);
        console.log(user.repr());
        console.log(room.getUserCount() + ' users now in room ' + room.getName());
        socket.emit('user:found', user.repr());
        socket.emit('notif:success', 'Added ' + name + ' to the room!');
      } catch (e) {
        console.log(e);
        socket.emit('notif:danger', e);
      }
    });
  });
};