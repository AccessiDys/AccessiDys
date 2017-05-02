/* File: app.js.tpl
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
/* global io */

var testEnv = false;
var cnedApp = angular.module('cnedApp', [
    'templates',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'gettext',
    'ui.bootstrap',
    'angular-md5',
    'services.config',
    'ngAudio',
    'LocalForageModule',
    'angular-google-analytics',
    '720kb.socialshare',
    'slick'
]);

cnedApp.config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, AnalyticsProvider, $logProvider, configuration) {

    // Log enable / disable
    $logProvider.debugEnabled((configuration.ENV === 'dev'));

    // Google analytics account settings
    AnalyticsProvider.setAccount(configuration.GOOGLE_ANALYTICS_ID);
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.trackUrlParams(true);
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');

    // HttpProvider settings
    $sceDelegateProvider.resourceUrlWhitelist([
        '**'
    ]);
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('app.httpinterceptor');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            controller: 'CommonCtrl',
            resolve: {
                userData: function (UserService, $log) {
                    $log.debug('Init user data');
                    return UserService.init();
                }
            }
        })
        .state('app.home', {
            url: '/',
            templateUrl: 'views/index/home.html'
        })
        .state('app.overview', {
            url: '/apercu?idDocument&tmp&url&title&annotation&mode',
            templateUrl: 'views/workspace/apercu.html',
            controller: 'ApercuCtrl',
            pageTrack: '/overview.html'  // angular-google-analytics extension
        })
        .state('app.edit-document', {
            url: '/addDocument?idDocument&title&url',
            templateUrl: 'views/addDocument/addDocument.html',
            controller: 'AddDocumentCtrl',
            pageTrack: '/document/edit.html',  // angular-google-analytics extension,
            params: {
                file: null
            }
        })
        .state('app.print-document', {
            url: '/print?documentId&plan&mode',
            templateUrl: 'views/workspace/print.html',
            controller: 'PrintCtrl',
            pageTrack: '/print.html'  // angular-google-analytics extension
        })
        .state('app.list-profile', {
            url: '/profiles',
            templateUrl: 'views/profiles/profiles.html',
            controller: 'ProfilesCtrl',
            pageTrack: '/profile/list.html',  // angular-google-analytics extension
            params: {
                file: null
            }
        })
        .state('app.detail-profile', {
            url: '/detailProfil',
            templateUrl: 'views/profiles/detailProfil.html',
            controller: 'ProfilesCtrl',
            pageTrack: '/profile/detail.html'  // angular-google-analytics extension
        })
        .state('app.list-style', {
            url: '/tag',
            templateUrl: 'views/tag/tag.html',
            controller: 'TagCtrl',
            pageTrack: '/style/list.html'  // angular-google-analytics extension
        })
        .state('app.list-document', {
            url: '/listDocument',
            templateUrl: 'views/listDocument/listDocument.html',
            controller: 'listDocumentCtrl',
            pageTrack: '/document/list.html'  // angular-google-analytics extension
        })

        .state('app.legal-notice', {
            url: '/mentions',
            templateUrl: 'views/infoPages/mentions.html',
            pageTrack: '/legal-notice.html'  // angular-google-analytics extension
        })
        .state('app.presentation', {
            url: '/a-propos',
            templateUrl: 'views/infoPages/about.html',
            pageTrack: '/presentation.html'  // angular-google-analytics extension
        })
        .state('app.contribute', {
            url: '/contribuer',
            templateUrl: 'views/infoPages/contribute.html',
            pageTrack: '/contribute.html'  // angular-google-analytics extension
        })

        .state('app.404', {
            url: '/404',
            templateUrl: 'views/404/404.html'
        })

        .state('app.my-backup', {
            url: '/ma-sauvegarde.html?auth',
            templateUrl: 'views/backup/my-backup.html',
            controller: 'MyBackupCtrl',
            pageTrack: '/overview.html',  // angular-google-analytics extension,
            params: {
                prevState: null,
                file: null
            },
            resolve: {
                auth: function ($state, $stateParams, UserService, OauthService, $log, CacheProvider) {

                    return CacheProvider.getItem('myBackupRouteData').then(function (routeData) {

                        CacheProvider.setItem(null, 'myBackupRouteData');


                        if ($stateParams.auth) {

                            return OauthService.token().then(function (res) {
                                $log.debug('get token ', res.data);

                                return UserService.saveData(res.data).then(function () {
                                    if (routeData) {
                                        $state.go(routeData.prevState, {file: routeData.file});
                                    } else {
                                        return res.data;
                                    }
                                });
                            }, function () {
                                return null; // TODO display error message
                            });

                        } else {
                            if (routeData) {
                                $state.go(routeData.prevState, {file: routeData.file});
                            } else {
                                return null;
                            }
                        }
                    });


                }
            }
        });
});

angular.module('cnedApp').run(function (gettextCatalog) {

    gettextCatalog.currentLanguage = 'fr_FR';
    localStorage.setItem('langueDefault', JSON.stringify({
        name: 'FRANCAIS',
        shade: 'fr_FR'
    }));
    gettextCatalog.debug = true;
});

//Secure the links
angular.module('cnedApp').config(['$compileProvider',

    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
    }
]);


angular.module('cnedApp').run(function ($rootScope, $location, $http, dropbox, configuration, $timeout, $window, storageService, $interval, serviceCheck, $localForage) {
    //Delay between every check of session.
    $rootScope.sessionTime = 43200000;
    $rootScope.checkIsOnline = function () {
        return serviceCheck.isOnline().then(function () {
            //Useful test for the need for the preservation of the disconnected mode, once we have entered this mode.
            if ($rootScope.isAppOnline !== false) {
                $rootScope.isAppOnline = true;
            }
        }, function () {
            if ($rootScope.isAppOnline === true) {
                //For the need for the preservation of the offline mode, from the first time the user switches to offline mode
                localStorage.setItem('wasOffline', true);
                //We warn the user that he passed in offline mode.
            }
            $rootScope.isAppOnline = false;
        });
    };

    //environment variable for testing.
    if (!testEnv) {
        $rootScope.checkIsOnline().then(function () {
            //
        });
        $interval($rootScope.checkIsOnline, 5000);
    } else {
        $rootScope.isAppOnline = true;
    }

    if (typeof io !== 'undefined') {
        $rootScope.socket = io.connect('https://localhost:3000', {secure: true});
    }


});
