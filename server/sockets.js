"use strict";

var cookieParser = require('cookie-parser');
var secret = process.env.COOKIE_SECRET;
var rooms = require('../logic/rooms');
var User = require('../logic/user').User;

module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('connected');

    var room, user;

    socket.on('disconnect', function() {
      if (user && room) {

        // Mod has disconnected
        if (user.getId() === room.getMod().getId()) {
          console.log('mod \'' + user.getName() + '\' has disconnected');
          var nextMod = room.getNextMod(user);

          // Another connected player available? Assign new mod
          if (nextMod) {
            console.log('new mod assigned: ' + nextMod.getName());
            room.setMod(nextMod);
          }

          // No available mod - end the game, destroy the room
          else {
            console.log('no mods available - ending game and deleting room');
            rooms.deleteRoom(room.getId());
          }
        }

        // Player disconnected - pause game
        else {
          console.log('player \'' + user.getName() + '\' has disconnected');
          // TODO: game pause logic
        }
      }
    });

    socket.on('room:join', function(roomId) {
      room = rooms.getRoom(roomId);
      if (room) {
        socket.join(roomId);
        console.log('socket ' + socket.id + ' joined channel ' + roomId + ': ' + room.getName());
        socket.emit('room:joined');
      } else {
        console.log('roomId ' + roomId + ' not found, aborting');
        socket.emit('room:notFound');
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
        return;
      }

      console.log('getting user ' + parsedId);
      user = room.getUser(parsedId);
      if (user) {
        console.log('found user');
        console.log(user.repr());
        user.setSocket(socket);
        socket.emit('user:found', user.repr());
      } else {
        console.log('user not found, requesting info');
        socket.emit('user:notFound');
      }
    });

    socket.on('user:add', function(data) {
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
      try {
        room.addUser(user);
        console.log(user.repr());
        console.log(room.getUserCount() + ' users now in room ' + room.getName());
        socket.emit('user:found', user.repr());
      } catch (e) {
        console.log(e);
        socket.emit('errMsg', e);
      }
    });
  });
};