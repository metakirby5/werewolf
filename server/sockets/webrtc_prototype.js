"use strict";

var User = require('../../logic/user').User;

module.exports = function(io) {
  io.on('connection', function(ws) {

    var user;

    ws.on('user:new', function(name) {
      console.log('adding ' + name);
      user = new User(null, ws, name);
      ws.emit('user:pushId', user.getId());
    });
  });
};