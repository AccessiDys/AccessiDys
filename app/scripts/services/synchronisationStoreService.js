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
cnedApp.service('synchronisationStoreService', function($localForage) {
    var self = this;
    /**
     * Cette fonction fusionne la nouvelle action(delete) avec celle existante
     * et portant sur le même document
     * 
     * @param existing:
     *            l'élement existant à synchroniser
     * @param newItem:
     *            la nouvelle action à synchroniser
     */
    this.mergeDocumentForDeleteAction = function(existing, newItem) {
        if(existing.action === 'rename' || existing.action === 'update_rename'){
            //on récupère le nom actuellement présent sur le serveur, puisque cette action n'est pas encore synchronisé
            existing.docName = existing.oldDocName;
        }
        existing.action = newItem.action;
    };

    /**
     * Cette fonction fusionne la nouvelle action(rename) avec celle existante
     * et portant sur le même document
     * 
     * @param existing:
     *            l'élement existant à synchroniser
     * @param newItem:
     *            la nouvelle action à synchroniser
     */
    this.mergeDocumentForRenameAction = function(existing, newItem) {
        if (existing.action === 'update') {
            // On ajoute les données pour la nouvelle action résultante:
            // 'update_rename'
            existing.action = 'update_rename';
            existing.oldDocName = newItem.oldDocName;
        }
            // on remplace l'ancien renomage par le plus récent
            existing.newDocName = newItem.newDocName;
            existing.dateModification = newItem.dateModification;
    };

    /**
     * Cette fonction fusionne la nouvelle action(update) avec celle existante
     * et portant sur le même document
     * 
     * @param existing:
     *            l'élement existant à synchroniser
     * @param newItem:
     *            la nouvelle action à synchroniser
     */
    this.mergeDocumentForUpdateAction = function(existing, newItem) {
        if (existing.action === 'rename') {
            // On ajoute les données pour la nouvelle action résultante:
            // 'update_rename'
            existing.action = 'update_rename';
        }
            // on remplace l'ancien contenu de l'update par la plus récent
        existing.content = newItem.content;
        existing.dateModification = newItem.dateModification;
    };

    /**
     * La fonction recherche un document à synchronisé déjà existant sur lequel
     * porte la nouvelle action(update, delete) à synchroniser
     * 
     * @param docToSyncArray:
     *            la liste des éléments existant à synchroniser
     * @param documentToSynchronize:
     *            le nouvel élément à synchroniser
     * @returns existing: l'indice dans le tableau de l'élement correspondant
     */
    this.existingDocumentAction = function(docToSyncArray, documentToSynchronize) {
        var existing;
        for (var i = 0; i < docToSyncArray.length; i++) {
            if (docToSyncArray[i].action === 'rename' && decodeURIComponent(docToSyncArray[i].newDocName) === decodeURIComponent(documentToSynchronize.docName)) {
                existing = i;
                break;
            } else if (docToSyncArray[i].action === 'update' && decodeURIComponent(docToSyncArray[i].docName) === decodeURIComponent(documentToSynchronize.docName)) {
                existing = i;
                break;
            } else if (docToSyncArray[i].action === 'update_rename' && decodeURIComponent(docToSyncArray[i].newDocName) === decodeURIComponent(documentToSynchronize.docName)){
                existing = i;
                break;
            }
        }
        return existing;
    };

    /**
     * La fonction recherche un document à synchronisé déjà existant sur lequel
     * porte la nouvelle action(rename) à synchroniser
     * 
     * @param docToSyncArray:
     *            la liste des éléments existant à synchroniser
     * @param documentToSynchronize:
     *            le nouvel élément à synchroniser
     * @returns existing: l'indice dans le tableau de l'élement correspondant
     */
    this.existingDocumentForRenameAction = function(docToSyncArray, documentToSynchronize) {
        var existing;
        for (var i = 0; i < docToSyncArray.length; i++) {
            if (docToSyncArray[i].action === 'rename' && decodeURIComponent(docToSyncArray[i].newDocName) === decodeURIComponent(documentToSynchronize.oldDocName)) {
                existing = i;
                break;
            } else if (docToSyncArray[i].action === 'update' && decodeURIComponent(docToSyncArray[i].docName) === decodeURIComponent(documentToSynchronize.oldDocName)) {
                existing = i;
                break;
            } else if (docToSyncArray[i].action === 'update_rename' && decodeURIComponent(docToSyncArray[i].newDocName) === decodeURIComponent(documentToSynchronize.oldDocName)){
                existing = i;
                break;
            }
        }
        return existing;
    };
    /**
     * Ajoute un document à la liste des documents à synchroniser.
     * 
     * @param documentToSynchronize :
     *            {docName, newDocName (pour renommage), action
     *            (update/rename/delete), content}. Pour la création d'un
     *            document, utiliser update comme action.
     */
    this.storeDocumentToSynchronize = function(documentToSynchronize) {
        $localForage.getItem('docToSync').then(function(docToSyncArray) {
            if (!docToSyncArray) {
                docToSyncArray = [];
            } else {
                var existingElementToSynchronize;
                // rechercher un élément à synchroniser portant sur le même
                // élément que celui en cours de sycnhronisation.
                if (documentToSynchronize.action === 'rename') {
                    existingElementToSynchronize = self.existingDocumentForRenameAction(docToSyncArray, documentToSynchronize);
                } else {
                    existingElementToSynchronize = self.existingDocumentAction(docToSyncArray, documentToSynchronize);
                }

                // Cas d'une action précédente et portant sur le même élément a
                // été trouvé
                if (existingElementToSynchronize !== undefined) {
                    var i = existingElementToSynchronize;
                    switch (documentToSynchronize.action) {
                    case 'update':
                        self.mergeDocumentForUpdateAction(docToSyncArray[i], documentToSynchronize);
                        break;
                    case 'delete':
                            if(docToSyncArray[i].creation && docToSyncArray[i].creation === true){
                                docToSyncArray.splice(i,1);
                            } else {
                                self.mergeDocumentForDeleteAction(docToSyncArray[i], documentToSynchronize);
                            }
                        break;
                    case 'rename':
                        self.mergeDocumentForRenameAction(docToSyncArray[i], documentToSynchronize);
                        break;
                    }
                    // MAJ après fusionnage des actions en une seule.
                    return $localForage.setItem('docToSync', docToSyncArray);
                }
            }
            // Cas d'une action sans précédent portant sur le même élément.
            docToSyncArray.push(documentToSynchronize);
            return $localForage.setItem('docToSync', docToSyncArray);
        });
    };

    /**
     * Ajoute un profil à la liste des profiles à synchroniser.
     * 
     * @param profilToSynchronize : {
     *            profil, action (create/update/delete), profilTags }
     */
    this.storeProfilToSynchronize = function(profilToSynchronize) {
        return $localForage.getItem('profilesToSync').then(function(profilesToSyncArray) {
            if (!profilesToSyncArray) {
                profilesToSyncArray = [];
            }
            profilesToSyncArray.push(profilToSynchronize);
            return $localForage.setItem('profilesToSync', profilesToSyncArray);
        });
    };
    /**
     * Ajoute la liste des tags au profil à synchroniser ou crée une liste de
     * tag à appliqué à un profil.
     * 
     * @param profilToSynchronize : {
     *            profil, action (create/update/delete), profilTags }
     */
    this.storeTagToSynchronize = function(profilToSynchronize) {
        return $localForage.getItem('profilesToSync').then(function(profilesToSyncArray) {
            if (!profilesToSyncArray) {
                profilesToSyncArray = [];

            } else {
                for (var a = 0; a < profilesToSyncArray.length; a++) {
                    if (profilesToSyncArray[a].profil._id === profilToSynchronize.profil._id && profilesToSyncArray[a].profilTags === null) {
                        profilesToSyncArray[a].profilTags = profilToSynchronize.profilTags;
                        return $localForage.setItem('profilesToSync', profilesToSyncArray);
                    }
                }
            }
            profilesToSyncArray.push(profilToSynchronize);
            return $localForage.setItem('profilesToSync', profilesToSyncArray);
        });
    };

});