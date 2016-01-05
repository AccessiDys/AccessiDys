/*File: synchronisationStoreService.js
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

var cnedApp = cnedApp;

/**
 * Service de synchronisation lorsque l'utilisateur redevient connecté.
 */
cnedApp.service('synchronisationStoreService', function ($localForage) {
    
    /**
     * Ajoute un document à la liste des documents à synchroniser.
     * @param documentToSynchronize : {docName, newDocName (pour renommage), action (update/rename/delete), content}.
     * Pour la création d'un document, utiliser update comme action.
     */
    this.storeDocumentToSynchronize = function(documentToSynchronize) {
        $localForage.getItem('docToSync').then(function(docToSyncArray) {
            if(!docToSyncArray) {
                docToSyncArray = [];
            }
            docToSyncArray.push(documentToSynchronize);
            return $localForage.setItem('docToSync', docToSyncArray);
        });
    };
    
    /** 
     * Ajoute un profil à la liste des profiles à synchroniser.
     * @param profilToSynchronize : { profil, action (create/update/delete), profilTags }
     */
    this.storeProfilToSynchronize = function(profilToSynchronize) {
        return $localForage.getItem('profilesToSync').then(function(profilesToSyncArray) {
            if(!profilesToSyncArray) {
                profilesToSyncArray = [];
            }
            profilesToSyncArray.push(profilToSynchronize);
            return $localForage.setItem('profilesToSync', profilesToSyncArray);
        });
    };
    /** 
     * Ajoute la liste des tags au profil  à synchroniser ou crée une liste de tag à appliqué à un profil.
     * @param profilToSynchronize : { profil, action (create/update/delete), profilTags }
     */
    this.storeTagToSynchronize = function(profilToSynchronize){
        return $localForage.getItem('profilesToSync').then(function(profilesToSyncArray) {
            if(!profilesToSyncArray) {
                profilesToSyncArray = [];

            } else{
                for(var a=0; a < profilesToSyncArray.length; a++){
                    if(profilesToSyncArray[a].profil._id === profilToSynchronize.profil._id && profilesToSyncArray[a].profilTags === null){
                        profilesToSyncArray[a].profilTags = profilToSynchronize.profilTags;
                        return $localForage.setItem('profilesToSync', profilesToSyncArray);
                    }
                }
            }
            profilesToSyncArray.push(profilToSynchronize);
            return $localForage.setItem('profilesToSync', profilesToSyncArray);
        });
    }
    
});