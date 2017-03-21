/* File: adminPanel.js
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

angular.module('cnedApp').controller('AdminPanelCtrl', function ($scope, $http, $location, configuration, $rootScope, serviceCheck, LoaderService, UtilsService) {
    /* global $:false */

    $scope.headers = ['Nom', 'Prenom', 'Email', 'Autorisation', 'Action'];
    $scope.isOcrDropdownOpen = false;
    $scope.isVoiceDropdownOpen = false;

    $scope.updateOcrAutorisation = function (compte) {
        $scope.isOcrDropdownOpen = false;
        $scope.isVoiceDropdownOpen = false;
        if (compte.local.authorisations) {
            compte.local.authorisations.ocr = !compte.local.authorisations.ocr;
        } else {
            compte.local.authorisations.ocr = true;
        }
        $scope.updateAutorisation(compte);
    };

    $scope.updateAudioAutorisation = function (compte) {
        $scope.isOcrDropdownOpen = false;
        $scope.isVoiceDropdownOpen = false;
        if (compte.local.authorisations) {
            compte.local.authorisations.audio = !compte.local.authorisations.audio;
        } else {
            compte.local.authorisations.audio = true;
        }
        $scope.updateAutorisation(compte);
    };

    $scope.updateAutorisation = function (compte) {

        $http.post(configuration.URL_REQUEST + '/setAuthorisations', {

            id: $rootScope.currentUser.local.token,
            authorisations: {
                ocr: compte.local.authorisations.ocr,
                audio: compte.local.authorisations.audio
            },
            compte: compte._id
        }).success(function (data) {

            console.log('********************* ///// ******************');
            console.log(data);
        });
    };

    $scope.updateAll = function (att, status) {

        $http.post(configuration.URL_REQUEST + '/updateall', {
            att: att,
            status: status,
            id: $rootScope.currentUser.local.token
        }).success(function () {
            $scope.listAccounts();
        });
    };
    $scope.loader = false;
    $scope.versionStatShow = false;

    $rootScope.area = 'ADMIN ';
    $scope.upgradeMode = false;
    $scope.listAccounts = function () {
        $http.get(configuration.URL_REQUEST + '/allAccounts', {
            params: {
                id: $rootScope.currentUser.local.token
            }
        }).success(function (data) {
            $scope.comptes = data;
            for (var i = 0; i < $scope.comptes.length; i++) {
                $scope.comptes[i].showed = true;
            }
        });
    };
    $scope.initial = function () {
        if ($rootScope.emergencyUpgrade === false) {
            $rootScope.indexLoader = false;
            if (!$rootScope.$$phase) {
                $rootScope.$digest();
            }
        }
        if (!$rootScope.$$phase) {
            $rootScope.$digest();
        }
        var tmp = serviceCheck.getData();
        tmp.then(function (result) { // this is only run after $http completes
            if (result.loged) {
                if (result.dropboxWarning === false) {

                    $rootScope.dropboxWarning = false;
                    $scope.missingDropbox = false;
                    $rootScope.loged = true;
                    $rootScope.admin = result.admin;
                    if (!$rootScope.$$phase) {
                        $rootScope.$digest();
                    }
                    if ($location.path() !== '/inscriptionContinue') {
                        $location.path('/inscriptionContinue');
                    }

                } else {
                    $rootScope.loged = true;
                    $rootScope.admin = result.admin;
                    $rootScope.currentUser = result.user;
                    if (!$rootScope.$$phase) {
                        $rootScope.$digest();
                    }
                    if (result.admin) {
                        $http.get(configuration.URL_REQUEST + '/adminService', {
                            params: {
                                id: $rootScope.currentUser.local.token
                            }
                        }).success(function (data) {
                            $scope.admin = data;
                            $rootScope.admin = true;

                            console.log($scope.admin);
                            $scope.roles = ['Ocerisation'];
                            $scope.autorisations = [];

                            if (!$rootScope.$$phase) {
                                $rootScope.$digest();
                            }
                        }).error(function () {
                            console.log('/adminService error');
                            // $location.path('/');
                        });
                        $scope.listAccounts();
                    }

                }
            }
        });

    };

    $scope.deleteAccount = function (account) {
        UtilsService.openConfirmModal('Supprimer l\'utilisateur',
            'Voulez-vous supprimer l\'utilisateur " <b>' + account.local.nom + ' ' + account.local.prenom + '</b> "', true)
            .then(function () {

                LoaderService.showLoader('account.message.info.delete.inprogress', false);
                $http.post(configuration.URL_REQUEST + '/deleteAccounts', {
                    id: $rootScope.currentUser.local.token,
                    compte: account
                }).success(function (data) {
                    $scope.deleted = data;
                    LoaderService.hideLoader();
                    $scope.listAccounts();


                });
            });

    };

    $scope.specificFilter = function () {
        for (var i = 0; i < $scope.comptes.length; i++) {
            if (($scope.accentFolding($scope.comptes[i].local.nom).toUpperCase()).indexOf($scope.accentFolding($scope.query.toUpperCase())) !== -1 || ($scope.accentFolding($scope.comptes[i].local.prenom)).toUpperCase().indexOf($scope.accentFolding($scope.query.toUpperCase())) !== -1 || $scope.comptes[i].local.email.indexOf($scope.query) !== -1) {
                $scope.comptes[i].showed = true;
            } else {
                $scope.comptes[i].showed = false;
            }
        }
    };

    $scope.accentFolding = function (text) {
        var map = [
            // ['\\s', ''],
            ['[àáâãäå]', 'a'], ['æ', 'ae'], ['ç', 'c'], ['[èéêë]', 'e'], ['[ìíîï]', 'i'], ['ñ', 'n'], ['[òóôõö]', 'o'], ['œ', 'oe'], ['[ùúûü]', 'u'], ['[ýÿ]', 'y']
            // ['\\W', '']
        ];
        for (var i = 0; i < map.length; ++i) {
            text = text.replace(new RegExp(map[i][0], 'gi'), function (match) {
                if (match.toUpperCase() === match) {
                    return map[i][1].toUpperCase();
                } else {
                    return map[i][1];
                }
            });
        }
        return text;
    };

});