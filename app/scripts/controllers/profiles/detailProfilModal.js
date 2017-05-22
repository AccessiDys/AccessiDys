/* File: detailProfilModal.js
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
/* jshint loopfunc:true */

angular.module('cnedApp').controller('profilesAffichageModalCtrl', function ($scope, $uibModalInstance, $rootScope, profilsService,
                                                                             ToasterService, UserService, UtilsService, LoaderService,
                                                                             fileStorageService, $log, template, profile) {
    $scope.template = template;
    $scope.profile = angular.copy(profile);
    $rootScope.tmpProfile = $scope.profile;

    $log.debug('$rootScope.tmpProfile', $rootScope.tmpProfile);

    /**
     * Checking required fields before saving
     * @returns {boolean} Return true if is valid
     */
    var checkRequiredFields = function () {
        var isValid = true;

        if (!$scope.profile.data.nom) {
            ToasterService.showToaster('#profile-edit-modal-success-toaster', 'profile.message.save.ko.name.mandatory');
            isValid = false;
        }

        return isValid;
    };

    /**
     * Edit a tag of the current profile
     * @param index
     */
    $scope.editTag = function (index) {
        $uibModalInstance.close({
            operation: 'edit-tag',
            index: index,
            profile: $scope.profile,
            template: $scope.template
        });
    };

    /**
     * Edit the name of the current profile
     */
    $scope.editName = function () {
        $uibModalInstance.close({
            operation: 'rename',
            profile: $scope.profile,
            template: $scope.template
        });
    };

    /**
     * Dismiss the current modal
     * @param operation
     */
    $scope.dismissModal = function (operation) {
        $uibModalInstance.dismiss({
            operation: operation,
            template: $scope.template,
            profile: $scope.profile,
            oldProfile: profile
        });
    };

    /**
     * Save the current profile
     */
    $scope.save = function () {

        if (checkRequiredFields()) {

            LoaderService.showLoader('profile.message.info.save.inprogress', false);

            // Check if the profile name does not already exists
            profilsService.lookForExistingProfile(profile)
                .then(function (res) {

                    $log.debug('lookForExistingProfile', res);

                    if ((!res && $scope.template !== 'update') || ($scope.template === 'update')) {

                        $scope.profile.data.updated = new Date();
                        $scope.profile.data.className = profilsService.generateClassName($scope.profile, false);

                        if($scope.template === 'duplicate' || $scope.template === 'create'){
                            $scope.profile.filename = $scope.profile.data.nom;
                        }

                        profilsService.saveProfile($scope.profile)
                            .then(function (savedProfile) {
                                $scope.profile = savedProfile;

                                if ($scope.template === 'duplicate') {
                                    $scope.sendEmailDuplique($scope.profile);
                                }

                                LoaderService.hideLoader();

                                if (!UserService.getData().token) {
                                    UtilsService.openConfirmModal('profile.label.save.no-storage.title', 'profile.label.save.no-storage.message', false)
                                        .then(function () {
                                            $scope.dismissModal('save');
                                            $rootScope.$state.go('app.my-backup', {
                                                prevState: 'app.list-profile',
                                                file: $scope.profile
                                            });

                                        }, function () {
                                            $scope.dismissModal('save');
                                        });
                                } else {
                                    $scope.dismissModal('save');
                                }

                            });


                    } else {
                        LoaderService.hideLoader();
                        ToasterService.showToaster('#profile-edit-modal-success-toaster', 'profile.message.save.ko.name.alreadyexist');
                    }
                }, function () {
                    LoaderService.hideLoader();
                });
        }

    };


});
