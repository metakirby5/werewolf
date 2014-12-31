"use strict";

var _ = require('lodash');
var User = require('../../../logic/user.js').User;

var WEREWOLF = 'werewolf',
    VILLAGER = 'villager',
    SEER     = 'seer',
    DOCTOR   = 'doctor';

var VALID_CARDS = [WEREWOLF, VILLAGER, SEER, DOCTOR];

var Game = function(players) {
  var _players = players ? players : {};  // maps user ID to user object
  
  /**
   * Randomly assigns role cards to players, based on the count
   * specification. The 'roles' object is expected to be as follows:
   *    {'werewolf': 2, 'doctor': 1}
   * with the role name as the key, and its desired count as the value.
   * The 'villager' key is optional, as it is ignored.
   * @returns true if assignment successful, false if error occurred
   */
  this.assignRoles = function(roles) {   
    var deck = [];   
    var nPlayers = Object.keys(_players).length;
    var nSpecialRoles = 0;

    // Add special cards to the deck
    for (var role in roles)
      if (role !== VILLAGER) {
        nSpecialRoles += roles[role];
        for (var count = 0; count < roles[role]; count++)
          deck.push(role);
      }

    // Add villager cards to the deck
    if (nPlayers >= nSpecialRoles)
      for (var count = 0; count < (nPlayers - nSpecialRoles); count++)
        deck.push(VILLAGER);
    
    // Too many special cards
    else
      return false;

    // Shuffle deck for good measure
    deck = _.shuffle(deck);
    deck = _.shuffle(deck);
    deck = _.shuffle(deck);

    // Assign role cards to players
    for (var player in _players) {
      var card = deck.pop();
      _players[player].setCard(card);
    }

    return true;
  }
};


// BEGIN TEMPORARY TEST FUNCTIONS

var test_assignRoles = function() {
  var players = {};
  players['a'] = new User(1, null, 'a');
  players['b'] = new User(2, null, 'b');
  players['c'] = new User(3, null, 'c');
  players['d'] = new User(4, null, 'd');
  players['e'] = new User(5, null, 'e');
  players['f'] = new User(6, null, 'f');

  var roles = {'werewolf': 2, 'seer': 1};

  var game = new Game(players);
  game.assignRoles(roles);

  for (var p in players)
    console.log(players[p].repr());
}

test_assignRoles();

module.exports = Game;