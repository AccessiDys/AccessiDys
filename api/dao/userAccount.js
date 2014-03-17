/* File: userAccount.js
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
  UserAccount = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs');

/* List userAccounts */
exports.all = function(req, res) {
  UserAccount.find({
    'local.role': {
      '$ne': 'admin'
    }
  }).exec(function(err, userAccounts) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.send(userAccounts);
    }
  });
};

/* Delete userAccounts */
exports.supprimer = function(req, res) {
  var userAccount = new UserAccount(req.body);
  UserAccount.findById(userAccount._id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      UserAccount.remove(item, function() {
        res.send({
          'result': 'error'
        });
      });
    }
  });
};

/* Update userAccount infos */

exports.update = function(req, res) {
  var userAccount = new UserAccount(req.body);

  UserAccount.findById(userAccount._id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      item.local.email = userAccount.local.email;
      item.local.nom = userAccount.local.nom;
      item.local.prenom = userAccount.local.prenom;

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

exports.checkPassword = function(req, res) {
  var userAccount = new UserAccount(req.body);

  UserAccount.findById(userAccount._id, function(err, item) {
    if (err) {
      res.send(404, false);
    } else {

      if (bcrypt.compareSync(userAccount.local.password, item.local.password)) {
        res.send(200, true);
      } else {
        res.send(200, false);

      }


    }
  });

}

/* Update user password */

exports.modifierPassword = function(req, res) {
  var userAccount = new UserAccount(req.body);
  var newPassword = req.body.local.newPassword;



  UserAccount.findById(userAccount._id, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {

      item.local.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8));
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