/* File: tag.js
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

describe('Controller:TagCtrl', function() {
	var $scope, controller;
	var tags = [{
		_id: '52c588a861485ed41c000001',
		libelle: 'Exercice'
	}, {
		_id: '52c588a861485ed41c000002',
		libelle: 'Cours'
	}];
	var tag = {
		_id: '52c588a861485ed41c000003',
		libelle: 'TP'
	};

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend) {
		$scope = $rootScope.$new();
		controller = $controller('TagCtrl', {
			$scope: $scope
		});

		$httpBackend.whenGET('/readTags').respond(tags);

		$scope.tag = tag;
		$httpBackend.whenPOST('/addTag').respond(tag);

		$scope.fiche = tag;
		$httpBackend.whenPOST('/deleteTag').respond(tag);

		$httpBackend.whenPOST('/updateTag').respond(tag);
	}));

	/* TagCtrl:afficherTag */

	it('TagCtrl:afficherTags should set afficherTags function', function() {
		expect($scope.afficherTags).toBeDefined();
	});

	it('TagCtrl:afficherTags should call /readTags on $scope.afficherTags()', inject(function($httpBackend) {
		$scope.afficherTags();
		$httpBackend.flush();
	}));

	it('TagCtrl:afficherTags should listTags be tags', inject(function($httpBackend) {
		$scope.afficherTags();
		$httpBackend.flush();
		expect($scope.listTags.length).toBe(2);
	}));

	/* TagCtrl:ajouterTag */

	it('TagCtrl:ajouterTag should set ajouterTag function', function() {
		expect($scope.ajouterTag).toBeDefined();
	});

	it('TagCtrl:ajouterTag should call /addTag on $scope.ajouterTag()', inject(function($httpBackend) {
		$scope.ajouterTag();
		$httpBackend.flush();
	}));

	it('TagCtrl:ajouterTag should tag be $scope.tagAdded', inject(function($httpBackend) {
		$scope.ajouterTag();
		$httpBackend.flush();
		expect(tag).toEqual($scope.tagFlag);
	}));

	/* TagCtrl:supprimerTag */

	it('TagCtrl:supprimerTag should set supprimerTag function', function() {
		expect($scope.preSupprimerTag).toBeDefined();
		expect($scope.supprimerTag).toBeDefined();
	});

	it('TagCtrl:supprimerTag should call /deleteTag on $scope.supprimerTag()', inject(function($httpBackend) {
		$scope.preSupprimerTag(tag);
		$scope.supprimerTag();
		$httpBackend.flush();
	}));

	it('TagCtrl:supprimerTag should tag be $scope.tagFlag', inject(function($httpBackend) {
		$scope.preSupprimerTag(tag);
		$scope.supprimerTag();
		$httpBackend.flush();
		expect(tag).toEqual($scope.tagFlag);
	}));

	/* TagCtrl:modifierTag */

	it('TagCtrl:modifierTag should set modifierTag function', function() {
		expect($scope.preModifierTag).toBeDefined();
		expect($scope.modifierTag).toBeDefined();
	});

	it('TagCtrl:modifierTag should call /updateTag on $scope.modifierTag()', inject(function($httpBackend) {
		$scope.preModifierTag(tag);
		$scope.modifierTag();
		$httpBackend.flush();
	}));

	it('TagCtrl:modifierTag should tag be $scope.tagFlag', inject(function($httpBackend) {
		$scope.preModifierTag(tag);
		$scope.modifierTag();
		$httpBackend.flush();
		expect(tag).toEqual($scope.tagFlag);
	}));

});