'use strict';

describe('Controller:ProfilesCtrl', function() {
  var $scope, controller;
  var profils = [{
    _id: "52d8f876548367ee2d000004",
    photo: "./files/profilImage.jpg",
    descriptif: "descriptif",
    niveauScolaire: "CP",
    type: "Dyslexie N1",
    nom: "Nom"
  }, {
    _id: "52d8f928548367ee2d000006",
    photo: "./files/profilImage.jpg",
    descriptif: "descriptif2",
    niveauScolaire: "CM2",
    type: "Dyslexie N2",
    nom: "Nom2"
  }];
  var profil = {
    _id: "52d8f928548367ee2d000006",
    photo: "./files/profilImage.jpg",
    descriptif: "descriptif3",
    niveauScolaire: "CM2",
    type: "Dyslexie N2",
    nom: "Nom3"
  };

  beforeEach(module('cnedApp'));

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    $scope = $rootScope.$new();
    controller = $controller('ProfilesCtrl', {
      $scope: $scope
    });

    $httpBackend.whenGET('/listerProfil').respond(profils);

    $scope.profil = profil;
    $httpBackend.whenPOST('/ajouterProfils').respond(profil);

    $httpBackend.whenPOST('/deleteProfil').respond(profil);

    $httpBackend.whenPOST('/updateProfil').respond(profil);
  }));

  /* TailleLists*/
   it('ProfilesCtrl:TailleLists should be defined', inject(function() {
    expect($scope.tailleLists).toBeDefined();
  }));


  /* ProfilesCtrl:listerProfil */

  it('ProfilesCtrl:afficherProfils should set afficherProfils function', inject(function($httpBackend) {
    expect($scope.afficherProfils).toBeDefined();
  }));

  it('ProfilesCtrl:afficherProfils should call /listerProfil on $scope.afficherProfils()', inject(function($httpBackend) {
    $scope.afficherProfils();
    $httpBackend.flush();
  }));

  it('ProfilesCtrl:afficherProfils should listeProfils be profils', inject(function($httpBackend) {
    $scope.afficherProfils();
    $httpBackend.flush();
    expect($scope.listeProfils.length).toBe(2);
  }));

  /* ProfilesCtrl:ajouterTag */

  it('ProfilesCtrl:ajouterProfil should set ajouterProfil function', inject(function($httpBackend) {
    expect($scope.ajouterProfil).toBeDefined();
  }));
  it('ProfilesCtrl:ajouterProfil should set photo property', inject(function($httpBackend) {
    expect($scope.profil.photo).toBe("./files/profilImage.jpg");
  }));

  it('ProfilesCtrl:ajouterProfil should call /ajouterProfils on $scope.ajouterProfil()', inject(function($httpBackend) {
    $scope.ajouterProfil();
    $httpBackend.flush();
  }));

  it('ProfilesCtrl:ajouterProfil should profil be $scope.profilFlag', inject(function($httpBackend) {
    $scope.ajouterProfil();
    $httpBackend.flush();
    expect(profil).toEqual($scope.profilFlag);
  }));

  /* ProfilesCtrl:supprimerProfil */

  it('ProfilesCtrl:supprimerProfil should set supprimerProfil function', inject(function($httpBackend) {
    expect($scope.preSupprimerProfil).toBeDefined();
    expect($scope.supprimerProfil).toBeDefined();
  }));

  it('ProfilesCtrl:supprimerProfil should call /deleteProfil on $scope.supprimerProfil()', inject(function($httpBackend) {
    $scope.preSupprimerProfil(profil);
    $scope.supprimerProfil();
    $httpBackend.flush();
  }));

  it('ProfilesCtrl:supprimerProfil should profil be $scope.profilFlag', inject(function($httpBackend) {
    $scope.preSupprimerProfil(profil);
    $scope.supprimerProfil();
    $httpBackend.flush();
    expect($scope.profilFlag).toEqual(profil);
  }));

  /* ProfilesCtrl:preModifierProfil */

  it('ProfilesCtrl:preModifierProfil should set preModifierProfil function', inject(function($httpBackend) {
    expect($scope.preModifierProfil).toBeDefined();
    $scope.preModifierProfil(profil);
    expect($scope.tagStyles).toEqual([]);
  }));

  it('ProfilesCtrl:modifierProfil should set modifierProfil function', inject(function($httpBackend) {
    $scope.modifierProfil();
    expect($scope.modifierProfil).toBeDefined();
    $httpBackend.flush();
    expect($scope.profilFlag).toEqual(profil);
  }));







});