/*File: synchronisationService.js
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
cnedApp.service('synchronisationService', function($localForage, fileStorageService, profilsService, configuration, dropbox, $q, $rootScope, $http) {

    var self = this;

    /**
     * Lance la synchronisation des documents et des profils.
     * 
     * @param compteId
     *            l'identifiant du compte
     * @param token :
     *            le token dropbox
     */
    this.sync = function(compteId, token) {
        var syncOperations = [];
        var synchronizedItems = {
            docsSynchronized : [],
            profilsSynchronized : []
        }
        var docsSynchronized = []
        syncOperations.push(this.syncDocuments(token, synchronizedItems));
        syncOperations.push(this.syncProfils(synchronizedItems));
        return $q.all(syncOperations).then(function() {
            return synchronizedItems;
        });
    };

    /**
     * Synchronise les documents.
     * 
     * @param le
     *            token d'accès à dropbox
     */
    this.syncDocuments = function(token, synchronizedItems) {
        return $localForage.getItem('docToSync').then(function(data) {
            var docArray = data;
            var operations = [];
            var rejectedItems = [];
            if (docArray) {
                for (var i = 0; i < docArray.length; i++) {
                    var docItem = docArray[i];
                    self.syncDocument(token, docItem, operations, rejectedItems);
                }
            }
            return $q.all(operations).then(function() {
                if (!rejectedItems || !rejectedItems.length) {
                    angular.forEach(docArray, function(item) {
                        synchronizedItems.docsSynchronized.push(item);
                    });
                    return $localForage.removeItem('docToSync');
                } else {
                    // remove rejectedItems from list.
                    angular.forEach(rejectedItems, function(item) {
                        docArray.splice(docArray.indexOf(item), 1);
                    });
                    angular.forEach(docArray, function(item) {
                        synchronizedItems.docsSynchronized.push(item);
                    });
                    return $localForage.setItem('docToSync', rejectedItems);
                }
            }, function() {
                // remove rejectedItems from list.
                angular.forEach(rejectedItems, function(item) {
                    docArray.splice(docArray.indexOf(item), 1);
                });
                angular.forEach(docArray, function(item) {
                    synchronizedItems.docsSynchronized.push(item);
                });
                return $localForage.setItem('docToSync', rejectedItems);
            });
        });
    };

    /**
     * Synchronise un document.
     * 
     * @param le
     *            token d'accès à dropbox
     * @param docItem
     *            le document
     * @param operations
     *            la liste des opérations de synchronisation
     * @param rejectedItems
     *            la liste des opérations rejetées
     */
    this.syncDocument = function(token, docItem, operations, rejectedItems) {
        if (docItem.action === 'update') {
            // TODO ajouter gestion des dates avec une recherche si le document
            operations.push(fileStorageService.searchFiles(true, docItem.docName, token).then(function(files) {
                if (!files || !files.length || files[0].dateModification < docItem.dateModification) {
                    return fileStorageService.saveFile(true, docItem.docName, docItem.content, token).then(null, function() {
                        rejectedItems.push(docItem);
                    });
                } else {
                    // TODO store for synchronisation result's popup
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            }));
        }
        if (docItem.action === 'delete') {
            operations.push(fileStorageService.deleteFile(true, docItem.docName, token).then(null, function() {
                rejectedItems.push(docItem);
            }));
        }
        if (docItem.action === 'rename') {
            operations.push(fileStorageService.searchFiles(true, docItem.oldDocName, token).then(function(files) {
                if (!files || !files.length || files[0].dateModification < docItem.dateModification) {
                    return fileStorageService.renameFile(true, docItem.oldDocName, docItem.newDocName, token).then(null, function() {
                        rejectedItems.push(docItem);
                    });
                } else {
                    // TODO store for synchronisation result's popup
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            }));
        }
    };

    /**
     * Synchronise les profils.
     * 
     * @param compteId
     *            l'identifiant du compte client
     */
    this.syncProfils = function(synchronizedItems) {
        return $localForage.getItem('profilesToSync').then(function(data) {
            var profilesArray = data;
            var operations = [];
            var rejectedItems = [];
            if (profilesArray) {
                for (var i = 0; i < profilesArray.length; i++) {
                    var profileItem = profilesArray[i];
                    self.syncProfil(profileItem, operations, rejectedItems);
                }
            }
            return $q.all(operations).then(function() {
                if (!rejectedItems || !rejectedItems.length) {
                    angular.forEach(profilesArray, function(item) {
                        synchronizedItems.profilsSynchronized.push(item);
                    });
                    return $localForage.removeItem('profilesToSync');
                } else {
                    // remove rejectedItems from list.
                    angular.forEach(rejectedItems, function(item) {
                        profilesArray.splice(profilesArray.indexOf(item), 1);
                    });
                    angular.forEach(profilesArray, function(item) {
                        synchronizedItems.profilsSynchronized.push(item);
                    });
                    return $localForage.setItem('profilesToSync', rejectedItems);
                }

            }, function() {
                // remove rejectedItems from list.
                angular.forEach(rejectedItems, function(item) {
                    profilesArray.splice(profilesArray.indexOf(item), 1);
                });
                angular.forEach(profilesArray, function(item) {
                    synchronizedItems.profilsSynchronized.push(item);
                });
                return $localForage.setItem('profilesToSync', rejectedItems);
            });
        });
    };

    /**
     * Synchronise un profil.
     * 
     * @param profileItem
     *            le profil
     * @param operations
     *            la liste des opérations de synchronisation
     * @param rejectedItems
     *            la liste des opérations rejetées
     */
    this.syncProfil = function(profileItem, operations, rejectedItems) {
        if (profileItem.action === 'create') {
            // supprimer les données ajouté pour l'affichage des données ajouté
            // en hors lignes.
            delete profileItem.profil._id;
            delete profileItem.profil.type;
            angular.forEach(profileItem.profilTags, function(tags) {
                delete tags._id;
                delete tags.tag;
            }, []);
            operations.push(profilsService.addProfil(true, profileItem.profil, profileItem.profilTags).then(function() {
                $localForage.removeItem('profilTags.' + profileItem.profil.nom);
                $localForage.removeItem('profil.' + profileItem.profil.nom);
            }, function() {
                rejectedItems.push(profileItem);
            }));
        } else if (profileItem.action === 'update') {
            operations.push(profilsService.lookForExistingProfile(profileItem.profil).then(function(res) {
                if (!res.data || res.data.updated < profileItem.profil.updated) {
                    return profilsService.updateProfil(true, profileItem.profil).then(function() {
                        return profilsService.updateProfilTags(true, profileItem.profil, profileItem.profilTags);
                    }, function() {
                        rejectedItems.push(profileItem);
                        var deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    });
                } else {
                    // TODO store for synchronisation result's popup
                    return $localForage.setItem('profil.' + res.data._id, res.data).then(function() {
                        return res.data;
                    });
                }
            }));
        } else if (profileItem.action === 'delete') {
            operations.push(profilsService.deleteProfil(true, localStorage.getItem('compteId'), profileItem.profil._id).then(null, function() {
                rejectedItems.push(profileItem);
            }));
        }
    };
});