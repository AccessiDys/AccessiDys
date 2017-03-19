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

            var errors = documentService.checkFields(doc);

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

    /**
     * Open the document selected by the user.
     */
    $scope.validerAjoutDocument = function () {
        // Presence of a file with the browse button
        if ($scope.files.length > 0) {
            $scope.pageTitre = 'Ajouter un document';
            $scope.existingFile = null;
            if ($scope.doc && $scope.doc.titre) {
                $scope.docTitre = $scope.doc.titre;
            }

            $rootScope.uploadDoc = $scope.doc;
            $scope.doc = {};
            $rootScope.uploadDoc.uploadPdf = $scope.files;
            if ($rootScope.uploadDoc.uploadPdf[0].type === 'application/pdf') {
                $scope.loadPdf();
            } else if ($rootScope.uploadDoc.uploadPdf[0].type === 'image/jpeg' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/png' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/jpg') {
                $scope.loadImage();
            } else if ($rootScope.uploadDoc.uploadPdf[0].type === 'application/epub+zip' || ($rootScope.uploadDoc.uploadPdf[0].type === '' && $rootScope.uploadDoc.uploadPdf[0].name.indexOf('.epub'))) {
                $scope.uploadFile();
            } else {

                $scope.showToaster('#open-document-modal-error-toaster', 'document.message.save.ko.file.type');
                $scope.errorMsg = true;
            }
        }

        // Link management
        else if ($scope.lien) {
            $scope.pageTitre = 'Ajouter un document';
            $scope.existingFile = null;
            if ($scope.doc && $scope.doc.titre) {
                $scope.docTitre = $scope.doc.titre;
            }

            $rootScope.uploadDoc = $scope.doc;
            $scope.doc = {};
            if ($scope.lien.indexOf('.epub') > -1) {
                $scope.getEpubLink();
            } else if ($scope.lien.indexOf('.pdf') > -1) {
                $scope.loadPdfByLien($scope.lien);
            } else {
                LoaderService.showLoader('document.message.info.treatment.inprogress', true);
                LoaderService.setLoaderProgress(10);

                // Retrieving the contents of the body of link by services.
                var promiseHtml = serviceCheck.htmlPreview($scope.lien, $rootScope.currentUser.dropbox.accessToken);
                promiseHtml.then(function (resultHtml) {
                    var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                    promiseClean.then(function (resultClean) {
                        // Insertion in the editor
                        CKEDITOR.instances.editorAdd.setData(resultClean);
                        LoaderService.hideLoader();
                    });
                }, function (err) {

                    LoaderService.hideLoader();
                    $scope.techError = err;
                    angular.element('#myModalWorkSpaceTechnical').modal('show');
                });
            }
        }
    };

});