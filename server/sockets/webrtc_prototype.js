"use strict";

var User = require('../../logic/user').User;
var _ = require('lodash');

module.exports = function(io) {

  var userIds = [];

  io.on('connection', function(signalChannel) {

    var user;

    signalChannel.on('user:new', function(name) {
      console.log('adding ' + name);
      user = new User(null, signalChannel, name);

      // Push all existing id's to this id as offer
      _(userIds).forEach(function(userId) {
        signalChannel.emit('peer:doOffer', userId);
      });

      // Add id
      userIds.push(user.getId());
    });

    signalChannel.on('privateChannel:new', function(userId) {
      var pc = io.of('/' + userId);

      pc.on('connection', function(privateChannel) {
        // pass-thru
        privateChannel.on('message', function(data) {
          privateChannel.broadcast.send(data);
        });

        // Push this id to all existing id's as answer
        signalChannel.broadcast.emit('peer:doAnswer', userIds.slice(-1)[0]);
      });
    });
  });
};