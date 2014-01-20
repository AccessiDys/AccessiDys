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
    .when('/ttsTest', {
    templateUrl: 'views/ttsTest/ttsTest.html',
    controller: 'TtsTestCtrl'
  })
    .otherwise({
    redirectTo: '/'
  });
});

// include underscore
cnedApp.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// Define a simple audio service 
// cnedApp.factory('audio', function($document) {
//   var audioElement = $document[0].createElement('audio'); // <-- Magic trick here
//   return {
//     audioElement: audioElement,

//     play: function(filename) {
//       audioElement.src = filename;
//       audioElement.play(); //  <-- Thats all you need
//     }
//     // Exersise for the reader - extend this service to include other functions
//     // like pausing, etc, etc.

//   }
// });

// cnedApp.factory('sharedInfos', function() {
//   return {
//     text: ''
//   };
// });

// cnedApp.controller('ManageOrderCtrl', function($scope, sharedInfos) {
//   $scope.searchFromService = sharedInfos;
// });