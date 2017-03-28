/* File: edit-document-title.modal.js
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

angular.module('cnedApp').controller('editPasswordCtrl', function ($scope, $uibModalInstance, ToasterService, UtilsService, $http, md5, userId, token, configuration) {

    $scope.compte = {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
    };


    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };

    // this function updates a password
    $scope.modifierPassword = function () {

        var isValid = true;
        //old password
        if ($scope.compte && (!$scope.compte.oldPassword || typeof $scope.compte.oldPassword == 'undefined')) { // jshint ignore:line
            ToasterService.showToaster('#edit-password-error-toaster', 'useraccount.message.save.ko.password.mandatory');
            isValid = false;
            return false;
        } else {
            if (!UtilsService.verifyPassword($scope.compte.oldPassword)) {
                if ($scope.compte.oldPassword.length < 6 || $scope.compte.oldPassword.length > 20) {
                    ToasterService.showToaster('#edit-password-error-toaster', 'useraccount.message.save.ko.password.length');
                } else {
                    ToasterService.showToaster('#edit-password-error-toaster', 'useraccount.message.save.ko.password.spacialchar');
                }
                isValid = false;
                return false;
            }
        }
        //new password
        if ($scope.compte && (!$scope.compte.newPassword || typeof $scope.compte.newPassword == 'undefined')) { // jshint ignore:line
            ToasterService.showToaster('#edit-password-error-toaster', 'useraccount.message.save.ko.newpassword.mandatory');
            isValid = false;
            return false;
        } else {
            if (!UtilsService.verifyPassword($scope.compte.newPassword)) {
                if ($scope.compte.newPassword.length < 6 || $scope.compte.newPassword.length > 20) {
                    ToasterService.showToaster('#edit-password-error-toaster', 'useraccount.message.save.ko.newpassword.length');
                } else {
                    ToasterService.showToaster('#edit-password-error-toaster', 'useraccount.message.save.ko.newpassword.spacialchar');
                }
                isValid = false;
                return false;
            }
        }

        if ($scope.compte.newPassword != $scope.compte.reNewPassword) { // jshint ignore:line
            ToasterService.showToaster('#edit-password-error-toaster', 'useraccount.message.save.ko.newpassword.confirm');
            isValid = false;
            return false;
        }

        if (isValid) {
            var userPassword = {
                _id: userId,
                local: {
                    password: md5.createHash($scope.compte.oldPassword),
                    newPassword: md5.createHash($scope.compte.newPassword)
                }
            };
            $http.post(configuration.URL_REQUEST + '/modifierPassword', {
                id: token,
                userPassword: userPassword
            }).success(function (data) {
                if (data === true) {
                    $uibModalInstance.close();
                } else {
                    ToasterService.showToaster('#edit-password-error-toaster','useraccount.message.save.ko.password.notvalid');
                }
            });
        }
    };


});