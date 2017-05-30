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
    UserAccount = mongoose.model('User'),
    fs = require('fs');


exports.updateDb = function () {


    saveData(function () {
        cleanProfiles(function () {
            updateProfiles(function () {
                updateUsers(function () {
                    console.log('---------END-------');


                    Profil.find({})
                        .populate('profileTags')
                        .exec(function (err, profiles) {
                            if (profiles) {
                                var countNoOwner = 0;
                                var countWithOwner = 0;

                                for (var i = 0; i < profiles.length; i++) {
                                    if (profiles[i].owner === '' || typeof profiles[i].owner == 'undefined') {
                                        countNoOwner++;
                                    } else {
                                        console.log('profiles[i].owner', profiles[i].owner);
                                        countWithOwner++;
                                    }
                                }

                                console.log('countNoOwner = ', countNoOwner);
                                console.log('countWithOwner = ', countWithOwner);
                                console.log('total = ', profiles.length);
                            }
                        });
                });
            });
        });
    });
};

function saveData(cb) {


    UserProfil.find()
        .exec(function (err, userProfil) {

            if (userProfil) {
                fs.writeFile('./userProfil_prod.json', JSON.stringify(userProfil), 'utf8', function () {
                    console.log('userProfil writed');
                });
            }

            UserAccount.find().exec(function (err, accounts) {
                if (accounts) {
                    fs.writeFile('./Accounts_prod.json', JSON.stringify(accounts), 'utf8', function () {
                        console.log('Accounts writed');
                    });
                }

                ProfilTag.find().exec(function (err, profilTags) {
                    if (profilTags) {
                        fs.writeFile('./ProfilTag_prod.json', JSON.stringify(profilTags), 'utf8', function () {
                            console.log('ProfilTag writed');
                        });
                    }

                    Profil.find().exec(function (err, profiles) {
                        if (profiles) {
                            fs.writeFile('./Profiles_prod.json', JSON.stringify(profiles), 'utf8', function () {
                                console.log('ProfilTag writed');
                            });
                        }

                        cb();
                    });
                });


            });


        });
}


function cleanProfiles(cb) {

    Profil.find({
        $or: [
            {
                owner: ''
            },
            {
                owner: undefined
            }]
    })
        .populate('profileTags')
        .exec(function (err, profiles) {
            if (profiles) {

                for (var i = 0; i < profiles.length; i++) {
                    profiles[i].remove();
                }

                fs.writeFile('./Profiles_noOwner_prod.json', JSON.stringify(profiles), 'utf8', function () {
                    console.log('Profiles_noOwner writed');
                });
            }

            cb();
        });

}

function updateUsers(cb) {

    console.log('updateUsers');

    UserAccount.find()
        .exec(function (err, _user) {

            if (_user) {

                for (var i = 0; i < _user.length; i++) {

                    var owner = '';

                    if (_user[i].local.role == 'admin') {
                        owner = 'admin';
                    } else {
                        owner = _user[i].dropbox.emails ? _user[i].dropbox.emails : _user[i].local.email;
                    }


                    Profil.update({owner: _user[i]._id}, {
                        $set: {owner: owner}
                    }, {
                        multi: true
                    }, function (err) {
                        if (err) {
                            console.log('Error on user update', err);
                        }
                    });

                }
            }

            cb();
        });
}

/**
 * Update profiles tags
 * @param cb
 */
function updateProfiles(cb) {

    console.log('updateProfiles');

    ProfilTag.find()
        .populate('profil')
        .exec(function (err, _profilsTag) {

            if (_profilsTag) {
                for (var i = 0; i < _profilsTag.length; i++) {

                    if (_profilsTag[i].profil && _profilsTag[i].profil.owner) {
                        if (_profilsTag[i].profil.profileTags.indexOf(_profilsTag[i]._id) < 0) {
                            _profilsTag[i].profil.profileTags.push(_profilsTag[i]._id);
                        }


                        // Clean profile
                        /*if (_profilsTag[i].profil.photo) {
                         _profilsTag[i].profil.photo = undefined;
                         }*/
                        _profilsTag[i].profil.save(function (err) {
                            if (err) {
                                console.log('updateProfiles - Error on profil update', err);
                            }
                        });


                        // Clean profile Tag
                        /*if (_profilsTag[i].texte) {
                         _profilsTag[i].texte = undefined;
                         }*/
                        _profilsTag[i].save(function (err) {
                            if (err) {
                                console.log('updateProfiles - Error on profilTag update', err);
                            }
                        });

                    } else {
                        _profilsTag[i].remove();
                    }
                }
            }

            cb();


        });
}



