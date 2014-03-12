/* File: app.js
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

var express = require('express'),
	app = express(),
	mongoose = require('mongoose');
var passport = require('passport');


/* default environment */
var config = require('./env/config.json');

var env = process.env.NODE_ENV || config.NODE_ENV;
var mongo_uri = process.env.MONGO_URI || config.MONGO_URI;
var mongo_db = process.env.MONGO_DB || config.MONGO_DB;
var db = mongoose.connect('mongodb://' + mongo_uri + '/' + mongo_db);

require('./api/services/passport')(passport); // pass passport for configuration

app.configure(function() {
	app.use(express.cookieParser()); // read cookies (needed for auth)

	app.use(express.bodyParser());
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	app.use(express.session({
		secret: 'ilovescotchscotchyscotchscotch'
	})); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	//app.use(flash()); // use connect-flash for flash messages stored in session

});


app.use(express.static('./app'));

// Bootstrap models
require('./models/DocStructure');
require('./models/Document');
require('./models/Profil');
require('./models/Tag');
require('./models/ProfilTag');
require('./models/User');

//Bootstrap routes
require('./routes/adaptation')(app,passport);

app.listen(3000);
console.log('Express server started on port 3000');
console.log('ENV = ' + env);

module.exports = app;