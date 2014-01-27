cnedApp.directive('regleStyle', [ '$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    replace: true,
    require: '?ngModel',
    scope: {
      interligneList: '@'
    },
    link: function(scope, elem, attrs) {      

      $rootScope.$on('reglesStyleChange', function(nv, params) {
       
        console.log('the params ==> ');
        console.log(params);
        
        $('.shown-text').css('line-height', params.value + 'px');
      });
    }
  };
}]);