/* File: profilTag.js
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

  var profilTag = new ProfilTag(req.body.profilTag);


  ProfilTag.findById(req.body.profilTag.id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {

      item.texte = profilTag.texte;
      item.police = profilTag.police;
      item.taille = profilTag.taille;
      item.interligne = profilTag.interligne;
      item.styleValue = profilTag.styleValue;
      item.coloration = profilTag.coloration;
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