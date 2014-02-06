/* File: profils.js
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
/*exported utils, Profil */
 
var utils = require('./utils'),
	request = require('supertest'),
	express = require('express'),
	Profil = require('../../../models/Profil'),
	profilDao = require('../../../api/dao/profils'),
	app = express();

describe('Dao:Profil', function() {

	it('Dao:Profil:createProfile', function(done) {
		app.post('/ajouterProfils', function(req, res) {
			req.body = {
				_id: '52e588423aaec60c2b9eef96',
				photo: './files/profilImage/profilImage.jpg',
				nom: 'NomTest',
				type: 'TypeTest',
				descriptif: 'DescriptifTest',
				niveauScolaire: 'NiveauScolaireTest'
			};
			profilDao.createProfile(req, res);
		});
		request(app).post('/ajouterProfils').expect(200, done);
	});


	it('Dao:Profil:update', function(done) {
		app.post('/updateProfil', function(req, res) {
			req.body = {
				_id: '52e588423aaec60c2b9eef96',
				photo: './files/profilImage2.jpg',
				nom: 'NomModifié',
				type: 'TypeModifié',
				descriptif: 'DescriptifModifié',
				niveauScolaire: 'NiveauScolaireModifié'
			};
			profilDao.update(req, res);
		});
		request(app).post('/updateProfil').expect(200, done);
	});

	it('Dao:Profil:All', function(done) {
		app.post('/listerProfil', function(req, res) {
			profilDao.all(req, res);
		});
		request(app).post('/listerProfil').expect(200, done);
	});


	it('Dao:Profil:supprimer', function(done) {
		app.post('/deleteProfil', function(req, res) {
			req.body = {
				_id: ' 52e51b563fcc3a4549e75600'
			};
			profilDao.supprimer(req, res);
		});
		request(app).post('/deleteProfil').expect(200, done);
	});


});