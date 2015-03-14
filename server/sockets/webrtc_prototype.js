"use strict";

var User = require('../../logic/user').User;
var _ = require('lodash');

module.exports = function(io) {

  // Contains user sockets
  var users = {};

  io.on('connection', function(socket) {

    var user;

    socket.on('s:user:new', function(name) {
      console.log('adding ' + name);
      user = new User(null, socket, name);

      // Push all existing id's to this id as offer
      for (var userId in users) {
        if (users.hasOwnProperty(userId)) {
          users[userId].emit('c:peer:doOffer', userId);
        }
      }

      // Add id
      users[user.getId()] = socket;
    });

    socket.on('s:sdp:send', function(data) {

    });

  });
};