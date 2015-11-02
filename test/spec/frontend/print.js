/* File: print.js
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

describe('Controller:PrintCtrl', function () {
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
		niveau: 1
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

	beforeEach(module('cnedApp'));

	beforeEach(inject(function ($controller, $rootScope, $httpBackend, configuration, $location, $injector) {

		$location = $injector.get('$location');
		$location.$$absUrl =
			'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_1dfa7b2fb007bb7de17a22562fba6653afcdc4a7802b50ec7d229b4828a13051.html#/print';
		$location.search().plan = 0;
		$location.search().mode = 1;
		$location.search().de = 1;
		$location.search().a = 1;

		scope = $rootScope.$new();
		controller = $controller('PrintCtrl', {
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
			'idDoc': '1dfa7b2fb007bb7de17a22562fba6653afcdc4a7802b50ec7d229b4828a13051',
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
		localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
	}));

	/*
		it('PrintCtrl:populateApercu()', function() {
			localStorage.setItem('listTagsByProfil', JSON.stringify(profilTags));
			localStorage.setItem('listTags', JSON.stringify(tags));
			scope.populateApercu();
			expect(scope.showPlan).toBe(false);
		});

		it('PrintCtrl:calculateNiveauPlan()', function() {
			var nivPlan = scope.calculateNiveauPlan('2');
			expect(nivPlan).toBe(30);
		});

		it('PrintCtrl:restoreNotesStorage()', function() {
			$('<div id="noPlanPrint1"></div>').appendTo('body');
			scope.restoreNotesStorage();
			expect(scope.notes.length).toBe(0);
		});
		*/

	it('PrintCtrl:drawLine()', function () {
		expect(scope.loader).toBe(true);
	});

});
