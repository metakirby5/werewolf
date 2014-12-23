var express = require('express');
var router = express.Router();

// Client index
router.
  get('/', function(req, res) {
    res.render('index', {
      title: 'Express',
      css: ['index']
    });
  }).
  get('/room/:room', function(req, res) {
    res.render('room', {
      title: 'Werewolf',
      css: ['room'],
      js: ['room'],
      room: req.params.room
    })
  });

module.exports = router;
