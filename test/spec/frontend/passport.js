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
      'password': '$2a$08$L0TuSjeLdSsOLwKDaaNdduE0nYl88adHRJ0E0PopX1sAYDbqanGqy'
    };

    $httpBackend.whenPOST('/signup').respond($scope.user);
    $httpBackend.whenPOST('/login').respond($scope.user);



  }));

  it('passportCtrl:signin should add a user Ok', inject(function($httpBackend) {
    $scope.emailSign = null;
    expect($scope.signin).toBeDefined();
    $scope.signin();
    expect($scope.erreurSignin).toBe(true);
    $scope.emailSign = 'test@test.com';
    $scope.passwordSign = '$2a$08$L0TuSjeLdSsOLwKDaaNdduE0nYl88adHRJ0E0PopX1sAYDbqanGqy';
    $scope.passwordConfirmationSign = '$2a$08$L0TuSjeLdSsOLwKDaaNdduE0nYl88adHRJ0E0PopX1sAYDbqanGqy';
    $scope.nomSign = 'test';
    $scope.prenomSign = 'test';
    $scope.signin();
    $httpBackend.flush();
    expect($scope.singinFlag).toEqual($scope.user);
    expect($scope.step2).toBe('btn btn-primary btn-circle');
    expect($scope.step1).toBe('btn btn-default btn-circle');
    console.log('signin tested');
  }));
  it('passportCtrl:login should return a user Ok', inject(function($httpBackend) {
    $scope.emailLogin = null;
    expect($scope.login).toBeDefined();
    $scope.login();
    expect($scope.erreurLogin).toBe(true);
    $scope.emailLogin = 'teste@gmail.com';
    $scope.passwordLogin = '$2a$08$L0TuSjeLdSsOLwKDaaNdduE0nYl88adHRJ0E0PopX1sAYDbqanGqy';
    $scope.login();
    $httpBackend.flush();
    expect($scope.loginFlag).toEqual($scope.user);
    console.log('login tested');
  }));
  it('passportCtrl:goNext should balance from login to signup', inject(function() {
    expect($scope.goNext).toBeDefined();
    $scope.goNext();
    expect($scope.showlogin).toEqual(false);
    console.log('goNext tested');
  }));
  it('passportCtrl:toStep3 should balance from step2 to step3', inject(function() {
    expect($scope.toStep3).toBeDefined();
    $scope.toStep3();
    expect($scope.showlogin).toEqual(false);
    expect($scope.inscriptionStep1).toEqual(false);
    expect($scope.inscriptionStep2).toEqual(false);
    expect($scope.inscriptionStep3).toEqual(true);
    expect($scope.step2).toBe('btn btn-default btn-circle');
    expect($scope.step3).toEqual('btn btn-primary btn-circle');

    console.log('toStep3 tested');
  }));
  it('passportCtrl:toStep4 should balance from step3 to step4', inject(function() {
    expect($scope.toStep4).toBeDefined();
    $scope.toStep4();
    expect($scope.showlogin).toEqual(false);
    expect($scope.inscriptionStep1).toEqual(false);
    expect($scope.inscriptionStep2).toEqual(false);
    expect($scope.inscriptionStep3).toEqual(false);
    expect($scope.inscriptionStep4).toEqual(true);
    expect($scope.step4).toBe('btn btn-primary btn-circle');
    expect($scope.step3).toEqual('btn btn-default btn-circle');

    console.log('toStep4 tested');
  }));
  it('passportCtrl:init check if redirection', inject(function() {
    expect($scope.init).toBeDefined();
    localStorage.setItem('step3', 'ok');
    $scope.init();
    expect($scope.showlogin).toEqual(false);
    expect($scope.inscriptionStep1).toEqual(false);
    expect($scope.inscriptionStep2).toEqual(true);
    expect($scope.inscriptionStep3).toEqual(false);
    expect($scope.showStep2part1).toEqual(false);
    expect($scope.showStep2part2).toEqual(true);

    expect($scope.step2).toBe('btn btn-primary btn-circle');
    expect($scope.step1).toEqual('btn btn-default btn-circle');

    console.log('init tested');
  }));
});