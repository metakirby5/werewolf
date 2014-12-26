var shortId = require('shortid');

var rooms = {};

/**
 * Represents a game room.
 * @param id    The ID assigned to the room
 * @param name  The name of the room
 * @constructor
 */
var Room = function(id, name) {
  var _id = id;
  var _name = name;
  var _users = {};

  /**
   * Getter for id
   * @returns id
   */
  this.getId = function() {
    return _id;
  };

  /**
   * Getter for name
   * @returns name
   */
  this.getName = function() {
    return _name;
  };

  /**
   * Setter for name
   * @param newName
   */
  this.setName = function(newName) {
    _name = newName;
  };

  /**
   * Gets a user from the room
   * @param userId  The id to get
   * @returns       The user if they exist, else null
   */
  this.getUser = function(userId) {
    return (userId in _users) ? _users[userId] : null;
  };

  /**
   * Adds a user to the room
   * @param user
   */
  this.addUser = function(user) {
    _users[user.getId()] = user;
  };

  /**
   * Removes a user from the room
   * @param userId
   */
  this.removeUser = function(userId) {
    delete _users[userId];
  }
};

/**
 * Getter for room by id
 * @param id  The room to get
 * @returns   The requested room
 */
var getRoom = function(id) {
  return rooms[id];
};

/**
 * Generates a new room and returns it.
 * @param name  The name of the room
 * @returns     The newly created room
 */
var newRoom = function(name) {
  var id = shortId.generate();

  // Until we get an unused id
  while(id in rooms)
    id = shortId.generate();

  rooms[id] = new Room(id, name);

  return rooms[id];
};

/**
 * Deletes a room by id
 * @param id  The room to delete
 */
var deleteRoom = function(id) {
  delete rooms[id];
};

module.exports.getRoom = getRoom;
module.exports.newRoom = newRoom;
module.exports.deleteRoom = deleteRoom;
