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
cnedApp.service('synchronisationService', function($localForage, fileStorageService, profilsService, configuration, dropbox, $q) {

    var self = this;

    /**
     * Lance la synchronisation des documents et des profils.
     * 
     * @param compteId
     *            l'identifiant du compte
     * @param token :
     *            le token dropbox
     */
    this.sync = function(compteId, token, owner) {
        var syncOperations = [];
        var synchronizedItems = {
            docsSynchronized : [],
            profilsSynchronized : []
        };
        syncOperations.push(this.syncDocuments(token, synchronizedItems, owner));
        syncOperations.push(this.syncProfils(synchronizedItems, owner));
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
    this.syncDocuments = function(token, synchronizedItems, owner) {
        return $localForage.getItem('docToSync').then(function(data) {
            var docArray = data;
            var myDocsArray = [];
            var operations = [];
            var rejectedItems = [];
            if (docArray) {
                for (var i = 0; i < docArray.length; i++) {
                    // synchroniser uniquement les données du user actuellement
                    // connecté
                    if (docArray[i].owner.indexOf(owner) > -1) {
                        var docItem = docArray[i];
                        myDocsArray.push(docItem);
                        self.syncDocument(token, docItem, operations, rejectedItems);
                    }
                }
            }
            return $q.all(operations).then(function() {
                if (!rejectedItems || !rejectedItems.length) {
                    angular.forEach(myDocsArray, function(item) {
                        synchronizedItems.docsSynchronized.push(item);
                    });
                    //MAJ la liste des documents à synchroniser
                    angular.forEach(myDocsArray, function(item) {
                        docArray.splice(docArray.indexOf(item), 1);
                    });
                    return $localForage.setItem('docToSync', docArray);
                } else {
                    // remove rejectedItems from list.
                    angular.forEach(rejectedItems, function(item) {
                        myDocsArray.splice(myDocsArray.indexOf(item), 1);
                    });
                    angular.forEach(myDocsArray, function(item) {
                        synchronizedItems.docsSynchronized.push(item);
                    });
                    
                    //MAJ de la liste des documents restant à synchroniser
                    angular.forEach(myDocsArray, function(item) {
                        docArray.splice(docArray.indexOf(item), 1);
                    });
                    return $localForage.setItem('docToSync', docArray);
                }
            }, function() {
                // remove rejectedItems from list.
                angular.forEach(rejectedItems, function(item) {
                    myDocsArray.splice(myDocsArray.indexOf(item), 1);
                });
                angular.forEach(myDocsArray, function(item) {
                    synchronizedItems.docsSynchronized.push(item);
                });
                //MAJ de la liste des documents restant à synchroniser
                angular.forEach(myDocsArray, function(item) {
                    docArray.splice(docArray.indexOf(item), 1);
                });
                return $localForage.setItem('docToSync', docArray);
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
            operations.push(fileStorageService.searchFiles(true, docItem.docName, token).then(function(files) {
                if (!files || !files.length || files[0].dateModification < docItem.dateModification) {
                    return fileStorageService.saveFile(true, docItem.docName, docItem.content, token, true).then(null, function() {
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
            operations.push(fileStorageService.searchFiles(true, docItem.docName, token).then(function(files) {
                if (files && files.length > 0) {
                    return fileStorageService.deleteFile(true, docItem.docName, token, true).then(null, function() {
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
        if (docItem.action === 'rename') {
            operations.push(fileStorageService.searchFiles(true, docItem.oldDocName, token).then(function(files) {
                //si le document à renommer existe dans une version antérieur à celle ci.
                if (files && files.length && files[0].dateModification < docItem.dateModification) {
                    return fileStorageService.renameFile(true, docItem.oldDocName, docItem.newDocName, token, true).then(null, function() {
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
        if (docItem.action === 'update_rename') {
            operations.push(fileStorageService.searchFiles(true, docItem.docName, token).then(function(files) {
                if (!files || !files.length || files[0].dateModification < docItem.dateModification) {
                    return fileStorageService.saveFile(true, docItem.docName, docItem.content, token, true).then(function() {
                        return fileStorageService.renameFile(true, docItem.docName, docItem.newDocName, token, true).then(null, function() {
                            // puisque l'upload a été fait ajouté que le
                            // renomage à synchroniser
                            docItem.action = 'rename';
                            rejectedItems.push(docItem);
                        });
                    }, function() {
                        rejectedItems.push(docItem);
                    });
                } else {
                    return fileStorageService.renameFile(true, docItem.docName, docItem.newDocName, token, true).then(null, function() {
                        // puisque l'upload a été fait ajouté que le renomage à
                        // synchroniser
                        docItem.action = 'rename';
                        rejectedItems.push(docItem);
                    });
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
    this.syncProfils = function(synchronizedItems, owner) {
        return $localForage.getItem('profilesToSync').then(function(data) {
            var profilesArray = data;
            var myProfilesArray = [];
            var operations = [];
            var rejectedItems = [];
            if (profilesArray) {
                for (var i = 0; i < profilesArray.length; i++) {
                    if (profilesArray[i].owner.indexOf(owner) > -1) {
                        var profileItem = profilesArray[i];
                        myProfilesArray.push(profileItem);
                        self.syncProfil(profileItem, operations, rejectedItems);
                    }
                }
            }
            return $q.all(operations).then(function() {
                if (!rejectedItems || !rejectedItems.length) {
                    angular.forEach(myProfilesArray, function(item) {
                        synchronizedItems.profilsSynchronized.push(item);
                    });
                    
                    //MAJ la liste des profiles à synchroniser
                    angular.forEach(myProfilesArray, function(item) {
                        profilesArray.splice(profilesArray.indexOf(item), 1);
                    });
                    return $localForage.setItem('profilesToSync', profilesArray);
                } else {
                    // remove rejectedItems from list.
                    angular.forEach(rejectedItems, function(item) {
                        myProfilesArray.splice(myProfilesArray.indexOf(item), 1);
                    });
                    angular.forEach(myProfilesArray, function(item) {
                        synchronizedItems.profilsSynchronized.push(item);
                    });
                    //MAJ la liste des profiles à synchroniser
                    angular.forEach(myProfilesArray, function(item) {
                        profilesArray.splice(profilesArray.indexOf(item), 1);
                    });
                    return $localForage.setItem('profilesToSync', profilesArray);
                }

            }, function() {
                // remove rejectedItems from list.
                angular.forEach(rejectedItems, function(item) {
                    myProfilesArray.splice(myProfilesArray.indexOf(item), 1);
                });
                angular.forEach(myProfilesArray, function(item) {
                    synchronizedItems.profilsSynchronized.push(item);
                });
                //MAJ la liste des profiles à synchroniser
                angular.forEach(myProfilesArray, function(item) {
                    profilesArray.splice(profilesArray.indexOf(item), 1);
                });
                return $localForage.setItem('profilesToSync', profilesArray);
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
            operations.push(profilsService.lookForExistingProfile(true, profileItem.profil).then(function(res) {
                if (!res) {
                    return profilsService.addProfil(true, profileItem.profil, profileItem.profilTags).then(function() {
                        $localForage.removeItem('profilTags.' + profileItem.profil.nom);
                        $localForage.removeItem('profil.' + profileItem.profil.nom);
                    }, function() {
                        rejectedItems.push(profileItem);
                        var deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    });
                } else {
                    // TODO store for synchronisation result's popup
                    $localForage.removeItem('profilTags.' + profileItem.profil.nom);
                    $localForage.removeItem('profil.' + profileItem.profil.nom);
                    return $localForage.setItem('profil.' + res._id, res).then(function() {
                        return res;
                    });
                }
            }));
        } else if (profileItem.action === 'update') {
            operations.push(profilsService.lookForExistingProfile(true, profileItem.profil).then(function(res) {
                if (!res || res.updated < profileItem.profil.updated) {
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
                    return $localForage.setItem('profil.' + res._id, res).then(function() {
                        return res;
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