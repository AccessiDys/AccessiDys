'use strict';

var cnedApp = angular.module('cnedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute', ]);

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
    .when('/treeView', {
    templateUrl: 'views/workspace/treeView.html',
    controller: 'TreeViewCtrl'
  })
    .when('/profiles', {
    templateUrl: 'views/profiles/profiles.html',
    controller: 'ProfilesCtrl'
  })
    .when('/tags', {
    templateUrl: 'views/tags/tags.html',
    controller: 'TagsCtrl'
  })
    .otherwise({
    redirectTo: '/'
  });
});

// cnedApp.factory('sharedInfos', function() {
//   return {
//     text: ''
//   };
// });

// cnedApp.controller('ManageOrderCtrl', function($scope, sharedInfos) {
//   $scope.searchFromService = sharedInfos;
// });