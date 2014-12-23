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
	/*global blocks:true */
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
	}, {
		'tag': '52d0598c5633863243545676',
		'texte': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\'> </p>',
		'profil': '52d0598c563380592bc1d703',
		'tagName': 'Annotation',
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
		libelle: 'Solution',
		niveau: 0
	}, {
		_id: '52d0598c563380592bc1d704',
		libelle: 'Titre 01',
		niveau: 1
	}, {
		_id: '52d0598c5633863243545676',
		libelle: 'Annotation',
		niveau: 0
	}];

	var profile = {
		_id: '533d350e4952c0d457478243',
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
	var compteId = 'dgsjgddshdhkjshdjkhskdhjghqksggdlsjfhsjkggsqsldsgdjldjlsd';
	var appVersions = [{
		appVersion: 2
	}];

	//var source = './files/audio.mp3';

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration, $location, $injector) {

		$location = $injector.get('$location');
		$location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html#/apercu';

		scope = $rootScope.$new();
		controller = $controller('ApercuCtrl', {
			$scope: scope
		});
		scope.testEnv = true;
		scope.duplDocTitre = 'Titredudocument';

		$rootScope.currentUser = profile;
		$rootScope.currentIndexPage = 1;

		scope.pageDe = scope.pageA = [1, 2, 3, 4, 5, 6];
		scope.notes = [{
			'idNote': '1401965900625976',
			'idInPage': 1,
			'idDoc': '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
			'idPage': 1,
			'texte': 'Note 1',
			'x': 750,
			'y': 194,
			'xLink': 382,
			'yLink': 194,
			'styleNote': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
		}];

		var mapNotes = {
			'2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232': [{
				'idNote': '1401965900625976',
				'idInPage': 1,
				'idDoc': '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
				'idPage': 1,
				'texte': 'Note 1',
				'x': 750,
				'y': 194,
				'xLink': 382,
				'yLink': 194,
				'styleNote': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
			}]
		};
		var jsonannotation = [{
			'idNote': '1413886387872259',
			'idInPage': 1,
			'idDoc': '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
			'idPage': 1,
			'texte': 'Note 1',
			'x': 750,
			'y': 54,
			'xLink': 510,
			'yLink': 49,
			'styleNote': '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 1 </p>'
		}, {
			'idNote': '1413886389688203',
			'idInPage': 2,
			'idDoc': '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
			'idPage': 1,
			'texte': 'Note 2',
			'x': 750,
			'y': 122,
			'xLink': 658,
			'yLink': 122,
			'styleNote': '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 2 </p>'
		}];
		localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));

		// Mocker le service de recherche des tags
    $rootScope.testEnv = true;
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond(profilActuel);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond(profilTags);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=' + compteId).respond(tags);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilParDefaut').respond(user);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + compteId).respond(profile);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond(appVersions);
		scope.manifestName = 'doc01.appcache';
		scope.apercuName = 'doc01.html';
		scope.url = 'https://dl.dropboxusercontent.com/s/vnmvpqykdwn7ekq/' + scope.apercuName;
		scope.listDocumentDropbox = 'test.html';
		scope.listDocumentManifest = 'listDocument.appcache';

		$httpBackend.whenGET(configuration.URL_REQUEST + '/listDocument.appcache').respond('CACHE MANIFEST # 2010-06-18:v1 # Explicitly cached ');
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.manifestName + '?access_token=' + profile.dropbox.accessToken).respond({});
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json?access_token=0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV').respond({});
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + profile.dropbox.accessToken + '&path=' + scope.manifestName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
			url: 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.manifestName
		});

		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV&path=2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json&root=sandbox&short_url=false').respond({
			url: 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.manifestName
		});

		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.apercuName + '?access_token=' + profile.dropbox.accessToken).respond({});
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + profile.dropbox.accessToken + '&path=' + scope.apercuName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
			url: 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.apercuName
		});

		$httpBackend.whenGET(scope.url).respond('<html manifest=""><head><script> var ownerId = null; var blocks = []; </script></head><body></body></html>');
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentDropbox + '?access_token=' + profile.dropbox.accessToken).respond('<htlm manifest=""><head><script> var profilId = null; var blocks = []; var listDocument= []; </script></head><body></body></html>');
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentDropbox + '?access_token=' + profile.dropbox.accessToken).respond({});
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentManifest + '?access_token=' + profile.dropbox.accessToken).respond('');
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentManifest + '?access_token=' + profile.dropbox.accessToken).respond({});
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV&query=Titredudocument_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html&root=sandbox').respond({});
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=' + profile.dropbox.accessToken + '&query=_' + scope.duplDocTitre + '_&root=sandbox').respond({});
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html?access_token=' + profile.dropbox.accessToken).respond('<html manifest=""><head><script> var profilId = null; var blocks = []; var listDocument= []; </script></head><body></body></html>');
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.appcache?access_token=' + profile.dropbox.accessToken).respond({});
		$httpBackend.whenGET(configuration.URL_REQUEST + '/index.html').respond('<html manifest=""><head><script> var profilId = null; var blocks = []; var listDocument= []; </script></head><body></body></html>');
		$httpBackend.whenGET('https://dl.dropboxusercontent.com/s/gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json').respond(jsonannotation);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=gk6ueltm1ckrq9u24b9855644b7c8733a69cd5bf8290bc8').respond(jsonannotation);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html?access_token=' + profile.dropbox.accessToken).respond({});

		$httpBackend.whenPOST(configuration.URL_REQUEST + '/sendMail').respond({});
	}));
	afterEach(inject(function($controller, $rootScope) {
		$rootScope.$apply();
	}));
	/* ApercuCtrl:init */
	it('ApercuCtrl:init cas 1', inject(function($location) {
		scope.enableNoteAdd();
		localStorage.removeItem('compteId');
		localStorage.setItem('listTagsByProfil', JSON.stringify(profilTags));
		localStorage.setItem('listTags', JSON.stringify(tags));
		scope.init();
		expect(scope.profiltags).toBeDefined();
		expect(scope.profiltags.length).toEqual(profilTags.length);
		expect(scope.plans).toBeDefined();
		//expect(scope.plans.length).toEqual(2);
		expect(scope.loader).toBeDefined();
		expect(scope.loader).toBe(false);
		scope.setActive(0, '52cb095fa8551d800b000012');
		expect(scope.blocksPlan[1].active).toBe(true);
		expect(true).toBe(true);

		$location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html#/apercu?key=dgsjgddshdhkjshdjkhskdhjghqksggdlsjfhsjkggsqsldsgdjldjlsd';
		scope.init();

		$location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html#/apercu?annotation=gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
		scope.init();

	}));

	it('ApercuCtrl:init cas 2', inject(function($httpBackend) {
		localStorage.setItem('compteId', compteId);
		localStorage.setItem('listTagsByProfil', JSON.stringify(profilTags));
		localStorage.setItem('listTags', JSON.stringify(tags));
		scope.init();
		$httpBackend.flush();
		expect(scope.profiltags).toBeDefined();
		expect(scope.profiltags.length).toEqual(profilTags.length);
		expect(scope.plans).toBeDefined();
		//expect(scope.plans.length).toEqual(4);
		expect(scope.loader).toBeDefined();
		expect(scope.loader).toBe(false);
		scope.setActive(0, '52cb095fa8551d800b000012');
		expect(scope.blocksPlan[1].active).toBe(true);
		expect(true).toBe(true);
	}));

	it('ApercuCtrl:init cas 3', inject(function($httpBackend) {
		localStorage.setItem('compteId', compteId);
		localStorage.removeItem('listTagsByProfil');
		localStorage.removeItem('listTags');
		scope.init();
		$httpBackend.flush();
		expect(localStorage.getItem('profilActuel')).toBe(angular.toJson(profilActuel));
		expect(localStorage.getItem('listTagsByProfil')).toBe(angular.toJson(profilTags));
		expect(localStorage.getItem('listTags')).toBe(angular.toJson(tags));
		expect(scope.profiltags).toBeDefined();
		expect(scope.profiltags.length).toEqual(profilTags.length);
		expect(scope.plans).toBeDefined();
		//expect(scope.plans.length).toEqual(4);
		expect(scope.loader).toBeDefined();
		expect(scope.loader).toBe(false);
		scope.setActive(0, '52cb095fa8551d800b000012');
		expect(scope.blocksPlan[1].active).toBe(true);
		expect(true).toBe(true);


	}));

	/* ApercuCtrl:defaultProfile */
	it('ApercuCtrl:defaultProfile', inject(function($httpBackend) {
		localStorage.removeItem('listTagsByProfil');
		localStorage.removeItem('listTags');
		scope.defaultProfile();
		$httpBackend.flush();
		expect(scope.defaultProfile).toBeDefined();
		expect(localStorage.getItem('listTagsByProfil')).toBe(angular.toJson(profilTags));
		expect(localStorage.getItem('listTags')).toBe(angular.toJson(tags));
	}));

	/* ApercuCtrl:dupliquerDocument */
	it('ApercuCtrl:dupliquerDocument', inject(function($httpBackend) {
		localStorage.setItem('compteId', compteId);
		scope.dupliquerDocument();
		$httpBackend.flush();
		expect(scope.dupliquerDocument).toBeDefined();
		expect(scope.showMsgSuccess).toBe(true);

		scope.duplDocTitre = null;
		scope.dupliquerDocument();

		scope.duplDocTitre = 'iknonjn_lkjnkljnkj_/khbjhbk';
		scope.dupliquerDocument();

	}));

	/* ApercuCtrl:clearDupliquerDocument */
	it('ApercuCtrl:clearDupliquerDocument', function() {
		scope.clearDupliquerDocument();
		expect(scope.msgSuccess).toBe('');
	});

	/* ApercuCtrl:restructurer */
	it('ApercuCtrl:restructurer', inject(function($httpBackend, $rootScope) {
		scope.escapeTest = false;
		scope.restructurer();
		expect($rootScope.restructedBlocks).toBeDefined();
	}));

	/* ApercuCtrl:setActive */
	it('ApercuCtrl:setActive', function() {
		scope.blocksPlan = [{
			active: false
		}, {
			active: false
		}, {
			active: false
		}];
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
		scope.blocksPlan = [{
			active: false
		}, {
			active: false
		}, {
			active: false
		}];
		scope.premier();
		expect(scope.blocksPlan[1].active).toBe(true);

		scope.blocksPlan = [{
			active: false
		}];
		scope.premier();
	});

	/* ApercuCtrl:dernier */
	it('ApercuCtrl:dernier', function() {
		scope.blocksPlan = [{
			active: false
		}, {
			active: false
		}, {
			active: false
		}];
		scope.dernier();
		expect(scope.blocksPlan[scope.blocksPlan.length - 1].active).toBe(true);
	});

	/* ApercuCtrl:plan */
	it('ApercuCtrl:plan', function() {
		scope.blocksPlan = [{
			active: false
		}, {
			active: false
		}, {
			active: false
		}];
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

	it('ApercuCtrl:calculateNiveauPlan()', function() {
		var nivPlan = scope.calculateNiveauPlan('2');
		expect(nivPlan).toBe(30);
	});

	/* ApercuCtrl:playSong */
	it('ApercuCtrl:playSong', function() {
		expect(scope.playSong).toBeDefined();
		// $('<audio id="player" src="" preload="auto"></audio>').appendTo('body');
		// scope.playSong(source);
	});

	/* ApercuCtrl:socialShare */
	it('ApercuCtrl:socialShare', function() {
		scope.clearSocialShare();
		scope.loadMail();
		scope.dismissConfirm();
		scope.socialShare();
		scope.destinataire = 'test@email';
		scope.socialShare();
		expect(scope.emailMsgError).not.toBe('');
		scope.destinataire = 'test@email.com';
		scope.socialShare();
		expect(scope.emailMsgError).toBe('');

		localStorage.removeItem('notes');
		scope.clearSocialShare();

	});

	/* ApercuCtrl:sendMail */
	it('ApercuCtrl:sendMail', inject(function($httpBackend) {
		scope.sendMail();
		$httpBackend.flush();
		expect(scope.destinataire).toBe('');
	}));

	it('ApercuCtrl:selectionnerMultiPage', function() {
		scope.selectionnerMultiPage();
		expect(scope.pageDe).toBe(1);
		expect(scope.pageA).toBe(1);
	});

	it('ApercuCtrl:selectionnerPageDe', function() {
		scope.clearPrint();
		scope.selectionnerPageDe();
	});

	it('ApercuCtrl:printByMode', function() {
		scope.printMode = 1;
		scope.printPlan = true;
		scope.printByMode();
		scope.printMode = 2;
		scope.printByMode();
	});

	it('ApercuCtrl:addNote', function() {
		scope.addNote(700, 50);
		expect(scope.notes.length).toBe(2);
	});

	it('ApercuCtrl:restoreNotesStorage', function() {
		scope.restoreNotesStorage(1);
		expect(scope.notes.length).toBe(1);
	});

	it('ApercuCtrl:editNote', function() {
		scope.editNote(scope.notes[0]);
	});

	it('ApercuCtrl:removeNote', function() {
		scope.removeNote(scope.notes[0]);
		expect(scope.isEnableNoteAdd).toBe(false);
	});

	it('ApercuCtrl:applySharedAnnotation', inject(function($httpBackend, $location) {
		// $httpBackend.flush();
		$location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html#/apercu?annotation=gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
		scope.testEnv = true;
		scope.annotationDummy = 'gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
		console.log('$location.absUrl()');
		console.log($location.absUrl());

		scope.applySharedAnnotation();

		localStorage.removeItem('notes');
		scope.applySharedAnnotation();

		$httpBackend.flush();

	}));

	it('ApercuCtrl:processAnnotation', inject(function($httpBackend, $location) {
		// $httpBackend.flush();


		scope.annotationOk = false;
		scope.processAnnotation();

		scope.annotationOk = true;
		$location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html#/apercu?annotation=gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
		scope.testEnv = true;
		scope.docFullName = '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
		scope.annotationToShare = [{
			'idNote': '1413886387872259',
			'idInPage': 1,
			'idDoc': '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
			'idPage': 1,
			'texte': 'Note 1',
			'x': 750,
			'y': 54,
			'xLink': 510,
			'yLink': 49,
			'styleNote': '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 1 </p>'
		}];
		scope.processAnnotation();

		$httpBackend.flush();

	}));

});
