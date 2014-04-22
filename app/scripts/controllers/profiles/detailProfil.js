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
		var toSendCherche = {
			searchedProfile: $scope.target
		};
		if (localStorage.getItem('compteId')) {
			toSendCherche.id = localStorage.getItem('compteId');
		}
		console.log(toSendCherche);
		$http.post(configuration.URL_REQUEST + '/chercherProfil', toSendCherche)
			.success(function(data) {
				console.log(data);
				$scope.profil = data;
				$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
					idProfil: $scope.target
				}).success(function(data) {
					$scope.tagsByProfils = data;
					$scope.tests = [];

					$scope.listTags = JSON.parse(localStorage.getItem('listTags'));
					for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
						for (var j = $scope.listTags.length - 1; j >= 0; j--) {
							if ($scope.tagsByProfils[i].tag == $scope.listTags[j]._id) {
								if ($scope.listTags[j].libelle.toUpperCase().match('^TITRE')) {
									$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '">' + $scope.listTags[j].libelle + ' : Ceci est un exemple de' + $scope.listTags[j].libelle + ' </p>';
								} else {
									$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '">' + $scope.listTags[j].libelle + ' : CnedAdapt est une application qui permet d\'adapter les documents. </p>';
								}
								break;
							}

						};

					}

					if ($scope.logout) {
						if ($rootScope.currentUser && $scope.profil && $rootScope.currentUser._id !== $scope.profil.owner) {
							$scope.varToSend = {
								profilID: $scope.profil._id,
								userID: $rootScope.currentUser._id,
								favoris: true
							};
							var tmpToSend = {
								id: $rootScope.currentUser.local.token,
								sendedVars: $scope.varToSend
							}
							$http.post(configuration.URL_REQUEST + '/findUserProfilFavoris', tmpToSend)
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
			console.log('New Profile about to be added');
			var token = {
				id: $rootScope.currentUser.local.token,
				newFav: {
					userID: $rootScope.currentUser._id,
					profilID: $scope.profil._id,
					favoris: true,
					actuel: false,
					default: false
				}
			};
			$http.post(configuration.URL_REQUEST + '/addUserProfilFavoris', token).success(function(data) {
				$scope.favourite = data;
				$scope.favouriteProfile = false;
				$('#favoris').fadeIn('fast').delay(5000).fadeOut('fast');
				$rootScope.$broadcast('initCommon');

			});
		}


	};

	$scope.afficherEditionProfil = function() {
		if ($scope.logout && $rootScope.currentUser && $scope.profil) {
			if ($rootScope.currentUser._id == $scope.profil.owner) {
				return true;
			}
		}
		return false;
	}

	$scope.afficherDupliquerProfil = function() {
		if ($scope.logout && $rootScope.currentUser && $scope.profil) {
			if ($rootScope.currentUser._id != $scope.profil.owner) {
				return true;
			}
		}
		return false;
	}



});