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
/* jshint loopfunc:true */

angular.module('cnedApp')
    .controller('ProfilesCtrl', function ($scope, $http, $rootScope, removeStringsUppercaseSpaces,
                                          configuration, $location, serviceCheck, verifyEmail, $window,
                                          profilsService, $uibModal, $timeout, tagsService, $log, _, Analytics,
                                          gettextCatalog, UtilsService, LoaderService, EmailService, ToasterService, UserService, $stateParams, fileStorageService) {

        /* Initializations */
        $scope.colorLists = ['Pas de coloration', 'Colorer les mots', 'Colorer les syllabes', 'Colorer les lignes RBV', 'Colorer les lignes RVJ', 'Colorer les lignes RBVJ', 'Surligner les mots', 'Surligner les lignes RBV', 'Surligner les lignes RVJ', 'Surligner les lignes RBVJ'];
        $scope.weightLists = ['Gras', 'Normal'];
        $scope.listTag = {};
        $scope.admin = $rootScope.admin;
        $scope.testEnv = false;
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
        $scope.configuration = configuration;
        $scope.sortType = 'updated';
        $scope.sortReverse = true;
        $scope.query = '';

        $scope.initProfil = function () {
            if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
                $log.debug('Init detail profile');

                $scope.initDetailProfil();
            }

            if ($stateParams.file) {

                $stateParams.file.data.owner = UserService.getData().email;
                profilsService.saveProfile($stateParams.file)
                    .then(function () {
                        var isFound = false;

                        for (var i = 0; i < $rootScope.profiles.length; i++) {
                            if ($rootScope.profiles[i].filepath === $stateParams.file.filepath) {
                                $rootScope.profiles[i] = $stateParams.file;
                                isFound = true;
                                break;
                            }
                        }

                        if (!isFound) {
                            $rootScope.profiles.push($stateParams.file);
                        }

                        ToasterService.showToaster('#profile-success-toaster', 'profile.message.save.storage.ok');
                    });
            }
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

                    console.log('updated profile', params.profile);
                    if (params.template === 'update') {

                        for (var i = 0; i < $rootScope.profiles.length; i++) {
                            if ($rootScope.profiles[i].filepath === params.profile.filepath) {
                                $rootScope.profiles[i] = params.profile;
                                break;
                            }
                        }
                    } else {
                        $rootScope.profiles.push(params.profile);
                    }

                    if (!UserService.getData().token) {
                        ToasterService.showToaster('#profile-success-toaster', 'profile.message.save.cache.ok');
                    } else {
                        ToasterService.showToaster('#profile-success-toaster', 'profile.message.save.storage.ok');
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
                size: 'md',
                resolve: {
                    profile: function () {
                        return profile;
                    }
                }
            }).result;
        };

        $scope.displayOwner = function (param) {
            if (UserService.getData().email === param.data.owner) {
                return 'Moi-même';
            } else if (param.data.state === 'favoris') {
                return 'Favoris';
            } else if (param.data.state === 'delegated') {
                return 'Délégué';
            } else if (param.data.state === 'default') {
                return 'Accessidys';
            }
        };

        $scope.showLoader = function () {

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

        // TODO
        /*
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
         };*/

        /**
         * Cancel the profile delegation by owner
         * @param profil
         */
        // TODO
        /*$scope.cancelDelegateByUser = function (profil) {
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
         };*/

        /**
         * Delete a profile
         * @param profile The profile to be deleted
         */
        $scope.deleteProfile = function (profile) {

            UtilsService.openConfirmModal(gettextCatalog.getString('profile.label.delete.title'),
                gettextCatalog.getString('profile.label.delete.anwser').replace('profile.name', profile.data.nom), true)
                .then(function () {
                    LoaderService.showLoader('profile.message.info.delete.inprogress', true);
                    LoaderService.setLoaderProgress(30);

                    profilsService.deleteProfil(profile)
                        .then(function () {
                            for (var i = 0; i < $rootScope.profiles.length; i++) {
                                if ($rootScope.profiles[i].filepath === profile.filepath) {
                                    $rootScope.profiles.splice(i, 1);
                                    break;
                                }
                            }

                            LoaderService.setLoaderProgress(100);
                            LoaderService.hideLoader();
                        }, function () {

                            LoaderService.setLoaderProgress(100);
                            LoaderService.hideLoader();
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
                    name: profile.data.nom
                };

                if (profile.provider === 'accessidys') {
                    itemToShare.linkToShare = 'https://' + window.location.host + '/#/detailProfil?idProfil=' + profile.data._id;

                    UtilsService.openSocialShareModal('profile', itemToShare)
                        .then(function () {
                            // Modal close
                            ToasterService.showToaster('#profile-success-toaster', 'mail.send.ok');
                        }, function () {
                            // Modal dismiss
                        });
                } else {
                    fileStorageService.shareFile(profile.filepath)
                        .then(function (shareLink) {
                            itemToShare.linkToShare = 'https://' + window.location.host + '/#/detailProfil?url=' + encodeURIComponent(shareLink);

                            UtilsService.openSocialShareModal('profile', itemToShare)
                                .then(function () {
                                    // Modal close
                                    ToasterService.showToaster('#profile-success-toaster', 'mail.send.ok');
                                }, function () {
                                    // Modal dismiss
                                });

                        });
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

        /**
         * This function generates the name of the profile
         */
        $scope.generateProfileName = function (actualPrenom, numeroPrenom, i) {
            if ($rootScope.profiles[i].data.nom.indexOf(actualPrenom) > -1 && $rootScope.profiles[i].data.nom.length === actualPrenom.length) {
                numeroPrenom++;
                actualPrenom = (UserService.getData().firstName || 'Profil') + ' ' + numeroPrenom;
                if ((i + 1) < $rootScope.profiles.length) {
                    return $scope.generateProfileName(actualPrenom, numeroPrenom, 0);
                } else {
                    return actualPrenom;
                }
            } else if ((i + 1) < $rootScope.profiles.length) {
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
                .success(function () {
                    ToasterService.showToaster('#profile-success-toaster', 'profile.message.default.ok');
                    $scope.getProfiles();
                });
        };

        $scope.isDefault = function (param) {
            if (param && param.data.state === 'default') {
                return true;
            }
            return false;
        };

        $scope.isOwner = function (param) {
            if (param && param.data.owner === UserService.getData().email) {
                return true;
            }
            return false;
        };

        $scope.isDelegated = function (param) {
            if (param && param.data.state === 'delegated') {
                return true;
            }
            return false;
        };

        $scope.isPreDelegated = function (param) {

            if (param && param.data.preDelegated && UserService.getData().email === param.preDelegated) {
                return true;
            }
            return false;
        };

        $scope.isFavourite = function (param) {
            if (param && (param.data.state === 'favoris' || param.data.state === 'default')) {
                return true;
            }
            return false;
        };

        $scope.isOwnerDelagate = function (param) {
            if (param && param.data.delegated && param.data.owner === UserService.getData().email) {
                return true;
            }
            return false;
        };

        $scope.isAnnuleDelagate = function (param) {
            if (param && param.data.preDelegated && param.data.owner === UserService.getData().email) {
                return true;
            }
            return false;
        };

        $scope.isDelegatedOption = function (param) {
            if (param && !param.data.delegated && !param.data.preDelegated && param.data.owner === UserService.getData().email) {
                return true;
            }
            return false;
        };


        // TODO
        $scope.removeFavourite = function (profile) {

            /*UtilsService.openConfirmModal('deleteFavoris', 'messageSuppression', false)
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
             .success(function () {
             ToasterService.showToaster('#profile-success-toaster', 'profile.message.favorite.delete');
             $scope.getProfiles();
             });
             });*/
        };

        /* sending email when duplicating. */
        $scope.sendEmailDuplique = function () {
            $http.post(configuration.URL_REQUEST + '/findUserById', {
                idUser: $scope.oldProfil.owner
            }).success(function (data) {
                $scope.findUserByIdFlag = data;
                if (data && data.local) {
                    var fullName = UserService.getData().firstName + ' ' + UserService.getData().lastName;
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
            for (var i = 0; i < $rootScope.profiles.length; i++) {
                if ($rootScope.profiles[i].data.nom
                    && $rootScope.profiles[i].data.nom.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1
                    || $rootScope.profiles[i].data.descriptif
                    && $rootScope.profiles[i].data.descriptif.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1) {
                    // Query Found
                    $rootScope.profiles[i].showed = true;
                } else {
                    // Query not Found
                    $rootScope.profiles[i].showed = false;
                }
            }
        };

        /** **** Begin of the profile detail***** */

        /*
         * Initialize the detail of the profile..
         */
        $scope.initDetailProfil = function () {


            if ($stateParams.idProfil) {

                profilsService.getProfiles().then(function (res) {

                    if (res) {

                        _.each(res, function (profile) {

                            if (profile) {

                                profile.data.className = profilsService.generateClassName(profile, false);

                                _.each(profile.data.profileTags, function (item) {
                                    item.tagDetail = _.find($rootScope.tags, function (tag) {
                                        return item.tag === tag._id;
                                    });


                                    if (typeof item.tagDetail === 'object') {
                                        item.texte = '<' + item.tagDetail.balise + '>' + item.tagDetail.libelle + ': ' + $rootScope.displayTextSimple + '</' + item.tagDetail.balise + '>';
                                    }

                                    // Avoid mapping with backend
                                    item.id_tag = item.tag;
                                    item.style = item.texte;

                                });

                                profile.data.profileTags.sort(function (a, b) {
                                    return a.tagDetail.position - b.tagDetail.position;
                                });

                                profile.showed = true;

                                if (profile.data._id === $stateParams.idProfil) {
                                    $scope.detailProfil = profile;
                                }


                            }
                        });
                    }

                });





            } else if ($stateParams.url) {

                $http.get($stateParams.url).then(function (res) {
                    $scope.detailProfil = {
                        data: res.data
                    };

                    $scope.detailProfil.data.className = profilsService.generateClassName($scope.detailProfil, true);
                    $rootScope.tmpProfile = angular.copy($scope.detailProfil);
                });

            }


            // Get back the profile and the current userProfil

        };

        /*
         * Add a profile to his favorites.
         */
        // TODO
        /*$scope.ajouterAmesFavoris = function () {

         $log.debug('$scope.detailProfil', $scope.detailProfil);
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
         $http.post(configuration.URL_REQUEST + '/addUserProfilFavoris', token).success(function () {
         $scope.showFavouri = false;
         ToasterService.showToaster('#profile-success-toaster', 'profile.message.favorite.ok');
         $rootScope.$broadcast('initCommon'); // TODO revoir
         });
         }
         };*/

        /*
         * Accept the delegation of a profile.
         */

        //TODO
        /*$scope.deleguerUserProfil = function () {
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
         .success(function () {

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
         };*/

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

        $scope.create = function () {

            var profileToCreate = angular.copy($rootScope.defaultSystemProfile);
            profileToCreate.data.nom = $scope.generateProfileName(UserService.getData().firstName || 'Profil', 0, 0);
            profileToCreate.data.owner = UserService.getData().email;
            profileToCreate.data.updated = new Date();
            profileToCreate.data.className = profilsService.generateClassName(profileToCreate, true);

            $scope.openProfileModal('create', profileToCreate);

            // angular-google-analytics tracking pages
            Analytics.trackPage('/profile/create.html');
        };

        $scope.update = function (profile) {

            var profileToUpdate = angular.copy(profile);
            profileToUpdate.data.className = profilsService.generateClassName(profileToUpdate, true);

            $scope.openProfileModal('update', profileToUpdate);

            // angular-google-analytics tracking pages
            Analytics.trackPage('/profile/update.html');
        };

        $scope.duplicate = function (profile) {

            $scope.oldProfil = profile;

            var profileToDuplicate = angular.copy(profile);
            profileToDuplicate.data.nom += ' Copie';
            profileToDuplicate.data.descriptif += ' Copie';
            profileToDuplicate.data.owner = UserService.getData().email;
            profileToDuplicate.data.updated = new Date();
            profileToDuplicate.data.className = profilsService.generateClassName(profileToDuplicate, true);

            $scope.openProfileModal('duplicate', profileToDuplicate);

            // angular-google-analytics tracking pages
            Analytics.trackPage('/profile/duplicate.html');
        };

        /** **** end of the profile detail ***** */
    });