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
      _id: '5329acd20c5ebdb429b2ec66',
      dropbox: {
        accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
        country: 'MA',
        display_name: 'youbi anas', // jshint ignore:line
        emails: 'anasyoubi@gmail.com',
        referral_link: 'https://db.tt/wW61wr2c', // jshint ignore:line
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
    $scope.languages = [{
      name: 'FRANCAIS',
      shade: 'fr_FR'
    }, {
      name: 'ANGLAIS',
      shade: 'en_US'
    }];

    $scope.profilsParUsers = {
      owner: '53301d8b5836a5be73dc5d50',
      nom: 'maslouhy2',
      descriptif: 'sefeqsfv',
      photo: '/9j/4AAQSkZJR',
      _id: '53301fbfadb072be27f48106',
      __v: 0
    };

    $scope.currentUserData = {
      owner: '53301d8b5836a5be73dc5d50',
      nom: 'maslouhy2',
      descriptif: 'sefeqsfv',
      photo: '/9j/4AAQSkZJR',
      _id: '53301fbfadb072be27f48106',
      __v: 0
    };

    $httpBackend.whenGET('/profile').respond($scope.dataRecu);
    $httpBackend.whenGET(configuration.URL_REQUEST +'/readTags').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/profilParUser').respond($scope.profilsParUsers);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajouterUserProfil').respond($scope.profilsParUsers);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond($scope.profilsParUsers);
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
    $scope.afficherProfilsParUser();
    $httpBackend.flush();
    expect($scope.listeProfilsParUser).toEqual($scope.profilsParUsers);
  }));

  it('CommonCtrl : initCommon ', inject(function() {
    $scope.initCommon();
  }));

  it('CommonCtrl : changeProfilActuel ', inject(function($httpBackend) {
    $scope.profilActuel ='{"libelle":"nom","_id":"53301fbfadb072be27f48106","__v":0}';
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
    expect(localStorage.getItem('profilActuel')).toEqual($scope.profilActuel);


  }));


});