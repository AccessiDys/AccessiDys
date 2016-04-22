/*File: patch_profil.js
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

var mongoose = require('mongoose'), ProfilTag = mongoose.model('ProfilTag'), Profil = mongoose.model('Profil'), UserProfil = mongoose.model('UserProfil'), Tags = mongoose.model('Tag');

/**
 * Create default profil
 */
function newProfilParDefaut() {
    var newProfilTag = [ {
        'tag' : 'Titre 1',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Bold\' data-coloration=\'Colorer les lignes RBV\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Gras',
        'coloration' : 'Colorer les lignes RBV',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Titre 2',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Bold\' data-coloration=\'Colorer les mots\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Gras',
        'coloration' : 'Colorer les mots',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Titre 3',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Titre 4',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Bold\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Gras',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Paragraphe',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Citation',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Liste de niveau 1',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'4.0600000000000005\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Colorer les lignes RBV\' data-word-spacing=\'0.18\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '18',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Colorer les lignes RBV',
        'spaceCharSelected' : 1,
        'spaceSelected' : 2,
    }, {
        'tag' : 'Pied de page',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Entête de page',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Sous-titre 1',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Bold\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Gras',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Annotation',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Légende',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Colorer les lignes RBV\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Colorer les lignes RBV',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    }, {
        'tag' : 'Sous-titre 2',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'2.62\' data-lineheight=\'1.286\' data-weight=\'Normal\' data-coloration=\'Pas de coloration\' data-word-spacing=\'0\' data-letter-spacing=\'0\' > </p>',
        'profil' : '55d6db348539cb882212195a',
        'police' : 'opendyslexicregular',
        'taille' : '10',
        'interligne' : '1',
        'styleValue' : 'Normal',
        'coloration' : 'Pas de coloration',
        'spaceCharSelected' : 1,
        'spaceSelected' : 1,
    } ];

    var newProfil = {
        'nom' : 'Accessidys par défaut',
        'descriptif' : 'Ce profil d\'adaptation est proposé par défaut par l\'application Accessidys.',
        'owner' : 'scripted',
    };

    var profile = new Profil(newProfil);
    profile.save(function(err) {
        if (err) {
            console.log('erreur creating profile.')
        } else {
            var userProfil = new UserProfil({
                'profilID' : profile._id,
                'userID' : profile.owner,
                'favoris' : false,
                'actuel' : true,
                'default' : true
            });
            userProfil.save(function(err) {
                if (err) {
                    console.log('error creating user profil for default profil')
                } else {
                    Tags.find({}, function(err, tags) {
                        if (tags) {
                            for (var i = 0; i < tags.length; i++) {
                                for (var j = 0; j < newProfilTag.length; j++) {
                                    if (newProfilTag[j].tag.indexOf(tags[i].libelle) > -1) {
                                        newProfilTag[j].tag = tags[i]._id;
                                        newProfilTag[j].profil = profile._id;
                                        var profilTag = new ProfilTag(newProfilTag[j]);
                                        profilTag.save(function(err) {
                                            if (err) {
                                                console.log('erreur saving profil tag');
                                            }
                                        });
                                        newProfilTag.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }
    });

};

/**
 * Update profiles sizes according to new profil's scales
 */
function updateAllProfilPoliceSize() {
    ProfilTag.find({}, function(err, foundItem) {
        if (foundItem) {
            for (var i = 0; i < foundItem.length; i++) {
                switch (foundItem[i].taille) {
                case '1':
                    foundItem[i].taille = 8;
                    break;
                case '2':
                    foundItem[i].taille = 9;
                    break;
                case '3':
                    foundItem[i].taille = 10;
                    break;
                case '4':
                    foundItem[i].taille = 11;
                    break;
                case '5':
                    foundItem[i].taille = 12;
                    break;
                case '6':
                    foundItem[i].taille = 14;
                    break;
                case '7':
                    foundItem[i].taille = 16;
                    break;
                case '8':
                    foundItem[i].taille = 18;
                    break;
                case '9':
                    foundItem[i].taille = 22;
                    break;
                case '10':
                    foundItem[i].taille = 24;
                    break;
                default:
                    foundItem[i].taille = 10;
                    break;
                }
                var newSpaceSelected = 0 + (foundItem[i].spaceSelected - 1) * 0.18;
                var newSpaceCharSelected = 0 + (foundItem[i].spaceCharSelected - 1) * 0.12;

                var newTaille = foundItem[i].taille / 12;
                var newInterLigne = 1.286 + (foundItem[i].interligne - 1) * 0.18;

                foundItem[i].texte = '<p data-font=\'' + foundItem[i].police + '\' data-size=\'' + newTaille + '\' data-lineheight=\'' + newInterLigne + '\' data-weight=\'' + foundItem[i].styleValue + '\' data-coloration=\'' + foundItem[i].coloration + '\' data-word-spacing=\'' + newSpaceSelected + '\' data-letter-spacing=\'' + newSpaceCharSelected + '\'> </p>';
                ProfilTag.findByIdAndUpdate(foundItem[i]._id, foundItem[i], function(err, itemEdit) {
                });
            }
        }
    });
};

