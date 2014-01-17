'use strict';

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http, _) {

	$scope.weightLists = ["Bold", "Normal"];
	$scope.listTypes = ['Dyslexie N1', 'Dyslexie N2', 'Dyslexie N3'];
	$scope.listNiveaux = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '1ère', '2ème', 'brevet'];

	$scope.headers = ["photo", "nom", "type", "descriptif", "action"];
	$scope.profilTag = {};
	// Liste des fichiers a uploader
	$scope.files = [];
	$scope.profil = {};
	$scope.listTag = {};
	$scope.tagStyles = [];
	$scope.idTag = [];
	$scope.styleApplique = [];


	$scope.policeLists = ['Arial', 'Dyslexic', 'Times New Roman'];
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

	//Affichage des differents profils sur la page
	$scope.afficherProfils = function() {
		$http.get('/listerProfil')
			.success(function(data) {
			$scope.listeProfils = data;
			// $scope.tagStyles = [];
		});

	};

	$scope.afficherProfilsClear = function() {
			$http.get('/listerProfil')
			.success(function(data) {
			$scope.listeProfils = data;
			 $scope.tagStyles = [];

		});

	}
	//Affiche les widgets en bleu
	$scope.isTagStylesNotEmpty = function() {
		if($scope.tagStyles.length >= 0)
		{
			return true;
		}
	}
	//Ajout d'un profil
	$scope.ajouterProfil = function() {
		$scope.profil.photo = "./files/profilImage.jpg";
		$http.post('/ajouterProfils', $scope.profil)
			.success(function(data) {
			if (data == 'err') {
				console.log("un problème est survenu lors de l'enregistrement");
			} else {
				$scope.profilFlag = data; /*unit tests*/
				$scope.lastDocId = data._id; 	
				$scope.ajouterProfilTag($scope.lastDocId);
				$scope.profil = {};
				$scope.tagStyles.length = 0;
				$scope.tagStyles = [];
			}
		});
	};
	//Modification du profil
	$scope.modifierProfil = function() {
		$http.post('/updateProfil', $scope.profMod)
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de la modification");
			} else {
					$scope.profilFlag = data; /*unit tests*/

			}
		});

	};
	//Suppression du profil
	$scope.supprimerProfil = function() {
		$http.post('/deleteProfil', $scope.sup)
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de la suppression");
			} else {
				$scope.profilFlag = data; /* unit tests */
				$scope.afficherProfils();
				$scope.tagStyles.length = 0 ;
				$scope.tagStyles = [];
			}
		});
	};

	//Premodification du profil
	$scope.preModifierProfil = function(profil) {
		$scope.profMod = profil;
		$scope.afficherTags();
		$http.post('/chercherTagsParProfil', {idProfil:profil._id})
			.success(function(data) {
				if (data == 'err') {
					console.log("Désolé un problème est survenu lors de la suppression");
				} else {
					$scope.tagStyles = data;

				}
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
			if (data != 'err') {
				$scope.listTags = data;
				// Set disabled tags
					for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
						for (var j = $scope.listTags.length - 1; j >= 0; j--) {
							if($scope.listTags[j]._id == $scope.tagStyles[i].tag){
								$scope.listTags[j].disabled = true;
							}
						};
					};
					
			}
		});
	};

	//Premodification du profilTag
	$scope.preModifierProfilTag = function(profilTag) {
		$scope.modprofTag = profilTag;
		$scope.afficherTags();
		$http.post('/updateProfilTag', $scope.profileTag)
			.success(function(data) {
				if (data == 'err') {
					console.log("Désolé un problème est survenu lors de la suppression");
				} else {
					
				}
			});
	};

	//Modification du ProfilTag
	$scope.modifierProfilTag = function() {
		$http.post('/updateProfilTag', $scope.profileTag)
			.success(function(data) {
				if (data == 'err') {
					console.log("Désolé un problème est survenu lors de la modification");
				} else {
					$scope.afficherProfils();
					$scope.profileTag = {};
					$scope.tagStyles = {};
				}
			});
	};

	//Ajout du profilTag
	$scope.ajouterProfilTag = function(lastDocId) {

		$scope.tagStyles.forEach(function(item) {
			var profilTag = {
				tag: item.id_tag,
				texte: item.style,
				profil: lastDocId,
				tagName: item.label,
				police:  item.police,
				taille: item.taille,
				interligne: item.interligne ,
				styleValue: item.styleValue,
			};

			$http.post('/ajouterProfilTag', profilTag)
				.success(function(data) {
				if (data == 'err') {
					console.log("Problème survenu lors de l'opération");
				}else{
					$scope.afficherProfils();
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

	//Edition ajout profil Tag
	$scope.editionAddProfilTag = function() {
		
		$scope.tagStyles.forEach(function(item) {
			if(item.state){
				var profilTag = {
					tag: item.tag,
					texte: item.texte,
					profil: item.profil,
					tagName: item.tagName,
					police:  item.police,
					taille: item.taille,
					interligne: item.interligne ,
					styleValue: item.styleValue,
				};
			
				$http.post('/ajouterProfilTag', profilTag)
				.success(function(data) {
					if (data == 'err') {
						console.log("Problème survenu lors de l'opération");
					}else{
						$scope.afficherProfils();
						$scope.profilTag = {};
						$scope.tagStyles.length = 0;
						$scope.tagStyles = [];
						$scope.tagList = {};
						$scope.policeList = {};
						$scope.tailleList = {};
						$scope.interligneList = {};
						$scope.weightList = {};
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
	}

	//Valider
	$scope.validerStyleTag = function() {
		$scope.currentTag = JSON.parse($scope.tagList);
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if ($scope.listTags[i]._id == $scope.currentTag._id) {
				$scope.tagID = $scope.listTags[i]._id;
				$scope.listTags[i].disabled = true;
				break;
			}
		}
		$scope.tagStyles.push({
			id_tag: $scope.currentTag._id,
			style: angular.element(document.querySelector('#style-affected'))[0].outerHTML,
			label : $scope.currentTag.libelle,
			police : $scope.policeList,
			taille : $scope.tailleList,
			interligne : $scope.interligneList,
			styleValue : $scope.weightList

		});
	}

	//Edition StyleTag
	$scope.editerStyleTag = function() {

	$scope.currentTagEdit = JSON.parse($scope.editTag);

		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if ($scope.listTags[i]._id == $scope.currentTagEdit._id) {
				$scope.listTags[i].disabled = true;
				break;
			}
		}
		$scope.tagStyles.push({

			tag: $scope.currentTagEdit._id,
			texte: angular.element(document.querySelector('#style-affected'))[0].outerHTML,
			tagName : $scope.currentTagEdit.libelle,
			profil: $scope.lastDocId,
			police : $scope.policeList,
			taille : $scope.tailleList,
			interligne : $scope.interligneList,
			styleValue : $scope.weightList,
			state : true

		});

	}

	//Suppression d'un paramètre
	$scope.ajoutSupprimerTag = function(parameter) {
			
		var index = $scope.tagStyles.indexOf(parameter);
		if (index > -1) {
		    $scope.tagStyles.splice(index, 1);
		}
		
		for (var j = $scope.listTags.length - 1; j >= 0; j--) {
		 		if($scope.listTags[j]._id == parameter.id_tag ){
		 			$scope.listTags[j].disabled = false;
		 		}
		};	
		
	}

	//Supression lors de l'edition d'un tag
	$scope.editionSupprimerTag = function(parameter) {

		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
				if(parameter.tag == $scope.listTags[i]._id){
					$scope.listTags[i].disabled = false;
				}
		};

		var index = $scope.tagStyles.indexOf(parameter);

		if (index > -1) {
			$scope.tagStyles.splice(index, 1);
		}
	
		$http.post('/supprimerProfilTag', parameter)
		.success(function(data) {
		if (data == 'err') {
			console.log("Désolé un problème est survenu lors de la suppression");
		} else {
		}
		});

	}

	$scope.afficherProfils();


});