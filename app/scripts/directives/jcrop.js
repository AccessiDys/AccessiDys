cnedApp.directive('imgCropped', function($rootScope) {
  return {
    restrict: 'ECA',
    replace: true,
    require: '?ngModel',
    scope: {
      src: '@',
      selected: '&'
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

      $rootScope.$on('releaseCrop', function() {
        myImg.data("Jcrop").release();
      });

      $rootScope.$on('distroyJcrop', function() {
        if(myImg) {
          myImg.data("Jcrop").destroy();
        }
      });
    }
  };
});