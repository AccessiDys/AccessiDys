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
    templateUrl: '<%= URL_REQUEST %>/views/index/main.html',
    controller: 'MainCtrl'
  })
    .when('/workspace', {
      templateUrl: '<%= URL_REQUEST %>/views/workspace/images.html',
      controller: 'ImagesCtrl'
    })
    .when('/apercu', {
      templateUrl: '<%= URL_REQUEST %>/views/workspace/apercu.html',
      controller: 'ApercuCtrl'
    })
    .when('/profiles', {
      templateUrl: '<%= URL_REQUEST %>/views/profiles/profiles.html',
      controller: 'ProfilesCtrl'
    })
    .when('/tag', {
      templateUrl: '<%= URL_REQUEST %>/views/tag/tag.html',
      controller: 'TagCtrl'
    })
    .when('/ttsTest', {
      templateUrl: '<%= URL_REQUEST %>/views/ttsTest/ttsTest.html',
      controller: 'TtsTestCtrl'
    })
    .when('/userAccount', {
      templateUrl: '<%= URL_REQUEST %>/views/userAccount/userAccount.html',
      controller: 'UserAccountCtrl'
    })
    .when('/inscriptionContinue', {
      templateUrl: 'https://localhost:3000/views/index/inscriptionContinue.html',
      controller: 'passportContinueCtrl'
    })
    .when('/adminPanel', {
      templateUrl: '<%= URL_REQUEST %>/views/adminPanel/adminPanel.html',
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
angular.module('cnedApp').run(function($rootScope, $location, $http) {
  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    $http.get('https://localhost:3000/profile')
      .success(function(data, status) {
        $rootScope.loged = true;
        if (data.dropbox) {
          $rootScope.dropboxWarning = true;
        } else {
          $rootScope.dropboxWarning = false;
        };
      })
      .error(function() {
        $rootScope.loged = false;
        $rootScope.dropboxWarning = true;
      });
  });
});