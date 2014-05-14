/* File: profiles.js
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
/*global $:false */
/*jshint loopfunc:true*/

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http, $rootScope, configuration, $location, serviceCheck, verifyEmail) {

	/* Initialisations */
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
	$scope.profil = {};
	$scope.listTag = {};
	$scope.editTag = null;
	$scope.colorList = null;
	$scope.tagStyles = [];
	$scope.deletedParams = [];
	$scope.tagProfilInfos = [];
	$scope.variableFlag = false;
	$scope.trashFlag = false;
	$scope.admin = $rootScope.admin;
	$scope.displayDestination = false;


	$('#titreCompte').hide();
	$('#titreProfile').show();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$('#detailProfil').hide();
	$('#titreDocumentApercu').hide();


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

	$scope.requestToSend = {};
	if (localStorage.getItem('compteId')) {
		$scope.requestToSend = {
			id: localStorage.getItem('compteId')
		};
	}

	$rootScope.$watch('admin', function() {
		$scope.admin = $rootScope.admin;
		$scope.apply; // jshint ignore:line
	});
	// $scope.currentTagProfil = null;
	$scope.initProfil = function() {
		var tmp = serviceCheck.getData();
		tmp.then(function(result) {
			// this is only run after $http completes
			if (result.loged) {
				if (result.dropboxWarning === false) {
					$rootScope.dropboxWarning = false;
					$scope.missingDropbox = false;
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					if ($location.path() !== '/inscriptionContinue') {
						$location.path('/inscriptionContinue');
					}
				} else {
					$scope.utilisateur = result.user;
					$scope.verifProfil();
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					$('#profilePage').show();
					$scope.currentUser();
					$scope.token = {
						id: localStorage.getItem('compteId')
					};
					$scope.afficherProfils();

				}

			} else {
				if ($location.path() !== '/') {
					$location.path('/');
				}
			}
		});
	};

	$scope.displayOwner = function(param) {
		if (param.favourite && param.delete) {
			return 'Favoris';
		}
		if (param.favourite && !param.delete) {
			return 'CnedAdapt';
		}
		if (param.delegate) {
			return 'Délégué';
		}
		if (param.owner === $rootScope.currentUser._id) {
			return 'Moi-même';
		}
	}


	$scope.verifProfil = function() {
		if (!localStorage.getItem('listTagsByProfil')) {
			$scope.sentVar = {
				userID: $scope.utilisateur._id,
				actuel: true
			};
			if (!$scope.token && localStorage.getItem('compteId')) {
				$scope.token = {
					id: localStorage.getItem('compteId')
				};
			}
			$scope.token.getActualProfile = $scope.sentVar;
			$http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.token)
				.success(function(dataActuel) {
					$scope.chercherProfilActuelFlag = dataActuel;
					$scope.varToSend = {
						profilID: $scope.chercherProfilActuelFlag.profilID
					};
					$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
						idProfil: $scope.chercherProfilActuelFlag.profilID
					}).success(function(data) {
						$scope.chercherTagsParProfilFlag = data;
						localStorage.setItem('listTagsByProfil', JSON.stringify($scope.chercherTagsParProfilFlag));

					});
				});
		}
	};

	//Affichage des differents profils sur la page
	$scope.afficherProfils = function() {
		$http.get(configuration.URL_REQUEST + '/listerProfil', {
			params: $scope.token
		})
			.success(function(data) {
				$scope.listeProfils = data;
			}).error(function() {});

	};


	//gets the user that is connected 
	$scope.currentUser = function() {

		var tmp2 = serviceCheck.getData();
		tmp2.then(function(result) {
			if (result.loged) {
				if (result.dropboxWarning === false) {
					$rootScope.dropboxWarning = false;
					$scope.missingDropbox = false;
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					if ($location.path() !== '/inscriptionContinue') {
						$location.path('/inscriptionContinue');
					}
				} else {
					$scope.currentUserData = result.user;
					$scope.afficherProfilsParUser();
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
				}
			} else {
				if ($location.path() !== '/') {
					$location.path('/');
				}
			}

		});
	};
	$scope.tests = {};
	//displays user profiles
	$scope.afficherProfilsParUser = function() {

		$http.post(configuration.URL_REQUEST + '/profilParUser', $scope.token)
			.success(function(data) {
				$scope.listeProfilsParUser = data;
				if (data.length === 0) {
					$scope.tests = [];
				}

				$scope.listVariable = {
					profilID: $scope.listeProfilsParUser,
					userID: $scope.currentUserData._id
				};

				if ($scope.listeProfilsParUser.length != 0) {

					$scope.token.defaultProfileGetter = $scope.listVariable;
					$http.post(configuration.URL_REQUEST + '/defaultByUserProfilId', $scope.token)
						.success(function(data) {

							$scope.defaultByUserProfilIdFlag = data;
							if ($scope.listeProfilsParUser.length >= 1) {
								for (var i = $scope.defaultByUserProfilIdFlag.length - 1; i >= 0; i--) {
									for (var k = $scope.listeProfilsParUser.length - 1; k >= 0; k--) {

										if ($scope.listeProfilsParUser[k]._id === $scope.defaultByUserProfilIdFlag[i].profilID) {
											$scope.listeProfilsParUser[k].defaut = $scope.defaultByUserProfilIdFlag[i].
											default;
											$scope.tests = $scope.listeProfilsParUser;
											break;
										}
									}
								}
							}
							/*Ajout des profils par défaut de l'administrateur à la liste tests des profils*/
							if ($rootScope.currentUser && $rootScope.currentUser.local.role != 'admin') {
								var token = {
									id: $rootScope.currentUser.local.token
								};
								$http.post(configuration.URL_REQUEST + '/chercherProfilsParDefaut', token)
									.success(function(data) {
										$scope.profilsParDefautFlag = data;
										for (var i = $scope.profilsParDefautFlag.length - 1; i >= 0; i--) {
											// $scope.token.searchedProfile = $scope.profilsParDefautFlag[i].profilID
											$http.post(configuration.URL_REQUEST + '/chercherProfil', {
												id: $scope.token.id,
												searchedProfile: $scope.profilsParDefautFlag[i].profilID
											})
												.success(function(data) {
													/*favourite et delete sont des proprietes qui caracterisent les profils défaut*/
													data.favourite = true;
													data.delete = false;
													$scope.profilArray = [];
													$scope.profilArray.push(data);
													for (var j = $scope.profilArray.length - 1; j >= 0; j--) {

														if ($scope.tests.indexOf($scope.profilArray[j]) <= -1) {
															$scope.tests.push($scope.profilArray[j]);
														}
													}
												});
										};
									});
							}
							$scope.varToGo = {
								userID: $scope.currentUserData._id,
								favoris: true
							};
							/* Profils favoris */

							$http.post(configuration.URL_REQUEST + '/findUserProfilsFavoris', $scope.token)
								.success(function(data) {

									$scope.findUserProfilsFavorisFlag = data;

									for (var i = $scope.findUserProfilsFavorisFlag.length - 1; i >= 0; i--) {
										// $scope.token.searchedProfile = $scope.findUserProfilsFavorisFlag[i].profilID;
										$http.post(configuration.URL_REQUEST + '/chercherProfil', {
											id: $scope.token.id,
											searchedProfile: $scope.findUserProfilsFavorisFlag[i].profilID
										})
											.success(function(data) {

												data.favourite = true;
												data.delete = true;
												$scope.tests.push(data);
												/*---------------------------------------------------------------------*/



											});

									};


								});

							/* Profil délégué */
							$http.post(configuration.URL_REQUEST + '/findUserProfilsDelegate', {
								id: $scope.token.id,
								idDelegated: $rootScope.currentUser._id
							})
								.success(function(data) {

									$scope.findUserProfilsDelegateFlag = data;
									for (var i = $scope.findUserProfilsDelegateFlag.length - 1; i >= 0; i--) {
										$http.post(configuration.URL_REQUEST + '/chercherProfil', {
											id: $scope.token.id,
											searchedProfile: $scope.findUserProfilsDelegateFlag[i].profilID
										})
											.success(function(data) {

												if (data.delegated) {
													data.delegated = false;
												}

												data.delegate = true;
												data.delete = false;
												$scope.tests.push(data);
											});
									};
								});



						});

				} else {
					/*Ajout des profils par défaut de l'administrateur à la liste tests des profils*/
					if ($rootScope.currentUser && $rootScope.currentUser.local.role != 'admin') {
						var token = {
							id: $rootScope.currentUser.local.token
						}
						$http.post(configuration.URL_REQUEST + '/chercherProfilsParDefaut', token)
							.success(function(data) {

								$scope.profilsParDefautFlag = data;
								if ($scope.profilsParDefautFlag.length > 0) {
									for (var i = $scope.profilsParDefautFlag.length - 1; i >= 0; i--) {
										// $scope.token.searchedProfile = $scope.profilsParDefautFlag[i].profilID
										$http.post(configuration.URL_REQUEST + '/chercherProfil', {
											id: $scope.token.id,
											searchedProfile: $scope.profilsParDefautFlag[i].profilID
										})
											.success(function(data) {

												/*favourite et delete sont des proprietes qui caracterisent les profils défaut*/
												data.favourite = true;
												data.delete = false;
												$scope.profilArray = [];
												$scope.profilArray.push(data);
												for (var j = $scope.profilArray.length - 1; j >= 0; j--) {

													if ($scope.tests.indexOf($scope.profilArray[j]) <= -1) {
														$scope.tests.push($scope.profilArray[j]);
													}
												};
											});
									};
								}

							});
					}
					if ($rootScope.currentUser && $rootScope.currentUser.local.role == 'admin') {
						$http.post(configuration.URL_REQUEST + '/findAdmin')
							.success(function(data) {
								$scope.findAdminFlag = data;
								if (data) {
									$scope.token.user = {
										_id: data._id
									};
									$http.post(configuration.URL_REQUEST + '/profilParUser', $scope.token)
										.success(function(data) {
											$scope.tests.push(data);
										});
								}


							});
					}
				}

			});

	};


	$scope.isDeletable = function(param) {
		if (param.favourite && param.delete) {
			return true;
		}
		if (param.favourite && !param.delete) {
			return false;
		}
	}

	// Affichage des differents profils sur la page avec effacement des styles
	$scope.afficherProfilsClear = function() {

		$http.get(configuration.URL_REQUEST + '/listerProfil', {
			params: $scope.token
		})
			.success(function(data) {
				$scope.listeProfils = data;
				$scope.profil = {};
				$scope.tagList = {};
				$scope.policeList = {};
				$scope.tailleList = {};
				$scope.interligneList = {};
				$scope.weightList = {};
				$scope.colorList = {};
				$scope.tagStyles = [];
				$scope.erreurAfficher = false;
				angular.element($('.shown-text-add').text($('.shown-text-add').text()));
				angular.element($('.shown-text-edit').text($('.shown-text-edit').text()));
				angular.element($('.shown-text-add').css('font-family', ''));
				angular.element($('.shown-text-add').css('font-size', ''));
				angular.element($('.shown-text-add').css('line-height', ''));
				angular.element($('.shown-text-add').css('font-weight', ''));
				angular.element($('.shown-text-add').text($scope.editInitText));
				angular.element($('.shown-text-edit').removeAttr('style'));

				//set customSelect jquery plugin span text to empty after cancel
				$('select[ng-model="editTag"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="tagList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');

				$scope.tagList = null;
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
				// $('#editValidationButton').prop('disabled', false);
			}).error(function() {});;

	};
	// Affiche les widgets en bleu;
	$scope.isTagStylesNotEmpty = function() {
		if ($scope.tagStyles.length >= 0) {
			return true;
		}
	};
	//Ajout d'un profil
	$scope.erreurAfficher = false;
	$scope.errorAffiche = [];

	$scope.ajouterProfil = function() {
		if (($scope.profil.nom == null || $scope.profil.descriptif == null || $scope.tagList == null || $scope.policeList == null || $scope.tailleList == null || $scope.interligneList == null || $scope.colorList == null || $scope.weightList == null) && !$scope.addFieldError.state) {
			$scope.erreurAfficher = true;
			$scope.errorAffiche.push(' other ');

		}

		if (($scope.profil.nom == null || $scope.profil.descriptif == null) && $scope.addFieldError.state) {
			$scope.erreurAfficher = true;
			$scope.errorAffiche.push(' profilInfos ');
		}

		if ($scope.profil.nom != null && $scope.profil.descriptif != null && $scope.addFieldError.state) {
			$scope.errorAffiche = [];
		}

		if (!$scope.addFieldError.state) { // jshint ignore:line
			$scope.errorAffiche.push(' Règle ');
			$scope.erreurAfficher = true;
		}

		if ($scope.addFieldError.state && $scope.errorAffiche.length == 0) { // jshint ignore:line
			$('.addProfile').attr('data-dismiss', 'modal');
			$scope.profil.photo = './files/profilImage/profilImage.jpg';
			$scope.profil.owner = $scope.currentUserData._id;
			$scope.token.newProfile = $scope.profil;
			$http.post(configuration.URL_REQUEST + '/ajouterProfils', $scope.token)
				.success(function(data) {


					$scope.profilFlag = data; /*unit tests*/
					$rootScope.updateListProfile = !$rootScope.updateListProfile;
					$scope.addUserProfil = {
						profilID: $scope.profilFlag._id,
						userID: $scope.profil.owner,
						favoris: false,
						actuel: false,
						default: false
					};
					$http.post(configuration.URL_REQUEST + '/addUserProfil', $scope.addUserProfil)
						.success(function(data) {
							$scope.addUserProfilFlag = data;

						});
					$scope.lastDocId = data._id;
					$scope.ajouterProfilTag($scope.lastDocId);
					$scope.profil = {};
					$scope.tagStyles.length = 0;
					$scope.tagStyles = [];
					$scope.colorList = {};
					$scope.errorAffiche = [];
					$scope.addFieldError = [];
					angular.element($('.shown-text-add').text($('.shown-text-add').text()));
					angular.element($('.shown-text-add').css('font-family', ''));
					angular.element($('.shown-text-add').css('font-size', ''));
					angular.element($('.shown-text-add').css('line-height', ''));
					angular.element($('.shown-text-add').css('font-weight', ''));
					$('#addPanel').fadeIn('fast').delay(5000).fadeOut('fast');
					$scope.tagList = null;
					$scope.policeList = null;
					$scope.tailleList = null;
					$scope.interligneList = null;
					$scope.weightList = null;
					$scope.colorList = null;
					$('.addProfile').removeAttr('data-dismiss');
					$scope.affichage = false;
					$scope.erreurAfficher = false;



				});
		}
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
	//Suppression du profil
	$scope.supprimerProfil = function() {
		$scope.token.toDelete = $scope.sup;
		$http.post(configuration.URL_REQUEST + '/deleteProfil', $scope.token)
			.success(function(data) {

				$rootScope.updateProfilListe = !$rootScope.updateProfilListe;

				$scope.profilFlag = data; /* unit tests */
				$scope.tagStyles.length = 0;
				$scope.tagStyles = [];
				$scope.removeVar = {
					profilID: $scope.sup._id,
					userID: $scope.currentUserData._id
				};
				$scope.token.removeProfile = $scope.removeVar;
				$http.post(configuration.URL_REQUEST + '/removeUserProfile', $scope.token)
					.success(function(data) {
						$scope.removeUserProfileFlag = data; /* unit tests */
						localStorage.removeItem('profilActuel');
						localStorage.removeItem('listTags');
						localStorage.removeItem('listTagsByProfil');
						$('#headerSelect + .customSelect .customSelectInner').text('');
						$scope.afficherProfilsParUser();


					});

			});
	};

	//Premodification du profil
	$scope.preModifierProfil = function(profil) {
		$scope.profMod = profil;
		$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
			idProfil: profil._id
		})
			.success(function(data) {
				$scope.tagStylesFlag = data; /* Unit tests*/
				$scope.tagStyles = data;
				$scope.afficherTags();


			});
	};

	//Presuppression du profil
	$scope.preSupprimerProfil = function(profil) {
		$scope.sup = profil;
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

	//Ajout du profil-Tag
	$scope.ajouterProfilTag = function(lastDocId) {

		if (!$scope.token || !$scope.token.id) {
			$scope.token = {
				id: localStorage.getItem('compteId')
			};
		};
		var k = 0;
		var tagStylesLength = $scope.tagStyles.length;
		$scope.tagStyles.forEach(function(item) {
			var profilTag = {
				tag: item.id_tag,
				texte: item.style,
				profil: lastDocId,
				tagName: item.label,
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
					$scope.profilTagFlag = data; /* unit tests */
					k++;
					if (k === tagStylesLength) {
						$scope.afficherProfilsParUser();
						$scope.profilTag = {};
						$scope.tagStyles.length = 0;
						$scope.tagStyles = [];
					}


				});

		});

		$scope.tagList = {};
		$scope.policeList = {};
		$scope.tailleList = {};
		$scope.interligneList = {};
		$scope.weightList = {};

	};

	//enregistrement du profil-tag lors de l'edition
	$scope.editionAddProfilTag = function() {

		if (!$scope.token || !$scope.token.id) {
			$scope.token = {
				id: localStorage.getItem('compteId')
			};
		};
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
							$scope.afficherProfilsParUser();
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
						angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
						angular.element($('.shown-text-edit').removeAttr('style'));
						$scope.noStateVariableFlag = false;
						//Update tagStyles properties

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
						}
					});
			});
		}

		$('#editPanel').fadeIn('fast').delay(1000).fadeOut('fast');
		angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
		angular.element($('.shown-text-edit').removeAttr('style'));

	};

	//Griser select après validation
	$scope.affectDisabled = function(param) {
		if (param) {
			return true;
		} else {
			return false;
		}
	};

	//verification des champs avant validation lors de l'ajout
	$scope.beforeValidationAdd = function() {
		$scope.addFieldError = [];
		$scope.affichage = false;

		if ($scope.profil.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;


		}
		if ($scope.profil.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;


		}
		if ($scope.tagList == null) { // jshint ignore:line
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
			$scope.validerStyleTag();
			$scope.addFieldError.state = true;
			$scope.affichage = false;
			$scope.erreurAfficher = false;
			$scope.errorAffiche = [];
			$scope.colorationCount = 0;
			$scope.oldColoration = null;
		}
	};
	$scope.addFieldError = [];


	//verification des champs avant validation lors de la modification
	$scope.beforeValidationModif = function() {
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

	//Valider
	$scope.validerStyleTag = function() {
		$scope.currentTag = JSON.parse($scope.tagList);
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if ($scope.listTags[i]._id === $scope.currentTag._id) {
				$scope.tagID = $scope.listTags[i]._id;
				$scope.listTags[i].disabled = true;
				break;
			}
		}

		// var textestyler = angular.element(document.querySelector('#style-affected-add'))[0].outerHTML;
		// var debut = textestyler.substring(textestyler.indexOf('<p'), textestyler.indexOf('>') + 1);
		// var texteFinal = debut + '</p>';
		var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';


		$scope.tagStyles.push({
			id_tag: $scope.currentTag._id,
			style: mytext,
			label: $scope.currentTag.libelle,
			police: $scope.policeList,
			taille: $scope.tailleList,
			interligne: $scope.interligneList,
			styleValue: $scope.weightList,
			coloration: $scope.colorList,

		});
		angular.element($('.shown-text-add').text($('.shown-text-add').text()));
		angular.element($('#style-affected-add').removeAttr('style'));
		$scope.colorationCount = 0;
		$scope.tagList = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.weightList = null;
		$scope.colorList = null;
		$('#addProfile .customSelectInner').text('');


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

	//Edition StyleTag
	$scope.editerStyleTag = function() {

		if (!$scope.currentTagProfil) {
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
			angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
			angular.element($('#style-affected-edit').removeAttr('style'));

		} else {
			if (!$scope.currentTagProfil.state) {

				var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';

				$scope.tagProfilInfos.push({
					id: $scope.currentTagProfil._id,
					texte: mytext,
					police: $scope.policeList,
					taille: $scope.tailleList,
					interligne: $scope.interligneList,
					styleValue: $scope.weightList,
					coloration: $scope.colorList

				});
				for (var j = $scope.tagStyles.length - 1; j >= 0; j--) {
					if ($scope.tagStyles[j]._id === $scope.currentTagProfil._id) {
						$scope.tagStyles[j].police = $scope.policeList;
						$scope.tagStyles[j].taille = $scope.tailleList;
						$scope.tagStyles[j].interligne = $scope.interligneList;
						$scope.tagStyles[j].styleValue = $scope.weightList;
						$scope.tagStyles[j].coloration = $scope.colorList;
					}

				}


				$scope.currentTagProfil = null;
				$scope.noStateVariableFlag = true;

			} else {

				$scope.currentTagProfil.police = $scope.policeList;
				$scope.currentTagProfil.taille = $scope.tailleList;
				$scope.currentTagProfil.interligne = $scope.interligneList;
				$scope.currentTagProfil.styleValue = $scope.weightList;
				$scope.currentTagProfil.coloration = $scope.colorList;
				$scope.currentTagProfil.texte = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';
				$scope.currentTagProfil = null;


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

		//set customSelect jquery plugin span text to empty string
		$('select[ng-model="editTag"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');


	};

	//Suppression d'un paramètre
	$scope.ajoutSupprimerTag = function(parameter) {

		var index = $scope.tagStyles.indexOf(parameter);
		if (index > -1) {
			$scope.tagStyles.splice(index, 1);
		}

		for (var j = $scope.listTags.length - 1; j >= 0; j--) {
			if ($scope.listTags[j]._id === parameter.id_tag) {
				$scope.listTags[j].disabled = false;
			}
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
			$scope.hideVar = true;


		}
		// $('#editValidationButton').prop('disabled', true);
		angular.element($('#style-affected-edit').text($('.shown-text-add').text()));
		angular.element($('#style-affected-edit').removeAttr('style'));

		$('select[ng-model="editTag"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');



		console.log('okok');
		$('#selectId option').eq(0).prop('selected', true);
		// $scope.currentTagProfil = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.colorList = null;
		$scope.weightList = null;
		$('#selectId').removeAttr('disabled');



	};
	$scope.hideVar = true;
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


	$scope.reglesStyleChange = function(operation, value) {
		$rootScope.$emit('reglesStyleChange', {
			'operation': operation,
			'element': 'shown-text-add',
			'value': value
		});


	};
	$scope.editStyleChange = function(operation, value) {

		$rootScope.$emit('reglesStyleChange', {
			'operation': operation,
			'element': 'shown-text-edit',
			'value': value
		});

	};

	$scope.editHyphen = function() {
		angular.element($('.shown-text-edit').addClass('hyphenate'));
		$('#selectId').removeAttr('disabled');
		angular.element($('.shown-text-edit').removeAttr('style'));
	};

	$scope.mettreParDefaut = function(param) {

		$scope.defaultVar = {
			userID: param.owner,
			profilID: param._id,
			defaultVar: true
		};
		param.defautMark = true;
		param.defaut = true;
		$scope.token.addedDefaultProfile = $scope.defaultVar;
		$http.post(configuration.URL_REQUEST + '/setDefaultProfile', $scope.token)
			.success(function(data) {
				$scope.defaultVarFlag = data;
				$('#defaultProfile').fadeIn('fast').delay(5000).fadeOut('fast');
				$('.action_btn').attr('data-shown', 'false');
				$('.action_list').attr('style', 'display:none');
				$scope.afficherProfilsParUser();


			});

	};

	$scope.retirerParDefaut = function(param) {

		$scope.defaultVar = {
			userID: param.owner,
			profilID: param._id,
			defaultVar: false
		};

		if ($scope.token && $scope.token.id) {
			$scope.token.cancelFavs = $scope.defaultVar;
		} else {
			$scope.token.id = localStorage.getItem('compteId');
			$scope.token.cancelFavs = $scope.defaultVar;
		}

		$http.post(configuration.URL_REQUEST + '/cancelDefaultProfile', $scope.token)
			.success(function(data) {
				$scope.cancelDefaultProfileFlag = data;
				$('#defaultProfileCancel').fadeIn('fast').delay(5000).fadeOut('fast');
				$('.action_btn').attr('data-shown', 'false');
				$('.action_list').attr('style', 'display:none');
				$scope.afficherProfilsParUser();


			});

	};

	$scope.isDefault = function(param) {
		if (param && param.defaut) {
			return true;
		}
		return false;
	};

	$scope.toViewProfil = function(param) {
		$location.search('idProfil', param._id).path('/detailProfil').$$absUrl;
	}

	$scope.preRemoveFavourite = function(param) {
		$scope.profilId = param._id;
	}

	$scope.removeFavourite = function() {
		$scope.sendVar = {
			profilID: $scope.profilId,
			userID: $rootScope.currentUser._id,
			favoris: true
		};

		if ($scope.token && $scope.token.id) {
			$scope.token.favProfile = $scope.sendVar;
		} else {
			$scope.token.id = localStorage.getItem('compteId');
			$scope.token.favProfile = $scope.sendVar;
		}
		$http.post(configuration.URL_REQUEST + '/removeUserProfileFavoris', $scope.token)
			.success(function(data) {
				$scope.removeUserProfileFavorisFlag = data;
				localStorage.removeItem('profilActuel');
				localStorage.removeItem('listTagsByProfil');
				$rootScope.$broadcast('initProfil');

				$scope.afficherProfilsParUser();


			});

	};

	/* envoi de l'email lors de la dupliquation */
	$scope.sendEmailDuplique = function() {
		$http.post(configuration.URL_REQUEST + '/findUserById', {
			idUser: $scope.oldProfil.owner
		}).success(function(data) {
			$scope.findUserByIdFlag = data;
			if (data) {
				var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
				$scope.sendVar = {
					emailTo: data.local.email,
					content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour dupliquer votre profil : ' + $scope.oldProfil.nom + '. </span>',
					subject: fullName + ' a dupliqué votre profil'
				};
				$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
					.success(function() {});
			}
		});
	};

	//preDupliquer le profil favori
	$scope.preDupliquerProfilFavorit = function(profil) {
		$scope.profMod = profil;

		$scope.oldProfil = {
			nom: $scope.profMod.nom,
			owner: $scope.profMod.owner
		};

		$scope.profMod.nom = $scope.profMod.nom + ' Copie';
		$scope.profMod.descriptif = $scope.profMod.descriptif + ' Copie';
		$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
			idProfil: profil._id
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
								$scope.afficherProfilsParUser();
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
							}
						}
					});
			}
		});
	};

	//Dupliquer le profil
	$scope.dupliquerFavoritProfil = function() {
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
			newProfile.owner = $scope.currentUserData._id;
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

	$scope.preDeleguerProfil = function(profil) {
		$scope.profDelegue = profil;
		$scope.errorMsg = '';
		$scope.successMsg = '';
		$scope.delegateEmail = '';
	};

	$scope.deleguerProfil = function() {
		$scope.errorMsg = '';
		$scope.successMsg = '';
		if (!$scope.delegateEmail || $scope.delegateEmail.length <= 0) {
			$scope.errorMsg = 'L\'email est obligatoire !';
			return;
		}
		if (!verifyEmail($scope.delegateEmail)) {
			$scope.errorMsg = 'L\'email est invalide !';
			return;
		}
		$http.post(configuration.URL_REQUEST + '/findUserByEmail', {
			email: $scope.delegateEmail
		})
			.success(function(data) {
				if (data) {
					$scope.findUserByEmailFlag = data;
					var emailTo = data.local.email;

					if (emailTo === $rootScope.currentUser.local.email) {
						$scope.errorMsg = 'Vous ne pouvez pas déléguer votre profil à vous même !';
						return;
					}

					$('#delegateModal').modal('hide');

					var sendParam = {
						idProfil: $scope.profDelegue._id,
						idDelegue: data._id
					};
					$http.post(configuration.URL_REQUEST + '/delegateProfil', sendParam)
						.success(function(data) {
							var profilLink = $location.absUrl();
							profilLink = profilLink.replace('#/profiles', '#/detailProfil?idProfil=' + $scope.profDelegue._id);

							var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
							$scope.sendVar = {
								emailTo: emailTo,
								content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour vous déléguer son profil : <a href=' + profilLink + '>' + $scope.profDelegue.nom + '</a>. </span>',
								subject: 'Profil délégué'
							};
							$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
								.success(function(data) {
									$('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
									$scope.msgSuccess = 'La demande est envoyée avec succés.';
									$scope.errorMsg = '';
									$scope.delegateEmail = '';
								});
						});
				} else {
					$scope.errorMsg = 'L\'email est introuvable !';
				}
			});
	};

	$scope.preRetirerDeleguerProfil = function(profil) {
		$scope.profRetirDelegue = profil;
	};

	$scope.retireDeleguerProfil = function() {
		var sendParam = {
			id: $rootScope.currentUser.local.token,
			sendedVars: {
				idProfil: $scope.profRetirDelegue._id,
				idUser: $rootScope.currentUser._id
			}
		};
		$http.post(configuration.URL_REQUEST + '/retirerDelegateUserProfil', sendParam)
			.success(function(data) {
				// $('#retirerDelegateModal').on('hidden.bs.modal', function() {
				if (data) {
					$scope.retirerDelegateUserProfilFlag = data;
					$http.post(configuration.URL_REQUEST + '/findUserById', {
						idUser: data.delegatedID
					})
						.success(function(data) {
							if (data) {
								$scope.findUserByIdFlag2 = data;
								var emailTo = data.local.email;
								var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
								$scope.sendVar = {
									emailTo: emailTo,
									content: '<span> ' + fullName + ' vient de vous retirer la délégation de son profil : ' + $scope.profRetirDelegue.nom + '. </span>',
									subject: 'Retirer la délégation'
								};
								$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
									.success(function(data) {});
							}
						});
				}
				$scope.afficherProfilsParUser();
				// });
			});
	};

	$scope.profilApartager = function(param) {
		$('#shareModal').show();
		$scope.profilPartage = param;
		$scope.currentUrl = $location.absUrl();

	};

	/*load email form*/
	$scope.loadMail = function() {
		$scope.displayDestination = true;
	};

	$scope.socialShare = function() {
		$scope.destination = $scope.destinataire;
		$scope.encodeURI = encodeURIComponent($location.absUrl());
		$scope.currentUrl = $location.absUrl();
		$scope.envoiUrl = encodeURIComponent($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			$('#confirmModal').modal('show');
			$('#shareModal').modal('hide');

		}
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

	/*envoi de l'email au destinataire*/
	$scope.sendMail = function() {
		$('#confirmModal').modal('hide');
		$scope.envoiUrl = $scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id);
		$scope.destination = $scope.destinataire;
		$scope.loader = true;
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			if ($location.absUrl()) {

				if ($rootScope.currentUser.dropbox.accessToken) {

					if (configuration.DROPBOX_TYPE) {

						if ($rootScope.currentUser) {
							$scope.sendVar = {
								to: $scope.destinataire,
								content: ' vient de partager avec vous un profil sur l\'application CnedAdapt.  ' + $scope.envoiUrl,
								encoded: '<span> vient de partager avec vous un profil sur l\'application CnedAdapt.   <a href=' + $scope.envoiUrl + '>Lien de ce profil</a> </span>',
								prenom: $rootScope.currentUser.local.prenom,
								fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
								doc: $scope.envoiUrl
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

});