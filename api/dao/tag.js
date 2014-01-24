'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Tag = mongoose.model('Tag');

/**
 * Creer un tag
 */
exports.create = function(req, res) {
  var tag = new Tag(req.body);

  tag.save(function(err) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      console.log('tag crée');
      res.jsonp(200, tag);
    }
  });
};

/**
 * Supprimer un tag
 */
exports.remove = function(req, res) {
  var tag = new Tag(req.body);
  Tag.findById(tag._id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      item.remove(function(err) {
        if (err) {
          res.send({
            'result': 'error'
          });
        } else {
          console.log('tag crée');
          res.jsonp(200);
        }
      });
    }
  });
};

/**
 * Editer un tag
 */
exports.update = function(req, res) {
  var tag = new Tag(req.body);
  Tag.findById(tag._id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      item.libelle = tag.libelle;
      item.save(function(err) {
        if (err) {
          res.send({
            'result': 'error'
          });
        } else {
          console.log('tag mis à jour');
          res.jsonp(200, item);
        }
      });
    }
  });
};

/**
 * Liste des tags
 */
exports.all = function(req, res) {
  Tag.find().exec(function(err, tags) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      console.log('all tags');
      res.jsonp(tags);
    }
  });
};