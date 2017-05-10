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

var mongoose = require('mongoose'), ProfilTag = mongoose.model('ProfilTag'), Profil = mongoose.model('Profil'), UserProfil = mongoose.model('UserProfil'), Tags = mongoose.model('Tag'), UserAccount = mongoose.model('User');

/**
 * Create default profil
 */
function newProfilParDefaut() {

    createDefaultTags();


    var newProfil = {
        'nom': 'Accessidys par défaut',
        'descriptif': 'Ce profil d\'adaptation est proposé par défaut par l\'application Accessidys.',
        'owner': 'scripted'
    };

    var profile = new Profil(newProfil);
    profile.save(function (err) {
        if (err) {
            console.log('erreur creating profile.')
        } else {

            //Create link between profiles and tags
            createProfilTagsForNewProfilByDefault(profile._id);

            //Create link between profiles and users
            createUserProfilsForNewProfilByDefaultToAllUsers(profile._id);

        }
    });

};

function createUserProfilsForNewProfilByDefaultToAllUsers(profileID) {

    //TODO : Select all users and create an user profil with the new profile for each of one
    UserAccount.find({}, function (err, users) {
        if (users) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                var userProfil = new UserProfil({
                    'profilID': profileID,
                    'userID': user._id,
                    'favoris': false,
                    'actuel': true,
                    'default': true
                });
                userProfil.save(function (err) {
                    if (err) {
                        console.log('error creating user profil for default profil')
                    }
                });
            }
        }
    });

};

