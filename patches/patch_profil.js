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
            
             //Create link between profiles and tags
             createProfilTagsForNewProfilByDefault(profile._id);
             
             //Create link between profiles and users
             createUserProfilsForNewProfilByDefaultToAllUsers(profile._id);
             
        }
    });

};

function createUserProfilsForNewProfilByDefaultToAllUsers(profileID) {
    
    //TODO : Select all users and create an user profil with the new profile for each of one
    UserAccount.find({
    }, function(err, users) {
        if (users) {
        	for (var i = 0; i < users.length; i++) {
	            var user = users[i];
	            var userProfil = new UserProfil({
                    'profilID' : profileID,
                    'userID' : user._id,
                    'favoris' : false,
                    'actuel' : true,
                    'default' : true
                 });
                 userProfil.save(function(err) {
                     if (err) {
                         console.log('error creating user profil for default profil')
                      } else {
                       }
                 });		   
	         }
        }
    });
   
};

function createProfilTagsForNewProfilByDefault(profileID) {
    
    //for all tags, create the link with the profile
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
    
    Tags.find({}, function(err, tags) {
     if (tags) {
         for (var i = 0; i < tags.length; i++) {
             for (var j = 0; j < newProfilTag.length; j++) {
                 if (newProfilTag[j].tag.indexOf(tags[i].libelle) > -1) {
                     newProfilTag[j].tag = tags[i]._id;
                     newProfilTag[j].profil = profileID;
                     var profilTag = new ProfilTag(newProfilTag[j]);
                     profilTag.save(function(err) {
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
    
};

function deleteAllCnedAdaptProfilByDefault() {
	   
	   //FIND profile Like '%CnedAdapt par défaut%'
	   Profil.find({
            nom : /CnedAdapt par défaut/
	   }, function(err, profils) {
                if (profils) {
                	console.log("profil CnedAdapt found!!!");
                	for (var i = 0; i < profils.length; i++) {
              	      var profile = profils[i];
              	   
              	      // Delete profilTags dependences
              		  ProfilTag.find({
              		     profil : profile._id
              		  }).remove(function(err){
              			if(err){
                            console.log("erreur remove CnedAdapt profiTag: " + err);
               			   }
              		  });
              		  
              		  // Delete userProfils dependences
              		  UserProfil.findOneAndRemove({
              		      profilID : profile._id
              		  }).remove(function(err){
              			if(err){
                            console.log("erreur remove CnedAdapt Userprofil: " + err);
               			   }
              		  });
              		  
              		  // delete profile
              		  Profil.findByIdAndRemove(profile._id,function(err) {
              			   if(err){
                           console.log("erreur remove CnedAdapt profil: " + err);
              			   }
              		  });
              		  		  
              		}
                }
                
           });
	
	   
};

function setAccessidysProfil() {
    
    //Create the new default profile        
    newProfilParDefaut();
    
 //Delete the last one (and the link with user profiles too)
    deleteAllCnedAdaptProfilByDefault();
};

/**
 * Update profiles sizes according to new profil's scales
 */
function updateAllPoliceSizeForAProfil(profilId) {
    ProfilTag.find({
        profil :  profilId
    }, function(err, foundItem) {
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

function updateAllProfilPoliceSize() {
    
    //Check if profile tag that are with font size between 1 to 7 (8 and 9 exit in both size definition)
 ProfilTag.find({
    $or: [ { taille : '1' }, { taille : '2' }, { taille : '3' },{ taille : '4' }, { taille : '5' }, { taille : '6' }, { taille : '7' }]
 }, function(err, foundItem) {
     if (foundItem) {
          var alreadyTreatedProfileIDs = "";
          
          for (var i = 0; i < foundItem.length; i++) {
                 
                 //Check if profileID already treated
                 if(alreadyTreatedProfileIDs.indexOf(';' + foundItem[i].profil + ';')<0) {
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
        'nom' : 'Accessidys par défaut',
        'owner' : 'scripted',
    }, function(err, item) {
    	if (!item) {
            
            //if not already apply
            console.log('Accessidys not found !');
            //Firts Item : Set ACCESSIDYS profil
            setAccessidysProfil();
            
           //Second Item : Update font size for old profile font size
            updateAllProfilPoliceSize();
                       
       } 
    });

};

executePatchProfil();
