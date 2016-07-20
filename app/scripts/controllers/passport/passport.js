/* File: passeport.js
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
/**
 * controller responsacle de tout les operation ayant rapport avec la
 * bookmarklet
 */

/* global $:false */
/* jshint undef: true, unused: true */

angular.module('cnedApp').controller('passportCtrl', function($scope, $rootScope, md5, $http, $location, configuration, serviceCheck, dropbox, storageService, $localForage, synchronisationService, $modal) {

    $('#titreCompte').hide();
    $('#titreProfile').hide();
    $('#titreDocument').hide();
    $('#titreAdmin').hide();
    $('#titreListDocument').hide();
    $('#detailProfil').hide();
    $('#titreDocumentApercu').hide();

    $scope.stepsTitle = 'CRÉATION DE VOTRE COMPTE SUR ACCESSIDYS';
    $scope.stepsSubTitle = 'Saisissez vos informations et créez votre compte Accessidys';
    $scope.testEnv = false;
    $scope.passwordForgotten = false;
    $scope.loginSign = true;
    $scope.guest = $rootScope.loged;
    $scope.passwordRestoreMessage = '';
    $scope.obj = {
        nomSign : '',
        prenomSign : '',
        emailSign : '',
        passwordSign : '',
        passwordConfirmationSign : ''
    };
    $scope.erreur = {
        erreurSigninNom : false,
        erreurSigninNomMessage : '',
        erreurSigninPrenom : false,
        erreurSigninPrenomMessage : '',
        erreurSigninEmail : false,
        erreurSigninEmailMessage : '',
        erreurSigninPasse : false,
        erreurSigninPasseMessage : '',
        erreurSigninConfirmationPasse : false,
        erreurSigninConfirmationPasseMessage : '',
        erreurSigninEmailNonDisponibleMessage : false
    };
    $scope.emailLogin = null;
    $scope.passwordLogin = null;
    $scope.showlogin = true; // true
    $scope.erreurLogin = false; // false
    $scope.erreurSignin = false; // false
    $scope.inscriptionStep1 = true; // true
    $scope.inscriptionStep2 = false; // false
    $scope.showStep2part1 = true; // true
    $scope.erreurSigninConfirmationPasse = false;
    $scope.erreurSigninEmailNonDisponible = false;
    $scope.step1 = 'btn btn-primary btn-circle';
    $scope.step2 = 'btn btn-default btn-circle';
    $scope.step3 = 'btn btn-default btn-circle';
    $scope.step4 = 'btn btn-default btn-circle';
    $scope.steps = 'step_one';
    $scope.logout = $rootScope.loged;
    $scope.missingDropbox = $rootScope.dropboxWarning;
    $scope.showpart2 = false;
    $scope.basculeButton = true;
    $scope.showBascule = true;
    $scope.locationURL = window.location.href;
    $rootScope.$watch('dropboxWarning', function() {
        $scope.guest = $rootScope.loged;
        $scope.apply; // jshint ignore:line
    });

    $rootScope.$on('initPassport', function() {
        console.log('event recieved of passport');
        $scope.init();
    });

    $scope.init = function() {
        if ($location.absUrl().indexOf('https://dl.dropboxusercontent.com/') > -1) {
            $scope.showBascule = false;
        }

        if ($location.absUrl().indexOf('?Acces=true') > -1) {
            if (localStorage.getItem('redirectionEmail') && localStorage.getItem('redirectionPassword')) {
                $scope.emailLogin = localStorage.getItem('redirectionEmail');
                $scope.passwordLogin = localStorage.getItem('redirectionPassword');
                $scope.apply; // jshint ignore:line
                storageService.removeService([ 'redirectionEmail', 'redirectionPassword' ], 0).then(function() {
                    $scope.login();
                });
            } else {
                $scope.goNext();
            }
        }
        if ($rootScope.loged) {
            var tmp = serviceCheck.getData();
            tmp.then(function(result) { // this is only run after $http
                // completes
                if (result.loged) {
                    if (result.dropboxWarning === false) {
                        // jshint ignore:line
                        $rootScope.dropboxWarning = false;
                        $scope.missingDropbox = false;
                        $rootScope.loged = true;
                        $rootScope.admin = result.admin;
                        $rootScope.apply; // jshint ignore:line
                        if ($location.path() !== '/inscriptionContinue') {
                            $location.path('/inscriptionContinue');
                        }
                    } else {
                        console.log('loged full');
                        $rootScope.loged = true;
                        $rootScope.admin = result.admin;
                        $rootScope.apply; // jshint ignore:line

                        if ($scope.testEnv === false) {
                            $location.path('/listDocument').search({
                                key : localStorage.getItem('compteId')
                            });
                        }
                    }
                }
            });
        }
    };

    $scope.signin = function() {
        $scope.erreurSigninEmailNonDisponible = false;
        if ($scope.verifyEmail($scope.obj.emailSign) && $scope.verifyPassword($scope.obj.passwordSign) && $scope.verifyString($scope.obj.nomSign) && $scope.verifyString($scope.obj.prenomSign) && $scope.obj.passwordConfirmationSign === $scope.obj.passwordSign) {
			$scope.obj.emailSign = $scope.obj.emailSign.toLowerCase();
            var data = {
                email : $scope.obj.emailSign,
                password : $scope.obj.passwordSign,
                nom : $scope.obj.nomSign,
                prenom : $scope.obj.prenomSign
            };
            
            $http.post(configuration.URL_REQUEST + '/signup', data).success(function(data) {
				console.log('tezst');
                $scope.basculeButton = false;
                $scope.steps = 'step_two';
                $scope.stepsTitle = 'COMPTE DROPBOX';
                $scope.stepsSubTitle = 'Association avec compte DropBox';
                $scope.singinFlag = data;
                var tmp = [ {
                    name : 'compteId',
                    value : data.local.token
                } ];
                $localForage.removeItem('compteOffline').then(function() {
                    $localForage.setItem('compteOffline', data);
                });
                storageService.writeService(tmp, 0).then(function() {
                    $scope.inscriptionStep1 = false;
                    $scope.inscriptionStep2 = true;
                    $scope.step2 = 'btn btn-primary btn-circle';
                    $scope.step1 = 'btn btn-default btn-circle';
                    $('#myModal').modal('show');
                });
                // localStorage.setItem('compteId', data.local.token);
            }).error(function() {
                $scope.erreur.erreurSigninEmail = false;
                $scope.erreur.erreurSigninEmailNonDisponible = true;
            });
        } else {

            if (!$scope.verifyString($scope.obj.nomSign)) {
                if ($scope.obj.nomSign === '') {
                    $scope.erreur.erreurSigninNomMessage = 'Nom : Cette donnée est obligatoire. Merci de compléter le champ.';
                } else {
                    $scope.erreur.erreurSigninNomMessage = 'Nom : Le nom contient des caractères spéciaux non autorisé.';
                }
                $scope.erreur.erreurSigninNom = true;
            } else {
                $scope.erreur.erreurSigninNom = false;
            }

            if (!$scope.verifyString($scope.obj.prenomSign)) {
                if ($scope.obj.prenomSign === '') {
                    $scope.erreur.erreurSigninPrenomMessage = 'Prénom : Cette donnée est obligatoire. Merci de compléter le champ.';
                } else {
                    $scope.erreur.erreurSigninPrenomMessage = 'Prénom : Le prénom contient des caractères spéciaux non autorisé.';

                }
                $scope.erreur.erreurSigninPrenom = true;
            } else {
                $scope.erreur.erreurSigninPrenom = false;
            }

            if (!$scope.verifyEmail($scope.obj.emailSign)) {
                if ($scope.obj.emailSign === '') {
                    $scope.erreur.erreurSigninEmailMessage = 'Email : Cette donnée est obligatoire. Merci de compléter le champ.';
                } else {
                    $scope.erreur.erreurSigninEmailMessage = 'Email : Veuillez entrer une adresse mail valable.';
                }
                $scope.erreur.erreurSigninEmail = true;
            } else {
                $scope.erreur.erreurSigninEmail = false;
            }

            if (!$scope.verifyPassword($scope.obj.passwordSign)) {
                if ($scope.obj.passwordSign.length > 20) {
                    $scope.erreur.erreurSigninPasseMessage = 'Le mot de passe doit comporter entre 6 et 20 caractères.';
                    $scope.erreur.erreurSigninPasse = true;
                } else if ($scope.obj.passwordSign.length < 6) {
                    $scope.erreur.erreurSigninPasseMessage = 'Le mot de passe doit comporter entre 6 et 20 caractères.';
                    $scope.erreur.erreurSigninPasse = true;
                } else {
                    $scope.erreur.erreurSigninPasseMessage = 'Veuillez ne pas utiliser de caractères spéciaux.';
                    $scope.erreur.erreurSigninPasse = true;
                }
            } else {
                $scope.erreur.erreurSigninPasse = false;
            }

            if ($scope.obj.passwordSign !== $scope.obj.passwordConfirmationSign) {
                if ($scope.obj.passwordConfirmationSign === '') {
                    $scope.erreur.erreurSigninConfirmationPasseMessage = 'Veuillez confirmer votre mot de passe ici.';
                } else {
                    $scope.erreur.erreurSigninConfirmationPasseMessage = 'Ces mots de passe ne correspondent pas.';
                }
                $scope.erreur.erreurSigninConfirmationPasse = true;
            } else {
                $scope.erreur.erreurSigninConfirmationPasse = false;
            }
        }
    };

    $scope.login = function() {
        if ($scope.testEnv === false) {
            if (document.getElementById('email').value && document.getElementById('mdp').value) {
                $scope.emailLogin = document.getElementById('email').value;
                $scope.passwordLogin = document.getElementById('mdp').value;
            }
        }
        if ($scope.verifyEmail($scope.emailLogin) && $scope.verifyPassword($scope.passwordLogin)) {
            $scope.emailLogin = $scope.emailLogin.toLowerCase();
            // $rootScope.salt
            var data = {
                email : $scope.emailLogin,
                password : md5.createHash($scope.passwordLogin)
            };
            $http.get(configuration.URL_REQUEST + '/login', {
                params : data
            }).success(function(dataRecue) {
                // Si l'utilisateur s'authentifie lever le blocage en mode
                // déconnecté.
                $rootScope.isAppOnline = true;
                var tmp = [ {
                    name : 'compteId',
                    value : dataRecue.local.token
                } ];
                if (localStorage.getItem('deconnexion')) {
                    localStorage.removeItem('deconnexion');
                }
                $localForage.removeItem('compteOffline').then(function() {
                    $localForage.setItem('compteOffline', dataRecue);
                });
                storageService.writeService(tmp, 0).then(function(data) {
                    console.log(data);
                    $scope.loginFlag = dataRecue;
                    $rootScope.loged = true;
                    $rootScope.currentUser = dataRecue;
                    $rootScope.updateListProfile = true;
                    $rootScope.apply; // jshint ignore:line

                });
                synchronisationService.sync(dataRecue.local.token, dataRecue.dropbox.accessToken, dataRecue.local.email).then(function(synchronizedItems) {
                    if (synchronizedItems.docsSynchronized && synchronizedItems.docsSynchronized.length > 0 || synchronizedItems.profilsSynchronized && synchronizedItems.profilsSynchronized.length > 0) {
                        $modal.open({
                            templateUrl : 'views/synchronisation/resultatSynchronisationModal.html',
                            controller : 'SynchronisationModalCtrl',
                            size : 'sm',
                            resolve : {
                                docsSynchronized : function() {
                                    return synchronizedItems.docsSynchronized;
                                },
                                profilsSynchronized : function() {
                                    return synchronizedItems.profilsSynchronized;
                                }
                            }
                        });
                    }
                    if (dataRecue.dropbox) {
                        $scope.roleRedirect();
                    } else {
                        console.log('i am here');
                        if ($location.path() !== '/inscriptionContinue') {
                            $location.path('/inscriptionContinue');
                        }
                    }

                });
            }).error(function() {
                $scope.erreurLogin = true;
            });
        } else {
            $scope.erreurLogin = true;
        }
    };

    $scope.setListTagsByProfil = function() {
        var token = {
            id : localStorage.getItem('compteId')
        };
        $http.post(configuration.URL_REQUEST + '/chercherProfilsParDefaut', token).success(function(data) {
            $scope.profilDefautFlag = data;
            $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
                idProfil : $scope.profilDefautFlag[0].profilID
            }).success(function(data) {
                $scope.listTagsByProfil = data;
                localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
            });

        });
    };

    $scope.roleRedirect = function() {
        $rootScope.uploadDoc = {};

        if ($location.search().url && $location.search().url !== '') {
            var bookmarkletUrl = $location.search().url;
            if ($scope.testEnv === false) {
                $location.path('/apercu').search({
                    url : bookmarkletUrl
                });
            }
        } else if ($location.search().idProfil && $location.search().idProfil !== '') {
            $location.path('/profiles').search({
                idProfil : $location.search().idProfil
            });
        } else if ($location.search().idDocument && $location.search().idDocument !== '') {
            $location.path('/apercu').search({
                idDocument : $location.search().idDocument
            });
        } else {
            if ($scope.testEnv === false) {
                if ($scope.loginFlag.local.role === 'admin') {
                    $location.path('/adminPanel').search({
                        key : localStorage.getItem('compteId')
                    });
                } else {
                    $location.path('/listDocument').search({
                        key : localStorage.getItem('compteId')
                    });
                }
            }
        }
    };
    $scope.goNext = function() {
        $scope.showlogin = !$scope.showlogin;
        $scope.obj = {
            nomSign : '',
            prenomSign : '',
            emailSign : '',
            passwordSign : '',
            passwordConfirmationSign : ''
        };
        $scope.erreur = {
            erreurSigninNom : false,
            erreurSigninNomMessage : '',
            erreurSigninPrenom : false,
            erreurSigninPrenomMessage : '',
            erreurSigninEmail : false,
            erreurSigninEmailMessage : '',
            erreurSigninPasse : false,
            erreurSigninPasseMessage : '',
            erreurSigninConfirmationPasse : false,
            erreurSigninConfirmationPasseMessage : '',
            erreurSigninEmailNonDisponibleMessage : false
        };
        $scope.emailLogin = null;
        $scope.passwordLogin = null;
        $scope.erreurLogin = false;
    };

    $scope.verifyEmail = function(email) {
        var reg = /^([a-zA-Z0-9éèàâîôç_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (reg.test(email)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.verifyString = function(chaine) {
        var ck_nomPrenom = /^[A-Za-z0-9éèàâîôç_\.\-\+' ]{1,100}$/;
        if (chaine === null) {
            return false;
        }
        if (!ck_nomPrenom.test(chaine)) {
            return false;
        }
        return true;
    };

    $scope.verifyPassword = function(password) {
        var ck_password = /^[A-Za-z0-9éèàâîôç!@#$%^&*()_]{6,20}$/;

        if (!ck_password.test(password)) {
            return false;
        }
        return true;
    };

    $scope.showPasswordRestorePanel = function() {
        $scope.loginSign = !$scope.loginSign;
        $scope.passwordForgotten = !$scope.passwordForgotten;
    };

    $scope.restorePassword = function() {
        if ($scope.verifyEmail($scope.emailRestore)) {

            var data = {};
            data.email = $scope.emailRestore;

            /* jshint ignore:start */

            $http.post(configuration.URL_REQUEST + '/restorePassword', data).success(function(dataRecue) {
                $scope.successRestore = true;
                $scope.failRestore = false;

                $scope.emailRestoreShow = $scope.emailRestore;
            }).error(function(error) {
                $scope.failRestore = true;
                $scope.successRestore = false;
                $scope.passwordRestoreMessage = 'Email : le courriel saisi n\'est pas identifié dans la plate-forme Accessidys.';
                console.log(error);
            });
            /* jshint ignore:end */

        } else {

            $scope.failRestore = true;
            $scope.successRestore = false;

            if (!$scope.emailRestore) {
                $scope.passwordRestoreMessage = 'Email : Ce champ est obligatoire.';
            } else {
                $scope.passwordRestoreMessage = 'Email : Les données saisies sont invalides.';
            }

        }
    };

});
