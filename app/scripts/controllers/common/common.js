/* File: common.js
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

/*global $:false */


angular.module('cnedApp').controller('CommonCtrl', function ($scope, $rootScope, $location, $timeout, serviceCheck, gettextCatalog, $http, configuration, dropbox, storageService, profilsService) {


    $scope.logout = $rootScope.loged;
    $scope.admin = $rootScope.admin;
    $scope.missingDropbox = $rootScope.dropboxWarning;
    $scope.showMenuParam = false;
    $rootScope.apercu = false;

    $rootScope.updateListProfile = false;
    $rootScope.updateProfilListe = false;
    $rootScope.modifProfilListe = false;
    $scope.testEnv = false;

    $scope.languages = [{
        name: 'FRANCAIS',
        shade: 'fr_FR'
    }, {
        name: 'ANGLAIS',
        shade: 'en_US'
    }];
    $scope.langue = $scope.languages[0];
    $scope.docUrl = configuration.URL_REQUEST + '/styles/images/docs.png';
    $scope.logoUrl = configuration.URL_REQUEST + '/styles/images/header_logoCned.png';
    $scope.logoRedirection = configuration.URL_REQUEST;
    $scope.connectLink = configuration.URL_REQUEST+'/adaptation.html';
    $scope.bookmarklet_howto = configuration.URL_REQUEST + '/styles/images/bookmarklet_howto.png';
    $scope.bookmarklet_dropbox = configuration.URL_REQUEST + '/styles/images/dropbox.png';


    $scope.setlangueCombo = function () {
        $timeout(function () {
            if (!localStorage.getItem('langueDefault')) {
                localStorage.setItem('langueDefault', JSON.stringify($scope.languages[0]));
            }
            $('.select-language + .customSelect .customSelectInner').text(JSON.parse(localStorage.getItem('langueDefault')).name);
        }, 500);
    };
    //detect current location
    $scope.isActive = function (route) {
        return route === $location.path();
    };

    $scope.showMenu = function () {
        $scope.showMenuParam = !$scope.showMenuParam;
    };

    $scope.checkLocation = function () {
        if (!$rootScope.documentChanged) {
            //alert('dkhoul l common ')
            localStorage.setItem('lockOperationDropBox', false);
        }
    };

    $scope.changeStatus = function ($event) {
        $('.actions_menu .drob_down li a').removeClass('active');
        angular.element($event.currentTarget).addClass('active');

        //turn off dropBox lock
        //alert($rootScope.documentChanged)

        if (!$rootScope.documentChanged) {
            //alert('dkhoul l common ')
            localStorage.setItem('lockOperationDropBox', false);
        }
    };


    $scope.hideMenu = function () {
        $scope.showMenuParam = false;
        // $scope.$apply();
        if (!$scope.$$phase) {
            $scope.$digest();
        } // jshint ignore:line
    };

    $rootScope.$on('setHideMenu', $scope.hideMenu());

    // Changer la langue
    $scope.changerLangue = function () {
        gettextCatalog.currentLanguage = $scope.langue.shade;
        $('.select-language + .customSelect .customSelectInner').text($scope.langue.name);
        $scope.showMenuParam = false;
        localStorage.setItem('langueDefault', JSON.stringify($scope.langue));
        $scope.setlangueCombo();
    };

    $scope.bookmarkletPopin = function () {
        var tmp = serviceCheck.getData();
        tmp.then(function (result) { // this is only run after $http completes
            if (result.loged) {
                $scope.userDropBoxLink = '\''+configuration.URL_REQUEST+'/#/apercu?url=\'+document.URL';
                $('#bookmarkletGenerator').modal('show');
            } else {
                if (!$scope.testEnv) {
                    window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
                }

            }
        });


    };

    /**
      * Injecte dans le DOM le CSS du profil courant
      * @method  loadProfilCSS
      */
    $scope.loadProfilCSS = function () {

        var element = document.getElementById('cssProfil');
        if (element) {
            element.remove();
        }

        profilsService.getUrl().then(function(url){
            var fileref = document.createElement('link');
            fileref.setAttribute("rel", 'stylesheet');
            fileref.setAttribute("type", 'text/css');
            fileref.setAttribute("id", 'cssProfil');
            fileref.setAttribute('href', url);
            document.getElementsByTagName('head')[0].appendChild(fileref);
        });
    };


    $scope.currentUserFunction = function () {
        var token;
        if (localStorage.getItem('compteId')) {
            token = {
                id: localStorage.getItem('compteId')
            };
        }
        $http.post(configuration.URL_REQUEST + '/profilActuByToken', token)
            .success(function (data) {

                localStorage.setItem('profilActuel', JSON.stringify(data));
                $scope.setDropDownActuel = data;
                angular.element($('#headerSelect option').each(function () {
                    var itemText = $(this).text();
                    if (itemText === $scope.setDropDownActuel.nom) {
                        $(this).prop('selected', true);
                        $('#headerSelect + .customSelect .customSelectInner').text($scope.setDropDownActuel.nom);
                    }
                }));

            });
    };

    $rootScope.$watch('loged', function () {
        $scope.logout = $rootScope.loged;
        $scope.menueShow = $rootScope.loged;
        $scope.menueShowOffline = $rootScope.loged;
        if ($scope.testEnv === false) {
            $scope.browzerState = navigator.onLine;
        } else {
            $scope.browzerState = true;
        }
        if ($scope.browzerState) {
            if ($scope.menueShow !== true) {
                var lien = window.location.href;
                if (lien.indexOf('#/apercu') > -1) {
                    $scope.menueShow = true;
                    $scope.menueShowOffline = true;
                }
            }
            $scope.apply; // jshint ignore:line
        } else {
            $scope.menueShow = false;
            $scope.showMenuParam = false;
            $scope.menueShowOffline = true;
            $scope.listDocumentDropBox = '#/listDocument';
            $scope.logoRedirection = configuration.URL_REQUEST + '/adaptation.html';
            if (localStorage.getItem('profilActuel')) {
                $(this).prop('selected', true);
                $('#headerSelect + .customSelect .customSelectInner').text(JSON.parse(localStorage.getItem('profilActuel')).nom);
                $('#HideIfOffLine').hide();
            }
        }
    });

    $rootScope.$watch('admin', function () {
        $scope.admin = $rootScope.admin;
        $scope.apply; // jshint ignore:line
    });

    $rootScope.$watch('dropboxWarning', function () {
        $scope.guest = $rootScope.loged;
        $scope.apply; // jshint ignore:line
    });

    $rootScope.$watch('currentUser', function () {
        if ($scope.testEnv === false) {
            $scope.currentUserData = $rootScope.currentUser;
            $scope.apply; // jshint ignore:line
        }
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
                angular.element($('#headerSelect option').each(function () {
                    $('#headerSelect + .customSelect .customSelectInner').text($scope.actu.nom);
                    $(this).prop('selected', true);
                }));
            }
        }
    });

    $scope.$watch('setDropDownActuel', function () {
        if ($scope.setDropDownActuel) {
            $scope.apply; // jshint ignore:line
        }
    });

    $rootScope.$watch('updateListProfile', function () {
        if ($scope.currentUserData) {

            $scope.afficherProfilsParUser();
        }
    });


    $scope.initCommon = function () {
        console.log('initCommon');
        if (window.location.href.indexOf('create=true') > -1) {
            $scope.logoRedirection = configuration.URL_REQUEST+'/?create=true';
        }
        $scope.setlangueCombo();
        $('#masterContainer').show();

        if ($scope.testEnv === false) {
            $scope.browzerState = navigator.onLine;
        } else {
            $scope.browzerState = true;
        }

        var tmp = serviceCheck.getData();
        tmp.then(function (result) { // this is only run after $http completes
            if (result.loged) {
                if (result.dropboxWarning === false) {
                    $rootScope.dropboxWarning = false;
                    $scope.missingDropbox = false;
                    $rootScope.loged = true;
                    $rootScope.admin = result.admin;
                    $rootScope.apply; // jshint ignore:line
                    if ($location.path() !== '/inscriptionContinue') {
                        $location.path('/inscriptionContinue');
                    }
                } else {
                    $rootScope.loged = true;
                    $scope.menueShow = true;
                    $scope.menueShowOffline = true;
                    $rootScope.dropboxWarning = true;
                    $rootScope.admin = result.admin;
                    $rootScope.currentUser = result.user;

                    if (localStorage.getItem('compteId')) {
                        $scope.requestToSend = {
                            id: localStorage.getItem('compteId')
                        };
                        $http.get(configuration.URL_REQUEST + '/readTags', {
                            params: $scope.requestToSend
                        })
                            .success(function (data) {
                                $scope.listTags = data;
                                localStorage.removeItem('listTags');
                                localStorage.setItem('listTags', JSON.stringify($scope.listTags));
                            });
                    }
                    $scope.token = {
                        id: $rootScope.currentUser.local.token
                    };
                    if (!$rootScope.$$phase) {
                        $rootScope.$digest();
                    }
                    $scope.listDocumentDropBox = $rootScope.listDocumentDropBox;
                }
                $rootScope.updateListProfile = true;
            } else {
                var lien = window.location.href;
                var verif = false;
                if ($scope.browzerState) {
                    if ($location.path() !== '/' && $location.path() !== '/passwordHelp' && $location.path() !== '/detailProfil' && $location.path() !== '/needUpdate' && $location.path() !== '/mentions' && $location.path() !== '/signup' && verif !== true) {
                        $location.path('/');
                    }
                    if ($location.path() === '/detailProfil' && lien.indexOf('#/detailProfil') > -1 && $rootScope.loged !== true) {
                        $scope.menueShow = true;
                        $scope.listDocumentDropBox = '#/';
                        $scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
                        $scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
                    }
                }
            }
        });
    };

    $scope.logoutFonction = function () {
        angular.element($('#headerSelect option').each(function () {
            $('#headerSelect + .customSelect .customSelectInner').text('');
        }));

        localStorage.removeItem('profilActuel');
        // localStorage.removeItem('listTagsByProfil');
        var toLogout = serviceCheck.deconnect();
        toLogout.then(function (responce) {
            if (responce.deconnected) {
                storageService.removeService(['compteId'], 0).then(function () {
                    $rootScope.loged = false;
                    $rootScope.dropboxWarning = false;
                    $rootScope.admin = null;
                    $rootScope.currentUser = {};
                    $scope.listDocumentDropBox = '';
                    $rootScope.listDocumentDropBox = '';
                    $rootScope.uploadDoc = {};
                    $scope.logoRedirection = configuration.URL_REQUEST;
                    //$rootScope.$apply(); // jshint ignore:line
                    if (!$rootScope.$$phase) {
                        $rootScope.$digest();
                    }
                    if ($scope.testEnv == false) {
                        setTimeout(function () {
                            window.location.href = configuration.URL_REQUEST; //$location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2);
                        }, 1000);
                    } else {
                        console.log('deconnection testEnv');
                    }
                });
            }
        });
    };

    //displays user profiles
    $scope.afficherProfilsParUser = function () {

        $http.get(configuration.URL_REQUEST + '/listeProfils', {
            params: $scope.token
        }).success(function (data) {
            /* Filtrer les profiles de l'Admin */
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
            if(profilActuelStorage) {
                $scope.profilActuel = JSON.parse(localStorage.getItem('profilActuel')).nom;
                // Chargement du profil
                $scope.changeProfilActuel();
            }
        });

        $scope.requestToSend = {};
        if (localStorage.getItem('compteId')) {
            $scope.requestToSend = {
                id: localStorage.getItem('compteId')
            };
        }
        $http.get(configuration.URL_REQUEST + '/readTags', {
            params: $scope.requestToSend
        })
            .success(function (data) {
                $scope.listTags = data;
                localStorage.setItem('listTags', JSON.stringify($scope.listTags));
            });
    };


    $scope.changeProfilActuel = function () {

        // Set du Json du profil actuel sélectionné
        var profilActuelSelected = {};
        for (var i = 0; i < $scope.listeProfilsParUser.length; i++) {
            if ($scope.listeProfilsParUser[i].type === 'profile' && $scope.listeProfilsParUser[i].nom === $scope.profilActuel) {
                profilActuelSelected = $scope.listeProfilsParUser[i];
            }
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

        $http.get(configuration.URL_REQUEST + '/readTags', {
            params: $scope.requestToSend
        })
            .success(function (data) {
                $scope.listTags = data;
                localStorage.setItem('listTags', JSON.stringify($scope.listTags));
            });

        $http.post(configuration.URL_REQUEST + '/ajouterUserProfil', $scope.token)
            .success(function (data) {

                $scope.userProfilFlag = data;
                localStorage.setItem('profilActuel', JSON.stringify(profilActuelSelected));
                $scope.userProfilFlag = data;
                $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
                    idProfil: profilActuelSelected._id
                }).success(function (data) {

                    $scope.loadProfilCSS();

                    $scope.listTagsByProfil = data;
                    localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
                    if ($location.absUrl().substring($location.absUrl().length - 8, $location.absUrl().length) === '#/apercu') {
                        if ($scope.testEnv == false) {
                            location.reload(true);
                        }
                    }
                });
            });

    };


    $scope.updgradeService = function () {
        var data = {
            id: $rootScope.currentUser.local.token
        };
        $http.post(configuration.URL_REQUEST + '/allVersion', data)
            .success(function (dataRecu) {
                console.log(dataRecu);
                if (dataRecu.length === 0) {
                    $scope.upgradeurl = '/createVersion';
                    $scope.oldVersion = {
                        valeur: 0,
                        date: '0/0/0',
                        newvaleur: 1,
                        id: $rootScope.currentUser.local.token
                    };
                } else {
                    $scope.upgradeurl = '/updateVersion';
                    $scope.oldVersion = {
                        valeur: dataRecu[0].appVersion,
                        date: dataRecu[0].dateVersion,
                        newvaleur: dataRecu[0].appVersion + 1,
                        sysVersionId: dataRecu[0]._id,
                        id: $rootScope.currentUser.local.token
                    };
                }
            });
    };
    $scope.upgradeMode = false;
    $scope.updateVersion = function () {
        $scope.oldVersion.mode = $scope.upgradeMode;
        /* jshint ignore:start */

        $http.post(configuration.URL_REQUEST + $scope.upgradeurl, $scope.oldVersion)
            .success(function () {
                $('#openUpgradeModal').modal('hide');
                $scope.versionStat = 'Version mise à jour avec succès';
                $scope.versionStatShow = true;
            })
            .error(function () {
                console.log('error');
            });
        /* jshint ignore:end */

    };

});
