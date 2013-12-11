'use strict';

var cnedApp = angular.module('cnedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute']);



cnedApp.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
    .when('/client', {
    templateUrl: 'views/client.html',
    controller: 'ClientCtrl'
  })
    .when('/create', {
    templateUrl: 'views/create.html',
    controller: 'CreateCtrl'
  })
    .when('/images', {
    templateUrl: 'views/images.html',
    controller: 'ImagesCtrl'
  })
    .otherwise({
    redirectTo: '/'
  });
});