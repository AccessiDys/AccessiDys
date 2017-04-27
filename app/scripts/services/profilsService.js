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

cnedApp.service('profilsService', function ($http, configuration, fileStorageService,
                                            $localForage, synchronisationStoreService, $rootScope, $uibModal, $log, $q) {

    var self = this;

    /**
     * Updates the given profile.
     *
     * @param profil :
        *            The profile to be updated.
     */
    this.updateProfil = function (online, profil) {


        if (online) {
            data.updateProfile.updated = new Date();
            return $http.post(configuration.URL_REQUEST + '/updateProfil', data).then(function (result) {
                return $localForage.setItem('profil.' + result.data._id, result.data).then(function () {
                    return result.data;
                });
            });
        } else {
            profil.updated = new Date();
            return synchronisationStoreService.storeProfilToSynchronize({
                owner: $rootScope.currentUser.local.email,
                action: 'update',
                profil: profil,
                profilTags: null
            }).then(function () {
                return self.updateListProfilInCache(profil);
            });
        }

    };

    /**
     * Add the given profile.
     * @param profile :
        *            The profile to be saved.
     */
    this.saveProfile = function (profile) {
        $log.debug('Save Profile', profile);

        profile.data.updated = new Date();
        profile.filename = profile.data.nom;

        return fileStorageService.save(profile, 'profile');
    };

    /**
     * Delete the given profile.
     *
     * @param ownerId :
        *            The owner of the profile.
     * @param profilId :
        *            The profile to be updated.
     */
    this.deleteProfil = function (profile) {

        return fileStorageService.delete(profile, 'profile');
    };

    /**
     * modify Styles in a profile.
     * @param profil :
        *            the profile
     * @param profilTags :
        *            The styles associated to the profile
     */
    this.updateProfilTags = function (online, profil, profilTags) {
        if (online) {
            return $http.post(configuration.URL_REQUEST + '/setProfilTags', {
                id: localStorage.getItem('compteId'),
                profilID: profil._id,
                profilTags: profilTags
            }).then(function () {
                return self.updateProfilTagsInCache(profil._id, profilTags);
            });
        } else {
            return synchronisationStoreService.storeTagToSynchronize({
                owner: $rootScope.currentUser.local.email,
                action: 'update',
                profil: profil,
                profilTags: profilTags
            }).then(function () {
                return self.updateProfilTagsInCache(profil._id, profilTags);
            });
        }
    };

    /**
     * Change styles to a profile in the cache.
     * @param profilId :
        *            The profile
     * @param profilTags :
        *            The styles associated to the profile
     */
    this.updateProfilTagsInCache = function (profilId, profilTags) {
        return $localForage.getItem('listProfils').then(function (data) {
            // build a data format which can be shown in disconnected mode.
            angular.forEach(profilTags, function (tags) {
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
                    idProfil: profilId,
                    tags: profilTags,
                    type: 'tags'
                };
            } else {
                listProfil.push({
                    idProfil: profilId,
                    tags: profilTags,
                    type: 'tags'
                });
            }
            $localForage.setItem('listProfils', listProfil);
            return $localForage.setItem('profilTags.' + profilId, profilTags);
        });
    };

    /**
     * Get the list of the given user profiles.
     */
    this.getProfilsByUser = function (online) {
        if (online) {
            return $http.get(configuration.URL_REQUEST + '/listeProfils', {
                params: {
                    id: localStorage.getItem('compteId')
                }
            }).then(function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    var profilItem = result.data[i];
                    if (profilItem.type === 'profile') {
                        $localForage.setItem('profil.' + profilItem._id, profilItem);
                    } else if (profilItem.type === 'tags') {
                        $localForage.setItem('profilTags.' + profilItem.idProfil, profilItem.tags);
                    }
                }
                return $localForage.setItem('listProfils', result.data).then(function () {
                    return result.data;
                });
            }, function () {
                return $localForage.getItem('listProfils');
            });
        } else {
            return $localForage.getItem('listProfils');
        }

    };

    /**
     * Get the list of tags of a profile
     *
     * @param profilId :
        *            The ID of the profile
     */
    this.getProfilTags = function (profilId) {
        return $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
            idProfil: profilId
        }).then(function (result) {
            return $localForage.setItem('profilTags.' + profilId, result.data).then(function () {
                return result.data;
            });
        }, function () {
            return $localForage.getItem('profilTags.' + profilId).then(function (data) {
                return data;
            });
        });
    };

    /**
     * Get the users information bound to a profile
     * (delegation, owner, favorites, etc.)
     * @param profilId :
        *            The ID of the profile
     */
    this.getUserProfil = function (profilId) {
        var params = {
            searchedProfile: profilId,
            id: localStorage.getItem('compteId')
        };
        return $http.post(configuration.URL_REQUEST + '/getProfilAndUserProfil', params).then(function (result) {
            return $localForage.setItem('userProfil.' + profilId, result.data).then(function () {
                return result.data;
            });
        }, function () {
            return $localForage.getItem('userProfil.' + profilId).then(function (data) {
                return data;
            });
        });
    };


    /**
     * Look for a profile of the same name.
     *
     * @param profil
     *            le profil
     */
    this.lookForExistingProfile = function (profile) {
        return fileStorageService.list('profile').then(function (profiles) {
            var isFound = false;
            _.each(profiles, function (item) {
                if (profile.data.nom === item.filename) {
                    isFound = true;
                }
            });
            return isFound;
        });
    };


    /**
     * Updates a profile in the cache
     *
     * @param profil
     *            The profile
     */
    this.updateListProfilInCache = function (profil) {
        return $localForage.getItem('listProfils').then(function (data) {
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
            return $localForage.setItem('profil.' + profil._id, profil).then(function () {
                return profil;
            });
        });
    };

    this.delegateProfile = function (params) {
        return $http.post(configuration.URL_REQUEST + '/delegateProfil', params);
    };

    this.openDelegateProfileModal = function (profile) {

        return $uibModal.open({
            templateUrl: 'views/profiles/delegate-profile.modal.html',
            controller: 'DelegateProfileModalCtrl',
            size: 'md',
            resolve: {
                profile: function () {
                    return profile;
                }
            }
        }).result;

    };

    this.getDefaultProfiles = function () {
        return $http.get('/profiles').then(function (res) {
            return res.data;
        });
    };

    this.getProfiles = function () {

        return $q.all([$http.get('/profiles').then(function (res) {
            return res.data;
        }), fileStorageService.list('profile').then(function (files) {

            var userProfiles = [];

            for (var i = 0; i < files.length; i++) {
                userProfiles.push(fileStorageService.getData(files[i], 'profile').then(function (file) {
                    return file;
                }));
            }

            return $q.all(userProfiles);

        })]).then(function (res) {

            return res[0].concat(res[1]);
        })
    }

});
