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
                                          profilsService, $uibModal, $timeout, tagsService, $log, _, Analytics,
                                          gettextCatalog, UtilsService, LoaderService, EmailService, ToasterService) {

        /* Initializations */
        $scope.displayTextSimple = 'AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap mais aussi toute personne ayant des difficultés pour lire des documents longs ou complexes. Depuis les élèves et étudiants avec une dyslexie jusqu’aux cadres supérieurs trop pressés jusqu’aux personnes âgées, AccessiDys facilite la compréhension des documents administratifs ou juridiques, des manuels scolaires traditionnels, des magazines ou journaux à la mise en page complexe, avec des petits caractères ou sans synthèse vocale. AccessiDys est une plateforme Web avec deux fonctions principales. Les pages Web ou documents à lire sont affichées en utilisant un profil de lecture sur mesure qui comprend un large choix de paramètres d’affichage adaptés aux besoins individuels de chaque lecteur. AccessiDys vise les lecteurs qui ont trop peu de temps ou d’attention, qui ont une dyslexie, une dyspraxie, un autisme ou des déficiences visuelles. AccessiDys sait également lire les pages Web à haute voix. AccessiDys rend vos documents ou pages accessibles aux lecteurs en les important de manière simple et rapide quel que soit le format du fichier d’origine. Qu’il s’agisse d’un fichier PDF numérisé, d’un document Office, d’un livre électronique au format ePub ou d’une page Web traditionnelle, AccessiDys vous permet de transformer votre document pour que les lecteurs bénéficient d’une expérience de lecture totalement personnalisée.';
        $scope.colorLists = ['Pas de coloration', 'Colorer les mots', 'Colorer les syllabes', 'Colorer les lignes RBV', 'Colorer les lignes RVJ', 'Colorer les lignes RBVJ', 'Surligner les mots', 'Surligner les lignes RBV', 'Surligner les lignes RVJ', 'Surligner les lignes RBVJ'];
        $scope.weightLists = ['Gras', 'Normal'];
        $scope.listTag = {};
        $scope.admin = $rootScope.admin;
        $scope.testEnv = false;
        $scope.applyRules = false;
        $scope.forceApplyRules = true;
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
                        ToasterService.showToaster('#profile-success-toaster', 'profile.message.edit.ok');
                    } else {
                        ToasterService.showToaster('#profile-success-toaster', 'profile.message.save.ok');
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

        $scope.cancelDelegateByOwner = function (profile) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {
                UtilsService.openConfirmModal('Annuler la délégation', 'Voulez-vous annuler votre délégation?', true)
                    .then(function () {

                        LoaderService.showLoader('profile.message.info.canceldelegateByOwner.inprogress', false);

                        var sendParam = {
                            id: $rootScope.currentUser.local.token,
                            sendedVars: {
                                idProfil: profile._id,
                                idUser: $rootScope.currentUser._id
                            }
                        };

                        $http.post(configuration.URL_REQUEST + '/annulerDelegateUserProfil', sendParam)
                            .success(function (data) {
                                if (data) {
                                    $http.post(configuration.URL_REQUEST + '/findUserById', {
                                        idUser: profile.preDelegated
                                    })
                                        .success(function (data) {
                                            if (data) {
                                                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                                                var emailParams = {
                                                    emailTo: data.local.email,
                                                    content: '<span> ' + fullName + ' vient d\'annuler la demande de délégation de son profil : ' + profile.nom + '. </span>',
                                                    subject: 'Annuler la délégation'
                                                };

                                                EmailService.sendEMail(emailParams).then(function () {
                                                    ToasterService.showToaster('#profile-success-toaster', 'mail.send.ok');
                                                    LoaderService.hideLoader();
                                                    $scope.initProfil();
                                                }, function () {
                                                    ToasterService.showToaster('#profile-error-toaster', 'mail.send.ko');
                                                    LoaderService.hideLoader();
                                                    $scope.initProfil();
                                                });
                                            }
                                        });
                                }
                            });

                    });
            }
        };

        /**
         * Cancel the profile delegation by owner
         * @param profil
         */
        $scope.cancelDelegateByUser = function (profil) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {

                UtilsService.openConfirmModal('Retirer la délégation', 'Voulez-vous retirer votre délégation?', true)
                    .then(function () {

                        var sendParam = {
                            id: $rootScope.currentUser.local.token,
                            sendedVars: {
                                idProfil: profil._id,
                                idUser: $rootScope.currentUser._id
                            }
                        };

                        LoaderService.showLoader('profile.message.info.canceldelegateByUser.inprogress', false);

                        $http.post(configuration.URL_REQUEST + '/retirerDelegateUserProfil', sendParam)
                            .success(function (data) {
                                if (data) {
                                    $http.post(configuration.URL_REQUEST + '/findUserById', {
                                        idUser: data.delegatedID
                                    })
                                        .success(function (data) {
                                            if (data) {
                                                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                                                var emailParams = {
                                                    emailTo: data.local.email,
                                                    content: '<span> ' + fullName + ' vient de vous retirer la délégation de son profil : ' + profil.nom + '. </span>',
                                                    subject: 'Retirer la délégation'
                                                };
                                                EmailService.sendEMail(emailParams).then(function () {
                                                    ToasterService.showToaster('#profile-success-toaster', 'mail.send.ok');
                                                    LoaderService.hideLoader();
                                                    $scope.initProfil();
                                                }, function () {
                                                    ToasterService.showToaster('#profile-error-toaster', 'mail.send.ko');
                                                    LoaderService.hideLoader();
                                                    $scope.initProfil();
                                                });
                                            }
                                        });
                                }
                            });

                    });

            }
        };

        /**
         * Delete a profile
         * @param profile The profile to be deleted
         */
        $scope.deleteProfile = function (profile) {

            UtilsService.openConfirmModal('profile.label.delete.title',
                gettextCatalog.getString('profile.label.delete.anwser').replace('profile.name', profile.nom), true)
                .then(function () {
                    localStorage.setItem('lockOperationDropBox', true);
                    LoaderService.showLoader('profile.message.info.delete.inprogress', true);
                    LoaderService.setLoaderProgress(30);

                    profilsService.deleteProfil($rootScope.isAppOnline, $rootScope.currentUser._id, profile._id)
                        .then(function () {
                            LoaderService.setLoaderProgress(100);
                            LoaderService.hideLoader();
                            $scope.initProfil();
                        });
                });

            // angular-google-analytics tracking pages
            Analytics.trackPage('/document/delete.html');
        };


        /**
         * Share a profile
         * @param document The profile to share
         */
        $scope.shareProfile = function (profile) {
            $log.debug('Share profile', profile);

            if (!$rootScope.isAppOnline) {

                UtilsService.showInformationModal('label.offline', 'profile.message.info.share.offline');

            } else {

                var itemToShare = {
                    linkToShare: '',
                    name: profile.nom
                };

                if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
                    itemToShare.linkToShare = decodeURI($location.absUrl());
                } else {
                    itemToShare.linkToShare = decodeURI($location.absUrl().replace('profiles', 'detailProfil?idProfil=' + profile._id));
                }


                UtilsService.openSocialShareModal('profile', itemToShare)
                    .then(function () {
                        // Modal close
                        ToasterService.showToaster('#profile-success-toaster', 'mail.send.ok');
                    }, function () {
                        // Modal dismiss
                    });


                // angular-google-analytics tracking pages
                Analytics.trackPage('/profile/share.html');
            }

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
                    ToasterService.showToaster('#profile-success-toaster', 'profile.message.default.ok');
                    $scope.getProfiles();
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
                    ToasterService.showToaster('#profile-success-toaster', 'profile.message.default.ok');
                    $scope.getProfiles();
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


        $scope.removeFavourite = function (profile) {

            UtilsService.openConfirmModal('deleteFavoris', 'messageSuppression', false)
                .then(function () {

                    var params = {
                        profilID: profile._id,
                        userID: $rootScope.currentUser._id,
                        favoris: true
                    };

                    if ($scope.token && $scope.token.id) {
                        $scope.token.favProfile = params;
                    } else {
                        $scope.token.id = localStorage.getItem('compteId');
                        $scope.token.favProfile = params;
                    }
                    $http.post(configuration.URL_REQUEST + '/removeUserProfileFavoris', $scope.token)
                        .success(function (data) {
                            $scope.getProfiles();
                        });
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


        $scope.delegateProfile = function (profile) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {
                profilsService.openDelegateProfileModal(profile)
                    .then(function (result) {
                        if (result && result.message) {
                            ToasterService.showToaster('#profile-success-toaster', result.message);
                        }

                        $scope.initProfil();
                    });

                // angular-google-analytics tracking pages
                Analytics.trackPage('/profile/delegate.html');
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
                                        item.texte = '<' + item.tagDetail.balise + ' class="' + removeStringsUppercaseSpaces(item.tagDetail.libelle) + '">' + item.tagDetail.libelle + ': ' + $scope.displayTextSimple + '</' + item.tagDetail.balise + '>';
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
                    ToasterService.showToaster('#profile-success-toaster', 'profile.message.favorite.ok');
                    $rootScope.$broadcast('initCommon'); // TODO revoir
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
                                                item.texte = '<' + item.tagDetail.balise + ' class="' + removeStringsUppercaseSpaces(item.tagDetail.libelle) + '">' + item.tagDetail.libelle + ': ' + $scope.displayTextSimple + '</' + item.tagDetail.balise + '>';
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

        /** **** end of the profile detail ***** */
    });