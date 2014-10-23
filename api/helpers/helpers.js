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

var config = require('../../env/config.json');


var nodemailer = require('nodemailer');
var https = require('https');
var rest = require('restler');

var dropbox_type = config.DROPBOX_TYPE;
var listDocPath = config.CATALOGUE_NAME;

exports.journalisation = function(status, user, message, param) {
	var statusMessage = '';
	switch (status) {
		case 0:
			statusMessage = 'BEGIN';
			break;
		case 1:
			statusMessage = 'END';
			break;
		case -1:
			statusMessage = 'END:ERROR';
			break;
		default:
			statusMessage = 'END:ERROR';
	}
	var msg = '[' + statusMessage + ']';
	if (user && user !== '' && user._id && user.local.nom && user.local.prenom) {
		msg = msg + ' UtilisateurId : [' + user._id + '] ' + ' Utilisateur Nom : [' + user.local.nom + '] ' + ' Utilisateur Prenom : [' + user.local.prenom + '] ';
	} else {
		msg = msg + ' UtilisateurId : ' + 'GUEST';
	}

	msg = msg + ' | service :[' + message + '] | parametre :[' + param + ']';
	console.log(msg);

};

exports.sendMail = function(req, res) {
	var nodemailer = require('nodemailer');
	var sentMailInfos = req.body;
	// create reusable transport method (opens pool of SMTP connections)
	console.log('EMAIL_HOST_UID : ' + config.EMAIL_HOST_UID);
	console.log('EMAIL_HOST_PWD : ' + config.EMAIL_HOST_PWD);
	var smtpTransport = nodemailer.createTransport('SMTP', {
		host: config.EMAIL_HOST, // hostname
		secureConnection: true, // use SSL
		port: 465, // port for secure SMTP
		auth: {
			user: config.EMAIL_HOST_UID,
			pass: config.EMAIL_HOST_PWD
		}
	});

	// setup e-mail data with unicode symbols
	if (sentMailInfos.doc.indexOf('idProfil') !== -1) {
		var mailOptions = {
			from: config.EMAIL_HOST_UID,
			to: sentMailInfos.to,
			subject: sentMailInfos.fullName + ' vient de partager avec vous un profil sur l\'application CnedAdapt. ',
			text: sentMailInfos.prenom + ' ' + sentMailInfos.content,
			html: sentMailInfos.prenom + ' ' + sentMailInfos.encoded
		};
	} else {
		var mailOptions = {
			from: config.EMAIL_HOST_UID,
			to: sentMailInfos.to,
			subject: sentMailInfos.fullName + ' a partagé ' + sentMailInfos.doc + ' avec vous',
			text: sentMailInfos.prenom + ' ' + sentMailInfos.content,
			html: sentMailInfos.prenom + ' ' + sentMailInfos.encoded
		};
	}


	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			throw error;
		} else {
			res.send(response);
		}

		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	});
};
exports.passwordRestoreEmail = function(emailTo, subject, content) {

	//configuration du maile
	var smtpTransport = nodemailer.createTransport('SMTP', {
		host: config.EMAIL_HOST, // hostname
		secureConnection: true, // use SSL
		port: 465, // port for secure SMTP
		auth: {
			user: config.EMAIL_HOST_UID,
			pass: config.EMAIL_HOST_PWD
		}
	});

	var mailOptions = {
		from: config.EMAIL_HOST_UID,
		to: emailTo,
		subject: subject,
		text: '',
		html: content
	};
	smtpTransport.sendMail(mailOptions, function(error) {
		if (error) {
			return false;
		} else {
			return true;
		}
	});
};

exports.sendEmail = function(req, res) {

	//configuration du maile
	var smtpTransport = nodemailer.createTransport('SMTP', {
		host: config.EMAIL_HOST, // hostname
		secureConnection: true, // use SSL
		port: 465, // port for secure SMTP
		auth: {
			user: config.EMAIL_HOST_UID,
			pass: config.EMAIL_HOST_PWD
		}
	});

	var emailTo = req.body.emailTo;
	var subject = req.body.subject;
	var content = req.body.content;

	console.log('emailTo ===>');
	console.log(emailTo);

	var mailOptions = {
		from: config.EMAIL_HOST_UID,
		to: emailTo,
		subject: subject,
		text: '',
		html: content
	};
	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			throw error;
		} else {
			res.send(response);
		}
	});
};

exports.clone = function(a) {
	return JSON.parse(JSON.stringify(a));
};

exports.getVersion = function(str) {
	if (str.indexOf('Appversion=') > -1) {
		var theStart = str.indexOf('Appversion=');
		var theEnd = str.indexOf("';", theStart) + 1; // jshint ignore:line
		var extracted = str.substring(theStart, theEnd);
		console.log('appVersion =====> ' + extracted);
		console.log(extracted.match(/\d+/));
		if (extracted.match(/\d+/)) {
			return {
				versionExist: true,
				version: parseInt(extracted.match(/\d+/)[0]),
				upgradeType: 1,
			};
		} else {
			return {
				versionExist: false
			};
		}
	} else {
		return {
			versionExist: false
		};
	}
};

