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

angular.module('cnedApp').controller('editDocumentTitleCtrl', function ($scope, $uibModalInstance, documentService, $log, gettextCatalog, $timeout) {
    $scope.document = {
        title: title
    };
    $scope.errors = errors;


    /**
     * This function closes a modal.
     */
    $scope.saveTitle = function () {

        $scope.errors = [];

        $log.debug('Title', $scope.document.title);

        $scope.errors = documentService.checkFields({
            title: $scope.document.title
        });

        if ($scope.errors.length < 1) {
            $uibModalInstance.close({
                title: $scope.document.title
            });
        } else {
            $scope.showToaster('#edit-title-error-toaster', $scope.errors[0]);
        }
    };

    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };

    $scope.toasterMsg = '';
    $scope.forceToasterApdapt = false;
    $scope.listTagsByProfilToaster = [];

    /**
     * Show success toaster
     * @param msg
     */
    $scope.showToaster = function (id, msg) {
        $scope.listTagsByProfilToaster = JSON.parse(localStorage.getItem('listTagsByProfil'));
        $scope.toasterMsg = '<h1>' + gettextCatalog.getString(msg) + '</h1>';
        $scope.forceToasterApdapt = true;
        $timeout(function () {
            angular.element(id).fadeIn('fast').delay(10000).fadeOut('fast');
            $scope.forceToasterApdapt = false;
        }, 0);
    };

    $uibModalInstance.opened.then(function () {

        if ($scope.errors.length > 0) {
            $scope.showToaster('#edit-title-error-toaster', $scope.errors[0]);
        }

    });

});