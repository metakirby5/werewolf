var cookieParser = require('cookie-parser');
var secret = process.env.COOKIE_SECRET;
var rooms = require('../logic/rooms');
var User = require('../logic/user').User;

module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('connected');

    var room, user;

    socket.on('disconnect', function() {
      console.log('disconnected');
    });

    socket.on('joinRoom', function(roomId) {
      socket.join(roomId);
      console.log('socket ' + socket.id + ' joined channel ' + roomId);
      room = rooms.getRoom(roomId);
      if (room) {
        socket.emit('joinedRoom');
        console.log('socket ' + socket.id + ' joined ' + room.getName());
      } else {
        socket.emit('roomNotFound');
        console.log('roomId ' + roomId + ' not found, aborting');
      }
    });

    socket.on('addOrGetUser', function(userId) {
      // Try to get or add user
      var id = cookieParser.signedCookie(userId, secret);
      console.log('getting user ' + id);
      var success = true;
      user = room.getUser(id);
      if (!user) {
        user = new User(id, socket, 'NAME');
        success = room.addUser(user);
      }

      console.log(user.repr());
      console.log(room.getUserCount() + ' users now in room ' + room.getName());

      // Return the user
      if (success)
        socket.emit('assignUser', user.repr());
      else
        socket.emit('roomFull');
    });
  });
};