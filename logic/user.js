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
  var _connected = true;

  // Public state, because it needs to be easily mutable
  this.state = state ? state : {};

  // On disconnect, deregister this socket
  _socket.on('disconnect', function() {
    _socket = null;
    _connected = false;
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
   * Checks whether this user is connected.
   * @returns true if connected, false otherwise
   */
  this.isConnected = function() {
    return _connected;
  }

  /**
   * Sets the user's socket.
   * @param socket  The socket to set to
   */
  this.setSocket = function(socket) {
    _socket = socket;
    _connected = true;
    _socket.on('disconnect', function() {
      _socket = null;
      _connected = false;
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