function createProfilTagsForNewProfilByDefault(profileID) {

    //for all tags, create the link with the profile
    var newProfilTag = [
        {
            "profil": profileID,
            "tag": "Légende",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Normal' data-coloration='Colorer les lignes RBV' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Colorer les lignes RBV",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Titre 1",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Bold' data-coloration='Colorer les lignes RBV' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Gras",
            "coloration": "Colorer les lignes RBV",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Sous-titre 1",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Bold' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Gras",
            "coloration": "Pas de coloration",
            "_id": "57584653c313b67e7031b919",
            "__v": 0,
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Titre 2",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Bold' data-coloration='Colorer les mots' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Gras",
            "coloration": "Colorer les mots",
            "_id": "57584653c313b67e7031b91a",
            "__v": 0,
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "52ea440a791a003f09fd751c",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Normal' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Pas de coloration",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "52ea4416791a003f09fd751d",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Bold' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Gras",
            "coloration": "Pas de coloration",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Paragraphe",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Normal' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Pas de coloration",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Annotation",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Normal' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Pas de coloration",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Liste de niveau 1",
            "texte": "<p data-font='opendyslexicregular' data-size='4.0600000000000005' data-lineheight='1.286' data-weight='Normal' data-coloration='Colorer les lignes RBV' data-word-spacing='0.18' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "18",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Colorer les lignes RBV",
            "spaceCharSelected": 1,
            "spaceSelected": 2
        },
        {
            "profil": profileID,
            "tag": "Entête de page",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Normal' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Pas de coloration",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Pied de page",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Normal' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Pas de coloration",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Sous-titre 2",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Normal' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Pas de coloration",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        },
        {
            "profil": profileID,
            "tag": "Citation",
            "texte": "<p data-font='opendyslexicregular' data-size='2.62' data-lineheight='1.286' data-weight='Normal' data-coloration='Pas de coloration' data-word-spacing='0' data-letter-spacing='0' > </p>",
            "police": "opendyslexicregular",
            "taille": "10",
            "interligne": "1",
            "styleValue": "Normal",
            "coloration": "Pas de coloration",
            "spaceCharSelected": 1,
            "spaceSelected": 1
        }
    ];

    Tags.find({}, function (err, tags) {
        if (tags) {

            console.log('tags = ' + tags);
            for (var i = 0; i < tags.length; i++) {
                for (var j = 0; j < newProfilTag.length; j++) {
                    if (newProfilTag[j].tag.indexOf(tags[i].libelle) > -1) {
                        newProfilTag[j].tag = tags[i]._id;
                        newProfilTag[j].profil = profileID;
                        var profilTag = new ProfilTag(newProfilTag[j]);
                        profilTag.save(function (err) {
                            if (err) {
                                console.log('erreur saving profil tag : ' + err);
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


function createDefaultTags() {

    var tags = [
        {
            "balise": "h1",
            "libelle": "Titre 1",
            "niveau": 1,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjZEN0U0QzlGMjFDMTFFM0ExNjREM0NBRkU5NzQ5NEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjZEN0U0Q0FGMjFDMTFFM0ExNjREM0NBRkU5NzQ5NEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNkQ3RTRDN0YyMUMxMUUzQTE2NEQzQ0FGRTk3NDk0RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyNkQ3RTRDOEYyMUMxMUUzQTE2NEQzQ0FGRTk3NDk0RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtpweP8AAADXSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC2nvteQbQG5jJBX0V3PgksBqd6kmtdGDRrRBrHgyjukgsFXHtHGoNXrNoLDCR3fuHkbLA+iQ6KS4Hycge1kb8sgLibK8PLVa4apsxYwNNWUgsXl5GRQIuLV69cMGuqqqCZhq18OHj763949AGvdAxIHyaOD0Swy0AaJiYri1YRNfqTkNUoNekoFc56DDEoD4vsUGALSmwoQYAAvecnI4D2mxwAAAABJRU5ErkJggg==",
            "position": 1
        },
        {
            "balise": "div",
            "libelle": "Sous-titre 1",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUJFQUQ2NUFGMjFEMTFFM0I4NDY4QzgyMEI5RjRGRTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUJFQUQ2NUJGMjFEMTFFM0I4NDY4QzgyMEI5RjRGRTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxQkVBRDY1OEYyMUQxMUUzQjg0NjhDODIwQjlGNEZFOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxQkVBRDY1OUYyMUQxMUUzQjg0NjhDODIwQjlGNEZFOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pnunf54AAAFsSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC2nvteQbQG5jJBX0V3PgksBqd5kwed/fC4j6CJyXUa1wB41aCAyLSUZFwQGX3k0iAN7+849DJ39U8FsESFBhsrSfIbiygYMDTMmdjFoqKsyvH37jiE4OhmRF0GB/ejR4//27gH/r9+4Ba5fVq3d8D84MvH/mzdv4XIgMRAbBFKyCsBiIAwDYINABoAEQRpB4Ou3b/8PHj4KVwSSQ+aDAIiPbBDYayCnujjYgJ0a5OvBYG1lwWBnY0VeYNdUFIP9z8vLw9DePZFh/qKlpBv0+PEThtKqerDLEuOiGfKyUhgWLltDukFcXFwMp89dYrhx8zZY8O69++CYIzn6hYWFGMoLsxky8svAgqrKCgz9nU0oCsVERfHyR/MacQY9pYI5z0EGpQHxfQoMAelNBQgwAMcVHebqbiMSAAAAAElFTkSuQmCC",
            "position": 2
        },
        {
            "balise": "h2",
            "libelle": "Titre 2",
            "niveau": 2,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEQ0MjlDRjlGMjFDMTFFM0JGRjVBNEU2NDM5NjI4NkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEQ0MjlDRkFGMjFDMTFFM0JGRjVBNEU2NDM5NjI4NkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RDQyOUNGN0YyMUMxMUUzQkZGNUE0RTY0Mzk2Mjg2QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RDQyOUNGOEYyMUMxMUUzQkZGNUE0RTY0Mzk2Mjg2QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PglwQuIAAAFCSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC2nvteQbQG5jJBX0V3PgksBqd6kmtdGDRrRBrHgyjukgsFXHtEmjFav28gwddYCDEUzJnYxcHNxMjR19DLcvvuAQURIkKGlvpJBQ10Vexi9ffuO4er1GwwvX70GG9hUUwoWNzE2ZKhv7mDg5+NjiI8OZ1i/aSvD5Ws3GGZP7UfYhq1+OXj46H979wAUMRAfJI5LnoXUshkEQC5WVVagLLAPHTkG9nZGSgKqBLFeA4FtO3ajeJEsr509f5Ghs38qOAaRYwtnmY0LzJizgCHI14Ph1evXYCwmKopiIFaDQIrQASj9gPC6zTuwRsAwzmtUNegpFcx5DjIoDYjvU2AISG8qQIABAPsqNb8IabXNAAAAAElFTkSuQmCC",
            "position": 3
        },
        {
            "balise": "div",
            "libelle": "Sous-titre 2",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDk4MzczQzRGMjFEMTFFM0IxNkJEQjc0M0I3OTlBRkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDk4MzczQzVGMjFEMTFFM0IxNkJEQjc0M0I3OTlBRkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0OTgzNzNDMkYyMUQxMUUzQjE2QkRCNzQzQjc5OUFGRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0OTgzNzNDM0YyMUQxMUUzQjE2QkRCNzQzQjc5OUFGRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtPeiVsAAAGuSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC2nvteQbQG5jJBX0V3PgksBqd5kwed/fC4j6CJyXUa1wB41aCAyLSUZFwQGX3k0iAN7+849DJ39U8FsESFBhsrSfIbiygYMDTMmdjHcf/AQrjY7LYEhNMifgQEU2I8ePf5v7x7w//qNW+D6ZdXaDf+DIxP/v3nzFi4HEgOxQWIwtSAMYoPEwS76+u072HRREWEw7e3pxiAuJsogLCwExiAA4svKyjA8fvyEIcjXg0FDXRXuSpB+sEEgQRcHG4bg6GSwImsrCwY7GyusYQEyLC87HR4coGAAG4pcZYKcOm/hErC3QDQMgJx/8PBRlOp1247dYHUgb4HTIiyMSirr4IpAmkCacRkEYiMbAgLg6Ofi4mI4fe4Sw42bt8FOvnvvPtjJ2MC3798Z6lq6GZLjo8B8UJjBox8UoOWF2QwZ+WVgQVVlBYb+ziYUA8RERcH0o0cQjbDohyWJ0bxGnEFPqWDOc5BBaUB8nwJDQHpTAQIMAOkCaRKhqStuAAAAAElFTkSuQmCC",
            "position": 4
        },
        {
            "balise": "h3",
            "libelle": "Titre 3",
            "niveau": 3,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzJGQUU2RTlGMjFDMTFFM0E5MTk4MDFEQzVFM0NCNTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzJGQUU2RUFGMjFDMTFFM0E5MTk4MDFEQzVFM0NCNTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMkZBRTZFN0YyMUMxMUUzQTkxOTgwMURDNUUzQ0I1MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMkZBRTZFOEYyMUMxMUUzQTkxOTgwMURDNUUzQ0I1MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pra+d9gAAAFsSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC2nvteQbQG5jJBX0V3PgksBqd6kmtdGDRrRBrHgyjukgsFXHtEmjFav28gwddYCDEUzJnYxcHNxMjR19DLcvvuAQURIkKGyNJ/B2FAfoQi5Onjz5u3/g4eP/l+1dsN/e/cAMBuEv3779j8lq+B/c3vP/0ePHoPlgyMTUaoSFBcJCwsx2NlYMRw6cgzMB7FhQFdLgyHQz5tBVlaG4f7DRwxv3r3HXx7hAnnZ6WD67dt3DBcuXmYoL8wmzyAYCI5OBtOmRnoMnu4u5McaqORsqillOH3uEsONm7dJNygkKonh7PmLGGFHstcUFWQZVqxexyAmIsxw5doNsJicnAz26IeB6zdugaMfPWmUVNaBxUH4zLkLKPLDOK9R1aCnVDDnOcigNCC+T4EhIL2pAAEGAHr/Gs2JVguiAAAAAElFTkSuQmCC",
            "position": 5
        },
        {
            "balise": "h4",
            "libelle": "Titre 4",
            "niveau": 4,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUMzMUJDMDBGMjFDMTFFM0JFNzdBRDNBMjc2RDYyQjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUMzMUJDMDFGMjFDMTFFM0JFNzdBRDNBMjc2RDYyQjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQzMxQkJGRUYyMUMxMUUzQkU3N0FEM0EyNzZENjJCNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQzMxQkJGRkYyMUMxMUUzQkU3N0FEM0EyNzZENjJCNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtHSI9kAAAEuSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC2nvteQbQG5jJBX0V3PgksBqd6kmtdGDRrRBrHgyjukgsFXHtHGoNXrNoLDCR3fuHkbrgbERhfDCGwne1sGcTFRhpevXjNMnbWAoammFCwuJycDVzN34RIw/er1awYNdVXsBgkLCzHY2VgxHDpyDMwHsZEBSPz+g8eUh9GkaXMY8rJSKDNo+849DIKC/BiuJMmgb9+/M3T2T2UI8vNmePz4CVgMFI54i1ps4NEjiGaQYTAAigxdbS1EgGOrzA8ePvrf3j0AZ2UPkgOpQQZYvSYmKkrQlehqRkpeo9Sgp1Qw5znIoDQgvk+BISC9qQABBgBTg+uHTpPtVgAAAABJRU5ErkJggg==",
            "position": 6
        },
        {
            "balise": "p",
            "libelle": "Paragraphe",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Mjg0OEIxODIyRUREMTFFNEI4N0ZGQ0I3MkIyMzIwRDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Mjg0OEIxODMyRUREMTFFNEI4N0ZGQ0I3MkIyMzIwRDUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyODQ4QjE4MDJFREQxMUU0Qjg3RkZDQjcyQjIzMjBENSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyODQ4QjE4MTJFREQxMUU0Qjg3RkZDQjcyQjIzMjBENSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PompJm4AAAC6SURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAIYNYhEgxw8AhkO7FgPpokBILX08drgc9FoYA+lwB41iDSD0JNAeWE2g6e7C26TcFUN9u4B/1et3fD/0aPH/7ft2A3mg9i4ABM+54qLiTLIysrAXXLl2g2capmI8f/2nXvAtKKC/CAJI2IAUWFEDGBioBLAa5CYqOhoXqOyQU+AtDSF5jwHJUgvIL5HQdMPpNcbIMAAaUiedVQ5HVkAAAAASUVORK5CYII=",
            "position": 7
        },
        {
            "balise": "div",
            "libelle": "Annotation",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUY0RTI1MzdGMjIxMTFFM0I3RTBBOEUxMDY3ODNBRDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUY0RTI1MzhGMjIxMTFFM0I3RTBBOEUxMDY3ODNBRDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RjRFMjUzNUYyMjExMUUzQjdFMEE4RTEwNjc4M0FENCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RjRFMjUzNkYyMjExMUUzQjdFMEE4RTEwNjc4M0FENCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqoaY/wAAADkSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASGDVo1KBBZRALMic8PI7h0aPHBDXJyckwrFy5GFUQORtbWDgQld2xqaN9GFlaOmKlcQJqeY0F3eDPnz/D2by8vMgWMnz58oW4WFNXV2UIDo6G811dnRhKSwsYTp48w1BYWMbAw8MDFldTU8XvNWxeWLJk+X8XF5//Bw8exutdFkKxsXfvAYaFC2cxSElJEh/Y6KCnZ+L/X79+ERUBo4X/qEGjBhE06CkVzHkOMigNiO9TYAhIbypAgAEAkK+DEDt9PTAAAAAASUVORK5CYII=",
            "position": 8
        },
        {
            "balise": "div",
            "libelle": "Citation",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0IyNjAzQUIwQjNBMTFFNEI3QUREMDI3Njk2QTgzNzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0IyNjAzQUMwQjNBMTFFNEI3QUREMDI3Njk2QTgzNzciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQjI2MDNBOTBCM0ExMUU0QjdBREQwMjc2OTZBODM3NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQjI2MDNBQTBCM0ExMUU0QjdBREQwMjc2OTZBODM3NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PofXAGoAAAGpSURBVHja3FUxT8JAGP0kjrC4CDswGyZIDNFJQyciSXFh0pjgglMnJiYnWWQREmUREhJ+Qyuu6I4zmBBd2v3kXVJs4WiPwsRLrm3a3Lvvve9djxhjymx8sODAXGVvdvkhogPaDFMQMdoCQrQl7AiRZVk0HH7SZPI9f7e/DgEmt1ov/G6j3X6iRCIuR4QKarV7MozB0rdwOCwvrdPpCUkU5Zxisag/ESpZBVRSqdz6ewSScvmOUqkjISFIbFmeRJpWpdHoi49FZLPHXJZv+5vNZ1dnFiVVq5p/jpANtFgEyGw0HlySVkpzhswGOgNPIEk62ZHI8mogh2eiRYRE9fojX93OxqrM+BJ1uz3K5y+F0lT1wjO0c4/sNiMzdm5gKgiKxYLQYGFFpmkJu5RMxqU2tOtXm8mcCnPT77/KVwSoasF3K0hVBG9KpWveZmQG/kCeFJwHlGmaLJ0+Ybr+tvbh5pKm6wPeaq8ES3lkGO+Uy50F+/s7y4Os8XgS6NwO/Vcz4JK8toGUNMhSlICynETR6GEgk4U52r2z/3cLPFMQXeFhE5LZuPkTYAD4JWdOPGOahgAAAABJRU5ErkJggg==",
            "position": 9
        },
        {
            "balise": "ul",
            "libelle": "Liste de niveau 1",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTAxNzgzMzNGMjFEMTFFM0JBNTRBQkFGODdCMDg5MTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTAxNzgzMzRGMjFEMTFFM0JBNTRBQkFGODdCMDg5MTciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MDE3ODMzMUYyMUQxMUUzQkE1NEFCQUY4N0IwODkxNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MDE3ODMzMkYyMUQxMUUzQkE1NEFCQUY4N0IwODkxNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqgYuGUAAAELSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC2nvteQbQG5jJBX0V3PgksBqd4cddFQdBHVEiRtUja5GRcEBl95NEgNunHzNkZAw8S279zDgE3N27fvMAu2V69fY9gAE5u7cBkDuprU7EKG4Ohk0r129vxFFP7sqf0MTTWlpBkUHuIP9x5Fge1kb8uw58ARhq9fv1FmkLCwEEOQrwc8rIgy6PHjJ3CMDNxcnBjevHtPOK+JiYqCObGpuXCJiqJsOFtDXZVBVVmB4fbdB3AxmJ7RvEaaQU+pYM5zkEFpQHyfAkNAelMBAgwA08/MASljZrwAAAAASUVORK5CYII=",
            "position": 10
        },
        {
            "balise": "div",
            "libelle": "Entête de page",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzMzODAzMjlGMjFFMTFFMzkyRURGMDZFRjgyN0I3MzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzMzODAzMkFGMjFFMTFFMzkyRURGMDZFRjgyN0I3MzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMzM4MDMyN0YyMUUxMUUzOTJFREYwNkVGODI3QjczNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMzM4MDMyOEYyMUUxMUUzOTJFREYwNkVGODI3QjczNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtDkvwkAAAEWSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC1nwSdJjEtwGkSqq3AaRMhluCxiIdbpdIv+UYOGokEs5GQPbGDwlUeDNLBv3LzNkJFfhiKxdulcBmFhIZyRMGNiF4OGuipCABTYBw8f/W/vHvD/0aPHcIwM3rx5CxYDqVm1dgOGPAigRL+srAxWZ4NcBnOduJgoVnU40xGp5RGKQYtnTwbTXFxclKVsXF4jOfofP34CxyBw6Mgxhm/fv+PUjCwPNkhMVBTMiU3NhWNQkqhr6WZ49OgJimaYWhBAlh/Na8QZ9JQK5jwHGZQGxPcpMASkNxUgwABrp93QfDL9LwAAAABJRU5ErkJggg==",
            "position": 13
        },
        {
            "balise": "div",
            "libelle": "Pied de page",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODBEMDA1ODFGMjFFMTFFMzlFRTVEQTJCODM0N0EyNEQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODBEMDA1ODJGMjFFMTFFMzlFRTVEQTJCODM0N0EyNEQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MEQwMDU3RkYyMUUxMUUzOUVFNURBMkI4MzQ3QTI0RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MEQwMDU4MEYyMUUxMUUzOUVFNURBMkI4MzQ3QTI0RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PupHIscAAAD9SURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASYIExHDwCyTLgwI71qAYhCxILkC2nmtdGDRqKBrHgSxvEJEScBpGaKHEaRMhluCxiIdbpJLmI3IwLAoOvPBrECRI5oFWVFRiK87IYNNRVGYiVZ4DVKfbuAf8PHj4KZs9buOR/SlYBSp1DSB6r15SVFBlu332A0xvY5LEadOHiZbDzcQFs8vB0hB4GdRXFDLKyMjjDCF0eaxhhA4Tk8Ub/t+/fGQ4dOUaUPIpBYqKiKAofPXrCUNfSTZT8aF4jzqCnVDDnOcigNCC+T4EhIL2pAAEGAAphGkLoZQyrAAAAAElFTkSuQmCC",
            "position": 14
        },
        {
            "balise": "div",
            "libelle": "Légende",
            "niveau": 0,
            "picto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAkCAYAAACE7WrnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEM3M0ZDN0FGMjIxMTFFM0I5MjZGMjE5MUE3Q0JEQjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEM3M0ZDN0JGMjIxMTFFM0I5MjZGMjE5MUE3Q0JEQjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowQzczRkM3OEYyMjExMUUzQjkyNkYyMTkxQTdDQkRCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowQzczRkM3OUYyMjExMUUzQjkyNkYyMTkxQTdDQkRCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoDOLfIAAAHHSURBVHjaYvj//38oEL/9Tz4A6Q1nBBIvGBgYxBkoA69BBv1noAJgYqASGDVoKBrEgkvi5MnTDEuXrmS4evU6w////xg0NNQZIiJCGOzsbLCqx5og585dyHD58lWGoCB/BhMTQwZGRiaGS5euMKxbt5FBSkqSIT8/C9Mk9Ixz+vTZ/zk5Rf/fvn2Hkal+/vz5v6qq/v/evQcw5DAMKiws/79v30E4/9Cho/+PHDmGZNG5/4mJGYQN8vQM+P/u3Xu4IRYWDmB84sQpsNivX7//29q6YBjEhOlVYMAxQmOChRkuzszMgj/a0E0uKCj7v3//ITgfGHtg78DA2bPnifPaqVNn/ufmFuMsxaqrG/7v2bOfsNdMTY0Zfv/+zbBv3wEM11+5cpXh3r37DM7ODsSl7JSUBGCa2YQhDhKLjY0iPosYGxsy/P37F8VV16/fBCdKNzdn0vIauqtAqTohIQYYe8ykGYTsqjt37jEAY4vBw8MVZ+zjLfxBmufPX8wgJyfLoKqqzBAY6EdeMQJz1dGjxxl8fLzIK0aQw+ru3fsMrKz4lRJVr/358weYXahg0GgtMpwNekoFc56DDEoD4vsUGALSmwoQYADkTQdhPbWmEQAAAABJRU5ErkJggg==",
            "position": 15
        }
    ];

    for (var i = 0; i < tags.length; i++) {

        var tag = new Tags(tags[i]);

        tag.save(function (err) {
            if (err) {
                console.log('erreur saving tag : ' + err);
            }
        });
    }

}

function deleteAllCnedAdaptProfilByDefault() {

    //FIND profile Like '%CnedAdapt par défaut%'
    Profil.find({
        nom: /CnedAdapt par défaut/
    }, function (err, profils) {
        if (profils) {
            for (var i = 0; i < profils.length; i++) {
                var profile = profils[i];

                // Delete profilTags dependences
                ProfilTag.find({
                    profil: profile._id
                }).remove(function (err) {
                    if (err) {
                        console.log("erreur remove CnedAdapt profiTag: " + err);
                    }
                });

                // Delete userProfils dependences
                UserProfil.findOneAndRemove({
                    profilID: profile._id
                }).remove(function (err) {
                    if (err) {
                        console.log("erreur remove CnedAdapt Userprofil: " + err);
                    }
                });

                // delete profile
                Profil.findByIdAndRemove(profile._id, function (err) {
                    if (err) {
                        console.log("erreur remove CnedAdapt profil: " + err);
                    }
                });

            }
        }

    });


}

function setAccessidysProfil() {

    //Create the new default profile
    newProfilParDefaut();

    //Delete the last one (and the link with user profiles too)
    deleteAllCnedAdaptProfilByDefault();
}

/**
 * Update profiles sizes according to new profil's scales
 */
function updateAllPoliceSizeForAProfil(profilId) {
    ProfilTag.find({
        profil: profilId
    }, function (err, foundItem) {
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
                ProfilTag.findByIdAndUpdate(foundItem[i]._id, foundItem[i], function (err, itemEdit) {
                });
            }
        }
    });
};

function updateAllProfilPoliceSize() {

    //Check if profile tag that are with font size between 1 to 7 (8 and 9 exit in both size definition)
    ProfilTag.find({
        $or: [{taille: '1'}, {taille: '2'}, {taille: '3'}, {taille: '4'}, {taille: '5'}, {taille: '6'}, {taille: '7'}]
    }, function (err, foundItem) {
        if (foundItem) {
            var alreadyTreatedProfileIDs = "";

            for (var i = 0; i < foundItem.length; i++) {

                //Check if profileID already treated
                if (alreadyTreatedProfileIDs.indexOf(';' + foundItem[i].profil + ';') < 0) {
                    updateAllPoliceSizeForAProfil(foundItem[i].profil);

                    //Set as treated
                    alreadyTreatedProfileIDs = alreadyTreatedProfileIDs + ';' + foundItem[i].profil + ';';
                }


            }
        }
    });

};

function executePatchProfil() {
    Profil.findOne({
        'nom': 'Accessidys par défaut',
        'owner': 'scripted'
    }, function (err, item) {
        if (!item) {

            //if not already apply
            console.log('Accessidys not found !');
            //Firts Item : Set ACCESSIDYS profil
            setAccessidysProfil();

            //Second Item : Update font size for old profile font size
            updateAllProfilPoliceSize();
        }
    });

}



executePatchProfil();
