'use strict';

describe('Controller: needUpdateCtrl', function() {

  // load the controller's module
  beforeEach(module('cnedApp'));

  var needUpdateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, configuration) {
    scope = $rootScope.$new();
    needUpdateCtrl = $controller('needUpdateCtrl', {
      $scope: scope
    });

  }));

  it('should inisialise img url', function() {
    
  });
});