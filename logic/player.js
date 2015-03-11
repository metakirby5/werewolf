"use strict";

var Player = function(user, card) {
  var _user = user ? user : undefined;
  var _card = card ? card : undefined;
  var _isAlive = true;

  /**
   * Check if this player is alive.
   * @returns   True if alive, false otherwise
   */
  this.isAlive = function() {
    return isAlive;
  };

  /**
   * Set this player's alive status.
   * @param isAlive   The new alive status
   */
  this.setAlive = function(isAlive) {
    _isAlive = isAlive;
  };

  /**
   * Getter for this player's User object.
   * @returns  User object for this player
   */
  this.getUser = function() {
    return _user;
  };

  /**
   * Gets this player's card assignment.
   * @returns   This player's card as a string (?)
   */
  this.getCard = function() {
    return _card;
  };

  /**
   * Sets this player's card.
   * @param card    The player's new card.
   */
  this.setCard = function(card) {
    _card = card;
  };
};

module.exports.Player = Player;