'use strict';

angular.module('cnedApp')
	.controller('AnasCtrl', function myCtrl($scope){
	    $scope.isDisabled = false;
	    	$scope.decision = false;
    			$scope.addEditor = function() {
    				$scope.isDisabled = true;
    				$scope.ckEditors = [];
        			var init = "Texte Océrisé à modifier";
        			$scope.ckEditors.push({value:init});
     				$scope.decision = true;
    			};
    			$scope.getOcrText = function() {
    				$scope.editorValue = CKEDITOR.instances.editor1.document.getBody().getText();
    			}
    			
   	});