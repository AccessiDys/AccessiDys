/* File: userAccount.js
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
/*exported utils, User */

var utils = require('./utils'),
	request = require('supertest'),
	express = require('express'),
	User = require('../../../models/User'),
	userAccountDao = require('../../../api/dao/userAccount'),
	app = express();

describe('Dao:userAccount', function() {


	it('Dao:userAccount:All', function(done) {
		app.post('/allAccounts', function(req, res) {
			userAccountDao.all(req, res);
		});
		request(app).post('/allAccounts').expect(200, done);
	});

	it('Dao :userAccount:supprimer', function(done) {
		app.post('/deleteAccounts', function(req, res) {
			req.body = {
				_id: ' 52e51b563fcc3a4549e75600'
			};
			userAccountDao.supprimer(req, res);
		});
		request(app).post('/deleteAccounts').expect(200, done);
	});

	it('Dao :userAccount:create', function(done) {
		app.post('/createAccount', function(req, res) {
			req.body = {
				local: {
					email: 'jean@neoxia.com',
					password: 'example password',
					nom: '',
					prenom: '',
					restoreSecret: 'example secret',
					secretTime: ''
				}
			};

			userAccountDao.create(req, res);
		});
		request(app).post('/createAccount').expect(200, done);
	});

	it('Dao:userAccount:restorePassword', function(done) {
		app.post('/restorePassword', function(req, res) {
			req.body = {
				email: 'jean@neoxia.com'
			};
			userAccountDao.restorePassword(req, res);
		});
		request(app).post('/restorePassword').expect(200, done);
	});

	// it('Dao:userAccount:saveNewPassword', function(done) {
	// 	app.post('/saveNewPassword', function(req, res) {
	// 		req.body = {
	// 			password: 'example password',
	// 			secret: 'example secret'
	// 		};
	// 		userAccountDao.saveNewPassword(req, res);
	// 	});
	// 	request(app).post('/saveNewPassword').expect(200, done);
	// });


});