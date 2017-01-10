/* File: User.js
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
// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

  local: {
    email: String, 
    password: String,
    nom: String, // the first name
    prenom: String, // the surname
    role: String,
    restoreSecret: String,
    secretTime: String,
    token: String,
    tokenTime: Number,
    authorisations: {
      ocr: Boolean , default:false,
      audio: Boolean , default:false
    }
  },
  dropbox: {
    uid: String,
    display_name: String,
    referral_link: String,
    emails: String,
    country: String,
    accessToken: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }

});

// methods ======================
// generating a hash
//userSchema.methods.generateHash = function(password) {
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//};

// checking if password is valid
//userSchema.methods.validPassword = function(password) {
//    return bcrypt.compareSync(password, this.local.password);
//};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
