/* File: docStructure.js
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
	source: 'test/spec/backend/files/cours.png',
	children: [{
		text: '',
		synthese: '',
		source: 'test/spec/backend/files/cours.png',
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