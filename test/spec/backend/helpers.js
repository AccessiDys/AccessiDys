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
var config = require('../../../env/config.test.json');

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

	it('Service:helpers:Upgrade', function(done) {
		app.post('/checkVersion', function(req, res) {
			req.body = {
				version: '0',
				owner: '123456789',
				url: 'https://dl.dropboxusercontent.com/s/' + config.CATALOGUE_NAME
			};
			req.user = {
				__v: 0,
				_id: '123456789',
				dropbox: {
					accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
					country: 'MA',
					display_name: 'youbi anas',
					emails: 'anasyoubi@gmail.com',
					referral_link: 'https://db.tt/wW61wr2c',
					uid: '264998156'
				},
				local: {
					email: 'anasyoubi@gmail.com',
					nom: 'youbi',
					password: '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
					prenom: 'anas',
					role: 'admin',
					restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
					secretTime: '201431340',
					token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
					tokenTime: 1397469765520
				}
			};
			helpersService.Upgrade(req, res);
		});
		request(app).post('/checkVersion').expect(200, done);
	});
});