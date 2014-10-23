'use strict';

// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// dropBox 
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;

var config = require('./../../env/config.json');
var URL_REQUEST = process.env.URL_REQUEST || config.URL_REQUEST;

var dropbox_type = process.env.DROPBOX_TYPE || config.DROPBOX_TYPE;
var listDocPath = process.env.CATALOGUE_NAME || config.CATALOGUE_NAME;

var DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID || config.DROPBOX_CLIENT_ID; // 'ko5rdy0yozdjizw';
var DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET || config.DROPBOX_CLIENT_SECRET; //'iqct32159hizifd';

// load up the user model
var User = require('../../models/User');

//token generator and secret grainSalt
var jwt = require('jwt-simple');
var secret = 'nownownow';
var md5 = require('MD5');
var helpers = require('../helpers/helpers');
var https = require('https');
var rest = require('restler');
var fs = require('fs');
var path = require('path');

var events = require('events');
var eventEmitter = new events.EventEmitter();

// expose this function to our app using module.exports

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new DropboxOAuth2Strategy({
			clientID: DROPBOX_CLIENT_ID,
			clientSecret: DROPBOX_CLIENT_SECRET,
			callbackURL: URL_REQUEST + '/auth/dropbox/callback',
			passReqToCallback: true
		},

		function(req, accessToken, refreshToken, profile, done) {
			if (req) {
				helpers.journalisation(0, req.user, req._parsedUrl.pathname, '[]');
				var tmp = req.user;
				tmp.dropbox.uid = profile._json.uid;
				tmp.dropbox.display_name = profile._json.display_name;
				tmp.dropbox.emails = profile._json.email;
				tmp.dropbox.country = profile._json.country;
				tmp.dropbox.referral_link = profile._json.referral_link;
				tmp.dropbox.accessToken = accessToken;
				tmp.save(function(err) {
					if (err) throw err;
					helpers.journalisation(1, tmp, req._parsedUrl.pathname, 'ID : [' + tmp._id + '] ' + ' Email : [' + tmp.local.email + ']' + ' dropbox-Email : [' + profile._json.email + '] ');
					return done(null, tmp);
				});
			}
		}));


	passport.use('local-signup', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			nomField: 'nom',
			prenomField: 'prenom',

			passReqToCallback: true // allows us to pass back the entire request to the callback
		},

		function(req, email, password, nom, prenom, done) {

			// asynchronous
			// User.findOne wont fire unless data is sent back
			process.nextTick(function() {

				// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to login already exists
				helpers.journalisation(0, null, req._parsedUrl.pathname, 'Email : [' + email + '] ');
				User.findOne({
					'local.email': email
				}, function(err, user) {
					// if there are any errors, return the error
					if (err) return done(err);

					// check to see if theres already a user with that email
					if (user) {
						// console.log('That email is already taken');
						//var newUser = new User();
						var erreur = {
							message: 'email deja pris',
							email: true
						};
						return done(404, erreur);
						// return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
					} else {

						// if there is no user with that email
						// create the user
						// console.log('creation new user');
						var newUser = new User();
						// set the user's local credentials
						newUser.local.email = email;
						newUser.local.password = md5(password);
						newUser.local.nom = nom;
						newUser.local.prenom = prenom;
						newUser.local.role = 'user';
						var mydate = new Date();

						newUser.local.tokenTime = mydate.getTime() + 43200000;
						var randomString = {
							chaine: Math.random().toString(36).slice(-8)
						};
						newUser.local.token = jwt.encode(randomString, secret);
						// console.log(newUser.local);
						// save the user
						// console.log('going to save in bdd');
						newUser.save(function(err) {
							if (err) {
								throw err;
							} else {
								helpers.journalisation(1, newUser, req._parsedUrl.pathname, 'ID : [' + newUser._id + '] ' + ' Email : [' + newUser.local.email + ']');
								return done(null, newUser);
							}
						});
					}

				});

			});

		}));

	passport.use('local-login', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			nomField: 'nom',
			prenomField: 'prenom',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},

		function(req, email, password, nom, prenom, done) { // callback with email and password from our form

			helpers.journalisation(0, null, req._parsedUrl.pathname, 'email :[' + email + ']' + ' password:[' + password + ']');

			User.findOne({
				'local.email': email
			}, function(err, user) {
				if (!user) {
					return done(404, null);
				}
				if (user.local.password !== password) {
					return done(404, null);
				}

				var mydate = new Date();
				var nowTime = mydate.getTime();
				var generateNewToken = true;
				if (user.local.token && user.local.token !== '') {
					if (parseInt(nowTime) < parseInt(user.local.tokenTime)) {
						generateNewToken = false;
					}
				}
				if (generateNewToken) {
					var randomString = {
						chaine: Math.random().toString(36).slice(-8)
					};
					user.local.token = jwt.encode(randomString, secret);
				}

				user.local.tokenTime = mydate.getTime() + 43200000;

				user.save(function(err) {
					if (err) {
						var item = {
							message: 'il ya un probleme dans la sauvgarde '
						};
						helpers.journalisation(-1, user, req._parsedUrl.pathname, err);
						// res.send(401, item);
					} else {
						helpers.journalisation(1, user, req._parsedUrl.pathname, 'ID : [' + user._id + '] ' + ' Email : [' + user.local.email + ']');
						// res.send(200, user);
					}
				});

				if (user.dropbox && user.dropbox.accessToken) {
					var listDocExist = false;
					var appcacheExist = false;
					https.get('https://api.dropbox.com/1/search/?access_token=' + user.dropbox.accessToken + '&query=.&root=' + dropbox_type, function(res) {
						var chunks = [];
						res.on('data', function(chunk) {
							chunks.push(chunk);
						});
						res.on('end', function() {
							var listDocSearch = new Buffer.concat(chunks).toString('utf-8');
							listDocSearch = JSON.parse(listDocSearch);
							if (listDocSearch.length > 0) {
								console.log('length is > 0 ');
								for (var i = 0; i < listDocSearch.length; i++) {
									if (listDocSearch[i].path.indexOf('listDocument.appcache') > -1) {
										console.log('listDocument appcache exist deja');
										appcacheExist = true;
									}
									if (listDocSearch[i].path.indexOf(listDocPath) > -1) {
										console.log('listDocument appcache exist deja');
										listDocExist = true;
									}
								}
							}
							if (!listDocExist || !appcacheExist) {
								console.log('upload new Version of listDocument.html and listDocument.appcache');
								var filePath = path.join(__dirname, '../../app/listDocument.appcache');
								fs.readFile(filePath, 'utf8', function(err, appcacheFile) {
									rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + 'listDocument.appcache' + '?access_token=' + user.dropbox.accessToken, {
										data: appcacheFile
									}).on('complete', function(data, appcacheResponce) {
										data = JSON.parse(data);
										console.log('appcacheResponce');
										console.log(data);
										https.get('https://api.dropbox.com/1/shares/?access_token=' + user.dropbox.accessToken + '&path=' + data.path + '&root=' + dropbox_type + '&short_url=false', function(res) {
											var chunks = [];
											res.on('data', function(chunk) {
												chunks.push(chunk);
											});
											res.on('end', function() {
												console.log('shareLink');
												var shareLink = JSON.parse(new Buffer.concat(chunks).toString('utf-8'));
												console.log(shareLink);
												shareLink.url = shareLink.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
												shareLink.url = shareLink.url.substring(0, shareLink.url.indexOf('.appcache') + 9);
												console.log(shareLink);
												var filePath = path.join(__dirname, '../../app/index.html');
												fs.readFile(filePath, 'utf8', function(err, newlistDoc) {
													newlistDoc = newlistDoc.replace("var Appversion=''", "var Appversion='" + global.appVersion.version + "'"); // jshint ignore:line
													newlistDoc = newlistDoc.replace('manifest=""', 'manifest="' + shareLink.url + '"');
													newlistDoc = newlistDoc.replace('ownerId = null', 'ownerId = \'' + user._id + '\'');
													rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + listDocPath + '?access_token=' + user.dropbox.accessToken, {
														data: newlistDoc
													}).on('complete', function(data, listDocResponce) {
														req.session.loged = true;
														return done(null, user);
													});
												});
											});
										}).on('error', function() {
											console.log('error getting shareLink for appcache');
										});
									});
								});
							} else {
								console.log('listDocument.html and listDocument.appcache already exists');
								https.get('https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + listDocPath + '?access_token=' + user.dropbox.accessToken, function(res) {
									var chunks = [];
									res.on('data', function(chunk) {
										chunks.push(chunk);
									});
									res.on('end', function() {
										var listDocPage = new Buffer.concat(chunks).toString('utf-8');
										var clientVersion = helpers.getVersion(listDocPage);
										if (!clientVersion.versionExist || global.appVersion.version != clientVersion.version) {
											console.log(clientVersion);
											if (!clientVersion.versionExist) {
												console.log('STOP NO APPVERSION');
												//emit event to upgrade all docs
												var jsonStart = listDocPage.indexOf('var listDocument');
												var jsonEnd = listDocPage.indexOf(']', jsonStart) + 1;
												var jsonString = listDocPage.substring(jsonStart, jsonEnd);

												var objectStart = listDocPage.indexOf('[', jsonStart);
												var objectEnd = jsonEnd;
												var object = listDocPage.substring(objectStart, objectEnd);

												var list = JSON.parse('[' + object + ']');
												console.log('Mise a jour des document suivant :');
												for (var i = 0; i < list[0].length; i++) {
													console.log(list[0][i].lienApercu);
													var data = {
														link: list[0][i].lienApercu,
														path: list[0][i].path,
														accessToken: user.dropbox.accessToken,
														id: user._id
													};
													eventEmitter.emit('upgradeStart', data);

												}

											}
											if (global.appVersion.hard) {
												console.log('starting ----- HARD ----- Update');
												//manifest
												var manifestStart = listDocPage.indexOf('manifest="');
												var manifestEnd = listDocPage.indexOf('.appcache"', manifestStart) + 10;
												var manifestString = listDocPage.substring(manifestStart, manifestEnd);
												//document JSON
												var jsonStart = listDocPage.indexOf('var listDocument');
												var jsonEnd = listDocPage.indexOf(']', jsonStart) + 1;
												var jsonString = listDocPage.substring(jsonStart, jsonEnd);
												https.get('https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + 'listDocument.appcache' + '?access_token=' + user.dropbox.accessToken, function(appcacheRes) {
													var chunks = [];
													appcacheRes.on('data', function(chunk) {
														chunks.push(chunk);
													});
													appcacheRes.on('end', function() {
														var appcacheFile = new Buffer.concat(chunks).toString('utf-8');
														var newVersion = parseInt(appcacheFile.charAt(appcacheFile.indexOf(':v') + 2)) + 1;
														appcacheFile = appcacheFile.replace(':v' + appcacheFile.charAt(appcacheFile.indexOf(':v') + 2), ':v' + newVersion);
														rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + 'listDocument.appcache' + '?access_token=' + user.dropbox.accessToken, {
															data: appcacheFile
														}).on('complete', function(data, appcacheResponce) {
															var filePath = path.join(__dirname, '../../app/index.html');
															fs.readFile(filePath, 'utf8', function(err, newlistDoc) {
																newlistDoc = newlistDoc.replace("var Appversion=''", "var Appversion='" + global.appVersion.version + "'"); // jshint ignore:line
																newlistDoc = newlistDoc.replace('var listDocument= []', jsonString);
																newlistDoc = newlistDoc.replace('manifest=""', manifestString);
																newlistDoc = newlistDoc.replace('ownerId = null', 'ownerId = \'' + user._id + '\'');
																rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + listDocPath + '?access_token=' + user.dropbox.accessToken, {
																	data: newlistDoc
																}).on('complete', function(data, listDocResponce) {
																	helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
																	req.session.loged = true;
																	return done(null, user);
																});
															});
														});

													});
												});
											} else {
												console.log('starting ------ SOFT ------ Update');
												https.get('https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + "listDocument.appcache" + '?access_token=' + user.dropbox.accessToken, function(appcacheRes) {
													var chunks = [];
													appcacheRes.on('data', function(chunk) {
														chunks.push(chunk);
													});
													appcacheRes.on('end', function() {
														var appcacheFile = new Buffer.concat(chunks).toString('utf-8');
														var newVersion = parseInt(appcacheFile.charAt(appcacheFile.indexOf(':v') + 2)) + 1;
														appcacheFile = appcacheFile.replace(':v' + appcacheFile.charAt(appcacheFile.indexOf(':v') + 2), ':v' + newVersion);
														rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + 'listDocument.appcache' + '?access_token=' + user.dropbox.accessToken, {
															data: appcacheFile
														}).on('complete', function(data, appcacheResponce) {
															listDocPage = listDocPage.replace("var Appversion='" + clientVersion.version + "'", "var Appversion='" + global.appVersion.version + "'"); // jshint ignore:line
															rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + listDocPath + '?access_token=' + user.dropbox.accessToken, {
																data: listDocPage
															}).on('complete', function(data, listDocResponce) {
																helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
																req.session.loged = true;
																return done(null, user);
															});
														});

													});
												});
											}
										} else {
											helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
											req.session.loged = true;
											return done(null, user);
										}


									});
								}).on('error', function() {
									helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
									return done(404, null);
								});
							}

						});
					}).on('error', function() {
						helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
						return done(404, null);
					});
				} else {
					req.session.loged = true;
					return done(null, user);
				}
			});
		}));


};

