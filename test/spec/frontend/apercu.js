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

/*global $:false */

'use strict';

describe('Controller:ApercuCtrl', function() {

	var scope, controller;
	var profilId = '52d0598c563380592bc1d703';
	var idDocument = ['52cb095fa8551d800b000012'];
	var profilTags = [{
		_id: '52d0598d563380592bc1d705',
		profil: '52d0598c563380592bc1d703',
		tag: '52d0598c563380592bc1d704',
		tagName: 'Titre',
		texte: 'un example de text'
	}];
	var documentStructure = {
		titre: '',
		text: 'un exampe de texte',
		image: 'files/decoup.thumb_0.9390108054503798.png',
		_id: '52cb095fa8551d800b000012',
		tag: '52d0598c563380592bc1d704',
		__v: 0,
		children: []
	};
	var tags = [{
		_id: '52c588a861485ed41c000001',
		libelle: 'Exercice'
	}, {
		_id: '52c588a861485ed41c000002',
		libelle: 'Cours'
	}];
	//var source = './files/audio.mp3';

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend, $location) {
		$location.search().profil = profilId;
		$location.search().document = idDocument;

		scope = $rootScope.$new();
		controller = $controller('ApercuCtrl', {
			$scope: scope
		});

		// Mocker le service de recherche des tags  
		$httpBackend.whenPOST('/chercherTagsParProfil', {
			idProfil: $rootScope.profilId
		}).respond(angular.toJson(profilTags));

		$httpBackend.whenGET('/readTags').respond(tags);

		// Mocker le service de selection des documents
		$httpBackend.whenPOST('/getDocument', {
			idDoc: $rootScope.idDocument[0]
		}).respond(angular.toJson(documentStructure));

	}));

	/* ApercuCtrl:init */
	it('ApercuCtrl:init', inject(function($httpBackend) {
		$httpBackend.flush();
		expect(scope.profiltags).toBeDefined();
		expect(scope.profiltags.length).toEqual(profilTags.length);
		expect(scope.blocksPlan).toBeDefined();
		expect(scope.blocksPlan.length).toBe(idDocument.length + 1);
		expect(scope.loader).toBeDefined();
		expect(scope.loader).toBe(false);
		scope.setActive(0, '52cb095fa8551d800b000012');
		expect(scope.blocksPlan[1].active).toBe(true);
	}));

	/* ApercuCtrl:setActive */
	it('ApercuCtrl:setActive', inject(function($httpBackend) {
		$httpBackend.flush();
		scope.setActive(0, '52cb095fa8551d800b000012');
		expect(scope.blocksPlan[1].active).toBe(true);
	}));

	/* ApercuCtrl:precedent */
	it('ApercuCtrl:precedent', inject(function($httpBackend) {
		$httpBackend.flush();
		scope.precedent();
	}));

	/* ApercuCtrl:suivant */
	it('ApercuCtrl:suivant', inject(function($httpBackend) {
		$httpBackend.flush();
		scope.precedent();
		scope.suivant();
	}));

	/* ApercuCtrl:premier */
	it('ApercuCtrl:premier', inject(function($httpBackend) {
		$httpBackend.flush();
		scope.premier();
		expect(scope.blocksPlan[1].active).toBe(true);
	}));

	/* ApercuCtrl:dernier */
	it('ApercuCtrl:dernier', inject(function($httpBackend) {
		$httpBackend.flush();
		scope.dernier();
		expect(scope.blocksPlan[scope.blocksPlan.length - 1].active).toBe(true);
	}));

	/* ApercuCtrl:plan */
	it('ApercuCtrl:plan', inject(function($httpBackend) {
		$httpBackend.flush();
		$('<div id="plan" style="min-height:500px"><h2>Plan</h2></div>').appendTo('body');
		scope.plan();
		expect(scope.blocksPlan[0].active).toBe(true);
	}));

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