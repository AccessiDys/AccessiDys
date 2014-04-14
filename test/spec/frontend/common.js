/* File: common.js
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

describe('Controller: CommonCtrl', function() {

  // load the controller's module
  beforeEach(module('cnedApp'));

  var MainCtrl,
    $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, gettextCatalog, $httpBackend, configuration) {
    $scope = $rootScope.$new();
    MainCtrl = $controller('CommonCtrl', {
      $scope: $scope
    });
    $scope.dataRecu = {
      __v: 0,
      _id: "5347c304a7338a14500e3068",
      dropbox: {
        accessToken: "wyoEkXeYTqwAAAAAAAAAQ3S0cHhOjNeUGun3-YrW1w3qAzuuVofDEHx-S3TqhASp",
        country: "MA",
        display_name: "youbi anas",
        emails: "anasyoubi@gmail.com",
        referral_link: "https://db.tt/t85GO47x",
        uid: "264998156"
      },
      local: {
        email: "anasyoubi@gmail.com",
        nom: "youbi",
        password: "$2a$08$H9.mjNkGgxLL1pSwdK/cCePuF1l2J2Ai0sCFc9Vc37.Pqp4Bdx2P.",
        prenom: "anas",
        restoreSecret: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs",
        role: "user",
        secretTime: "201431340",
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec",
        tokenTime: 1397469765520
      },
      loged : true
    };
    $scope.languages = [{
      name: 'FRANCAIS',
      shade: 'fr_FR'
    }, {
      name: 'ANGLAIS',
      shade: 'en_US'
    }];

    $scope.profilsParUsers = {
      owner: '53301d8b5836a5be73dc5d50',
      nom: 'test',
      descriptif: 'sefeqsfv',
      photo: '/9j/4AAQSkZJR',
      _id: '53301fbfadb072be27f48106',
      __v: 0
    };

    $scope.currentUserData = {
      owner: '53301d8b5836a5be73dc5d50',
      nom: 'test',
      descriptif: 'sefeqsfv',
      photo: '/9j/4AAQSkZJR',
      _id: '53301fbfadb072be27f48106',
      __v: 0
    };
    localStorage.setItem('compteId', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec');

    $rootScope.currentUser = {
      _id: '53301fbfadb072be27f48106'
    };

    $scope.shareLink = {
      'url': 'https://www.dropbox.com/s/ee44iev4pgw0avb/test.html',
      'expires': 'Tue, 01 Jan 2030 00:00:00 +0000'
    };

    $scope.listeProfilsParUser = [{
      owner: '53301d8b5836a5be73dc5d50',
      nom: 'test',
      descriptif: 'sefeqsfv',
      photo: '/9j/4AAQSkZJR',
      _id: '53301fbfadb072be27f48106',
      __v: 0
    }];

    $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + $scope.dataRecu.local.token).respond($scope.dataRecu);
    $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/profilParUser').respond($scope.profilsParUsers);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajouterUserProfil').respond($scope.profilsParUsers);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond($scope.profilsParUsers);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfil').respond($scope.user);

    $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $scope.dataRecu.dropbox.accessToken + '&path=' + configuration.CATALOGUE_NAME + '&root=sandbox&short_url=false').respond($scope.shareLink);

  }));

  it('CommonCtrl : Detecter actuel route', function() {
    $scope.isActive('/profiles/');
  });

  it('CommonCtrl : Show Menu', function() {
    $scope.showMenuParam = false;
    $scope.showMenu();
  });

  it('CommonCtrl : changerLangue ', function() {
    $scope.changerLangue();
  });

  it('CommonCtrl : afficherProfilsParUser ', inject(function($httpBackend) {

    //$scope.listeProfilsParUser[0] = $scope.profilsParUsers;
    $scope.afficherProfilsParUser();
    $httpBackend.flush();
    expect($scope.listeProfilsParUser).toEqual($scope.profilsParUsers);
  }));

  it('CommonCtrl : initCommon ', inject(function($httpBackend) {
    $scope.initCommon();
    $httpBackend.flush();
    expect($scope.dataRecu.loged).toBeTruthy();

  }));

  it('CommonCtrl : changeProfilActuel ', inject(function($httpBackend) {
    $scope.profilActuel = '{"libelle":"nom","_id":"53301fbfadb072be27f48106","__v":0}';
    $scope.profilUser = {
      profilID: '53301fbfadb072be27f48106',
      userID: '53301d8b5836a5be73dc5d50'
    };

    expect($scope.profilUser.profilID).toEqual(JSON.parse($scope.profilActuel)._id);
    $scope.changeProfilActuel();
    $httpBackend.flush();
    expect($scope.userProfilFlag).toEqual($scope.profilsParUsers);
    expect($scope.listTags).toEqual($scope.dataRecu);
    expect($scope.listTagsByProfil).toEqual($scope.profilsParUsers);
    expect(localStorage.getItem('listTagsByProfil')).toEqual(JSON.stringify($scope.profilsParUsers));
    expect(localStorage.getItem('listTags')).toEqual(JSON.stringify($scope.dataRecu));


  }));

  it('CommonCtrl:showLastDocument()', function() {
    localStorage.setItem('lastDocument', 'https://dl.dropboxusercontent.com/s/2d3jrrtc7e0l4hp/dsdhjssq.html#/apercu');
    $scope.showLastDocument();
  });

  it('CommonCtrl:currentUserFunction()', inject(function($httpBackend) {
    $scope.currentUserFunction();
    expect($scope.setDropDownActuel).toEqual($scope.user);
    $httpBackend.flush();


  }));


});