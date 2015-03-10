"use strict";

var uuid = require('node-uuid');

/**
 * Represents a user. Basically a wrapper over a socket.
 * @param socket  The socket of the user
 * @param card    The user's card
 * @param id      (optional) The user's id
 * @constructor
 */
var User = function(id, socket, card) {
  var _id = id ? id : uuid.v4();
  var _socket = socket ? socket : null;
  var _card = card ? card : 'villager';

  // On disconnect, deregister this socket
  _socket.on('disconnect', function() {
    _socket = null;
  });

  /**
   * Returns a JSON representation of user
   * @returns {{id: *, card: *}} representation
   */
  this.repr = function() {
    return {
      id: _id,
      card: _card
    };
  };

  /**
   * Getter for id.
   * @returns id
   */
  this.getId = function() {
    return _id;
  };

  /**
   * Sets the user's socket.
   * @param socket  The socket to set to
   */
  this.setSocket = function(socket) {
    _socket = socket;
    _socket.on('disconnect', function() {
      _socket = null;
    });
  };

  /**
   * Emits a message to this user
   * @param message   The message to emit
   * @param data      The data to send
   * @returns boolean Whether or not emitting succeeded
   */
  this.emit = function(message, data) {
    if (_socket) {
      _socket.emit(message, data);
      return true;
    } else
      return false;
  };
};


module.exports.User = User;