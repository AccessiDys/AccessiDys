/* File: tag.js
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
      res.jsonp(200, tags);
    }
  });
};

/**
 * Find Tag by Id
 */
exports.findTagById = function(req, res) {
  Tag.findById(req.body.idTag, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      var tagWithPosition = {
        libelle: item.libelle,
        position: req.body.position
      };
      res.jsonp(200, tagWithPosition);
    }
  });
};