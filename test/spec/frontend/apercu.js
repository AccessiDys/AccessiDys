/* File: apercu.js
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

/*global $:false, blocks*/

'use strict';

describe('Controller:ApercuCtrl', function() {

	var scope, controller;
	blocks = {
		'children': [{
			'id': 461.5687490440905,
			'originalSource': 'data:image/png;base64,',
			'source': {},
			'text': '',
			'level': 0,
			'children': [{
				'id': '139482262782797',
				'text': 'Un titre',
				'source': {},
				'children': [],
				'originalSource': 'data:image/png;base64,jhdsghfsdhhtd',
				'tag': '52d0598c563380592bc1d704'
			}, {
				'id': '1394822627845718',
				'text': 'Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte ',
				'source': {},
				'children': [],
				'originalSource': 'data:image/png;base64,dgshgdhgsdggd',
				'tag': '52c588a861485ed41c000001'
			}]
		}]
	};

	var profilTags = [{
		'__v': 0,
		'_id': '52fb65eb8856dce835c2ca87',
		'coloration': 'Colorer les lignes',
		'interligne': '18',
		'police': 'opendyslexicregular',
		'profil': '52d0598c563380592bc1d703',
		'styleValue': 'Normal',
		'tag': '52d0598c563380592bc1d704',
		'tagName': 'Titre 01',
		'taille': '12',
		'texte': '<p data-font=\'opendyslexicregular\' data-size=\'12\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Colorer les lignes\'> </p>'
	}, {
		'tag': '52c588a861485ed41c000001',
		'texte': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\'> </p>',
		'profil': '52d0598c563380592bc1d703',
		'tagName': 'Solution',
		'police': 'opendyslexicregular',
		'taille': '14',
		'interligne': '18',
		'styleValue': 'Normal',
		'coloration': 'Surligner les lignes',
		'_id': '52fb65eb8856dce835c2ca8d',
		'__v': 0
	}];

	var tags = [{
		_id: '52c588a861485ed41c000001',
		libelle: 'Exercice'
	}, {
		_id: '52d0598c563380592bc1d704',
		libelle: 'Titre 01'
	}];

	var profile = {
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

	var profilActuel = {
		nom: 'Nom1',
		descriptif: 'Descriptif1',
		photo: '',
		owner: '5325aa33a21f887257ac2995',
		_id: '52fb65eb8856dce835c2ca86'
	};

	var user = {
		'email': 'test@test.com',
		'password': 'password example',
		'nom': 'test',
		'prenom': 'test',
		'data': {
			'local': 'admin'
		}
	};

	//var source = './files/audio.mp3';

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration) {
		scope = $rootScope.$new();

		controller = $controller('ApercuCtrl', {
			$scope: scope
		});

		$rootScope.currentUser = profile;

		// Mocker le service de recherche des tags  
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond(profilActuel);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond(profilTags);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/readTags').respond(tags);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilParDefaut').respond(user);

		scope.manifestName = 'doc01.appcache';
		scope.apercuName = 'doc01.html';
		scope.url = 'http://dl.dropboxusercontent.com/s/vnmvpqykdwn7ekq/' + scope.apercuName;
		scope.listDocumentDropbox = 'test.html';
		scope.listDocumentManifest = 'listDocument.appcache';

		$httpBackend.whenGET(configuration.URL_REQUEST + '/listDocument.appcache').respond({
			data: ''
		});
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.manifestName + '?access_token=' + profile.dropbox.accessToken).respond({});
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + profile.dropbox.accessToken + '&path=' + scope.manifestName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
			url: 'http://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.manifestName
		});

		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.apercuName + '?access_token=' + profile.dropbox.accessToken).respond({});
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + profile.dropbox.accessToken + '&path=' + scope.apercuName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
			url: 'http://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.apercuName
		});

		$httpBackend.whenGET(scope.url).respond('<html manifest=""><head><script> var ownerId = null; var blocks = []; </script></head><body></body></html>');
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentDropbox + '?access_token=' + profile.dropbox.accessToken).respond('<htlm manifest=""><head><script> var profilId = null; var blocks = []; var listDocument= []; </script></head><body></body></html>');
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentDropbox + '?access_token=' + profile.dropbox.accessToken).respond({});
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentManifest + '?access_token=' + profile.dropbox.accessToken).respond('');
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentManifest + '?access_token=' + profile.dropbox.accessToken).respond({});
	}));

	/* ApercuCtrl:init */
	it('ApercuCtrl:init', function() {
		localStorage.setItem('compteId', profile._id);
		localStorage.setItem('listTagsByProfil', JSON.stringify(profilTags));
		localStorage.setItem('listTags', JSON.stringify(tags));
		scope.init();
		//$httpBackend.flush();
		expect(scope.profiltags).toBeDefined();
		expect(scope.profiltags.length).toEqual(profilTags.length);
		expect(scope.plans).toBeDefined();
		expect(scope.plans.length).toEqual(2);
		expect(scope.loader).toBeDefined();
		expect(scope.loader).toBe(false);
		scope.setActive(0, '52cb095fa8551d800b000012');
		expect(scope.blocksPlan[1].active).toBe(true);
		expect(true).toBe(true);
	});

	it('ApercuCtrl:verifProfil', inject(function($httpBackend) {
		scope.verifProfil();
		$httpBackend.flush();
		expect(scope.verifProfil).toBeDefined();
		expect(localStorage.getItem('profilActuel')).toBe(angular.toJson(profilActuel));
		expect(localStorage.getItem('listTagsByProfil')).toBe(angular.toJson(profilTags));
		expect(localStorage.getItem('listTags')).toBe(angular.toJson(tags));
	}));

	it('ApercuCtrl:defaultProfile', inject(function($httpBackend) {
		scope.defaultProfile();
		$httpBackend.flush();
		expect(scope.defaultProfile).toBeDefined();
		expect(localStorage.getItem('listTagsByProfil')).toBe(angular.toJson(profilTags));
		expect(localStorage.getItem('listTags')).toBe(angular.toJson(tags));
	}));

	it('ApercuCtrl:dupliquerDocument', inject(function($httpBackend) {
		scope.dupliquerDocument();
		$httpBackend.flush();
		expect(scope.dupliquerDocument).toBeDefined();
		expect(scope.showMsgSuccess).toBe(true);
	}));

	it('ApercuCtrl:restructurer', inject(function($httpBackend, $rootScope) {
		scope.escapeTest = false;
		scope.restructurer();
		expect($rootScope.restructedBlocks).toBeDefined();
	}));

	/* ApercuCtrl:setActive */
	it('ApercuCtrl:setActive', function() {
		scope.setActive(0, '52cb095fa8551d800b000012');
		expect(scope.blocksPlan[1].active).toBe(true);
	});

	/* ApercuCtrl:precedent */
	it('ApercuCtrl:precedent', function() {
		scope.precedent();
	});

	/* ApercuCtrl:suivant */
	it('ApercuCtrl:suivant', function() {
		scope.precedent();
		scope.suivant();
	});

	/* ApercuCtrl:premier */
	it('ApercuCtrl:premier', function() {
		scope.premier();
		expect(scope.blocksPlan[1].active).toBe(true);
	});

	/* ApercuCtrl:dernier */
	it('ApercuCtrl:dernier', function() {
		scope.dernier();
		expect(scope.blocksPlan[scope.blocksPlan.length - 1].active).toBe(true);
	});

	/* ApercuCtrl:plan */
	it('ApercuCtrl:plan', function() {
		$('<div id="plan" style="min-height:500px"><h2>Plan</h2></div>').appendTo('body');
		scope.plan();
		expect(scope.blocksPlan[0].active).toBe(true);
	});

	/* ApercuCtrl:afficherMenu */
	it('ApercuCtrl:afficherMenu', function() {
		$('<div class="menu_wrapper"><button type="button" class="open_menu shown"></button></div>').appendTo('body');
		scope.afficherMenu();
		$('<div class="menu_wrapper"><button type="button" class="open_menu"></button></div>').appendTo('body');
		scope.afficherMenu();
	});

	/* ApercuCtrl:playSong */
	it('ApercuCtrl:playSong', function() {
		expect(scope.playSong).toBeDefined();
		// $('<audio id="player" src="" preload="auto"></audio>').appendTo('body');
		// scope.playSong(source);
	});

	/* ApercuCtrl:printDocument */
	it('ApercuCtrl:printDocument', function() {
		scope.printDocument();
	});

});