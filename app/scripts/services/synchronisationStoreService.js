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
 * the synchronization service when the user becomes connected again.
 */
cnedApp.service('synchronisationStoreService', function($localForage) {
    var self = this;
     /**
     * 
     * The function looks for a profile to be synchronized,
     * already existing, which concerns the new action(update, delete) to synchronize
     * 
     * @param profilesToSyncArray:
     *            the list of existing items to synchronize
     * @param profilToSynchronize:
     *            the new item to be synchronized
     * @returns existing: the index in the table of the corresponding element
     */
    this.existingProfilAction = function(profilesToSyncArray, profilToSynchronize) {
        var existing;
        for (var i = 0; i < profilesToSyncArray.length; i++) {
         // make sure that it is the same user performing the action ' to synchronize' on the same profile.
            if (profilesToSyncArray[i].profil._id === profilToSynchronize.profil._id && profilToSynchronize.owner.indexOf(profilesToSyncArray[i].owner) > -1) {
                existing = i;
                break;
            }
        }
        return existing;
    };

     /**
     * This function merges the new action (delete) with the existing one 
     * and concerning the same profile
     * 
     * @param existing:
     *            The existing item to be synchronized.
     * @param newItem:
     *            The new action to be synchronized.
     */
    this.mergeProfilForDeleteAction = function(existing, newItem) {
        // The call is made only in the case of an update .
        // We cancels the update and we keep the suppression
        existing.action = newItem.action;
    };

    /**
     * This function merges the new action(update ) with the existing one 
     * and concerning the same Profile
     * @param existing:
     *            The existing item to be synchronized.
     * @param newItem:
     *            The new action to be synchronized.
     */
    this.mergeProfilForUpdateAction = function(existing, newItem) {
        // If the existing item is either a create or an update,
        // we update the informations by the most recent
        existing.profilTags = newItem.profilTags;
        existing.profil = newItem.profil;
        existing.updated = newItem.updated;
    };

    /**
     * This function merges the new action (delete) with the existing one 
     * and concerning the same Document
     * 
     * @param existing:
     *            The existing item to be synchronized.
     * @param newItem:
     *             The new action to be synchronized.
     */
    this.mergeDocumentForDeleteAction = function(existing, newItem) {
        if (existing.action === 'rename' || existing.action === 'update_rename') {
            // We get the currently name present on the server,
            // since this action is not yet synchronized.
            existing.docName = existing.oldDocName;
        }
        existing.action = newItem.action;
    };

    /**
     * This function merges the new action (rename) with existing one 
     * and concerning the same profile
     * 
     * @param existing:
     *            The existing item to be synchronized.
     * @param newItem:
     *            The new action to be synchronized.
     */
    this.mergeDocumentForRenameAction = function(existing, newItem) {
        if (existing.action === 'update') {
             // We add the data to the new resulting action:
            // 'update_rename'
            existing.action = 'update_rename';
            existing.oldDocName = newItem.oldDocName;
        }
         // We replace the old renaming by the most recent
        existing.newDocName = newItem.newDocName;
        existing.dateModification = newItem.dateModification;
    };

    /**
     * 
     * This function merges the new action (update) with the existing one 
     * and concerning the same document
     * @param existing:
     *            The existing item to be synchronized.
     * @param newItem:
     *            The new action to be synchronized.
     */
    this.mergeDocumentForUpdateAction = function(existing, newItem) {
        if (existing.action === 'rename') {
            // We add the data to the new resulting action:
            // 'update_rename'
            existing.action = 'update_rename';
        }
        // We replace the old contents of the update by the most recent.
        existing.content = newItem.content;
        existing.dateModification = newItem.dateModification;
    };

    /**
     * The function looks for a document to be synchronized, 
     * already existing, which concerns the new action(update, delete) to synchronize.
     * 
     * @param docToSyncArray:
     *            the list of existing items to be synchronized
     * @param documentToSynchronize:
     *            the new item to be synchronized
     * @returns existing: the index in the table of the corresponding element
     */
    this.existingDocumentAction = function(docToSyncArray, documentToSynchronize) {
        var existing;
        for (var i = 0; i < docToSyncArray.length; i++) {
        //make sure it is the same user performing the action 'synchronize'
            if(docToSyncArray[i].owner.indexOf(documentToSynchronize.owner) > -1){
                if (docToSyncArray[i].action === 'rename' && decodeURIComponent(docToSyncArray[i].newDocName) === decodeURIComponent(documentToSynchronize.docName)) {
                    existing = i;
                    break;
                } else if (docToSyncArray[i].action === 'update' && decodeURIComponent(docToSyncArray[i].docName) === decodeURIComponent(documentToSynchronize.docName)) {
                    existing = i;
                    break;
                } else if (docToSyncArray[i].action === 'update_rename' && decodeURIComponent(docToSyncArray[i].newDocName) === decodeURIComponent(documentToSynchronize.docName)) {
                    existing = i;
                    break;
                }
            }
        }
        return existing;
    };

    /**
     * The function looks for a document to be synchronized, 
     * already existing, which concerns the new action(rename) to synchronize.
     * 
     * @param docToSyncArray:
     *            the list of existing items to be synchronized
     * @param documentToSynchronize:
     *            the new item to be synchronized
     * @returns existing:the index in the table of the corresponding element
     */
    this.existingDocumentForRenameAction = function(docToSyncArray, documentToSynchronize) {
        var existing;
        for (var i = 0; i < docToSyncArray.length; i++) {
            //make sure it is the same user performing the action 'synchronize'
            if(docToSyncArray[i].owner.indexOf(documentToSynchronize.owner) > -1){
                if (docToSyncArray[i].action === 'rename' && decodeURIComponent(docToSyncArray[i].newDocName) === decodeURIComponent(documentToSynchronize.oldDocName)) {
                    existing = i;
                    break;
                } else if (docToSyncArray[i].action === 'update' && decodeURIComponent(docToSyncArray[i].docName) === decodeURIComponent(documentToSynchronize.oldDocName)) {
                    existing = i;
                    break;
                } else if (docToSyncArray[i].action === 'update_rename' && decodeURIComponent(docToSyncArray[i].newDocName) === decodeURIComponent(documentToSynchronize.oldDocName)) {
                    existing = i;
                    break;
                }
            }
        }
        return existing;
    };
    /**
     * Add a document to the list of documents to be synchronized.
     * 
     * @param documentToSynchronize :
     *            {docName, newDocName (for renaming), action
     *            (update/rename/delete), content}. 
     *            To create a document, use update as action.
     */
    this.storeDocumentToSynchronize = function(documentToSynchronize) {
        $localForage.getItem('docToSync').then(function(docToSyncArray) {
            if (!docToSyncArray) {
                docToSyncArray = [];
            } else {
                var existingElementToSynchronize;
                // search for an item to be synchronized concerning the same element as that being sycnhronisation
                if (documentToSynchronize.action === 'rename') {
                    existingElementToSynchronize = self.existingDocumentForRenameAction(docToSyncArray, documentToSynchronize);
                } else {
                    existingElementToSynchronize = self.existingDocumentAction(docToSyncArray, documentToSynchronize);
                }

                  // Case of a previous action and concerning the same element was found.
                if (existingElementToSynchronize !== undefined) {
                    var i = existingElementToSynchronize;
                    switch (documentToSynchronize.action) {
                    case 'update':
                        self.mergeDocumentForUpdateAction(docToSyncArray[i], documentToSynchronize);
                        break;
                    case 'delete':
                        if (docToSyncArray[i].creation && docToSyncArray[i].creation === true) {
                            docToSyncArray.splice(i, 1);
                        } else {
                            self.mergeDocumentForDeleteAction(docToSyncArray[i], documentToSynchronize);
                        }
                        break;
                    case 'rename':
                        self.mergeDocumentForRenameAction(docToSyncArray[i], documentToSynchronize);
                        break;
                    }
                    // The update after the merge of the actions into one
                    return $localForage.setItem('docToSync', docToSyncArray);
                }
            }
            // Case of an unprecedented action concerning the same element.
            docToSyncArray.push(documentToSynchronize);
            return $localForage.setItem('docToSync', docToSyncArray);
        });
    };

     /**
     * Add a profile to the list of profile to synchronize.
     * 
     * @param profilToSynchronize : {
     *            profil, action (create/update/delete), profilTags }
     */
    this.storeProfilToSynchronize = function(profilToSynchronize) {
        return $localForage.getItem('profilesToSync').then(function(profilesToSyncArray) {
            if (!profilesToSyncArray) {
                profilesToSyncArray = [];
            } else {
               // Nothing to do, it is a new action on a new item . 
                // We add
                if(profilToSynchronize.action !== 'create'){
                    var i = self.existingProfilAction(profilesToSyncArray, profilToSynchronize);
                    if (i !== undefined) {
                        switch (profilToSynchronize.action) {
                        case 'update':
                            self.mergeProfilForUpdateAction(profilesToSyncArray[i], profilToSynchronize);
                            break;
                        case 'delete':
                            if (profilesToSyncArray[i].action === 'create') {
                                profilesToSyncArray.splice(i, 1);
                            } else {
                                self.mergeProfilForDeleteAction(profilesToSyncArray[i], profilToSynchronize);
                            }
                            break;
                        }
                        return $localForage.setItem('profilesToSync', profilesToSyncArray);
                    }
                }
            }
            profilesToSyncArray.push(profilToSynchronize);
            return $localForage.setItem('profilesToSync', profilesToSyncArray);
        });
    };
     /**
     * 
     * Add the list of tags to the profile to be synchronized 
     * or creates a list of tag to be applied to a profile.
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
                    if (profilesToSyncArray[a].profil._id === profilToSynchronize.profil._id && profilesToSyncArray[a].owner.indexOf(profilToSynchronize.owner) > -1 && profilesToSyncArray[a].profilTags === null) {
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