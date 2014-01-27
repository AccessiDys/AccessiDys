cnedApp.directive('regleStyle', ['$rootScope',
  function($rootScope) {
    return {
      restrict: 'EA',
      replace: true,
      require: '?ngModel',
      scope: {
        interligneList: '@'
      },
      link: function() {

        $rootScope.$on('reglesStyleChange', function(nv, params) {

          switch (params.operation) {
            case 'interligne':
              $('.shown-text').css('line-height', params.value + 'px');
              break;
            case 'style':
              $('.shown-text').css('font-weight', params.value);
              break;
            case 'taille':
              $('.shown-text').css('font-size', params.value + 'px');
              break;
            case 'police':
              $('.shown-text').css('font-family', params.value);
              break;

          }
        });

      }
    };
  }
]);