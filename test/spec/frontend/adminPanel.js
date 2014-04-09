/* File: adminPanel.js
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

describe('Controller:AdminPanelCtrl', function() {
	var $scope, controller;
	var accounts = [{
		_id: '52c588a861485ed41c000001',
		local: {
			email: 'email@email.com',
			nom: 'nom1',
			prenom: 'prenom1',
			password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
			role: 'user'

		},
		loged: true,
		dropboxWarning: false,
		admin: true
	}, {
		_id: '52c588a861485ed41c000002',
		local: {
			email: 'email2@email.com',
			nom: 'nom2',
			prenom: 'prenom2',
			password: '$2a$089.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
			role: 'admin'
		},
		loged: true,
		dropboxWarning: false,
		admin: true
	}];

	var account = {
		_id: '52c588a861485ed41c210001',
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
		controller = $controller('AdminPanelCtrl', {
			$scope: $scope
		});
		localStorage.setItem('compteId','5334743ca32a6fc97653566c');
		$httpBackend.whenGET(configuration.URL_REQUEST + '/allAccounts').respond(accounts);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/adminService').respond(accounts);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/profile').respond(accounts);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/deleteAccounts').respond(account);


	}));


	it('AdminPanelCtrl:allAccounts should set allAccounts function', function() {
		expect($scope.listAccounts).toBeDefined();
	});

	it('AdminPanelCtrl:allAccounts should set allAccounts function', inject(function($httpBackend) {
		$scope.listAccounts();
		$httpBackend.flush();
	}));

	it('AdminPanelCtrl:allAccounts should set allAccounts function', inject(function($httpBackend) {
		$scope.listAccounts();
		$httpBackend.flush();
		expect($scope.comptes).toBe(accounts);
	}));

	it('AdminPanelCtrl:initial should set initial function 1', function() {
		expect($scope.initial).toBeDefined();
	});

	it('AdminPanelCtrl: initial should set initial function', inject(function($httpBackend) {
		$scope.initial();
		$httpBackend.flush();
		expect(accounts[0].loged).toBeTruthy();
	}));

	it('AdminPanelCtrl:deleteAccount should set deleteAccount function', function() {
		expect($scope.deleteAccount).toBeDefined();
	});

	it('AdminPanelCtrl:deleteAccount should set deleteAccount function', inject(function($httpBackend) {
		$scope.deleteAccount();
		$httpBackend.flush();
	}));

	it('AdminPanelCtrl:deleteAccount should set deleteAccount function', inject(function($httpBackend) {
		$scope.deleteAccount();
		expect($scope.loader).toBe(true);
		$httpBackend.flush();
		expect($scope.deleted).toBe(account);
		expect($scope.loader).toBe(false);
		expect($scope.listAccounts).toBeDefined();
	}));

	it('AdminPanelCtrl:preSupprimer should set preSupprimer function', function() {
		expect($scope.preSupprimer).toBeDefined();
		$scope.preSupprimer(account);
		expect($scope.compteAsupprimer).toBe(account);
	});


});