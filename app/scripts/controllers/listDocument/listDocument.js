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

angular.module('cnedApp').controller('listDocumentCtrl', function ($scope, $rootScope, serviceCheck, $http, $location, dropbox, $window,
                                                                   configuration, fileStorageService, $modal, tagsService, $log) {
    $('#titreCompte').hide();
    $('#titreProfile').hide();
    $('#titreDocument').hide();
    $('#titreAdmin').hide();
    $('#detailProfil').hide();
    $('#titreDocumentApercu').hide();
    $('#titreTag').hide();
    $('#titreListDocument').show();

    $scope.showList = false;

    $scope.configuration = configuration;

    $scope.onlineStatus = true;
    $scope.files = [];
    $scope.errorMsg = '';
    $scope.displayDestination = false;
    $scope.escapeTest = true;
    $scope.afficheErreurModifier = false;
    $scope.videModifier = false;
    $scope.specialCaracterModifier = false;
    $scope.testEnv = false;
    $scope.envoiMailOk = false;
    $scope.deleteFlag = false;
    $scope.flagModifieDucoment = false;
    $scope.flagListDocument = false;
    $scope.modifyCompleteFlag = false;
    $scope.loader = false;
    $rootScope.restructedBlocks = null;
    $rootScope.uploadDoc = null;
    $scope.requestToSend = {};
    // If notes must be shared with the document
    $scope.annotationOk = false;
    $scope.initLock = false;
    $scope.lockrestoreAllDocuments = false;

    $scope.sortType = 'dateModification';
    $scope.sortReverse = true;

    if (localStorage.getItem('compteId')) {
        $scope.requestToSend = {
            id: localStorage.getItem('compteId')
        };
    }

    $scope.changed = function (annotationOk) {
        console.log(annotationOk);
        $scope.annotationOk = annotationOk;
    };

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

    $scope.openDeleteModal = function (document) {
        $scope.deleteDocument = document;
        $scope.flagDeleteOpened = true;
    };

    // delete the document
    $scope.supprimerDocument = function () {
        localStorage.setItem('lockOperationDropBox', true);
        $scope.showLoader('Supression du document en cours. Veuillez patienter.');
        $scope.loaderProgress = 30;
        fileStorageService.deleteFile($rootScope.isAppOnline, $scope.deleteDocument.filepath, $rootScope.currentUser.dropbox.accessToken).then(function () {
            $scope.loaderProgress = 75;
            localStorage.setItem('lockOperationDropBox', false);
            $scope.deleteFlag = true;
            $('#myModal').modal('hide');
            $scope.loaderProgress = 100;
            $scope.modifyCompleteFlag = true;
            $scope.hideLoader();
            /* Removing notes of the document on localStorage */
            $scope.updateNote('DELETE');
            if ($scope.testEnv === false) {
                $scope.getListDocument();
            }
        });
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
        $scope.showLoader('Renommage de votre document en cours. Veuillez patienter...');
        $scope.loaderProgress = 10;
        var signature = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent($scope.selectedItem))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.selectedItem))[0], '');
        var ladate = new Date();
        var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();
        $scope.nouveauTitre = tmpDate + '_' + encodeURIComponent($scope.nouveauTitre) + '_' + signature;
        fileStorageService.renameFile($rootScope.isAppOnline, $scope.selectedItem, '/' + $scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken).then(function () {
            $scope.loaderProgress = 80;
            localStorage.setItem('lockOperationDropBox', false);
            $scope.modifyCompleteFlag = true;
            $scope.updateNote('EDIT');
            $scope.getListDocument();
        });
    };

    /* load email form */
    $scope.loadMail = function () {
        $scope.displayDestination = true;
    };

    /* regex email */
    $scope.verifyEmail = function (email) {
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (reg.test(email)) {
            return true;
        } else {
            return false;
        }
    };
    $scope.docPartage = function (param) {
        $scope.shareMailInvalid = false;
        if (!$rootScope.isAppOnline) {
            $modal.open({
                templateUrl: 'views/common/informationModal.html',
                controller: 'InformationModalCtrl',
                size: 'sm',
                resolve: {
                    title: function () {
                        return 'Pas d\'accès internet';
                    },
                    content: function () {
                        return 'La fonctionnalité de partage de document nécessite un accès à internet';
                    },
                    reason: function () {
                        return null;
                    },
                    forceClose: function () {
                        return null;
                    }
                }
            });
        } else {
            $('#shareModal').modal('show');
            $scope.docApartager = param;
            fileStorageService.shareFile($scope.docApartager.filepath, $rootScope.currentUser.dropbox.accessToken).then(function (shareLink) {
                $scope.docApartager.lienApercu = configuration.URL_REQUEST + '/#/apercu?url=' + shareLink;
                $('.action_btn').attr('data-shown', 'false');
                $('.action_list').attr('style', 'display: none;');
                $scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
                console.log('$scope.encodeURI ==> ');
                console.log($scope.encodeURI);
                if ($scope.docApartager && $scope.docApartager.lienApercu) {
                    $scope.encodedLinkFb = $scope.docApartager.lienApercu.replace('#', '%23');
                }
                $scope.socialShare();
            });
        }
    };

    /* sending email to the addressee*/
    $scope.sendMail = function () {
        $('#confirmModal').modal('hide');
        $scope.destination = $scope.destinataire;
        $scope.loader = true;
        if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
            if ($scope.docApartager) {
                if ($rootScope.currentUser.dropbox.accessToken) {
                    if ($rootScope.currentUser && $scope.docApartager && $scope.docApartager.filepath) {
                        $scope.sendVar = {
                            to: $scope.destinataire,
                            content: ' a utilisé Accessidys pour partager un fichier avec vous !  ' + $scope.docApartager.lienApercu,
                            encoded: '<span> vient d\'utiliser Accessidys pour partager ce fichier avec vous :   <a href=' + $scope.docApartager.lienApercu + '>' + $scope.docApartager.filename + '</a> </span>',
                            prenom: $rootScope.currentUser.local.prenom, // the first name
                            fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
                            doc: $scope.docApartager.filename
                        };
                        $http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar).success(function (data) {
                            $('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
                            $scope.sent = data;
                            $scope.envoiMailOk = true;  // the status of the sending
                            $scope.destinataire = ''; // the addressee
                            $scope.loader = false;
                            $scope.displayDestination = false;
                            // $('#shareModal').modal('hide');
                        });
                    }
                }
            }
        } else {
            $('.sendingMail').removeAttr('data-dismiss', 'modal');
            $('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');
            $scope.shareMailInvalid = true;
        }
    };

    $scope.clearSocialShare = function (document) {
        $scope.confirme = false;
        $scope.displayDestination = false;
        $scope.destinataire = '';
        $scope.addAnnotation = false;
        if (localStorage.getItem('notes') !== null) {
            var noteList = JSON.parse(JSON.parse(localStorage.getItem('notes')));
            // console.log(noteList);
            $scope.annotationToShare = [];
            // console.log(document.path);
            /* jshint ignore:start */
            if ($scope.testEnv == false) {
                $scope.docFullName = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec(encodeURIComponent(document.filepath.replace('/', '')))[0]);
            } else {
                $scope.docFullName = 'test';
            }
            /* jshint ignore:end */

            console.log($scope.docFullName);
            if (noteList.hasOwnProperty(document.filename)) {
                // console.log('annotation for this doc is found');
                $scope.addAnnotation = true;
                $scope.annotationToShare = noteList[document.filename];
                // console.log($scope.annotationToShare)
            } else {
                $scope.addAnnotation = false;
            }
        } else {
            $scope.addAnnotation = false;
        }
    };
    /* jshint ignore:start */

    $scope.processAnnotation = function () {
        localStorage.setItem('lockOperationDropBox', true);
        if ($scope.annotationOk && $scope.docFullName.length > 0 && $scope.annotationToShare != null) {
            console.log('share annotation too');
            var tmp2 = dropbox.upload($scope.docFullName + '.json', $scope.annotationToShare, $rootScope.currentUser.dropbox.accessToken);
            tmp2.then(function () {
                console.log('json uploaded');
                var shareAnnotations = dropbox.shareLink($scope.docFullName + '.json', $rootScope.currentUser.dropbox.accessToken);
                shareAnnotations.then(function (result) {
                    $scope.docApartager.lienApercu += '&annotation=' + result.url;
                    $scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
                    $scope.confirme = true;
                    $scope.attachFacebook();
                    $scope.attachGoogle();
                    localStorage.setItem('lockOperationDropBox', false);

                });
            });
        } else {
            localStorage.setItem('lockOperationDropBox', false);

            console.log('without share of annotation');
            $scope.confirme = true;
            $scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
            $scope.attachFacebook();
            $scope.attachGoogle();
        }
    };
    /* jshint ignore:end */

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

    $scope.socialShare = function () {
        $scope.shareMailInvalid = false;
        $scope.destination = $scope.destinataire;
        if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
            $('#confirmModal').modal('show');
            $('#shareModal').modal('hide');
        } else if($scope.destination && $scope.destination.length > 0) {
            $scope.shareMailInvalid = true;
        }
    };

    $scope.dismissConfirm = function () {
        $scope.destinataire = '';
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

    $scope.showLoader = function (loaderMessage) {
        $('.loader_cover').show();
        $scope.showloaderProgress = true;
        $scope.showloaderProgressScope = true;
        $scope.loaderMessage = loaderMessage;
    };

    $scope.hideLoader = function () {
        $scope.showloaderProgress = false;
        $scope.showloaderProgressScope = false;
        $scope.loaderMessage = '';
        $scope.loaderProgress = 0;
    };

    $scope.getListDocument = function () {
        $scope.showLoader('Chargement de vos documents en cours. Veuillez patienter.');
        return serviceCheck.getData().then(function (data) {
            var dropboxToken = '';
            if (data.user && data.user.dropbox) {
                dropboxToken = data.user.dropbox.accessToken;
            }
            $scope.loaderProgress = 20;
            fileStorageService.searchAllFiles($rootScope.isAppOnline, dropboxToken).then(function (listDocument) {
                $scope.loaderProgress = 100;
                $scope.hideLoader();
                $scope.listDocument = listDocument;
                $scope.initialiseShowDocs();
                $scope.showList = true;
            }, function () {
                $scope.hideLoader();
            });
        }, function () {
            $scope.hideLoader();
        });
    };

    $scope.hideLoader();
    $scope.getListDocument();

});