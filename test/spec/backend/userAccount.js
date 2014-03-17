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

	// it('Dao:userAccount:update', function(done) {
	// 	app.post('/modifierInfosCompte', function(req, res) {
	// 		req.body = {
	// 			_id: '53235864c303897752dd6a30',
	// 			local: {
	// 				email: 'emailTest@test.com',
	// 				nom: 'NomModifié',
	// 				prenom: 'PrénomModifié'
	// 			}
	// 		};
	// 		userAccountDao.update(req, res);
	// 	});
	// 	request(app).post('/modifierInfosCompte').expect(200, done);
	// });

	// it('Dao:userAccount:checkPassword', function(done) {
	// 	app.post('/checkPassword', function(req, res) {
	// 		req.body = {
	// 			_id: '53235864c303897752dd6a30',
	// 			local: {
	// 				password: 'password'

	// 			}
	// 		};
	// 		userAccountDao.checkPassword(req, res);
	 // 	});
	// 	request(app).post('/checkPassword').expect(200, done);
	// });

	 it('Dao :userAccount:supprimer', function(done) {
		app.post('/deleteAccounts', function(req, res) {
			req.body = {
				_id: ' 52e51b563fcc3a4549e75600'
			};
			userAccountDao.supprimer(req, res);
		});
		request(app).post('/deleteAccounts').expect(200, done);
	});

 	// it('Dao:userAccount:modifierPassword', function(done) {
	// 	app.post('/modifierPassword', function(req, res) {
	// 		req.body = {
	// 			local: {
	// 				password: 'password',
	// 				newPassword: 'newPassword'
	// 			}
	// 		};
	// 		userAccountDao.modifierPassword(req, res);
	// 	});
	// 	request(app).post('/modifierPassword').expect(200, done);
	// });


});