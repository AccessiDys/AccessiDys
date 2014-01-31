/*global cnedApp */
'use strict';

cnedApp.directive('bindHtmlUnsafe', function($compile) {
    return function($scope, $element, $attrs) {

        var compile = function(newHTML) {
            newHTML = $compile(newHTML)($scope);
            $element.html().append(newHTML);
        };

        var htmlName = $attrs.bindHtmlUnsafe;

        $scope.$watch(htmlName, function(newHTML) {
            // the HTML
            if (!newHTML) return;
            compile(newHTML); // Compile
        });

    };
});