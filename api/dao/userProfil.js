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
  UserProfil = mongoose.model('UserProfil'),
  Profil = mongoose.model('Profil');

var helpers = require('../helpers/helpers.js');
/*jshint loopfunc: true */


exports.createUserProfil = function(req, res) {
  var userProfil = new UserProfil(req.body.newActualProfile);
  UserProfil.findOneAndUpdate({
    userID: userProfil.userID,
    actuel: true
  }, {
    'actuel': false
  }, function(err) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      UserProfil.findOneAndUpdate({
        delegatedID: userProfil.userID,
        actuelDelegate: true
      }, {
        'actuelDelegate': undefined
      }, function(err) {
        if (err) {
          res.send({
            'result': 'error'
          });
        } else {
          UserProfil.findOneAndUpdate({
            userID: userProfil.userID,
            profilID: userProfil.profilID
          }, {
            'actuel': true
          }, function(err, item) {
            if (err) {
              res.send({
                'result': 'error'
              });
            } else {
              if (item) {
                helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'profilID :[' + userProfil.profilID + ']');
                res.send(200, item);
              } else {
                UserProfil.findOneAndUpdate({
                  delegatedID: userProfil.userID,
                  profilID: userProfil.profilID
                }, {
                  'actuelDelegate': true
                }, function(err, item) {
                  if (err) {
                    res.send({
                      'result': 'error'
                    });
                  } else {
                    if (item) {
                      helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'profilID :[' + userProfil.profilID + ']');
                      res.send(200, item);
                    } else {
                      userProfil.favoris = false;
                      userProfil.actuel = true;
                      userProfil.default = true;
                      userProfil.save(function(err) {
                        if (err) {
                          res.send({
                            'result': 'error'
                          });
                        } else {
                          helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'profilID :[' + userProfil.profilID + ']');
                          res.jsonp(200, userProfil);
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
  });
};

// exports.addUserProfil = function(req, res) {
//   var userProfil = new UserProfil(req.body);

//   userProfil.save(function(err) {
//     if (err) {
//       res.send({
//         'result': 'error'
//       });
//     } else {
//       res.jsonp(200, userProfil);
//     }
//   });

// };

// exports.removeUserProfile = function(req, res) {
//   UserProfil.findOneAndRemove({
//     profilID: req.body.removeProfile.profilID,
//     userID: req.body.removeProfile.userID
//   }, function(err, item) {
//     if (err) {
//       res.send({
//         'result': 'error'
//       });
//     } else {
//       helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'profilID :[' + item.profilID + ']');
//       res.jsonp(200);
//     }
//   });

// };

/*Mettre plusieur profils par défaut*/
exports.setDefaultProfile = function(req, res) {

  var userProfil = new UserProfil(req.body.addedDefaultProfile);
  UserProfil.findOne({
    userID: req.body.addedDefaultProfile.userID,
    profilID: req.body.addedDefaultProfile.profilID
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        item.
        default = true;
        item.save(function(err) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'profilID :[' + item.profilID + ']');
            res.jsonp(200, item);
          }
        });

      }

    }
  });

};

/*retirer profils par défaut*/
exports.cancelDefaultProfile = function(req, res) {

  var userProfil = new UserProfil(req.body.cancelFavs);
  UserProfil.findOne({
    userID: req.body.cancelFavs.userID,
    profilID: req.body.cancelFavs.profilID
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        item.
        default = false;
        item.save(function(err) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            if (item) {
              helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'profilID :[' + item._id + ']');
            }
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

exports.chercherProfilsParDefaut = function(req, res) {
  UserProfil.find({
    default: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'profil Count :[' + item.length + ']');
        res.send(item);
      }

    }
  });

};


exports.chercherProfilActuel = function(req, res) {
  // var userProfil = new UserProfil(req.body.getActualProfile);

  UserProfil.findOne({
    userID: req.body.getActualProfile.userID,
    actuel: true
  }, function(err, item) {
    if (err) {
      console.log(err);
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'UserProfilID :[' + item._id + ']');
        res.send(item);
      }

    }
  });

};

exports.defaultByUserProfilId = function(req, res) {
  var result = [];
  var flag = false;
  var k = 0;
  for (var i = req.body.defaultProfileGetter.profilID.length - 1; i >= 0; i--) {

    UserProfil.findOne({
      profilID: req.body.defaultProfileGetter.profilID[i]._id,
      userID: req.body.defaultProfileGetter.userID
    }, function(err, item) {
      if (err) {
        res.send({
          'result': 'error'
        });
      } else {
        if (item) {
          result.push(item);
          k++;

          if (k === req.body.defaultProfileGetter.profilID.length) {
            flag = true;

            helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'UserProfilID :[' + item._id + ']');
            res.send(result);

          }

        }

      }
    });

  }


};

exports.addUserProfilFavoris = function(req, res) {
  var userProfil = new UserProfil(req.body.newFav);
  userProfil.save(function(err) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'New Fav Profile added');
      res.jsonp(200, userProfil);
    }
  });


};

