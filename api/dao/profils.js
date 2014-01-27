'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Profil = mongoose.model('Profil');
var fs = require('fs');

/**
 * Add a profile
 */
exports.createProfile = function(req, res) {
  var profile = new Profil(req.body);

  var bitmap = fs.readFileSync(profile.photo);
  profile.photo = new Buffer(bitmap).toString('base64');

  console.log('create');
  profile.save(function(err) {
    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        profile: profile
      });
    } else {
      // console.log("profil"+ profile._id);
      res.jsonp(profile);
    }
  });
};

/**
 * List of Profiles
 */
exports.all = function(req, res) {
  Profil.find().exec(function(err, profils) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      // console.log(profils._id);
      res.jsonp(profils);
    }
  });
};

/**
 * Update Profiles
 */

exports.update = function(req, res) {
  var profil = new Profil(req.body);

  Profil.findById(profil._id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      item.photo = profil.photo;
      item.nom = profil.nom;
      item.type = profil.type;
      item.descriptif = profil.descriptif;
      item.niveauScolaire = profil.niveauScolaire;
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


/**
 * Delete Profiles
 */

exports.supprimer = function(req, res) {
  var profil = new Profil(req.body);
  Profil.findById(profil._id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      Profil.remove(item, function() {
        res.send({
          'result': 'error'
        });
      });
    }
  });
};