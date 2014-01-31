/*global cnedApp */
'use strict';

cnedApp.directive('keyTrap', function() {
  return function(scope, elem) {
    elem.bind('keydown', function(event) {
      scope.$broadcast('keydown', event.keyCode);
    });
  };
});