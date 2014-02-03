'use strict';

/*jshint unused: true */
/*exported utils, DocStructure */

var utils = require('./utils'),
	request = require('supertest'),
	express = require('express'),
	DocStructure = require('../../../models/DocStructure'),
	docDao = require('../../../api/dao/docStructure'),
	app = express();

var doc1 = [{
	_id: '52eec0e5404abafa1f10a317',
	text: '',
	synthese: '',
	source: './files/cours.png',
	children: [{
		text: '',
		synthese: '',
		source: './files/cours.png',
		children: []
	}]
}];

describe('Dao:DocStructure', function() {

	it('Dao:DocStructure:createDocuments', function(done) {
		app.post('/ajouterDocStructure', function(req, res) {
			req.body = doc1;
			docDao.createDocuments(req, res);
		});
		request(app).post('/ajouterDocStructure').expect(200, done);
	});

	it('Dao:DocStructure:All', function(done) {
		app.post('/getDocuments', function(req, res) {
			docDao.all(req, res);
		});
		request(app).post('/getDocuments').expect(200, done);
	});

	it('Dao:DocStructure:GetDocument', function(done) {
		app.post('/getDocument', function(req, res) {
			req.body = {
				idDoc: doc1._id
			};
			docDao.getDocument(req, res);
		});
		request(app).post('/getDocument').expect(200, done);
	});

});