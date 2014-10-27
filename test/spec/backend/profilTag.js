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
	this.timeout(0);

	it('Dao:ProfilTag:createProfilTag', function(done) {
		app.post('/ajouterProfilTag', function(req, res) {
			req.body = {
				profilTags: [{
					_id: '52f2043644a01cd63ba15406',
					profil: '539ad3c7ce0dbcd110efdc74',
					tag: '52e18fb80084242442000001',
					texte: '<p>TestText</p>',
					tagName: 'testTagName',
					police: 'testPolice',
					taille: 'testTaille',
					interligne: 'testInterligne',
					styleValue: 'testStyleValue'
				}],
				profilID: '539ad3c7ce0dbcd110efdc74'
			};
			req.body.profilTags = JSON.stringify(req.body.profilTags);
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

	it('Dao:ProfilTag:saveProfilTag', function(done) {
		app.post('/saveProfilTag', function(req, res) {
			req.body = {
				profilTag: {
					_id: '52f2043644a01cd63ba15406',
					profil: '539ad3c7ce0dbcd110efdc74',
					tag: '52e18fb80084242442000001',
					texte: '<p>TestText</p>',
					tagName: 'testTagName',
					police: 'testPolice',
					taille: 'testTaille',
					interligne: 'testInterligne',
					styleValue: 'testStyleValue'
				}
			};
			profilTagDao.saveProfilTag(req, res);
		});
		request(app).post('/saveProfilTag').expect(200, done);
	});

	it('Dao:ProfilTag:update', function(done) {
		app.post('/modifierProfilTag', function(req, res) {
			req.body = {
				tagsToEdit: [{
					id: '52f2043644a01cd63ba15406',
					profil: '539ad3c7ce0dbcd110efdc74',
					tag: '52e18fb80084242442000001',
					texte: '<p>TestText update</p>',
					tagName: 'testTagName update',
					police: 'testPolice update',
					taille: 'testTaille update',
					interligne: 'testInterligne update',
					styleValue: 'testStyleValue update'
				}]
			};
			req.body.tagsToEdit = JSON.stringify(req.body.tagsToEdit);
			profilTagDao.update(req, res);
		});
		request(app).post('/modifierProfilTag').expect(200, done);
	});

	it('Dao:ProfilTag:supprimer', function(done) {
		app.post('/supprimerProfilTag', function(req, res) {
			req.body = {
				tagsToDelete: [{
					tag: '52c6cde4f6f46c5a5a000004',
					interligne: 'ten',
					label: 'titre',
					police: 'Arial',
					style: '',
					styleValue: 'Bold',
					taille: 'twelve',
					state: 'added',
					spaceSelected: 5,
					spaceCharSelected: 5
				}, {
					tag: '52c6cde4f6f46c5a5a000008',
					interligne: 'ten',
					label: 'titre',
					police: 'Arial',
					style: '',
					styleValue: 'Bold',
					taille: 'twelve',
					state: 'modified',
					spaceSelected: 5,
					spaceCharSelected: 5
				}]
			};
			req.body.tagsToDelete = JSON.stringify(req.body.tagsToDelete);
			profilTagDao.supprimer(req, res);
		});
		request(app).post('/supprimerProfilTag').expect(200, done);
	});

	it('Dao:ProfilTag:chercherProfilsTagParProfil', function(done) {
		app.post('/chercherProfilsTagParProfil', function(req, res) {
			req.body = {
				chercherProfilParDefautFlag: {
					profilID: '539ad3c7ce0dbcd110efdc74'
				}
			};
			profilTagDao.chercherProfilsTagParProfil(req, res);
		});
		request(app).post('/chercherProfilsTagParProfil').expect(200, done);
	});


});