exports.findUserProfilFavoris = function(req, res) {

  UserProfil.findOne({
    profilID: req.body.sendedVars.profilID,
    userID: req.body.sendedVars.userID,
    favoris: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'check if profile existe in the user db');
        res.send(true);
      } else {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'check if profile existe in the user db');
        res.send(false);
      }

    }
  });



};

exports.findUserProfil = function(req, res) {

  UserProfil.findOne({
    profilID: req.body.sendedVars.profilID,
    default: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      // helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'check if profile existe in the user db');
      res.send(item);
    }
  });



};

exports.findUsersProfilsFavoris = function(req, res) {

  UserProfil.findOne({
    profilID: req.body.profilesFavs.profilID,
    userID: req.body.profilesFavs.userID,
    favoris: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Favorite Profile Found' + item._id);
        res.send(item);
      } else {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Favorite Profile Found null');
        res.send(null);
      }

    }
  });



};
exports.findUserProfilsFavoris = function(req, res) {

  UserProfil.find({
    userID: req.user._id,
    favoris: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Number of Favorite Profile Found' + item.length);
        res.send(item);
      } else {
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Number of Favorite Profile Found' + item.length);
        res.send(item);
      }

    }
  });



};

exports.removeUserProfileFavoris = function(req, res) {
  UserProfil.findOne({
    profilID: req.body.favProfile.profilID,
    userID: req.body.favProfile.userID,
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
          helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'removed Favorite User Profile' + item._id);
          res.jsonp(200);
        }
      });
    }
  });

};

exports.delegateUserProfil = function(req, res) {

  UserProfil.findOne({
    profilID: req.body.sendedVars.profilID,
    userID: req.body.sendedVars.userID
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        item.delegatedID = req.body.sendedVars.delegatedID;
        item.delegate = true;
        item.save(function(err) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            Profil.findById(req.body.sendedVars.profilID, function(err, profil) {
              if (err) {
                res.send({
                  'result': 'error'
                });
              } else {
                if (profil) {
                  profil.preDelegated = undefined;
                  profil.delegated = true;
                  profil.save(function(err) {
                    if (err) {
                      res.send({
                        'result': 'error'
                      });
                    } else {
                      res.send(200, item);
                    }
                  });
                }
              }
            });
          }
        });
        //helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'check if profile existe in the user db');
      }
      res.send(200, item);
    }
  });

};

exports.findUserProfilsDelegate = function(req, res) {
  UserProfil.find({
    delegatedID: req.body.idDelegated,
    delegate: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      //helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Number of Favorite Profile Found' + item.length);
      res.send(item);
    }
  });
};

exports.retirerDelegateUserProfil = function(req, res) {
  var userProf = null;
  UserProfil.findOne({
    profilID: req.body.sendedVars.idProfil,
    userID: req.body.sendedVars.idUser,
    delegate: true
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      if (item) {
        userProf = helpers.clone(item);
        item.delegatedID = undefined;
        item.delegate = undefined;
        item.save(function(err) {
          if (err) {
            res.send({
              'result': 'error'
            });
          } else {
            Profil.findById(req.body.sendedVars.idProfil, function(err, profil) {
              if (err) {
                res.send({
                  'result': 'error'
                });
              } else {
                if (profil) {
                  profil.delegated = undefined;
                  profil.save(function(err) {
                    if (err) {
                      res.send({
                        'result': 'error'
                      });
                    } else {
                      res.send(200, userProf);
                    }
                  });
                } else {
                  res.send(200, userProf);
                }
              }
            });
          }
        });
        //helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'check if profile existe in the user db');
      } else {
        res.send(200, userProf);
      }
    }
  });

};

exports.findByUserProfil = function(req, res) {
  UserProfil.findOne({
    userID: req.body.userID,
    profilID: req.body.profilID
  }, function(err, item) {
    if (err) {
      res.send({
        'result': 'error'
      });
    } else {
      //helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Number of Favorite Profile Found' + item.length);
      res.send(item);
    }
  });
};