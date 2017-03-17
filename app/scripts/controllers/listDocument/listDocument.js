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
    .controller('listDocumentCtrl', function ($scope, $rootScope, serviceCheck, $http, $location, dropbox, $window,
                                              configuration, fileStorageService, $uibModal, tagsService, Analytics,
                                              gettextCatalog, $timeout, UtilsService, LoaderService, $log) {

        $scope.showList = false;
        $scope.configuration = configuration;
        $scope.onlineStatus = true;
        $scope.files = [];
        $scope.afficheErreurModifier = false;
        $scope.videModifier = false;
        $scope.specialCaracterModifier = false;
        $scope.testEnv = false;
        $scope.flagModifieDucoment = false;
        $scope.flagListDocument = false;
        $scope.modifyCompleteFlag = false;
        $rootScope.restructedBlocks = null;
        $rootScope.uploadDoc = null;
        $scope.requestToSend = {};
        // If notes must be shared with the document
        $scope.initLock = false;
        $scope.lockrestoreAllDocuments = false;

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

        $scope.openModifieTitre = function (document) {
            $scope.selectedItem = document.filepath;
            $scope.oldTitre = document.filename.replace('/', '').replace('.html', '');
            $scope.selectedItemLink = document.lienApercu;
            $scope.afficheErreurModifier = false;
            $scope.videModifier = false;
            $scope.specialCaracterModifier = false;
            $scope.nouveauTitre = '';
            $scope.oldName = document.nomAffichage;
            $scope.nouveauTitre = document.nomAffichage;
            if (!$scope.$$phase) {
                $scope.$digest();
            } // jshint ignore:line

            // angular-google-analytics tracking pages
            Analytics.trackPage('/document/edit-title.html');
        };
        /* jshint ignore:start */

        // change the title
        $scope.modifieTitre = function () {
            if ($scope.nouveauTitre !== '') {
                if ($scope.nouveauTitre == $scope.oldName) { // jshint
                    // ignore:line
                    $('#EditTitreModal').modal('hide');
                } else {
                    if (!serviceCheck.checkName($scope.nouveauTitre) || $scope.nouveauTitre.length > 201) {
                        $scope.specialCaracterModifier = true;

                        /* Hide other error messages*/
                        $scope.videModifier = false;
                        $scope.afficheErreurModifier = false;

                        return;
                    }
                    $scope.videModifier = false;
                    var documentExist = false;
                    for (var i = 0; i < $scope.listDocument.length; i++) {
                        if ($scope.listDocument[i].filepath.toLowerCase().indexOf('_' + $scope.nouveauTitre.toLowerCase() + '_') > -1) {
                            documentExist = true;
                            break;
                        }
                    }
                    if (documentExist) {
                        $scope.afficheErreurModifier = true;
                        $scope.loader = false;

                        /* Hide other messages */
                        $scope.videModifier = false;
                        $scope.specialCaracterModifier = false;
                    } else {
                        $('#EditTitreModal').modal('hide');
                        $scope.flagModifieDucoment = true;
                        $scope.modifieTitreConfirme();
                    }
                }
            } else {
                $scope.videModifier = true;
                /* Hide other messages */
                $scope.afficheErreurModifier = false;
                $scope.specialCaracterModifier = false;
            }
        };
        /* jshint ignore:end */

        // rename the confirmed title of the document
        $scope.modifieTitreConfirme = function () {
            localStorage.setItem('lockOperationDropBox', true);
            LoaderService.showLoader('document.message.info.rename.inprogress', true);
            LoaderService.setLoaderProgress(10);

            var signature = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent($scope.selectedItem))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.selectedItem))[0], '');
            var ladate = new Date();
            var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();
            $scope.nouveauTitre = tmpDate + '_' + encodeURIComponent($scope.nouveauTitre) + '_' + signature;
            fileStorageService.renameFile($rootScope.isAppOnline, $scope.selectedItem, '/' + $scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken)
                .then(function () {
                    LoaderService.setLoaderProgress(80);
                    localStorage.setItem('lockOperationDropBox', false);
                    $scope.modifyCompleteFlag = true;
                    $scope.updateNote('EDIT');
                    $scope.getListDocument();
                });
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
                        itemToShare.linkToShare = configuration.URL_REQUEST + '/#/apercu?url=' + shareLink;

                        //$scope.encodedLinkFb = $scope.docApartager.lienApercu.replace('#', '%23');
                        UtilsService.openSocialShareModal('document', itemToShare)
                            .then(function () {
                                // Modal close
                                $scope.showToaster('#list-document-success-toaster', 'mail.send.ok');
                            }, function () {
                                // Modal dismiss
                            });

                    });

                // angular-google-analytics tracking pages
                Analytics.trackPage('/document/share.html');
            }

        };


        // TODO To be delete
        $scope.attachFacebook = function () {
            console.log(decodeURIComponent($scope.encodeURI));
            $('.facebook-share .fb-share-button').remove();
            $('.facebook-share span').before('<div class="fb-share-button" data-href="' + decodeURIComponent($scope.encodeURI) + '" data-layout="button"></div>');
            try {
                FB.XFBML.parse();
            } catch (ex) {
                console.log('gotchaa ... ');
                console.log(ex);
            }

        };

        $scope.googleShareStatus = 0;

        $scope.reloadPage = function () {
            $window.location.reload();
        };

        // TODO To be delete
        $scope.attachGoogle = function () {
            console.log('IN ==> ');
            var options = {
                contenturl: decodeURIComponent($scope.encodeURI),
                contentdeeplinkid: '/pages',
                clientid: '807929328516-g7k70elo10dpf4jt37uh705g70vhjsej.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                prefilltext: '',
                calltoactionlabel: 'LEARN_MORE',
                calltoactionurl: decodeURIComponent($scope.encodeURI),
                callback: function (result) {
                    console.log(result);
                    console.log('this is the callback');
                },
                onshare: function (response) {
                    if (response.status === 'started') {
                        $scope.googleShareStatus++;
                        if ($scope.googleShareStatus > 1) {
                            $('#googleShareboxIframeDiv').remove();
                            // alert('some error in sharing');
                            $('#shareModal').modal('hide');
                            $('#informationModal').modal('show');
                            localStorage.setItem('googleShareLink', $scope.encodeURI);
                        }
                    } else {
                        // localStorage.removeItem('googleShareLink');
                        $scope.googleShareStatus = 0;
                        $('#shareModal').modal('hide');
                    }
                    // These are the objects returned by the platform
                    // When the sharing starts...
                    // Object {status: "started"}
                    // When sharing ends...
                    // Object {action: "shared", post_id: "xxx", status:
                    // "completed"}
                }
            };

            gapi.interactivepost.render('google-share', options);
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
                fileStorageService.searchAllFiles($rootScope.isAppOnline, dropboxToken).then(function (listDocument) {
                    LoaderService.setLoaderProgress(100);
                    LoaderService.hideLoader();
                    $scope.listDocument = listDocument;
                    $scope.initialiseShowDocs();
                    $scope.showList = true;
                }, function () {
                    LoaderService.hideLoader();
                });
            }, function () {
                LoaderService.hideLoader();
            });
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

        LoaderService.hideLoader();
        $scope.getListDocument();

    });