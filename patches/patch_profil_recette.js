/*File: patch_profil_recette.js
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

var mongoose = require('mongoose'), ProfilTag = mongoose.model('ProfilTag'), Profil = mongoose.model('Profil'), UserProfil = mongoose.model('UserProfil');

function purgeProfiles(){

    Profil.findOne({
        'nom': 'Accessidys par défaut',
        'owner': 'scripted'
    }, function (err, item) {
        if (item) {

            var defaultProfileId = item._id;

            if(defaultProfileId){
                ProfilTag.remove({
                    profil : {
                        $nin : [defaultProfileId]
                    }
                }, function(err, item) {
                    if (!err) {
                        console.log('ProfilTag removed...');

                        UserProfil.remove({
                            profilID : {
                                $nin : [defaultProfileId]
                            }
                        }, function(err, item) {
                            if (!err) {
                                console.log('UserProfil removed...');

                                Profil.remove({
                                    _id : {
                                        $nin : [defaultProfileId]
                                    }
                                }, function(err, item) {
                                    if (!err) {
                                        console.log('Profiles removed...');
                                        console.log('Purge END');
                                    } else {
                                        console.log('err' + err);
                                    }
                                });
                            } else {
                                console.log('err' + err);
                            }
                        });
                    } else {
                        console.log('err' + err);
                    }
                });
            }
        } else {
            console.log('Accessidys not found !');
        }
    });

}


if(process.env.NODE_ENV === 'recette'){
    purgeProfiles();
}


