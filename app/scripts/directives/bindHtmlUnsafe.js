/*global cnedApp */
'use strict';

cnedApp.directive('bindHtmlUnsafe', ['$compile', '$rootScope', function($compile, $rootScope) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        priority: 10000,
        link: function(scope, element, attrs) {

            var compile = function(newHTML) {
                newHTML = $compile(newHTML)(scope);
                element.html('').append(newHTML);

                $rootScope.$emit('ElementHtmlAdded', element);
            };

            var htmlName = attrs.bindHtmlUnsafe;

            scope.$watch(htmlName, function(newHTML) {
                // the HTML
                if (!newHTML) return;
                compile(newHTML); // Compile
            });

        }
    };
}]);