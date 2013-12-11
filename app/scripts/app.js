'use strict';

angular.module('cnedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'])
  .config(function($routeProvider) {
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
})
  .directive('imgCropped', function($rootScope) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      src: '@',
      selected: '&',
      ngModel: '=ngModel' // set up bi-directional binding between a local scope property and the parent scope property
    },
    link: function(scope, element, attr) {
      var myImg;
      var clear = function() {
        if (myImg) {
          myImg.next().remove();
          myImg.remove();
          myImg = undefined;
        }
      };
      var release = function() {
        if (myImg) {
          console.log("release done ");
          $(myImg).Jcrop().release();
        }
      };
      scope.$watch('src', function(nv) {
        clear();
        if (nv) {
          element.after('<img />');
          myImg = element.next();
          myImg.attr('src', nv);
          $(myImg).Jcrop({
            trackDocument: true,
            onSelect: function(x) {
              scope.$apply(function() {
                scope.selected({
                  cords: x
                });
              });
            }
          });
        }
      });

      scope.$on('$destroy', clear);
      // scope.$on('$release', release);
      $rootScope.$on('releaseCrop', function() {
        console.log('released ... ');
        release;
      });
    }
  };
});;