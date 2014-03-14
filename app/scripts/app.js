'use strict';

var cnedApp = angular.module('cnedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'gettext',
  'ui.bootstrap',
  'services.config'
]);

cnedApp.config(function($routeProvider, $sceDelegateProvider, $httpProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    '**'
  ]);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $routeProvider.when('/', {
    templateUrl: 'http://localhost:3000/views/index/main.html',
    controller: 'MainCtrl'
  })
    .when('/workspace', {
      templateUrl: 'http://localhost:3000/views/workspace/images.html',
      controller: 'ImagesCtrl'
    })
    .when('/apercu', {
      templateUrl: 'http://localhost:3000/views/workspace/apercu.html',
      controller: 'ApercuCtrl'
    })
    .when('/profiles', {
      templateUrl: 'http://localhost:3000/views/profiles/profiles.html',
      controller: 'ProfilesCtrl'
    })
    .when('/tag', {
      templateUrl: 'http://localhost:3000/views/tag/tag.html',
      controller: 'TagCtrl'
    })
    .when('/ttsTest', {
      templateUrl: 'http://localhost:3000/views/ttsTest/ttsTest.html',
      controller: 'TtsTestCtrl'
    })
    .when('/userAccount', {
      templateUrl: 'http://localhost:3000/views/userAccount/userAccount.html',
      controller: 'UserAccountCtrl'
    })
    .when('/adminPanel', {
      templateUrl: 'http://localhost:3000/views/adminPanel/adminPanel.html',
      controller: 'AdminPanelCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
angular.module('cnedApp').run(function(gettextCatalog) {
  gettextCatalog.currentLanguage = 'fr_FR';
  gettextCatalog.debug = true;
});