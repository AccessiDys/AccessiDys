/*File: documentService.js
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


cnedApp.service('documentService', function ($rootScope, $q, $log, serviceCheck, $uibModal, fileStorageService, md5, LoaderService) {


    var methods = {

        /**
         * Check if document fields are valid
         *
         * @param document
         * @returns {Array} Errors
         */
        checkFields: function (document) {
            var errors = [];

            $log.debug('Check fields of document', document);

            if (!document.title || document.title.length <= 0) {
                errors.push('document.message.save.ko.title.mandatory');

            } else if (document.title.length > 201) {
                errors.push('document.message.save.ko.title.size');

            } else if (!serviceCheck.checkName(document.title)) {
                errors.push('document.message.save.ko.title.specialchar');
            }

            $log.debug('Check fields result', errors);

            return errors;
        },

        isDocumentAlreadyExist: function (document) {
            var deferred = $q.defer();

            $log.debug('Check if document already exist', document);

            localStorage.setItem('lockOperationDropBox', true);
            fileStorageService.searchFiles($rootScope.isAppOnline, document.title, $rootScope.currentUser.dropbox.accessToken)
                .then(function (filesFound) {

                    var isDocumentExist = false;

                    for (var i = 0; i < filesFound.length; i++) {
                        if (filesFound[i].filepath.indexOf('.html') > 0 && filesFound[i].filepath.toLowerCase().indexOf('_' + document.title.toLowerCase() + '_') > 0) {
                            isDocumentExist = true;
                            break;
                        }
                    }

                    localStorage.setItem('lockOperationDropBox', false);

                    deferred.resolve(isDocumentExist);

                });


            return deferred.promise;
        },

        /**
         * Save the document
         *
         * @param document
         */
        save: function (document) {
            var deferred = $q.defer();

            $log.debug('Save document', document);

            var errors = methods.checkFields(document);

            if (errors.length < 1) {

                LoaderService.showLoader('document.message.info.save.inprogress');

                methods.isDocumentAlreadyExist({
                    title: document.title
                }).then(function (isDocumentAlreadyExist) {

                    if (isDocumentAlreadyExist) {

                        LoaderService.hideLoader();

                        errors.push('document.message.save.ko.alreadyexist');

                        methods.editDocumentTitle(document.title, errors)
                            .then(function (params) {
                                document.title = params.title;
                                methods.save(document).then(function (data) {
                                    deferred.resolve(data);
                                }, function () {
                                    deferred.reject();
                                });
                            }, function () {
                                // Modal dismiss
                                deferred.reject();
                            });

                    } else {
                        LoaderService.setLoaderProgress(20);

                        var now = new Date();
                        var tmpDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                        var hash = md5.createHash(document.data);
                        var documentName = tmpDate + '_' + encodeURIComponent(document.title) + '_' + hash + '.html';

                        LoaderService.setLoaderProgress(40);

                        localStorage.setItem('lockOperationDropBox', true);
                        fileStorageService.saveFile($rootScope.isAppOnline, documentName, document.data, $rootScope.currentUser.dropbox.accessToken)
                            .then(function (data) {
                                localStorage.setItem('lockOperationDropBox', false);

                                LoaderService.setLoaderProgress(75);
                                LoaderService.hideLoader();

                                deferred.resolve(data);

                            });
                    }

                });

            } else {
                methods.editDocumentTitle(document.title, errors)
                    .then(function (params) {
                        document.title = params.title;
                        methods.save(document).then(function (data) {
                            deferred.resolve(data);
                        }, function () {
                            deferred.reject();
                        });
                    }, function () {
                        // Modal dismiss
                        deferred.reject();
                    });
            }

            return deferred.promise;
        },

        /**
         * Edit the document title
         */
        editDocumentTitle: function (title, errors) {

            $log.debug('editDocumentTitle', title, errors);

            return $uibModal.open({
                templateUrl: 'views/addDocument/edit-title.modal.html',
                controller: 'editDocumentTitleCtrl',
                size: 'lg',
                backdrop: true,
                resolve: {
                    title: function () {
                        return title;
                    },
                    errors: function () {
                        return errors;
                    }
                }
            }).result;
        }
    };

    return methods;

});