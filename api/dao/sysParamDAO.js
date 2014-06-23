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
  sysParam = mongoose.model('sysParam');
var helpers = require('../helpers/helpers.js');

/**
 * Creer un tag
 */
exports.create = function(req, res) {
  var newSysParam = new sysParam();
  var mydate = new Date();
  newSysParam.appVersion = req.body.newvaleur;
  newSysParam.dateVersion = mydate.getDate() + '/' + (mydate.getMonth() + 1) + '/' + mydate.getFullYear() + '_' + mydate.getHours() + ':' + mydate.getMinutes() + ':' + mydate.getSeconds();
  newSysParam.save(function(err) {
    if (err) {
      helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
      res.send({
        'result': 'error'
      });
    } else {
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
      res.jsonp(200, newSysParam);
    }
  });
};
/**
 * Editer un tag
 */
exports.update = function(req, res) {

  // var newSysParam = new sysParam();
  var mydate = new Date();
  sysParam.findById(req.body.sysVersionId, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      item.appVersion = req.body.newvaleur;
      item.dateVersion = mydate.getDate() + '/' + (mydate.getMonth() + 1) + '/' + mydate.getFullYear() + '_' + mydate.getHours() + ':' + mydate.getMinutes() + ':' + mydate.getSeconds();
      item.save(function(err) {
        if (err) {
          res.send({
            'result': 'error'
          });
        } else {
          helpers.journalisation(1, req.user, req._parsedUrl.pathname, JSON.stringify(item));
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
  sysParam.find({}, function(err, sysParamList) {
    if (err) {
      helpers.journalisation(-1, req.user, req._parsedUrl.pathname, err);
      res.send({
        'result': 'error'
      });
    } else {
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, sysParamList);
      res.jsonp(200, sysParamList);
    }
  });
};

/**
 * Find Tag by Id
 */
exports.findTagById = function(req, res) {
  sysParam.findById(req.body.sysParamId, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      res.jsonp(200, item);
    }
  });
};