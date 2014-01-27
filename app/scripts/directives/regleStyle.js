cnedApp.directive('regleStyle', function($rootScope) {
  return {
    restrict: 'EA',
    replace: true,
    require: '?ngModel',
    scope: {
      interligneList: '=interligneList'
    },
    link: function(scope, elem, attrs) {

      scope.$watch(attrs['lineheight'], function() {
        console.log('watch selected ... ');
        console.log(attrs['lineheight']);
      });

      $rootScope.$on('reglesStyleChange', function(nv) {
        console.log('change style fired ... ');
        console.log(nv);
        console.log(attrs);
        console.log(attrs.lineheight);

        var lineheight = angular.copy(attrs.lineheight);
        console.log(lineheight);
        scope.$apply();
        $('.shown-text').css('line-height', lineheight + 'px');
        console.log(lineheight);
      });
    }
  };
});