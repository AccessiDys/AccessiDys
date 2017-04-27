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
                                                                             ToasterService, template, profile) {
    $scope.template = template;
    $scope.profile = profile;

    $scope.forceApplyRules = true;

    var checkRequiredFields = function () {
        var isValid = true;

        if (!$scope.profile.data.nom) {
            ToasterService.showToaster('#profile-edit-modal-success-toaster', 'profile.message.save.ko.name.mandatory');
            isValid = false;
        }

        return isValid;
    };

    var reset = function () {
        $scope.profile = profile;
    };

    $scope.editTag = function (index) {
        $uibModalInstance.close({
            operation: 'edit-tag',
            index: index,
            profile: $scope.profile,
            template: $scope.template
        });
    };

    $scope.editName = function () {
        $uibModalInstance.close({
            operation: 'rename',
            profile: $scope.profile,
            template: $scope.template
        });
    };

    $scope.dismissModal = function (operation) {
        $scope.loader = false;
        $scope.loaderMsg = '';

        reset();
        $uibModalInstance.dismiss({
            operation: operation,
            template: $scope.template
        });
    };

    $scope.save = function () {

        if (checkRequiredFields()) {

            switch ($scope.template) {
                case 'create':
                    $scope.loaderMsg = 'Enregistrement du profil en cours ...';
                    break;
                case 'update':
                    $scope.loaderMsg = 'Modification du profil en cours ...';
                    break;
                case 'duplicate':
                    $scope.loaderMsg = 'Duplication du profil en cours ...';
                    break;
            }

            $scope.loader = true;

            // Check if the profile name does not already exists
            profilsService.lookForExistingProfile(profile)
                .then(function (res) {
                    if (!res) {

                        delete $scope.profile._id;
                        $scope.profile.data.state = 'mine';

                        profilsService.saveProfile($scope.profile)
                            .then(function () {
                                if ($scope.template === 'duplicate') {
                                    $scope.sendEmailDuplique();
                                }

                                $scope.dismissModal('save');
                            });


                    } else {
                        ToasterService.showToaster('#profile-edit-modal-success-toaster', 'profile.message.save.ko.name.alreadyexist');
                    }
                });
        }

    };


});
