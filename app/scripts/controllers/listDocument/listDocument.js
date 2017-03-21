/* File: main.js
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
/* global $ */

var FB = FB;
var gapi = gapi;

angular.module('cnedApp')
    .controller('listDocumentCtrl', function ($scope, $rootScope, serviceCheck, $http,
                                              configuration, fileStorageService, tagsService, Analytics,
                                              gettextCatalog, $timeout, UtilsService, LoaderService, $log, documentService, ToasterService) {

        $scope.configuration = configuration;
        $scope.testEnv = false;
        $scope.requestToSend = {};
        $scope.sortType = 'dateModification';
        $scope.sortReverse = true;

        if (localStorage.getItem('compteId')) {
            $scope.requestToSend = {
                id: localStorage.getItem('compteId')
            };
        }

        $scope.updateNote = function (operation) {
            var notes = [];
            var mapNotes = {};
            if (localStorage.getItem('notes')) {
                mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                if (mapNotes.hasOwnProperty($scope.oldTitre)) {
                    if (operation === 'DELETE') {
                        delete mapNotes[$scope.oldTitre];
                    } else if (operation === 'EDIT') {
                        notes = mapNotes[$scope.oldTitre];
                        delete mapNotes[$scope.oldTitre];
                        mapNotes[$scope.nouveauTitre] = notes;
                    }
                    localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
                }
            }
        };

        /**
         * Delete a document
         * @param document The document to be deleted
         */
        $scope.deleteDocument = function (document) {

            UtilsService.openConfirmModal('document.label.delete.title',
                gettextCatalog.getString('document.label.delete.anwser').replace('document.name', document.filename), true)
                .then(function () {
                    localStorage.setItem('lockOperationDropBox', true);
                    LoaderService.showLoader('document.message.info.delete.inprogress', true);
                    LoaderService.setLoaderProgress(30);

                    fileStorageService.deleteFile($rootScope.isAppOnline, document.filepath, $rootScope.currentUser.dropbox.accessToken).then(function () {
                        localStorage.setItem('lockOperationDropBox', false);
                        LoaderService.setLoaderProgress(100);
                        LoaderService.hideLoader();
                        /* Removing notes of the document on localStorage */
                        $scope.updateNote('DELETE');
                        $scope.getListDocument();
                    });
                });

            // angular-google-analytics tracking pages
            Analytics.trackPage('/document/delete.html');
        };

        /**
         * Rename a document title
         * @param document The document to be renamed
         */
        $scope.renameDocumentTitle = function(document){

            documentService.editDocumentTitle(document.filename, [], 'edit')
                .then(function (params) {
                    localStorage.setItem('lockOperationDropBox', true);
                    LoaderService.showLoader('document.message.info.rename.inprogress', true);
                    LoaderService.setLoaderProgress(10);

                    var signature = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent(document.filepath))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(document.filepath))[0], '');
                    var ladate = new Date();
                    var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();
                    var newTitle = tmpDate + '_' + encodeURIComponent(params.title) + '_' + signature;
                    fileStorageService.renameFile($rootScope.isAppOnline, document.filepath, '/' + newTitle + '.html', $rootScope.currentUser.dropbox.accessToken)
                        .then(function () {
                            LoaderService.setLoaderProgress(80);
                            localStorage.setItem('lockOperationDropBox', false);
                            $scope.updateNote('EDIT');
                            $scope.getListDocument();
                        });
                });

            // angular-google-analytics tracking pages
            Analytics.trackPage('/document/edit-title.html');
        };

        /**
         * Share a document
         * @param document The document to share
         */
        $scope.shareDocument = function (document) {
            $log.debug('Share document', document);

            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'document.message.info.share.offline');
            } else {

                var itemToShare = {
                    linkToShare: '',
                    name: document.filename,
                    annotationsToShare: []
                };

                if (localStorage.getItem('notes') !== null) {
                    var noteList = JSON.parse(localStorage.getItem('notes'));

                    if (noteList.hasOwnProperty(document.filename)) {
                        itemToShare.annotationsToShare = noteList[document.filename];
                    }
                }

                fileStorageService.shareFile(document.filepath, $rootScope.currentUser.dropbox.accessToken)
                    .then(function (shareLink) {
                        itemToShare.linkToShare = configuration.URL_REQUEST + '/#/apercu?url=' + encodeURIComponent(shareLink);

                        //$scope.encodedLinkFb = $scope.docApartager.lienApercu.replace('#', '%23');
                        UtilsService.openSocialShareModal('document', itemToShare)
                            .then(function () {
                                // Modal close
                                ToasterService.showToaster('#list-document-success-toaster', 'mail.send.ok');
                            }, function () {
                                // Modal dismiss
                            });

                    });

                // angular-google-analytics tracking pages
                Analytics.trackPage('/document/share.html');
            }

        };

        // verifies the existence of listTags and listTagByProfil and fulfilled if found
        $scope.localSetting = function () {
            var profActuId = '';
            if (localStorage.getItem('profilActuel')) {
                var tmp = JSON.parse(localStorage.getItem('profilActuel'));
                profActuId = tmp._id;
            }
            tagsService.getTags($scope.requestToSend).then(function (data) {
                $scope.listTags = data;
                $scope.flagLocalSettinglistTags = true;
                localStorage.setItem('listTags', JSON.stringify($scope.listTags));

                $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
                    idProfil: profActuId
                }).success(function (data) {
                    $scope.listTagsByProfil = data;
                    $scope.flagLocalSettinglistTagsByProfil = true;
                    localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
                }).error(function () {
                    console.log('err');
                });
            });
        };

        /*
         * Show all the documents at the beginning
         * and creates the menu associated with the document
         */
        $scope.initialiseShowDocs = function () {
            for (var i = 0; i < $scope.listDocument.length; i++) {
                $scope.listDocument[i].showed = true;
                $scope.listDocument[i].filenameEncoded = $scope.listDocument[i].filename.replace(/ /g, '_');
            }
        };

        /* Filter on the name of the document to be displayed */
        $scope.specificFilter = function () {
            // parcours des Documents
            for (var i = 0; i < $scope.listDocument.length; i++) {
                $scope.listDocument[i].showed = $scope.listDocument[i].filename.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1;
            }
        };

        $scope.getListDocument = function () {
            LoaderService.showLoader('document.message.info.load', false);
            return serviceCheck.getData().then(function (data) {
                var dropboxToken = '';
                if (data.user && data.user.dropbox) {
                    dropboxToken = data.user.dropbox.accessToken;
                }
                LoaderService.setLoaderProgress(20);
                fileStorageService.searchAllFiles($rootScope.isAppOnline, $rootScope.currentUser.dropbox.accessToken).then(function (listDocument) {
                    LoaderService.setLoaderProgress(100);
                    LoaderService.hideLoader();
                    $scope.listDocument = listDocument;
                    $scope.initialiseShowDocs();
                }, function () {
                    LoaderService.hideLoader();
                });
            }, function () {
                LoaderService.hideLoader();
            });
        };

        $scope.getListDocument();

    });