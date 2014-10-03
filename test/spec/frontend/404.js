'use strict';

describe('Controller: notFoundCtrl', function() {

  // load the controller's module
  beforeEach(module('cnedApp'));

  var notFoundCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, configuration) {
    scope = $rootScope.$new();
    notFoundCtrl = $controller('notFoundCtrl', {
      $scope: scope
    });

  }));

  it('should inisialise img url', function() {
    
  });
});