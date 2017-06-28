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

angular.module('cnedApp').controller('VocalSynthesisSettingsModalCtrl', function ($scope, $uibModalInstance,
                                                                                  ToasterService, profilsService,
                                                                                  $log, $timeout, profile) {

    $scope.profile = angular.copy(profile);

    if (!$scope.profile.data.vocalSettings) {
        $scope.profile.data.vocalSettings = {
            rate: 1,
            volume: 1,
            pitch: 1,
            voice: 'Thomas'
        }
    }

    $uibModalInstance.opened.then(function () {
        $timeout(function () {
            jQuery('#vocal-synthesis-sttings-modal').find('select[data-ng-model="profile.data.vocalSettings.voice"] + .customSelect .customSelectInner').text($scope.profile.data.vocalSettings.voice);

        }, 100);

        if (window.speechSynthesis) {
            $scope.voices = window.speechSynthesis.getVoices();
        }

    });


    /**
     * This function closes a modal.
     */
    $scope.closeModal = function () {

        var hasError = false;

        if (!$scope.profile.data.vocalSettings.volume || !angular.isNumber($scope.profile.data.vocalSettings.volume)
            || $scope.profile.data.vocalSettings.volume < 0 || $scope.profile.data.vocalSettings.volume > 1) {
            ToasterService.showToaster('#vocal-profile-error-toaster', 'label.vocal.volume.invalid');
            hasError = true;

        } else if (!$scope.profile.data.vocalSettings.rate || !angular.isNumber($scope.profile.data.vocalSettings.rate)
            || $scope.profile.data.vocalSettings.rate < 0.1 || $scope.profile.data.vocalSettings.rate > 10) {

            ToasterService.showToaster('#vocal-profile-error-toaster', 'label.vocal.rate.invalid');
            hasError = true;
        } else if (!$scope.profile.data.vocalSettings.pitch || !angular.isNumber($scope.profile.data.vocalSettings.pitch)
            || $scope.profile.data.vocalSettings.pitch < 0 || $scope.profile.data.vocalSettings.pitch > 2) {

            ToasterService.showToaster('#vocal-profile-error-toaster', 'label.vocal.rate.invalid');
            hasError = true;
        }

        if (!hasError) {
            // if there is no change
            $uibModalInstance.close({
                profile: $scope.profile
            });
        }
    };

    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };

});