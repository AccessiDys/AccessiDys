/* File: profils.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */



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

  // console.log('create');
  profile.save(function(err) {
    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        profile: profile
      });
    } else {
      // console.log("profil"+ profile._id);
      // res.jsonp(profile);
      res.send(profile);
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
      res.send(profils);
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
          res.send(200, item);
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