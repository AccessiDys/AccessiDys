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