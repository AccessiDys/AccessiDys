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
    .controller('ProfilesCtrl', function ($scope, $http, $rootScope,
                                          configuration, $location,
                                          profilsService, $uibModal, $log, _, Analytics,
                                          gettextCatalog, UtilsService, LoaderService,
                                          EmailService, ToasterService, UserService, $stateParams,
                                          fileStorageService, tagsService, CacheProvider, $timeout) {

        /* Initializations */
        $scope.colorLists = ['Pas de coloration', 'Colorer les mots', 'Colorer les syllabes', 'Colorer les lignes RBV', 'Colorer les lignes RVJ', 'Colorer les lignes RBVJ', 'Surligner les mots', 'Surligner les lignes RBV', 'Surligner les lignes RVJ', 'Surligner les lignes RBVJ'];
        $scope.weightLists = ['Gras', 'Normal'];
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
                $log.debug('save profile storage ok', $stateParams.file);
                $timeout(function () {
                    ToasterService.showToaster('#profile-success-toaster', 'profile.message.save.storage.ok', {
                        '%%PROVIDER%%': UserService.getData().provider
                    });
                }, 200);
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
                templateUrl: 'views/profiles/profilAffichageModal.html', // TODO change the file name
                controller: 'profilesAffichageModalCtrl',
                windowClass: 'profil-lg',
                backdrop: 'static',
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
                } else if (params.operation === 'vocal') {
                    $scope.openVocalSynthesisSettingsModal(params.profile).then(function (vocalParams) {
                        // Modal closed
                        $scope.openProfileModal(params.template, vocalParams.profile);
                    }, function () {
                        // Modal dismissed
                        $scope.openProfileModal(params.template, params.profile);
                    });
                }

            }, function (params) {
                // Modal dismissed
                if (params.operation && params.operation === 'save') {
                    $log.debug('updated profile', params.profile);
                    params.profile.showed = true;

                    if (params.template === 'update') {
                        for (var i = 0; i < $rootScope.profiles.length; i++) {
                            if ((params.profile.data._id && $rootScope.profiles[i].data._id === params.profile.data._id) || (params.oldProfile.filename && $rootScope.profiles[i].filename === params.oldProfile.filename)) {
                                $rootScope.profiles[i] = params.profile;
                                break;
                            }
                        }
                    } else {
                        $rootScope.profiles.push(params.profile);
                    }

                    ToasterService.showToaster('#profile-success-toaster', 'profile.message.save.ok');

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
                backdrop: 'static',
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
                backdrop: 'static',
                size: 'md',
                resolve: {
                    profile: function () {
                        return profile;
                    }
                }
            }).result;
        };

        /**
         * Open Vocal synthesis  settings modal of a profile
         *
         * @param profile
         *
         * @method openVocalSynthesisSettingsModal
         */
        $scope.openVocalSynthesisSettingsModal = function (profile) {
            return $uibModal.open({
                templateUrl: 'views/profiles/vocal-synthesis-settings.modal.html',
                controller: 'VocalSynthesisSettingsModalCtrl',
                scope: $scope,
                backdrop: 'static',
                size: 'md',
                resolve: {
                    profile: function () {
                        return profile;
                    }
                }
            }).result;
        };

        $scope.displayOwner = function (profile) {
            if ($scope.isOwner(profile)) {
                return 'Moi-même';
            } else if (profile.data.delegated || (profile.data.preDelegated && profile.data.preDelegated !== '' )) {
                return 'Délégué';
            } else if (profile.data.owner === 'scripted' || profile.data.owner === 'admin') {
                return 'Accessidys';
            }
        };


        /**
         * Delete a profile
         * @param profile The profile to be deleted
         */
        $scope.deleteProfile = function (profile) {

            UtilsService.openConfirmModal(gettextCatalog.getString('profile.label.delete.title'),
                gettextCatalog.getString('profile.label.delete.anwser').replace('profile.name', profile.data.nom), true)
                .then(function () {
                    LoaderService.showLoader('profile.message.info.delete.inprogress', false);

                    profilsService.deleteProfil(profile)
                        .then(function () {
                            for (var i = 0; i < $rootScope.profiles.length; i++) {
                                if ((profile.data._id && $rootScope.profiles[i].data._id === profile.data._id) || ( profile.filepath && $rootScope.profiles[i].filepath === profile.filepath )) {
                                    $rootScope.profiles.splice(i, 1);
                                    break;
                                }
                            }

                            if ($rootScope.currentProfile && $rootScope.currentProfile.data.nom === profile.data.nom) {
                                $rootScope.currentProfile = $rootScope.profiles[0];
                                CacheProvider.setItem($rootScope.profiles[0], 'currentProfile');
                            }
                            LoaderService.hideLoader();
                            ToasterService.showToaster('#profile-success-toaster', 'profile.message.info.delete.ok');
                        }, function () {
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
                            itemToShare.linkToShare = 'https://' + window.location.host + '/#/detailProfil?url=' + encodeURIComponent(shareLink.url);

                            UtilsService.openSocialShareModal('profile', itemToShare)
                                .then(function () {
                                    // Modal close
                                    ToasterService.showToaster('#profile-success-toaster', 'mail.send.ok');
                                }, function () {
                                    // Modal dismiss
                                });

                        }, function (res) {
                            if (res.error === 'email_not_verified') {
                                ToasterService.showToaster('#profile-error-toaster', 'dropbox.message.error.share.emailnotverified');
                            } else {
                                ToasterService.showToaster('#profile-error-toaster', 'dropbox.message.error.share.ko');
                            }
                        });
                }


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

        $scope.isDefault = function (param) {
            if (param && (param.data.owner === 'admin' || param.data.owner === 'scripted')) {
                return true;
            }
            return false;
        };

        /**
         * Check if the current user is profile owner
         * @param profile
         * @returns {boolean}
         */
        $scope.isOwner = function (profile) {
            if (profile && (profile.data.owner === UserService.getData().email || (UserService.getData().isAdmin && (profile.data.owner === 'admin' || profile.data.owner === 'scripted')))) {
                return true;
            }
            return false;
        };

        $scope.isDelegated = function (param) {
            if (param && param.data.delegated) {
                return true;
            }
            return false;
        };

        $scope.isPreDelegated = function (param) {

            if (param && param.data.preDelegated && UserService.getData().email === param.data.preDelegated && !param.data.delegated) {
                return true;
            }
            return false;
        };

        /**
         * Check if profile is favourite
         * @param profile
         * @returns {boolean}
         */
        $scope.isFavourite = function (profile) {
            if (profile && (profile.data.isFavourite || profile.data.owner === 'admin' || profile.data.owner === 'scripted')) {
                return true;
            }
            return false;
        };

        $scope.isOwnerDelagate = function (profile) {
            if (profile && profile.data.preDelegated && profile.data.preDelegated !== '' && $scope.isOwner(profile)) {
                return true;
            }
            return false;
        };

        $scope.canCancelDelegation = function (profile) {
            if (profile && profile.data.preDelegated && profile.data.preDelegated !== '' && !$scope.isOwner(profile)) {
                return true;
            }
            return false;
        };


        /* sending email when duplicating. */
        $scope.sendEmailDuplique = function (profile) {

            var fullName = UserService.getData().firstName + ' ' + UserService.getData().lastName;
            var sendVar = {
                emailTo: $scope.oldProfil.data.owner,
                content: '<span> ' + fullName + ' vient d\'utiliser Accessidys pour dupliquer votre profil : ' + $scope.oldProfil.data.nom + '. </span>',
                subject: fullName + ' a dupliqué votre profil'
            };
            $http.post('/sendEmail', sendVar)
                .success(function () {
                });

        };

        /**
         * Delegate a profile
         * @param profile
         */
        $scope.delegateProfile = function (profile) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {
                profilsService.openDelegateProfileModal(profile)
                    .then(function (result) {
                        if (result && result.message) {
                            ToasterService.showToaster('#profile-success-toaster', result.message);
                        }

                        $rootScope.initCommon();


                    });

                // angular-google-analytics tracking pages
                Analytics.trackPage('/profile/delegate.html');
            }
        };

        /**
         * Accept delegation of a profile
         * @param profile
         */
        $scope.acceptProfileDelegation = function (profile) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {
                profile.data.delegated = true;

                profilsService.update(profile).then(function () {
                });

                //$scope.initDetailProfil();
            }
        };

        /**
         * Denied delegation of a profile
         * @param profile
         */
        $scope.deniedProfileDelegation = function (profile) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {

                UtilsService.openConfirmModal('Annuler la délégation', 'Voulez-vous annuler votre délégation?', true)
                    .then(function () {

                        LoaderService.showLoader('profile.message.info.canceldelegateByOwner.inprogress', false);

                        profile.data.delegated = false;
                        profile.data.preDelegated = '';

                        profilsService.update(profile).then(function () {

                        });

                        var fullName = UserService.getData().firstName + ' ' + UserService.getData().lastName;
                        var emailParams = {
                            emailTo: profile.data.owner,
                            content: '<span> ' + fullName + ' vient d\'annuler la demande de délégation de son profil : ' + profile.data.nom + '. </span>',
                            subject: 'Annuler la délégation'
                        };

                        EmailService.sendEMail(emailParams).then(function () {
                            ToasterService.showToaster('#profile-success-toaster', 'mail.send.ok');
                            LoaderService.hideLoader();
                            $rootScope.initCommon();
                        }, function () {
                            ToasterService.showToaster('#profile-error-toaster', 'mail.send.ko');
                            LoaderService.hideLoader();
                            $rootScope.initCommon();
                        });

                    });

            }
        };

        /**
         * Cancel delegation of a profile
         * @param profile
         */
        $scope.cancelProfileDelegation = function (profile) {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'profile.message.info.delegate.offline');
            } else {

                UtilsService.openConfirmModal('Retirer la délégation', 'Voulez-vous retirer votre délégation?', true)
                    .then(function () {

                        LoaderService.showLoader('profile.message.info.canceldelegateByUser.inprogress', false);

                        var emailTo = profile.data.preDelegated;

                        profile.data.delegated = false;
                        profile.data.preDelegated = '';

                        profilsService.update(profile).then(function () {

                        });

                        var fullName = UserService.getData().firstName + ' ' + UserService.getData().lastName;
                        var emailParams = {
                            emailTo: emailTo,
                            content: '<span> ' + fullName + ' vient de vous retirer la délégation de son profil : ' + profil.data.nom + '. </span>',
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


                    });

            }
        };

        /**
         * Filter profile list by user research
         */
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

        /**
         * Initialize profile detail
         */
        $scope.initDetailProfil = function () {
            if ($stateParams.idProfil) {

                profilsService.getProfile($stateParams.idProfil).then(function (profile) {

                    if (profile) {
                        profile.data.className = profilsService.generateClassName(profile, false);

                        _.each(profile.data.profileTags, function (item) {
                            item.tagDetail = _.find($rootScope.tags, function (tag) {
                                return item.tag === tag._id;
                            });
                        });

                        profile.data.profileTags.sort(function (a, b) {
                            return a.tagDetail.position - b.tagDetail.position;
                        });

                        $log.debug('detailProfil', profile);

                        $scope.detailProfil = profile;
                        $scope.detailProfil.data.className = profilsService.generateClassName($scope.detailProfil, true);
                        $rootScope.tmpProfile = angular.copy($scope.detailProfil);
                    }

                });
            } else if ($stateParams.url) {

                $http.get($stateParams.url).then(function (res) {
                    $scope.detailProfil = {
                        data: res.data
                    };

                    _.each($scope.detailProfil.data.profileTags, function (item) {
                        item.tagDetail = _.find($rootScope.tags, function (tag) {
                            return item.tag === tag._id;
                        });
                    });

                    $scope.detailProfil.data.profileTags.sort(function (a, b) {
                        return a.tagDetail.position - b.tagDetail.position;
                    });

                    $scope.detailProfil.data.className = profilsService.generateClassName($scope.detailProfil, true);
                    $rootScope.tmpProfile = angular.copy($scope.detailProfil);
                });

            }
            // Get back the profile and the current userProfil
        };

        /**
         * Add a profile to his favorites.
         * @param profile
         */
        $scope.addToFavourite = function (profile) {
            profile.data.isFavourite = true;

            profilsService.saveProfile(profile).then(function () {

            });
        };

        /**
         * Remove a profile from favourite
         * @param profile
         */
        $scope.removeFavourite = function (profile) {
            profile.data.isFavourite = false;

            profilsService.saveProfile(profile).then(function () {

            });
        };

        $scope.create = function () {

            var profileToCreate = copyProfileForCreation($rootScope.defaultSystemProfile);

            profileToCreate.data.nom = $scope.generateProfileName(UserService.getData().firstName || 'Profil', 0, 0);

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

        /**
         * Duplicate a profile
         * @param profile The profile to be duplicate
         */
        $scope.duplicate = function (profile) {
            $scope.oldProfil = profile;

            var profileToDuplicate = copyProfileForCreation(profile);
            profileToDuplicate.data.nom += ' Copie';
            if (profileToDuplicate.data.descriptif) {
                profileToDuplicate.data.descriptif += ' Copie';
            } else {
                profileToDuplicate.data.descriptif = ' Copie';
            }

            $scope.openProfileModal('duplicate', profileToDuplicate);

            // angular-google-analytics tracking pages
            Analytics.trackPage('/profile/duplicate.html');
        };

        /**
         * Create new profile object based another profile
         * @param profile
         * @returns {*}
         */
        var copyProfileForCreation = function (profile) {

            var res = {
                filename: null,
                filepath: null,
                data: null,
                showOverview: true
            };

            if (profile && profile.data) {
                res.data = angular.copy(profile.data);
                res.data.owner = UserService.getData().email;
                res.data.className = profilsService.generateClassName(res, true);

                delete res.data._id;
                delete res.data.delegated;
                delete res.data.preDelegated;
                delete res.data.state;
                delete res.data.isFavourite;

                for (var i = 0; i < res.data.profileTags.length; i++) {
                    delete res.data.profileTags[i]._id;
                    delete res.data.profileTags[i].profil;
                }

                $log.debug('Profile copy', res);
            }

            return res;
        };

        $scope.isProfileOverviewHide = false;

        $scope.showProfilesOverview = function () {

            console.log('show');

            for (var i = 0; i < $scope.profiles.length; i++) {
                $scope.profiles[i].showOverview = true;
            }

            $scope.isProfileOverviewHide = false;

        };

        $scope.hideProfilesOverview = function () {

            console.log('hide');

            for (var i = 0; i < $scope.profiles.length; i++) {
                $scope.profiles[i].showOverview = false;
            }

            $scope.isProfileOverviewHide = true;
        };

        /** **** end of the profile detail ***** */
    });