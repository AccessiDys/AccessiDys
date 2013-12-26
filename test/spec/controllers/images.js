'use strict';

describe('Controller:ImagesCtrl', function() {
  beforeEach(module('cnedApp'));
  var scope, controller;

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    controller = $controller('ImagesCtrl', {
      $scope: scope
    });
    $httpBackend.whenPOST(/oceriser/, {
      sourceImage: './image.png'
    })
      .respond(angular.toJson('text oceriser'));

  }));

  it("oceriser le texte d'une image", inject(function($httpBackend) {
    scope.oceriser('./image.png');
    $httpBackend.flush();
    console.log(scope.textes);
    expect(scope.textes).toBeDefined();
    expect(scope.textes.text).toBe('text oceriser');
    expect(scope.textes.source).toBe('./image.png');

  }));

  it("initialisation des variable pour l'espace de travail", inject(function() {

    var image = {
      'source': './image.png',
      'level': 0
    };

    scope.workspace(image);
    expect(scope.currentImage.source).toBe('./image.png');
    expect(scope.currentImage.level).toBe(0);
    expect(scope.textes).toEqual({});
    expect(scope.showEditor).not.toBeTruthy();
  }));



});