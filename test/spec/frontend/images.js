/* File: images.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

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
  // Retour service download pdf
  var base64 = pdfdata;


  beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration) {
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

    scope.pdflinkTaped = 'http://info.sio2.be/tdtooo/sostdt.pdf';

    //scope.pdflinkTaped = 'http://info.sio2.be/tdtooo/sostdt.pdf';


    /*mock OCR web service*/
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/oceriser/', {
      sourceImage: './files/image.png'
    }).respond(angular.toJson('text oceriser'));

    /*mock redTags web service*/
    $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags').respond(tags);

    /*mock listerProfil web service*/
    $httpBackend.whenGET(configuration.URL_REQUEST + '/listerProfil').respond(profils);

    /*mock Crop Images web service*/
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/images').respond(angular.toJson('./files/img_cropped.png'));

    /*mock webservice de la synthese vocale*/
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/texttospeech').respond(angular.toJson('./files/audio/mp3/audio.mp3'));

    /*mock webservice enregistrement des blocks structurés*/
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajouterDocStructure').respond(angular.toJson('52e24471be3a449a2988a0e9'));

    /*mock */
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/pdfimage').respond(angular.toJson({
      path: './files/image.png',
      extension: '.png'
    }));

    $httpBackend.whenPOST(configuration.URL_REQUEST + '/sendPdf').respond(base64);

    $httpBackend.whenPOST(configuration.URL_REQUEST + '/sendPdfHTTPS').respond(base64);

  }));

  /*it('ImagesCtrl: oceriser le texte d\'une image', inject(function($httpBackend) {
    scope.oceriser();
    $httpBackend.flush();
    expect(scope.textes).toBeDefined();
    expect(scope.currentImage.text).toBe('text oceriser');
    expect(scope.currentImage.source).toBe('./files/image.png');
  }));*/

  it('ImagesCtrl: initialisation des variable pour l\'espace de travail', inject(function() {

    var image = {
      'source': './files/image.png',
      'level': 0
    };

    scope.workspace(image);
    expect(scope.currentImage.originalSource).toBe('./files/image.png');
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
    // expect($rootScope.idDocument).toEqual('52e24471be3a449a2988a0e9');
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
  it('ImagesCtrl: loadPdfLink pass le lien du fichier pdf au serveur pour le telecharger et le recupere', inject(function($httpBackend) {
    var data = {
      lien: 'http://info.sio2.be/tdtooo/sostdt.pdf'
    };
    $httpBackend.flush();
    scope.loadPdfLink();
    expect(scope.pdflink).toBe('http://info.sio2.be/tdtooo/sostdt.pdf');
    expect(scope.pdferrLien).toEqual(false);
    expect(data.lien).toEqual(scope.pdflink);
    expect(scope.pdfinfo).toEqual(true);
    expect(scope.showPdfCanvas).toEqual(true);
    
    expect(scope.showPdfCanvas).toEqual(true);
    //expect(scope.flagUint8Array).toEqual(true);
  }));

  it('ImagesCtrl: cverifie le lien si il est valide', inject(function() {
    var lien = 'http://localhost:3000/#/';
    var tmp = scope.verifLink(lien);
    expect(tmp).toEqual(false);
    lien = 'http://info.sio2.be/tdtooo/sostdt.pdf';
    tmp = scope.verifLink(lien);
    expect(tmp).toEqual(true);
  }));
});