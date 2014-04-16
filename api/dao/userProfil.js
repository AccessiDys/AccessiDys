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
/*jshint loopfunc: true */

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

/*Mettre plusieur profils par défaut*/
exports.setDefaultProfile = function(req, res) {

  var userProfil = new UserProfil(req.body);
  UserProfil.findOne({
    userID: req.body.userID,
    profilID: req.body.profilID
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        item.default = true;
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

    }
  });

};

/*retirer profils par défaut*/
exports.cancelDefaultProfile = function(req, res) {

  var userProfil = new UserProfil(req.body);
  UserProfil.findOne({
    userID: req.body.userID,
    profilID: req.body.profilID
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
            res.jsonp(200, item);
          }
        });

      }

    }
  });

};

exports.chercherProfilParDefaut = function(req, res) {
  UserProfil.findOne({
    default: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        res.send(item);
      }

    }
  });

};


exports.chercherProfilActuel = function(req, res) {
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
        res.send(item);
      }

    }
  });

};

exports.defaultByUserProfilId = function(req, res) {
  var result = [];
  var flag = false;
  var k = 0;
  for (var i = req.body.profilID.length - 1; i >= 0; i--) {

    UserProfil.findOne({
      profilID: req.body.profilID[i]._id,
      userID: req.body.userID
    }, function(err, item) {
      if (err) {
        res.send({
          'result': 'error'
        });
      } else {
        if (item) {
          result.push(item);
          k++;

          if (k === req.body.profilID.length) {
            flag = true;

            res.send(result);

          }

        }

      }
    });

  }


};

exports.addUserProfilFavoris = function(req, res) {
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

exports.findUserProfilFavoris = function(req, res) {

  UserProfil.findOne({
    profilID: req.body.profilID,
    userID: req.body.userID,
    favoris: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        res.send(true);
      } else {
        res.send(false);
      }

    }
  });



};

exports.findUsersProfilsFavoris = function(req, res) {

  UserProfil.findOne({
    profilID: req.body.profilID,
    userID: req.body.userID,
    favoris: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        res.send(item);
      } else {
        res.send(null);
      }

    }
  });



};

exports.findUserProfilsFavoris = function(req, res) {

  UserProfil.find({
    userID: req.body.userID,
    favoris: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        res.send(item);
      } else {
        res.send(item);
      }

    }
  });



};

exports.removeUserProfileFavoris = function(req, res) {
  UserProfil.findOne({
    profilID: req.body.profilID,
    userID: req.body.userID,
    favoris: true
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

// exports.listeProfilsParUser = function(req,res) {
//   var listProfil = defaultProfil();

//   listProfil = profilsFavoris();



// };
// exports.defaultProfil = function() {

// };
// exports.profilsFavoris = function() {

// };
// exports.profilsParUser = function() {

// };