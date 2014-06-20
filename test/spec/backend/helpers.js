/* File: helpers.js
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
/*exported utils */


var utils = require('./utils'),
	request = require('supertest'),
	express = require('express'),
	helpersService = require('../../../api/helpers/helpers'),
	app = express();

describe('Service:helpers', function() {
	this.timeout(0);

	it('Service:helpers:sendMail cas 1', function(done) {
		app.post('/sendMail', function(req, res) {
			req.body = {
				to: 'destinataire@test.com',
				subject: 'example of subject',
				text: 'example of content',
				html: 'example of html',
				doc: ''
			};
			helpersService.sendMail(req, res);
		});
		request(app).post('/sendMail').expect(200, done);
	});

	it('Service:helpers:sendMail cas 2', function(done) {
		app.post('/sendMail', function(req, res) {
			req.body = {
				to: 'destinataire@test.com',
				subject: 'example of subject',
				text: 'example of content',
				html: 'example of html',
				doc: 'idProfil'
			};
			helpersService.sendMail(req, res);
		});
		request(app).post('/sendMail').expect(200, done);
	});

	it('Service:helpers:sendEmail', function(done) {
		app.post('/sendEmail', function(req, res) {
			req.body = {
				emailTo: 'destinataire@test.com',
				subject: 'example of subject',
				content: 'example of content'

			};
			helpersService.sendEmail(req, res);
		});
		request(app).post('/sendEmail').expect(200, done);
	});

});