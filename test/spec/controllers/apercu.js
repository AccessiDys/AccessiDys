'use strict';

describe('Controller:ApercuCtrl', function() {
  beforeEach(module('cnedApp'));
  var scope, controller;

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    controller = $controller('ApercuCtrl', {
      $scope: scope
    });

    $rootScope.idDocument = ["52cb095fa8551d800b000012"];

    // var responseString = '{"titre": "","text": "","image": "","_id": "52cb58487b0e99880d000004","__v": 0,';
    // responseString += '"children": [{"titre": "fils 1","text": "","source": "files/decoup.thumb_0.9390108054503798.png","children": [],';
    // responseString += '"image": "","_id": "52cb58487b0e99880d000005"}, {"titre": "fils 2","text": "",';
    // responseString += '"source": "files/decoup.thumb_0.6781442742794752.png","children": [],"image": "","_id": "52cb58487b0e99880d000006"}]}';
    // console.log(responseString);

    // Mocker le service de selection des documents
    $httpBackend.whenPOST(/getDocument/, {
      sourceImage: $rootScope.idDocument[0]
    })
      .respond(angular.toJson('{"titre": "","text": "","image": "","_id": "52cb58487b0e99880d000004","__v": 0,"children": [{"titre": "fils 1","text": "","source": "files/decoup.thumb_0.9390108054503798.png","children": [],"image": "","_id": "52cb58487b0e99880d000005"}, {"titre": "fils 2","text": "","source": "files/decoup.thumb_0.6781442742794752.png","children": [],"image": "","_id": "52cb58487b0e99880d000006"}]}'));

  }));

  it("initialisation des blocks", inject(function($httpBackend, $rootScope) {
    $httpBackend.flush();
    console.log('1');
    console.log($rootScope.idDocument);
    // scope.init($rootScope.idDocument);

    console.log('2 ==> ');
    console.log(scope.blocks);
    expect(scope.blocks).toBeDefined();
    expect(scope.blocks.length).toBe(1);

  }));

});