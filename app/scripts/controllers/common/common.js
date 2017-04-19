/* File: common.js
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

angular.module('cnedApp').controller('CommonCtrl', function ($scope, $rootScope, $location, $timeout, serviceCheck, gettextCatalog, $http,
                                                             configuration, dropbox, storageService, profilsService, $localForage, $interval,
                                                             $uibModal, $routeParams, tagsService, $log, UtilsService) {


    $rootScope.isFullsize = true;
    $rootScope.indexLoader = false;
    $scope.logout = $rootScope.loged;
    $scope.admin = $rootScope.admin;
    $scope.missingDropbox = $rootScope.dropboxWarning;
    $rootScope.apercu = false;

    $rootScope.updateListProfile = false;
    $rootScope.defaultProfilList = false;
    $rootScope.updateProfilListe = false;
    $rootScope.modifProfilListe = false;
    $scope.testEnv = false;
    $scope.profilActuel = '';
    $scope.listeProfilsParUser = [];
    $scope.form = {
        currentProfile: ''
    };

    $scope.logoRedirection = configuration.DEFAULT_PATH;

    $rootScope.$on('refreshProfilAcutel', function (event, data) {
        $scope.listeProfilsParUser = data;
    });

    $scope.bookmarkletPopin = function () {
        $uibModal.open({
            templateUrl: 'views/common/bookmarklet.modal.html',
            controller: 'BookMarkletModalCtrl',
            size: 'md'
        }).result.then(function () {
            //
        });

    };

    $scope.currentUserFunction = function () {
        var token;
        if (localStorage.getItem('compteId')) {
            token = {
                id: localStorage.getItem('compteId')
            };
        }
        $http.post(configuration.URL_REQUEST + '/profilActuByToken', token).success(function (data) {

            localStorage.setItem('profilActuel', JSON.stringify(data));
            $scope.profilActuel = data.nom;
            $scope.form.currentProfile = angular.copy($scope.profilActuel);
            $scope.setDropDownActuel = data;
        });
    };

    $rootScope.$watch('loged', function () {
        if ($rootScope.loged !== undefined) {


            if ($routeParams.deconnexion) {
                $rootScope.loged = false;
            }
            // if a session verification interval exists, 
            // cancel for reassignment.
            if ($rootScope.sessionPool) {
                $interval.cancel($rootScope.sessionPool);
            }
            // Resetting the session check in every change of state of the user session..
            if ($rootScope.loged && $rootScope.isAppOnline) {
                $rootScope.sessionPool = $interval(serviceCheck.getData, $rootScope.sessionTime);
            }
            $scope.logout = $rootScope.loged;

            if ($rootScope.loged === true) {
                //if loged, user is no more a guest
                $rootScope.isGuest = false;
                $scope.isGuest = false;

            } else if ($rootScope.loged === false) {
                $scope.listDocumentDropBox = '#/listDocument';
            }
        }
    });

    $rootScope.$watch('admin', function () {
        $scope.admin = $rootScope.admin;
    });

    $rootScope.$watch('dropboxWarning', function () {
        $scope.guest = $rootScope.loged;
    });

    $rootScope.$watch('currentUser', function () {
        $scope.currentUserData = $rootScope.currentUser;
        if ($scope.currentUserData && $scope.currentUserData._id) {
            $scope.token = {
                id: $scope.currentUserData.local.token
            };
            $scope.currentUserFunction();
        }
    });

    $rootScope.$watch('actu', function () {
        if ($rootScope.actu && $scope.dataActuelFlag) {
            if ($rootScope.actu.owner === $scope.dataActuelFlag.userID && $scope.dataActuelFlag.actuel === true) {
                $scope.currentUserFunction();
            }
        }
    });

    $rootScope.$watch('updateListProfile', function () {
        if ($scope.currentUserData) {

            $scope.afficherProfilsParUser();
        }
    });

    /*
     * check if a defaultProfilList as been asked
     */
    $rootScope.$watch('defaultProfilList', function () {
        if ($rootScope.defaultProfilList) {
            //get from admin configuration the default profilList
            $http.post(configuration.URL_REQUEST + '/findAdmin').then(function (result) {
                $scope.currentUserData = {
                    _id: result.data._id,
                    local: {
                        role: 'user'
                    }
                };
                $scope.token = {};
                localStorage.setItem('compteId', result.data.local.token);
                $scope.afficherProfilsParUser();
            }, function (error) {
                $log.error('Error during getting Default profil :' + error);
            });
        }
    });

    $scope.initCommon = function () {
        if ($rootScope.isGuest) {
            localStorage.removeItem('compteId');
        }

        $log.debug('initCommon --->');

        $rootScope.defaultProfilList = false;

        serviceCheck.getData()
            .then(function (result) { // this is only run after $http completes
                $log.log('result ' + result);

                if (result.loged) {
                    $scope.logoRedirection = configuration.HOMEPAGE_PATH;

                    if (result.dropboxWarning === false) {
                        $rootScope.dropboxWarning = false;
                        $scope.missingDropbox = false;
                        $rootScope.loged = true;
                        $rootScope.admin = result.admin;
                        if ($location.path() !== '/inscriptionContinue') {
                            $location.path('/inscriptionContinue');
                        }
                    } else {
                        $rootScope.loged = true;
                        $rootScope.dropboxWarning = true;
                        $rootScope.admin = result.admin;
                        $rootScope.currentUser = result.user;

                        if (localStorage.getItem('compteId')) {
                            $scope.requestToSend = {
                                id: localStorage.getItem('compteId')
                            };

                            tagsService.getTags($scope.requestToSend).then(function (data) {
                                $scope.listTags = data;
                                localStorage.removeItem('listTags');
                                localStorage.setItem('listTags', JSON.stringify($scope.listTags));
                            });
                        }
                        $scope.token = {
                            id: $rootScope.currentUser.local.token
                        };
                        $scope.listDocumentDropBox = $rootScope.listDocumentDropBox;
                    }
                    $rootScope.updateListProfile = true;
                } else {

                    //User is not logged on

                    var lien = window.location.href;
                    if ($rootScope.loged) {

                        //'User is defined as logged on rootScope

                        if ($location.path() === '/detailProfil' && lien.indexOf('#/detailProfil') > -1 && $rootScope.loged !== true) {
                            //'Looking for detailProfil
                            $scope.listDocumentDropBox = '#/';
                            $scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
                            $scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
                        }
                    } else {
                        //User is Guest
                        $scope.isGuest = true;
                        $rootScope.isGuest = true;

                    }
                }
            });
    };

    $scope.logoutFonction = function () {

        if (!$rootScope.isAppOnline) {
            UtilsService.showInformationModal('label.offline', 'label.offline.info.exit');
        } else {
            var toLogout = serviceCheck.deconnect();
            toLogout.then(function (responce) {
                localStorage.setItem('deconnexion', 'true');
                if (responce.deconnected) {
                    //Disconnection done
                    $rootScope.loged = false;
                    $rootScope.isGuest = true;
                    $rootScope.dropboxWarning = false;
                    $rootScope.admin = null;
                    $rootScope.currentUser = {};
                    $scope.listDocumentDropBox = '';
                    $rootScope.listDocumentDropBox = '';
                    $rootScope.uploadDoc = {};
                    $scope.logoRedirection = configuration.DEFAULT_PATH;
                    if ($scope.testEnv === false) {
                        $timeout(function () {
                            window.location.href = configuration.URL_REQUEST;
                        }, 1000);
                    }
                }
            });
        }

    };

    // displays user profiles
    $scope.afficherProfilsParUser = function () {

        $log.debug('afficherProfilsParUser --->');

        $scope.requestToSend = {};
        if (localStorage.getItem('compteId')) {
            $scope.requestToSend = {
                id: localStorage.getItem('compteId')
            };
        }
        tagsService.getTags($scope.requestToSend).then(function (data) {
            $scope.listTags = data;
            localStorage.setItem('listTags', JSON.stringify(data));
        });

        profilsService.getProfilsByUser($rootScope.isAppOnline)
            .then(function (data) {
                /* Filter Admin profiles */
                if ($scope.currentUserData && $scope.currentUserData.local.role === 'admin') {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].type === 'profile' && data[i].state === 'mine') {
                            for (var j = 0; j < data.length; j++) {
                                if (data[i]._id === data[j]._id && data[j].state === 'default' && data[j].owner === $scope.currentUserData._id) {
                                    data[i].stateDefault = true;
                                    data.splice(j, 2);
                                }
                            }
                        }
                    }
                }
                $scope.listeProfilsParUser = data;
                var profilActuelStorage = localStorage.getItem('profilActuel');
                if (profilActuelStorage) {
                    $scope.profilActuel = JSON.parse(profilActuelStorage).nom;
                    $scope.form.currentProfile = angular.copy($scope.profilActuel);
                    // Loading profile
                    $scope.changeProfilActuel();

                }
            });
    };

    $scope.onChangeCurrentProfile = function () {
        $scope.profilActuel = angular.copy($scope.form.currentProfile);

        $scope.changeProfilActuel();
    };

    $scope.changeProfilActuel = function () {

        $log.debug('changeProfilActuel --->');
        $log.debug('actuelProfile', $scope.profilActuel);

        // Set the Json of the selected current profile
        var profilActuelSelected = {};
        var profilFound = false;
        for (var i = 0; i < $scope.listeProfilsParUser.length; i++) {
            if ($scope.listeProfilsParUser[i].type === 'profile' && $scope.listeProfilsParUser[i].nom === $scope.profilActuel) {
                profilActuelSelected = $scope.listeProfilsParUser[i];
                profilFound = true;
            }
        }

        if (!profilFound && $scope.listeProfilsParUser.length > 0) {
            profilActuelSelected = $scope.listeProfilsParUser[0];
        }

        $scope.profilUser = {
            profilID: profilActuelSelected._id,
            userID: $scope.currentUserData._id
        };

        $scope.profilUserFavourite = {
            profilID: profilActuelSelected._id,
            userID: $scope.currentUserData._id,
            favoris: true
        };
        if ($scope.token && $scope.token.id) {
            $scope.token.profilesFavs = $scope.profilUserFavourite;
        } else {
            $scope.token.id = localStorage.getItem('compteId');
            $scope.token.profilesFavs = $scope.profilUserFavourite;
        }

        $scope.token.newActualProfile = $scope.profilUser;

        $scope.requestToSend = {};
        if (localStorage.getItem('compteId')) {
            $scope.requestToSend = {
                id: localStorage.getItem('compteId')
            };
        }

        tagsService.getTags($scope.requestToSend).then(function (data) {
            $scope.listTags = data;
            localStorage.setItem('listTags', JSON.stringify($scope.listTags));

            localStorage.setItem('profilActuel', JSON.stringify(profilActuelSelected));
            $http.post(configuration.URL_REQUEST + '/ajouterUserProfil', $scope.token)
                .success(function (data) {
                    $scope.userProfilFlag = data;
                });

            profilsService.getProfilTags(profilActuelSelected._id).then(function (data) {
                $scope.listTagsByProfil = data;
                localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));

                $timeout(function () {
                    $rootScope.$emit('profilChanged');
                }, 10);
            });
        });
    };

    $scope.updgradeService = function () {
        UtilsService.openUpgradeModal();
    };


    /**
     * Access the screen "My Account".
     * If the user is not connected to internet,
     * a popup is displayed indicating that the feature is not available.
     *
     * @method $scope.goToUserAccount
     */
    $scope.goToUserAccount = function () {
        if (!$rootScope.isAppOnline) {
            UtilsService.showInformationModal('label.offline', 'useraccount.message.info.offline');

        } else {
            $location.path('/userAccount');
        }
    };

    $rootScope.openVocalHelpModal = function () {
        $uibModal.open({
            templateUrl: 'views/infoPages/vocalHelp.html',
            controller: 'VocalHelpModalCtrl',
            size: 'lg'
        });
    };

});