var express = require('express');
var router = express.Router();

router.
  route('/').
    get(function(req, res) {
    }).
    post(function(req, res) {
      console.log(req.body.name);
      //room.create({id: 'test', name: req.body.name}, function(err, docs) {
      //  if (err) {
      //    res.status(400).json(err);
      //    return;
      //  }
      //  res.status(201).json(docs ? docs : 'no docs');
      //});
    });
router.
  route('/:id').
    get(function(req, res) {
    });

module.exports = router;
