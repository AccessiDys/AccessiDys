'use strict';

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http) {

	$scope.headers =["photo","nom","type","descriptif","action"];

	$scope.afficherProfils = function(){
  		$http.get('/listerProfil') 
		.success(function(data){ 
   			$scope.listeProfils = data;
		});
	      		
    };

    $scope.ajouterProfil = function(){ 
	   	$http.post('/ajouterProfils',$scope.profil) 
	   	.success(function(data){ 
	   	if (data=='err'){ 
		   	console.log("un problème est survenu lors de l'enregistrement"); 
	   	} 
	   	else{ 
	   		$scope.profil = {};
		   	$scope.afficherProfils();
	   	} 
	   	});
   	};

  	$scope.modifierProfil = function(){
  		  		console.log($scope.var);

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
  		console.log($scope.sup);
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

	$scope.afficherProfils();

   	
});