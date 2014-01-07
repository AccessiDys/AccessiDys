'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $http, $rootScope, _) {

	$scope.data = [];
	$scope.blocks = [];
	$scope.blocksAlternative = [];

	$scope.init = function(idDocuments) {
		// initialiser le nombre d'appel du service
		var callsFinish = 0;
		console.log("the documents length ==> ");
		console.log(idDocuments);

		if (idDocuments) {
			for (var i = 0; i < idDocuments.length; i++) {
				console.log(idDocuments[i]);

				$http.post("/getDocument", {
					idDoc: idDocuments[i]
				}).success(function(data, status, headers, config) {
					console.log(data);
					// incrémenter le nombre d'appel du service de 1
					callsFinish += 1;
					$scope.blocks.push(data);
					if (idDocuments.length == callsFinish) {
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
	$scope.init($rootScope.idDocument);

	// Catch detection of key up
	$scope.$on('keydown', function(msg, code) {
		if (code == 37) {
			$scope.$broadcast("prevSlide");
		} else if (code == 39) {
			$scope.$broadcast("nextSlide");
		}
	});

});