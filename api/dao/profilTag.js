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
var helpers = require('../helpers/helpers.js');


/**
 * Create ProfileTag
 */
exports.createProfilTag = function(req, res) {
  var profilTags = JSON.parse(req.body.profilTags);
  var profilID = req.body.profilID;
  var j = 0;
  profilTags.forEach(function(item) {
    var profilTag = new ProfilTag({
      tag: item.id_tag,
      texte: item.style,
      profil: profilID,
      police: item.police,
      taille: item.taille,
      interligne: item.interligne,
      styleValue: item.styleValue,
      coloration: item.coloration,
      spaceSelected: item.spaceSelected,
      spaceCharSelected: item.spaceCharSelected
    });
    profilTag.save(function(err) {
      if (err) {
        res.jsonp(err);
      } else {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-ProfileTag :[' + profilTag._id + ']');
        j++;
        if (j === profilTags.length) {
          res.jsonp(profilTags);
        }
      }
    }); // jshint ignore:line
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
  var profilTags = JSON.parse(req.body.tagsToDelete);
  var j = 0;
  profilTags.forEach(function(item) {
    var profilTag = new ProfilTag({
      tag: item.tag,
      texte: item.text,
      profil: item.profil,
      police: item.police,
      taille: item.taille,
      interligne: item.interligne,
      styleValue: item.styleValue,
      coloration: item.coloration,
      spaceSelected: item.spaceSelected,
      spaceCharSelected: item.spaceCharSelected
    });
    ProfilTag.findOneAndRemove({
      profil: profilTag.profil,
      tag: profilTag.tag
    }, function(err, itemDelete) {
      if (err) {
        res.jsonp(err);
      } else {
        if (itemDelete) {
          helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-ProfileTag :[]');
        }
        j++;
        if (j === profilTags.length) {
          res.jsonp(200);
        }
      }
    }); // jshint ignore:line
  });
};

exports.update = function(req, res) {
  var profilTags = JSON.parse(req.body.tagsToEdit);
  var j = 0;
  profilTags.forEach(function(item) {
    ProfilTag.findByIdAndUpdate(item.id, {
      'texte': item.style,
      'police': item.police,
      'taille': item.taille,
      'interligne': item.interligne,
      'styleValue': item.styleValue,
      'coloration': item.coloration,
      'spaceSelected': item.spaceSelected,
      'spaceCharSelected': item.spaceCharSelected
    }, function(err, itemEdit) {
      if (err) {
        res.jsonp(err);
      } else {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-ProfileTag :[' + itemEdit._id + ']');
        j++;
        if (j === profilTags.length) {
          res.jsonp(200, itemEdit);
        }
      }
    }); // jshint ignore:line
  });
};

exports.chercherProfilsTagParProfil = function(req, res) {
  ProfilTag.find({
    profil: req.body.chercherProfilParDefautFlag.profilID
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-ProfileTag if undefined =>Not Found :[' + item._id + ']');
      res.jsonp(200, item);
    }
  });
};

exports.saveProfilTag = function(req, res) {
  var profilTag = new ProfilTag(req.body.profileTag);
  profilTag.save(function(err) {
    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        profilTag: profilTag
      });
    } else {
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-ProfileTag :[' + profilTag._id + ']');
      res.jsonp(profilTag);
    }
  });
};

exports.deleteByProfilID = function(req, res) {
  if (req.body.removeProfile.profilID) {
    var profileID = req.body.removeProfile.profilID;
    ProfilTag.remove({
      profil: profileID
    }, function(err, item) {
      if (err) {
        console.log('err');
        helpers.journalisation(-1, req.user, req._parsedUrl.pathname, 'ID-Profile :[' + profileID + ']');
        res.jsonp(500, {
          message: 'somthing went wrong'
        });
      }
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-Profile :[' + profileID + ']');
      console.log(item);
      res.jsonp(200, {
        message: 'all related profileTags Have been deleted'
      });
    });
  } else {
    return res.send({
      errors: 'Not ID sent'
    });
  }
};

/**
 * Find ProfilTag by Profil for CSS Provider
 */
exports.findProfilTagByProfil = function(profilId, callback) {
    ProfilTag.find({
        profil: profilId
    }).exec(function(err, items) {
        callback(err,items);
    });
};


/**
 * Remove all tags and create tags given.
 */
exports.setProfilTags = function(req, res) {
    var profilId = req.body.profilID;
    var profilTags = req.body.profilTags;
    if (profilId) {
        ProfilTag.remove({
            profil: profilId
          }, function(err, item) {
            if (err) {
              console.log('err');
              helpers.journalisation(-1, req.user, req._parsedUrl.pathname, 'ID-Profile :[' + profilId + ']');
              res.jsonp(500, {
                message: 'cant delete profil tags'
              });
            }
            helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-Profile :[' + profilId + ']');
            
            var j = 0;
            if(profilTags.length != 0) {
                profilTags.forEach(function(item) {
                    var profilTag = new ProfilTag({
                      tag: item.id_tag,
                      texte: item.style,
                      profil: profilId,
                      police: item.police,
                      taille: item.taille,
                      interligne: item.interligne,
                      styleValue: item.styleValue,
                      coloration: item.coloration,
                      spaceSelected: item.spaceSelected,
                      spaceCharSelected: item.spaceCharSelected
                    });
                    profilTag.save(function(err) {
                      if (err) {
                        res.jsonp(err);
                      } else {
                        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'ID-ProfileTag :[' + profilTag._id + ']');
                        j++;
                        if (j === profilTags.length) {
                          res.jsonp(200, profilTags);
                        }
                      }
                    });
                });
            } else {
                res.jsonp(200, { message: 'profileTags Have been updated' });
            }
        });
    } else {
        res.jsonp(404, { message: 'profile not found' });
    }
};