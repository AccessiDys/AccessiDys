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
    'ngRoute',
    'gettext',
    'ui.bootstrap',
    'angular-md5',
    'services.config',
    'ngAudio',
    'LocalForageModule',
    'angular-google-analytics'
]);

cnedApp.config(function ($routeProvider, $sceDelegateProvider, $httpProvider, AnalyticsProvider, $logProvider, configuration) {

    // Log enable / disable
    $logProvider.debugEnabled((configuration.ENV === 'dev'));

    // Google analytics account settings
    AnalyticsProvider.setAccount(configuration.GOOGLE_ANALYTICS_ID);
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.trackUrlParams(true);

    // HttpProvider settings
    $sceDelegateProvider.resourceUrlWhitelist([
        '**'
    ]);
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('app.httpinterceptor');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider.when('/', {
        templateUrl: 'views/index/main.html',
        controller: 'MainCtrl'
    })
        .when('/apercu', {
            templateUrl: 'views/workspace/apercu.html',
            controller: 'ApercuCtrl',
            pageTrack: '/overview.html'  // angular-google-analytics extension
        })
        .when('/addDocument', {
            templateUrl: 'views/addDocument/addDocument.html',
            controller: 'AddDocumentCtrl',
            pageTrack: '/document/edit.html'  // angular-google-analytics extension
        })
        .when('/print', {
            templateUrl: 'views/workspace/print.html',
            controller: 'PrintCtrl',
            pageTrack: '/print.html'  // angular-google-analytics extension
        })
        .when('/profiles', {
            templateUrl: 'views/profiles/profiles.html',
            controller: 'ProfilesCtrl',
            pageTrack: '/profile/list.html'  // angular-google-analytics extension
        })
        .when('/tag', {
            templateUrl: 'views/tag/tag.html',
            controller: 'TagCtrl',
            pageTrack: '/style/list.html'  // angular-google-analytics extension
        })
        .when('/userAccount', {
            templateUrl: 'views/userAccount/userAccount.html',
            controller: 'UserAccountCtrl',
            doNotTrack: true       // angular-google-analytics extension
        })
        .when('/inscriptionContinue', {
            templateUrl: 'views/passport/inscriptionContinue.html',
            controller: 'passportContinueCtrl'
        })
        .when('/adminPanel', {
            templateUrl: 'views/adminPanel/adminPanel.html',
            controller: 'AdminPanelCtrl',
            pageTrack: '/admin/users.html'  // angular-google-analytics extension
        })
        .when('/listDocument', {
            templateUrl: 'views/listDocument/listDocument.html',
            controller: 'listDocumentCtrl',
            pageTrack: '/document/list.html'  // angular-google-analytics extension
        })
        .when('/passwordHelp', {
            templateUrl: 'views/passwordRestore/passwordRestore.html',
            controller: 'passwordRestoreCtrl',
            doNotTrack: true       // angular-google-analytics extension
        })
        .when('/detailProfil', {
            templateUrl: 'views/profiles/detailProfil.html',
            controller: 'ProfilesCtrl',
            pageTrack: '/profile/detail.html'  // angular-google-analytics extension
        })
        .when('/404', {
            templateUrl: 'views/404/404.html',
            controller: 'notFoundCtrl',
            doNotTrack: true       // angular-google-analytics extension
        })
        .when('/needUpdate', {
            templateUrl: 'views/needUpdate/needUpdate.html',
            controller: 'needUpdateCtrl',
            pageTrack: '/admin/app-update.html'  // angular-google-analytics extension
        })
        .when('/mentions', {
            templateUrl: 'views/infoPages/mentions.html',
            controller: 'infoPagesCtrl',
            pageTrack: '/legal-notice.html'  // angular-google-analytics extension
        })
        .when('/a-propos', {
            templateUrl: 'views/infoPages/about.html',
            controller: 'infoPagesCtrl',
            pageTrack: '/presentation.html'  // angular-google-analytics extension
        })
        .when('/contribuer', {
            templateUrl: 'views/infoPages/contribute.html',
            controller: 'infoPagesCtrl',
            pageTrack: '/contribute.html'  // angular-google-analytics extension
        })
        .otherwise({
            redirectTo: '/404'
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


angular.module('cnedApp').run(function ($rootScope, $location, $http, dropbox, configuration, $timeout, $window, storageService, $interval, serviceCheck, $localForage, $routeParams) {
    /*global $:false */
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
            if ($rootScope.isAppOnline === true) {
                //performing the check of the session.
                $rootScope.sessionPool = $interval(serviceCheck.getData, $rootScope.sessionTime);
                var url = $routeParams.url;
                //If he was offline, as he is now online, bring it to authenticate
                if ((!url || url.indexOf('dropboxusercontent') <= -1) && localStorage.getItem('wasOffline') === 'true') {

                    localStorage.removeItem('wasOffline');
                    $rootScope.loged = false;
                    $routeParams.deconnexion = 'true';
                    $location.path('/').search($routeParams);
                }
            }
        });
        //$interval($rootScope.checkIsOnline, 5000); TODO réactiver
    } else {
        $rootScope.isAppOnline = true;
    }

    /* Initialization of the Lock treatment of documents on DropBox */
    localStorage.setItem('lockOperationDropBox', false);

    if (typeof io !== 'undefined') {
        $rootScope.socket = io.connect('https://localhost:3000', {secure: true});
    }
    if ($rootScope.socket) {
        $rootScope.socket.on('news', function () {
            $rootScope.socket.emit('my other event', {
                my: 'data ehhoooo'
            });
        });
    }

    $rootScope.goHome = function () {
        $location.path('/');
    };
    $rootScope.backToHome = function () {
        if ($location.absUrl().indexOf('/listDocument') > 0) {
            window.location.reload();
        } else {
            window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
        }
    };

    $rootScope.isLoginScreen = false;

    $rootScope.$on('$routeChangeStart', function (event, next) {

        var data = {
            id: false
        };

        if (next.templateUrl && next.templateUrl === 'views/index/main.html'
            || next.templateUrl === 'views/passport/inscriptionContinue.html'
            || next.templateUrl === 'views/passwordRestore/passwordRestore.html'
            || next.templateUrl === 'views/common/errorPage.html'
            || next.templateUrl === 'views/needUpdate/needUpdate.html'
            || next.templateUrl === 'views/signup/signup.html') {

            $rootScope.isLoginScreen = true;
        } else {
            $rootScope.isLoginScreen = false;

        }

        if (window.location.href.indexOf('key=') > -1) {
            var callbackKey = window.location.href.substring(window.location.href.indexOf('key=') + 4, window.location.href.length);
            var tmp = [{
                name: 'compteId',
                value: callbackKey
            }, {
                name: 'listDocLink',
                value: '#/listDocument'
            }, {
                name: 'lockOperationDropBox',
                value: false
            }];
            storageService.writeService(tmp, 0).then(function () {
                data = {
                    id: callbackKey
                };
                $rootScope.listDocumentDropBox = localStorage.getItem('listDocLink');
            });
        }
    });
});
