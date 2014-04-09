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
/* global $:false, spyOnEvent */

describe('Controller:listDocumentCtrl', function() {
	var $scope, controller;

	var doc = {
		titre: 'Document 01'
	};

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

		$scope.sharedDoc = 'test.pdf';

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
		var tags = [{
			_id: '52c6cde4f6f46c5a5a000004',
			libelle: 'Exercice'
		}, {
			_id: '52c588a861485ed41c000002',
			libelle: 'Cours'
		}];
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
			'revision': 919,
			'rev': '39721729c92',
			'thumb_exists': false,
			'bytes': 121273,
			'modified': 'Tue, 01 Apr 2014 08:47:13 +0000',
			'client_mtime': 'Tue, 01 Apr 2014 08:47:13 +0000',
			'path': '/manifestPresent.html',
			'is_dir': false,
			'icon': 'page_white_code',
			'root': 'dropbox',
			'mime_type': 'text/html',
			'size': '118.4 KB'
		}, {
			'revision': 924,
			'rev': '39c21729c92',
			'thumb_exists': false,
			'bytes': 17344,
			'modified': 'Tue, 01 Apr 2014 08:52:08 +0000',
			'client_mtime': 'Tue, 01 Apr 2014 08:52:09 +0000',
			'path': '/test.html',
			'is_dir': false,
			'icon': 'page_white_code',
			'root': 'dropbox',
			'mime_type': 'text/html',
			'size': '16.9 KB'
		}];
		$scope.uniqueResult = {
			"size": "15 bytes",
			"rev": "1f0a503351f",
			"thumb_exists": false,
			"bytes": 15,
			"modified": "Wed, 10 Aug 2011 18:21:29 +0000",
			"path": "/test1.txt",
			"is_dir": false,
			"icon": "page_white_text",
			"root": "dropbox",
			"mime_type": "text/plain",
			"revision": 496342
		};
		var profil = {
			_id: '52d8f928548367ee2d000006',
			photo: './files/profilImage.jpg',
			descriptif: 'descriptif3',
			nom: 'Nom3'
		};
		var dropbox_type = 'sandbox';
		var oldFilePath = 'abc';
		var newFilePath = 'abc2';
		var access_token = $scope.dataRecu.dropbox.accessToken;
		var data = {
			url: 'dl.dropboxusercontent.com/s/1a5ul0g820on65b/test.html#/listDocument'
		};

		localStorage.setItem('compte', $scope.dataRecu.dropbox.accessToken);
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=' + $scope.dataRecu.dropbox.accessToken + '&query=' + doc.titre + '.html&root=' + configuration.DROPBOX_TYPE).respond({});

		$scope.indexPage = '<html class="no-js" lang="fr" manifest=""> <!--<![endif]--><head></head><body></body></html>';
		$scope.appcache = "CACHE MANIFEST # 2010-06-18:v2 # Explicitly cached 'master entries'. CACHE: http://dl.dropboxusercontent.com/s/ee44iev4pgw0avb/test.html # Resources that require the user to be online. NETWORK: * ";

		$httpBackend.whenPOST(configuration.URL_REQUEST + '/sendMail').respond($scope.mail);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/profile').respond($scope.dataRecu);
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.html&root=sandbox').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/' + configuration.CATALOGUE_NAME + '?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.indexPage);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + configuration.CATALOGUE_NAME + '?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.appcache);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/delete/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=abc&root=sandbox').respond($scope.dataRecu);
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=abc&to_path=/abc2.html&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.uniqueResult);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=abc2.html&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/delete/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=/abc&root=sandbox').respond(data);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/readTags').respond(tags);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond(tags);

	}));


	it('listDocumentCtrl: initListDocument function', inject(function($httpBackend, $rootScope) {
		$scope.testEnv = true;
		$scope.initListDocument();
		$httpBackend.flush();
		expect($rootScope.loged).toEqual(true);
		expect($scope.flagListDocument).toEqual(true);
	}));

	it('listDocumentCtrl: open', inject(function() {
		var deleteLink = {
			path: 'abc'
		};
		$scope.open(deleteLink);
		expect($scope.deleteLink).toEqual('abc');
	}));

	// it('listDocumentCtrl:suprimeDocument function', inject(function($httpBackend) {
	// 	expect($scope.suprimeDocument).toBeDefined();
	// 	$scope.deleteLink = 'abc';
	// 	$scope.deleteLienDirect = 'LienApercu';
	// 	$scope.suprimeDocument();
	// 	$httpBackend.flush();
	// 	expect($scope.deleteFlag).toEqual(true);
	// }));

	it('listDocumentCtrl: openModifieTitre function', inject(function() {
		expect($scope.openModifieTitre).toBeDefined();
		var data = {
			path: 'abc',
			lienApercu: 'Lienabc'
		}
		$scope.openModifieTitre(data);
		expect($scope.afficheErreurModifier).toEqual(false);
		expect($scope.videModifier).toEqual(false);
		expect($scope.nouveauTitre).toEqual('');
	}));

	it('listDocumentCtrl: modifieTitre function', inject(function($rootScope, configuration, $httpBackend) {
		$scope.testEnv === true;
		$scope.nouveauTitre = '';
		$scope.modifieTitre();
		expect($scope.videModifier).toEqual(true);
		$scope.nouveauTitre = 'abc';
		$scope.listDocument = [{
			path: 'abc'
		}, {
			path: 'abc2'
		}];
		$scope.selectedItem = 'abc';
		$scope.nouveauTitre = 'abc2';
		$rootScope.currentUser = $scope.dataRecu;
		$scope.modifieTitre();
		expect($scope.afficheErreurModifier).toEqual(true);
		$scope.nouveauTitre = 'abc3';
		$scope.modifieTitre();
		expect($scope.flagModifieDucoment).toEqual(true);
	}));

	it('listDocumentCtrl:loadMail function', function() {
		expect($scope.loadMail).toBeDefined();
		expect($scope.displayDestination).toBeFalsy();
	});

	it('listDocumentCtrl:verifyEmail function', inject(function() {
		expect($scope.verifyEmail).toBeDefined();
		expect($scope.verifyEmail('test@test.com')).toBeTruthy();
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
		$scope.destination = 'test@test.com';
		$scope.docApartager = {
			path: 'test.html'
		};
		$scope.sendMail();
		$httpBackend.flush();

		expect($scope.verifyEmail($scope.destination)).toBeTruthy();
		expect($scope.docApartager).not.toBe(null);
		expect($rootScope.myUser.dropbox.accessToken).not.toBe(null);
		expect(configuration.DROPBOX_TYPE).toBeTruthy();
		expect($rootScope.currentUser).not.toBe(null);
		expect($scope.docApartager).not.toBe(null);
		expect($scope.docApartager.path).not.toBe(null);

		$scope.sendVar = {
			to: $scope.destinataire,
			content: ' a utilisé cnedAdapt pour partager un fichier avec vous !  ' + $scope.docApartager.lienApercu,
			encoded: '<span> vient d\'utiliser cnedAdapt pour partager un fichier avec vous !   <a href=' + $scope.docApartager.lienApercu + '>Document CnedAdapt</a> </span>',
			prenom: $rootScope.currentUser.local.prenom,
			fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
			doc: $scope.sharedDoc
		};
		expect($scope.envoiMailOk).toBeTruthy();


	}));


	it('listDocumentCtrl:modifieTitreConfirme function', inject(function($rootScope, configuration, $httpBackend) {
		$scope.selectedItem = 'abc';
		$scope.nouveauTitre = 'abc2';
		$rootScope.currentUser.dropbox.accessToken = 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn';
		configuration.DROPBOX_TYPE = 'sandbox';
		$scope.modifieTitreConfirme();
		$httpBackend.flush();

		expect($scope.modifyCompleteFlag).toEqual(true);
	}));

	it('listDocumentCtrl:ajouterDocument', inject(function($httpBackend) {
		$scope.escapeTest = false;
		expect($scope.ajouterDocument).toBeDefined();
		$scope.ajouterDocument();
		expect($scope.errorMsg).not.toEqual('');
		$scope.doc = doc;
		$scope.ajouterDocument();
		$httpBackend.flush();
		expect($scope.errorMsg).not.toEqual('');
		$scope.doc.lienPdf = 'http://dl.dropboxusercontent.com/s/ursvf38qjs6nbgp/grammaire.pdf';
		$('<div class="modal fade" id="addDocumentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" ></div>').appendTo('body');
		$scope.ajouterDocument();
		$httpBackend.flush();
		var spyEvent;
		spyEvent = spyOnEvent('#addDocumentModal', 'hidden.bs.modal');
		$('#addDocumentModal').trigger('hidden.bs.modal');
		expect($scope.doc).toEqual({});
	}));

	it('listDocumentCtrl:setFiles', function() {
		var element = {
			files: [{
				type: 'image/png'
			}]
		};
		expect($scope.setFiles).toBeDefined();
		$scope.setFiles(element);
		expect($scope.files).toEqual(element.files);
	});

	it('listDocumentCtrl:clearUploadPdf', function() {
		expect($scope.clearUploadPdf).toBeDefined();
		$scope.clearUploadPdf();
		expect($scope.files).toEqual([]);
	});

	it('listDocumentCtrl: localSetting', inject(function($httpBackend) {
		localStorage.removeItem('listTags');
		localStorage.removeItem('listTagsByProfil');
		$scope.localSetting();
		$httpBackend.flush();
		expect($scope.flagLocalSettinglistTags).toEqual(true);
		expect($scope.flagLocalSettinglistTagsByProfil).toEqual(true);
	}));


});