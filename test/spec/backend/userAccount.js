/* File: userAccount.js
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
/*exported utils, User */

var utils = require('./utils'),
    request = require('supertest'),
    express = require('express'),
    User = require('../../../models/User'),
    userAccountDao = require('../../../api/dao/userAccount'),
    app = express();

var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync('neoxia');

describe('Dao:userAccount', function() {
    this.timeout(0);

    it('Dao:userAccount:All', function(done) {
        app.post('/allAccounts', function(req, res) {
            userAccountDao.all(req, res);
        });
        request(app).post('/allAccounts').expect(200, done);
    });


    it('Dao :userAccount:create', function(done) {
        app.post('/createAccount', function(req, res) {
            req.body = {
                _id: '52e51b563fcc3a4549e75620',
                local: {
                    email: 'test@test.com',
                    password: hash,
                    nom: '',
                    role: 'admin',
                    prenom: '',
                    restoreSecret: 'example secret',
                    secretTime: '3014091213'
                }
            };

            userAccountDao.create(req, res);
        });
        request(app).post('/createAccount').expect(200, done);
    });

    it('Dao :userAccount:checkPasswordToken', function(done) {

        app.post('/checkPasswordToken', function(req, res) {

            req.body = {
                secret: 'example secret'
            };
            req._parsedUrl.pathname = 'pathname';
            req.user = {};

            userAccountDao.checkPasswordToken(req, res);
        });
        request(app).post('/checkPasswordToken').expect(200, done);
    });

    it('Dao :userAccount:findAdmin', function(done) {

        app.post('/findAdmin', function(req, res) {
            userAccountDao.findAdmin(req, res);
        });
        request(app).post('/findAdmin').expect(200, done);
    });

    it('Dao :userAccount:findUserById', function(done) {

        app.post('/findUserById', function(req, res) {
            req.body = {
                idUser: '52e51b563fcc3a4549e75620'
            };
            userAccountDao.findUserById(req, res);
        });
        request(app).post('/findUserById').expect(200, done);
    });

    it('Dao:userAccount:restorePassword', function(done) {
        app.post('/restorePassword', function(req, res) {
            req.body = {
                email: 'test@test.com'
            };
            userAccountDao.restorePassword(req, res);
        });
        request(app).post('/restorePassword').expect(200, done);
    });

    it('Dao:userAccount:update', function(done) {
        app.post('/modifierInfosCompte', function(req, res) {
            req.body = {
                userAccount: {
                    _id: '52e51b563fcc3a4549e75620',
                    local: {
                        email: 'test@test.com',
                        password: hash,
                        nom: '',
                        prenom: '',
                        restoreSecret: 'example secret',
                        secretTime: ''
                    }
                }

            };
            userAccountDao.update(req, res);
        });
        request(app).post('/modifierInfosCompte').expect(200, done);
    });

    it('Dao:userAccount:modifierPassword', function(done) {

        app.post('/modifierPassword', function(req, res) {
            req.body = {
                userPassword: {
                    _id: '52e51b563fcc3a4549e75620',
                    local: {
                        email: 'test@test.com',
                        password: hash,
                        nom: '',
                        prenom: '',
                        restoreSecret: 'example secret',
                        secretTime: '',
                        newPassword: 'test'
                    }
                }
            };

            userAccountDao.modifierPassword(req, res);
        });
        request(app).post('/modifierPassword').expect(200, done);
    });


    it('Dao:userAccount:saveNewPassword', function(done) {
        User.findOne({
            'local.email': 'test@test.com'
        }, function(err, user) {
            if (err) {
                request(app).post('/saveNewPassword').expect(400, done);
            } else {
                app.post('/saveNewPassword', function(req, res) {
                    req.body = {
                        password: 'neoxia',
                        secret: user.local.restoreSecret
                    };
                    userAccountDao.saveNewPassword(req, res);
                });
                request(app).post('/saveNewPassword').expect(200, done);
            }
        });
    });

    it('Dao:userAccount:findUserByEmail', function(done) {
        app.post('/findUserByEmail', function(req, res) {
            req.body = {
                email: 'test@email.com'
            };
            userAccountDao.findUserByEmail(req, res);
        });
        request(app).post('/findUserByEmail').expect(200, done);
    });



    it('Dao :userAccount:supprimer', function(done) {
        app.post('/deleteAccounts', function(req, res) {
            req.body = {
                compte: {
                    _id: '52e51b563fcc3a4549e75620'
                }
            };
            userAccountDao.supprimer(req, res);
        });
        request(app).post('/deleteAccounts').expect(200, done);
    });




});