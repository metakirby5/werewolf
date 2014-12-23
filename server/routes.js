var express = require('express');
var router = express.Router();
var item = require('./models/item.js');

// REST API
router.
  get('/', function(req, res) {
    item.find({}, function(err, docs) {
      if (err) {
        res.status(400).json(err);
        return;
      }
      res.status(200).json(docs ? docs : 'no docs');
    });
  }).
  route('/:name').
    get(function(req, res) {
      item.findOne({name: req.params.name}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(200).json(docs ? docs : 'no docs');
      });
    }).
    post(function(req, res) {
      item.create({name: req.params.name}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(201).json(docs ? docs : 'no docs');
      });
    }).
    put(function(req, res) {
      item.findOneAndUpdate({name: req.params.name}, {name: 'test'}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(201).json(docs ? docs : 'no docs');
      });
    }).
    delete(function(req, res) {
      item.findOneAndRemove({name: req.params.name}, function(err, docs) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.status(201).json(docs ? docs : 'no docs');
      });
    });

module.exports = router;
