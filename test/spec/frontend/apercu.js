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

'use strict';

describe('Controller:ApercuCtrl', function() {

	var scope, controller;
	var profilId = '52d0598c563380592bc1d703';
	var idDocument = ['52cb095fa8551d800b000012'];
	var tag = {
		_id: '52d0598c563380592bc1d704',
		libelle: 'Paragraphe'
	};
	var tagWithPosition = {
		libelle: tag.libelle,
		position: 1
	};
	var profilTags = [{
		_id: '52d0598d563380592bc1d705',
		profil: '52d0598c563380592bc1d703',
		tag: '52d0598c563380592bc1d704',
		texte: 'un example de text'
	}];
	var documentStructure = {
		titre: '',
		text: 'un exampe de texte',
		image: 'files/decoup.thumb_0.9390108054503798.png',
		_id: '52cb58487b0e99880d000004',
		tag: '52d0598c563380592bc1d704',
		__v: 0,
		children: []
	};
	// var source = './files/audio.mp3';

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend) {
		$rootScope.profilId = profilId;
		$rootScope.idDocument = idDocument;

		scope = $rootScope.$new();
		controller = $controller('ApercuCtrl', {
			$scope: scope
		});

		// Mocker le service de recherche des tags  
		$httpBackend.whenPOST('/chercherTagsParProfil', {
			idProfil: $rootScope.profilId
		}).respond(angular.toJson(profilTags));

		// Mocker le service de selection des documents
		$httpBackend.whenPOST('/getDocument', {
			idDoc: $rootScope.idDocument[0]
		}).respond(angular.toJson(documentStructure));

		// Mocker le service de recherche d'un tag par Id
		$httpBackend.whenPOST('/getTagById', {
			idTag: documentStructure.tag,
			position: 0
		}).respond(angular.toJson(tagWithPosition));
	}));

	/* ApercuCtrl:init */

	it('TagCtrl:init should set init function', function() {
		expect(scope.init).toBeDefined();
	});

	it('ApercuCtrl:init should call /chercherTagsParProfil and /getDocument on scope.init()', inject(function($httpBackend) {
		$httpBackend.flush();
	}));

	it('ApercuCtrl:init should profilTags be scope.profiltags', inject(function($httpBackend) {
		$httpBackend.flush();
		expect(scope.profiltags.length).toEqual(profilTags.length);
	}));

	it('ApercuCtrl:init should scope.blocks be document on scope.init()', inject(function($httpBackend) {
		$httpBackend.flush();
		expect(scope.blocks).toBeDefined();
		expect(scope.blocks.length).toBe(1);
	}));

	it('ApercuCtrl:playSong should set playSong function', function() {
		expect(scope.playSong).toBeDefined();
	});

	//	it('TagCtrl:playSong should set playSong function', inject(function($httpBackend) {
	//		var $player = $('<audio id="player" src="" preload="auto"></audio>').appendTo('body');
	//		scope.playSong(source);
	//	}));

	it('ApercuCtrl : setActive test', function() {
		scope.blocksAlternative[0] = documentStructure;
		console.log(scope.blocksAlternative);
		scope.setActive(0);
	});

	it('ApercuCtrl: Impression document', function() {
		scope.printDocument();
	});

});