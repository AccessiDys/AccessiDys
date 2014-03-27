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

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http, $rootScope, configuration, $location, serviceCheck) {

	/* Initialisations */
	$scope.successMod = 'Profil Modifie avec succes !';
	$scope.successAdd = 'Profil Ajoute avec succes !';
	$scope.successDefault = 'defaultProfileSelection';
	$scope.displayText = '<p>CnedAdapt est une application qui permet d\'adapter les documents.</p>';
	$scope.flag = false;
	$scope.colorLists = ['Couleur par défaut', 'Colorer les lignes', 'Colorer les mots', 'Surligner les mots', 'Surligner les lignes', 'Colorer les syllabes'];
	$scope.weightLists = ['Bold', 'Normal'];
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


	$('#titreCompte').hide();
	$('#titreProfile').show();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();

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

	// $scope.currentTagProfil = null;
	$scope.initProfil = function() {
		console.log('init');
		var tmp = serviceCheck.getData();
		tmp.then(function(result) { // this is only run after $http completes
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
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					$('#profilePage').show();
					$scope.currentUser();

				}

			} else {
				if ($location.path() !== '/') {
					$location.path('/');
				}
			}
		});
	};

	//Affichage des differents profils sur la page
	$scope.afficherProfils = function() {
		$http.get(configuration.URL_REQUEST + '/listerProfil')
			.success(function(data) {
				$scope.listeProfils = data;
			});

	};

	//gets the user that is connected 
	$scope.currentUser = function() {
		$http.get(configuration.URL_REQUEST + '/profile')
			.success(function(data) {
				$scope.currentUserData = data;
				console.log('currentUser ====>');
				console.log($scope.currentUserData);
				$scope.afficherProfilsParUser();

			});
	};

	//displays user profiles
	$scope.afficherProfilsParUser = function() {
		$http.post(configuration.URL_REQUEST + '/profilParUser', {
			id: $scope.currentUserData._id
		})
			.success(function(data) {
				$scope.listeProfilsParUser = data;
				console.log('profil/user ==>');
				console.log(data);
			});

	};

	//Affichage des differents profils sur la page avec effacement des styles
	$scope.afficherProfilsClear = function() {
		$http.get(configuration.URL_REQUEST + '/listerProfil')
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
				$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
				$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');


				$scope.tagList = null;
				$scope.policeList = null;
				$scope.tailleList = null;
				$scope.interligneList = null;
				$scope.weightList = null;
				$scope.colorList = null;
				$scope.affichage = false;


			});

	};
	// Affiche les widgets en bleu;
	$scope.isTagStylesNotEmpty = function() {
		if ($scope.tagStyles.length >= 0) {
			return true;
		}
	};
	//Ajout d'un profil
	$scope.ajouterProfil = function() {
		$scope.addFieldError = [];
		if ($scope.profil.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;
		}
		if ($scope.profil.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;
		}
		if ($scope.addFieldError.length == 0) { // jshint ignore:line
			$('.addProfile').attr('data-dismiss', 'modal');
			$scope.profil.photo = './files/profilImage/profilImage.jpg';
			$scope.profil.owner = $scope.currentUserData._id;
			$http.post(configuration.URL_REQUEST + '/ajouterProfils', $scope.profil)
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
							$http.post(configuration.URL_REQUEST + '/chercherProfilDefaut', $scope.addUserProfilFlag)
								.success(function(data) {
									$scope.chercherProfilDefautFlag = data;


								});


						});
					$scope.lastDocId = data._id;
					$scope.ajouterProfilTag($scope.lastDocId);
					$scope.profil = {};
					$scope.tagStyles.length = 0;
					$scope.tagStyles = [];
					$scope.colorList = {};
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

			$http.post(configuration.URL_REQUEST + '/updateProfil', $scope.profMod)
				.success(function(data) {
					$scope.profilFlag = data; /*unit tests*/
					$scope.editionAddProfilTag();
					$('.editionProfil').removeAttr('data-dismiss');
					$scope.affichage = false;
					$rootScope.modifProfilListe = !$rootScope.modifProfilListe;

				});
		}

	};
	//Suppression du profil
	$scope.supprimerProfil = function() {
		$http.post(configuration.URL_REQUEST + '/deleteProfil', $scope.sup)
			.success(function(data) {

				$rootScope.updateProfilListe = !$rootScope.updateProfilListe;

				$scope.profilFlag = data; /* unit tests */
				$scope.afficherProfilsParUser();
				$scope.tagStyles.length = 0;
				$scope.tagStyles = [];
				$scope.removeVar = {
					profilID: $scope.sup._id,
					userID: $scope.currentUserData._id
				};
				$http.post(configuration.URL_REQUEST + '/removeUserProfile', $scope.removeVar)
					.success(function(data) {

						$scope.removeUserProfileFlag = data; /* unit tests */


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
		$http.get(configuration.URL_REQUEST + '/readTags')
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

			$http.post(configuration.URL_REQUEST + '/ajouterProfilTag', profilTag)
				.success(function(data) {

					$scope.profilTagFlag = data; /* unit tests */
					$scope.afficherProfilsParUser();
					$scope.profilTag = {};
					$scope.tagStyles.length = 0;
					$scope.tagStyles = [];

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

		$scope.tagStyles.forEach(function(item) {
			if (item.state) {
				console.log('inside item.state ajouterProfilTag');
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

				$http.post(configuration.URL_REQUEST + '/ajouterProfilTag', profilTag)
					.success(function(data) {
						if (data === 'err') {
							console.log('Problème survenu lors de l\'opération');
						} else {
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
			console.log('inside noStateVariableFlag modifierProfilTag');

			$scope.tagProfilInfos.forEach(function(item) {

				$http.post(configuration.URL_REQUEST + '/modifierProfilTag', {
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
						console.log('inside variableFlag true');
						$scope.noStateVariableFlag = false;
						//Update tagStyles properties

					});



			});
		}
		if ($scope.trashFlag) {
			console.log('inside trashFlag supprimerProfilTag');

			$scope.deletedParams.forEach(function(item) {

				var deletedItemToGo = {
					param: item.param
				};
				console.log(deletedItemToGo.param);

				$http.post(configuration.URL_REQUEST + '/supprimerProfilTag', deletedItemToGo.param)
					.success(function(data) {
						if (data === 'err') {
							console.log('Désolé un problème est survenu lors de la suppression');
						} else {
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
			$scope.affichage = false;

		}
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
			console.log('(validation) !$scope.currentTagProfil');
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
				console.log('(validation) !$scope.currentTagProfil.state');

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
				console.log('(validation) $scope.currentTagProfil.state');

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


		}
		$('#editValidationButton').prop('disabled', true);
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
		console.log('$scope.currentTagProfil ===> ok');
		$scope.hideVar = false;
		console.log('clicked -- ');
		console.log($(this));
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

	$scope.afficherProfils();

	$scope.reglesStyleChange = function(operation, value) {
		console.log('reglesStyleChange');
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
		console.log('param ======>');
		console.log(param);
		$scope.defaultVar = {
			userID: param.owner,
			profilID: param._id,
			defaultVar: true
		};
		$http.post(configuration.URL_REQUEST + '/setDefaultProfile', $scope.defaultVar)
			.success(function(data) {
				$scope.defaultVarFlag = data;
				$('#defaultProfile').fadeIn('fast').delay(5000).fadeOut('fast');


			});

	};



});