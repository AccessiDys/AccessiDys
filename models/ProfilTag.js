/* File: ProfilTag.js
 *
 * Copyright (c) 2013-2016
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



var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var profilTagSchema = new Schema({
	profil: {  // the profile
		type: String
	},
	tag: {
		type: String
	},
	texte: {  // the text
		type: String
	},
	police: {  // the font 
		type: String
	},
	taille: {  // the size
		type: String
	},
	interligne: { // the line spacing
		type: String
	},
	styleValue: {
		type: String
	},
	coloration: {
		type: String
	},
	spaceSelected: {
		type: Number,
		default: 0
	},
	spaceCharSelected: {
		type: Number,
		default: 0
	}

});



var ProfilTag = mongoose.model('ProfilTag', profilTagSchema);