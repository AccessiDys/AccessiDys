'use strict';

describe('Controller: CommonCtrl', function() {

  // load the controller's module
  beforeEach(module('cnedApp'));

  var MainCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('CommonCtrl', {
      $scope: scope
    });
  }));

  it('CommonCtrl : Detecter actuel route', function() {
    scope.isActive('/profiles/');
    
  });
});