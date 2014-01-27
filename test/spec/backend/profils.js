'use strict';

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
				photo: './files/profilImage.jpg',
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