/* File: userProfil.js
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
  UserProfil = mongoose.model('UserProfil');

exports.createUserProfil = function(req, res) {

  var userProfil = new UserProfil(req.body);

  UserProfil.findOne({
    userID: userProfil.userID,
    actuel: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        item.actuel = false;
        item.save(function(err) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            UserProfil.findOne({
              userID: userProfil.userID,
              profilID: userProfil.profilID
            }, function(err, item) {
              if (err) {
                res.send({
                  'result': 'error'
                });
              } else {
                if (item) {
                  item.actuel = true;
                  console.log('item ===>');
                  console.log(item);
                  item.save(function(err) {
                    if (err) {
                      res.send({
                        'result': 'error'
                      });
                    } else {
                      res.send(200, item);
                    }
                  });
                } else {
                  res.send({
                    'result': 'error'
                  });

                }
              }
            });
          }
        });


      } else {

        UserProfil.findOne({
          userID: userProfil.userID,
          profilID: userProfil.profilID
        }, function(err, item) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            if (item) {
              item.actuel = true;
              console.log('item ===>');
              console.log(item);
              item.save(function(err) {
                if (err) {
                  res.send({
                    'result': 'error'
                  });
                } else {
                  res.send(200, item);
                }
              });
            } else {
              res.send({
                'result': 'error'
              });

            }
          }
        });

      }
    }
  });
};


exports.addUserProfil = function(req, res) {
  var userProfil = new UserProfil(req.body);

  userProfil.save(function(err) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      res.jsonp(200, userProfil);
    }
  });

};

exports.removeUserProfile = function(req, res) {
  UserProfil.findOne({
    profilID: req.body.profilID,
    userID: req.body.userID
  }, function(err, item) {
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

exports.setDefaultProfile = function(req, res) {

  var userProfil = new UserProfil(req.body);

  UserProfil.findOne({
    userID: userProfil.userID,
    default: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        item.default = false;
        item.save(function(err) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            UserProfil.findOne({
              userID: userProfil.userID,
              profilID: userProfil.profilID
            }, function(err, item) {
              if (err) {
                res.send({
                  'result': 'error'
                });
              } else {
                if (item) {
                  item.default = true;
                  console.log('item ===>');
                  console.log(item);
                  item.save(function(err) {
                    if (err) {
                      res.send({
                        'result': 'error'
                      });
                    } else {
                      res.send(200, item);
                    }
                  });
                } else {
                  res.send({
                    'result': 'error'
                  });

                }
              }
            });
          }
        });


      } else {

        UserProfil.findOne({
          userID: userProfil.userID,
          profilID: userProfil.profilID
        }, function(err, item) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            if (item) {
              item.default = true;
              console.log('item ===>');
              console.log(item);
              item.save(function(err) {
                if (err) {
                  res.send({
                    'result': 'error'
                  });
                } else {
                  res.send(200, item);
                }
              });
            } else {
              res.send({
                'result': 'error'
              });

            }
          }
        });

      }
    }
  });
};