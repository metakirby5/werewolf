var uuid = require('node-uuid');

/**
 * Represents a user. Basically a wrapper over a socket.
 * @param socket  The socket of the user
 * @param name    The user's name
 * @param role    The user's role
 * @param state   The user's state
 * @param id      (optional) The user's id
 * @constructor
 */
var User = function(socket, name, role, state, id) {
  var _id = id ? id : uuid.v4();
  var _socket = socket;
  var _name = name;
  var _role = role;

  // Public state, because it needs to be easily mutable
  this.state = state ? state : {};

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
  };

  /**
   * Emits a message to this user
   * @param message The message to emit
   * @param data    The data to send
   */
  this.emit = function(message, data) {
    _socket.emit(message, data);
  };
};


module.exports.User = User;