'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $http, $rootScope, _) {

	$scope.data = [];
	$scope.blocks = [];
	$scope.blocksAlternative = [];

	$scope.init = function(idDocuments) {
		// initialiser le nombre d'appel du service
		var callsFinish = 0;
		// console.log("the documents length ==> ");
		// console.log(idDocuments);

		$http.post('/chercherTagsParProfil', {
			idProfil: $rootScope.profil_id
		})
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de l'enregistrement");
			} else {
				$scope.profiltags = data;
				// console.log("proflies selected ==> ");
				// console.log(data);
			}
		});

		if (idDocuments) {
			for (var i = 0; i < idDocuments.length; i++) {

				// console.log(idDocuments[i]);

				$http.post("/getDocument", {
					idDoc: idDocuments[i]
				}).success(function(data, status, headers, config) {
					// incrémenter le nombre d'appel du service de 1
					callsFinish += 1;
					$scope.blocks.push(data);
					if (idDocuments.length === callsFinish) {
						// implement show des blocks
						traverse($scope.blocks);
					}
				}).error(function(data, status, headers, config) {
					$scope.msg = "ko";
				});

			}
		}
	}

	function traverse(obj) {
		for (var key in obj) {
			for (var key in obj) {
				if (typeof(obj[key]) == "object") {
					var alreadyExist = _.findWhere($scope.blocksAlternative, {
						_id: obj[key]._id
					});

					if (!alreadyExist) {
						if (obj[key].text) {
							for (var profiltag in $scope.profiltags) {
								if (obj[key].tag == $scope.profiltags[profiltag].tag) {
									var style = $scope.profiltags[profiltag].texte;
									var debutStyle = style.substring(style.indexOf("<p"), style.indexOf(">") + 1);
									var finStyle = "</p>";
									obj[key].text = debutStyle + obj[key].text + finStyle;
									// console.log("tag detected");
									// console.log(obj[key].text);
									break;
								}
							}
						}
						$scope.blocksAlternative.push(obj[key]);
					}

					if (obj[key].children.length > 0) {
						traverse(obj[key].children);
					}
				}
			}
		}
	}

	// init slider
	// $rootScope.idDocument = ["52cbe4e6ac6abf760f000005"];
	$scope.init($rootScope.idDocument);

	// Catch detection of key up
	$scope.$on('keydown', function(msg, code) {
		if (code == 37) {
			$scope.$broadcast("prevSlide");
		} else if (code == 39) {
			$scope.$broadcast("nextSlide");
		}
	});

	$scope.initPlayerAudio = function() {
		// console.log("ng initialised");
		// Initialiser le lecteur audio
		// audiojs.events.ready(function() {
		// 	console.log("ng initialised 1.1 ");
		// 	var as = audiojs.createAll();
		// });
		// var players = document.getElementsByClassName("player-audio");
		// console.log(players);
		// players.load();
	}

	$scope.playSong = function(source) {
		var audio = document.getElementById("player");
		audio.setAttribute("src", source);
		audio.load();
		audio.play();

		// audiojs.events.ready(function() {
		// 	console.log("ng initialised 1.1 ");
		// 	var as = audiojs.createAll();
		// 	as.play();
		// });
	}

});