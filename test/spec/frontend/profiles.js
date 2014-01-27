'use strict';

describe('Controller:ProfilesCtrl', function() {
  var $scope, controller;
  var profils = [{
    _id: '52d8f876548367ee2d000004',
    photo: './files/profilImage.jpg',
    descriptif: 'descriptif',
    niveauScolaire: 'CP',
    type: 'Dyslexie N1',
    nom: 'Nom'
  }, {
    _id: '52d8f928548367ee2d000006',
    photo: './files/profilImage.jpg',
    descriptif: 'descriptif2',
    niveauScolaire: 'CM2',
    type: 'Dyslexie N2',
    nom: 'Nom2'
  }];

  var tags = [{
    _id: '52c6cde4f6f46c5a5a000004',
    libelle: 'Exercice'
  }, {
    _id: '52c588a861485ed41c000002',
    libelle: 'Cours'
  }];

  var profil = {
    _id: '52d8f928548367ee2d000006',
    photo: './files/profilImage.jpg',
    descriptif: 'descriptif3',
    niveauScolaire: 'CM2',
    type: 'Dyslexie N2',
    nom: 'Nom3'
  };

  var profilTag = {
    _id: '52d8f928548367ee2d000006',
    tag: 'tag',
    texte: 'texte',
    profil: 'profil',
    tagName: 'tagName',
    police: 'Arial',
    taille: 'eight',
    interligne: 'fourteen',
    styleValue: 'Bold'
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
    $httpBackend.whenPOST('/ajouterProfilTag').respond(profilTag);
    $httpBackend.whenPOST('/supprimerProfilTag').respond(profilTag);

    $scope.tagStyles = [{
      tag: '52c6cde4f6f46c5a5a000004',
      interligne: 'ten',
      label: 'titre',
      police: 'Arial',
      style: '',
      styleValue: 'Bold',
      taille: 'twelve',
      state: true

    }, {
      tag: '52c6cde4f6f46c5a5a000008',
      interligne: 'ten',
      label: 'titre',
      police: 'Arial',
      style: '',
      styleValue: 'Bold',
      taille: 'twelve',
      state: true
    }];

    $scope.listTags = [{
      _id: '52c6cde4f6f46c5a5a000004',
      libelle: 'Exercice',
      disabled: true
    }, {
      _id: '52c6cde4f6f46c5a5a000006',
      libelle: 'Exercice',
      disabled: false
    }];

    $scope.tagList = [{
      _id: '52c6cde4f6f46c5a5a000004',
      libelle: 'Exercice',
      disabled: true
    }, {
      _id: '52c6cde4f6f46c5a5a000006',
      libelle: 'Exercice',
    }];

    $scope.currentTagEdit = $scope.listTags;
    $scope.currentTag = $scope.tagList;
    $scope.parameter = {
      tag: '52c6cde4f6f46c5a5a000008',
      interligne: 'ten',
      label: 'titre',
      police: 'Arial',
      style: '',
      styleValue: 'Bold',
      taille: 'twelve'
    };

  }));

  /* Defined Arrays*/
  it('ProfilesCtrl:Arrays should be defined', inject(function() {
    expect($scope.tailleLists).toBeDefined();
    expect($scope.interligneLists).toBeDefined();
  }));

  /* ProfilesCtrl afficherProfilsClear*/
  it('ProfilesCtrl:afficherProfilsClear should set afficherProfilsClear ', inject(function() {
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
  it('ProfilesCtrl:isTagStylesNotEmpty should set isTagStylesNotEmpty ', inject(function() {
    expect($scope.isTagStylesNotEmpty).toBeDefined();
    $scope.isTagStylesNotEmpty();
    expect($scope.tagStyles.length).toBe(2);
  }));



  /* ProfilesCtrl:listerProfil */

  it('ProfilesCtrl:afficherProfils should set afficherProfils ', inject(function() {
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

  it('ProfilesCtrl:ajouterProfil should set ajouterProfil ', inject(function() {
    expect($scope.ajouterProfil).toBeDefined();
  }));
  it('ProfilesCtrl:ajouterProfil should set photo property', inject(function() {
    expect($scope.profil.photo).toBe('./files/profilImage.jpg');
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

  it('ProfilesCtrl:supprimerProfil should set supprimerProfil ', inject(function() {
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

  it('ProfilesCtrl:preModifierProfil should set preModifierProfil ', inject(function($httpBackend) {

    $scope.preModifierProfil(profil);
    $scope.modifierProfil();
    $httpBackend.flush();
    expect($scope.tagStylesFlag).toEqual(tags);
  }));

  it('ProfilesCtrl:modifierProfil should set modifierProfil ', inject(function($httpBackend) {
    $scope.modifierProfil();
    expect($scope.modifierProfil).toBeDefined();
    $httpBackend.flush();
    expect($scope.profilFlag).toEqual(profil);
  }));

  /* ProfilesCtrl:afficherTags() */

  it('ProfilesCtrl:afficherTags should set afficherTags ', inject(function() {
    expect($scope.afficherTags).toBeDefined();
  }));

  it('ProfilesCtrl:afficherTags should call /readTags on $scope.afficherTags()', inject(function($httpBackend) {
    $scope.afficherTags();
    $httpBackend.flush();
  }));

  it('ProfilesCtrl:afficherTags should listTags be tags', inject(function($httpBackend) {

    $scope.afficherTags();
    $httpBackend.flush();
    expect($scope.listTags.length).toBe(2);
    expect($scope.tagStyles[0].tag).toBe($scope.listTags[0]._id);
    expect($scope.listTags[0].disabled).toBeTruthy();

  }));

  /* ProfilesCtrl:ajouterProfilTag() */

  it('ProfilesCtrl:ajouterProfilTag should set ajouterProfilTag ', inject(function($httpBackend) {
    expect($scope.ajouterProfilTag).toBeDefined();
    $scope.ajouterProfilTag(profil._id);
    $httpBackend.flush();
    expect($scope.profilTagFlag).toEqual(profilTag);

  }));

  /* ProfilesCtrl:affectDisabled() */

  it('ProfilesCtrl:affectDisabled should set affectDisabled ', inject(function() {
    expect($scope.affectDisabled).toBeDefined();
    $scope.affectDisabled(true);
    expect($scope.affectDisabled).toBeTruthy();

  }));

  /* ProfilesCtrl:validerStyleTag() */

  it('ProfilesCtrl:validerStyleTag should set validerStyleTag ', inject(function() {
    expect($scope.validerStyleTag).toBeDefined();
    expect($scope.listTags[0].disabled).toBeTruthy();
    expect($scope.tagStyles.length).not.toBe(0);
  }));

  it('ProfilesCtrl:editionAddProfilTag should set editionAddProfilTag ', inject(function($httpBackend) {
    expect($scope.editionAddProfilTag).toBeDefined();
    $scope.editionAddProfilTag();
    $httpBackend.flush();
    expect($scope.editionFlag).toBe(profilTag);

  }));

  it('ProfilesCtrl:editerStyleTag should set editerStyleTag ', inject(function() {
    expect($scope.editerStyleTag).toBeDefined();
    expect($scope.listTags[0].disabled).toBeTruthy();
    expect($scope.tagStyles.length).not.toBe(0);
  }));

  it('ProfilesCtrl:ajoutSupprimerTag should set ajoutSupprimerTag ', inject(function() {
    expect($scope.ajoutSupprimerTag).toBeDefined();
    $scope.ajoutSupprimerTag($scope.parameter);
    expect($scope.tagStyles.indexOf($scope.parameter)).toBe(-1);
    expect($scope.tagStyles.length).toBe(2);
    expect($scope.listTags[1].disabled).toBeFalsy();


  }));

  it('ProfilesCtrl:editionSupprimerTag should set editionSupprimerTag ', inject(function($httpBackend) {
    expect($scope.editionSupprimerTag).toBeDefined();
    $scope.editionSupprimerTag($scope.parameter);
    expect($scope.tagStyles.indexOf($scope.parameter)).toBe(-1);
    expect($scope.tagStyles.length).toBe(2);
    expect($scope.listTags[1].disabled).toBeFalsy();
    $httpBackend.flush();
    expect($scope.editionSupprimerTagFlag).toEqual(profilTag);

  }));

});