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
/* global io  */

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
    'slick',
    'textAngular',
    'sticky',
    'angular-cookie-law',
    'ui.tree'
]);

cnedApp.config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $sceProvider,
                         $httpProvider, AnalyticsProvider, $logProvider,
                         configuration) {

    // Log enable / disable
    $logProvider.debugEnabled(true);

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
                tags: function (tagsService) {
                    return tagsService.getTags();
                },
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
            url: '/apercu?idDocument&tmp&url&title&annotation',
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
            url: '/detailProfil?url&idProfil',
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

        .state('app.faq', {
            url: '/faq',
            templateUrl: 'views/infoPages/faq.html',
            pageTrack: '/faq.html'  // angular-google-analytics extension
        })

        .state('app.404', {
            url: '/404',
            templateUrl: 'views/404/404.html'
        })

        .state('app.my-backup', {
            url: '/ma-sauvegarde.html?auth&logout',
            templateUrl: 'views/backup/my-backup.html',
            controller: 'MyBackupCtrl',
            pageTrack: '/ma-sauvegarde.html',  // angular-google-analytics extension,
            params: {
                prevState: null,
                file: null
            },
            resolve: {
                auth: function ($state, $stateParams, UserService, OauthService, $log, CacheProvider, fileStorageService, $q, $rootScope) {

                    return CacheProvider.getItem('myBackupRouteData').then(function (routeData) {

                        CacheProvider.setItem(null, 'myBackupRouteData');
                        if ($stateParams.auth) {


                            return OauthService.token().then(function (res) {
                                return UserService.saveData(res.data).then(function () {

                                    UserService.init().then(function (userData) {
                                        $rootScope.userData = userData;

                                        fileStorageService.synchronizeFiles().then(function (res) {
                                            if (res && res.profilesCount > 0) {
                                                $rootScope.initCommon();
                                            }
                                        });

                                    });

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

angular.module('cnedApp').config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', 'taSelection', 'taBrowserTag', 'taTranslations',
        'taToolFunctions', '$delegate', '$window', 'UtilsService',
        function (taRegisterTool, taSelection, taBrowserTag, taTranslations,
                  taToolFunctions, taOptions, $window, UtilsService) {

            var blockJavascript = function (link) {
                if (link.toLowerCase().indexOf('javascript') !== -1) {
                    return true;
                }
                return false;
            };

            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('pageBreak', {
                buttontext: 'Saut de page',
                action: function () {
                    this.$editor().wrapSelection('insertHtml', '<br/><hr><br/>');
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('pageBreak');


            taRegisterTool('uploadImage', {
                iconclass: 'fa fa-picture-o',
                tooltiptext: 'Insérer une image',
                onElementSelect: {
                    element: 'img',
                    action: taToolFunctions.imgOnSelectAction
                },
                action: function () {
                    var $editor = this.$editor;

                    // Create a virtual input element.
                    var input = document.createElement('input');
                    input.type = 'file';
                    input.accept = "image/*";

                    input.onchange = function () {
                        var reader = new FileReader();

                        console.log('this.files', this.files);

                        if (this.files && this.files[0]) {
                            reader.onload = function (e) {
                                $editor().wrapSelection('insertHtml', '<img src=' + e.target.result + '>', true);
                            };

                            reader.readAsDataURL(this.files[0]);
                        }
                    };

                    // Click on a virtual input element.
                    input.click();
                }
            });

            taOptions.toolbar[1].push('uploadImage');

            taTranslations.insertLink.dialogPrompt = 'Veuillez insérer votre url';
            taTranslations.insertLink.tooltip = 'Insérer / éditer un lien';
            taTranslations.editLink.unLinkButton.tooltip = 'Supprimer le lien';
            taTranslations.editLink.reLinkButton.tooltip = 'Editer';
            taTranslations.editLink.targetToggle.buttontext = 'Ouvrir dans une nouvelle fenêtre';

            taRegisterTool('insertLinkCustom', {
                tooltiptext: taTranslations.insertLink.tooltip,
                iconclass: 'fa fa-link',
                action: function () {
                    var urlLink;
                    // if this link has already been set, we need to just edit the existing link
                    /* istanbul ignore if: we do not test this */
                    if (taSelection.getSelectionElement().tagName && taSelection.getSelectionElement().tagName.toLowerCase() === 'a') {
                        urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, taSelection.getSelectionElement().href);
                    } else {
                        urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, 'http://');
                    }
                    if (urlLink && urlLink !== '' && urlLink !== 'http://' && urlLink !== 'https://') {
                        // block javascript here
                        /* istanbul ignore else: if it's javascript don't worry - though probably should show some kind of error message */
                        if (!blockJavascript(urlLink)) {
                            return this.$editor().wrapSelection('createLink', urlLink, true);
                        }
                    }
                },
                activeState: function (commonElement) {
                    if (commonElement) return commonElement[0].tagName === 'A';
                    return false;
                },
                onElementSelect: {
                    element: 'a',
                    action: taToolFunctions.aOnSelectAction
                }
            });

            taOptions.toolbar[1].push('insertLinkCustom');


            return taOptions;
        }]);
});


angular.module('cnedApp').run(function ($rootScope, configuration, $timeout, $interval, serviceCheck) {
    //Delay between every check of session.
    $rootScope.sessionTime = 43200000;
    $rootScope.checkIsOnline = function () {
        return serviceCheck.isOnline().then(function () {
            //Useful test for the need for the preservation of the disconnected mode, once we have entered this mode.
            if (!$rootScope.isAppOnline) {
                $rootScope.isAppOnline = true;
            }

        }, function () {
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
