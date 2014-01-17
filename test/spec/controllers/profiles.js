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

  var tags = [{
    _id: "52c6cde4f6f46c5a5a000004",
    libelle: "Exercice"
  }, {
    _id: "52c588a861485ed41c000002",
    libelle: "Cours"
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
    $httpBackend.whenGET('/readTags').respond(tags);
    $httpBackend.whenPOST('/chercherTagsParProfil').respond(tags);
    $httpBackend.whenPOST('/ajouterProfilTag').respond(profil);


  }));

  /* Defined Arrays*/
   it('ProfilesCtrl:Arrays should be defined', inject(function() {
    expect($scope.tailleLists).toBeDefined();
    expect($scope.interligneLists).toBeDefined();
  }));

  /* ProfilesCtrl afficherProfilsClear*/
 it('ProfilesCtrl:afficherProfilsClear should set afficherProfilsClear function', inject(function($httpBackend) {
    expect($scope.afficherProfilsClear).toBeDefined();
  }));

  it('ProfilesCtrl:afficherProfilsClear should call /listerProfil on $scope.afficherProfilsClear()', inject(function($httpBackend) {
    $scope.afficherProfilsClear();
    $httpBackend.flush();
  }));

  it('ProfilesCtrl:afficherProfilsClear should listeProfils be profils', inject(function($httpBackend) {
    $scope.afficherProfilsClear();
    $httpBackend.flush();
    expect($scope.listeProfils.length).toBe(2);
    expect($scope.tagStyles).toEqual([]);
  }));

  /* ProfilesCtrl isTagStylesNotEmpty */
  it('ProfilesCtrl:isTagStylesNotEmpty should set isTagStylesNotEmpty function', inject(function($httpBackend) {
    expect($scope.isTagStylesNotEmpty).toBeDefined();
    $scope.isTagStylesNotEmpty();
    expect($scope.tagStyles.length).toBe(0);
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
    $scope.tagStyles = [{
    _id: "52c6cde4f6f46c5a5a000004",
    libelle: "Exercice"
  }, {
    _id: "52c588a861485ed41c000002",
    libelle: "Cours"
  }];

    expect($scope.preModifierProfil).toBeDefined();
    $scope.preModifierProfil(profil);
    expect($scope.tagStyles).toEqual(tags);
  }));

  it('ProfilesCtrl:modifierProfil should set modifierProfil function', inject(function($httpBackend) {
    $scope.modifierProfil();
    expect($scope.modifierProfil).toBeDefined();
    $httpBackend.flush();
    expect($scope.profilFlag).toEqual(profil);
  }));

  /* ProfilesCtrl:afficherTags() */

  it('ProfilesCtrl:afficherTags should set afficherTags function', inject(function($httpBackend) {
    expect($scope.afficherTags).toBeDefined();
  }));

  it('ProfilesCtrl:afficherTags should call /readTags on $scope.afficherTags()', inject(function($httpBackend) {
    $scope.afficherTags();
    $httpBackend.flush();
  }));

  it('ProfilesCtrl:afficherTags should listTags be tags', inject(function($httpBackend) {
    $scope.tagStyles = [{id_tag: "52c6cde4f6f46c5a5a000004"},{interligne: "ten"},{label: "titre"},{police:"Arial"},{style:""},{styleValue: "Bold"},{taille: "twelve"}];

    $scope.afficherTags();
    $httpBackend.flush();
    expect($scope.listTags.length).toBe(2);
    expect($scope.tagStyles[0].id_tag).toEqual($scope.listTags[0]._id);
  }));

/* ProfilesCtrl:ajouterProfilTag() */

  it('ProfilesCtrl:ajouterProfilTag should set ajouterProfilTag function', inject(function($httpBackend) {
    expect($scope.ajouterProfilTag).toBeDefined();
  }));
   it('ProfilesCtrl:ajouterProfilTag should call /ajouterProfilTag on $scope.ajouterProfilTag()', inject(function($httpBackend) {
    $scope.ajouterProfilTag();
    $httpBackend.flush();
  }));

  it('ProfilesCtrl:ajouterProfilTag', inject(function($httpBackend) {
    $scope.ajouterProfilTag();
    $httpBackend.flush();
  }));





 
});