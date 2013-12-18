'use strict';

describe('Controller:ImagesCtrl', function() {
  beforeEach(module('cnedApp'));
    var $scope, controller;

  beforeEach(inject(function ($controller,$rootScope) {
    $scope = $rootScope.$new();
    controller = $controller('ImagesCtrl', {
      $scope: $scope
    });
  }));

  /* Test wheter selected() method is well defined or not*/
  it('should set sendCrop function', function() {
    expect($scope.selected).toBeDefined();
  });

  /*Test wheter /images POST responds or not*/
  it('should call /images on $scope.sendCrop()', inject(function($httpBackend) {
    $scope.sendCrop();

    $httpBackend.expectPOST('/images').respond();
  }));  

  /*Test if loader is false*/
  it('test add cropped image', function() {
     expect($scope.loader).toBe(false);
  });

  /*Test wheter /images POST responds or not*/
   it('should call /oceriser on $scope.oceriser()', inject(function($httpBackend) {
    $scope.oceriser();

    $httpBackend.expectPOST('/oceriser').respond();
  }));  


});




