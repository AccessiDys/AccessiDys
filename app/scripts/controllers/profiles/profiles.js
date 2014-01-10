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
			}
		});
	};

	$scope.modifierProfil = function() {
		$http.post('/updateProfil', $scope.
		var)
			.success(function(data) {
			if (data == 'err') {
				console.log("Désolé un problème est survenu lors de la modification");
			} else {
				$scope.afficherProfils();
				$scope.
				var = {};
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
		$scope.
		var = profil;
	};

	$scope.preSupprimerProfil = function(profil) {
		$scope.sup = profil;
	};

	$scope.afficherTags = function() {
		$http.get('/readTags')
			.success(function(data) {
			if (data != 'err') {
				$scope.listTags = data;
			}
		});
	};


	$scope.ajouterProfilTag = function(lastDocId) {

		$scope.tagStyles.forEach(function(item) {
			var profilTag = {
				tag: item.id_tag,
				texte: item.style,
				profil: lastDocId,
			};

			$http.post('/ajouterProfilTag', profilTag)
				.success(function(data) {
				if (data == 'err') {
					console.log("oops");
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

	$scope.editerTag = function() {
		$scope.textes.text = $scope.profilTag.texte;
		console.log($scope.textes.text);
	}

	$scope.validerStyleTag = function() {

		// console.log("style applicated ==> ");
		// console.log(angular.element(document.querySelector('#style-affected')));
		// console.log(angular.element(document.querySelector('#style-affected'))[0].outerHTML);

		var currentTag = JSON.parse($scope.tagList);
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if ($scope.listTags[i]._id == currentTag._id) {
				$scope.tagID = $scope.listTags[i]._id;
				$scope.listTags[i].disabled = true;
				break;
			}
		};

		$scope.tagStyles.push({
			id_tag: currentTag._id,
			style: angular.element(document.querySelector('#style-affected'))[0].outerHTML
		});

		for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
			if ($scope.tagStyles[i].id_tag == currentTag._id) {
				$scope.tagStyles[i].label = $scope.listTags[i].libelle;

				break;
			}
		};

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
	$scope.clearVariable = "";
	console.log("json parse : ==> " + $scope.tailleDeListe);
	$scope.initialValue = "texte à styler";
	$scope.afficherProfils();


});