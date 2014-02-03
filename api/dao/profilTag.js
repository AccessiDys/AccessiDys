'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  ProfilTag = mongoose.model('ProfilTag');



/**
 * Create ProfileTag
 */
exports.createProfilTag = function(req, res) {
  var profilTag = new ProfilTag(req.body);
  // console.log('create');
  profilTag.save(function(err) {
    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        profilTag: profilTag
      });
    } else {
      res.jsonp(profilTag);
    }
  });
};

/**
 * Find profilTag by Profil
 */

exports.findTagsByProfil = function(req, res) {
  ProfilTag.find({
    profil: req.body.idProfil
  }, function(err, tags) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      res.jsonp(200, tags);
    }
  });
};


/**
 * Delete profilTag by ProfilID & TagID
 */

exports.supprimer = function(req, res) {

  var profilTag = new ProfilTag(req.body);

  ProfilTag.findOne({
    profil: profilTag.profil,
    tag: profilTag.tag
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {


      ProfilTag.remove(item, function() {
        res.send({
          'result': 'error'
        });
      });
    }
  });
};


exports.update = function(req, res) {

  // var profilTag = new ProfilTag(req.body);


  ProfilTag.findById(req.body.profilTag.id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      item.texte = req.body.profilTag.texte;
      item.save(function(err) {
        if (err) {
          res.send({
            'result': 'error'
          });
        } else {
          res.jsonp(200, item);
        }
      });
    }
  });
};


