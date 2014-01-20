'use strict';

angular.module('cnedApp').controller('TtsTestCtrl', function($scope, $http) {

	$scope.editeur = {
				InitialValue: "Ceci est un test de l'outil de synthèse vocale "
			}
	$scope.espeakTextToSpeech = function() {

		

			var valeur = $scope.editeur.InitialValue;

			valeur = valeur.replace(/['"]/g,"");
		      $http.post("/espeaktexttospeechdemo", {
                    text: valeur
                }).success(function(data, status, headers, config) {
					console.log("ok");
	            }).error(function(data, status, headers, config) {
                    console.log("ko");
                });
	}

	$scope.festivalTextToSpeech = function() {

		

			var valeur = $scope.editeur.InitialValue;

			valeur = valeur.replace(/['"]/g,"");
		      $http.post("/festivaltexttospeechdemo", {
                    texte: valeur
                }).success(function(data, status, headers, config) {
					console.log("ok");
	            }).error(function(data, status, headers, config) {
                    console.log("ko");
                });
	}



});