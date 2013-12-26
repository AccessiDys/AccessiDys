'use strict';

describe('Controller:ImagesCtrl', function() {
  beforeEach(module('cnedApp'));
    var scope, controller;

  beforeEach(inject(function ($controller,$rootScope,$httpBackend) {
    scope = $rootScope.$new();
    controller = $controller('ImagesCtrl', {
      $scope: scope
    });
    $httpBackend.whenPOST(/oceriser/, {
      sourceImage: './image.png'
    })
    .respond(angular.toJson('text oceriser'));
    
  }));

  it('has to return text from image', inject(function($httpBackend) {

  scope.oceriser('./image.png');
  $httpBackend.flush();
  console.log(scope.textes);
  expect(scope.textes.text).toBe('text oceriser');
  expect(scope.textes.source).toBe('./image.png');

  }));

// it('has to return text from image', inject(function($httpBackend) {
//      var expected = {}; 
//      $httpBackend.expectPOST('/oceriser').respond(expected);
//      scope.oceriser('./anas.png');
//      $httpBackend.flush();
//      expect(scope.textes.source).toBe('./anas.png');
//      expect(scope.textes.text).toBe('salut anas');

// }));



});




