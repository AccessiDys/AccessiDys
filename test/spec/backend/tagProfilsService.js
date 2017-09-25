/* File: profilsService
 .js
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
    Tag = require('../../../models/Tag'),
    ProfilTag = require('../../../models/ProfilTag'),
    Profil = require('../../../models/Profil'),
    UserProfil = require('../../../models/UserProfil'),
    ProfilTag = require('../../../models/ProfilTag'),
    User = require('../../../models/User'),
    profilDao = require('../../../api/dao/profils'),
    profilService = require('../../../api/services/profils'),
    tagDao = require('../../../api/dao/tag'),
    app = express();

describe('Services:Profils', function () {
    this.timeout(0);

    it('Services:Profils:getCSSProfilPre1', function (done) {
        app = express();
        app.post('/addTag', function (req, res) {
            req.body = {
                tagData: JSON.stringify({
                    tag: {
                        _id: '52e2551694d6f1312355bfff',
                        libelle: 'Tests1',
                        balise: 'div',
                        niveau: 0
                    }
                })

            };
            req.files = {
                uploadedFile: {
                    fieldName: 'uploadedFile',
                    originalFilename: 'cours.png',
                    path: 'files/cours.png',
                    headers: {
                        'content-disposition': 'form-data; name="uploadedFile"; filename="cours.png"',
                        'content-type': 'image/png'
                    }
                }
            };
            tagDao.create(req, res);
        });
        request(app).post('/addTag').expect(200, done);
    });
    it('Services:Profils:getCSSProfilPre2', function (done) {
        app = express();
        app.post('/addTag', function (req, res) {
            req.body = {
                tagData: JSON.stringify({
                    tag: {
                        _id: '52e2551694d6f1312355befe',
                        libelle: 'Tests2',
                        balise: 'p',
                        niveau: 0
                    }
                })

            };
            req.files = {
                uploadedFile: {
                    fieldName: 'uploadedFile',
                    originalFilename: 'cours.png',
                    path: 'files/cours.png',
                    headers: {
                        'content-disposition': 'form-data; name="uploadedFile"; filename="cours.png"',
                        'content-type': 'image/png'
                    }
                }
            };
            tagDao.create(req, res);
        });
        request(app).post('/addTag').expect(200, done);
    });



    it('Services:Profils:getCSSProfil', function (done) {
        app.get('/cssProfil', function (req, res) {
            req.params = {
                id: '52e588423aaec60c2b9eef96'
            };
            profilService.getCSSProfil(req, res);
        });
        request(app).get('/cssProfil').expect(200, done);
    });
});