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
				'text': 'Un example de texte',
				'source': {},
				'children': [],
				'originalSource': 'data:image/png;base64,dgshgdhgsdggd',
				'tag': '52e940536f86d29e28f930fb'
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
		'tag': '52e8d60cc6180eb9163fa064',
		'tagName': 'Titre 01',
		'taille': '12',
		'texte': '<p data-font=\'opendyslexicregular\' data-size=\'12\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Colorer les lignes\'> </p>'
	}, {
		'tag': '52e940686f86d29e28f930fe',
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
		libelle: 'Titre'
	}];
	//var source = './files/audio.mp3';

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		controller = $controller('ApercuCtrl', {
			$scope: scope
		});

		localStorage.setItem('listTagsByProfil', JSON.stringify(profilTags));
		localStorage.setItem('listTags', JSON.stringify(tags));
	}));

	/* ApercuCtrl:init */
	it('ApercuCtrl:init', function() {
		scope.init();
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