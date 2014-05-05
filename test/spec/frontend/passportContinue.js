/* File: passport.js
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



'use strict';

describe('Controller: passportContinueCtrl', function() {
  var $scope, controller;

  beforeEach(module('cnedApp'));

  beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration) {
    $scope = $rootScope.$new();
    controller = $controller('passportContinueCtrl', {
      $scope: $scope
    });


    $scope.dataRecu = {
      loged: true,
      dropboxWarning: true,
      user: {
        __v: 0,
        _id: '5329acd20c5ebdb429b2ec66',
        dropbox: {
          accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
          country: 'MA',
          display_name: 'youbi anas',
          emails: 'anasyoubi@gmail.com',
          referral_link: 'https://db.tt/wW61wr2c',
          uid: '264998156'
        },
        local: {
          email: 'anasyoubi@gmail.com',
          nom: 'youbi',
          password: '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
          prenom: 'anas',
          role: 'admin',
          restoreSecret: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs",
          secretTime: "201431340",
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec",
          tokenTime: 1397469765520
        }
      },
      __v: 0,
      _id: '5329acd20c5ebdb429b2ec66',
      dropbox: {
        accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
        country: 'MA',
        display_name: 'youbi anas',
        emails: 'anasyoubi@gmail.com',
        referral_link: 'https://db.tt/wW61wr2c',
        uid: '264998156'
      },
      local: {
        email: 'anasyoubi@gmail.com',
        nom: 'youbi',
        password: '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
        prenom: 'anas',
        role: 'admin',
        restoreSecret: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs",
        secretTime: "201431340",
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec",
        tokenTime: 1397469765520
      }
    };
    localStorage.setItem('compteId', $scope.dataRecu.local.token);
    $rootScope.currentUser = $scope.dataRecu;
    $scope.dropboxHtmlSearch = [{
      'revision': 919,
      'rev': '39721729c92',
      'thumb_exists': false,
      'bytes': 121273,
      'modified': 'Tue, 01 Apr 2014 08:47:13 +0000',
      'client_mtime': 'Tue, 01 Apr 2014 08:47:13 +0000',
      'path': '/manifestPresent.html',
      'is_dir': false,
      'icon': 'page_white_code',
      'root': 'dropbox',
      'mime_type': 'text/html',
      'size': '118.4 KB'
    }, {
      'revision': 924,
      'rev': '39c21729c92',
      'thumb_exists': false,
      'bytes': 17344,
      'modified': 'Tue, 01 Apr 2014 08:52:08 +0000',
      'client_mtime': 'Tue, 01 Apr 2014 08:52:09 +0000',
      'path': '/test.html',
      'is_dir': false,
      'icon': 'page_white_code',
      'root': 'dropbox',
      'mime_type': 'text/html',
      'size': '16.9 KB'
    }];

    $scope.shareLink = {
      'url': 'https://www.dropbox.com/s/ee44iev4pgw0avb/test.html',
      'expires': 'Tue, 01 Jan 2030 00:00:00 +0000'
    };

    var profil = [{
      _id: '52d8f928548367ee2d000006',
      photo: './files/profilImage.jpg',
      descriptif: 'descriptif3',
      nom: 'Nom3',
      profilID: '5329acd20c5ebdb429b2ec66'
    }];

    $scope.indexPage = '<html class="no-js" lang="fr" manifest=""> <!--<![endif]--><head></head><body></body></html>';

    $scope.appcache = 'CACHE MANIFEST # 2010-06-18:v2 # Explicitly cached \'master entries\'. CACHE: https://dl.dropboxusercontent.com/s/ee44iev4pgw0avb/test.html # Resources that require the user to be online. NETWORK: * ';

    $scope.tagProfil = [{
      tag: '53359e9c153022351017d757',
      texte: '<p data-font=\'Arial\' data-size=\'12\' data-lineheight=\'22\' data-weight=\'Bold\' data-coloration=\'Surligner les mots\'> </p>',
      profil: '53359f97153022351017d758',
      tagName: 'azerty',
      police: 'Arial',
      taille: '12',
      interligne: '22',
      styleValue: 'Bold',
      coloration: 'Surligner les mots',
      _id: '53359f97153022351017d75a',
      __v: 0
    }, {
      tag: '53359e5a153022351017d756',
      texte: '<p data-font=\'Arial\' data-size=\'16\' data-lineheight=\'22\' data-weight=\'Bold\' data-coloration=\'Colorer les mots\'> </p>',
      profil: '53359f97153022351017d758',
      tagName: 'uyuy',
      police: 'Arial',
      taille: '16',
      interligne: '22',
      styleValue: 'Bold',
      coloration: 'Colorer les mots',
      _id: '53398a0d439bd8702158db6f',
      __v: 0
    }];
    $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + $scope.dataRecu.local.token).respond($scope.dataRecu);
    $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.html&root=sandbox').respond($scope.dropboxHtmlSearch);
    $httpBackend.whenGET(configuration.URL_REQUEST + '/listDocument.appcache').respond($scope.appcache);
    $httpBackend.whenGET(configuration.URL_REQUEST + '/index.html').respond($scope.indexPage);
    $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
    $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=listDocument.appcache&root=sandbox&short_url=false').respond($scope.shareLink);
    $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + configuration.CATALOGUE_NAME + '?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
    $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + configuration.CATALOGUE_NAME + '&root=sandbox&short_url=false').respond($scope.shareLink);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilsParDefaut').respond(profil);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajouterUserProfil').respond(profil);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfil').respond(profil);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond($scope.tagProfil);



  }));

  it('passportContinueCtrl:init ', inject(function($httpBackend) {
    $scope.init();
    expect($scope.inscriptionStep1).toBe(false);
    expect($scope.inscriptionStep2).toBe(true);
    expect($scope.inscriptionStep3).toBe(false);
    expect($scope.showStep2part2).toBe(false);
    $httpBackend.flush();
  }));
  it('passportContinueCtrl:toStep3 ', inject(function() {
    $scope.toStep3();
    expect($scope.showlogin).toBe(false);
    expect($scope.inscriptionStep1).toBe(false);
    expect($scope.inscriptionStep2).toBe(false);
    expect($scope.inscriptionStep3).toBe(true);
  }));
  it('passportContinueCtrl:toStep4 ', inject(function($rootScope, $httpBackend) {
    $rootScope.listDocumentDropBox = 'listDocument';
    $scope.toStep4();
    $httpBackend.flush();

    expect($scope.showlogin).toBe(false);
    expect($scope.inscriptionStep1).toBe(false);
    expect($scope.inscriptionStep2).toBe(false);
    expect($scope.inscriptionStep3).toBe(false);
    expect($scope.inscriptionStep4).toBe(true);
  }));
});