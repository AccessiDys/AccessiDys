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

/*jshint loopfunc:true*/
/*global $:false */

'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $http, $rootScope, $location) {

	$scope.data = [];
	$scope.blocks = [];
	$scope.blocksAlternative = [];
	$scope.plans = [];
	$scope.blocksPlan = [];
	$scope.showApercu = 'hidden';
	$scope.showPlan = 'visible';
	$scope.counterElements = 0;
	$scope.stylePlan = '';
	$scope.styleParagraphe = '';

	$scope.init = function(idDocuments) {

		// initialiser le nombre d'appel du service
		var callsFinish = 0;
		// console.log("the documents length ==> ");
		// console.log(idDocuments);
		/* activer le loader */
		$scope.loader = true;
		//$rootScope.profilId = '52fb65eb8856dce835c2ca86';
		if ($location.search().profil) {
			$rootScope.profilId = $location.search().profil;
		}

		if ($rootScope.profilId) {
			$http.post('/chercherTagsParProfil', {
				idProfil: $rootScope.profilId
			})
				.success(function(data) {
					if (data === 'err') {
						console.log('Désolé un problème est survenu lors de l\'enregistrement');
					} else {
						$scope.profiltags = data;
						// console.log('proflies selected ==> ');
						// console.log(data);
					}
				});
		}

		/* Ajouter l'emplacement du plan au Slide */
		$scope.blocksPlan.push([]);

		if (idDocuments) {
			$scope.position = 0;
			for (var i = 0; i < idDocuments.length; i++) {

				$http.post('/getDocument', {
					idDoc: idDocuments[i]
				}).success(function(data) {
					// incrémenter le nombre d'appel du service de 1
					callsFinish++;

					$scope.blocks = [];
					$scope.blocks.push(data);
					// implement show des blocks
					traverse($scope.blocks);

					$scope.blocksPlan.push($scope.blocksAlternative);
					$scope.blocksAlternative = [];
					$scope.position++;

					if (idDocuments.length === callsFinish) {
						$scope.plans.forEach(function(entry) {
							entry.style = '<p ' + $scope.styleParagraphe + '> ' + entry.libelle + ' </p>';
						});
						/* desactiver le loader */
						$scope.loader = false;
					}
				}).error(function() {
					$scope.msg = 'ko';
				});
			}
		}
	};


	// init slider
	//$rootScope.idDocument = ['53022b4f61e713f70fdfe189', '53025e8dd70cc8a42fd6b9df'];
	console.log('the document ==> ');
	//console.log(typeof($location.search().document));
	if ($location.search().document) {
		$rootScope.idDocument = [];
		if (typeof($location.search().document) === 'string') {
			$rootScope.idDocument.push($location.search().document);
		} else {
			$rootScope.idDocument = $location.search().document;
		}
	}
	$scope.init($rootScope.idDocument);


	function traverse(obj) {
		for (var key in obj) {
			if (typeof(obj[key]) === 'object') {
				if (obj[key].text !== '') {
					$scope.counterElements += 1;
					var debutStyle = '<p id="' + $scope.counterElements + '">';
					var finStyle = '</p>';

					for (var profiltag in $scope.profiltags) {
						if (obj[key].tag === $scope.profiltags[profiltag].tag) {

							var style = $scope.profiltags[profiltag].texte;
							debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + $scope.counterElements + '" regle-style="" >';

							var libelle = $scope.profiltags[profiltag].tagName;
							/* le cas d'un titre */
							if (libelle.match('^Titre')) {
								libelle = obj[key].text;
							}

							/* le cas d'un paragraphe */
							if (libelle.match('^Paragraphe')) {
								$scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
							}

							$scope.plans.push({
								libelle: libelle,
								position: $scope.position
							});

							break;
						}
					}
					obj[key].text = debutStyle + obj[key].text + finStyle;
				}
				$scope.blocksAlternative.push(obj[key]);

				if (obj[key].children.length > 0) {
					traverse(obj[key].children);
				}
			}
		}
	}

	$scope.setActive = function(idx) {
		$scope.blocksPlan[idx + 1].active = true;
		$scope.showApercu = 'visible';
		$scope.showPlan = 'hidden';
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

	$scope.afficherMenu = function() {
		if ($('.open_menu').hasClass('shown')) {
			$('.open_menu').removeClass('shown');
			$('.open_menu').parent('.menu_wrapper').animate({
				'margin-left': '140px'
			}, 100);
		} else {
			$('.open_menu').addClass('shown');
			$('.open_menu').parent('.menu_wrapper').animate({
				'margin-left': '0'
			}, 100);
		}
	};

	$scope.precedent = function() {
		$scope.$broadcast('prevSlide');
	};

	$scope.suivant = function() {
		$scope.$broadcast('nextSlide');
	};

	$scope.dernier = function() {
		if ($scope.blocksPlan.length > 0) {
			$scope.blocksPlan[$scope.blocksPlan.length - 1].active = true;
		}
	};

	$scope.premier = function() {
		if ($scope.blocksPlan.length === 1) {
			$scope.blocksPlan[0].active = true;
		} else if ($scope.blocksPlan.length > 1) {
			$scope.blocksPlan[1].active = true;
		}
	};

	$scope.plan = function() {
		if ($scope.blocksPlan.length > 0) {
			$scope.blocksPlan[0].active = true;
		}
	};

	$(window).scroll(function() {
		if ($(window).scrollTop() >= $('.carousel-inner').offset().top) {
			$('.fixed_menu').addClass('attached');
		} else {
			$('.fixed_menu').removeClass('attached');
		}
	});

	$scope.gotoPlan = function() {
		$scope.blocksPlan[0].active = true;
		// setTimeout(function () {
		//   $('html, body').animate({scrollTop: $('#bottom').offset().top}, 2000);
		// }, 300);
	};

});