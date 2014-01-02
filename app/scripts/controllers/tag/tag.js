'use strict';

angular.module('cnedApp').controller('TagCtrl', function($scope, $http) {

	$scope.afficherTags = function() {
		$http.get('/readTags')
			.success(function(data) {
			if (data != 'err') {
				$scope.listTags = data;
			}
		});
	};

	$scope.ajouterTag = function() {
		$http.post('/addTag', $scope.tag)
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de l'enregistrement");
			} else {
				$scope.tag = {};
				$scope.afficherTags();
			}
		});
	};

	$scope.supprimerTag = function() {
		$http.post('/deleteTag', $scope.fiche)
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de la suppression");
			} else {
				$scope.afficherTags();
			}
		});
	};

	$scope.modifierTag = function() {
		$http.post('/updateTag', $scope.fiche)
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de la suppression");
			} else {
				$scope.afficherTags();
				$scope.fiche = {};
			}
		});
	};

	$scope.preModifierTag = function(tag) {
		$scope.fiche = tag;
	};

	$scope.preSupprimerTag = function(tag) {
		$scope.fiche = tag;
	};

	$scope.afficherTags();

});