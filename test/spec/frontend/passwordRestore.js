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

describe('Controller: passwordRestoreCtrl', function() {

  // load the controller's module
  beforeEach(module('cnedApp'));

  var MainCtrl,
    $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, configuration, $httpBackend,$location) {
    $scope = $rootScope.$new();
    MainCtrl = $controller('passwordRestoreCtrl', {
      $scope: $scope
    });
    $location.path('https://localhost:3000/#/passwordHelp?secret=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ6cmh2a2o0aSJ9.yd1RV2i7353bpExmWZ_HqD8iRDDftA-WAogh_FPxWvE');
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
      },
      loged: true
    };

    $httpBackend.whenPOST(configuration.URL_REQUEST + '/saveNewPassword').respond($scope.dataRecu);

  }));

  it('passwordRestoreCtrl :init', function() {
    $scope.init();
    expect($scope.flagInit).toEqual(true);
  });


  it('restorePassword :init', inject(function($httpBackend) {
    $scope.restorePassword();
    expect($scope.failRestore).toEqual(true);
    $scope.password = 'azerty';
    $scope.passwordConfirmation = 'azerty';

    $scope.restorePassword();
    $httpBackend.flush();
    expect($scope.flagRestoreSucces).toEqual(true);
  }));

  it('restorePassword: verifyPassword', inject(function() {
    expect($scope.verifyPassword).toBeDefined();
    var tmp = $scope.verifyPassword('aaaa');
    expect(tmp).toBe(false);
    tmp = $scope.verifyPassword('aaa567a');
    expect(tmp).toBe(true);
  }));
  
});