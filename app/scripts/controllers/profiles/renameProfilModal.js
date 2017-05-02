/* File: renameProfilModal.js
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
 * If not, see <http:// www.gnu.org/licenses/>.
 *
 */
'use strict';
/* jshint loopfunc:true */

angular.module('cnedApp').controller('profilesRenommageModalCtrl', function ($scope, $uibModalInstance, ToasterService, profilsService, profile) {
    $scope.profile = profile;
    $scope.profileName = profile.data.nom;

    /**
     * This function closes a modal.
     */
    $scope.closeModal = function () {

        if (!$scope.profile.data.nom || $scope.profile.data.nom.length < 1) {

            ToasterService.showToaster('#rename-profile-success-toaster', 'profile.message.save.ko.name.mandatory');

        } else {

            profilsService.lookForExistingProfile(profile)
                .then(function (res) {
                    if (!res) {
                        $uibModalInstance.close({
                            profile: $scope.profile
                        });
                    } else {
                        ToasterService.showToaster('#rename-profile-success-toaster', 'profile.message.save.ko.name.alreadyexist');
                    }
                });
        }
    };

    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };

});