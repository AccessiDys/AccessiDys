/* File: tag.js
 *
 * Copyright (c) 2013-2016
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
var helpers = require('../helpers/helpers.js');
var fs = require('fs');

/**
 * Create a tag
 */
exports.create = function(req, res) {
  var tagData = JSON.parse(req.body.tagData);
  var tag = new Tag(tagData.tag);

  if (req.files.uploadedFile) {
    var fileReaded = fs.readFileSync(req.files.uploadedFile.path);
    tag.picto = 'data:' + req.files.uploadedFile.type + ';base64,' + new Buffer(fileReaded).toString('base64');
  }

  tag.save(function(err) {
    if (err) {
      helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
      res.send({
        'result': 'error'
      });
    } else {
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
      res.status(200).jsonp(tag);
    }
  });
};

/**
 * Delete a Tag
 */
exports.remove = function(req, res) {
  var tag = new Tag(req.body.deleteTag);
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
          helpers.journalisation(1, req.user, req._parsedUrl.pathname, {});
          res.status(200);
        }
      });
    }
  });
};

/**
 * Update a tag with attributes:
 * the title,the level,position,picto
 */
exports.update = function(req, res) {
  var tagData = JSON.parse(req.body.tagData);
  var tag = new Tag(tagData.tag);

  if (req.files.uploadedFile) {
    var fileReaded = fs.readFileSync(req.files.uploadedFile.path);
    tag.picto = 'data:' + req.files.uploadedFile.type + ';base64,' + new Buffer(fileReaded).toString('base64');
  }

  Tag.findById(tag._id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      item.libelle = tag.libelle;
      item.niveau = tag.niveau;
      item.position = tag.position;
      item.balise = tag.balise;
      if (tag.picto) {
        item.picto = tag.picto;
      }
      item.save(function(err) {
        if (err) {
          res.send({
            'result': 'error'
          });
        } else {
          helpers.journalisation(1, req.user, req._parsedUrl.pathname, {});
          res.status(200).jsonp(item);
        }
      });
    }
  });
};

/**
 * return tags list
 */
exports.all = function(req, res) {
  Tag.find().sort({
    'position': 1
  }).exec(function(err, tags) {
    if (err) {
      helpers.journalisation(-1, req.user, req._parsedUrl.pathname, err);
      res.send({
        'result': 'error'
      });
    } else {
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'liste des tags');
      res.status(200).jsonp(tags);
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
            res.status(200).jsonp(tagWithPosition);
        }
    });
};

/**
 * Find all Tags for CSS Provider
 */
exports.findAllTags = function(callback) {
    Tag.find().sort({
        'position': 1
    }).exec(function(err, tags) {
        callback(err,tags);
    });
};