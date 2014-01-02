'use strict';

var cnedApp = angular.module('cnedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap']);

cnedApp.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/index/main.html',
    controller: 'MainCtrl'
  })
    .when('/client', {
    templateUrl: 'views/clients/client.html',
    controller: 'ClientCtrl'
  })
    .when('/create', {
    templateUrl: 'views/clients/create.html',
    controller: 'CreateCtrl'
  })
    .when('/workspace', {
    templateUrl: 'views/workspace/images.html',
    controller: 'ImagesCtrl'
  })
    .when('/apercu', {
    templateUrl: 'views/workspace/apercu.html',
    controller: 'ApercuCtrl'
  })
    .when('/profiles', {
    templateUrl: 'views/profiles/profiles.html',
    controller: 'ProfilesCtrl'
  })
    .when('/tag', {
    templateUrl: 'views/tag/tag.html',
    controller: 'TagCtrl'
  })
    .otherwise({
    redirectTo: '/'
  });
});

// include underscore
cnedApp.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// cnedApp.factory('sharedInfos', function() {
//   return {
//     text: ''
//   };
// });

// cnedApp.controller('ManageOrderCtrl', function($scope, sharedInfos) {
//   $scope.searchFromService = sharedInfos;
// });