var express = require('express');
var router = express.Router();

// Client index
router.
  get('/', function(req, res) {
    res.render('index', {
      title: 'Express',
      css: ['index']
    });
  });

module.exports = router;
