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

var jwt = require('jwt-simple');
var secret = 'nownownow';

var config = require('../../env/config.json');
var URL_REQUEST = process.env.URL_REQUEST || config.URL_REQUEST;

var helpers = require('../helpers/helpers.js');

/* List userAccounts */
exports.all = function (req, res) {
  UserAccount.find({
    'local.role': {
      '$ne': 'admin'
    }
  }).exec(function (err, userAccounts) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'all users sent');
      res.send(userAccounts);
    }
  });
};

/* Delete userAccounts */
exports.supprimer = function (req, res) {
  var userAccount = new UserAccount(req.body.compte);
  UserAccount.findById(userAccount._id, function (err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      UserAccount.remove(item, function () {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-UserAccount :[' + item._id + ']');
        res.send({
          'result': 'success deleting'
        });
      });
    }
  });
};

/* Update userAccount infos */

exports.update = function (req, res) {
  var userAccount = new UserAccount(req.body.userAccount);

  UserAccount.findById(userAccount._id, function (err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      item.local.email = userAccount.local.email;
      item.local.nom = userAccount.local.nom;
      item.local.prenom = userAccount.local.prenom;

      item.save(function (err) {
        if (err) {
          res.send({
            'result': 'error'
          });
        } else {
          helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-UserAccount :[' + item._id + ']');
          res.send(200, item);
        }
      });
    }
  });
};

/* Update user password */
exports.modifierPassword = function (req, res) {
  var userAccount = new UserAccount(req.body.userPassword);
  var newPassword = req.body.userPassword.local.newPassword;

  UserAccount.findById(userAccount._id, function (err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      console.log('userPassword.local.password', req.body.userPassword.local.password);
      console.log('item.local.password', item.local.password);
      if (req.body.userPassword.local.password === item.local.password) {
        item.local.password = newPassword;
        item.save(function (err) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-UserAccount :[' + item._id + ']');
            res.send(200, true);
          }
        });
      } else {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-UserAccount :[Password Not Matching]');
        res.send(200, false);
      }
    }
  });
};

exports.create = function (req, res) {
  var userAccount = new UserAccount(req.body);

  userAccount.save(function (err) {
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
exports.restorePassword = function (req, res) {
  if (req.body.email) {
    var email = req.body.email;

    UserAccount.findOne({
      'local.email': email
    }, function (err, user) {
      // if there are any errors, return the error
      if (err || !user) {
        var item = {
          message: 'l\'email saisi est introuvable'
        };
        res.send(401, item);
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
          message: 'le lien est envoyé'
        };
        user.save(function (err) {
          if (err) {
            var item = {
              message: 'il ya un probleme dans la sauvgarde '
            };
            res.send(401, item);

          } else {
            var objetMail = 'Réinitialisation du mot de passe CnedAdapt';
            var mailBody = '<h4>Bonjour,</h4><p>Nous avons reçu une demande de modification du mot de passe de votre compte CnedAdapt. Si vous êtes bien à l\'origine de cette demande, vous pouvez définir un nouveau mot de passe à travers le lien : <a href="' + URL_REQUEST + '#/passwordHelp?secret=' + user.local.restoreSecret + '">Réinitialiser le mot de passe</a></p><br><p>Si vous ne souhaitez pas modifier votre mot de passe ou si vous n\'êtes pas à l\'origine de cette demande, veuillez simplement ignorer ce message et le supprimer.</p><p>Pour ne pas compromettre la sécurité de votre compte, veuillez ne pas transférer cet e-mail.</p><p>Merci,</p><p>CnedAdapt.</p>';
            mailService.passwordRestoreEmail(user.local.email, objetMail, mailBody);
            res.send(200, result);
          }
        });
      }
    });
  }
};

exports.saveNewPassword = function (req, res) {
  var newPassword = req.body.password;
  var secret = req.body.secret;

  helpers.journalisation(0, req.user, req._parsedUrl.pathname, 'UserAccount :[preparing to saveNewPassword]');

  UserAccount.findOne({
    'local.restoreSecret': secret
  }, function (err, user) {
    if (err || user === null) {
      var item = {
        message: 'vous etes dans une zone interdite '
      };
      res.send(401, item);
    } else {
      var mydate = new Date();
      var theyear = mydate.getFullYear();
      var themonth = mydate.getMonth();
      var thetoday = mydate.getDate();
      var thetoHour = mydate.getHours();

      var time = theyear + '' + themonth + '' + thetoday + '' + thetoHour;

      if (parseInt(time) < parseInt(user.local.secretTime)) {

        user.local.password = newPassword;
        user.local.restoreSecret = '';
        user.local.secretTime = '';

        user.save(function (err) {
          if (err) {
            var item = {
              message: 'il ya un probleme dans la sauvgarde '
            };
            res.send(401, item);
          } else {
            helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'UserAccount :[NewPassword saved]' + '[' + user._id + ']');
            res.send(200, user);
          }
        });
      } else {
        var item2 = {
          message: 'le secret est perime '
        };
        res.send(401, item2);
      }
    }
  });
};

exports.checkPasswordToken = function (req, res) {
  var secret = req.body.secret;
  helpers.journalisation(0, req.user, req._parsedUrl.pathname, 'UserAccount :cheking password restore Token' + '[' + secret + ']');
  var responceMessage = {};
  UserAccount.findOne({
    'local.restoreSecret': secret
  }, function (err, user) {
    if (err || user === null) {
      responceMessage = {
        message: 'le secret est perime '
      };
      res.send(401, responceMessage);
    } else {

      var mydate = new Date();
      var theyear = mydate.getFullYear();
      var themonth = mydate.getMonth();
      var thetoday = mydate.getDate();
      var thetoHour = mydate.getHours();

      var time = theyear + '' + themonth + '' + thetoday + '' + thetoHour;

      if (parseInt(time) < parseInt(user.local.secretTime)) {

        responceMessage = {
          message: 'le token est toujours valide '
        };
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'UserAccount :valid password restore Token' + '[' + secret + ']');
        res.send(200, responceMessage);

      } else {
        responceMessage = {
          message: 'le token est perime'
        };
        res.send(401, responceMessage);
      }
    }
  });
};

exports.findAdmin = function (req, res) {
  UserAccount.findOne({
    'local.role': 'admin'
  }).exec(function (err, item) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      if (item) {
        res.send(item);

      }
    }
  });

};

/**
 * Find User by Id
 */
exports.findUserById = function (req, res) {
  UserAccount.findById(req.body.idUser, function (err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      res.jsonp(200, item);
    }
  });
};

/**
 * Find User by Email
 */
exports.findUserByEmail = function (req, res) {
  UserAccount.findOne({
    'local.email': req.body.email
  }, function (err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      res.send(200, item);
    }
  });
};


exports.setAuthorisations = function (req, res) {

  var newAuthorisations = req.body.authorisations;

  //var userAccount = new UserAccount(req.body.compte);
  console.log(req.body.compte);
  UserAccount.findById(req.body.compte, function (err, currentUser) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {

      if(currentUser.local.authorisations){
        currentUser.local.authorisations.ocr = newAuthorisations.ocr;
        currentUser.local.authorisations.audio = newAuthorisations.audio;
      }else{
        currentUser.local.authorisations = {
          ocr:newAuthorisations.ocr,
          audio:newAuthorisations.audio
        }
      }

      currentUser.save(function (err) {
        if (err) {
          var item = {
            message: 'une erreur c\'est produite'
          };
          res.send(401, item);
        } else {
          helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'UserAccount :[NewAuthorisations saved]' + '[' + req.user._id + ']');
          res.send(200, currentUser);
        }
      });
    }
  });
};
