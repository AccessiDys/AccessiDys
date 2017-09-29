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

/*global cnedApp */
cnedApp.service('documentService', function ($rootScope, $q, $log, serviceCheck, $uibModal, fileStorageService, LoaderService, _, UserService, UtilsService) {


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

            } else if (serviceCheck.checkName(document.title)) {
                errors.push('document.message.save.ko.title.specialchar');
            }

            $log.debug('Check fields result', errors);

            return errors;
        },

        isDocumentAlreadyExist: function (document) {
            var deferred = $q.defer();

            $log.debug('Check if document already exist', document);

            fileStorageService.list('document').then(function (documents) {
                var isFound = false;
                _.each(documents, function (item) {
                    if (document.title === item.filename) {
                        isFound = true;
                    }
                });
                deferred.resolve(isFound);
            });

            return deferred.promise;
        },

        /**
         * Save the document
         *
         * @param document
         */
        save: function (document, mode) {
            var deferred = $q.defer();

            $log.debug('Save document', document);

            var errors = methods.checkFields(document);

            if (errors.length < 1) {

                LoaderService.showLoader('document.message.info.save.inprogress');

                methods.isDocumentAlreadyExist({
                    title: document.title
                }).then(function (isDocumentAlreadyExist) {

                    if (isDocumentAlreadyExist && mode === 'create') {

                        LoaderService.hideLoader();

                        errors.push('document.message.save.ko.alreadyexist');

                        methods.editDocumentTitle(document.title, errors, 'save')
                            .then(function (params) {
                                document.title = params.title;
                                methods.save(document).then(function (data) {
                                    deferred.resolve(data);
                                }, function () {
                                    deferred.reject();
                                });
                            }, function () {
                                // Modal dismiss
                                deferred.reject('edit-title');
                            });

                    } else {
                        LoaderService.setLoaderProgress(40);

                        var file = {
                            filename: document.title,
                            filepath: document.filePath,
                            data: document.data,
                            dateModification: new Date()
                        };


                        fileStorageService.save(file, 'document')
                            .then(function (data) {
                                LoaderService.setLoaderProgress(75);
                                LoaderService.hideLoader();

                                if (!UserService.getData().token) {
                                    UtilsService.openConfirmModal('document.label.save.no-storage.title', 'document.label.save.no-storage.message', false)
                                        .then(function () {
                                            $rootScope.$state.go('app.my-backup', {
                                                prevState: 'app.edit-document',
                                                file: file
                                            });
                                        }, function () {
                                            deferred.resolve(data);
                                        });
                                } else {
                                    deferred.resolve(data);
                                }

                            }, function () {
                                deferred.reject();
                            });
                    }

                });

            } else {
                methods.editDocumentTitle(document.title, errors, 'save')
                    .then(function (params) {
                        document.title = params.title;
                        methods.save(document).then(function (data) {
                            deferred.resolve(data);
                        }, function () {
                            deferred.reject();
                        });
                    }, function () {
                        // Modal dismiss
                        deferred.reject('edit-title');
                    });
            }

            return deferred.promise;
        },

        /**
         * Edit the document title
         */
        editDocumentTitle: function (title, errors, mode) {

            $log.debug('editDocumentTitle', title, errors);

            return $uibModal.open({
                templateUrl: 'views/addDocument/edit-title.modal.html',
                controller: 'editDocumentTitleCtrl',
                size: 'md',
                backdrop: true,
                resolve: {
                    title: function () {
                        return title;
                    },
                    errors: function () {
                        return errors;
                    },
                    mode: function () {
                        return mode;
                    }
                }
            }).result;
        },

        /**
         * Edit the document title
         */
        openDocument: function () {
            return $uibModal.open({
                templateUrl: 'views/addDocument/open-document.modal.html',
                controller: 'OpenDocumentModalCtrl',
                size: 'lg'
            }).result;
        },

        copyDocument: function (document) {
            var deferred = $q.defer();

            $log.debug('Copy document', document);

            var file = {
                filename: document.filename + '-Copie',
                data: document.data,
                dateModification: new Date()
            };


            UtilsService.openConfirmModal('document.message.copy.confirm.title', 'document.message.copy.confirm.message', false)
                .then(function () {
                    LoaderService.showLoader('document.message.info.copy.inprogress', false);

                    methods.isDocumentAlreadyExist({
                        title: file.filename
                    }).then(function (isDocumentAlreadyExist) {

                        if (isDocumentAlreadyExist) {
                            LoaderService.hideLoader();

                            var errors = [];
                            errors.push('document.message.copy.ko.alreadyExist');
                            methods.editDocumentTitle(file.filename, errors, 'save')
                                .then(function (params) {
                                    $log.debug('editDocumentTitle', params);
                                    LoaderService.showLoader('document.message.info.copy.inprogress', false);

                                    file.filename = params.title;

                                    fileStorageService.copyFile(document, file, 'document')
                                        .then(function () {
                                            LoaderService.hideLoader();
                                            deferred.resolve();
                                        }, function () {
                                            LoaderService.hideLoader();
                                            deferred.reject();
                                        });
                                }, function () {
                                    // Modal dismiss
                                    deferred.reject('edit-title');
                                });

                        } else {

                            fileStorageService.copyFile(document, file, 'document')
                                .then(function () {
                                    LoaderService.hideLoader();
                                    deferred.resolve();
                                }, function () {
                                    LoaderService.hideLoader();
                                    deferred.reject();
                                });
                        }

                    });

                });

            return deferred.promise;

        }
    };

    return methods;

});