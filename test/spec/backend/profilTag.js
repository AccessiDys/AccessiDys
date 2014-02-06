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

/*jshint unused: true */
/*exported utils, ProfilTag */


var utils = require('./utils'),
	request = require('supertest'),
	express = require('express'),
	ProfilTag = require('../../../models/ProfilTag'),
	profilTagDao = require('../../../api/dao/profilTag'),
	app = express();

describe('Dao:ProfilTag', function() {

	it('Dao:ProfilTag:createProfilTag', function(done) {
		app.post('/ajouterProfilTag', function(req, res) {
			req.body = {
				_id: '52f2043644a01cd63ba15406',
				profil: '52e52e61c94dbc474373ea69',
				tag: '52e18fb80084242442000001',
				texte: '<p>TestText</p>',
				tagName: 'testTagName',
				police: 'testPolice',
				taille: 'testTaille',
				interligne: 'testInterligne',
				styleValue: 'testStyleValue'
			};
			profilTagDao.createProfilTag(req, res);
		});
		request(app).post('/ajouterProfilTag').expect(200, done);
	});

	it('Dao:ProfilTag:findTagsByProfil', function(done) {
		app.post('/chercherTagsParProfil', function(req, res) {
			req.body = {
				_id: '52e52e61c94dbc474373ea68'
			};
			profilTagDao.findTagsByProfil(req, res);
		});
		request(app).post('/chercherTagsParProfil').expect(200, done);
	});

	it('Dao:ProfilTag:update', function(done) {
		app.post('/modifierProfilTag', function(req, res) {
			req.body = {
				profilTag: {
					id: '52f2043644a01cd63ba15406',
					profil: '52e52e61c94dbc474373ea69',
					tag: '52e18fb80084242442000001',
					texte: '<p>TestText update</p>',
					tagName: 'testTagName update',
					police: 'testPolice update',
					taille: 'testTaille update',
					interligne: 'testInterligne update',
					styleValue: 'testStyleValue update'

				}

			};
			profilTagDao.update(req, res);
		});
		request(app).post('/modifierProfilTag').expect(200, done);
	});

	it('Dao:ProfilTag:supprimer', function(done) {
		app.post('/supprimerProfilTag', function(req, res) {
			req.body = {
				profil: ' 52e52e61c94dbc474373ea68',
				tag: '52e18fb80084242442000001',
			};
			profilTagDao.supprimer(req, res);
		});
		request(app).post('/supprimerProfilTag').expect(200, done);
	});



});