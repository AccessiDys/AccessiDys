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

angular.module('cnedApp').controller('editDocumentTitleCtrl', function ($scope, $uibModalInstance, documentService, $log, ToasterService, $timeout, title, errors, mode) {
    $scope.document = {
        title: title
    };
    $scope.errors = errors;
    $scope.mode = mode;


    /**
     * This function closes a modal.
     */
    $scope.saveTitle = function () {

        $scope.errors = [];

        $scope.errors = documentService.checkFields({
            title: $scope.document.title
        });

        documentService.isDocumentAlreadyExist({
            title: $scope.document.title
        }).then(function (isDocumentAlreadyExist) {

            if ($scope.errors.length < 1) {
                if (!isDocumentAlreadyExist) {
                    $uibModalInstance.close({
                        title: $scope.document.title
                    });
                } else {
                    ToasterService.showToaster('#edit-title-error-toaster', 'document.message.save.ko.alreadyexist');
                }

            } else {
                ToasterService.showToaster('#edit-title-error-toaster', $scope.errors[0]);
            }

        });


    };

    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };

    $uibModalInstance.opened.then(function () {

        console.log('errors', $scope.errors);

        if ($scope.errors.length > 0) {
            console.log('$scope.errors[0]', $scope.errors[0]);
            $timeout(function () {
                ToasterService.showToaster('#edit-title-error-toaster', $scope.errors[0]);
            }, 200);
        }

    });

});