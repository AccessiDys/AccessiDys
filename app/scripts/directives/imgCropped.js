/*global cnedApp, $:false */
'use strict';

cnedApp.directive('imgCropped', [ '$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    replace: true,
    require: '?ngModel',
    scope: {
      src: '@',
      selected: '&'
    },
    link: function($scope, element) {
      var myImg;

      var clear = function() {
        if (myImg) {
          myImg.next().remove();
          myImg.remove();
          myImg = undefined;
        }
      };
      $scope.$watch('src', function(nv) {
        clear();
        if (nv) {
          element.after('<img />');
          myImg = element.next();
          myImg.attr('src', nv);
          $(myImg).Jcrop({
            trackDocument: true,
            // boxWidth: 791,
            onSelect: function(x) {
              $scope.$apply(function() {
                $scope.selected({
                  cords: x
                });
              });
            }
          });
        }
      });

      $scope.$on('$destroy', clear);

      $rootScope.$on('releaseCrop', function() {
        myImg.data('Jcrop').release();
      });

      $rootScope.$on('distroyJcrop', function() {
        if (myImg) {
          myImg.data('Jcrop').destroy();
        }
      });
    }
  };
}]);