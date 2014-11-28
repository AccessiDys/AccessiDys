/*File: patch_profil_recettej.js
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


var mongoose = require('mongoose'),
  ProfilTag = mongoose.model('ProfilTag'),
  Profil = mongoose.model('Profil'),
  UserProfil = mongoose.model('UserProfil');


function updateProfilTagToEm(ListProfilTag, counter) {
  var item = ListProfilTag[counter];
  ProfilTag.findById(item._id, function (err, foundItem) {
    if (item !== null && foundItem !== null) {

      var newSpaceSelected = 0 + (foundItem.spaceSelected - 1) * 0.18;
      var newSpaceCharSelected = 0 + (foundItem.spaceCharSelected - 1) * 0.12;

      var newTaille = 1 + (foundItem.taille - 1) * 0.18;
      var newInterLigne = 1.286 + (foundItem.interligne - 1) * 0.18;

      foundItem.texte = '<p data-font=\'' + foundItem.police + '\' data-size=\'' + newTaille + '\' data-lineheight=\'' + newInterLigne + '\' data-weight=\'' + foundItem.styleValue + '\' data-coloration=\'' + foundItem.coloration + '\' data-word-spacing=\'' + newSpaceSelected + '\' data-letter-spacing=\'' + newSpaceCharSelected + '\'> </p>';

      console.log(foundItem);

      foundItem.save(function (err) {
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


function changeStyleName(ListProfilTag, counter) {
  var item = ListProfilTag[counter];
  ProfilTag.findById(item._id, function (err, foundItem) {
    if (item !== null && foundItem !== null) {
      switch (foundItem.coloration) {
        case 'Colorer les lignes RVB':
          foundItem.coloration = 'Colorer les lignes RBV';
          break;
        case 'Colorer les lignes RJV':
          foundItem.coloration = 'Colorer les lignes RVJ';
          break;
        case 'Surligner les lignes RVB':
          foundItem.coloration = 'Surligner les lignes RBV';
          break;
        case 'Surligner les lignes RJV':
          foundItem.coloration = 'Surligner les lignes RVJ';
          break;
        case 'Colorer les lignes RVBJ':
          foundItem.coloration = 'Colorer les lignes RBVJ';
          break;
        case 'Surligner les lignes RVBJ':
          foundItem.coloration = 'Surligner les lignes RBVJ';
          break;
        case 'Couleur par défaut':
          foundItem.coloration = 'Couleur par défaut';
          break;
        case 'Colorer les mots':
          foundItem.coloration = 'Colorer les mots';
          break;
        case 'Colorer les syllabes':
          foundItem.coloration = 'Colorer les syllabes';
          break;
        case 'Surligner les mots':
          foundItem.coloration = 'Surligner les mots';
          break;
      }

      var newTaille = 1 + (foundItem.taille - 1) * 0.18;
      var newInterLigne = 1.286 + (foundItem.interligne - 1) * 0.18;


      var newSpaceSelected = 0 + (foundItem.spaceSelected - 1) * 0.18;
      var newSpaceCharSelected = 0 + (foundItem.spaceCharSelected - 1) * 0.12;

      foundItem.texte = '<p data-font=\'' + foundItem.police + '\' data-size=\'' + newTaille + '\' data-lineheight=\'' + newInterLigne + '\' data-weight=\'' + foundItem.styleValue + '\' data-coloration=\'' + foundItem.coloration + '\' data-word-spacing=\'' + newSpaceSelected + '\' data-letter-spacing=\'' + newSpaceCharSelected + '\'> </p>';


      foundItem.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          counter++;
          if (counter < ListProfilTag.length) {
            changeStyleName(ListProfilTag, counter);
          } else {
            console.log(counter + ' profileTag updated')
            console.log('update style Finished');
          }
        }
      });


    }
  });
}


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
 changeStyleName
 */

/*
 ProfilTag.find({}, function(err, ListProfilTag) {
 if (ListProfilTag) {
 if (ListProfilTag.length > 0) {
 changeStyleName(ListProfilTag, 0);
 }
 }

 });
 */


/*
 patch clean supprimer les profilTags orphelin
 */

function checkProfilTags(profileIds) {
  ProfilTag.remove({profil: {$nin: profileIds}}, function (err, item) {
    if (err) {
      console.log(err);
    } else {
      console.log('ProfilTags deleted :' + item);
    }
  })
};

Profil.find({}, function (err, ListProfil) {
  console.log('clean BD patch : ProfilTags');
  if (ListProfil) {
    if (ListProfil.length > 0) {
      var profileIds = [];
      for (var i = 0; i < ListProfil.length; i++) {
        profileIds.push(ListProfil[i]._id);
        if (i == ListProfil.length - 1) {
          checkProfilTags(profileIds);
        }
      }
    }
  }
});

//UserProfil.find({}, function (err, item) {
//  if (!err && item) {
//    console.log(item);
//  }
//});
