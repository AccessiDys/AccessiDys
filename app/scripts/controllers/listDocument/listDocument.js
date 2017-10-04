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

angular.module('cnedApp')
    .controller('listDocumentCtrl', function ($scope, $rootScope,
                                              configuration, fileStorageService, Analytics,
                                              gettextCatalog, UtilsService, LoaderService, $log, documentService, ToasterService) {

        $scope.configuration = configuration;
        $scope.sortType = 'dateModification';
        $scope.sortReverse = true;


        /**
         * Update document Note
         * @param operation
         */
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

            UtilsService.openConfirmModal(gettextCatalog.getString('document.label.delete.title'),
                gettextCatalog.getString('document.label.delete.anwser').replace('document.name', document.filename), true)
                .then(function () {
                    LoaderService.showLoader('document.message.info.delete.inprogress', true);
                    LoaderService.setLoaderProgress(30);

                    fileStorageService.delete(document, 'document').then(function () {
                        LoaderService.setLoaderProgress(100);
                        LoaderService.hideLoader();
                        /* Removing notes of the document on localStorage */
                        $scope.updateNote('DELETE');
                        $scope.getListDocument();

                        ToasterService.showToaster('#list-document-success-toaster', 'document.message.info.delete.ok');
                    });
                });

            // angular-google-analytics tracking pages
            Analytics.trackPage('/document/delete.html');
        };

        /**
         * Rename a document title
         * @param document The document to be renamed
         */
        $scope.renameDocumentTitle = function (document) {

            documentService.editDocumentTitle(document.filename, [], 'edit')
                .then(function (params) {
                    LoaderService.showLoader('document.message.info.rename.inprogress', true);
                    LoaderService.setLoaderProgress(10);

                    fileStorageService.rename(document, params.title, 'document')
                        .then(function () {
                            LoaderService.setLoaderProgress(80);
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
                    var noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));

                    if (noteList.hasOwnProperty(document.filename)) {
                        itemToShare.annotationsToShare = noteList[document.filename];
                    }
                }

                fileStorageService.shareFile(document.filepath)
                    .then(function (shareLink) {
                        itemToShare.linkToShare = 'https://' + window.location.host + '/#/apercu?title=' + encodeURIComponent(document.filename) + '&url=' + encodeURIComponent(shareLink.url);

                        UtilsService.openSocialShareModal('document', itemToShare)
                            .then(function () {
                                // Modal close
                                ToasterService.showToaster('#list-document-success-toaster', 'mail.send.ok');
                            }, function () {
                                // Modal dismiss
                            });

                    }, function (res) {
                        if (res.error === 'email_not_verified') {
                            ToasterService.showToaster('#list-document-error-toaster', 'dropbox.message.error.share.emailnotverified');
                        } else {
                            ToasterService.showToaster('#list-document-error-toaster', 'dropbox.message.error.share.ko');
                        }

                    });

                // angular-google-analytics tracking pages
                Analytics.trackPage('/document/share.html');
            }

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
            LoaderService.setLoaderProgress(20);

            fileStorageService.listAll().then(function (listDocument) {
                LoaderService.setLoaderProgress(100);
                LoaderService.hideLoader();

                if (listDocument) {
                    $scope.listDocument = listDocument;
                    //$scope.listDocument = $scope.listDocumentFolder(listDocument);
                } else {
                    $scope.listDocument = [];
                }
                $scope.initialiseShowDocs();


            }, function () {
                LoaderService.hideLoader();
            });
        };

        $scope.listDocumentFolder = function( listDocument ){
            var newList = [];

            for (var i = 0; i < listDocument.length; i++) {
                var filepathArray = listDocument[i].filepath.split('/');

                if( filepathArray.length > 2 ){
                    var currentFilepath = '';

                    for(var j=1; j<filepathArray.length-1; j++){
                        currentFilepath += '/' + filepathArray[i];

                        var folder = {
                            filename: filepathArray[j],
                            filepath: currentFilepath,
                            dateModification: '',
                            state: 'folder'
                        };

                        if( !$scope.folderAlreadyIn(newList, folder) ){
                            newList.push(folder);
                        }
                    }
                }

                var doc = {
                    filename: listDocument[i].filename,
                    filepath: listDocument[i].filepath,
                    dateModification: listDocument[i].dateModification,
                    state: 'file'
                };
                newList.push(doc);
            }
            return newList;
        };

        $scope.folderAlreadyIn = function(list, folder){
            for (var l in list){
                if(l.filepath === folder.filepath && l.filename === folder.filename){
                    return true;
                }
            }
            return false;
        }

        /**
         * Duplicate a document
         * @param document The document to be duplicate
         */
        $scope.duplicateDoc = function (document) {
            $log.debug('Duplicate a document', document);

            documentService.copyDocument(document).then(function () {

                ToasterService.showToaster('#list-document-success-toaster', 'document.message.copy.ok');
                $scope.getListDocument();
            });

        };

    });