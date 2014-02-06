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

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http, $rootScope) {

	/* Initialisations */
	$scope.displayText = '<p>Kamel & Leon est une application qui permet d\'adapter l\'ergonomie des supports scolaires afin d\'aider les familles, les enseignants et les élèves.</p>';
	$scope.flag = false;
	$scope.colorLists = ['Couleur par défaut', 'Colorer les lignes', 'Colorer les mots', 'Surligner les mots', 'Surligner les lignes', 'Colorer les syllabes'];
	$scope.weightLists = ['Bold', 'Normal'];
	$scope.listTypes = ['Dyslexie N1', 'Dyslexie N2', 'Dyslexie N3'];
	$scope.listNiveaux = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '1ère', '2ème', 'brevet'];
	$scope.headers = ['photo', 'nom', 'type', 'descriptif', 'action'];
	$scope.profilTag = {};
	$scope.profil = {};
	$scope.listTag = {};
	$scope.editTag = {};
	$scope.colorList = {};
	$scope.tagStyles = [];
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

	$scope.currentTagProfil = null;

	//Affichage des differents profils sur la page
	$scope.afficherProfils = function() {
		$http.get('/listerProfil')
			.success(function(data) {
				$scope.listeProfils = data;
			});

	};
	//Affichage des differents profils sur la page avec effacement des styles
	$scope.afficherProfilsClear = function() {
		$http.get('/listerProfil')
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
				$scope.tagList = null;
				$scope.policeList = null;
				$scope.tailleList = null;
				$scope.interligneList = null;
				$scope.weightList = null;
				$scope.colorList = null;


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
		$scope.profil.photo = './files/profilImage/profilImage.jpg';
		$http.post('/ajouterProfils', $scope.profil)
			.success(function(data) {

				$scope.profilFlag = data; /*unit tests*/
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
				$('#addPanel').fadeIn('fast').delay(1000).fadeOut('fast');
				$scope.tagList = null;
				$scope.policeList = null;
				$scope.tailleList = null;
				$scope.interligneList = null;
				$scope.weightList = null;
				$scope.colorList = null;


			});
	};
	//Modification du profil
	$scope.modifierProfil = function() {
		$http.post('/updateProfil', $scope.profMod)
			.success(function(data) {
				$scope.profilFlag = data; /*unit tests*/

			});

	};
	//Suppression du profil
	$scope.supprimerProfil = function() {
		$http.post('/deleteProfil', $scope.sup)
			.success(function(data) {

				$scope.profilFlag = data; /* unit tests */
				$scope.afficherProfils();
				$scope.tagStyles.length = 0;
				$scope.tagStyles = [];

			});
	};

	//Premodification du profil
	$scope.preModifierProfil = function(profil) {
		$scope.profMod = profil;
		$scope.afficherTags();
		$http.post('/chercherTagsParProfil', {
			idProfil: profil._id
		})
			.success(function(data) {
				$scope.tagStylesFlag = data; /* Unit tests*/
				$scope.tagStyles = data;


			});
	};

	//Presuppression du profil
	$scope.preSupprimerProfil = function(profil) {
		$scope.sup = profil;
	};

	//Affichage des tags
	$scope.afficherTags = function() {
		$http.get('/readTags')
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

			$http.post('/ajouterProfilTag', profilTag)
				.success(function(data) {

					$scope.profilTagFlag = data; /* unit tests */
					$scope.afficherProfils();
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

				$http.post('/ajouterProfilTag', profilTag)
					.success(function(data) {
						if (data === 'err') {
							console.log('Problème survenu lors de l\'opération');
						} else {
							$scope.editionFlag = data; /* unit tests*/
							$scope.afficherProfils();
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
	};

	//Griser select après validation
	$scope.affectDisabled = function(param) {
		if (param) {
			return true;
		} else {
			return false;
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

		$scope.tagList = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.weightList = null;
		$scope.colorList = null;

	};

	$scope.checkStyleTag = function() {
		if ($scope.tagStyles.length > 0) {
			return false;
		} else {
			return true;
		}

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

		} else {
			if (!$scope.currentTagProfil.state) {
				var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';
				$http.post('/modifierProfilTag', {
					profilTag: {
						'id': $scope.currentTagProfil._id,
						'texte': mytext,
						'police': $scope.policeList,
						'taille': $scope.tailleList,
						'interligne': $scope.interligneList,
						'styleValue': $scope.weightList,
						'coloration': $scope.colorList
					}
				})
					.success(function(data) {
						$scope.modProfilFlag = data; /*unit tests*/

					});

			}else{
				$scope.currentTagProfil.police = $scope.policeList;
				$scope.currentTagProfil.taille = $scope.tailleList ;
				$scope.currentTagProfil.interligne = $scope.interligneList;
				$scope.currentTagProfil.styleValue = $scope.weightList;
				$scope.currentTagProfil.coloration = $scope.colorList;
				$scope.currentTagProfil.texte = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';


			}

		}
		$scope.currentTagProfil = null;

		// $('#selectId option').eq(0).prop('selected', true);
		$('#selectId').prop('disabled', false);

		$scope.editTag = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.weightList = null;
		$scope.colorList = null;

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
		}else{
			
			for (var i = $scope.listTags.length - 1; i >= 0; i--) {
				if (parameter.tag === $scope.listTags[i]._id) {
					$scope.listTags[i].disabled = false;
				}
			}

			var index2 = $scope.tagStyles.indexOf(parameter);

			if (index2 > -1) {
				$scope.tagStyles.splice(index2, 1);
			}

			$http.post('/supprimerProfilTag', parameter)
				.success(function(data) {
					if (data === 'err') {
						console.log('Désolé un problème est survenu lors de la suppression');
					} else {
						$scope.editionSupprimerTagFlag = data; /* Unit test */
					}
				});

		}



	};
	//Modification d'un tag lors de l'edition 
	$scope.editionModifierTag = function(parameter) {
		$scope.currentTagProfil = parameter;
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if (parameter.tag === $scope.listTags[i]._id) {

				$scope.listTags[i].disabled = false;
				angular.element($('#selectId option').each(function() {
					var itemText = $(this).text();
					if (itemText === parameter.tagName) {
						$(this).prop('selected', true);
						$('#selectId').prop('disabled', 'disabled');
						$('#editValidationButton').prop('disabled', false);


					}
				}));
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
		console.log('editStyleChange');
		$rootScope.$emit('reglesStyleChange', {
			'operation': operation,
			'element': 'shown-text-edit',
			'value': value
		});

	};

	$scope.editHyphen = function() {
		angular.element($('.shown-text-edit').addClass('hyphenate'));
		$('#selectId').removeAttr('disabled');


	};



});