/* File: profiles.js
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
/* global $:false */
/* jshint loopfunc:true */

var FB = FB;
var gapi = gapi;

angular.module('cnedApp')
    .controller('ProfilesCtrl', function ($scope, $http, $rootScope, removeStringsUppercaseSpaces,
                                          configuration, $location, serviceCheck, verifyEmail, $window,
                                          profilsService, $uibModal, $timeout, $interval, tagsService, $log, _, Analytics, gettextCatalog, UtilsService) {

        /* Initializations */
        $scope.successMod = 'Profil Modifie avec succes !';
        $scope.successAdd = 'Profil Ajoute avec succes !';
        $scope.successDefault = 'defaultProfileSelection';
        $scope.displayText = '<p>AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap mais aussi toute personne ayant des difficultés pour lire des documents longs ou complexes. Depuis les élèves et étudiants avec une dyslexie jusqu’aux cadres supérieurs trop pressés jusqu’aux personnes âgées, AccessiDys facilite la compréhension des documents administratifs ou juridiques, des manuels scolaires traditionnels, des magazines ou journaux à la mise en page complexe, avec des petits caractères ou sans synthèse vocale. AccessiDys est une plateforme Web avec deux fonctions principales. Les pages Web ou documents à lire sont affichées en utilisant un profil de lecture sur mesure qui comprend un large choix de paramètres d’affichage adaptés aux besoins individuels de chaque lecteur. AccessiDys vise les lecteurs qui ont trop peu de temps ou d’attention, qui ont une dyslexie, une dyspraxie, un autisme ou des déficiences visuelles. AccessiDys sait également lire les pages Web à haute voix. AccessiDys rend vos documents ou pages accessibles aux lecteurs en les important de manière simple et rapide quel que soit le format du fichier d’origine. Qu’il s’agisse d’un fichier PDF numérisé, d’un document Office, d’un livre électronique au format ePub ou d’une page Web traditionnelle, AccessiDys vous permet de transformer votre document pour que les lecteurs bénéficient d’une expérience de lecture totalement personnalisée.</p>';
        $scope.displayTextSimple = 'AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap mais aussi toute personne ayant des difficultés pour lire des documents longs ou complexes. Depuis les élèves et étudiants avec une dyslexie jusqu’aux cadres supérieurs trop pressés jusqu’aux personnes âgées, AccessiDys facilite la compréhension des documents administratifs ou juridiques, des manuels scolaires traditionnels, des magazines ou journaux à la mise en page complexe, avec des petits caractères ou sans synthèse vocale. AccessiDys est une plateforme Web avec deux fonctions principales. Les pages Web ou documents à lire sont affichées en utilisant un profil de lecture sur mesure qui comprend un large choix de paramètres d’affichage adaptés aux besoins individuels de chaque lecteur. AccessiDys vise les lecteurs qui ont trop peu de temps ou d’attention, qui ont une dyslexie, une dyspraxie, un autisme ou des déficiences visuelles. AccessiDys sait également lire les pages Web à haute voix. AccessiDys rend vos documents ou pages accessibles aux lecteurs en les important de manière simple et rapide quel que soit le format du fichier d’origine. Qu’il s’agisse d’un fichier PDF numérisé, d’un document Office, d’un livre électronique au format ePub ou d’une page Web traditionnelle, AccessiDys vous permet de transformer votre document pour que les lecteurs bénéficient d’une expérience de lecture totalement personnalisée.';
        $scope.flag = false;
        $scope.colorLists = ['Pas de coloration', 'Colorer les mots', 'Colorer les syllabes', 'Colorer les lignes RBV', 'Colorer les lignes RVJ', 'Colorer les lignes RBVJ', 'Surligner les mots', 'Surligner les lignes RBV', 'Surligner les lignes RVJ', 'Surligner les lignes RBVJ'];
        $scope.weightLists = ['Gras', 'Normal'];
        $scope.listTag = {};
        $scope.editTag = null;
        $scope.colorList = null;
        $scope.admin = $rootScope.admin;
        $scope.displayDestination = false;
        $scope.testEnv = false;
        $scope.loader = false;
        $scope.loaderMsg = '';
        $scope.applyRules = false;
        $scope.forceApplyRules = true;
        $scope.demoBaseText = 'AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap mais aussi toute personne ayant des difficultés pour lire des documents longs ou complexes. Depuis les élèves et étudiants avec une dyslexie jusqu’aux cadres supérieurs trop pressés jusqu’aux personnes âgées, AccessiDys facilite la compréhension des documents administratifs ou juridiques, des manuels scolaires traditionnels, des magazines ou journaux à la mise en page complexe, avec des petits caractères ou sans synthèse vocale. AccessiDys est une plateforme Web avec deux fonctions principales. Les pages Web ou documents à lire sont affichées en utilisant un profil de lecture sur mesure qui comprend un large choix de paramètres d’affichage adaptés aux besoins individuels de chaque lecteur. AccessiDys vise les lecteurs qui ont trop peu de temps ou d’attention, qui ont une dyslexie, une dyspraxie, un autisme ou des déficiences visuelles. AccessiDys sait également lire les pages Web à haute voix. AccessiDys rend vos documents ou pages accessibles aux lecteurs en les important de manière simple et rapide quel que soit le format du fichier d’origine. Qu’il s’agisse d’un fichier PDF numérisé, d’un document Office, d’un livre électronique au format ePub ou d’une page Web traditionnelle, AccessiDys vous permet de transformer votre document pour que les lecteurs bénéficient d’une expérience de lecture totalement personnalisée.';
        $scope.policeLists = ['Arial', 'opendyslexicregular', 'Times New Roman', 'LDFComicSans',
            'HKGrotesk-Regular', 'SignikaNegative-Regular', 'Century Gothic', 'OpenSans-CondensedLight', 'CodeNewRoman',
            'FiraSansCondensed', 'AnonymousPro-Bold', 'AndikaNewBasic', 'TiresiasInfofontItalic'
        ];
        $scope.tailleLists = [{
            number: '8',
            label: 'eight'
        }, {
            number: '9',
            label: 'nine'
        }, {
            number: '10',
            label: 'ten'
        }, {
            number: '11',
            label: 'eleven'
        }, {
            number: '12',
            label: 'twelve'
        }, {
            number: '14',
            label: 'fourteen'
        }, {
            number: '16',
            label: 'sixteen'
        }, {
            number: '18',
            label: 'eighteen'
        }, {
            number: '22',
            label: 'twenty two'
        }, {
            number: '24',
            label: 'twenty four'
        }, {
            number: '26',
            label: 'twenty six'
        }, {
            number: '28',
            label: 'twenty eight'
        }, {
            number: '36',
            label: 'thirty six'
        }, {
            number: '48',
            label: 'fourty eight'
        }, {
            number: '72',
            label: 'seventy two'
        }];

        $scope.spaceLists = [{
            number: '1',
            label: 'one'
        }, {
            number: '2',
            label: 'two'
        }, {
            number: '3',
            label: 'three'
        }, {
            number: '4',
            label: 'four'
        }, {
            number: '5',
            label: 'five'
        }, {
            number: '6',
            label: 'six'
        }, {
            number: '7',
            label: 'seven'
        }, {
            number: '8',
            label: 'eight'
        }, {
            number: '9',
            label: 'nine'
        }, {
            number: '10',
            label: 'ten'
        }];
        $scope.spaceCharLists = [{
            number: '1',
            label: 'one'
        }, {
            number: '2',
            label: 'two'
        }, {
            number: '3',
            label: 'three'
        }, {
            number: '4',
            label: 'four'
        }, {
            number: '5',
            label: 'five'
        }, {
            number: '6',
            label: 'six'
        }, {
            number: '7',
            label: 'seven'
        }, {
            number: '8',
            label: 'eight'
        }, {
            number: '9',
            label: 'nine'
        }, {
            number: '10',
            label: 'ten'
        }];
        $scope.interligneLists = [{
            number: '1',
            label: 'one'
        }, {
            number: '2',
            label: 'two'
        }, {
            number: '3',
            label: 'three'
        }, {
            number: '4',
            label: 'four'
        }, {
            number: '5',
            label: 'five'
        }, {
            number: '6',
            label: 'six'
        }, {
            number: '7',
            label: 'seven'
        }, {
            number: '8',
            label: 'eight'
        }, {
            number: '9',
            label: 'nine'
        }, {
            number: '10',
            label: 'ten'
        }];
        $scope.defaultStyle = {};
        $scope.profiles = [];
        $scope.defaultSystemProfile = {};
        $scope.configuration = configuration;
        $scope.sortType = 'updated';
        $scope.sortReverse = true;

        $rootScope.$watch('admin', function () {
            $scope.admin = $rootScope.admin;
            $scope.apply; // jshint ignore:line
        });

        $scope.initProfil = function () {
            if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
                $log.debug('Init detail profile');

                $scope.initDetailProfil();
            } else {

                $log.debug('Init profiles list');
                $scope.getProfiles(); // Initialize profile list
            }

            $scope.token = {
                id: localStorage.getItem('compteId')
            };
        };

        /**
         * Open a modal with selected detail profile
         *
         * @param template
         * @param profile
         *
         * @method $openProfileModal
         */
        $scope.openProfileModal = function (template, profile) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/profiles/profilAffichageModal.html',
                controller: 'profilesAffichageModalCtrl',
                windowClass: 'profil-lg',
                backdrop: true,
                scope: $scope,
                resolve: {
                    template: function () {
                        return template;
                    },
                    profile: function () {
                        return profile;
                    }
                }
            });

            modalInstance.result.then(function (params) {
                // Modal closed

                if (params.operation === 'edit-tag') {

                    $scope.openTagEditModal(params.profile, params.index).then(function (tagEditParams) {
                        // Modal closed
                        $scope.openProfileModal(params.template, tagEditParams.profile);
                    }, function () {
                        // Modal dismissed
                        $scope.openProfileModal(params.template, params.profile);
                    });

                } else if (params.operation === 'rename') {
                    $scope.openRenameProfilModal(params.profile).then(function (renameParams) {
                        // Modal closed
                        $scope.openProfileModal(params.template, renameParams.profile);
                    }, function () {
                        // Modal dismissed
                        $scope.openProfileModal(params.template, params.profile);
                    });
                }

            }, function (params) {
                // Modal dismissed
                if (params.operation && params.operation === 'save') {
                    $scope.initProfil();
                    if (params.template === 'update') {
                        $scope.showToaster('#profile-success-toaster', 'profile.message.edit.ok');
                    } else {
                        $scope.showToaster('#profile-success-toaster', 'profile.message.save.ok');
                    }
                }
            });
        };

        /**
         * Open edit tag modal for a specific profileTag
         *
         * @param profile
         * @param profileTagIndex
         *
         * @method $openTagEditModal
         */
        $scope.openTagEditModal = function (profile, profileTagIndex) {
            return $uibModal.open({
                templateUrl: 'views/profiles/editProfilStyleModal.html',
                controller: 'styleEditModalCtrl',
                windowClass: 'profil-lg',
                backdrop: true,
                scope: $scope,
                resolve: {
                    profile: function () {
                        return profile;
                    },
                    profileTagIndex: function () {
                        return profileTagIndex;
                    }
                }
            }).result;
        };

        /**
         * Open rename modal of a profile
         *
         * @param profile
         *
         * @method $openRenameProfilModal
         */
        $scope.openRenameProfilModal = function (profile) {
            return $uibModal.open({
                templateUrl: 'views/profiles/renameProfilModal.html',
                controller: 'profilesRenommageModalCtrl',
                scope: $scope,
                backdrop: true,
                resolve: {
                    profile: function () {
                        return profile;
                    }
                }
            }).result;
        };

        $scope.displayOwner = function (param) {
            if (param.state === 'mine' || ($rootScope.currentUser.local.role === 'admin' && $rootScope.currentUser._id === param.owner)) {
                return 'Moi-même';
            } else if (param.state === 'favoris') {
                return 'Favoris';
            } else if (param.state === 'delegated') {
                return 'Délégué';
            } else if (param.state === 'default') {
                return 'Accessidys';
            }
        };

        $scope.showLoader = function () {
            console.log('loader show');
            $scope.loader = true;
            $scope.loaderMsg = 'Affichage de la liste des profils en cours ...';
        };

        $scope.hideLoader = function () {
            console.log('loader hide');
            $scope.loader = false;
            $scope.loaderMsg = '';
        };


        $scope.showLoaderFromLoop = function (indexLoop) {
            //check if first element of the loop
            if (indexLoop <= 0) {
                $scope.showLoader();
            }
        };
        $scope.showProfilLoaderFromLoop = function (indexLoop) {
            //check if first element of the loop
            if (indexLoop <= 0) {
                $scope.loader = true;
                $scope.loaderMsg = 'Affichage du profil en cours ...';
            }
        };

        $scope.hideLoaderFromLoop = function (indexLoop, max) {
            //Get nb listProfilTags length to check if last element of the loop
            if (indexLoop >= (max - 1)) {
                $scope.hideLoader();
            }
        };

        $scope.isDeletable = function (param) {
            if (param.favourite && param.delete) {
                return true;
            }
            if (param.favourite && !param.delete) {
                return false;
            }
        };

        // Delete the profile
        $scope.supprimerProfil = function () {
            $scope.loader = true;
            $scope.loaderMsg = 'Suppression du profil en cours ...';
            profilsService.deleteProfil($rootScope.isAppOnline, $rootScope.currentUser._id, $scope.sup._id).then(function (data) {
                $scope.profilFlag = data;
                $('#deleteModal').modal('hide');
                $scope.loader = false;
                $scope.loaderMsg = '';

                $scope.removeUserProfileFlag = data;
                if ($scope.sup.nom === $('#headerSelect + .customSelect .customSelectInner').text()) {
                    $scope.token.defaultProfile = $scope.removeVar;
                    $http.post(configuration.URL_REQUEST + '/setProfilParDefautActuel', $scope.token)
                        .success(function () {
                            localStorage.removeItem('profilActuel');
                            localStorage.remoremoveItemveItem('listTags');
                            localStorage.removeItem('listTagsByProfil');
                            $window.location.reload();
                        });
                } else {
                    $rootScope.updateListProfile = !$rootScope.updateListProfile;
                    $scope.initProfil();
                }
            });
        };

        // Pre-deleting profile
        $scope.preSupprimerProfil = function (profil) {
            $scope.sup = profil;
            $scope.profilName = profil.nom;

            // angular-google-analytics tracking pages
            Analytics.trackPage('/profile/delete.html');
        };

        $scope.forceRulesApply = function () {
            $scope.forceApplyRules = false;
            $timeout(function () {
                $scope.forceApplyRules = true;
            });
        };

        /**
         * This function generates the name of the profile
         */
        $scope.generateProfileName = function (actualPrenom, numeroPrenom, i) {
            if ($scope.profiles[i].type === 'profile' && $scope.profiles[i].nom.indexOf(actualPrenom) > -1 && $scope.profiles[i].nom.length === actualPrenom.length) {
                numeroPrenom++;
                actualPrenom = $rootScope.currentUser.local.prenom + ' ' + numeroPrenom;
                if ((i + 1) < $scope.profiles.length) {
                    return $scope.generateProfileName(actualPrenom, numeroPrenom, 0);
                } else {
                    return actualPrenom;
                }
            } else if ((i + 1) < $scope.profiles.length) {
                return $scope.generateProfileName(actualPrenom, numeroPrenom, (i + 1));
            } else {
                return actualPrenom;
            }
        };

        $scope.editStyleChange = function (operation, value) {
            $rootScope.$emit('reglesStyleChange', {
                'operation': operation,
                'element': 'shown-text-edit',
                'value': value
            });
        };

        $scope.mettreParDefaut = function (param) {
            $scope.defaultVar = {
                userID: param.owner,
                profilID: param._id,
                defaultVar: true
            };
            param.defautMark = true;
            param.defaut = true;
            $scope.token.addedDefaultProfile = $scope.defaultVar;
            $http.post(configuration.URL_REQUEST + '/setDefaultProfile', $scope.token)
                .success(function (data) {
                    $scope.defaultVarFlag = data;
                    $scope.showToaster('#profile-success-toaster', 'profile.message.default.ok');
                    $('.action_btn').attr('data-shown', 'false');
                    $('.action_list').attr('style', 'display:none');
                    if ($scope.testEnv === false) {
                        $scope.getProfiles();
                    }
                });
        };

        $scope.retirerParDefaut = function (param) {
            $scope.defaultVar = {
                userID: param.owner,
                profilID: param._id,
                defaultVar: false
            };

            if ($scope.token && $scope.token.id) {
                $scope.token.cancelFavs = $scope.defaultVar;
            } else {
                $scope.token.id = localStorage.getItem('compteId');
                $scope.token.cancelFavs = $scope.defaultVar;
            }

            $http.post(configuration.URL_REQUEST + '/cancelDefaultProfile', $scope.token)
                .success(function (data) {
                    $scope.showToaster('#profile-success-toaster', 'profile.message.default.ok');
                    $('.action_btn').attr('data-shown', 'false');
                    $('.action_list').attr('style', 'display:none');
                    if ($scope.testEnv === false) {
                        $scope.getProfiles();
                    }
                });
        };

        $scope.isDefault = function (param) {
            if (param && param.stateDefault || param.state === 'default') {
                return true;
            }
            return false;
        };

        $scope.isOwner = function (param) {
            if (param && param.owner === $rootScope.currentUser._id) {
                return true;
            }
            return false;
        };

        $scope.isDelegated = function (param) {
            if (param && param.state === 'delegated') {
                return true;
            }
            return false;
        };

        $scope.isPreDelegated = function (param) {

            if (param && param.preDelegated && $rootScope.currentUser._id === param.preDelegated) {
                return true;
            }
            return false;
        };

        $scope.isFavourite = function (param) {
            if (param && (param.state === 'favoris' || param.state === 'default')) {
                return true;
            }
            return false;
        };

        $scope.isProfil = function (param) {
            if (param && param.type === 'profile') {
                return true;
            }
            return false;
        };

        $scope.isOwnerDelagate = function (param) {
            if (param && param.state == 'delegated' && param.owner === $rootScope.currentUser._id) {
                return true;
            }
            return false;
        };

        $scope.isAnnuleDelagate = function (param) {
            if (param && param.preDelegated && param.owner === $rootScope.currentUser._id) {
                return true;
            }
            return false;
        };

        $scope.isDelegatedOption = function (param) {
            if (param && !param.delegated && !param.preDelegated && param.owner === $rootScope.currentUser._id) {
                return true;
            }
            return false;
        };

        $scope.isDeletableIHM = function (param) {
            if (param.owner === $rootScope.currentUser._id) {
                return true;
            }
            return false;
        };

        $scope.preRemoveFavourite = function (param) {
            $scope.profilId = param._id;
        };

        $scope.removeFavourite = function () {
            $scope.sendVar = {
                profilID: $scope.profilId,
                userID: $rootScope.currentUser._id,
                favoris: true
            };

            if ($scope.token && $scope.token.id) {
                $scope.token.favProfile = $scope.sendVar;
            } else {
                $scope.token.id = localStorage.getItem('compteId');
                $scope.token.favProfile = $scope.sendVar;
            }
            $http.post(configuration.URL_REQUEST + '/removeUserProfileFavoris', $scope.token)
                .success(function (data) {
                    localStorage.removeItem('profilActuel');
                    localStorage.removeItem('listTagsByProfil');
                    $rootScope.$broadcast('initProfil');
                    if ($scope.testEnv === false) {
                        $scope.getProfiles();
                    }

                });

        };

        /* sending email when duplicating. */
        $scope.sendEmailDuplique = function () {
            $http.post(configuration.URL_REQUEST + '/findUserById', {
                idUser: $scope.oldProfil.owner
            }).success(function (data) {
                $scope.findUserByIdFlag = data;
                if (data && data.local) {
                    var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                    $scope.sendVar = {
                        emailTo: data.local.email,
                        content: '<span> ' + fullName + ' vient d\'utiliser Accessidys pour dupliquer votre profil : ' + $scope.oldProfil.nom + '. </span>',
                        subject: fullName + ' a dupliqué votre profil'
                    };
                    $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
                        .success(function () {
                        });
                }
            }).error(function () {
                console.log('erreur lors de lenvoie du mail dupliquer');
            });
        };


        $scope.preDeleguerProfil = function (profil) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {
                $('#delegateModal').modal('show');
                $scope.profDelegue = profil;
                $scope.errorMsg = '';
                $scope.successMsg = '';
                $scope.delegateEmail = '';

                // angular-google-analytics tracking pages
                Analytics.trackPage('/profile/delegate.html');
            }
        };

        $scope.deleguerProfil = function () {
            $scope.errorMsg = '';
            $scope.successMsg = '';
            if (!$scope.delegateEmail || $scope.delegateEmail.length <= 0) {
                $scope.errorMsg = 'L\'email est obligatoire !';
                return;
            }
            if (!verifyEmail($scope.delegateEmail)) {
                $scope.errorMsg = 'L\'email est invalide !';
                return;
            }
            $http.post(configuration.URL_REQUEST + '/findUserByEmail', {
                email: $scope.delegateEmail
            })
                .success(function (data) {
                    if (data) {
                        $scope.findUserByEmailFlag = data;
                        var emailTo = data.local.email;

                        if (emailTo === $rootScope.currentUser.local.email) {
                            $scope.errorMsg = 'Vous ne pouvez pas déléguer votre profil à vous même !';
                            return;
                        }

                        $('#delegateModal').modal('hide');

                        var sendParam = {
                            idProfil: $scope.profDelegue._id,
                            idDelegue: data._id
                        };
                        $scope.loader = true;
                        $scope.loaderMsg = 'Délégation du profil en cours...';
                        $http.post(configuration.URL_REQUEST + '/delegateProfil', sendParam)
                            .success(function () {
                                var profilLink = $location.absUrl();
                                profilLink = profilLink.replace('#/profiles', '#/detailProfil?idProfil=' + $scope.profDelegue._id);
                                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                                $scope.sendVar = {
                                    emailTo: emailTo,
                                    content: '<span> ' + fullName + ' vient d\'utiliser Accessidys pour vous déléguer son profil : <a href=' + profilLink + '>' + $scope.profDelegue.nom + '</a>. </span>',
                                    subject: 'Profil délégué'
                                };
                                $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar, {
                                    timeout: 60000
                                }).success(function () {
                                    $scope.showToaster('#profile-success-toaster', 'mail.send.ok');
                                    $scope.errorMsg = '';
                                    $scope.delegateEmail = '';
                                    $scope.loader = false;
                                    $scope.initProfil();
                                }).error(function () {
                                    $scope.showToaster('#profile-error-toaster', 'mail.send.ko');
                                    $scope.loader = false;
                                    $scope.initProfil();
                                });
                            });
                    } else {
                        $scope.errorMsg = 'L\'Email n\'est pas identifié dans Accessidys!';
                    }
                });
        };

        $scope.preRetirerDeleguerProfil = function (profil) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {
                $('#retirerDelegateModal').modal('show');
                $scope.profRetirDelegue = profil;
            }
        };

        $scope.retireDeleguerProfil = function () {
            var sendParam = {
                id: $rootScope.currentUser.local.token,
                sendedVars: {
                    idProfil: $scope.profRetirDelegue._id,
                    idUser: $rootScope.currentUser._id
                }
            };
            $scope.loader = true;
            $scope.loaderMsg = 'Retrait de la délégation du profil en cours...';
            $http.post(configuration.URL_REQUEST + '/retirerDelegateUserProfil', sendParam)
                .success(function (data) {
                    if (data) {
                        $http.post(configuration.URL_REQUEST + '/findUserById', {
                            idUser: data.delegatedID
                        })
                            .success(function (data) {
                                if (data) {
                                    var emailTo = data.local.email;
                                    var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                                    $scope.sendVar = {
                                        emailTo: emailTo,
                                        content: '<span> ' + fullName + ' vient de vous retirer la délégation de son profil : ' + $scope.profRetirDelegue.nom + '. </span>',
                                        subject: 'Retirer la délégation'
                                    };
                                    $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar, {
                                        timeout: 60000
                                    }).success(function () {
                                        $scope.showToaster('#profile-success-toaster', 'mail.send.ok');
                                        $scope.errorMsg = '';
                                        $scope.loader = false;
                                        $scope.initProfil();
                                    }).error(function () {
                                        $scope.showToaster('#profile-error-toaster', 'mail.send.ko');
                                        $scope.loader = false;
                                        $scope.initProfil();
                                    });
                                }
                            });
                    }
                });
        };

        $scope.preAnnulerDeleguerProfil = function (profil) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {
                $('#annulerDelegateModal').modal('show');
                $scope.profAnnuleDelegue = profil;
            }
        };

        $scope.annuleDeleguerProfil = function () {
            var sendParam = {
                id: $rootScope.currentUser.local.token,
                sendedVars: {
                    idProfil: $scope.profAnnuleDelegue._id,
                    idUser: $rootScope.currentUser._id
                }
            };
            $scope.loader = true;
            $scope.loaderMsg = 'Annulation de la délégation du profil en cours...';
            $http.post(configuration.URL_REQUEST + '/annulerDelegateUserProfil', sendParam)
                .success(function (data) {
                    // $rootScope.updateListProfile = !$rootScope.updateListProfile;
                    if (data) {
                        $scope.annulerDelegateUserProfilFlag = data;
                        $http.post(configuration.URL_REQUEST + '/findUserById', {
                            idUser: $scope.profAnnuleDelegue.preDelegated
                        })
                            .success(function (data) {
                                if (data) {
                                    var emailTo = data.local.email;
                                    var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                                    $scope.sendVar = {
                                        emailTo: emailTo,
                                        content: '<span> ' + fullName + ' vient d\'annuler la demande de délégation de son profil : ' + $scope.profAnnuleDelegue.nom + '. </span>',
                                        subject: 'Annuler la délégation'
                                    };
                                    $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar, {
                                        timeout: 60000
                                    }).success(function () {
                                        $scope.showToaster('#profile-success-toaster', 'mail.send.ok');
                                        $scope.errorMsg = '';
                                        $scope.loader = false;
                                        $scope.initProfil();
                                    }).error(function () {
                                        $scope.showToaster('#profile-error-toaster', 'mail.send.ko');
                                        $scope.loader = false;
                                        $scope.initProfil();
                                    });
                                }
                            });
                    }
                });
        };


        $scope.profilApartager = function (param) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.share.offline');
            } else {
                $('#shareModal').modal('show');
                $scope.profilPartage = param;
                $scope.currentUrl = $location.absUrl();
                $scope.socialShare();

                // angular-google-analytics tracking pages
                Analytics.trackPage('/profile/share.html');
            }
        };

        /* load email form */
        $scope.loadMail = function () {
            $scope.displayDestination = true;
        };

        $scope.clearSocialShare = function () {
            $scope.displayDestination = false;
            $scope.destinataire = '';
        };

        $scope.attachFacebook = function () {
            $('.facebook-share .fb-share-button').remove();
            $('.facebook-share span').before('<div class="fb-share-button" data-href="' + decodeURIComponent($scope.envoiUrl) + '" data-layout="button"></div>');
            try {
                FB.XFBML.parse();
            } catch (ex) {
                console.log('gotchaa ... ');
                console.log(ex);
            }
        };

        $scope.attachGoogle = function () {
            console.log('IN ==> ');
            var options = {
                contenturl: decodeURIComponent($scope.envoiUrl),
                contentdeeplinkid: '/pages',
                clientid: '807929328516-g7k70elo10dpf4jt37uh705g70vhjsej.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                prefilltext: '',
                calltoactionlabel: 'LEARN_MORE',
                calltoactionurl: decodeURIComponent($scope.envoiUrl),
                callback: function (result) {
                    console.log(result);
                    console.log('this is the callback');
                },
                onshare: function (response) {
                    console.log(response);
                    if (response.status === 'started') {
                        $scope.googleShareStatus++;
                        if ($scope.googleShareStatus > 1) {
                            $('#googleShareboxIframeDiv').remove();
                            // alert('some error in sharing');
                            $('#shareModal').modal('hide');
                            $('#informationModal').modal('show');
                            localStorage.setItem('googleShareLink', $scope.envoiUrl);
                        }
                    } else {
                        localStorage.removeItem('googleShareLink');
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
            $scope.encodeURI = encodeURIComponent($location.absUrl());
            $scope.currentUrl = $location.absUrl();
            if ($scope.currentUrl.lastIndexOf('detailProfil') > -1) {
                $scope.envoiUrl = encodeURIComponent($scope.currentUrl);
                $scope.attachFacebook();
                $scope.attachGoogle();
            } else {
                $scope.envoiUrl = encodeURIComponent($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
                $scope.attachFacebook();
                $scope.attachGoogle();
            }
            if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
                $('#confirmModal').modal('show');
                $('#shareModal').modal('hide');
            } else if ($scope.destination && $scope.destination.length > 0) {
                $scope.shareMailInvalid = true;
            }
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

        /* Sending of the email to the addressee. */
        $scope.sendMail = function () {
            $('#confirmModal').modal('hide');
            $scope.loaderMsg = 'Partage du profil en cours. Veuillez patienter ..';
            $scope.currentUrl = $location.absUrl();
            if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
                $scope.envoiUrl = decodeURI($scope.currentUrl);
            } else {
                $scope.envoiUrl = decodeURI($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
            }
            $scope.destination = $scope.destinataire;
            $scope.loader = true;
            if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
                if ($location.absUrl()) {
                    if ($rootScope.currentUser.dropbox.accessToken) {
                        if ($rootScope.currentUser) {

                            $log.debug('$scope.envoiUrl', $scope.envoiUrl);
                            $scope.sendVar = {
                                to: $scope.destinataire,
                                content: ' vient de partager avec vous un profil sur l\'application Accessidys.  ' + $scope.envoiUrl,
                                encoded: '<span> vient de partager avec vous un profil sur l\'application Accessidys.   <a href=' + $scope.envoiUrl + '>Lien de ce profil</a> </span>',
                                prenom: $rootScope.currentUser.local.prenom,
                                fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
                                doc: $scope.envoiUrl
                            };
                            $http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
                                .success(function (data) {
                                    $scope.showToaster('#profile-success-toaster', 'mail.send.ok');
                                    $scope.sent = data;
                                    $scope.envoiMailOk = true;
                                    $scope.destinataire = '';
                                    $scope.loader = false;
                                    $scope.displayDestination = false;
                                    $scope.loaderMsg = '';
                                }).error(function () {
                                $scope.loader = false;
                                $scope.loaderMsg = '';
                            });
                        }
                    }
                }
            } else {
                $('.sendingMail').removeAttr('data-dismiss', 'modal');
                $('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');
            }
        };

        $scope.specificFilter = function () {
            // loop of Profiles
            for (var i = 0; i < $scope.profiles.length; i++) {
                if ($scope.profiles[i].type === 'profile') {
                    if ($scope.profiles[i].nom.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1 || $scope.profiles[i].descriptif.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1) {
                        // Query Found
                        $scope.profiles[i].showed = true;
                    } else {
                        // Query not Found
                        $scope.profiles[i].showed = false;
                    }
                }
            }
        };

        /** **** Begin of the profile detail***** */

        /*
         * Initialize the detail of the profile..
         */
        $scope.initDetailProfil = function () {

            if (localStorage.getItem('googleShareLink')) {
                $scope.envoiUrl = localStorage.getItem('googleShareLink');
                $scope.attachFacebook();
                $scope.attachGoogle();
                $('#shareModal').modal('show');
                localStorage.removeItem('googleShareLink');
            }

            var dataProfile = {};
            if (localStorage.getItem('compteId')) {
                dataProfile = {
                    id: localStorage.getItem('compteId')
                };
            }

            var profileId = $location.search().idProfil;

            // Get back the profile and the current userProfil
            profilsService.getUserProfil(profileId)
                .then(function (data) {
                    if (data === null || !data) {
                        UtilsService.showInformationModal('label.offline', 'profile.message.info.display.offline', '/profiles');
                    } else {
                        var profile = data;

                        tagsService.getTags().then(function (tags) {

                            profilsService.getProfilTags(profile.profilID).then(function (data) {

                                profile.profileTags = {};
                                profile.profileTags.idProfil = profile._id;
                                profile.profileTags.tags = data;

                                _.each(profile.profileTags.tags, function (item) {
                                    item.tagDetail = _.find(tags, function (tag) {
                                        return item.tag === tag._id;
                                    });


                                    if (typeof item.tagDetail === 'object') {
                                        item.texte = '<' + item.tagDetail.balise + ' class="'+ removeStringsUppercaseSpaces(item.tagDetail.libelle) +'">' + item.tagDetail.libelle + ': ' + $scope.displayTextSimple + '</' + item.tagDetail.balise + '>';
                                    }

                                    // Avoid mapping with backend
                                    item.id_tag = item.tag;
                                    item.style = item.texte;
                                });

                                $scope.detailProfil = profile;
                                $log.debug('$scope.detailProfil', $scope.detailProfil);
                            });

                        });
                    }

                });
        };

        /*
         * Add a profile to his favorites.
         */
        $scope.ajouterAmesFavoris = function () {
            if ($rootScope.currentUser && $scope.detailProfil) {
                var token = {
                    id: $rootScope.currentUser.local.token,
                    newFav: {
                        userID: $rootScope.currentUser._id,
                        profilID: $scope.detailProfil.profilID,
                        favoris: true,
                        actuel: false,
                        default: false
                    }
                };
                $http.post(configuration.URL_REQUEST + '/addUserProfilFavoris', token).success(function (data) {
                    $scope.showFavouri = false;
                    $scope.showToaster('#profile-success-toaster', 'profile.message.favorite.ok');
                    $rootScope.$broadcast('initCommon');
                });
            }
        };

        /*
         * Accept the delegation of a profile.
         */
        $scope.deleguerUserProfil = function () {
            $scope.loader = true;
            $scope.varToSend = {
                profilID: $scope.detailProfil.profilID,
                userID: $scope.detailProfil.owner,
                delegatedID: $rootScope.currentUser._id
            };
            var tmpToSend = {
                id: $rootScope.currentUser.local.token,
                sendedVars: $scope.varToSend
            };
            $http.post(configuration.URL_REQUEST + '/delegateUserProfil', tmpToSend)
                .success(function (data) {

                    $http.post(configuration.URL_REQUEST + '/findUserById', {
                        idUser: $scope.detailProfil.owner
                    })
                        .success(function (data) {
                            if (data) {
                                var emailTo = data.local.email;
                                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                                $scope.sendVar = {
                                    emailTo: emailTo,
                                    content: '<span> ' + fullName + ' vient d\'utiliser Accessidys pour accepter la délégation de votre profil : ' + $scope.detailProfil.nom + '. </span>',
                                    subject: 'Confirmer la délégation'
                                };
                                $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
                                    .success(function () {
                                        $scope.loader = false;
                                        $rootScope.updateListProfile = !$rootScope.updateListProfile;
                                        var profilLink = $location.absUrl();
                                        profilLink = profilLink.substring(0, profilLink.lastIndexOf('#/detailProfil?idProfil'));
                                        profilLink = profilLink + '#/profiles';
                                        $window.location.href = profilLink;
                                    })
                                    .error(function () {
                                        $scope.loader = false;
                                    });
                            }
                        });
                });
        };

        // Details of the profile to be shared
        $scope.detailsProfilApartager = function () {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.share.offline');
            } else {
                $('#shareModal').modal('show');
                $scope.socialShare();
            }
        };

        /**
         * This function retrieves the label(description) of a tag.
         */
        $scope.getTagsDescription = function (tag) {
            if (!$scope.listTags || !$scope.listTags.length) {
                $scope.listTags = JSON.parse(localStorage.getItem('listTags'));
            }
            var listTagsMaps = {};
            angular.forEach($scope.listTags, function (item) {
                listTagsMaps[item._id] = item;
            });
            return listTagsMaps[tag];
        };


        $scope.getProfiles = function () {
            $log.debug('Getting profiles of current user');

            $scope.profiles = [];

            tagsService.getTags().then(function (tags) {

                $log.debug('Gettings tags ', tags);

                profilsService.getProfilsByUser($rootScope.isAppOnline).then(function (data) {
                    if (data) {

                        _.each(data, function (profile) {

                            if (profile.type === 'profile') {

                                if ($rootScope.currentUser.local.role === 'admin' && profile.state === 'mine') {
                                    // Avoid duplicate profiles when the user is administrator
                                    for (var j = 0; j < data.length; j++) {
                                        if (profile._id === data[j]._id && data[j].state === 'default' && data[j].owner === $rootScope.currentUser._id) {
                                            profile.stateDefault = true;
                                            data.splice(j, 2);
                                        }
                                    }
                                }

                                profile.profileTags = _.find(data, function (profileTags) {

                                    var isReturned = false;

                                    if (profileTags.type === 'tags' && profile._id === profileTags.idProfil) {
                                        isReturned = true;

                                        _.each(profileTags.tags, function (item) {
                                            item.tagDetail = _.find(tags, function (tag) {
                                                return item.tag === tag._id;
                                            });


                                            if (typeof item.tagDetail === 'object') {
                                                item.texte = '<' + item.tagDetail.balise + ' class="'+ removeStringsUppercaseSpaces(item.tagDetail.libelle) +'">' + item.tagDetail.libelle + ': ' + $scope.displayTextSimple + '</' + item.tagDetail.balise + '>';
                                            }

                                            // Avoid mapping with backend
                                            item.id_tag = item.tag;
                                            item.style = item.texte;

                                        });


                                        delete profileTags.tagsText;
                                    }

                                    return isReturned;
                                });

                                profile.profileTags.tags.sort(function (a, b) {
                                    return a.tagDetail.position - b.tagDetail.position;
                                });

                                if (profile.nom === 'Accessidys par défaut' || profile.owner === 'scripted') {
                                    $scope.defaultSystemProfile = profile;
                                }

                                profile.showed = true;
                                $scope.profiles.push(profile);
                            }
                        });

                        $log.debug('getProfiles.getProfilsByUser() - $scope.profiles :', $scope.profiles);

                        $rootScope.$emit('refreshProfilAcutel', data);
                    }
                });
            });
        };

        $scope.create = function () {

            var profileToCreate = angular.copy($scope.defaultSystemProfile);
            profileToCreate.nom = $scope.generateProfileName($rootScope.currentUser.local.prenom, 0, 0);
            profileToCreate.owner = $rootScope.currentUser._id;
            profileToCreate.updated = new Date();

            $scope.openProfileModal('create', profileToCreate);

            // angular-google-analytics tracking pages
            Analytics.trackPage('/profile/create.html');
        };

        $scope.update = function (profile) {

            var profileToUpdate = angular.copy(profile);

            $scope.openProfileModal('update', profileToUpdate);

            // angular-google-analytics tracking pages
            Analytics.trackPage('/profile/update.html');
        };

        $scope.duplicate = function (profile) {

            $scope.oldProfil = profile;

            var profileToDuplicate = angular.copy(profile);
            profileToDuplicate.nom += ' Copie';
            profileToDuplicate.descriptif += ' Copie';
            profileToDuplicate.owner = $rootScope.currentUser._id;
            profileToDuplicate.updated = new Date();

            $scope.openProfileModal('duplicate', profileToDuplicate);

            // angular-google-analytics tracking pages
            Analytics.trackPage('/profile/duplicate.html');
        };

        $scope.showSuccessToaster = function (id) {
            $(id).fadeIn('fast').delay(5000).fadeOut('fast');
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


        /** **** end of the profile detail ***** */
    });