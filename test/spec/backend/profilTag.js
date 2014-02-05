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