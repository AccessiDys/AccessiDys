/*global jasmine, spyOn */
'use strict';

describe('Controller:ImagesCtrl', function() {
  beforeEach(module('cnedApp'));
  var scope, controller;

  /*Tags de test*/
  var tags = [{
    _id: '52c588a861485ed41c000001',
    libelle: 'Exercice'
  }, {
    _id: '52c588a861485ed41c000002',
    libelle: 'Cours'
  }];

  /*Profils de test*/
  var profils = [{
    nom: 'profil 1',
    descriptif: 'desc profil 1',
    type: 'Dyslexie N1',
    niveauScolaire: 'CP',
    photo: '',
    _id: '52d1429458e68dbb0c000004'
  }];

  /*Zones de test*/
  var zones = [{
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    source: './files/image.png'
  }];

  // Sources des fichiers uploadés
  var srcs = [{
    path: './files/image.png',
    extension: '.png'
  }, {
    path: './files/multipages.pdf',
    extension: '.pdf'
  }];


  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    controller = $controller('ImagesCtrl', {
      $scope: scope
    });

    scope.currentImage = {
      source: './files/image.png',
      level: 0,
      text: 'test',
      synthese: './files/audio/mp3/audio.mp3',
      children: []
    };

    scope.blocks = {
      children: []
    };

    /*mock OCR web service*/
    $httpBackend.whenPOST(/oceriser/, {
      sourceImage: './files/image.png'
    }).respond(angular.toJson('text oceriser'));

    /*mock redTags web service*/
    $httpBackend.whenGET('/readTags').respond(tags);

    /*mock listerProfil web service*/
    $httpBackend.whenGET('/listerProfil').respond(profils);

    /*mock Crop Images web service*/
    $httpBackend.whenPOST('/images').respond(angular.toJson('./files/img_cropped.png'));

    /*mock webservice de la synthese vocale*/
    $httpBackend.whenPOST('/texttospeech').respond(angular.toJson('./files/audio/mp3/audio.mp3'));

    /*mock webservice enregistrement des blocks structurés*/
    $httpBackend.whenPOST('/ajouterDocStructure').respond(angular.toJson('52e24471be3a449a2988a0e9'));

    /*mock */
    $httpBackend.whenPOST('/pdfimage').respond(angular.toJson({
      path: './files/image.png',
      extension: '.png'
    }));

  }));

  it('ImagesCtrl: oceriser le texte d\'une image', inject(function($httpBackend) {
    scope.oceriser();
    $httpBackend.flush();
    expect(scope.textes).toBeDefined();
    expect(scope.currentImage.text).toBe('text oceriser');
    expect(scope.currentImage.source).toBe('./files/image.png');

  }));

  it('ImagesCtrl: initialisation des variable pour l\'espace de travail', inject(function() {

    var image = {
      'source': './files/image.png',
      'level': 0
    };

    scope.workspace(image);
    expect(scope.currentImage.source).toBe('./files/image.png');
    expect(scope.textes).toEqual({});
    expect(scope.showEditor).not.toBeTruthy();
  }));

  it('ImagesCtrl: selection d\'une zone', inject(function() {
    scope.selected(zones[0]);
  }));

  it('ImagesCtrl: supression d\'une zone', inject(function() {
    scope.removeZone(zones[0]);
  }));

  it('ImagesCtrl: test de l\'upload de Fichiers', function() {
    scope.xhrObj = jasmine.createSpyObj('xhrObj', ['addEventListener', 'open', 'send']);
    spyOn(window, 'XMLHttpRequest').andReturn(scope.xhrObj);
    scope.files.length = 1;
    scope.uploadFile();
    expect(scope.xhrObj.addEventListener).toHaveBeenCalled();
    expect(scope.xhrObj.addEventListener.calls.length).toBe(2);
  });

  it('ImagesCtrl: Selection de la liste des tags', inject(function($httpBackend) {
    scope.afficherTags();
    $httpBackend.flush();
    expect(scope.listTags.length).toBe(2);
    expect(scope.listTags).toEqual(tags);
  }));

  it('ImagesCtrl: découpage des images', inject(function($httpBackend) {
    scope.affectSrcValue(srcs);
    scope.zones = zones;
    scope.sendCrop('./files/image.png');
    $httpBackend.flush();
    expect(scope.cropedImages.length).toBe(1);
    expect(scope.blocks.children.length).toBe(2);
  }));

  it('ImagesCtrl: initialiser la source aprés upload', inject(function() {
    scope.affectSrcValue(srcs);
  }));

  it('ImagesCtrl: enlever un block de l\'espace de travail', inject(function() {
    scope.remove(scope.currentImage);
  }));

  it('ImagesCtrl: Appeler mdification du texte', inject(function() {
    scope.modifierTexte();
  }));

  it('ImagesCtrl: Avoir le texte du WYSIWYG', inject(function($rootScope) {
    $rootScope.ckEditorValue = '<p>text oceriser</p>';
    scope.getOcrText();
  }));

  it('ImagesCtrl: Generation de la synthese vocale', inject(function($httpBackend) {
    scope.textToSpeech();
    $httpBackend.flush();
    expect(scope.currentImage.synthese).toEqual('./files/audio/mp3/audio.mp3');
  }));

  it('ImagesCtrl: Activation de l\'enregistrement des blocks', inject(function() {
    scope.permitSaveblocks();
  }));

  it('ImagesCtrl: Ajout des blocks structurés', inject(function($httpBackend, $rootScope) {
    scope.saveblocks();
    $httpBackend.flush();
    expect(scope.listProfils).toEqual(profils);
    expect($rootScope.idDocument).toEqual('52e24471be3a449a2988a0e9');
  }));

  it('ImagesCtrl: Redirection automatique vers l\'aperçu', inject(function($rootScope) {
    $rootScope.idDocument = '52e24471be3a449a2988a0e9';
    scope.showlocks();
  }));

  it('ImagesCtrl: Modification du type du document', inject(function() {
    scope.tagSelected = tags[1];
    scope.blocks.children[0] = scope.currentImage;
    scope.updateBlockType();
    expect(scope.blocks.children[0].tag).toEqual(tags[1]);
  }));

  it('ImagesCtrl: Afficher le bouton prévisualisation synthese vocale', inject(function() {
    scope.showPlaySong();
  }));

  /*it('ImagesCtrl: Convertion de PDF en Images', inject(function($httpBackend) {

  }));*/

});