var upgradeStart = function upgradeStart(data) {
	var link = data.link;
	var path = data.path;
	var token = data.accessToken;
	var id = data.id;
	var documentUrlHtml = decodeURIComponent(/(([0-9]+)(-)([0-9]+)(-)([0-9]+)(_+)([A-Za-z0-9_%]*)(.html))/i.exec(encodeURIComponent(data.link))[0]);
	var documentUrlCache = documentUrlHtml.replace('.html', '.appcache');
	console.log('documentUrlHtml ===> ' + documentUrlHtml);
	console.log('documentUrlCache ===> ' + documentUrlCache);

	console.log('event recieved to upgrade ====> ');
	console.log(link);

	https.get('https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + documentUrlHtml + '?access_token=' + token, function(res) {
		var chunks = [];
		res.on('data', function(chunk) {
			console.log('downloading ' + documentUrlHtml);
			chunks.push(chunk);
		});
		res.on('end', function() {
			console.log('finished ' + documentUrlHtml);
			var listDocPage = new Buffer.concat(chunks).toString('utf-8');

			//manifest
			var manifestStart = listDocPage.indexOf('manifest=');
			var manifestEnd = listDocPage.indexOf('.appcache"', manifestStart) + 10;
			var manifestString = listDocPage.substring(manifestStart, manifestEnd);


			if (link.indexOf(listDocPath) > 0) {
				//document JSON
				console.log('only apercu files');
			} else {
				// apercu Blocks
				var blockStart = listDocPage.indexOf('var blocks');
				var blockEnd = listDocPage.indexOf('};', blockStart) + 1;
				var blockString = listDocPage.substring(blockStart, blockEnd);
			}
			https.get('https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + documentUrlCache + '?access_token=' + token, function(appcacheRes) {
				var chunks = [];
				appcacheRes.on('data', function(chunk) {
					chunks.push(chunk);
				});
				appcacheRes.on('end', function() {
					var appcacheFile = new Buffer.concat(chunks).toString('utf-8');
					var newVersion = parseInt(appcacheFile.charAt(appcacheFile.indexOf(':v') + 2)) + 1;
					appcacheFile = appcacheFile.replace(':v' + appcacheFile.charAt(appcacheFile.indexOf(':v') + 2), ':v' + newVersion);
					rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + documentUrlCache + '?access_token=' + token, {
						data: appcacheFile
					}).on('complete', function(data, appcacheResponce) {
						var path = require('path');
						var filePath = path.join(__dirname, '../../app/index.html');
						fs.readFile(filePath, 'utf8', function(err, newlistDoc) {
							if (link.indexOf(listDocPath) > 0) {
								console.log('only apercu files');
							} else {
								newlistDoc = newlistDoc.replace('var blocks = []', blockString);
								newlistDoc = newlistDoc.replace("var Appversion=''", "var Appversion='" + global.appVersion.version + "'"); // jshint ignore:line

								newlistDoc = newlistDoc.replace('manifest=""', manifestString);
								newlistDoc = newlistDoc.replace('ownerId = null', 'ownerId = \'' + id + '\'');
								rest.put('https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + documentUrlHtml + '?access_token=' + token, {
									data: newlistDoc
								}).on('complete', function(data, listDocResponce) {
									// helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
									console.log('====== COMPLETED ====== ' + path);
								});
							}
						});
					});

				});
			});

		});
	});

};

eventEmitter.on('upgradeStart', upgradeStart);