"use strict";

var uuid = require('node-uuid');

/**
 * Represents a user. Basically a wrapper over a socket.
 * @param socket  The socket of the user
 * @param name    The user's name
 * @param card    The user's card
 * @param state   The user's state
 * @param id      (optional) The user's id
 * @constructor
 */
var User = function(id, socket, name, card, state) {
  var _id = id ? id : uuid.v4();
  var _socket = socket ? socket : null;
  var _name = name ? name : 'Noname';
  var _card = card ? card : 'villager';

  // Public state, because it needs to be easily mutable
  this.state = state ? state : {};

  // On disconnect, deregister this socket
  if (_socket)
    _socket.on('disconnect', function() {
      _socket = null;
    });

  /**
   * Returns a JSON representation of user
   * @returns {{id: *, name: *, card: *, state: *}} representation
   */
  this.repr = function() {
    return {
      id: _id,
      name: _name,
      card: _card,
      state: this.state
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
   * Getter for name.
   * @returns user name
   */
  this.getName = function() {
    return _name;
  }

  /**
   * Getter for card.
   * @returns card name
   */
  this.getCard = function() {
    return _card;
  }

  /**
   * Setter for card.
   * @param new card name
   */
  this.setCard = function(card) {
    _card = card;
  }

  /**
   * Sets the user's socket.
   * @param socket  The socket to set to
   */
  this.setSocket = function(socket) {
    _socket = socket;
    if (_socket)
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