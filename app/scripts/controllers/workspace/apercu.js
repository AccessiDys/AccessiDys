/*jshint loopfunc:true*/

'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $http, $rootScope, _) {

	$scope.data = [];
	$scope.blocks = [];
	$scope.blocksAlternative = [];
	$scope.plans = [];
	$scope.showApercu = false;
	$scope.counterElements = 0;
	$scope.stylePlan = '';

	$scope.init = function(idDocuments) {
		// initialiser le nombre d'appel du service
		var callsFinish = 0;
		// console.log("the documents length ==> ");
		// console.log(idDocuments);

		 $rootScope.profilId = '52f11d89d92a417042f87405';

		$http.post('/chercherTagsParProfil', {
			idProfil: $rootScope.profilId
		})
			.success(function(data) {
			if (data === 'err') {
				console.log('Désolé un problème est survenu lors de l\'enregistrement');
			} else {
				$scope.profiltags = data;
				console.log('proflies selected ==> ');
				console.log(data);
			}
		});

		if (idDocuments) {
			for (var i = 0; i < idDocuments.length; i++) {

				// console.log(idDocuments[i]);

				$http.post('/getDocument', {
					idDoc: idDocuments[i]
				}).success(function(data) {
					// incrémenter le nombre d'appel du service de 1
					callsFinish += 1;
					$scope.blocks.push(data);

					if (idDocuments.length === callsFinish) {
						$scope.position = 0;
						// implement show des blocks
						var traversed = traverse($scope.blocks);
						console.log('traversed');
						console.log(traversed);
						console.log('stylePlan fired ... ');
						$rootScope.$emit('stylePlan', 'Colorer les lignes');
					}
				}).error(function() {
					$scope.msg = 'ko';
				});

			}
		}
	};


	// init slider
	$rootScope.idDocument = ['52f11f8dbfc3659945c2ce9e'];
	$scope.init($rootScope.idDocument);


	function traverse(obj) {
		//for (var key in obj) {
		for (var key in obj) {
			if (typeof(obj[key]) === 'object') {
				var alreadyExist = _.findWhere($scope.blocksAlternative, {
					_id: obj[key]._id
				});

				if (!alreadyExist) {
					console.log(obj[key].text);
					if (obj[key].text !== '') {
						$scope.counterElements += 1;
						var debutStyle = '<p id="' + $scope.counterElements + '">';
						var finStyle = '</p>';

						for (var profiltag in $scope.profiltags) {
							if (obj[key].tag === $scope.profiltags[profiltag].tag) {
								console.log('in $scope.profiltags[profiltag].tag');
								console.log($scope.profiltags[profiltag]);

								$scope.plans.push({
									libelle: $scope.profiltags[profiltag].tagName,
									position: $scope.position
								});

								var style = $scope.profiltags[profiltag].texte;
								debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + $scope.counterElements + '">';
								break;
							}
						}
						obj[key].text = debutStyle + obj[key].text + finStyle;
					}
					$scope.blocksAlternative.push(obj[key]);
					$scope.position = $scope.position + 1;
				}

				if (obj[key].children.length > 0) {
					traverse(obj[key].children);
				}
			}
		}
		//}
	}

	$scope.setActive = function(idx) {
		$scope.blocksAlternative[idx].active = true;
		$scope.showApercu = true;
	};


	// Catch detection of key up
	$scope.$on('keydown', function(msg, code) {
		if (code === 37) {
			$scope.$broadcast('prevSlide');
		} else if (code === 39) {
			$scope.$broadcast('nextSlide');
		}
	});

	/*$scope.initPlayerAudio = function() {
		console.log("ng initialised");
		// Initialiser le lecteur audio
		audiojs.events.ready(function() {
			console.log('ng initialised 1.1 ');
			var as = audiojs.createAll();
		});
		var players = document.getElementsByClassName("player-audio");
		console.log(players);
		players.load();
	};*/

	$scope.playSong = function(source) {
		var audio = document.getElementById('player');
		audio.setAttribute('src', source);
		audio.load();
		audio.play();

		/*audiojs.events.ready(function() {
			console.log('ng initialised 1.1 ');
			var as = audiojs.createAll();
			as.play();
		});*/
	};

	$scope.printDocument = function() {
		window.print();
	};

});