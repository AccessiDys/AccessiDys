/* File: utils.js
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

var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';


/* avant le debut de tous les tests */
before(function(done) {
	function clearDB() {
		/* pour corriger une erreur signalé par JSHint : Don't make functions within a loop */
		function callBack() {}
		for (var i in mongoose.connection.collections) {
			mongoose.connection.collections[i].remove(callBack);
		}
		return done();
	}

	if (mongoose.connection.readyState === 0) {
		mongoose.connect('mongodb://localhost/adaptation-test', function(err) {
			if (err) {
				throw err;
			}
			return clearDB();
		});
	} else {
		return clearDB();
	}
});

/* apres la fin de tous les tests */
after(function(done) {
	mongoose.disconnect();
	return done();
});