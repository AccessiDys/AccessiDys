/* File: UserProfil.js
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

var userProfilSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    profilID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profil'
    },
    favoris: {// favorites // TODO a supprimer
        type: Boolean,
        required: true
    },
    actuel: { //current // TODO a supprimer
        type: Boolean,
        required: true
    },
    default: { // TODO a supprimer
        type: Boolean,
        required: true
    },
    delegatedID: { // TODO a supprimer
        type: String,
        required: false
    },
    delegate: { // TODO a supprimer
        type: Boolean,
        required: false
    },
    actuelDelegate: { // TODO a supprimer
        type: Boolean,
        required: false
    }
});


module.exports = mongoose.model('UserProfil', userProfilSchema);
