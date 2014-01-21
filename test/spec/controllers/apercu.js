'use strict';

describe('Controller:ApercuCtrl', function() {

	var $scope, controller;
	var profil_id = "52d0598c563380592bc1d703";
	var tag_id = "52c588a861485ed41c000002";
	var idDocument = ["52cb095fa8551d800b000012"];
	var profilTags = [{
		_id: "52d0598d563380592bc1d705",
		profil: "52d0598c563380592bc1d703",
		tag: "52d0598c563380592bc1d704",
		texte: "un example de text"
	}];
	var document = {
		"titre": "",
		"text": "",
		"image": "",
		"_id": "52cb58487b0e99880d000004",
		"__v": 0,
		"children": [{
			"titre": "fils 1",
			"text": "",
			"source": "files/decoup.thumb_0.9390108054503798.png",
			"children": [],
			"image": "",
			"_id": "52cb58487b0e99880d000005"
		}, {
			"titre": "fils 2",
			"text": "",
			"source": "files/decoup.thumb_0.6781442742794752.png",
			"children": [],
			"image": "",
			"_id": "52cb58487b0e99880d000006"
		}]
	};
	var source = "./files/audio.mp3";

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend) {
		$rootScope.profil_id = profil_id;
		$rootScope.idDocument = idDocument;

		$scope = $rootScope.$new();
		controller = $controller('ApercuCtrl', {
			$scope: $scope
		});

		// Mocker le service de recherche des tags  
		$httpBackend.whenPOST('/chercherTagsParProfil', {
			idProfil: $rootScope.profil_id
		}).respond(angular.toJson(profilTags));

		// Mocker le service de selection des documents
		$httpBackend.whenPOST('/getDocument', {
			idDoc: $rootScope.idDocument[0]
		}).respond(angular.toJson(document));

	}));

	/* ApercuCtrl:init */

	it('TagCtrl:init should set init function', inject(function($httpBackend) {
		expect($scope.init).toBeDefined();
	}));

	it('ApercuCtrl:init should call /chercherTagsParProfil and /getDocument on $scope.init()', inject(function($httpBackend, $rootScope) {
		$httpBackend.flush();
	}));

	it('ApercuCtrl:init should profilTags be $scope.profiltags', inject(function($httpBackend) {
		$httpBackend.flush();
		expect($scope.profiltags.length).toEqual(profilTags.length);
	}));

	it('ApercuCtrl:init should $scope.blocks be document on $scope.init()', inject(function($httpBackend) {
		$httpBackend.flush();
		expect($scope.blocks).toBeDefined();
		expect($scope.blocks.length).toBe(1);
	}));


	/* ApercuCtrl:playSong */
	it('TagCtrl:playSong should set playSong function', inject(function($httpBackend) {
		expect($scope.playSong).toBeDefined();
	}));

	/*it('TagCtrl:playSong should set playSong function', inject(function($httpBackend) {
		var $player = $('<audio id="player" src="" preload="auto"></audio>').appendTo('body');
		$scope.playSong(source);
	}));*/

});