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
		$scope.testEnv = true;
		localStorage.setItem('compteId', '533abde21ca6364c2cc5e0fb');

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
		$rootScope.currentUser = {
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

		$scope.destination = 'test@test.com';

		$scope.destinataire = 'test@test.com';

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
					role: 'admin'
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
				role: 'admin'
			}
		};

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

		$scope.indexPage = '<html class="no-js" lang="fr" manifest=""> <!--<![endif]--><head></head><body></body></html>';
		$scope.appcache = "CACHE MANIFEST # 2010-06-18:v2 # Explicitly cached 'master entries'. CACHE: http://dl.dropboxusercontent.com/s/ee44iev4pgw0avb/test.html # Resources that require the user to be online. NETWORK: * ";

		$httpBackend.whenPOST(configuration.URL_REQUEST + '/sendMail').respond($scope.mail);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/profile').respond($scope.dataRecu);
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.html&root=sandbox').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/test.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.indexPage);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/test.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.appcache);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);

	}));

	it('listDocumentCtrl: initListDocument function', inject(function($httpBackend, $rootScope, configuration) {
		$scope.testEnv = true;
		$scope.initListDocument();
		$httpBackend.flush();

	}))

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