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
  UserAccount = mongoose.model('User'),
  mailService = require('../helpers/helpers.js');
var bcrypt = require('bcrypt-nodejs');

var jwt = require('jwt-simple');
var secret = 'nownownow';

var config = require('./../../env/config.json');
var URL_REQUEST = process.env.URL_REQUEST || config.URL_REQUEST;


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

};

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

exports.create = function(req, res) {
  var userAccount = new UserAccount(req.body);

  userAccount.save(function(err) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      res.jsonp(200, userAccount);
    }
  });
};

/* reset password */
exports.restorePassword = function(req, res) {
  if (req.body.email) {
    var email = req.body.email;

    UserAccount.findOne({
      'local.email': email
    }, function(err, user) {
      // if there are any errors, return the error
      if (err) {
        var item = {
          message: 'lemail entre est introuvable'
        };
        res.send(400, item);
      }
      // check to see if theres already a user with that email
      if (user) {
        var mydate = new Date();
        var theyear = mydate.getFullYear();
        var themonth = mydate.getMonth();
        var thetoday = mydate.getDate();
        var thetoHour = mydate.getHours() + 24;

        user.local.secretTime = theyear + '' + themonth + '' + thetoday + '' + thetoHour;
        var randomString = {
          chaine: Math.random().toString(36).slice(-8)
        };
        user.local.restoreSecret = jwt.encode(randomString, secret);
        var result = {
          message: 'le lien est envoyer'
        };
        user.save(function(err) {
          if (err) {
            var item = {
              message: 'il ya un probleme dans la sauvgarde '
            };
            res.send(400, item);

          } else {
            var mailBody = '<h2> pour cree un nouveau mot de passe veuillez cliquer sur le lien suivant</h2><h3><a href="' + URL_REQUEST + '#/passwordHelp?secret=' + user.local.restoreSecret + '">Redifinir le mot de passe</a></h3>';
            mailService.passwordRestoreEmail(user.local.email, 'CNEDAdapt restauration de votre mot de passe', mailBody);
            res.send(200, result);
          }
        });
      }
    });
  }
};

exports.saveNewPassword = function(req, res) {

  var newPassword = req.body.password;
  var secret = req.body.secret;
  UserAccount.findOne({
    'local.restoreSecret': secret
  }, function(err, user) {
    if (err || user === null) {
      var item = {
        message: 'vous etes dans une zone interdite '
      };
      res.send(400, item);
    } else {
      var mydate = new Date();
      var theyear = mydate.getFullYear();
      var themonth = mydate.getMonth();
      var thetoday = mydate.getDate();
      var thetoHour = mydate.getHours();

      var time = theyear + '' + themonth + '' + thetoday + '' + thetoHour;

      if (parseInt(time) < parseInt(user.local.secretTime)) {

        user.local.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8));
        user.local.restoreSecret = '';
        user.local.secretTime = '';

        user.save(function(err) {
          if (err) {
            var item = {
              message: 'il ya un probleme dans la sauvgarde '
            };
            res.send(400, item);
          } else {
            res.send(200, user);
          }
        });
      } else {
        var item2 = {
          message: 'le secret est perime '
        };
        res.send(400, item2);
      }
    }
  });
};