"use strict";

var cookieParser = require('cookie-parser');
var secret = process.env.COOKIE_SECRET;
var rooms = require('../logic/rooms');
var User = require('../logic/user').User;

module.exports = function(io) {

  require('./sockets/webrtc_prototype')(io.of('/webrtc_prototype'));

  // TODO: modularize/namespace
  io.of('/room').on('connection', function(socket) {
    console.log('connected');

    var room, user;

    socket.on('disconnect', function() {
      if (user && room) {

        room.userDisconnected(user);

        // Mod has disconnected
        if (user.getId() === room.getMod().getId()) {
          console.log('mod "' + user.getName() + '" has disconnected');
          var nextMod = room.getNextMod(user);

          // Another connected player available? Assign new mod
          if (nextMod) {
            console.log('new mod assigned: "' + nextMod.getName() + '"');
            room.setMod(nextMod);
          }

          // No available mod - end the game, destroy the room
          // TODO: this causes bug when two tabs w/ same user are connected, need to fix
          else {
            console.log('no mods available - ending game and deleting room');
            rooms.deleteRoom(room.getId());
          }
        }

        // Player disconnected - pause game
        else {
          console.log('player "' + user.getName() + '" has disconnected');
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
        socket.emit('notif:danger', 'Room not found!');
      }
    });

    // Helper function to get signed cookie or null
    function parseSignedCookie(cookie) {
      var parsed = cookieParser.signedCookie(cookie, secret);
      if (cookie === parsed) {
        console.log('cookie ' + cookie + ' was invalid!');
        socket.emit('notif:danger', 'Please clear your cookies.');
        return null;
      }
      return parsed;
    }

    // TODO: make sure these events are only triggered if we have a room!

    socket.on('user:get', function(userId) {
      var parsedId = parseSignedCookie(userId);
      if (!parsedId)
        return;

      console.log('getting user ' + parsedId);
      user = room.getUser(parsedId);
      if (user) {
        console.log('found user');
        console.log(user.repr());
        user.setSocket(socket);
        room.userConnected(user);
        socket.emit('user:update', user.repr());
        socket.emit('notif:success', 'Rejoined room as "' + user.getName() + '"!');
      } else {
        console.log('user not found, requesting info');
        socket.emit('notif:warning', 'Please enter your username.');
        socket.emit('user:notFound');
      }
    });

    socket.on('user:add', function(data) {
      // Safety checks
      if (!data || !('userId' in data && 'name' in data)) {
        socket.emit('notif:danger', 'Some data was missing - please try again.');
        return;
      }

      var userId = data.userId,
          name = data.name;

      // Is name empty?
      if (name === '') {
        socket.emit('notif:danger', 'Username cannot be empty.');
        return;
      }

      // Cookie validation
      var parsedId = parseSignedCookie(userId);
      if (!parsedId)
        return;

      // Try to get or add user
      console.log('adding user ' + parsedId + ': "' + name + '"');
      user = new User(parsedId, socket, name);
      try {
        room.addUser(user);
        room.userConnected(user);
        console.log(user.repr());
        console.log(room.getUserCount() + ' users now in room ' + room.getName());
        socket.emit('user:update', user.repr());
        socket.emit('notif:success', 'Added "' + name + '" to the room!');
      } catch (e) {
        console.log(e);
        socket.emit('notif:danger', e);
      }
    });

    socket.on('user:setName', function(data) {
      // Safety checks
      if (!data || !('userId' in data && 'name' in data)) {
        socket.emit('notif:danger', 'Some data was missing - please try again.');
        return;
      }

      var userId = data.userId,
          name = data.name;

      // Is name empty?
      if (name === '') {
        socket.emit('notif:danger', 'Username cannot be empty.');
        return;
      }

      // Cookie validation
      var parsedId = parseSignedCookie(userId);
      if (!parsedId)
        return;

      // Set new name for user
      var oldName = user.getName();
      try {
        room.setUserName(user, name);
      } catch (e) {
        console.log(e);
        socket.emit('notif:danger', e);
        return;
      }

      // Update the client
      socket.emit('user:update', user.repr());
      console.log('"' + oldName + '" changed name to "' + name + '"');
      socket.emit('notif:success', 'Changed name from "' + oldName + '" to "' + name + '"!');
    });
  });
};