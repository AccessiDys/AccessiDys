/* File: passwordRestore.js
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
/**
 * Controller responsible for all the operations
 * having something to do with the bookmarklet
 */


/* jshint undef: true, unused: true */
/*global $:false */

angular.module('cnedApp').controller('passwordRestoreCtrl', function ($scope, md5, $rootScope, $http, $location, configuration) {

    $scope.password = '';
    $scope.passwordConfirmation = '';
    $scope.erreurMessage = '';
    $scope.failRestore = false;
    $scope.testEnv = false;
    $scope.locationUrl = $location.absUrl();

    $scope.init = function () {
        if ($scope.locationUrl.indexOf('secret=') > -1) {
            $scope.secret = $location.absUrl().substring($location.absUrl().indexOf('secret=') + 7, $location.absUrl().length);
            var data = {
                secret: $scope.secret
            };
            $scope.flagInit = true;
            $http.post(configuration.URL_REQUEST + '/checkPasswordToken', data)
                .success(function () {
                    //
                })
                .error(function () {
                    UtilsService.showInformationModal('Informations', 'Cette clé de réinitialisation a expiré ou n\'est pas valide.', '/', true);
                });
        }
    };

    $scope.restorePassword = function () {
        if ($scope.verifyPassword($scope.password) && $scope.verifyPassword($scope.passwordConfirmation) && $scope.password === $scope.passwordConfirmation) {
            var data = {
                password: md5.createHash($scope.password),
                secret: $scope.secret
            };
            $http.post(configuration.URL_REQUEST + '/saveNewPassword', data)
                .success(function (dataRecue) {
                    UtilsService.showInformationModal('Informations', 'Votre nouveau mot de passe a été enregistré. Vous allez être redirigé vers la page d\'accueil.', '/?Acces=true', true);
                    localStorage.setItem('redirectionEmail', dataRecue.local.email);
                    localStorage.setItem('redirectionPassword', $scope.password);
                });
        } else {
            if ($scope.password !== $scope.passwordConfirmation) {
                $scope.erreurMessage = 'Ces mots de passe ne correspondent pas.';
            } else {
                $scope.erreurMessage = 'le mot de passe et sa confirmation sont requis.';
            }
            $scope.failRestore = true;
        }
    };

    $scope.verifyPassword = function (password) {
        var ck_password = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;

        if (!ck_password.test(password)) {
            return false;
        }
        return true;
    };

});