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
                                            $localForage, synchronisationStoreService, $rootScope, $uibModal, $log, $q, UtilsService) {

    var self = this;

    /**
     * Add the given profile.
     * @param profile :
        *            The profile to be saved.
     */
    this.saveProfile = function (profile) {
        $log.debug('Save Profile', profile);

        profile.data.className = this.generateClassName(profile, false);
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
     * Look for a profile of the same name.
     *
     * @param profil
     *            le profil
     */
    this.lookForExistingProfile = function (profile) {

        return fileStorageService.list('profile').then(function (profiles) {
            var isFound = false;
            _.each(profiles, function (item) {
                console.log('item', item);
                console.log('profile', profile);
                if (profile.data.nom === item.filename) {
                    isFound = true;
                }
            });
            return isFound;
        });
    };

    this.delegateProfile = function (params) {
        return $http.post('/delegateProfil', params);
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


    this.getProfiles = function () {

        return $q.all([$http.get('/profiles').then(function (res) {
            return res.data;
        }), fileStorageService.list('profile').then(function (files) {

            var userProfiles = [];

            if(files){
                for (var i = 0; i < files.length; i++) {
                    userProfiles.push(fileStorageService.getData(files[i], 'profile').then(function (file) {
                        return file;
                    }));
                }
            }


            return $q.all(userProfiles);

        })]).then(function (res) {

            return res[0].concat(res[1]);
        })
    };

    this.generateClassName = function(profile, isTmp){

        var className = '';

        if(profile && profile.data){

            var formattedName = UtilsService.cleanUpSpecialChars(profile.data.nom).trim().replace(/ /g, '-');

            className = 'profile-' + formattedName;

            if(isTmp){
                className += '-tmp';
            }

        }


        return className;
    };

});
