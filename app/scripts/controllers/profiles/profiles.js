'use strict';

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http, _) {

	$scope.headers =["photo","nom","type","descriptif","action"];
	$scope.profilTag = {};
	   // Liste des fichiers a uploader
    $scope.files = [];
    $scope.profil = {};
    $scope.listTag = {};
	$scope.afficherProfils = function(){
  		$http.get('/listerProfil') 
		.success(function(data){ 
   			$scope.listeProfils = data;
		});
	      		
    };
    	$scope.getEditorValue = function() {

   		 return CKEDITOR.instances['editor1'].getData();
   	}

    $scope.ajouterProfil = function(){ 
    	$scope.profil.photo="/home/anass/Bureau/images.jpg";
	   	$http.post('/ajouterProfils',$scope.profil) 
	   	.success(function(data){ 
	   	if (data=='err'){ 
		   	console.log("un problème est survenu lors de l'enregistrement"); 
	   	} 
	   	else{
		   	$scope.afficherProfils();
		   	$scope.lastDocId = data._id;
		   	// console.log("profilID "+$scope.lastDocId);	
		   	$scope.editorValue = $scope.getEditorValue();
		   	console.log("editor value "+ $scope.editorValue);	   	
		   	$scope.ajouterProfilTag($scope.lastDocId);
			$scope.profil = {};		   	
	   	} 
	   	});
   	};

  	$scope.modifierProfil = function(){
	$http.post('/updateProfil', $scope.var)
		.success(function(data){ 
	    	if (data=='err'){ 
	    		console.log("Désolé un problème est survenu lors de la modification"); 
	    	} 
	    	else{ 
		   		$scope.afficherProfils();
	    		$scope.var= {};
	    	} 
    	});
	};

  	$scope.supprimerProfil = function(){
	$http.post('/deleteProfil', $scope.sup)
		.success(function(data){ 
	    	if (data=='err'){
	    		console.log("Désolé un problème est survenu lors de la suppression"); 
	    	} 
	    	else{ 
		    	$scope.afficherProfils();
	    	} 
    	});
	};

	$scope.preModifierProfil = function(profil){
		$scope.var = profil;
	};

	$scope.preSupprimerProfil = function(profil){
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

	$scope.initialisation = function() {
    	CKEDITOR.replace("editor1", { toolbar : 'StyleVersion' });

    }
    
    $scope.ajouterProfilTag = function(lastDocId){

		$scope.profilTag.profil = lastDocId;
   		$scope.profilTag.tag = $scope.listTag._id;
   		$scope.profilTag.texte = $scope.editorValue;

	   	$http.post('/ajouterProfilTag',$scope.profilTag) 
	   	.success(function(data){ 
	   	if (data=='err'){ 
		   	console.log("un problème est survenu lors de l'enregistrement"); 
	   	} 
	   	else{ 

	   	} 
	   	});
   	};

   
 //   	$scope.selectAction = function() {
 //    	console.log($scope.listProfil._id);
	// };
	// $scope.options=['test1','test2','test3','test4','test5'];
	$scope.affectDisabled = function(param) {
		if(param) {
			return true;
		} else {
			return false;
		}
	}

	$scope.addProfilTagTemp = function() {

		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if($scope.listTags[i]._id == JSON.parse($scope.tagList)._id) {
				$scope.tagID = $scope.listTags[i]._id;
				$scope.listTags[i].disabled = true;
				break;
			}
		};

		$scope.tagStyles.push({
   			idTag : [$scope.tagID],
   			styleApplique : [$scope.getEditorValue()]
   		});   

   		console.log($scope.tagStyles);


	}
    $scope.listTypes = ['Dyslexie N1','Dyslexie N2','Dyslexie N3'];
    $scope.listNiveaux = ['CP','CE1','CE2','CM1','CM2','1ère','2ème','brevet'];
    $scope.clearVariable = "";
  
    $scope.initialValue = "texte à styler";
	$scope.afficherProfils();

   	
});