exports.Upgrade = function(req, response) {
	var args = req.body;
	var documentUrlHtml;
	var documentUrlCache;
	console.log(args.version);
	console.log(global.appVersion.version);
	console.log(args.owner);
	console.log(req.user._id);
	if (args.version != global.appVersion.version) {
		if (args.url.indexOf('dl.dropboxusercontent.com') > -1 && args.owner == req.user._id) {

			if (args.url.indexOf(listDocPath) > 0) {
				//document JSON
				documentUrlHtml = listDocPath;
				documentUrlCache = 'listDocument.appcache';
			} else {
				// apercu Blocks
				documentUrlHtml = decodeURIComponent(/(([0-9]+)(-)([0-9]+)(-)([0-9]+)(_+)([A-Za-z0-9_%]*)(.html))/i.exec(encodeURIComponent(args.url))[0]);
				documentUrlCache = documentUrlHtml.replace('.html', '.appcache');
			}
			https.get('https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + documentUrlHtml + '?access_token=' + req.user.dropbox.accessToken, function(res) {
				var chunks = [];
				res.on('data', function(chunk) {
					chunks.push(chunk);
				});
				res.on('end', function() {
					var listDocPage = new Buffer.concat(chunks).toString('utf-8');
					var clientVersion = args.version;
					if (global.appVersion.hard) {
						//manifest
						var manifestStart = listDocPage.indexOf('manifest=');
						var manifestEnd = listDocPage.indexOf('.appcache"', manifestStart) + 10;
						var manifestString = listDocPage.substring(manifestStart, manifestEnd);


						if (args.url.indexOf(listDocPath) > 0) {
							//document JSON
							var jsonStart = listDocPage.indexOf('var listDocument');
							var jsonEnd = listDocPage.indexOf(']', jsonStart) + 1;
							var jsonString = listDocPage.substring(jsonStart, jsonEnd);
						} else {
							// apercu Blocks
							var blockStart = listDocPage.indexOf('var blocks');
							var blockEnd = listDocPage.indexOf('};', blockStart) + 1;
							var blockString = listDocPage.substring(blockStart, blockEnd);
						}
						https.get('https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + documentUrlCache + '?access_token=' + req.user.dropbox.accessToken, function(appcacheRes) {
							var chunks = [];
							appcacheRes.on('data', function(chunk) {
								chunks.push(chunk);
							});
							appcacheRes.on('end', function() {
								var appcacheFile = new Buffer.concat(chunks).toString('utf-8');
								var newVersion = parseInt(appcacheFile.charAt(appcacheFile.indexOf(':v') + 2)) + 1;
								appcacheFile = appcacheFile.replace(':v' + appcacheFile.charAt(appcacheFile.indexOf(':v') + 2), ':v' + newVersion);
								rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + documentUrlCache + '?access_token=' + req.user.dropbox.accessToken, {
									data: appcacheFile
								}).on('complete', function(data, appcacheResponce) {
									var fs = require('fs');
									var path = require('path');
									var filePath = path.join(__dirname, '../../app/index.html');
									fs.readFile(filePath, 'utf8', function(err, newlistDoc) {
										if (args.url.indexOf(listDocPath) > 0) {
											console.log('-------------------------------> 1');
											newlistDoc = newlistDoc.replace('var listDocument= []', jsonString);
										} else {
											console.log('--------------------------------> 2');
											newlistDoc = newlistDoc.replace('var blocks = []', blockString);
										}
										newlistDoc = newlistDoc.replace("var Appversion=''", "var Appversion='" + global.appVersion.version + "'"); // jshint ignore:line

										newlistDoc = newlistDoc.replace('manifest=""', manifestString);
										newlistDoc = newlistDoc.replace('ownerId = null', 'ownerId = \'' + req.user._id + '\'');
										rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + documentUrlHtml + '?access_token=' + req.user.dropbox.accessToken, {
											data: newlistDoc
										}).on('complete', function(data, listDocResponce) {
											// helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
											response.jsonp(200, {
												update: 1
											});
										});
									});
								});

							});
						});
					} else {
						https.get('https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + documentUrlCache + '?access_token=' + req.user.dropbox.accessToken, function(appcacheRes) {
							var chunks = [];
							appcacheRes.on('data', function(chunk) {
								chunks.push(chunk);
							});
							appcacheRes.on('end', function() {
								var appcacheFile = new Buffer.concat(chunks).toString('utf-8');
								var newVersion = parseInt(appcacheFile.charAt(appcacheFile.indexOf(':v') + 2)) + 1;
								appcacheFile = appcacheFile.replace(':v' + appcacheFile.charAt(appcacheFile.indexOf(':v') + 2), ':v' + newVersion);
								rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + documentUrlCache + '?access_token=' + req.user.dropbox.accessToken, {
									data: appcacheFile
								}).on('complete', function(data, appcacheResponce) {
									listDocPage = listDocPage.replace("var Appversion='" + args.version + "'", "var Appversion='" + global.appVersion.version + "'"); // jshint ignore:line
									rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + documentUrlHtml + '?access_token=' + req.user.dropbox.accessToken, {
										data: listDocPage
									}).on('complete', function(data, listDocResponce) {
										// helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
										response.jsonp(200, {
											update: 1
										});
									});
								});

							});
						});
					}
				});
			});


		} else {
			response.json(200, {
				update: -1
			});
		}
	} else {
		response.json(200, {
			update: 0
		});
	}
};