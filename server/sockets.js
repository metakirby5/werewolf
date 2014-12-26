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

    socket.on('joinRoom', function(roomId) {
      room = rooms.getRoom(roomId);
      if (room) {
        socket.join(roomId);
        console.log('socket ' + socket.id + ' joined channel ' + roomId + ': ' + room.getName());
        socket.emit('joinedRoom');
      } else {
        console.log('roomId ' + roomId + ' not found, aborting');
        socket.emit('roomNotFound');
      }
    });

    // Helper function to get signed cookie or null
    function parseSignedCookie(cookie) {
      var parsed = cookieParser.signedCookie(cookie, secret);
      if (cookie === parsed)
        return null;
      return parsed;
    }

    socket.on('getUser', function(userId) {
      var parsedId = parseSignedCookie(userId);
      if (!parsedId) {
        console.log('cookie ' + userId + ' was invalid!');
        return;
      }

      console.log('getting user ' + parsedId);
      user = room.getUser(parsedId);
      if (user) {
        console.log('found user');
        console.log(user.repr());
        socket.emit('foundUser', user.repr());
      } else {
        console.log('user not found, requesting info');
        socket.emit('userNotFound');
      }
    });

    socket.on('addUser', function(data) {
      // Safety checks
      if (!data)
        return;
      if (!('userId' in data && 'name' in data))
        return;

      var userId = data.userId,
          name = data.name;

      // Try to get or add user
      var parsedId = parseSignedCookie(userId);
      if (!parsedId) {
        console.log('cookie ' + userId + ' was invalid!');
        return;
      }

      console.log('adding user ' + parsedId + ': ' + name);
      user = new User(parsedId, socket, name);
      var success = room.addUser(user);

      // Return the user
      if (success) {
        console.log(user.repr());
        console.log(room.getUserCount() + ' users now in room ' + room.getName());
        socket.emit('foundUser', user.repr());
      } else {
        console.log('room was full');
        socket.emit('roomFull');
      }
    });
  });
};