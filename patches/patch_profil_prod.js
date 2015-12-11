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
    ProfilTag = mongoose.model('ProfilTag');

function updateRegleName(ListProfilTag, counter) {
    var item = ListProfilTag[counter];
    ProfilTag.findById(item._id, function(err, foundItem) {
        if (item !== null && foundItem !== null) {
            console.log('before path');
            console.log(foundItem);
            switch (foundItem.coloration) {
                case 'Surligner les lignes':
                    foundItem.coloration = 'Surligner les lignes RJV';
                    break;
                case 'Colorer les lignes':
                    foundItem.coloration = 'Colorer les lignes RJV';
                    break;
            }

            foundItem.texte = '<p data-font=\'' + foundItem.police + '\' data-size=\'' + foundItem.taille + '\' data-lineheight=\'' + foundItem.interligne + '\' data-weight=\'' + foundItem.styleValue + '\' data-coloration=\'' + foundItem.coloration + '\' data-word-spacing=\'0\' data-letter-spacing=\'0\'> </p>';

            console.log('after patch');
            console.log(foundItem);
            /*
            foundItem.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    counter++;
                    if (counter < ListProfilTag.length) {
                        updateRegleName(ListProfilTag, counter);
                    } else {
                        console.log('update style names');
                    }
                }
            });
            */
        }
    });
}

function updateProfilTagToEm(ListProfilTag, counter) {
    var item = ListProfilTag[counter];
    ProfilTag.findById(item._id, function(err, foundItem) {
        if (item !== null && foundItem !== null) {

            switch (foundItem.taille) {
                case 8:
                    foundItem.taille = 1;
                    break;
                case 10:
                    foundItem.taille = 2;

                    break;
                case 12:
                    foundItem.taille = 3;

                    break;
                case 14:
                    foundItem.taille = 4;

                    break;
                case 16:
                    foundItem.taille = 5;

                    break;
                case 18:
                    foundItem.taille = 6;

                    break;
                case 20:
                    foundItem.taille = 7;

                    break;
                default:
                    foundItem.taille = 1;

            }

            switch (foundItem.interligne) {
                case 10:
                    foundItem.interligne = 1;
                    break;
                case 14:
                    foundItem.interligne = 2;

                    break;
                case 18:
                    foundItem.interligne = 3;

                    break;
                case 22:
                    foundItem.interligne = 4;

                    break;
                case 26:
                    foundItem.interligne = 5;

                    break;
                case 30:
                    foundItem.interligne = 6;

                    break;
                case 35:
                    foundItem.interligne = 7;

                    break;
                case 40:
                    foundItem.interligne = 8;

                    break;
                default:
                    foundItem.interligne = 1;

            }
            foundItem.spaceCharSelected = 1;
            foundItem.spaceSelected = 1;
            var newTaille = 1 + (foundItem.taille - 1) * 0.18;
            var newInterLigne = 1.286 + (foundItem.interligne - 1) * 0.18;

            foundItem.texte = '<p data-font=\'' + foundItem.police + '\' data-size=\'' + newTaille + '\' data-lineheight=\'' + newInterLigne + '\' data-weight=\'' + foundItem.styleValue + '\' data-coloration=\'' + foundItem.coloration + '\' data-word-spacing=\'0\' data-letter-spacing=\'0\'> </p>';

            console.log(foundItem);

            foundItem.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    counter++;
                    if (counter < ListProfilTag.length) {
                        updateProfilTagToEm(ListProfilTag, counter);
                    } else {
                        console.log('update style unit from PX to EM Finished');
                    }
                }
            });

        }
    });
}

function updateProfilTag(ListProfilTag, counter) {
        var item = ListProfilTag[counter];
        ProfilTag.findById(item._id, function(err, foundItem) {
            if (item !== null && foundItem !== null) {
                foundItem.spaceSelected = 1;
                foundItem.spaceCharSelected = 1;
                if (item.texte) {
                    var start = item.texte.indexOf('</p>') - 2;
                    foundItem.texte = item.texte.substring(0, start) + ' data-word-spacing=\'0\' data-letter-spacing=\'0\'> </p>';
                    foundItem.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            counter++;
                            if (counter < ListProfilTag.length) {
                                updateProfilTag(ListProfilTag, counter);
                            } else {
                                console.log('update Finished');
                            }
                        }
                    });
                }
            }
        });
    }
    /*
    patch ajouter les regles space et spacechar
    */
    /*
    ProfilTag.find({
        spaceSelected: {
            $exists: false
        }
    }, function(err, ListProfilTag) {
        if (ListProfilTag) {
            if (ListProfilTag.length > 0) {
                updateProfilTag(ListProfilTag, 0);
            }
        }

    })*/

/*
patch PX vers EM
*/

/*
 ProfilTag.find({}, function(err, ListProfilTag) {
    if (ListProfilTag) {
        if (ListProfilTag.length > 0) {
            updateProfilTagToEm(ListProfilTag, 0);
        }
    }

});*/

/*
patch renomer les regles
*/
/*
ProfilTag.find({}, function(err, ListProfilTag) {
    if (ListProfilTag) {
        if (ListProfilTag.length > 0) {
            updateRegleName(ListProfilTag, 0);
        }
    }
});
*/