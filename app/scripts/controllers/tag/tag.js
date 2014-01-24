'use strict';

angular.module('cnedApp').controller('TagCtrl', function($scope, $http) {

	$scope.afficherTags = function() {
		$http.get('/readTags')
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de l\'affichge des tags');
				} else {
					$scope.listTags = data;
				}
			});
	};

	$scope.ajouterTag = function() {
		$http.post('/addTag', $scope.tag)
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de l\'enregistrement');
				} else {
					$scope.tagFlag = data; /* destiné aux tests unitaires */
					$scope.tag = {};
					$scope.afficherTags();
				}
			});
	};

	$scope.supprimerTag = function() {
		$http.post('/deleteTag', $scope.fiche)
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de la suppression');
				} else {
					$scope.tagFlag = data; /* destiné aux tests unitaires */
					$scope.afficherTags();
					$scope.fiche = {};
				}
			});
	};

	$scope.modifierTag = function() {
		$http.post('/updateTag', $scope.fiche)
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de la modification');
				} else {
					$scope.tagFlag = data; /* destiné aux tests unitaires */
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