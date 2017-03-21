/* File: upgrade.modal.js
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

angular.module('cnedApp').controller('UpgradeModalCtrl', function($scope, $rootScope, $uibModalInstance, ToasterService, $timeout, $http, configuration) {


    $scope.upgradeMode = false;

    $uibModalInstance.opened.then(function(){
        var data = {
            id: $rootScope.currentUser.local.token
        };
        $http.post(configuration.URL_REQUEST + '/allVersion', data).success(function (dataRecu) {
            if (dataRecu.length === 0) {
                $scope.upgradeurl = '/createVersion';
                $scope.oldVersion = {
                    valeur: 0,
                    date: '0/0/0',
                    newvaleur: 1,
                    id: $rootScope.currentUser.local.token
                };
            } else {
                $scope.upgradeurl = '/updateVersion';
                $scope.oldVersion = {
                    valeur: dataRecu[0].appVersion,
                    date: dataRecu[0].dateVersion,
                    newvaleur: dataRecu[0].appVersion + 1,
                    sysVersionId: dataRecu[0]._id,
                    id: $rootScope.currentUser.local.token
                };
            }
        });
    });

    $scope.closeModal = function() {
        $uibModalInstance.close();
    };

    $scope.dismissModal = function() {
        $uibModalInstance.dismiss();
    };

    $scope.updateVersion = function () {
        $scope.oldVersion.mode = $scope.upgradeMode;
        /* jshint ignore:start */

        $http.post(configuration.URL_REQUEST + $scope.upgradeurl, $scope.oldVersion).success(function () {

            ToasterService.showToaster('#upgrade-success-toaster', 'label.upgrade.ok');
            $timeout(function(){
                $uibModalInstance.close();
            }, 3000);

        }).error(function () {
            console.log('error');
        });
        /* jshint ignore:end */

    };

});
