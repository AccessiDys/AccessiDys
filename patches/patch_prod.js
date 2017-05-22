/* File: patch_profil_prod.js
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

'use strict';

var mongoose = require('mongoose'),
    ProfilTag = mongoose.model('ProfilTag'),
    Profil = mongoose.model('Profil'),
    UserProfil = mongoose.model('UserProfil'),
    Tags = mongoose.model('Tag'),
    UserAccount = mongoose.model('User');


exports.updateDb = function () {

    updateProfiles(function () {
        updateUsers();
    });

};

function updateUsers() {
    UserProfil.find()
        .populate('userID')
        .populate('profilID')
        .exec(function (err, _userProfils) {


            if (_userProfils) {
                for (var i = 0; i < _userProfils.length; i++) {

                    if (_userProfils[i].profilID.owner !== 'scripted') {
                        if (_userProfils[i].userID && _userProfils[i].userID.local) {
                            _userProfils[i].profilID.owner = _userProfils[i].userID.local.email;
                            try {
                                _userProfils[i].profilID.save();
                            } catch (e) {
                                console.log('Error on user update');
                            }
                        }

                    }

                }
            }
        });
}

/**
 * Update profiles tags
 * @param cb
 */
function updateProfiles(cb) {

    ProfilTag.find()
        .populate('profil')
        .exec(function (err, _profilsTag) {

            if (_profilsTag) {
                for (var i = 0; i < _profilsTag.length; i++) {

                    if(_profilsTag[i].profil){
                        if (_profilsTag[i].profil.profileTags.indexOf(_profilsTag[i]._id) < 0) {
                            _profilsTag[i].profil.profileTags.push(_profilsTag[i]._id);
                        }

                        // Clean profile
                        _profilsTag[i].profil.photo = undefined;
                        _profilsTag[i].profil.save();
                    }

                    // Clean profile Tag
                    _profilsTag[i].texte = undefined;
                    _profilsTag[i].save();


                }
            }

            cb();


        });
}

function updateTags() {

}



