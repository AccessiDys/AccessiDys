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

/*global $:false */

'use strict';

describe('Controller: passportCtrl', function() {
  var $scope, controller;

  beforeEach(module('cnedApp'));

  beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration) {
    $scope = $rootScope.$new();
    controller = $controller('passportCtrl', {
      $scope: $scope
    });
    $scope.user = {
      'email': 'anasyoubi2@gmail.com',
      'password': 'aaaaaa',
      'nom': 'test',
      'prenom': 'test',
      'data': {
        'local': 'admin'
      }
    };
    $scope.dataRecu = {
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
        role: 'admin'
      }
    };

    $rootScope.currentUser = {
      _id: '5329acd20c5ebdb429b2ec66'
    };

    $scope.profileID = {
      profilID: '5329acd20c5ebdb429b2ec66'
    }

    $scope.tagProfil = [{
      tag: "53359e9c153022351017d757",
      texte: "<p data-font=\"Arial\" data-size=\"12\" data-lineheight=\"22\" data-weight=\"Bold\" data-coloration=\"Surligner les mots\"> </p>",
      profil: "53359f97153022351017d758",
      tagName: "azerty",
      police: "Arial",
      taille: "12",
      interligne: "22",
      styleValue: "Bold",
      coloration: "Surligner les mots",
      _id: "53359f97153022351017d75a",
      __v: 0
    }, {
      tag: "53359e5a153022351017d756",
      texte: "<p data-font=\"Arial\" data-size=\"16\" data-lineheight=\"22\" data-weight=\"Bold\" data-coloration=\"Colorer les mots\"> </p>",
      profil: "53359f97153022351017d758",
      tagName: "uyuy",
      police: "Arial",
      taille: "16",
      interligne: "22",
      styleValue: "Bold",
      coloration: "Colorer les mots",
      _id: "53398a0d439bd8702158db6f",
      __v: 0
    }];

    $scope.dropboxHtmlSearch = [{
      "revision": 919,
      "rev": "39721729c92",
      "thumb_exists": false,
      "bytes": 121273,
      "modified": "Tue, 01 Apr 2014 08:47:13 +0000",
      "client_mtime": "Tue, 01 Apr 2014 08:47:13 +0000",
      "path": "/manifestPresent.html",
      "is_dir": false,
      "icon": "page_white_code",
      "root": "dropbox",
      "mime_type": "text/html",
      "size": "118.4 KB"
    }, {
      "revision": 924,
      "rev": "39c21729c92",
      "thumb_exists": false,
      "bytes": 17344,
      "modified": "Tue, 01 Apr 2014 08:52:08 +0000",
      "client_mtime": "Tue, 01 Apr 2014 08:52:09 +0000",
      "path": "/test.html",
      "is_dir": false,
      "icon": "page_white_code",
      "root": "dropbox",
      "mime_type": "text/html",
      "size": "16.9 KB"
    }];

    $scope.dropboxHtmlSearchTest = [{
      "revision": 924,
      "rev": "39c21729c92",
      "thumb_exists": false,
      "bytes": 17344,
      "modified": "Tue, 01 Apr 2014 08:52:08 +0000",
      "client_mtime": "Tue, 01 Apr 2014 08:52:09 +0000",
      "path": "/test.html",
      "is_dir": false,
      "icon": "page_white_code",
      "root": "dropbox",
      "mime_type": "text/html",
      "size": "16.9 KB"
    }];

    $scope.shareLink = {
      "url": "https://www.dropbox.com/s/ee44iev4pgw0avb/test.html",
      "expires": "Tue, 01 Jan 2030 00:00:00 +0000"
    };

    $scope.loginFlag = $scope.dataRecu;

    $scope.dropboxHtmlSearchCache = [{
      "revision": 924,
      "rev": "39c21729c92",
      "thumb_exists": false,
      "bytes": 17344,
      "modified": "Tue, 01 Apr 2014 08:52:08 +0000",
      "client_mtime": "Tue, 01 Apr 2014 08:52:09 +0000",
      "path": "/test.html",
      "is_dir": false,
      "icon": "page_white_code",
      "root": "dropbox",
      "mime_type": "text/html",
      "size": "16.9 KB"
    }];

    $httpBackend.whenPOST(configuration.URL_REQUEST + '/signup').respond($scope.user);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/login').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilParDefaut').respond($scope.user);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfil').respond($scope.user);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajoutDefaultProfil').respond($scope.user);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/addUserProfil').respond($scope.user);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilsTagParProfil').respond($scope.tagProfil);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/saveProfilTag').respond($scope.userList);
    $httpBackend.whenGET(configuration.URL_REQUEST + '/profile').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/profile').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond($scope.tagProfil);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/addUserProfil').respond($scope.user);
    $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.html&root=sandbox').respond($scope.dropboxHtmlSearch);
    $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=test.html&root=sandbox').respond($scope.dropboxHtmlSearchTest);
    $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=listDocument.appcache&root=sandbox').respond($scope.dropboxHtmlSearchCache);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond();
    $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $scope.dataRecu.dropbox.accessToken + '&path=' + configuration.CATALOGUE_NAME + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond($scope.shareLink);
  }));

  it('passportCtrl:signin should add a user Ok', inject(function($httpBackend) {
    var respTag = {
      tag: '53359e9c153022351017d757',
      texte: '<p data-font="Arial" data-size="12" data-lineheight="22" data-weight="Bold" data-coloration="Surligner les mots"> </p>',
      profil: undefined,
      tagName: 'azerty',
      police: 'Arial',
      taille: '12',
      interligne: '22',
      styleValue: 'Bold',
      coloration: 'Surligner les mots',
      _id: null,
      __v: 0
    };
    $scope.obj.emailSign = '';
    $scope.obj.passwordSign = '';
    $scope.obj.nomSign = '';
    $scope.obj.prenomSign = '';

    expect($scope.signin).toBeDefined();
    $('<div class="modal fade in" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>').appendTo('body');
    $scope.signin();
    expect($scope.erreur.erreurSigninNom).toBe(true);
    expect($scope.erreur.erreurSigninPrenom).toBe(true);
    expect($scope.erreur.erreurSigninPasse).toBe(true);
    expect($scope.erreur.erreurSigninEmail).toBe(true);
    expect($scope.erreur.erreurSigninNomMessage).toBe('Nom : Cette donnée est obligatoire. Merci de compléter le champ.');
    expect($scope.erreur.erreurSigninPrenomMessage).toBe('Prénom : Cette donnée est obligatoire. Merci de compléter le champ.');
    expect($scope.erreur.erreurSigninEmailMessage).toBe('Email : Cette donnée est obligatoire. Merci de compléter le champ.');
    $scope.obj.emailSign = 'test@test.com';
    $scope.obj.passwordSign = 'azzdderr';
    $scope.obj.passwordConfirmationSign = 'azzdderr';
    $scope.obj.nomSign = 'test';
    $scope.obj.prenomSign = 'test';
    $scope.signin();
    $httpBackend.flush();

    expect($scope.singinFlag).toEqual($scope.user);
    expect($scope.chercherProfilParDefautFlag).toEqual($scope.user);
    expect($scope.chercherProfilFlag).toEqual($scope.user);
    expect($scope.ajoutDefaultProfilFlag).toEqual($scope.user);
    expect($scope.ajoutUserProfilFlag).toEqual($scope.user);
    expect($scope.ajoutUserProfilFlag).toEqual($scope.user);
    expect($scope.chercherProfilsTagParProfilFlag[0]).toEqual(respTag);
    expect($scope.user).not.toBe(null);
    expect($scope.saveProfilTagFlag).toEqual($scope.userList);
  }));

  it('passportCtrl:login should return a user Ok', inject(function($httpBackend) {
    $scope.emailLogin = null;
    expect($scope.login).toBeDefined();
    $scope.login();
    expect($scope.erreurLogin).toBe(true);
    $scope.emailLogin = 'teste@gmail.com';
    $scope.passwordLogin = 'azzdderr';
    $scope.role = 'admin';
    $scope.login();
    $httpBackend.flush();
    expect($scope.loginFlag).toEqual($scope.dataRecu);
  }));

  it('passportCtrl: init', inject(function($httpBackend) {
    expect($scope.init).toBeDefined();
    $scope.init();
    $httpBackend.flush();
  }));

  it('passportCtrl: verifyEmail', inject(function() {
    expect($scope.verifyEmail).toBeDefined();
    var tmp = $scope.verifyEmail('aaaaaa');
    expect(tmp).toBe(false);
    tmp = $scope.verifyEmail('aaa@aaa.com');
    expect(tmp).toBe(true);
  }));

  it('passportCtrl: verifyString', inject(function() {
    expect($scope.verifyString).toBeDefined();
    var tmp = $scope.verifyString('a');
    expect(tmp).toBe(false);
    tmp = $scope.verifyString('aaaa');
    expect(tmp).toBe(true);
  }));

  it('passportCtrl: verifyPassword', inject(function() {
    expect($scope.verifyPassword).toBeDefined();
    var tmp = $scope.verifyPassword('aaaa');
    expect(tmp).toBe(false);
    tmp = $scope.verifyPassword('aaa567a');
    expect(tmp).toBe(true);
  }));

  it('passportCtrl: goNext', inject(function() {
    expect($scope.goNext).toBeDefined();
    $scope.goNext();
  }));

  it('passportCtrl: roleRedirect', inject(function() {
    expect($scope.roleRedirect).toBeDefined();
  }));

  it('passportCtrl: verifProfil', inject(function($httpBackend) {
    expect($scope.verifProfil).toBeDefined();
    localStorage.setItem('profilActuel', null);

    $scope.verifProfil();
    $httpBackend.flush();
    expect($scope.chercherProfilActuelFlag);
    expect($scope.chercherTagsParProfilFlag).toEqual($scope.tagProfil);

  }));
});