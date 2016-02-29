angular.module('cnedApp').controller('listDocumentModalCtrl', function($scope, $controller, $modalInstance){
   
   /**
    * this controller inherits from listDocumentCtrl
    */
   $controller('listDocumentCtrl', {$scope: $scope});
   
    /**
     * closes a modal instance
     */
    $scope.closeModal = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.searchQuery = {};
    
    /* Filtre sur le nom de document à afficher */
    $scope.specificFilterForModal = function() {
        // parcours des Documents
        for (var i = 0; i < $scope.listDocument.length; i++) {
            $scope.listDocument[i].showed = $scope.listDocument[i].filename.toLowerCase().indexOf($scope.searchQuery.query.toLowerCase()) !== -1;
        }
    };
});