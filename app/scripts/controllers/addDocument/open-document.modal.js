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

angular.module('cnedApp').controller('OpenDocumentModalCtrl', function ($rootScope, $scope, $uibModalInstance, UtilsService, ToasterService, serviceCheck, documentService) {

    $scope.form = {
        title: '',
        uri: '',
        files: [],
        type: ''
    };


    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };


    $scope.open = function () {
        if (!$rootScope.isAppOnline && $scope.form.uri) {
            UtilsService.showInformationModal('label.offline', 'document.message.info.importlink.offline');
        } else {

            var doc = $scope.form;

            var errors = [];

            if ((!$scope.form.uri && $scope.form.files.length <= 0) || (($scope.form.uri && /\S/.test($scope.form.uri)) && $scope.form.files.length > 0)) {
                errors.push('document.message.save.ko.linkorlocalfile');
            }
            if ($scope.form.uri && !UtilsService.verifyLink($scope.form.uri)) {
                errors.push('document.message.save.ko.link');
            }

            if (doc.files.length > 0) {
                if (doc.files[0].type === 'application/pdf') {
                    doc.type = 'pdf';

                } else if (doc.files[0].type === 'image/jpeg'
                    || doc.files[0].type === 'image/png'
                    || doc.files[0].type === 'image/jpg') {

                    doc.type = 'image';

                } else if (doc.files[0].type === 'application/epub+zip'
                    || (doc.files[0].type === '' && doc.files[0].name.indexOf('.epub'))) {

                    doc.type = 'epub';

                } else {
                    errors.push('document.message.save.ko.file.type');
                }
            }


            if (errors.length > 0) {
                ToasterService.showToaster('#open-document-modal-error-toaster', errors[0]);
            } else {
                documentService.isDocumentAlreadyExist(doc)
                    .then(function (isDocumentExist) {

                        if (isDocumentExist) {
                            ToasterService.showToaster('#open-document-modal-error-toaster', 'document.message.save.ko.alreadyexist');
                        } else {
                            $uibModalInstance.close(doc);
                        }
                    });

            }
        }

    };

});