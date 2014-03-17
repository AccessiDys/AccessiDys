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

describe('Controller: passportCtrl', function() {
  var $scope, controller;

  beforeEach(module('cnedApp'));

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    $scope = $rootScope.$new();
    controller = $controller('passportCtrl', {
      $scope: $scope
    });

    $scope.user = {
      'email': 'teste@gmail.com',
      'password': 'azzdderr',
      'nom': 'test',
      'prenom': 'test',
      'data': {
        'local': 'admin'
      }
    };

    $httpBackend.whenPOST('/signup').respond($scope.user);
    $httpBackend.whenPOST('/login').respond($scope.user);
  }));

  it('passportCtrl:signin should add a user Ok', inject(function($httpBackend) {
    $scope.emailSign = null;
    expect($scope.signin).toBeDefined();
    $scope.signin();
    expect($scope.erreurSigninEmail).toBe(true);
    $scope.emailSign = 'test@test.com';
    $scope.passwordSign = 'azzdderr';
    $scope.passwordConfirmationSign = 'azzdderr';
    $scope.nomSign = 'test';
    $scope.prenomSign = 'test';
    $scope.signin();
    $httpBackend.flush();
    //expect($scope.singinFlag).toEqual($scope.user);
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
    expect($scope.loginFlag).toEqual($scope.user);
  }));
});