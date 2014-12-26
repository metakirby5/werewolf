var express = require('express');
var router = express.Router();

var rooms = require('../logic/rooms');

// TODO: check for all parameters for api, respond with err if not present
// TODO: parse ints to ints, etc.
router.
  route('/').
    // Respons with all public rooms state
    get(function(req, res) {
      res.status(200).json(rooms.getPublicRooms().map(function(room) {
        return room.state();
      }));
    }).

    // Creates a new room and responds with state
    post(function(req, res) {
      console.log(req.body);
      res.status(201).json(rooms.newRoom(req.body['name'], req.body['pub'], req.body['maxUsers']).state());
    });

    // Rooms are cleaned once everyone has left.
router.
  route('/:id').

    // Gets a specific room state
    get(function(req, res) {
      // TODO: check if id even exists before calling state
      res.status(200).json(rooms.getRoom(req.params['id']).state());
    });

module.exports = router;
