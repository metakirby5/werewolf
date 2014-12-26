var express = require('express');
var router = express.Router();

var util = require('../../util');
var rooms = require('../../logic/rooms');

router.route('/').
  // Responds with all public rooms repr
  get(function(req, res) {
    res.status(200).json(rooms.getPublicRooms().map(function(room) {
      return room.repr();
    }));
  }).

  // Creates a new room and responds with a redirect
  post(function(req, res) {
    var body = req.body;
    var errs = {};

    var name = body['name'];
    var pub = body['pub'];
    var maxUsers = body['maxUsers'];

    // Error checking and casting
    if (pub !== undefined) {
      pub = util.boolOrUndefined(pub);
      if (pub === undefined)
        errs['pub'] = 'Could not parse into boolean';
    }

    if (maxUsers !== undefined) {
      maxUsers = +maxUsers;
      if (isNaN(maxUsers))
        errs['maxUsers'] = 'Could not parse into integer';
    }

    // If any errors, we give em back the errors
    if (Object.keys(errs).length)
      res.status(400).json(errs);
    else
      res.redirect('/room/' + rooms.newRoom(name, pub, maxUsers).getId());
  });

  // Rooms are cleaned once everyone has left.

module.exports = router;
