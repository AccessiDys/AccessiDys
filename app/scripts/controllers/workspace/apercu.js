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

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $http, $rootScope, $location, _, configuration) {

	$scope.data = [];
	$scope.blocks = [];
	$scope.blocksAlternative = [];
	$scope.plans = [];
	$scope.blocksPlanTmp = [];
	$scope.blocksPositions = [];
	$scope.showApercu = 'hidden';
	$scope.showPlan = 'visible';
	$scope.counterElements = 0;
	$scope.stylePlan = '';
	$scope.styleParagraphe = '';

	$scope.init = function(idDocuments) {

		// initialiser le nombre d'appel du service
		var callsFinish = 0;
		/* activer le loader */
		$scope.loader = true;

		//$rootScope.profilId = '52fb65eb8856dce835c2ca86';
		if ($location.search().profil) {
			$rootScope.profilId = $location.search().profil;
		}

		// Selection des profils tags pour le style
		if ($rootScope.profilId) {
			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: $rootScope.profilId
			})
				.success(function(data) {
					if (data === 'err') {
						console.log('Désolé un problème est survenu lors de l\'enregistrement');
					} else {
						$scope.profiltags = data;
					}
				});
		}

		// Selection des tags pour le plan
		$http.get(configuration.URL_REQUEST + '/readTags')
			.success(function(data) {
				if (data === 'err') {
					console.log('Erreure tags');
				} else {
					$scope.tags = data;

					/* Ajouter l'emplacement du plan au Slide */
					$scope.blocksPlanTmp.push([]);

					if (idDocuments) {

						for (var k = 0; k < idDocuments.length; k++) {
							$scope.blocksPositions.push({
								id: idDocuments[k],
								position: k
							});
						}

						for (var i = 0; i < idDocuments.length; i++) {

							$http.post(configuration.URL_REQUEST + '/getDocument', {
								idDoc: idDocuments[i]
							}).success(function(data) {
								// incrémenter le nombre d'appel du service de 1
								callsFinish++;

								$scope.blocks = [];
								$scope.blocks.push(data);
								// implement show des blocks
								traverse($scope.blocks, $scope.blocks[0]._id);

								$scope.blocksPlanTmp.push($scope.blocksAlternative);
								$scope.blocksAlternative = [];
								// $scope.position++;

								if (idDocuments.length === callsFinish) {
									$scope.plans.forEach(function(entry) {
										entry.style = '<p ' + $scope.styleParagraphe + '> ' + entry.libelle + ' </p>';
									});
									$scope.plans = _.sortBy($scope.plans, 'position');

									/* Trier les blocks */
									$scope.blocksPlan = [];
									$scope.blocksPlan.push([]);
									for (var j = 0; j < idDocuments.length; j++) {
										$scope.blocksPlanTmp.forEach(function(blocksAlt) {
											if (blocksAlt[0] && blocksAlt[0]._id === idDocuments[j]) {
												$scope.blocksPlan.push(blocksAlt);
											}
										});
									}
									$scope.blocksPlanTmp = [];

									/* desactiver le loader */
									$scope.loader = false;
								}
							}).error(function() {
								$scope.msg = 'ko';
							});
						}
					}

				} /* fin else */
			});
	};

	// init slider
	//$rootScope.idDocument = ['53022b4f61e713f70fdfe189', '53025e8dd70cc8a42fd6b9df'];
	if ($location.search().document) {
		$rootScope.idDocument = [];
		if (typeof($location.search().document) === 'string') {
			$rootScope.idDocument.push($location.search().document);
		} else {
			$rootScope.idDocument = $location.search().document;
		}
	}
	$scope.init($rootScope.idDocument);

	/* Parcourir les blocks du document d'une facon recursive */

	function traverse(obj, parentId) {
		for (var key in obj) {
			if (typeof(obj[key]) === 'object') {
				if (obj[key].text !== '') {
					$scope.counterElements += 1;
					var debutStyle = '<p id="' + $scope.counterElements + '">';
					var finStyle = '</p>';
					var tagExist = false;
					var libelle = '';

					for (var profiltag in $scope.profiltags) {

						/* le cas d'un paragraphe */
						var style = $scope.profiltags[profiltag].texte;
						libelle = $scope.profiltags[profiltag].tagName;
						if (libelle.match('^Paragraphe')) {
							$scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
						}

						if (obj[key].tag === $scope.profiltags[profiltag].tag) {
							debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + $scope.counterElements + '" regle-style="" >';
							/* le cas d'un titre */
							if (libelle.match('^Titre')) {
								libelle = obj[key].text;
							}
							tagExist = true;
							break;
						}
					}

					// Selection du Tag si il n'existe pas sur les profilsTags
					if (!tagExist) {
						for (var i = 0; i < $scope.tags.length; i++) {
							if (obj[key].tag === $scope.tags[i]._id) {
								libelle = $scope.tags[i].libelle;
								if (libelle.match('^Titre')) {
									libelle = obj[key].text;
								}
								break;
							}
						}
					}

					for (var j = 0; j < $scope.blocksPositions.length; j++) {
						if (parentId === $scope.blocksPositions[j].id) {
							$scope.plans.push({
								libelle: libelle,
								block: obj[key]._id,
								position: $scope.blocksPositions[j].position
							});
							break;
						}
					}

					obj[key].text = debutStyle + obj[key].text + finStyle;
				}
				$scope.blocksAlternative.push(obj[key]);

				if (obj[key].children.length > 0) {
					traverse(obj[key].children, parentId);
				} else {
					obj[key].leaf = true;
				}

				if (obj[key]._id === parentId) {
					obj[key].root = true;
				}
			}
		}
	}

	/* Aller au Slide de position idx et du block blk */
	$scope.setActive = function(idx, blk) {
		$scope.blocksPlan[idx + 1].active = true;
		$scope.currentBlock = blk;
		$scope.showApercu = 'visible';
		$scope.showPlan = 'hidden';
	};

	/* Interception de l'evenement goToArea de la fin de la transition */
	$scope.$on('goToBlockSlide', function() {
		var blockId = '#' + $scope.currentBlock;
		if ($scope.currentBlock && $(blockId).offset()) {
			$('html, body').animate({
				scrollTop: $(blockId).offset().top
			}, 1200);
			$scope.currentBlock = null;
		} else {
			if ($('#plan').offset()) {
				$('html, body').animate({
					scrollTop: $('#plan').offset().top
				}, 500);
			}
		}
	});

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

	/* Imprimer le document */
	$scope.printDocument = function() {
		window.print();
	};

	/* Afficher/Masquer le menu escamotable */
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

	/* Aller au precedent */
	$scope.precedent = function() {
		$scope.$broadcast('prevSlide');
	};

	/* Aller au suivant */
	$scope.suivant = function() {
		$scope.$broadcast('nextSlide');
	};

	/* Aller au dernier */
	$scope.dernier = function() {
		if ($scope.blocksPlan.length > 0) {
			$scope.blocksPlan[$scope.blocksPlan.length - 1].active = true;
		}
	};

	/* Aller au premier */
	$scope.premier = function() {
		if ($scope.blocksPlan.length === 1) {
			$scope.blocksPlan[0].active = true;
		} else if ($scope.blocksPlan.length > 1) {
			$scope.blocksPlan[1].active = true;
		}
	};

	/* Aller au plan */
	$scope.plan = function() {
		if ($scope.blocksPlan.length > 0) {
			$scope.blocksPlan[0].active = true;
			if ($('#plan').offset()) {
				$('html, body').animate({
					scrollTop: $('#plan').offset().top
				}, 500);
			}
		}
	};

	/* Fixer/Défixer le menu lors du défilement */
	$(window).scroll(function() {
		if ($(window).scrollTop() >= $('.carousel-inner').offset().top) {
			$('.fixed_menu').addClass('attached');
		} else {
			$('.fixed_menu').removeClass('attached');
		}
	});

});