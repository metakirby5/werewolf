var express = require('express');
var router = express.Router();
var room = require('./../models/room.js');

// REST API
router.
  route('/').
    get(function(req, res) {
      room.find({}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(200).json(docs ? docs : 'no docs');
      });
    }).
    post(function(req, res) {
      console.log(req.body);
      room.create({id: 'test', name: req.body.name}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(201).json(docs ? docs : 'no docs');
      });
    });
router.
  route('/:id').
    get(function(req, res) {
      room.findOne({id: req.params.id}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(200).json(docs ? docs : 'no docs');
      });
    }).
    post(function(req, res) {
      room.create({id: req.params.id}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(201).json(docs ? docs : 'no docs');
      });
    }).
    put(function(req, res) {
      room.findOneAndUpdate({id: req.params.id}, {id: 'test'}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(201).json(docs ? docs : 'no docs');
      });
    }).
    delete(function(req, res) {
      room.findOneAndRemove({id: req.params.id}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(201).json(docs ? docs : 'no docs');
      });
    });

module.exports = router;
