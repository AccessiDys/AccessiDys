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
});