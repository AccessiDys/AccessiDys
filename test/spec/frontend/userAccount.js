/* File: userAccount.js
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

describe('Controller:UserAccountCtrl', function() {
	var $scope, controller;
	var accounts = {
		_id: '532328858785a8e31b786238',
		dropbox: {
			'accessToken': '0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV',
			'country': 'MA',
			'display_name': 'Ahmed BOUKHARI',
			'emails': 'ahmed.boukhari@gmail.com',
			'referral_link': 'https://db.tt/8yRfYgRM',
			'uid': '274702674'
		},
		local: {
			'role': 'user',
			'prenom': 'aaaaaaa',
			'nom': 'aaaaaaaa',
			'password': '$2a$08$53hezQbdhQrrux7pxIftheQwirc.ud8vEuw/IgFOP.tBcXBNftBH.',
			'email': 'test@test.com'
		}
	};

	var account = {
		'_id': '52c588a861485ed41c210001',
		local: {
			email: 'mail@email.com',
			nom: 'nom3',
			prenom: 'prenom3',
			password: '$2a$08$.tZ6f5O4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
			role: 'user'

		}
	};


	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration) {
		$scope = $rootScope.$new();
		controller = $controller('UserAccountCtrl', {
			$scope: $scope
		});

		$scope.userAccount = account;
		$httpBackend.whenGET(configuration.URL_REQUEST + '/profile').respond(accounts);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/modifierInfosCompte').respond(accounts);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/checkPassword').respond('true');
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/modifierPassword').respond('password');

	}));


	it('UserAccountCtrl:initial should set initial function', function() {
		expect($scope.initial).toBeDefined();
	});
	it('UserAccountCtrl:initial should set initial function', inject(function($httpBackend) {
		$scope.initial();
		$httpBackend.flush();
	}));

	it('UserAccountCtrl:initial should set initial function', inject(function($httpBackend) {
		$scope.initial();
		$httpBackend.flush();
		expect($scope.objet).toEqual(accounts);
	}));

	it('UserAccountCtrl:modifierCompte should set modifierCompte function', function() {
		expect($scope.modifierCompte).toBeDefined();
	});

	it('UserAccountCtrl:modifierCompte should set modifierCompte function', inject(function($httpBackend) {
		$scope.objet = {};
		$scope.objet._id = '532328858785a8e31b786238';
		$scope.compte = accounts.local;
		$scope.modifierCompte();
		$httpBackend.flush();
		expect($scope.monObjet).toEqual(accounts);
	}));

	it('UserAccountCtrl:modifierPassword should set modifierPassword function', inject(function($httpBackend) {
		$scope.objet = {};
		$scope.objet._id = '532328858785a8e31b786238';
		$scope.compte = accounts.local;
		$scope.modifierPassword();
		$httpBackend.flush();
		expect($scope.compte.oldPassword).toEqual('');
	}));

	it('UserAccountCtrl:verifyPassword should set verifyPassword function', inject(function() {
		expect($scope.verifyPassword).toBeDefined();
		expect($scope.verifyPassword('password')).toBeTruthy();
	}));


});