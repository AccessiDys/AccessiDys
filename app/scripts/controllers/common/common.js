/* File: common.js
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

angular.module('cnedApp').controller('CommonCtrl', function ($scope, $rootScope, profilsService, $uibModal, tagsService, $log, UserService, $state, userData) {

    $log.debug('commonCtrl - userData', userData);

    $rootScope.listeProfiles = [];
    $rootScope.currentProfile = {};
    $rootScope.$state = $state;

    $rootScope.isFullsize = true;
    $scope.admin = $rootScope.admin;
    $rootScope.apercu = false;

    $scope.profilActuel = '';
    $scope.form = {
        currentProfile: ''
    };

    $rootScope.$on('refreshProfilAcutel', function (event, data) {
        $scope.listeProfilsParUser = data;
    });


    $scope.initCommon = function () {

        UserService.init();

        // Init profile list and Tag

        /*profilsService.getDefaultProfiles().then(function (res) {
            $rootScope.listeProfiles = $rootScope.listeProfiles.concat(res);
        });*/

        profilsService.getProfiles().then(function (res) {

            $log.debug('DEBUG - res', res);
            $rootScope.listeProfiles = res;

        });


    };

    $scope.onChangeCurrentProfile = function () {
        $scope.currentProfile = angular.copy($scope.form.currentProfile);
    };

    $rootScope.openVocalHelpModal = function () {
        $uibModal.open({
            templateUrl: 'views/infoPages/vocalHelp.html',
            controller: 'VocalHelpModalCtrl',
            size: 'lg'
        });
    };

    $scope.bookmarkletPopin = function () {
        $uibModal.open({
            templateUrl: 'views/common/bookmarklet.modal.html',
            controller: 'BookMarkletModalCtrl',
            size: 'md'
        }).result.then(function () {
            //
        });

    };

    $scope.initCommon();

});