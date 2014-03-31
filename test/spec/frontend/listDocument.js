/* File: listDocument.js
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

describe('Controller:listDocumentCtrl', function() {
	var $scope, controller;

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration) {
		$scope = $rootScope.$new();
		controller = $controller('listDocumentCtrl', {
			$scope: $scope
		});

		$scope.mail = {
			to: 'test@test.com',
			content: 'Je viens de partager avec vous le lien suivant : dropbox.com',
			encoded: '<div>Je viens de partager avec vous le lien suivant : dropbox.com</div>'
		};

		$scope.docApartager = {
			lienApercu: 'dropbox.com'
		};
		$rootScope.myUser = {
			dropbox: {
				accessToken: 'K79U_9sinzkAAAAAAAAAAXOOOO-ShukKKOSFG6tVhO645bUwaYER2g7bN3eHuQsS'
			}
		};

		$scope.destination = 'test@test.com';

		$scope.destinataire = 'test@test.com';

		$httpBackend.whenPOST(configuration.URL_REQUEST + '/sendMail').respond($scope.mail);
	}));

	it('listDocumentCtrl:loadMail function', function() {
		expect($scope.loadMail).toBeDefined();
		expect($scope.displayDestination).toBeFalsy();
	});

	it('listDocumentCtrl:verifyEmail function', inject(function() {
		expect($scope.verifyEmail).toBeDefined();
		expect($scope.verifyEmail('aa.maslouhy@gmail.com')).toBeTruthy();
	}));

	it('listDocumentCtrl:docPartage function', inject(function() {
		$scope.docApartager = {
			lienApercu: 'http://dropbox.com/#'
		};
		expect($scope.docPartage).toBeDefined();
		$scope.docPartage($scope.docApartager);
		expect($scope.encodedLinkFb).toEqual('http://dropbox.com/%23');

	}));

	it('listDocumentCtrl:sendMail function', inject(function($httpBackend, $rootScope, configuration) {
		$scope.destination = 'aa.maslouhy@gmail.com';
		$scope.sendMail();
		expect($scope.destination).toEqual($scope.destinataire);
		expect($scope.verifyEmail($scope.destination)).toBeTruthy();
		expect($scope.docApartager).not.toBe(null);
		expect($rootScope.myUser.dropbox.accessToken).not.toBe(null);
		expect(configuration.DROPBOX_TYPE).toBeTruthy();
		$scope.sendVar = {
			to: $scope.destinataire,
			content: 'Je viens de partager avec vous le lien suivant : dropbox.com',
			encoded: '<div>Je viens de partager avec vous le lien suivant : dropbox.com</div>'
		};
		$httpBackend.flush();

		expect($scope.sent).toEqual($scope.mail);
	}));


});