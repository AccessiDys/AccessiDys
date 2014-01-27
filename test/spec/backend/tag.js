'use strict';

var utils = require('./utils'),
	request = require('supertest'),
	express = require('express'),
	Tag = require('../../../models/Tag'),
	tagDao = require('../../../api/dao/tag'),
	app = express();


var tag1 = {
	_id: '52e2551694d6f1312355ba9e',
	libelle: 'Exercie'
};

describe('Dao:Tag', function() {

	it('Dao:Tag:Create', function(done) {
		app.post('/addTag', function(req, res) {
			req.body = tag1;
			tagDao.create(req, res);
		});
		request(app).post('/addTag').expect(200, done);
	});

	it('Dao:Tag:Update', function(done) {
		app.post('/updateTag', function(req, res) {
			req.body = {
				_id: tag1._id,
				libelle: 'Cours'
			};
			tagDao.update(req, res);
		});
		request(app).post('/updateTag').expect(200, done);
	});

	it('Dao:Tag:All', function(done) {
		app.post('/readTags', function(req, res) {
			tagDao.all(req, res);
		});
		request(app).post('/readTags').expect(200, done);
	});

	it('Dao:Tag:Remove', function(done) {
		app.post('/deleteTag', function(req, res) {
			req.body = {
				_id: tag1._id
			};
			tagDao.remove(req, res);
		});
		request(app).post('/deleteTag').expect(200, done);
	});
});