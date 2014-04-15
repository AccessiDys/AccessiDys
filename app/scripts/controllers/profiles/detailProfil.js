/* File: detailProfil.js
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

angular.module('cnedApp').controller('detailProfilCtrl', function($scope, $http, configuration, $location, $rootScope) {
	/*global $:false */
	/*jshint sub:true*/

	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$('#detailProfil').show();
	$scope.displayDestination = false;
	$scope.logout = $rootScope.loged;
	$scope.favouriteProfile = false;

	$scope.target = $location.search()['idProfil'];

	$scope.initial = function() {
		$http.post(configuration.URL_REQUEST + '/chercherProfil', {
			profilID: $scope.target
		}).success(function(data) {
			$scope.profil = data;

			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: $scope.target
			}).success(function(data) {
				$scope.tagsByProfils = data;
				$scope.tests = [];
				for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
					if ($scope.tagsByProfils[i].tagName === 'Titre 01' || $scope.tagsByProfils[i].tagName === 'Titre 02' || $scope.tagsByProfils[i].tagName === 'Titre 03') {
						$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '">' + $scope.tagsByProfils[i].tagName + ' : Ceci est un exemple de' + $scope.tagsByProfils[i].tagName + ' </p>';
					}
					if ($scope.tagsByProfils[i].tagName === 'Paragraphe' || $scope.tagsByProfils[i].tagName === 'Exercice' || $scope.tagsByProfils[i].tagName === 'Énoncé' || $scope.tagsByProfils[i].tagName === 'Solution' || $scope.tagsByProfils[i].tagName === 'Résumé') {
						$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '">' + $scope.tagsByProfils[i].tagName + ' : CnedAdapt est une application qui permet d\'adapter les documents. </p>';
					}
				}


				if ($scope.logout) {
					if ($rootScope.currentUser && $rootScope.currentUser._id !== $scope.profil.owner) {
						$scope.varToSend = {
							profilID: $scope.profil._id,
							userID: $rootScope.currentUser._id,
							favoris: true
						};
						$http.post(configuration.URL_REQUEST + '/findUserProfilFavoris', $scope.varToSend)
							.success(function(data) {
								if (data === 'true') {
									$scope.favouriteProfile = false;
								} else {

									$scope.favouriteProfile = true;
								}



							});
					}
				}



			});

		});

	};

	$scope.profilApartager = function() {
		$('#shareModal').show();
	};

	/*load email form*/
	$scope.loadMail = function() {
		$scope.displayDestination = true;
	};
	/*regex email*/
	$scope.verifyEmail = function(email) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (reg.test(email)) {
			return true;
		} else {
			return false;
		}
	};

	$scope.socialShare = function() {
		$scope.destination = $scope.destinataire;
		$scope.encodeURI = encodeURIComponent($location.absUrl());
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			$('#confirmModal').modal('show');
			$('#shareModal').modal('hide');

		}
	};

	/*envoi de l'email au destinataire*/
	$scope.sendMail = function() {
		$('#confirmModal').modal('hide');

		$scope.destination = $scope.destinataire;
		$scope.loader = true;
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			if ($location.absUrl()) {

				if ($rootScope.currentUser.dropbox.accessToken) {

					if (configuration.DROPBOX_TYPE) {

						if ($rootScope.currentUser) {

							$scope.sendVar = {
								to: $scope.destinataire,
								content: ' a utilisé cnedAdapt pour partager le lien de son profil avec vous ! ' + $location.absUrl(),
								encoded: '<span> vient d\'utiliser cnedAdapt pour partager le lien de son profil avec vous !   <a href=' + $location.absUrl() + '>Lien du profil CnedAdapt</a> </span>',
								prenom: $rootScope.currentUser.local.prenom,
								fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
								doc: $location.absUrl()
							};
							$http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
								.success(function(data) {
									$('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
									$scope.sent = data;
									$scope.envoiMailOk = true;
									$scope.destinataire = '';
									$scope.loader = false;
									$scope.displayDestination = false;

									// $('#shareModal').modal('hide');


								});

						}



					}

				}

			}


		} else {
			$('.sendingMail').removeAttr('data-dismiss', 'modal');

			$('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');

		}
	};

	$scope.ajouterAmesFavoris = function() {
		if ($rootScope.currentUser && $scope.profil) {
			$http.post(configuration.URL_REQUEST + '/addUserProfilFavoris', {
				userID: $rootScope.currentUser._id,
				profilID: $scope.profil._id,
				favoris: true,
				actuel: false,
				default: false
			}).success(function(data) {
				$scope.favourite = data;
				$scope.favouriteProfile = false;
				$('#favoris').fadeIn('fast').delay(5000).fadeOut('fast');


			});
		}


	};



});