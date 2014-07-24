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
/*jshint unused: true */
/*exported utils, UserProfil */

var utils = require('./utils'),
    request = require('supertest'),
    express = require('express'),
    UserProfil = require('../../../models/UserProfil'),
    Profil = require('../../../models/Profil'),
    userProfilDao = require('../../../api/dao/userProfil'),
    app = express();

describe('Dao:userProfil', function() {

    it('Dao:userProfil:createUserProfil1', function(done) {
        app.post('/ajouterUserProfil1', function(req, res) {
            req.body = {
                newActualProfile: {
                    profilID: '52e51b563fcc3a4549e75600',
                    userID: '5325aa33a21f887257ac2995',
                    favoris: false,
                    actuel: true,
                    default: false,
                    _id: '52e51b563fcc3a4549e75677'
                }
            };
            userProfilDao.createUserProfil(req, res);
        });
        request(app).post('/ajouterUserProfil1').expect(200, done);
    });

    it('Dao:userProfil:setDefaultProfile', function(done) {
        app.post('/setDefaultProfile', function(req, res) {
            req.body = {
                addedDefaultProfile: {
                    profilID: '52e51b563fcc3a4549e75600',
                    userID: '5325aa33a21f887257ac2995'
                }
            };
            userProfilDao.setDefaultProfile(req, res);
        });
        request(app).post('/setDefaultProfile').expect(200, done);
    });

    it('Dao:userProfil:defaultByUserProfilId', function(done) {
        app.post('/defaultByUserProfilId', function(req, res) {
            req.body = {
                defaultProfileGetter: {
                    profilID: [{
                        _id: '52e51b563fcc3a4549e75600'
                    }],
                    userID: '5325aa33a21f887257ac2995'
                }
            };
            userProfilDao.defaultByUserProfilId(req, res);
        });
        request(app).post('/defaultByUserProfilId').expect(200, done);
    });

    it('Dao:userProfil:chercherProfilParDefaut', function(done) {
        app.post('/chercherProfilParDefaut', function(req, res) {
            req.body = {
                default: true
            };
            userProfilDao.chercherProfilParDefaut(req, res);
        });
        request(app).post('/chercherProfilParDefaut').expect(200, done);
    });

    it('Dao:userProfil:chercherProfilsParDefaut', function(done) {
        app.post('/chercherProfilsParDefaut', function(req, res) {
            req.body = {
                default: true
            };
            userProfilDao.chercherProfilsParDefaut(req, res);
        });
        request(app).post('/chercherProfilsParDefaut').expect(200, done);
    });


    it('Dao:userProfil:chercherProfilActuel', function(done) {
        app.post('/chercherProfilActuel', function(req, res) {
            req.body = {
                getActualProfile: {
                    userID: '5325aa33a21f887257ac2995',
                    actuel: true
                }
            };
            userProfilDao.chercherProfilActuel(req, res);
        });
        request(app).post('/chercherProfilActuel').expect(200, done);
    });

    it('Dao:userProfil:addUserProfilFavoris', function(done) {
        app.post('/addUserProfilFavoris', function(req, res) {
            req.body = {
                newFav: {
                    profilID: '52e51b563fcc3a4549e75601',
                    userID: '5325aa33a21f887257ac2996',
                    favoris: true,
                    actuel: true,
                    default: false,
                    _id: '52e51b563fcc3a4549e75678'
                }
            };
            userProfilDao.addUserProfilFavoris(req, res);
        });
        request(app).post('/addUserProfilFavoris').expect(200, done);
    });

    it('Dao:userProfil:findUserProfilFavoris', function(done) {
        app.post('/findUserProfilFavoris', function(req, res) {
            req.body = {
                sendedVars: {
                    profilID: '52e51b563fcc3a4549e75601',
                    userID: '5325aa33a21f887257ac2996'
                }
            };
            userProfilDao.findUserProfilFavoris(req, res);
        });
        request(app).post('/findUserProfilFavoris').expect(200, done);
    });

    it('Dao:userProfil:findUserProfil', function(done) {
        app.post('/findUserProfil', function(req, res) {
            req.body = {
                sendedVars: {
                    profilID: '52e51b563fcc3a4549e75601',
                    userID: '5325aa33a21f887257ac2996',
                    favoris: false,
                    actuel: true,
                    default: false,
                    _id: '52e51b563fcc3a4549e75678'
                }
            };
            userProfilDao.findUserProfil(req, res);
        });
        request(app).post('/findUserProfil').expect(200, done);
    });

    it('Dao:userProfil:findUsersProfilsFavoris', function(done) {
        app.post('/findUsersProfilsFavoris', function(req, res) {
            req.body = {
                profilesFavs: {
                    profilID: '52e51b563fcc3a4549e75601',
                    userID: '5325aa33a21f887257ac2996',
                    favoris: true,
                    actuel: true,
                    default: false,
                    _id: '52e51b563fcc3a4549e75678'
                }
            };
            userProfilDao.findUsersProfilsFavoris(req, res);
        });
        request(app).post('/findUsersProfilsFavoris').expect(200, done);
    });

    it('Dao:userProfil:findUserProfilsFavoris', function(done) {
        app.post('/findUserProfilsFavoris', function(req, res) {
            req.user = {
                _id: '52e51b563fcc3a4549e75678',
                local: {
                    email: 'test@test.com',
                    password: 'hash',
                    nom: '',
                    prenom: '',
                    restoreSecret: 'example secret',
                    secretTime: ''
                }
            };
            userProfilDao.findUserProfilsFavoris(req, res);
        });
        request(app).post('/findUserProfilsFavoris').expect(200, done);
    });

    it('Dao:userProfil:removeUserProfileFavoris', function(done) {
        app.post('/removeUserProfileFavoris', function(req, res) {
            req.body = {
                favProfile: {
                    profilID: '52e51b563fcc3a4549e75601',
                    userID: '5325aa33a21f887257ac2996',
                    favoris: true,
                    actuel: true,
                    default: false,
                    _id: '52e51b563fcc3a4549e75678'
                }
            };
            userProfilDao.removeUserProfileFavoris(req, res);
        });
        request(app).post('/removeUserProfileFavoris').expect(200, done);
    });

    it('Dao:userProfil:cancelDefaultProfile', function(done) {
        app.post('/cancelDefaultProfile', function(req, res) {
            req.body = {
                cancelFavs: {
                    profilID: '52e51b563fcc3a4549e75600',
                    userID: '5325aa33a21f887257ac2995'
                }
            };
            userProfilDao.cancelDefaultProfile(req, res);
        });
        request(app).post('/cancelDefaultProfile').expect(200, done);
    });

    it('Dao:userProfil:createUserProfil1', function(done) {
        app.post('/ajouterUserProfil1', function(req, res) {
            req.body = {
                newActualProfile: {
                    profilID: '52e51b563fcc3a4549e75600',
                    userID: '5325aa33a21f887257ac2995',
                    favoris: false,
                    actuel: true,
                    default: false,
                    _id: '52e51b563fcc3a4549e75677'
                }
            };
            userProfilDao.createUserProfil(req, res);
        });
        request(app).post('/ajouterUserProfil1').expect(200, done);
    });

    it('Dao:userProfil:delegateUserProfil', function(done) {
        app.post('/delegateUserProfil', function(req, res) {
            req.body = {
                sendedVars: {
                    profilID: '52e51b563fcc3a4549e75600',
                    userID: '5325aa33a21f887257ac2995',
                    delegatedID: '3425aa33a779037257ac2156'
                }
            };
            userProfilDao.delegateUserProfil(req, res);
        });
        request(app).post('/delegateUserProfil').expect(200, done);
    });

    it('Dao:userProfil:findUserProfilsDelegate', function(done) {
        app.post('/findUserProfilsDelegate', function(req, res) {
            req.body = {
                idDelegated: '3425aa33a779037257ac2156'
            };
            userProfilDao.findUserProfilsDelegate(req, res);
        });
        request(app).post('/findUserProfilsDelegate').expect(200, done);
    });

    it('Dao:userProfil:retirerDelegateUserProfil', function(done) {
        app.post('/retirerDelegateUserProfil', function(req, res) {
            req.body = {
                sendedVars: {
                    idProfil: '52e51b563fcc3a4549e75600',
                    idUser: '5325aa33a21f887257ac2995'
                }
            };
            userProfilDao.retirerDelegateUserProfil(req, res);
        });
        request(app).post('/retirerDelegateUserProfil').expect(200, done);
    });

    it('Dao:userProfil:findByUserProfil', function(done) {
        app.post('/findByUserProfil', function(req, res) {
            req.body = {
                profilID: '52e51b563fcc3a4549e75600',
                userID: '5325aa33a21f887257ac2995'
            };
            userProfilDao.findByUserProfil(req, res);
        });
        request(app).post('/findByUserProfil').expect(200, done);
    });

    it('Dao:userProfil:createUserProfil2', function(done) {
        app.post('/ajouterUserProfil2', function(req, res) {
            req.body = {
                newActualProfile: {
                    profilID: '53bab05b1370619b0a4151e7',
                    userID: '53bab08d1370619b0a4151e8',
                    favoris: false,
                    actuel: true,
                    default: true,
                    _id: '52e9405b6f86d29e28f930fc'
                }
            };
            userProfilDao.createUserProfil(req, res);
        });
        request(app).post('/ajouterUserProfil2').expect(200, done);
    });

    it('Dao:userProfil:setProfilParDefautActuel', function(done) {
        app.post('/setProfilParDefautActuel', function(req, res) {
            req.body = {
                defaultProfile: {
                    userID: '53bab08d1370619b0a4151e8'
                }
            };
            userProfilDao.setProfilParDefautActuel(req, res);
        });
        request(app).post('/setProfilParDefautActuel').expect(200, done);
    });

    // it('Dao:userProfil:removeUserProfile', function(done) {
    //     app.post('/removeUserProfile', function(req, res) {
    //         req.body = {
    //             removeProfile: {
    //                 profilID: '52e51b563fcc3a4549e75600',
    //                 userID: '5325aa33a21f887257ac2995'
    //             }
    //         };
    //         userProfilDao.removeUserProfile(req, res);
    //     });
    //     request(app).post('/removeUserProfile').expect(200, done);
    // });


});