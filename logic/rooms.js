"use strict";

var shortId = require('shortid');
var _ = require('lodash');

var TIMEOUT = 5000; // ms
var rooms = {};

/**
 * Represents a game room.
 * @param id        The ID assigned to the room
 * @param name      (optional) The name of the room
 * @param pub       (optional) Whether or not this room is public
 * @param maxUsers  (optional) The maximum number of users; -1 for no max
 * @constructor
 */
var Room = function(id, name, pub, maxUsers) {
  var _id = id;
  var _name = name !== undefined ? name : 'Untitled Room';
  var _pub = pub !== undefined ? pub : true;                // public by default
  var _maxUsers = maxUsers !== undefined ? maxUsers : -1;   // no max by default
  var _users = {};                                          // user id -> User object
  var _usernames = {};                                      // user id -> name
  var _connectedUsers = {};                                 // user id -> User object
  var _mod = null;

  this.game = 'TEMP';

  /**
   * Returns a JSON representation of the room
   * @returns {{id: *, name: *, pub: *, curUsers: *, maxUsers: *}} The room representation
   */
  this.repr = function() {
    return {
      id: _id,
      name: _name,
      pub: _pub,
      curUsers: Object.keys(_users).length,
      maxUsers: _maxUsers
    };
  };

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
   * Getter for pub
   * @returns pub
   */
  this.isPublic = function() {
    return _pub;
  };

  /**
   * Setter for pub
   * @param pub   New value of pub
   */
  this.setPublic = function(pub) {
    _pub = pub;
  };

  /**
   * Getter for maxUsers
   * @returns maxUsers
   */
  this.getMaxUsers = function() {
    return _maxUsers;
  };

  /**
   * Setter for maxUsers
   * @param maxUsers  New value of maxUsers
   */
  this.setMaxUsers = function(maxUsers) {
    _maxUsers = maxUsers;
  };

  /**
   * Getter for number of users in the room
   * @returns Number of users in room
   */
  this.getUserCount = function() {
    return Object.keys(_users).length;
  };

  /**
   * Gets a user from the room
   * @param userId  The id to get
   * @returns       The user if they exist, else undefined
   */
  this.getUser = function(userId) {
    return (userId in _users) ? _users[userId] : undefined;
  };

  /**
   * Adds a user to the room, if possible
   * @param           user
   */
  this.addUser = function(user, name) {
    // Did we cap out on users?
    if (!(_maxUsers === -1 || this.getUserCount() < _maxUsers))
      throw 'Too many users.';

    // Did we already add this user?
    if (user.getId() in _users)
      throw 'User already added.';

    // Do we have a unique username?
    if (this.containsUserName(name))
      throw 'Duplicate username: "' + name + '"';

    if (this.getUserCount() === 0)
      _mod = user;

    _users[user.getId()] = user;
    _usernames[user.getId()] = name;
  };

  /**
   * Gets a user's name from User object
   * @param user    The User object
   * @returns       The username associated with id, else undefined
   */
  this.getUserName = function(user) {
    return (user.getId() in _usernames) ? _usernames[user.getId()] : undefined;
  };

  /**
   * Sets a user's name, ensuring it has changed and is unique in the room.
   * @param user  The user to change
   * @param name  The name to change to
   */
  this.setUserName = function(user, name) {
    // Is the name different?
    if (this.getUserName(user) === name)
      throw 'Name unchanged.';

    // Do we have a unique username?
    if (this.containsUserName(name))
      throw 'Duplicate username: "' + name + '"';

    // Update username hash
    _usernames[user.getId()] = name;
  };

  /**
   * Checks if this room already contains a username.
   * @param name    The name to check
   * @returns       True if contains, false otherwise
   */
  this.containsUserName = function(name) {
    for (var id in _usernames)
      if (name === _usernames[id])
        return true;

    return false;
  };

  /**
   * Removes a user from the room
   * @param userId
   */
  this.removeUser = function(userId) {
    delete _users[userId];
  };

  /**
   * Registers this user as connected by adding them to the list of
   * connected users.
   * @param user The connected user
   */
  this.userConnected = function(user) {
    _connectedUsers[user.getId()] = user;
  };

  /**
   * Deregisters this user from the connected list by removing them.
   * @param user The disconnected user
   */
  this.userDisconnected = function(user) {
    delete _connectedUsers[user.getId()];
  };

  /**
   * Gets mod of this room
   * @returns   The user if exists, null otherwise
   */
  this.getMod = function() {
    return _mod;
  };

  /**
   * Sets the mod of this room
   * @param user  The user to set as mod of this room
   */
  this.setMod = function(user) {
    _mod = user;
  };

  /**
   * Randomly gets a connected user to be the new mod.
   * @return  the user to set as mod, null if no user available
   */
  this.getNextMod = function() {
    var nextMod;
    do
      nextMod = _.sample(_connectedUsers);
    while (_mod === nextMod);
    return nextMod;
  }
};

/**
 * Returns all public rooms.
 * @returns {Array} All public rooms.
 */
var getPublicRooms = function() {
  var pubRooms = [];
  for (var room in rooms) {
    if (rooms.hasOwnProperty(room))
      if (rooms[room].isPublic())
        pubRooms.push(rooms[room]);
  }

  return pubRooms;
};

/**
 * Getter for room by id
 * @param id  The room to get
 * @returns   The requested room if it exists; undefined otherwise
 */
var getRoom = function(id) {
  return rooms[id];
};

/**
 * Generates a new room and returns it. If it takes longer than
 * @param name      The name of the room
 * @param pub       Whether or not the room is public
 * @param maxUsers  The max users for this room
 * @returns         The newly created room if creatable; null otherwise
 */
var newRoom = function(name, pub, maxUsers) {
  var id = shortId.generate();

  // Timeout in case it takes too long
  var expired = false;
  var timeout = setTimeout(function() {
    expired = true;
  }, TIMEOUT);

  // Until we get an unused id
  while(!expired && id in rooms)
    id = shortId.generate();

  // Clear the timeout
  clearTimeout(timeout);

  // Did we fail?
  if (expired)
    return null;

  rooms[id] = new Room(id, name, pub, maxUsers);

  return rooms[id];
};

/**
 * Deletes a room by id
 * @param id  The room to delete
 */
var deleteRoom = function(id) {
  delete rooms[id];
};

module.exports.getPublicRooms = getPublicRooms;
module.exports.getRoom = getRoom;
module.exports.newRoom = newRoom;
module.exports.deleteRoom = deleteRoom;
