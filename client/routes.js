var express = require('express');
var router = express.Router();

var uuid = require('node-uuid');
var rooms = require('../logic/rooms');

// Client index
router.
  get('/', function(req, res) {
    res.render('index', {
      title: 'Werewolf',
      css: ['index']
    });
  }).
  get('/room/:id', function(req, res) {
    // Does the room even exist?
    var room = rooms.getRoom(req.params['id']);
    if (room === undefined) {
      res.status(404).render('roomNotFound', {
        title: 'Werewolf',
        roomId: req.params['id']
      });
      return;
    }

    // Give the user an ID
    if (!('userId' in req.signedCookies))
      res.cookie('userId', uuid.v4(), {signed: true});

    res.render('room', {
      title: 'Werewolf',
      css: ['room'],
      js: ['room'],
      room: room.getName(),
      extra: room.repr()
    });
  });

module.exports = router;
