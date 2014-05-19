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

angular.module('cnedApp').controller('detailProfilCtrl', function($scope, $http, configuration, $location, $rootScope, $window) {
	/*global $:false */
	/*jshint sub:true*/

	/* Initialisations */
	$scope.loader = false;
	$scope.successMod = 'Profil Modifie avec succes !';
	$scope.successAdd = 'Profil Ajoute avec succes !';
	$scope.successDefault = 'defaultProfileSelection';
	$scope.displayText = '<p>CnedAdapt est une application qui permet d\'adapter les documents.</p>';
	$scope.cancelDefault = 'cancelDefault';
	$scope.flag = false;
	$scope.colorLists = ['Couleur par défaut', 'Colorer les lignes', 'Colorer les mots', 'Surligner les mots', 'Surligner les lignes', 'Colorer les syllabes'];
	$scope.weightLists = ['Gras', 'Normal'];
	$scope.headers = ['Nom', 'Descriptif', 'Action'];
	$scope.profilTag = {};
	//$scope.profil = {};
	$scope.listTag = {};
	$scope.testEnv = false;
	$scope.editTag = null;
	$scope.colorList = null;
	$scope.tagStyles = [];
	$scope.deletedParams = [];
	$scope.tagProfilInfos = [];
	$scope.variableFlag = false;
	$scope.trashFlag = false;
	$scope.hideVar = true;
	$scope.label_action = 'label_action';
	$scope.policeLists = ['Arial', 'opendyslexicregular', 'Times New Roman'];
	$scope.tailleLists = [{
		number: '8',
		label: 'eight'
	}, {
		number: '10',
		label: 'ten'
	}, {
		number: '12',
		label: 'twelve'
	}, {
		number: '14',
		label: 'fourteen'
	}, {
		number: '16',
		label: 'sixteen'
	}, {
		number: '18',
		label: 'eighteen'
	}, {
		number: '20',
		label: 'tweenty'
	}];
	$scope.interligneLists = [{
		number: '10',
		label: 'ten'
	}, {
		number: '14',
		label: 'fourteen'
	}, {
		number: '18',
		label: 'eighteen'
	}, {
		number: '22',
		label: 'tweentytwo'
	}, {
		number: '26',
		label: 'tweentysix'
	}, {
		number: '30',
		label: 'thirty'
	}, {
		number: '35',
		label: 'thirtyfive'
	}, {
		number: '40',
		label: 'forty'
	}, {
		number: '45',
		label: 'fortyfive'
	}];

	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$('#titreDocumentApercu').hide();
	$('#detailProfil').show();
	$scope.displayDestination = false;
	$scope.logout = $rootScope.loged;
	$scope.favouriteProfile = false;
	$scope.afficherDupliquer = false;
	$scope.afficherEdition = false;

	$scope.target = $location.search()['idProfil'];
	$scope.initial = function() {
		var toSendCherche = {
			searchedProfile: $scope.target
		};
		if (localStorage.getItem('compteId')) {
			toSendCherche.id = localStorage.getItem('compteId');
		}
		$http.post(configuration.URL_REQUEST + '/chercherProfil', toSendCherche)
			.success(function(data) {
			$scope.profil = data;
			console.log($scope.profil);
			if (localStorage.getItem('compteId')) {
				var dataProfile = {
					id: localStorage.getItem('compteId')
				};
			}
			/*pour les users non connectés*/
			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: $scope.profil._id
			}).success(function(data) {
				console.log('inside=================++>');
				$scope.tagsByProfils = data;
				console.log(data);
				$scope.tests = [];
				$scope.requestToSend = {};
				if (localStorage.getItem('compteId')) {
					$scope.requestToSend = {
						id: localStorage.getItem('compteId')
					};
				}
				if (!localStorage.getItem('listTags')) {
					$http.post(configuration.URL_REQUEST + '/chercherProfilParDefaut')
						.success(function(data) {
						if (data) {
							$scope.chercherProfilParDefautFlag = data;
							$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
								idProfil: data.profilID
							}).success(function(data) {
								localStorage.setItem('listTagsByProfil', JSON.stringify(data));
								$http.get(configuration.URL_REQUEST + '/readTags', {
									params: $scope.requestToSend
								}).success(function(data) {
									localStorage.setItem('listTags', JSON.stringify(data));
									$scope.listTags = JSON.parse(localStorage.getItem('listTags'));

									if ($scope.listTags) {

										for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
											for (var j = $scope.listTags.length - 1; j >= 0; j--) {
												if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
													$scope.tagsByProfils[i].position = $scope.listTags[j].position;
												}
												$scope.tagsByProfils.sort(function(a, b) {
													return a.position - b.position
												});

											}
										}



										for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
											for (var j = $scope.listTags.length - 1; j >= 0; j--) {
												if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {

													if ($scope.listTags[j].libelle.toUpperCase().match('^TITRE')) {
														$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '"><span style="color:#000">' + $scope.listTags[j].libelle + '</span> : Ceci est un exemple de' + $scope.listTags[j].libelle + ' </p>';
													} else {
														$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '"><span style="color:#000">' + $scope.listTags[j].libelle + '</span> : CnedAdapt est une application qui permet d\'adapter les documents. </p>';

													}
													break;
												}

											}

										}
									}

								});
							});
						}
					});
				}
				$scope.listTags = JSON.parse(localStorage.getItem('listTags'));

				if ($scope.listTags) {


					for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
						for (var j = $scope.listTags.length - 1; j >= 0; j--) {
							if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
								$scope.tagsByProfils[i].position = $scope.listTags[j].position;
							}
							$scope.tagsByProfils.sort(function(a, b) {
								return a.position - b.position
							});

						}
					}



					for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
						for (var j = $scope.listTags.length - 1; j >= 0; j--) {
							if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {

								if ($scope.listTags[j].libelle.toUpperCase().match('^TITRE')) {
									$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '"><span style="color:#000">' + $scope.listTags[j].libelle + '</span> : Ceci est un exemple de' + $scope.listTags[j].libelle + ' </p>';
								} else {
									$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '"><span style="color:#000">' + $scope.listTags[j].libelle + '</span> : CnedAdapt est une application qui permet d\'adapter les documents. </p>';

								}
								break;
							}

						}

					}
				}


			});

			$http.get(configuration.URL_REQUEST + '/profile', {
				params: dataProfile
			})
				.success(function(result) {
				$rootScope.currentUser = result;
				$scope.profileFlag = result;
				if ($rootScope.currentUser && $scope.profil) {

					if ($rootScope.currentUser._id !== $scope.profil.owner) {
						$scope.afficherDupliquer = true;
					}
					if ($rootScope.currentUser._id === $scope.profil.owner && !$scope.profil.delegated) {
						$scope.afficherEdition = true;
					}
					if ($scope.profil.delegated || $scope.profil.preDelegated) {
						$scope.favouriteProfile = false;
					}

					if ($scope.profil.delegated) {
						$http.post(configuration.URL_REQUEST + '/findByUserProfil', {
							userID: $scope.profil.owner,
							profilID: $scope.profil._id
						})
							.success(function(result) {
							if (result && result.delegatedID && result.delegatedID === $rootScope.currentUser._id) {
								$scope.afficherEdition = true;
							}
						});
					}
				}

				$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
					idProfil: $scope.target
				}).success(function(data) {
					$scope.tagsByProfils = data;
					$scope.tests = [];
					$scope.requestToSend = {};
					if (localStorage.getItem('compteId')) {
						$scope.requestToSend = {
							id: localStorage.getItem('compteId')
						};
					}
					if (!localStorage.getItem('listTags')) {
						$http.post(configuration.URL_REQUEST + '/chercherProfilParDefaut')
							.success(function(data) {
							if (data) {
								$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
									idProfil: data.profilID
								}).success(function(data) {
									localStorage.setItem('listTagsByProfil', JSON.stringify(data));
									$http.get(configuration.URL_REQUEST + '/readTags', {
										params: $scope.requestToSend
									}).success(function(data) {
										localStorage.setItem('listTags', JSON.stringify(data));
									});
								});
							}
						});
					}
					$scope.listTags = JSON.parse(localStorage.getItem('listTags'));

					if ($scope.listTags) {
						for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
							for (var j = $scope.listTags.length - 1; j >= 0; j--) {
								if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
									$scope.tagsByProfils[i].position = $scope.listTags[j].position;
								}
								$scope.tagsByProfils.sort(function(a, b) {
									return a.position - b.position
								});

							}
						}



						for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
							for (var j = $scope.listTags.length - 1; j >= 0; j--) {
								if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {

									if ($scope.listTags[j].libelle.toUpperCase().match('^TITRE')) {
										$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '"><span style="color:#000">' + $scope.listTags[j].libelle + '</span> : Ceci est un exemple de' + $scope.listTags[j].libelle + ' </p>';
									} else {
										$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '"><span style="color:#000">' + $scope.listTags[j].libelle + '</span> : CnedAdapt est une application qui permet d\'adapter les documents. </p>';

									}
									break;
								}

							}

						}
					}
					/* if delegation is not accepted */
					if (!$scope.profil.delegated) {

						$http.get(configuration.URL_REQUEST + '/profile', {
							params: dataProfile
						})
							.success(function(result) {
							if ($rootScope.currentUser && $scope.profil && $rootScope.currentUser._id !== $scope.profil.owner) {
								$scope.varToSend = {
									profilID: $scope.profil._id,
									userID: $rootScope.currentUser._id
								};
								var tmpToSend = {
									id: $rootScope.currentUser.local.token,
									sendedVars: $scope.varToSend
								};
								/*Default de l'admin avec meme profilID*/
								$http.post(configuration.URL_REQUEST + '/findUserProfil', tmpToSend)
									.success(function(data) {

									if (data) {
										$scope.favouriteProfile = false;
									} else {
										$http.post(configuration.URL_REQUEST + '/findUserProfilFavoris', tmpToSend)
											.success(function(data) {
											if (data === 'true') {
												$scope.favouriteProfile = false;

											}
											if (data === 'false') {
												$scope.favouriteProfile = true;

											}
											if ($scope.profil.preDelegated) {

												$scope.favouriteProfile = false;
											}
										});

									}



								});

							}
						});
					}



				});



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
		//$scope.loader = true;
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {


			if ($location.absUrl()) {

				if ($rootScope.currentUser.dropbox.accessToken) {

					if (configuration.DROPBOX_TYPE) {

						if ($rootScope.currentUser) {

							$scope.sendVar = {
								to: $scope.destinataire,
								content: ' vient de partager avec vous un profil sur l\'application CnedAdapt.  ' + $location.absUrl(),
								encoded: '<span> vient de partager avec vous un profil sur l\'application CnedAdapt.   <a href=' + $location.absUrl() + '>Lien de ce profil</a> </span>',
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
								//$scope.loader = false;
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

	$scope.afficherDupliquerProfil = function() {
		if ($scope.logout && $rootScope.currentUser && $scope.profil) {
			if ($rootScope.currentUser._id !== $scope.profil.owner) {
				return true;
			}
		}
		return false;
	};



	//Edition StyleTag
	$scope.editerStyleTag = function() {

		console.log('editerStyleTag ==> ');
		console.log($scope.currentTagProfil);

		if (!$scope.currentTagProfil) {

			console.log('in ajout');

			$scope.currentTagEdit = JSON.parse($scope.editTag);
			for (var i = $scope.listTags.length - 1; i >= 0; i--) {
				if ($scope.listTags[i]._id === $scope.currentTagEdit._id) {
					$scope.listTags[i].disabled = true;
					break;
				}
			}

			var textEntre = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';

			$scope.tagStyles.push({
				tag: $scope.currentTagEdit._id,
				tagName: $scope.currentTagEdit.libelle,
				profil: $scope.lastDocId,
				police: $scope.policeList,
				taille: $scope.tailleList,
				interligne: $scope.interligneList,
				styleValue: $scope.weightList,
				coloration: $scope.colorList,
				texte: textEntre,
				state: true

			});

			angular.element($('.shown-text-edit').text($('.shown-text-edit').text()));
			angular.element($('#style-affected-edit').removeAttr('style'));

		} else {
			/* Tag sélectionné */

			if (!$scope.currentTagProfil.state) {

				var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';

				/* Liste tags modifiés */
				$scope.tagProfilInfos.push({
					id: $scope.currentTagProfil._id,
					texte: mytext,
					police: $scope.policeList,
					taille: $scope.tailleList,
					interligne: $scope.interligneList,
					styleValue: $scope.weightList,
					coloration: $scope.colorList
				});

				/*for (var j = $scope.tagStyles.length - 1; j >= 0; j--) {
					if ($scope.tagStyles[j]._id === $scope.currentTagProfil._id) {
						$scope.tagStyles[j].police = $scope.policeList;
						$scope.tagStyles[j].taille = $scope.tailleList;
						$scope.tagStyles[j].interligne = $scope.interligneList;
						$scope.tagStyles[j].styleValue = $scope.weightList;
						$scope.tagStyles[j].coloration = $scope.colorList;
					}
				}*/

				$scope.currentTagProfil = null;
				$scope.noStateVariableFlag = true;

			} else {

				/*$scope.currentTagProfil.police = $scope.policeList;
				$scope.currentTagProfil.taille = $scope.tailleList;
				$scope.currentTagProfil.interligne = $scope.interligneList;
				$scope.currentTagProfil.styleValue = $scope.weightList;
				$scope.currentTagProfil.coloration = $scope.colorList;
				$scope.currentTagProfil.texte = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';
				$scope.currentTagProfil = null;*/

			}
			// $scope.currentTagProfil = null;

		}

		$('#selectId option').eq(0).prop('selected', true);
		$('#selectId').prop('disabled', false);
		// $('#editValidationButton').prop('disabled', true);
		$scope.hideVar = true;

		$scope.editTag = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.weightList = null;
		$scope.colorList = null;
		$scope.colorationCount = 0;
		$scope.editStyleChange('initialiseColoration', null);


		//set customSelect jquery plugin span text to empty string
		$('.shown-text-edit').removeAttr('style');
		$('.shown-text-edit').text('CnedAdapt est une application qui permet d\'adapter les documents.');
		$('select[ng-model="editTag"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');


	};

	// Affichage des differents profils sur la page avec effacement des styles
	$scope.afficherProfilsClear = function() {
		$scope.tagList = {};
		$scope.policeList = {};
		$scope.tailleList = {};
		$scope.interligneList = {};
		$scope.weightList = {};
		$scope.colorList = {};
		$scope.tagStyles = [];
		angular.element($('.shown-text-add').text($('.shown-text-add').text()));
		angular.element($('.shown-text-edit').text($('.shown-text-edit').text()));
		angular.element($('.shown-text-duplique').text($('.shown-text-duplique').text()));
		angular.element($('.shown-text-add').css('font-family', ''));
		angular.element($('.shown-text-add').css('font-size', ''));
		angular.element($('.shown-text-add').css('line-height', ''));
		angular.element($('.shown-text-add').css('font-weight', ''));
		angular.element($('.shown-text-add').text($scope.editInitText));
		angular.element($('.shown-text-edit').removeAttr('style'));
		angular.element($('.shown-text-duplique').removeAttr('style'));

		//set customSelect jquery plugin span text to empty after cancel
		$('select[ng-model="editTag"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');

		$scope.editTag = null;
		$scope.hideVar = true;
		$scope.tagList = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.weightList = null;
		$scope.colorList = null;
		$scope.affichage = false;
		$('#selectId').prop('disabled', false);
		$scope.currentTagProfil = null;
	};


	$scope.checkStyleTag = function() {
		if ($scope.tagStyles.length > 0) {
			return false;
		}
		if ($scope.tagStyles.length === 0 && $scope.trashFlag) {
			return false;
		}
		return true;
	};

	//verification des champs avant validation lors de la modification
	$scope.beforeValidationModif = function() {
		$scope.addFieldError = [];
		$scope.affichage = false;

		if ($scope.profMod.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;


		}
		if ($scope.profMod.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;


		}
		if ($scope.editTag == null) { // jshint ignore:line
			$scope.addFieldError.push(' Règle ');
			$scope.affichage = true;


		}
		if ($scope.policeList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Police ');
			$scope.affichage = true;

		}
		if ($scope.tailleList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Taille ');
			$scope.affichage = true;

		}
		if ($scope.interligneList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Interligne ');
			$scope.affichage = true;

		}
		if ($scope.colorList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Coloration ');
			$scope.affichage = true;

		}
		if ($scope.weightList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Style ');
			$scope.affichage = true;

		}
		if ($scope.addFieldError.length === 0) {
			$scope.editerStyleTag();
			$scope.affichage = false;
		}
	};

	//Supression d'un tag lors de l'edition 
	$scope.editionSupprimerTag = function(parameter) {

		if (parameter.state) {


			var index = $scope.tagStyles.indexOf(parameter);

			if (index > -1) {
				$scope.tagStyles.splice(index, 1);
			}

			for (var k = $scope.listTags.length - 1; k >= 0; k--) {
				if (parameter.tag === $scope.listTags[k]._id) {
					$scope.listTags[k].disabled = false;
				}
			}
			$scope.currentTagProfil = null;
			$scope.policeList = null;
			$scope.tailleList = null;
			$scope.interligneList = null;
			$scope.colorList = null;
			$scope.weightList = null;

		} else {

			for (var i = $scope.listTags.length - 1; i >= 0; i--) {
				if (parameter.tag === $scope.listTags[i]._id) {
					$scope.listTags[i].disabled = false;
				}
			}

			var index2 = $scope.tagStyles.indexOf(parameter);

			if (index2 > -1) {
				$scope.tagStyles.splice(index2, 1);
			}

			$scope.deletedParams.push({
				param: parameter

			});

			$scope.trashFlag = true;
			$scope.currentTagProfil = null;
		}
		// $('#editValidationButton').prop('disabled', true);
		$('#selectId option').eq(0).prop('selected', true);
		// $scope.currentTagProfil = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.colorList = null;
		$scope.weightList = null;
		$('#selectId').removeAttr('disabled');
	};

	//Griser select après validation
	$scope.affectDisabled = function(param) {
		if (param) {
			return true;
		} else {
			return false;
		}
	};

	//Affichage des tags
	$scope.afficherTags = function() {
		$http.get(configuration.URL_REQUEST + '/readTags', {
			params: $scope.requestToSend
		})
			.success(function(data) {
			$scope.listTags = data;
			// Set disabled tags
			for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
				for (var j = $scope.listTags.length - 1; j >= 0; j--) {
					if ($scope.listTags[j]._id === $scope.tagStyles[i].tag) {
						$scope.listTags[j].disabled = true;
					}
				}
			}
		});
	};
	/*jshint loopfunc: true */
	$scope.dupliqueModifierTag = function(parameter) {
		$scope.hideVar = false;
		$('.label_action').removeClass('selected_label');
		$('#' + parameter._id).addClass('selected_label');
		$scope.currentTagProfil = parameter;
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if (parameter.tag === $scope.listTags[i]._id) {

				$scope.listTags[i].disabled = true;
				angular.element($('#selectId option').each(function() {
					var itemText = $(this).text();
					if (itemText === parameter.tagName) {
						$(this).prop('selected', true);
						$('#selectId').prop('disabled', 'disabled');
						$('#dupliqueValidationButton').prop('disabled', false);
					}
				}));
				$('#dupliqueValidationButton').prop('disabled', false);
				$scope.editTag = parameter.tagName;
				$scope.policeList = parameter.police;
				$scope.tailleList = parameter.taille;
				$scope.interligneList = parameter.interligne;
				$scope.weightList = parameter.styleValue;
				$scope.colorList = parameter.coloration;

				$scope.dupliqueStyleChange('police', $scope.policeList);
				$scope.dupliqueStyleChange('taille', $scope.tailleList);
				$scope.dupliqueStyleChange('interligne', $scope.interligneList);
				$scope.dupliqueStyleChange('style', $scope.weightList);
				$scope.dupliqueStyleChange('coloration', $scope.colorList);

				//set span text value of customselect
				$('select[ng-model="editTag"] + .customSelect .customSelectInner').text(parameter.tagName);
				$('select[ng-model="policeList"] + .customSelect .customSelectInner').text(parameter.police);
				$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text(parameter.taille);
				$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text(parameter.interligne);
				$('select[ng-model="weightList"] + .customSelect .customSelectInner').text(parameter.styleValue);
				$('select[ng-model="colorList"] + .customSelect .customSelectInner').text(parameter.coloration);
			}
		}
	};

	$scope.preDupliquerProfil = function() {

		$scope.profMod = angular.copy($scope.profil);
		$scope.profMod.nom = $scope.profMod.nom + ' Copie';
		$scope.profMod.descriptif = $scope.profMod.descriptif + ' Copie';

		$scope.oldProfil = {
			nom: $scope.profil.nom,
			owner: $scope.profil.owner
		};

		$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
			idProfil: $scope.profMod._id
		})
			.success(function(data) {
			$scope.tagStylesFlag = data; /* Unit tests*/
			$scope.tagStyles = data;

			$scope.tagStyles.forEach(function(item) {
				item.state = true;
			});
			$scope.afficherTags();
		});
	};

	//OnchangeStyle du profil
	$scope.dupliqueStyleChange = function(operation, value) {
		$rootScope.$emit('reglesStyleChange', {
			'operation': operation,
			'element': 'shown-text-duplique',
			'value': value
		});
	};

	/* envoi de l'email au destinataire */
	$scope.sendEmailDuplique = function() {
		$http.post(configuration.URL_REQUEST + '/findUserById', {
			idUser: $scope.oldProfil.owner
		}).success(function(data) {
			$scope.findUserByIdFlag = data;
			if (data) {
				var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
				$scope.sendVar = {
					emailTo: data.local.email,
					content: '<span> ' + fullName + ' vient d\'utiliser cnedAdapt pour dupliquer votre profil : ' + $scope.oldProfil.nom + '. </span>',
					subject: fullName + ' a dupliqué votre profil'
				};
				$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
					.success(function() {});
			}
		});
	};

	//Dupliquer les tags du profil
	$scope.dupliqueProfilTag = function() {
		if (!$scope.token || !$scope.token.id) {
			$scope.token = {
				id: localStorage.getItem('compteId')
			};
		}
		var compte = 0;
		var tailleTagStyles = $scope.tagStyles.length;
		$scope.tagStyles.forEach(function(item) {
			if (item.state) {
				var profilTag = {
					tag: item.tag,
					texte: item.texte,
					profil: $scope.profMod._id,
					tagName: item.tagName,
					police: item.police,
					taille: item.taille,
					interligne: item.interligne,
					styleValue: item.styleValue,
					coloration: item.coloration
				};

				$http.post(configuration.URL_REQUEST + '/ajouterProfilTag', {
					id: $scope.token.id,
					profilTag: profilTag
				})
					.success(function(data) {
					if (data === 'err') {} else {
						compte++;
						$scope.editionFlag = data; /* unit tests*/
						if (compte === tailleTagStyles) {
							$scope.tagStyles.length = 0;
							$scope.tagStyles = [];
							$scope.tagList = {};
							$scope.policeList = null;
							$scope.tailleList = null;
							$scope.interligneList = null;
							$scope.weightList = null;
							$scope.listeProfils = {};
							$scope.editTag = null;
							$scope.colorList = null;
							angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
							angular.element($('.shown-text-edit').css('font-family', ''));
							angular.element($('.shown-text-edit').css('font-size', ''));
							angular.element($('.shown-text-edit').css('line-height', ''));
							angular.element($('.shown-text-edit').css('font-weight', ''));
							$('#dupliqueModal').on('hidden.bs.modal', function() {
								var profilLink = $location.absUrl();
								profilLink = profilLink.substring(0, profilLink.lastIndexOf('#/detailProfil?idProfil'));
								profilLink = profilLink + '#/profiles';
								$window.location.href = profilLink;
							});
						}
					}
				});
			}
		});
	};

	//Dupliquer le profil
	$scope.dupliquerFavoritProfil = function() {
		if (!$scope.token || !$scope.token.id) {
			$scope.token = {
				id: localStorage.getItem('compteId')
			};
		}

		$scope.addFieldError = [];
		if ($scope.profMod.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;
		}
		if ($scope.profMod.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;
		}
		if ($scope.addFieldError.length === 0) { // jshint ignore:line
			$('.dupliqueProfil').attr('data-dismiss', 'modal');
			var newProfile = {};
			newProfile.photo = './files/profilImage/profilImage.jpg';
			newProfile.owner = $scope.currentUser._id;
			newProfile.nom = $scope.profMod.nom;
			newProfile.descriptif = $scope.profMod.descriptif;
			$scope.token.newProfile = newProfile;
			$http.post(configuration.URL_REQUEST + '/ajouterProfils', $scope.token)
				.success(function(data) {
				$scope.sendEmailDuplique();
				$scope.profilFlag = data; /*unit tests*/
				$scope.profMod._id = $scope.profilFlag._id;
				$rootScope.updateListProfile = !$rootScope.updateListProfile;
				$scope.addUserProfil = {
					profilID: $scope.profilFlag._id,
					userID: newProfile.owner,
					favoris: false,
					actuel: false,
					default: false
				};
				$http.post(configuration.URL_REQUEST + '/addUserProfil', $scope.addUserProfil)
					.success(function(data) {
					$scope.userProfilFlag = data; /*unit tests*/
					$scope.dupliqueProfilTag();
					$('.dupliqueProfil').removeAttr('data-dismiss');
					$scope.affichage = false;
					$scope.tagStyles = [];
				});
			});
		}
	};

	$scope.preModifierProfil = function() {
		var toSendCherche = {
			searchedProfile: $scope.target
		};
		if (localStorage.getItem('compteId')) {
			toSendCherche.id = localStorage.getItem('compteId');
		}
		$http.post(configuration.URL_REQUEST + '/chercherProfil', toSendCherche)
			.success(function(data) {
			$scope.profil = data;
			$scope.profMod = $scope.profil;
			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: $scope.profil._id
			}).success(function(data) {
				$scope.tagStylesFlag = data; /* Unit tests*/
				$scope.tagStyles = data;
				$scope.afficherTags();


			});
		});
	};

	$scope.editStyleChange = function(operation, value) {
		$rootScope.$emit('reglesStyleChange', {
			'operation': operation,
			'element': 'shown-text-edit',
			'value': value
		});

	};

	/* Mettre à jour la liste des TagsParProfil */
	$scope.updateProfilActual = function(nbreTag, tagProfil) {
		console.log('OKI 11');
		var profilActual = JSON.parse(localStorage.getItem('profilActuel'));

		/* Mettre à jour l'apercu de la liste des profils */
		if (nbreTag === tagProfil) {
			$scope.initial();
		}

		if (profilActual && $scope.profMod._id === profilActual._id && nbreTag === tagProfil) {
			nbreTag = 0;
			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: $scope.profilFlag._id
			}).success(function(data) {
				console.log('OKI 22');
				localStorage.setItem('listTagsByProfil', JSON.stringify(data));
			});
		}
	};

	//enregistrement du profil-tag lors de l'edition
	$scope.editionAddProfilTag = function() {

		if (!$scope.token || !$scope.token.id) {
			$scope.token = {
				id: localStorage.getItem('compteId')
			};
		}

		$scope.nbreTags = 0;
		for (var i = 0; i < $scope.tagStyles.length; i++) {
			if ($scope.tagStyles[i].state) {
				$scope.nbreTags++;
			}
		}
		if ($scope.noStateVariableFlag) {
			$scope.nbreTags += $scope.tagProfilInfos.length;
		}
		if ($scope.trashFlag) {
			$scope.nbreTags += $scope.deletedParams.length;
		}
		$scope.nbreTagCount = 0;

		$scope.tagStyles.forEach(function(item) {
			if (item.state) {
				var profilTag = {
					tag: item.tag,
					texte: item.texte,
					profil: $scope.profMod._id,
					tagName: item.tagName,
					police: item.police,
					taille: item.taille,
					interligne: item.interligne,
					styleValue: item.styleValue,
					coloration: item.coloration,
				};

				$http.post(configuration.URL_REQUEST + '/ajouterProfilTag', {
					id: $scope.token.id,
					profilTag: profilTag
				})
					.success(function(data) {
					if (data === 'err') {} else {
						$scope.editionFlag = data; /* unit tests*/
						$scope.tagStyles.length = 0;
						$scope.tagStyles = [];
						$scope.tagList = {};
						// if (!$scope.testEnv) {
						// 	location.reload(true);
						// }
						$scope.policeList = null;
						$scope.tailleList = null;
						$scope.interligneList = null;
						$scope.weightList = null;
						$scope.listeProfils = {};
						$scope.editTag = null;
						$scope.colorList = null;
						angular.element($('.shown-text-edit').text($('.shown-text-edit').text()));
						angular.element($('.shown-text-edit').css('font-family', ''));
						angular.element($('.shown-text-edit').css('font-size', ''));
						angular.element($('.shown-text-edit').css('line-height', ''));
						angular.element($('.shown-text-edit').css('font-weight', ''));

						/* Mettre à jour la liste des TagsParProfil */
						$scope.nbreTagCount++;
						$scope.updateProfilActual($scope.nbreTagCount, $scope.nbreTags);

					}

				});

			}

		});
		if ($scope.noStateVariableFlag) {

			$scope.tagProfilInfos.forEach(function(item) {

				$http.post(configuration.URL_REQUEST + '/modifierProfilTag', {
					id: $scope.token.id,
					profilTag: {
						id: item.id,
						texte: item.texte,
						police: item.police,
						taille: item.taille,
						interligne: item.interligne,
						styleValue: item.styleValue,
						coloration: item.coloration
					}
				})
					.success(function(data) {

					$scope.modProfilFlag = data; /*unit tests*/
					angular.element($('.shown-text-edit').text($('.shown-text-edit').text()));
					angular.element($('.shown-text-edit').removeAttr('style'));
					$scope.noStateVariableFlag = false;
					//Update tagStyles properties
					// if (!$scope.testEnv) {
					// 	location.reload(true);
					// }
					/* Mettre à jour la liste des TagsParProfil */
					$scope.nbreTagCount++;
					$scope.updateProfilActual($scope.nbreTagCount, $scope.nbreTags);


				});



			});
		}
		if ($scope.trashFlag) {

			$scope.deletedParams.forEach(function(item) {

				var deletedItemToGo = {
					param: item.param
				};

				$http.post(configuration.URL_REQUEST + '/supprimerProfilTag', {
					id: $scope.token.id,
					toDelete: deletedItemToGo.param
				})
					.success(function(data) {
					if (data === 'err') {} else {

						$scope.editionSupprimerTagFlag = data; /* Unit test */
						$scope.trashFlag = false;
						$scope.currentTagProfil = null;
						$scope.deletedParams = [];
						// if (!$scope.testEnv) {
						// 	location.reload(true);
						// }

						/* Mettre à jour la liste des TagsParProfil */
						$scope.nbreTagCount++;
						$scope.updateProfilActual($scope.nbreTagCount, $scope.nbreTags);

					}
				});
			});
		}

		$('#editPanel').fadeIn('fast').delay(1000).fadeOut('fast');
		angular.element($('.shown-text-edit').text($('.shown-text-edit').text()));
		angular.element($('.shown-text-edit').removeAttr('style'));

	};

	//Modification du profil
	$scope.modifierProfil = function() {
		$scope.addFieldError = [];
		if ($scope.profMod.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;
		}
		if ($scope.profMod.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;
		}
		if ($scope.addFieldError.length == 0) { // jshint ignore:line
			$('.editionProfil').attr('data-dismiss', 'modal');
			if (!$scope.token && localStorage.getItem('compteId')) {
				$scope.token = {
					id: localStorage.getItem('compteId')
				};
			}
			$scope.token.updateProfile = $scope.profMod;
			$http.post(configuration.URL_REQUEST + '/updateProfil', $scope.token)
				.success(function(data) {
				$scope.profilFlag = data; /*unit tests*/
				$scope.editionAddProfilTag();
				$('.editionProfil').removeAttr('data-dismiss');
				$scope.affichage = false;
				$scope.tagStyles = [];
				$rootScope.modifProfilListe = !$rootScope.modifProfilListe;
				$rootScope.actu = data;
				$rootScope.apply; // jshint ignore:line

			});
		}

	};

	//Modification d'un tag lors de l'edition 
	$scope.label_action = 'label_action';
	$scope.editionModifierTag = function(parameter) {
		$scope.hideVar = false;
		$('.label_action').removeClass('selected_label');
		$('#' + parameter._id).addClass('selected_label');
		$scope.currentTagProfil = parameter;
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if (parameter.tag === $scope.listTags[i]._id) {

				$scope.listTags[i].disabled = true;
				angular.element($('#selectId option').each(function() {
					var itemText = $(this).text();
					if (itemText === parameter.tagName) {
						$(this).prop('selected', true);
						$('#selectId').prop('disabled', 'disabled');
						$('#editValidationButton').prop('disabled', false);


					}
				}));
				$('#editValidationButton').prop('disabled', false);
				$scope.editTag = parameter.tagName;
				$scope.policeList = parameter.police;
				$scope.tailleList = parameter.taille;
				$scope.interligneList = parameter.interligne;
				$scope.weightList = parameter.styleValue;
				$scope.colorList = parameter.coloration;

				$scope.editStyleChange('police', $scope.policeList);
				$scope.editStyleChange('taille', $scope.tailleList);
				$scope.editStyleChange('interligne', $scope.interligneList);
				$scope.editStyleChange('style', $scope.weightList);
				$scope.editStyleChange('coloration', $scope.colorList);

				//set span text value of customselect
				$('select[ng-model="editTag"] + .customSelect .customSelectInner').text(parameter.tagName);
				$('select[ng-model="policeList"] + .customSelect .customSelectInner').text(parameter.police);
				$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text(parameter.taille);
				$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text(parameter.interligne);
				$('select[ng-model="weightList"] + .customSelect .customSelectInner').text(parameter.styleValue);
				$('select[ng-model="colorList"] + .customSelect .customSelectInner').text(parameter.coloration);



			}
		}

	};

	$scope.afficherDeleguerProfil = function() {
		if ($rootScope.currentUser && $scope.profil) {
			if ($scope.profil.preDelegated && ($scope.profil.preDelegated === $rootScope.currentUser._id)) {
				return true;
			}
		}
		return false;
	};

	$scope.deleguerUserProfil = function() {
		$scope.loader = true;
		$scope.varToSend = {
			profilID: $scope.profil._id,
			userID: $scope.profil.owner,
			delegatedID: $rootScope.currentUser._id
		};
		var tmpToSend = {
			id: $rootScope.currentUser.local.token,
			sendedVars: $scope.varToSend
		};
		$http.post(configuration.URL_REQUEST + '/delegateUserProfil', tmpToSend)
			.success(function(data) {
			$scope.delegateUserProfilFlag = data;

			$http.post(configuration.URL_REQUEST + '/findUserById', {
				idUser: $scope.profil.owner
			})
				.success(function(data) {
				if (data) {
					var emailTo = data.local.email;
					var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
					$scope.sendVar = {
						emailTo: emailTo,
						content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour accepter la délégation de votre profil : ' + $scope.profil.nom + '. </span>',
						subject: 'Confirmer la délégation'
					};
					$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
						.success(function() {
						$scope.loader = false;
						var profilLink = $location.absUrl();
						profilLink = profilLink.substring(0, profilLink.lastIndexOf('#/detailProfil?idProfil'));
						profilLink = profilLink + '#/profiles';
						$window.location.href = profilLink;
					});
				}
			});
		});
	};


});