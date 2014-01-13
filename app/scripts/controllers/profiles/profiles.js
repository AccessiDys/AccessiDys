'use strict';

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http, _) {

	$scope.headers = ["photo", "nom", "type", "descriptif", "action"];
	$scope.profilTag = {};
	// Liste des fichiers a uploader
	$scope.files = [];
	$scope.profil = {};
	$scope.listTag = {};
	$scope.tagStyles = [];
	$scope.idTag = [];
	$scope.styleApplique = [];
	$scope.textes = {
		text: '<span style="font-family:opendyslexicregular;">text a styler</span>'
	};

	$scope.afficherProfils = function() {
		$http.get('/listerProfil')
			.success(function(data) {
			$scope.listeProfils = data;
		});

	};
	// $scope.getEditorValue = function() {

	// 	return CKEDITOR.instances['editorProfil'].getData();
	// }

	$scope.ajouterProfil = function() {
		$scope.profil.photo = "./files/profilImage.jpg";
		$http.post('/ajouterProfils', $scope.profil)
			.success(function(data) {
			if (data == 'err') {
				console.log("un problème est survenu lors de l'enregistrement");
			} else {
				$scope.afficherProfils();
				$scope.lastDocId = data._id;
				// console.log("profilID "+$scope.lastDocId);	
				// $scope.editorValue = $scope.getEditorValue();
				// console.log("editor value "+ $scope.editorValue);	   	
				$scope.ajouterProfilTag($scope.lastDocId);
				$scope.profil = {};
				$scope.tagStyles = {};
			}
		});
	};

	$scope.modifierProfil = function() {
		$http.post('/updateProfil', $scope.var)
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de la modification");
			} else {
				console.log(data);
				$scope.afficherProfils();
				$scope.var = {};
				$scope.tagStyles = {};
			}
		});
	};

	$scope.supprimerProfil = function() {
		$http.post('/deleteProfil', $scope.sup)
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de la suppression");
			} else {
				$scope.afficherProfils();
			}
		});
	};

	$scope.preModifierProfil = function(profil) {
		$scope.var = profil;
		$scope.afficherTags();
		console.log(profil);
		$http.post('/chercherTagsParProfil', {idProfil:profil._id})
			.success(function(data) {
				if (data == 'err') {
					console.log("Désolé un problème est survenu lors de la suppression");
				} else {
					$scope.tagStyles = data;

				}
			});

	};

	$scope.preSupprimerProfil = function(profil) {
		$scope.sup = profil;
	};

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
					// console.log('after ==> ');
					// console.log($scope.listTags[j]);
			}
		});
	};

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



	$scope.modifierProfilTag = function() {
		$http.post('/updateProfilTag', $scope.profileTag)
			.success(function(data) {
				if (data == 'err') {
					console.log("Désolé un problème est survenu lors de la modification");
				} else {
					console.log(data);
					$scope.afficherProfils();
					$scope.profileTag = {};
					$scope.tagStyles = {};
				}
			});
	};


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
					console.log("oops");
				}else{
					$scope.afficherProfils();
					$scope.profilTag = {};
				}
			});

		});

	};



	//   	$scope.selectAction = function() {
	//    	console.log($scope.listProfil._id);
	// };
	// $scope.options=['test1','test2','test3','test4','test5'];
	$scope.affectDisabled = function(param) {
		if (param) {
			return true;
		} else {
			return false;
		}
	}

	$scope.validerStyleTag = function() {

		// console.log("style applicated ==> ");
		// console.log(angular.element(document.querySelector('#style-affected')));
		// console.log(angular.element(document.querySelector('#style-affected'))[0].outerHTML);
		console.log($scope.tagList);
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

		console.log($scope.tagStyles);

		// for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
		// 	if ($scope.tagStyles[i].id_tag == $scope.currentTag._id) {
		// 		$scope.tagStyles[i].label = $scope.listTags[i].libelle;
		// 		break;
		// 	}
		// };

	}

		$scope.editerStyleTag = function() {

		// console.log("style applicated ==> ");
		// console.log(angular.element(document.querySelector('#style-affected')));
		// console.log(angular.element(document.querySelector('#style-affected'))[0].outerHTML);
		console.log($scope.editTag);
		$scope.currentTagEdit = JSON.parse($scope.editTag);

		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if ($scope.listTags[i]._id == $scope.currentTagEdit._id) {
				$scope.listTags[i].disabled = true;
				break;
			}
		}
		$scope.tagStyles.push({
			id_tag: $scope.currentTagEdit._id,
			style: angular.element(document.querySelector('#style-affected'))[0].outerHTML,
			tagName : $scope.currentTagEdit.libelle,
			police : $scope.policeList,
			taille : $scope.tailleList,
			interligne : $scope.interligneList,
			styleValue : $scope.weightList

		});


		// for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
		// 	if ($scope.tagStyles[i].id_tag == $scope.currentTag._id) {
		// 		$scope.tagStyles[i].label = $scope.listTags[i].libelle;
		// 		break;
		// 	}
		// };

	}

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
	
	}


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

	$scope.weightLists = ["Bold", "Normal"];
	$scope.listTypes = ['Dyslexie N1', 'Dyslexie N2', 'Dyslexie N3'];
	$scope.listNiveaux = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '1ère', '2ème', 'brevet'];
	$scope.afficherProfils();


});