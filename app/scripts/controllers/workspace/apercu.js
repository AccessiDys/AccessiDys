'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $http, $rootScope, _) {

	$scope.data = [];
	$scope.blocks = [];
	$scope.blocksAlternative = [];

	$scope.init = function() {
		// initialiser le nombre d'appel du service
		var callsFinish = 0;

		if ($rootScope.idDocument) {
			for (var i = 0; i < $rootScope.idDocument.length; i++) {
				// console.log($rootScope.idDocument[i]);

				$http.post("/getDocument", {
					idDoc: $rootScope.idDocument[i]
				}).success(function(data, status, headers, config) {
					// console.log(data);
					// incrémenter le nombre d'appel du service de 1
					callsFinish += 1;
					$scope.blocks.push(data);
					if ($rootScope.idDocument.length == callsFinish) {
						// implement show des blocks
						traverse($scope.blocks);
						console.log("treatment finished ==> ");
						console.log($scope.blocksAlternative);
						// $scope.sliderHtml = '<ul slideit="{data}" ></ul>';
						// $scope.$apply();
					}
				}).error(function(data, status, headers, config) {
					$scope.msg = "ko";
				});

			}
		}
	}

	function traverse(obj) {
		for (var key in obj) {
			for (var key in obj) {
				if (typeof(obj[key]) == "object") {
					var alreadyExist = _.findWhere($scope.blocksAlternative, {
						source: obj[key].source
					});

					if (!alreadyExist) {
						$scope.blocksAlternative.push(obj[key]);
					}

					if (obj[key].children.length > 0) {
						traverse(obj[key].children);
					}
				}
			}
		}
	}

	// init slider
	$scope.init();

});