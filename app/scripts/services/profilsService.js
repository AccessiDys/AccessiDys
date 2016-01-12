/*File: tagsService.js
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

cnedApp.service('profilsService', function($http, configuration, fileStorageService, $localForage, synchronisationStoreService) {

    var self = this;

    /**
     * Recupere l'url du css pour le profil actuel
     * 
     * @method getUrl
     */
    this.getUrl = function() {
        var token = localStorage.getItem('compteId');
        var id = JSON.parse(localStorage.getItem('profilActuel'))._id.toString();
        var url = configuration.URL_REQUEST + '/cssProfil/' + id + '?id=' + token;

        return $http({
            url : url,
            method : 'GET',
            responseType : 'blob'
        }).then(function(response) {
            url = URL.createObjectURL(response.data);
            return fileStorageService.saveCSSInStorage(url, id);
        }, function() {
            return fileStorageService.getCSSInStorage(id);
        }).then(function() {
            return fileStorageService.getCSSInStorage(id);
        });
    };

    /**
     * Met à jour le profil donné.
     * 
     * @param profil :
     *            le profil à mettre à jour
     */
    this.updateProfil = function(online, profil) {
        var data = {
            id : localStorage.getItem('compteId'),
            updateProfile : profil
        };

        if (online) {
            data.updateProfile.updated = new Date();
            return $http.post(configuration.URL_REQUEST + '/updateProfil', data).then(function(result) {
                return $localForage.setItem('profil.' + result.data._id, result.data).then(function() {
                    return result.data;
                });
            });
        } else {
            profil.updated = new Date();
            return synchronisationStoreService.storeProfilToSynchronize({
                action : 'update',
                profil : profil,
                profilTags : null
            }).then(function() {
                return self.updateListProfilInCache(profil);
            });
        }

    };

    /**
     * Ajoute le profil donné.
     * 
     * @param profil :
     *            le profil à mettre à jour
     */
    this.addProfil = function(online, profile, profilTags) {
        var profil = profile;
        if (!profil.updated) {
            profil.updated = new Date();
        }
        var data = {
            id : localStorage.getItem('compteId'),
            newProfile : profil
        };
        if (online) {
                return $http.post(configuration.URL_REQUEST + '/ajouterProfils', data).then(function(result) {
                    return self.updateProfilTags(online, result.data, profilTags).then(function() {
                        return self.addProfilInCache(result.data).then(function() {
                            return result.data;
                        });

                    });
                });
        } else {
            // ajout d'un identifiant temporaire
            profil._id = profil.nom;
            profil.updated = new Date();
            // ajout des type pour l'affichage
            profil.type = 'profile';
            angular.forEach(profilTags, function(tags) {
                tags._id = tags.id_tag;
                tags.tag = tags.id_tag;
            }, []);

            return synchronisationStoreService.storeProfilToSynchronize({
                action : 'create',
                profil : profil,
                profilTags : profilTags
            }).then(function() {
                return self.addProfilInCache(profil).then(function() {
                    return self.updateProfilTagsInCache(profil._id, profilTags).then(function() {
                        return profil;
                    });
                });
            });
        }

    };

    this.addProfilInCache = function(profil) {
        return $localForage.getItem('listProfils').then(function(data) {
            var listProfil = data;
            if (!listProfil) {
                listProfil = [];
            }
            listProfil.push(profil);
            $localForage.setItem('listProfils', listProfil);
            return $localForage.setItem('profil.' + profil._id, profil);
        });
    };

    /**
     * Supprime le profil donné.
     * 
     * @param ownerId :
     *            le propriétaire du profil
     * @param profil :
     *            le profil à mettre à jour
     */
    this.deleteProfil = function(online, ownerId, profilId) {
        var data = {
            id : localStorage.getItem('compteId'),
            removeProfile : {
                profilID : profilId,
                userID : ownerId
            }
        };
        if (online) {
            return $http.post(configuration.URL_REQUEST + '/deleteProfil', data).then(function(result) {
                return $localForage.removeItem('profil.' + profilId).then(function() {
                    return result.data;
                }).then(function() {
                    return $localForage.removeItem('profilTags.' + profilId);
                });
            });
        } else {
            return synchronisationStoreService.storeProfilToSynchronize({
                action : 'delete',
                profil : {
                    _id : profilId
                },
                profilTags : null
            }).then(function() {
                return $localForage.removeItem('profil.' + profilId).then(function() {
                    return '200'; // Code retournée en cas de succès de la
                    // suppression.
                }).then(function() {
                    return $localForage.getItem('listProfils').then(function(data) {
                        var listProfil = data;
                        if (!listProfil) {
                            listProfil = [];
                        }
                        var tagToRemove;
                        var profilToRemove;
                        for (var i = 0; i < listProfil.length; i++) {
                            if (listProfil[i].type === 'tags' && listProfil[i].idProfil === profilId) {
                                tagToRemove = i;
                            }
                            if (listProfil[i].type === 'profile' && listProfil[i]._id === profilId) {
                                profilToRemove = i;
                            }
                        }
                        if (tagToRemove !== undefined) {
                            listProfil.splice(tagToRemove, 1);
                        }
                        if (profilToRemove !== undefined) {
                            listProfil.splice(profilToRemove, 1);
                        }
                        $localForage.setItem('listProfils', listProfil);
                        return $localForage.removeItem('profilTags.' + profilId);
                    });

                });
            });
        }
    };

    /**
     * Modifie les styles à un profil.
     * 
     * @param profilId :
     *            le profil
     * @param tags :
     *            les styles associés au profil
     */
    this.updateProfilTags = function(online, profil, profilTags) {
        if (online) {
            return $http.post(configuration.URL_REQUEST + '/setProfilTags', {
                id : localStorage.getItem('compteId'),
                profilID : profil._id,
                profilTags : profilTags
            }).then(function() {
                return self.updateProfilTagsInCache(profil._id, profilTags);
            });
        } else {
            return synchronisationStoreService.storeTagToSynchronize({
                action : 'update',
                profil : profil,
                profilTags : profilTags
            }).then(function() {
                return self.updateProfilTagsInCache(profil._id, profilTags);
            });
        }
    };

    /**
     * Modifie les styles à un profil dans le cache.
     * 
     * @param profilId :
     *            le profil
     * @param tags :
     *            les styles associés au profil
     */
    this.updateProfilTagsInCache = function(profilId, profilTags) {
        return $localForage.getItem('listProfils').then(function(data) {
            // construire un format de donnée qui pourra être affiché en mode
            // déconnecté.
            angular.forEach(profilTags, function(tags) {
                tags._id = tags.id_tag;
                tags.tag = tags.id_tag;
            }, []);
            var listProfil = data;
            if (!listProfil) {
                listProfil = [];
            }
            var keyToRemove;
            for (var i = 0; i < listProfil.length; i++) {
                if (listProfil[i].type === 'tags' && listProfil[i].idProfil === profilId) {
                    keyToRemove = i;
                    break;
                }
            }
            if (keyToRemove !== undefined) {
                listProfil[keyToRemove] = {
                    idProfil : profilId,
                    tags : profilTags,
                    type : 'tags'
                };
            } else {
                listProfil.push({
                    idProfil : profilId,
                    tags : profilTags,
                    type : 'tags'
                });
            }
            $localForage.setItem('listProfils', listProfil);
            return $localForage.setItem('profilTags.' + profilId, profilTags);
        });
    };

    /**
     * Récupère la liste des profils de l'utilisateur donné.
     */
    this.getProfilsByUser = function() {
        return $http.get(configuration.URL_REQUEST + '/listeProfils', {
            params : {
                id : localStorage.getItem('compteId')
            }
        }).then(function(result) {
            for (var i = 0; i < result.data.length; i++) {
                var profilItem = result.data[i];
                if (profilItem.type === 'profile') {
                    $localForage.setItem('profil.' + profilItem._id, profilItem);
                } else if (profilItem.type === 'tags') {
                    $localForage.setItem('profilTags.' + profilItem.idProfil, profilItem.tags);
                }
            }
            return $localForage.setItem('listProfils', result.data).then(function() {
                return result.data;
            });
        }, function() {
            return $localForage.getItem('listProfils');
        });
    };

    /**
     * Récupère la liste des tags du profil donné
     * 
     * @param profilId :
     *            l'identifiant du profil
     */
    this.getProfilTags = function(profilId) {
        return $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
            idProfil : profilId
        }).then(function(result) {
            return $localForage.setItem('profilTags.' + profilId, result.data).then(function() {
                return result.data;
            });
        }, function() {
            return $localForage.getItem('profilTags.' + profilId).then(function(data){
                return data;
            });
        });
    };

    /**
     * Récupère les informations utilisateurs liés au profil (délégation,
     * propriétaire, favoris, etc.)
     * 
     * @param profilId :
     *            l'id du profil
     */
    this.getUserProfil = function(profilId) {
        var params = {
            searchedProfile : profilId,
            id : localStorage.getItem('compteId')
        };
        return $http.post(configuration.URL_REQUEST + '/getProfilAndUserProfil', params).then(function(result) {
            return $localForage.setItem('userProfil.' + profilId, result.data).then(function() {
                return result.data;
            });
        }, function() {
            return $localForage.getItem('userProfil.' + profilId).then(function(data){
                return data;
            });
        });
    };
    
    
    /**
     * Recherche un profil du même nom.
     * 
     * @param profil
     *            le profil
     */
    this.lookForExistingProfile = function(online, profil) {
        if(online){
            return $http.post(configuration.URL_REQUEST + '/existingProfil', profil).then(function(res) {
                return res.data;
            });
        } else {
            return $localForage.getItem('listProfils').then(function(data) {
                var listProfil = data;
                var profileFound;
                if (listProfil && listProfil.length > 0) {
                    for (var i = 0; i < listProfil.length; i++) {
                        if (listProfil[i].type === 'profile' && listProfil[i].nom === profil.nom) {
                            profileFound = listProfil[i];
                            break;
                        }
                    }
                }
                return profileFound;
            });
        }

    };
    
    
    /**
     * Met à jour le profils dans le cache 
     * 
     * @param profil
     *            le profil
     */
    this.updateListProfilInCache = function(profil){
        return $localForage.getItem('listProfils').then(function(data) {
            var listProfil = data;
            if (!listProfil) {
                listProfil = [];
            }
            for (var i = 0; i < listProfil.length; i++) {
                if (listProfil[i].type === 'profile' && listProfil[i]._id === profil._id) {
                    listProfil[i] = profil;
                    $localForage.setItem('listProfils', listProfil);
                    break;
                }
            }
            return $localForage.setItem('profil.' + profil._id, profil).then(function() {
                return profil;
            });
        });
    };

});
