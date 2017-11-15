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

/* global Hyphenator  */
'use strict';

angular.module('cnedApp').controller('CommonCtrl', function ($scope, $rootScope, profilsService, $uibModal,
                                                             tagsService, $log, UserService, $state, CacheProvider, fileStorageService, _, tags, userData) {

    $log.debug('commonCtrl - userData', userData);

    $rootScope.profiles = [];
    $rootScope.tags = tags;
    $rootScope.tmpProfile = null;
    $rootScope.currentProfile = null;
    $rootScope.defaultSystemProfile = {};
    $rootScope.userData = userData;
    $rootScope.$state = $state;

    $rootScope.isFullsize = true;
    $rootScope.displayTextSimple = 'AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap mais aussi toute personne ayant des difficultés pour lire des documents longs ou complexes. Depuis les élèves et étudiants avec une dyslexie jusqu\'aux cadres supérieurs trop pressés jusqu\'aux personnes âgées, AccessiDys facilite la compréhension des documents administratifs ou juridiques, des manuels scolaires traditionnels, des magazines ou journaux à la mise en page complexe, avec des petits caractères ou sans synthèse vocale. AccessiDys est une plateforme Web avec deux fonctions principales. Les pages Web ou documents à lire sont affichées en utilisant un profil de lecture sur mesure qui comprend un large choix de paramètres d\'affichage adaptés aux besoins individuels de chaque lecteur. AccessiDys vise les lecteurs qui ont trop peu de temps ou d\'attention, qui ont une dyslexie, une dyspraxie, un autisme ou des déficiences visuelles. AccessiDys sait également lire les pages Web à haute voix. AccessiDys rend vos documents ou pages accessibles aux lecteurs en les important de manière simple et rapide quel que soit le format du fichier d\'origine. Qu\'il s\'agisse d\'un fichier PDF numérisé, d\'un document Office, d\'un livre électronique au format ePub ou d\'une page Web traditionnelle, AccessiDys vous permet de transformer votre document pour que les lecteurs bénéficient d\'une expérience de lecture totalement personnalisée.';

    $rootScope.$watch('isAppOnline', function (newvalue) {
        if (newvalue) {
            fileStorageService.synchronizeFiles().then(function(res){
                if (res && res.profilesCount > 0) {
                    $rootScope.initCommon();
                }
            });
        }
    }, true);

    $rootScope.initCommon = function () {

        CacheProvider.getItem('currentProfile').then(function (currentProfile) {
            // Init profile list and Tag
            profilsService.getProfiles().then(function (res) {

                $rootScope.profiles = [];

                if (res) {

                    _.each(res, function (profile) {

                        if (profile) {

                            $log.debug('profile', profile);
                            profile.data.className = profilsService.generateClassName(profile, false);

                            _.each(profile.data.profileTags, function (item) {
                                item.tagDetail = _.find(tags, function (tag) {
                                    return item.tag === tag._id;
                                });
                            });

                            profile.data.profileTags.sort(function (a, b) {
                                return a.tagDetail.position - b.tagDetail.position;
                            });

                            if (profile.data.nom === 'Accessidys par défaut' || profile.data.owner === 'scripted') {
                                $rootScope.defaultSystemProfile = profile;
                            }

                            if(profile.data.updated){
                                profile.data.updated = new Date(profile.data.updated);
                            }

                            profile.showed = true;
                            $rootScope.profiles.push(profile);

                            if (currentProfile && currentProfile.data.nom === profile.data.nom) {
                                $rootScope.currentProfile = profile;
                            }
                        }
                    });

                    if (!$rootScope.currentProfile) {
                        $rootScope.currentProfile = $rootScope.defaultSystemProfile;
                    }


                    $log.debug('getProfiles.getProfilsByUser() - $scope.profiles :', $scope.profiles);
                }

            });
        });


        var hyphenatorSettings = {
            hyphenchar: '|',
            defaultlanguage: 'fr',
            useCSS3hyphenation: true,
            displaytogglebox: true
        };
        Hyphenator.config(hyphenatorSettings);
    };

    $rootScope.onChangeCurrentProfile = function (currentProfile) {
        $log.debug('on change current profile', currentProfile);

        $rootScope.currentProfile = currentProfile;

        CacheProvider.setItem(currentProfile, 'currentProfile');
    };

    $rootScope.openVocalHelpModal = function () {
        $uibModal.open({
            templateUrl: 'views/infoPages/vocalHelp.html',
            controller: 'VocalHelpModalCtrl',
            size: 'lg'
        });
    };

    $rootScope.bookmarkletPopin = function () {
        $uibModal.open({
            templateUrl: 'views/common/bookmarklet.modal.html',
            controller: 'BookMarkletModalCtrl',
            size: 'md'
        }).result.then(function () {
            //
        });

    };

    $rootScope.getDisplayedText = function (profileTag) {
        var res = '';

        if (profileTag) {
            res = '<' + profileTag.tagDetail.balise + '>' + profileTag.tagDetail.libelle + ' : ' + $rootScope.displayTextSimple + '</' + profileTag.tagDetail.balise + '>';
        }

        return res;
    };

    $rootScope.initCommon();

});