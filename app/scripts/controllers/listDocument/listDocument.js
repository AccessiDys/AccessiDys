/* File: main.js
 *
 * Copyright (c) 2014
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
/* global listDocument, Appversion */

angular.module('cnedApp').controller('listDocumentCtrl', function($scope, $rootScope, serviceCheck, $http, $location, dropbox, $window, configuration) {
    $('#titreCompte').hide();
    $('#titreProfile').hide();
    $('#titreDocument').hide();
    $('#titreAdmin').hide();
    $('#detailProfil').hide();
    $('#titreDocumentApercu').hide();
    $('#titreTag').hide();
    $('#titreListDocument').show();

    $scope.onlineStatus = true;
    $scope.files = [];
    $scope.errorMsg = '';
    $scope.displayDestination = false;
    $scope.files = [];
    $scope.errorMsg = '';
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
    $scope.annotationOk = false;

    if (localStorage.getItem('compteId')) {
        $scope.requestToSend = {
            id: localStorage.getItem('compteId')
        };
    }

    $scope.showloaderProgress = false;
    $scope.showloaderProgressScope = false;
    $rootScope.$on('RefreshListDocument', function() {
        $scope.initListDocument();
    });

    if ($rootScope.socket) {
        $rootScope.socket.on('notif', function() {

        });
    }

    $scope.changed = function(annotationOk) {
        console.log(annotationOk);
        $scope.annotationOk = annotationOk;
    };

    $scope.initListDocument = function() {
        if ($location.absUrl().indexOf('key=') > -1) {
            var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
            localStorage.setItem('compteId', callbackKey);
            $rootScope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('?key'));
            localStorage.setItem('dropboxLink', $rootScope.listDocumentDropBox);
            //window.location.href = $rootScope.listDocumentDropBox;
        }

        if ($location.absUrl().indexOf('?reload=true') > -1) {
            var reloadParam = $location.absUrl().substring(0, $location.absUrl().indexOf('?reload=true'));
            window.location.href = reloadParam;
        }
        if ($scope.testEnv === false) {
            $scope.browzerState = navigator.onLine;
        }
        if ($scope.browzerState) {
            if (localStorage.getItem('compteId')) {
                var user = serviceCheck.getData();
                user.then(function(result) {
                    if (result.loged) {
                        if (result.dropboxWarning === false) {
                            $rootScope.dropboxWarning = false;
                            $scope.missingDropbox = false;
                            $rootScope.loged = true;
                            $rootScope.admin = result.admin;
                            if (!$rootScope.$$phase) {
                                $rootScope.$digest();
                            } // jshint ignore:line
                            if ($location.path() !== '/inscriptionContinue') {
                                $location.path('/inscriptionContinue');
                            }
                        } else {
                            $rootScope.currentUser = result.user;
                            $rootScope.loged = true;
                            $rootScope.admin = result.admin;
                            if (!$rootScope.$$phase) {
                                $rootScope.$digest();
                            }
                            if ($rootScope.currentUser.dropbox.accessToken) {
                                var tmp5 = dropbox.search('.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                tmp5.then(function(data) {
                                    if (data.status === 200) {
                                        $scope.listDocument = listDocument;
                                        $scope.initialiseShowDocs();
                                        $scope.initialLenght = $scope.listDocument.length;
                                        for (var i = 0; i < $scope.listDocument.length; i++) {
                                            var documentExist = false;
                                            for (var y = 0; y < data.length; y++) {
                                                if ($scope.listDocument[i].path === data[y].path) {
                                                    documentExist = true;
                                                    break;
                                                }
                                            }
                                            if (!documentExist) {
                                                $scope.listDocument.splice(i, 1);
                                            }
                                        }
                                        if ($scope.initialLenght !== $scope.listDocument.length) {
                                            var tmp7 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                            tmp7.then(function(entirePage) {
                                                var debut = entirePage.search('var listDocument') + 18;
                                                var fin = entirePage.indexOf('"}];', debut) + 3;
                                                entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
                                                entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson($scope.listDocument));
                                                var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                                tmp6.then(function() {
                                                    var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                                    tmp3.then(function(dataFromDownload) {

                                                        var newVersion = parseInt(dataFromDownload.charAt(dataFromDownload.indexOf(':v') + 2)) + 1;
                                                        dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(dataFromDownload.indexOf(':v') + 2), ':v' + newVersion);

                                                        // var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
                                                        // dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
                                                        var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                                        tmp4.then(function() {
                                                            $scope.flagListDocument = true;
                                                            if ($scope.testEnv === false) {
                                                                //alert('attention reload');
                                                                window.location.reload();
                                                            }
                                                        });
                                                    });
                                                });
                                            });
                                        }
                                    } else {
                                        console.log('status is not 200');
                                    }
                                    $scope.loader = false;
                                    $scope.localSetting();
                                    $scope.listDocument = listDocument;
                                    $scope.initialiseShowDocs();
                                    $('#listDocumentPage').show();
                                    for (var y = 0; y < $scope.listDocument.length; y++) { // jshint ignore:line
                                        var tmp = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[y].path));
                                        if (tmp) {
                                            $scope.listDocument[y].nomAffichage = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[y].path))[0].replace('_', '').replace('_', ''));
                                            $scope.listDocument[y].dateFromate = /((\d+)(-)(\d+)(-)(\d+))/i.exec($scope.listDocument[y].path)[0];
                                        }
                                    }
                                    for (var i = 0; i < $scope.listDocument.length; i++) { // jshint ignore:line
                                        var tmp = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[i].path)); // jshint ignore:line
                                        if (!tmp) {
                                            $scope.listDocument.splice(i, 1);
                                        }
                                    }

                                    $rootScope.indexLoader = false;
                                    if (!$rootScope.$$phase) {
                                        $rootScope.$digest();
                                    }


                                    $http.post(configuration.URL_REQUEST + '/allVersion', {
                                            id: $rootScope.currentUser.local.token
                                        })
                                        .success(function(dataRecu) {
                                            if (dataRecu.length !== 0) {
                                                if (Appversion !== '' + dataRecu[0].appVersion + '') { // jshint ignore:line
                                                    console.log('different');
                                                    $scope.newAppVersion = dataRecu[0].appVersion;
                                                    $scope.startUpgrade();
                                                } else {
                                                    console.log('les meme');
                                                }
                                            }
                                        }).error(function() {
                                            console.log('erreur cheking version');
                                        });
                                    var dataProfile;
                                    if (localStorage.getItem('compteId')) {
                                        dataProfile = {
                                            id: localStorage.getItem('compteId')
                                        };
                                    }
                                });
                            } else {
                                $location.path('/');
                            }
                        }
                    } else {
                        $location.path('/');
                    }
                });
            } else {
                $location.path('/');
            }
        } else {
            localStorage.setItem('wasOffLine', true);
            $scope.listDocument = listDocument;
            $scope.initialiseShowDocs();
            $scope.onlineStatus = false;
            /* jshint ignore:start */
            for (var y = 0; y < $scope.listDocument.length; y++) {
                var tmp = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[y].path));
                if (tmp) {
                    $scope.listDocument[y].nomAffichage = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[y].path))[0].replace('_', '').replace('_', ''));
                    $scope.listDocument[y].dateFromate = /((\d+)(-)(\d+)(-)(\d+))/i.exec($scope.listDocument[y].path)[0];
                }
            }
            for (var i = 0; i < $scope.listDocument.length; i++) {
                var tmp = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[i].path));
                if (!tmp) {
                    $scope.listDocument.splice(i, 1);
                }
            }
            $('#listDocumentPage').show();
            /* jshint ignore:end */
        }
    };

    $scope.updateNote = function(operation) {
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

    $scope.open = function(document) {
        $scope.oldTitre = document.path.replace('/', '').replace('.html', '');
        if ($scope.testEnv === false) {
            $scope.deleteLink = document.path;
            $scope.deleteLienDirect = document.lienApercu;
            $scope.listDocument = angular.fromJson(listDocument);
            $scope.initialiseShowDocs();
        }
        $scope.flagDeleteOpened = true;
    };

    $scope.suprimeDocument = function() {
        if ($scope.testEnv === false) {
            $('.loader_cover').show();
        }
        $scope.showloaderProgress = true;
        $scope.showloaderProgressScope = true;
        $scope.loaderMessage = 'Supression du document de votre compte DropBox en cours. Veuillez patienter ';
        $scope.loaderProgress = 10;
        if (localStorage.getItem('compteId')) {
            var tmp2 = dropbox.delete('/' + $scope.deleteLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
            tmp2.then(function() {
                var appcacheLink = $scope.deleteLink;
                appcacheLink = appcacheLink.replace('.html', '.appcache');
                $scope.loaderProgress = 30;
                var tmp12 = dropbox.delete('/' + appcacheLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                tmp12.then(function(deleteResult) {
                    var jsonLink;
                    if ($scope.testEnv === false) {
                        jsonLink = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.deleteLink))[0]; // jshint ignore:line
                    } else {
                        jsonLink = $scope.deleteLink;
                    }
                    var searchApercu = dropbox.search(jsonLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    searchApercu.then(function(result) {
                        var foundDoc = false;
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].path.indexOf('.json') > 0 && result[i].path.indexOf(jsonLink)) {
                                foundDoc = true;
                                break;
                            }
                        }
                        if (foundDoc) {
                            var tmp2 = dropbox.delete('/' + $scope.deleteLink.replace('.html', '.json'), $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                            tmp2.then(function() {

                                $scope.deleteFlag = true;
                                $('#myModal').modal('hide');
                                $scope.oldFile = deleteResult;
                                $scope.loaderMessage = 'Mise en cache de votre document en cours. Veuillez patienter ';
                                $scope.loaderProgress = 40;
                                var tmp3 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                tmp3.then(function(entirePage) {
                                    for (var i = 0; i < $scope.listDocument.length; i++) {
                                        if ($scope.listDocument[i].path === $scope.deleteLink) {
                                            $scope.listDocument.splice(i, 1);
                                            break;
                                        }
                                    }
                                    $scope.verifLastDocument($scope.deleteLienDirect, null);
                                    var debut = entirePage.search('var listDocument') + 18;
                                    var fin = entirePage.indexOf('"}];', debut) + 3;
                                    entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
                                    entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson($scope.listDocument));

                                    $scope.loaderProgress = 50;
                                    var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                    tmp6.then(function() {
                                        $scope.loaderProgress = 60;
                                        var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                        tmp3.then(function(dataFromDownload) {
                                            $scope.loaderProgress = 80;
                                            var newVersion = parseInt(dataFromDownload.charAt(dataFromDownload.indexOf(':v') + 2)) + 1;
                                            dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(dataFromDownload.indexOf(':v') + 2), ':v' + newVersion);

                                            // var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
                                            // dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
                                            var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                            tmp4.then(function() {
                                                $scope.loaderProgress = 100;
                                                $scope.modifyCompleteFlag = true;
                                                $scope.loader = false;
                                                /* Suppression des annotations de ce document sur localStorage */
                                                $scope.updateNote('DELETE');
                                                if ($scope.testEnv === false) {
                                                    window.location.reload();
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        } else {

                            $scope.deleteFlag = true;
                            $('#myModal').modal('hide');
                            $scope.oldFile = deleteResult;
                            $scope.loaderMessage = 'Mise en cache de votre document en cours. Veuillez patienter ';
                            $scope.loaderProgress = 40;
                            var tmp3 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                            tmp3.then(function(entirePage) {
                                for (var i = 0; i < $scope.listDocument.length; i++) {
                                    if ($scope.listDocument[i].path === $scope.deleteLink) {
                                        $scope.listDocument.splice(i, 1);
                                        break;
                                    }
                                }
                                $scope.verifLastDocument($scope.deleteLienDirect, null);
                                var debut = entirePage.search('var listDocument') + 18;
                                var fin = entirePage.indexOf('"}];', debut) + 3;
                                entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
                                entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson($scope.listDocument));

                                $scope.loaderProgress = 50;
                                var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                tmp6.then(function() {
                                    $scope.loaderProgress = 60;
                                    var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                    tmp3.then(function(dataFromDownload) {
                                        $scope.loaderProgress = 80;
                                        var newVersion = parseInt(dataFromDownload.charAt(dataFromDownload.indexOf(':v') + 2)) + 1;
                                        dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(dataFromDownload.indexOf(':v') + 2), ':v' + newVersion);

                                        // var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
                                        // dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
                                        var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                        tmp4.then(function() {
                                            $scope.loaderProgress = 100;
                                            $scope.modifyCompleteFlag = true;
                                            $scope.loader = false;
                                            /* Suppression des annotations de ce document sur localStorage */
                                            $scope.updateNote('DELETE');
                                            if ($scope.testEnv === false) {
                                                window.location.reload();
                                            }
                                        });
                                    });
                                });
                            });
                        }

                    });
                });
            });

        }
    };

    $scope.openModifieTitre = function(document) {
        $scope.selectedItem = document.path;
        $scope.oldTitre = document.path.replace('/', '').replace('.html', '');
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

    $scope.modifieTitre = function() {
        $scope.loader = true;
        if ($scope.nouveauTitre !== '') {
            if ($scope.nouveauTitre == $scope.oldName) {
                $('#EditTitreModal').modal('hide');
            } else {
                if (!serviceCheck.checkName($scope.nouveauTitre)) {
                    $scope.specialCaracterModifier = true;

                    /* Cacher les autres messages d'erreurs */
                    $scope.videModifier = false;
                    $scope.afficheErreurModifier = false;

                    $scope.loader = false;
                    return;
                }
                $scope.videModifier = false;
                var documentExist = false;
                for (var i = 0; i < $scope.listDocument.length; i++) {
                    if ($scope.listDocument[i].path.indexOf('_' + $scope.nouveauTitre + '_') > -1) {
                        documentExist = true;
                        break;
                    }
                }
                if (documentExist) {
                    $scope.afficheErreurModifier = true;
                    $scope.loader = false;

                    /* Cacher les autres messages */
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
            /* Cacher les autres messages */
            $scope.afficheErreurModifier = false;
            $scope.specialCaracterModifier = false;
        }
    };

    $scope.verifLastDocument = function(oldUrl, newUrl) {
        var lastDocument = localStorage.getItem('lastDocument');
        if (lastDocument && oldUrl === lastDocument) {
            if (newUrl && newUrl.length > 0) {
                newUrl = newUrl + '#/apercu';
                localStorage.setItem('lastDocument', newUrl);
            } else {
                localStorage.removeItem('lastDocument');
            }
        }
    };

    $scope.modifieTitreConfirme = function() {
        $('.loader_cover').show();
        $scope.showloaderProgress = true;
        $scope.showloaderProgressScope = true;
        $scope.loaderMessage = 'Enregistrement du document dans votre compte DropBox en cours. Veuillez patienter ';
        $scope.loaderProgress = 10;
        $scope.signature = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent($scope.selectedItem))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.selectedItem))[0], '');
        var ladate = new Date();
        var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();
        $scope.nouveauTitre = tmpDate + '_' + encodeURIComponent($scope.nouveauTitre) + '_' + $scope.signature;
        var tmp = dropbox.rename($scope.selectedItem, '/' + $scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
        tmp.then(function(result) {
            $scope.loaderProgress = 20;
            $scope.newFile = result;
            var tmp3 = dropbox.shareLink($scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
            tmp3.then(function(resultShare) {
                $scope.loaderProgress = 30;
                $scope.newShareLink = resultShare.url;
                // var tmp2 = dropbox.delete('/' + $scope.selectedItem, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                // tmp2.then(function(deleteResult) {
                // $scope.oldFile = deleteResult;
                $scope.loaderProgress = 40;
                $scope.oldAppcacheName = $scope.selectedItem.replace('.html', '.appcache');
                var tmp11 = dropbox.rename($scope.oldAppcacheName, '/' + $scope.nouveauTitre + '.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                tmp11.then(function() {
                    // var tmp112 = dropbox.delete('/' + $scope.oldAppcacheName, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    // tmp112.then(function() {
                    $scope.loaderProgress = 50;
                    var tmp12 = dropbox.shareLink($scope.nouveauTitre + '.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    tmp12.then(function(dataFromDownloadAppcache) {
                        $scope.loaderProgress = 55;
                        var tmp13 = dropbox.download($scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                        tmp13.then(function(entirePageApercu) {
                            $scope.loaderProgress = 60;
                            var debutApercu = entirePageApercu.search('manifest="') + 10;
                            var finApercu = entirePageApercu.indexOf('.appcache"', debutApercu) + 9;
                            entirePageApercu = entirePageApercu.replace(entirePageApercu.substring(debutApercu, finApercu), '');
                            entirePageApercu = entirePageApercu.replace('manifest=""', 'manifest="' + dataFromDownloadAppcache.url + '"');
                            var tmp14 = dropbox.upload($scope.nouveauTitre + '.html', entirePageApercu, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                            tmp14.then(function() {
                                $scope.loaderProgress = 65;
                                var tmp3 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                tmp3.then(function(entirePage) {
                                    $scope.loaderMessage = 'Mise en cache de votre document en cours. Veuillez patienter ';
                                    $scope.loaderProgress = 70;
                                    for (var i = 0; i < listDocument.length; i++) {
                                        if (listDocument[i].path === $scope.selectedItem) {
                                            $scope.newFile.lienApercu = $scope.newShareLink + '#/apercu';
                                            listDocument[i] = $scope.newFile;
                                            break;
                                        }
                                    }
                                    $scope.verifLastDocument($scope.selectedItemLink, $scope.newShareLink);
                                    var debut = entirePage.search('var listDocument') + 18;
                                    var fin = entirePage.indexOf('"}];', debut) + 3;
                                    entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
                                    entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson(listDocument));
                                    var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                    tmp6.then(function() {
                                        $scope.loaderProgress = 80;
                                        var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                        tmp3.then(function(dataFromDownload) {
                                            $scope.loaderProgress = 90;
                                            var newVersion = parseInt(dataFromDownload.charAt(dataFromDownload.indexOf(':v') + 2)) + 1;
                                            dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(dataFromDownload.indexOf(':v') + 2), ':v' + newVersion);

                                            // var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
                                            // dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
                                            var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                            tmp4.then(function() {
                                                $scope.modifyCompleteFlag = true;
                                                /* Modification du nom de documents dans les annotations sur localStorage */
                                                $scope.updateNote('EDIT');
                                                if ($scope.testEnv === false) {
                                                    window.location.reload();
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
                // });
            });
            // });
        });
    };

    $scope.verifyLink = function(link) {
        if (link) {
            if ((link.indexOf('https') > -1) || (link.indexOf('http') > -1)) {
                return true;
            }
        }
        return false;
    };

    $scope.ajouterDocument = function() {
        if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length <= 0) {
            $scope.errorMsg = 'Le titre est obligatoire !';
            return;
        }
        if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length > 32) {
            $scope.errorMsg = 'Le titre est trop long !';
            return;
        };
        if (!serviceCheck.checkName($scope.doc.titre)) {
            $scope.errorMsg = 'Veuillez ne pas utiliser les caractères spéciaux.';
            return;
        }
        var foundDoc = false;
        var searchApercu = dropbox.search('_' + $scope.doc.titre + '_', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
        searchApercu.then(function(result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].path.indexOf('.html') > 0 && result[i].path.indexOf('_' + $scope.doc.titre + '_') > 0) {
                    foundDoc = true;
                    $scope.modalToWorkspace = false;
                    break;
                }
            }
            if (foundDoc) {
                $scope.errorMsg = 'Le document existe déja dans Dropbox';
            } else {
                if ((!$scope.doc.lienPdf && $scope.files.length <= 0) || (($scope.doc.lienPdf && /\S/.test($scope.doc.lienPdf)) && $scope.files.length > 0)) {
                    $scope.errorMsg = 'Veuillez saisir un lien ou uploader un fichier !';
                    return;
                }
                if ($scope.doc.lienPdf && !$scope.verifyLink($scope.doc.lienPdf)) {
                    $scope.errorMsg = 'Le lien saisi est invalide. Merci de respecter le format suivant : "http://www.example.com/chemin/NomFichier.pdf"';
                    return;
                }
                $scope.modalToWorkspace = true;
                $('#addDocumentModal').modal('hide');
            }
        });
    };

    $('#addDocumentModal').on('hidden.bs.modal', function() {
        if ($scope.modalToWorkspace) {
            if ($scope.files.length > 0) {
                $scope.doc.uploadPdf = $scope.files;
            }
            $rootScope.uploadDoc = $scope.doc;
            $scope.doc = {};
            if ($scope.escapeTest) {
                $window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
            }
        } else {
            $scope.doc = {};
            $scope.files = [];
            $('#docUploadPdf').val('');
            $scope.errorMsg = null;
        }
    });

    $scope.setFiles = function(element) {
        $scope.files = [];
        var field_txt = '';
        $scope.$apply(function() {
            for (var i = 0; i < element.files.length; i++) {
                if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf' && element.files[i].type !== 'application/epub+zip') {
                    if (element.files[i].type === '' && element.files[i].name.indexOf('.epub')) {
                        $scope.files.push(element.files[i]);
                        field_txt += ' ' + element.files[i].name;
                        $('#filename_show').val(field_txt);
                    } else {
                        $scope.errorMsg = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.';
                        $scope.files = [];
                        break;
                    }
                } else {
                    $scope.files.push(element.files[i]);
                    field_txt += ' ' + element.files[i].name;
                    $('#filename_show').val(field_txt);
                }
            }
        });
    };

    $scope.clearUploadPdf = function() {
        $scope.files = [];
        $('#docUploadPdf').val('');
        $('#filename_show').val('');
    };

    $scope.getfileName = function() {
        console.info(angular.element(this).scope().setFiles(this));
    };

    /*load email form*/
    $scope.loadMail = function() {
        $scope.displayDestination = true;
    };

    /*regex email*/
    $scope.verifyEmail = function(email) {
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (reg.test(email)) {
            return true;
        } else {
            return false;
        }
    };
    $scope.docPartage = function(param) {
        $scope.docApartager = param;
        $('.action_btn').attr('data-shown', 'false');
        $('.action_list').attr('style', 'display: none;');
        $scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
        if ($scope.docApartager && $scope.docApartager.lienApercu) {
            $scope.encodedLinkFb = $scope.docApartager.lienApercu.replace('#', '%23');
        }
        $scope.socialShare();
    };

    /*envoi de l'email au destinataire*/
    $scope.sendMail = function() {
        $('#confirmModal').modal('hide');
        $scope.destination = $scope.destinataire;
        $scope.loader = true;
        if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
            if ($scope.annotationOk) {
                $scope.docApartager.lienApercu = $scope.encodeURI;
            }
            if ($scope.docApartager) {
                if ($rootScope.currentUser.dropbox.accessToken) {
                    if (configuration.DROPBOX_TYPE) {
                        if ($rootScope.currentUser && $scope.docApartager && $scope.docApartager.path) {
                            $scope.docApartager.path = decodeURI($scope.docApartager.path);
                            $scope.sharedDoc = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.docApartager.path))[0].replace('_', '').replace('_', ''));
                            $scope.sendVar = {
                                to: $scope.destinataire,
                                content: ' a utilisé cnedAdapt pour partager un fichier avec vous !  ' + $scope.docApartager.lienApercu,
                                encoded: '<span> vient d\'utiliser CnedAdapt pour partager ce fichier avec vous :   <a href=' + $scope.docApartager.lienApercu + '>' + $scope.sharedDoc + '</a> </span>',
                                prenom: $rootScope.currentUser.local.prenom,
                                fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
                                doc: $scope.sharedDoc
                            };
                            $http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
                                .success(function(data) {
                                    $('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
                                    $scope.sent = data;
                                    $scope.envoiMailOk = true;
                                    $scope.destinataire = '';
                                    $scope.loader = false;
                                    $scope.displayDestination = false;
                                    // $('#shareModal').modal('hide');
                                });
                        }
                    }
                }
            }
        } else {
            $('.sendingMail').removeAttr('data-dismiss', 'modal');
            $('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');
        }
    };

    $scope.clearSocialShare = function(document) {
        $scope.confirme = false;
        $scope.displayDestination = false;
        $scope.destinataire = '';
        $scope.addAnnotation = false;
        if (localStorage.getItem('notes') !== null) {
            var noteList = JSON.parse(JSON.parse(localStorage.getItem('notes')));
            // console.log(noteList);
            $scope.annotationToShare = [];

            $scope.docFullName = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec(document.path.replace('/', ''))[0]);
            if (noteList.hasOwnProperty($scope.docFullName)) {
                // console.log('annotation for this doc is found');
                $scope.addAnnotation = true;
                $scope.annotationToShare = noteList[$scope.docFullName];
                // console.log($scope.annotationToShare)
            } else {
                $scope.addAnnotation = false;
            }
        } else {
            $scope.addAnnotation = false;
        }
    };

    $scope.processAnnotation = function() {
        if ($scope.annotationOk && $scope.docFullName.length > 0 && $scope.annotationToShare != null) {
            console.log('share annotation too');
            var tmp2 = dropbox.upload($scope.docFullName + '.json', $scope.annotationToShare, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
            tmp2.then(function() {
                console.log('json uploaded');
                var shareManifest = dropbox.shareLink($scope.docFullName + '.json', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                shareManifest.then(function(result) {
                    var sharejson = dropbox.shareLink($scope.docFullName + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    sharejson.then(function(docApercuLink) {
                        var annoParam = result.url.substring(result.url.indexOf('/s/') + 3, result.url.indexOf('.json'));
                        var ttmp = docApercuLink.url + '#/apercu?annotation=';
                        ttmp = ttmp + annoParam;
                        $scope.encodeURI = decodeURIComponent(ttmp);
                        $scope.confirme = true;
                        console.log($scope.encodeURI);
                    });

                });
            });
        } else {
            console.log('without share of annotation');
            $scope.confirme = true;
            $scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu) + '#/apercu';
        }
    };

    $scope.socialShare = function() {
        $scope.destination = $scope.destinataire;
        if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
            $('#confirmModal').modal('show');
            $('#shareModal').modal('hide');
        }
    };

    $scope.dismissConfirm = function() {
        $scope.destinataire = '';
    };

    // verifie l'exostance de listTags et listTagByProfil et les remplie si introuvable
    $scope.localSetting = function() {
        if (!localStorage.getItem('listTags')) {
            $http.get(configuration.URL_REQUEST + '/readTags', {
                    params: $scope.requestToSend
                })
                .success(function(data) {
                    $scope.listTags = data;
                    $scope.flagLocalSettinglistTags = true;
                    localStorage.setItem('listTags', JSON.stringify($scope.listTags));
                });
        }
        if (!localStorage.getItem('listTagsByProfil')) {
            $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
                idProfil: localStorage.getItem('compteId')
            }).success(function(data) {
                $scope.listTagsByProfil = data;
                $scope.flagLocalSettinglistTagsByProfil = true;
                localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
            }).error(function() {
                console.log('err');
            });
        }
    };

    $scope.restructurerDocument = function(document) {
        $scope.loader = true;
        $scope.loaderMsg = 'Veuillez patienter ...'
        console.log($scope.loader)

        if ($rootScope.currentUser.dropbox.accessToken) {
            var apercuName = document.path.replace('/', '');
            var token = $rootScope.currentUser.dropbox.accessToken;
            var downloadApercu = dropbox.download(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
            downloadApercu.then(function(result) {
                var arraylistBlock = {
                    children: []
                };
                if (result.indexOf('var blocks = null') < 0) {
                    var debut = result.indexOf('var blocks = ') + 13;
                    var fin = result.indexOf('};', debut) + 1;
                    arraylistBlock = angular.fromJson(result.substring(debut, fin));
                }
                $rootScope.restructedBlocks = arraylistBlock;
                $rootScope.docTitre = apercuName.substring(0, apercuName.lastIndexOf('.html'));
                $scope.loader = false;
                if ($scope.escapeTest) {
                    //$window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
                    $location.path('workspace');
                }
            });
        }

    };

    $scope.startUpgrade = function() {
        console.log('Old upgrade System');
    };

    /* Afficher tous les documents au début */
    $scope.initialiseShowDocs = function() {
        for (var i = 0; i < $scope.listDocument.length; i++) {
            $scope.listDocument[i].showed = true;
        }
    };

    /* Filtre sur le nom de document à afficher */
    $scope.specificFilter = function() {
        // parcours des Documents
        for (var i = 0; i < $scope.listDocument.length; i++) {

            if ($scope.listDocument[i].nomAffichage.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1) {
                // Query Found
                $scope.listDocument[i].showed = true;
            } else {
                $scope.listDocument[i].showed = false;
            }

        }
    };
});