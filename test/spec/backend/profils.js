/* File: profils.js
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

/*jshint unused: true */
/*exported utils, Profil */
/*jshint unused: false, undef:false */

var utils = require('./utils'),
    request = require('supertest'),
    express = require('express'),
    Profil = require('../../../models/Profil'),
    UserProfil = require('../../../models/UserProfil'),
    ProfilTag = require('../../../models/ProfilTag'),
    User = require('../../../models/User'),
    profilDao = require('../../../api/dao/profils'),
    userProfilDao = require('../../../api/dao/userProfil'),
    userAccountDao = require('../../../api/dao/userAccount'),
    app = express();


describe('Dao:Profil', function () {
    this.timeout(0);


    it('Dao:Profil:createProfile', function (done) {
        app.post('/ajouterProfils', function (req, res) {
            req.body = {
                newProfile: {
                    _id: '52e588423aaec60c2b9eef96',
                    photo: './files/profilImage/profilImage.jpg',
                    nom: 'NomTest',
                    descriptif: 'DescriptifTest',
                    owner: '5325aa33a21f887257ac2995'
                }
            };
            profilDao.createProfile(req, res);
        });
        request(app).post('/ajouterProfils').expect(200, done);
    });

    it('Dao:Profil:ajoutDefaultProfil', function (done) {
        app.post('/ajoutDefaultProfil', function (req, res) {
            req.body = {
                _id: '52e588423aaec60c2b9eef98',
                photo: './files/profilImage/profilImage.jpg',
                nom: 'NomTestDefaut',
                descriptif: 'DescriptifTest',
                owner: '5325aa33a21f887257ac2995'
            };
            profilDao.ajoutDefaultProfil(req, res);
        });
        request(app).post('/ajoutDefaultProfil').expect(200, done);
    });


    it('Dao:Profil:update', function (done) {
        app.post('/updateProfil', function (req, res) {
            req.body = {
                updateProfile: {
                    _id: '52e588423aaec60c2b9eef96',
                    photo: './files/exercice.jpg',
                    nom: 'NomModifié',
                    descriptif: 'DescriptifModifié',
                    owner: '5325aa33a21f887257ac2995'
                }
            };
            profilDao.update(req, res);
        });
        request(app).post('/updateProfil').expect(200, done);
    });

    it('Dao:Profil:chercherProfil', function (done) {
        app.post('/chercherProfil', function (req, res) {
            req.body = {
                searchedProfile: '52e588423aaec60c2b9eef96'
            };
            profilDao.chercherProfil(req, res);
        });
        request(app).post('/chercherProfil').expect(200, done);
    });

    it('Dao:Profil:chercherProfil2', function (done) {
        app = express();
        app.post('/chercherProfil', function (req, res) {
            req.body = {
                searchedProfile: ''
            };
            profilDao.chercherProfil(req, res);
        });
        request(app).post('/chercherProfil').expect(200, done);


    });

    it('Dao:Profil:AllByUser', function (done) {
        app.post('/profilParUser', function (req, res) {
            req.user = {
                _id: '52e51b563fcc3a4549e75600',
                local: {
                    email: 'test@test.com',
                    password: 'hash',
                    nom: '',
                    prenom: '',
                    restoreSecret: 'example secret',
                    secretTime: ''
                }
            };
            profilDao.allByUser(req, res);
        });
        request(app).post('/profilParUser').expect(200, done);
    });

    it('Dao:Profil:getProfilAndUserProfil1', function (done) {
        app.post('/getProfilAndUserProfil', function (req, res) {
            req.body = {
                searchedProfile: '52e588423aaec60c2b9eef96',
                id: '5325aa33a21f887257ac2995'
            };
            profilDao.getProfilAndUserProfil(req, res);
        });
        request(app).post('/getProfilAndUserProfil').expect(200, done);
    });

    it('Dao:Profil:getProfilAndUserProfil2', function (done) {
        app = express();
        app.post('/getProfilAndUserProfil', function (req, res) {
            req.body = {
                searchedProfile: '52e588423aaec60c2b9eef96',
                id: ''
            };
            profilDao.getProfilAndUserProfil(req, res);
        });
        request(app).post('/getProfilAndUserProfil').expect(200, done);
    });

    it('Dao:Profil:delegateProfil', function (done) {
        app.post('/delegateProfil', function (req, res) {
            req.body = {
                idProfil: '52e588423aaec60c2b9eef96',
                idDelegue: '23e51b563fcc3a4549e75688'
            };
            profilDao.delegateProfil(req, res);
        });
        request(app).post('/delegateProfil').expect(200, done);
    });

    it('Dao:Profil:annulerDelegateUserProfil', function (done) {
        app.post('/annulerDelegateUserProfil', function (req, res) {
            req.body = {
                sendedVars: {
                    idProfil: '52e588423aaec60c2b9eef96',
                    idDelegue: '23e51b563fcc3a4549e75688'
                }
            };
            profilDao.annulerDelegateUserProfil(req, res);
        });
        request(app).post('/annulerDelegateUserProfil').expect(200, done);
    });

    it('Dao:userProfil:createUserProfil', function (done) {
        app.post('/ajouterUserProfil', function (req, res) {
            req.body = {
                newActualProfile: {
                    profilID: '52e588423aaec60c2b9eef96',
                    userID: '52e51b563fcc3a4549e75600',
                    favoris: false,
                    actuel: false,
                    default: false,
                    _id: '52e51b563fcc3a4549e75677'
                }
            };
            userProfilDao.createUserProfil(req, res);
        });
        request(app).post('/ajouterUserProfil').expect(200, done);
    });

    it('Dao:Profil:supprimer', function (done) {
        app.post('/deleteProfil', function (req, res) {
            req.body = {
                removeProfile: {
                    profilID: '52e588423aaec60c2b9eef96',
                    userID: '52e51b563fcc3a4549e75600'
                }
            };
            req.user = {
                _id: '52e51b563fcc3a4549e75600',
                local: {
                    email: 'test@test.com',
                    password: 'hash',
                    nom: '',
                    prenom: '',
                    restoreSecret: 'example secret',
                    secretTime: ''
                }
            };
            profilDao.supprimer(req, res);
        });
        request(app).post('/deleteProfil').expect(200, done);
    });

    it('Dao:Profil:profilActuByTokenPre', function (done) {
        app = express();
        app.post('/delegateProfil', function (req, res) {
            req.body = {
                idProfil: '52e588423aaec60c2b9eef96',
                idDelegue: '23e51b563fcc3a4549e75688'
            };
            profilDao.delegateProfil(req, res);
        });
        request(app).post('/delegateProfil').expect(200, done);
    });

    it('Dao:Profil:profilActuByToken', function (done) {
        app.post('/profilActuByToken', function (req, res) {

            req.user = {
                _id: '5325aa33a21f887257ac2995',
                local: {
                    email: 'test@test.com',
                    password: 'hash',
                    nom: '',
                    prenom: '',
                    restoreSecret: 'example secret',
                    secretTime: ''
                }
            };
            profilDao.profilActuByToken(req, res);
        });
        request(app).post('/profilActuByToken').expect(200, done);
    });

    it('Dao:Profil:profilActuByToken2Pre1', function (done) {
        app = express();
        app.post('/createAccount', function (req, res) {
            req.body = {
                _id: '52e51b563fcc3a4549e75888',
                local: {
                    email: 'test@test.com',
                    password: 'hash',
                    nom: '',
                    role: 'user',
                    prenom: '',
                    restoreSecret: 'example secret',
                    secretTime: '3014091213',
                    token: '987654321'
                }
            };

            userAccountDao.create(req, res);
        });
        request(app).post('/createAccount').expect(200, done);
    });

    it('Dao:Profil:profilActuByToken2Pre2', function (done) {
        app = express();
        app.post('/ajouterUserProfil', function (req, res) {
            req.body = {
                newActualProfile: {
                    profilID: '52e588423aaec60c2b9eef96',
                    userID: '52e51b563fcc3a4549e75888',
                    favoris: true,
                    actuel: true,
                    default: true,
                    _id: '52e51b563fcc3a4549eaabbb'
                }
            };
            userProfilDao.createUserProfil(req, res);
        });
        request(app).post('/ajouterUserProfil').expect(200, done);

    });

    it('Dao:Profil:profilActuByToken2', function (done) {
        app = express();
        app.post('/profilActuByToken', function (req, res) {
            req.user = {
                _id: '52e51b563fcc3a4549e75888',
                local: {
                    email: 'test@test.com',
                    password: 'hash',
                    nom: '',
                    role: 'user',
                    prenom: '',
                    restoreSecret: 'example secret',
                    secretTime: '3014091213',
                    token: '987654321'
                }
            };
            profilDao.profilActuByToken(req, res);
        });
        request(app).post('/profilActuByToken').expect(200, done);
    });


    it('Dao:Profil:listeProfilsPre1', function (done) {
        app.post('/addUserProfilFavoris', function (req, res) {
            req.body = {
                newFav: {
                    profilID: '52e588423aaec60c2b9eef98',
                    userID: '5325aa33a21f887257ac2995',
                    favoris: true,
                    actuel: true,
                    default: false,
                    _id: '52e51b563fcc3a4549e75111'
                }
            };
            userProfilDao.addUserProfilFavoris(req, res);
        });
        request(app).post('/addUserProfilFavoris').expect(200, done);
    });

    it('Dao:Profil:listeProfilsPre2', function (done) {
        app = express();
        app.post('/ajoutDefaultProfil', function (req, res) {
            req.body = {
                _id: '52e588423aaec60c2b9eef11',
                photo: './files/profilImage/profilImage.jpg',
                nom: 'defaultProfile',
                descriptif: 'testListProfils',
                owner: ''
            };
            profilDao.ajoutDefaultProfil(req, res);
        });
        request(app).post('/ajoutDefaultProfil').expect(200, done);
    });

    it('Dao:userProfil:listeProfilsPre3', function (done) {
        app = express();

        app.post('/ajouterUserProfil', function (req, res) {
            req.body = {
                newActualProfile: {
                    profilID: '52e588423aaec60c2b9eef11',
                    userID: '5325aa33a21f887257ac2995',
                    favoris: false,
                    actuel: false,
                    default: true,
                    _id: '52e51b563fcc3a4549e11111'
                }
            };
            userProfilDao.createUserProfil(req, res);
        });
        request(app).post('/ajouterUserProfil').expect(200, done);

    });

    it('Dao:userProfil:listeProfilsPre4', function (done) {
        app = express();
        app.post('/delegateUserProfil', function (req, res) {
            req.body = {
                sendedVars: {
                    profilID: '52e588423aaec60c2b9aaa11',
                    userID: '52e51b563fcc3a4549e75888',
                    delegatedID: '5325aa33a21f887257ac2995'
                }
            };
            userProfilDao.delegateUserProfil(req, res);
        });
        request(app).post('/delegateUserProfil').expect(200, done);

    });

    it('Dao:Profil:listeProfils', function (done) {

        app.post('/listeProfils', function (req, res) {
            req.user = {
                _id: '5325aa33a21f887257ac2995',
                local: {
                    email: 'test@test.com',
                    password: 'hash',
                    nom: '',
                    prenom: '',
                    restoreSecret: 'example secret',
                    secretTime: ''
                }
            };
            profilDao.listeProfils(req, res);
        });
        request(app).post('/listeProfils').expect(200, done);


    });


    it('Dao:Profil:existingProfiles', function (done) {
        app.post('/existingProfil', function (req, res) {
            req.body = {
                nom: 'NomModifié',
                owner: '',
                _id: '52e588423aaec60c2b9eef96'
            };
            profilDao.existingProfiles(req, res);
        });
        request(app).post('/existingProfil').expect(200, done);
    });
});