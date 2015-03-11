"use strict";

var Player = require('./player.js').Player;
var Cards = require('./cards.js').Cards;

var Game = function(users) {
  var _players = {};
  var _currentPhase = Phases.Ready;

  /**
   * Setup the game.
   */
  this.setup = function() {
    console.log('Game begin');
    _currentPhase = Phases.Setup;

    for (var id in users)
      this.addPlayer(users[id]);
  };

  /**
   * Adds a player to the game.
   * @param user  The User to add
   */
  this.addPlayer = function(user) {
    if (user.getId() in _players)
      throw 'Player ' + user.getUserName(user) + 'already added to game';

    _players[user.getId()] = new Player(user, Cards.Villager);
  };

  /**
   * Gets the current phase of the game.
   * @return the numerical value corresponding to current phase
   */
  this.getPhase = function() {
    return _currentPhase;
  };
};

/**
 * Enum for game phases.
 * TODO add more phases
 */
var Phases = Object.freeze({
  'Ready': 0,
  'Setup': 1,
  'Voting': 2,
  'Completed': 3
});

module.exports.Game = Game;
module.exports.Game.Phases = Phases;