/* File: app.js
 *
 * Copyright (c) 2014
 * Centre National d'Enseignement � Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
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

var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	domain = require('domain'),
	fs = require('fs'),
	http = require('http'),
	https = require('https');

var passport = require('passport');

/* default environment */
var config = require('./env/config.json');

var env = process.env.NODE_ENV || config.NODE_ENV;
var mongo_uri = process.env.MONGO_URI || config.MONGO_URI;
var mongo_db = process.env.MONGO_DB || config.MONGO_DB;
var db = mongoose.connect('mongodb://' + mongo_uri + '/' + mongo_db);

require('./api/services/passport')(passport); // pass passport for configuration

/* Fonctions de Log Console */
var log4js = require('log4js');
log4js.configure({
	appenders: [{
		type: 'console'
	}, {
		type: 'file',
		filename: '../adaptation.log',
		category: ['console', 'file']
	}],
	replaceConsole: true
});

var logger = log4js.getLogger('adaptation');
logger.setLevel('ERROR');

app.configure(function() {
	app.use(express.cookieParser()); // read cookies (needed for auth)

	app.use(express.bodyParser());
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});

	app.use(express.session({
		secret: 'ilovescotchscotchyscotchscotch'
	})); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	//app.use(flash()); // use connect-flash for flash messages stored in session

	app.use(log4js.connectLogger(logger, {
		level: log4js.levels.ERROR
	}));

});

app.use(express.static('./app'));

/* Catch et Log des erreurs dans tous le projet */
app.use(function(req, res, next) {
	var d = domain.create();
	d.on('error', function(er) {
		console.log('Une erreure s\'est produite, Detail : ', er.message);
		res.send(500);
	});

	// explicitly add req and res
	d.add(req);
	d.add(res);

	d.run(function() {
		app.router(req, res, next);
	});
});

// Bootstrap models
require('./models/DocStructure');
require('./models/Document');
require('./models/Profil');
require('./models/Tag');
require('./models/ProfilTag');
require('./models/User');

//Bootstrap routes
require('./routes/adaptation')(app, passport);

// Create HTTP/HTTPS Server
var privateKey  = fs.readFileSync('../sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('../sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3001);
httpsServer.listen(3000);

// app.listen(3000);
console.log('Express htpps server started on port 3000');
console.log('ENV = ' + env);

module.exports = app;