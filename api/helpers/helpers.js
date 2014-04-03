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

var config = require('./../../env/config.json');
var URL_REQUEST = process.env.URL_REQUEST || config.URL_REQUEST;

// Getting Extension of Files
exports.getFileExtension = function(filename) {
	var path = require('path');
	return path.extname(filename);
};

exports.sendMail = function(req, res) {
	var nodemailer = require("nodemailer");
	var sentMailInfos = req.body;
	// create reusable transport method (opens pool of SMTP connections)
	var smtpTransport = nodemailer.createTransport("SMTP", {
		host: process.env.EMAIL_HOST || config.EMAIL_HOST, // hostname
		secureConnection: true, // use SSL
		port: 465, // port for secure SMTP
		auth: {
			user: process.env.EMAIL_HOST_UID || config.EMAIL_HOST_UID,
			pass: process.env.EMAIL_HOST_PWD || config.EMAIL_HOST_PWD
		}
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: process.env.EMAIL_HOST_UID || config.EMAIL_HOST_UID,
		to: sentMailInfos.to,
		subject: 'Adaptdoc a partagé un lien',
		text: sentMailInfos.content,
		html: sentMailInfos.encoded
	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
			res.send(response);
		}

		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	});
};