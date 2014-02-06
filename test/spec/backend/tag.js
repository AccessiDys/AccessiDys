/* File: tag.js
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
/*exported utils, Tag */

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

	it('Dao:Tag:FindTagById', function(done) {
		app.post('/getTagById', function(req, res) {
			req.body = {
				idTag: tag1._id,
				position: 1
			};
			tagDao.findTagById(req, res);
		});
		request(app).post('/getTagById').expect(200, done);
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