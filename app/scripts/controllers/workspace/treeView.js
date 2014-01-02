'use strict';

angular.module('cnedApp').controller('TreeViewCtrl', function($scope, $http, $rootScope, _) {

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

			// if (typeof(obj[key]) == "object") {
			// 	if (obj[key]._id != undefined) {
			// 		console.log("in traverse ==> ");
			// 		console.log(obj);
			// 		$scope.data.children.push({
			// 			_id: obj[key]._id,
			// 			text: obj[key].text,
			// 			image: obj[key].image,
			// 			children: obj[key].children
			// 		});
			// 		// traverse(obj[key]);
			// 		traverse(obj[key].children);
			// 	}
			// }
		}
	}

	$scope.init();

	// $scope.afficherDocument = function() {
	// 	$http.get('/listerDocument')
	// 		.success(function(data) {
	// 		if (data != 'err') {
	// 			$scope.listeDocument = data;
	// 			traverse($scope.listeDocument);
	// 		}
	// 	});

	// };

	// $scope.afficher = function() {

	// 	function traverse(obj) {
	// 		for (var key in obj) {
	// 			if (typeof(obj[key]) == "object") {
	// 				if (obj[key]._id != undefined) {
	// 					$scope.data.children.push({
	// 						_id: obj[key]._id,
	// 						titre: obj[key].titre,
	// 						image: obj[key].image,
	// 						children: obj[key].children
	// 					});
	// 					traverse(obj[key]);
	// 				}
	// 			}
	// 		}
	// 	}
	// 	traverse($scope.listeDocument);
	// };

	// $scope.afficherDocument();

	// $scope.toggleMinimized = function(child) {
	// 	child.minimized = !child.minimized;
	// };
	// $scope.addChild = function(child) {
	// 	child.children.push({
	// 		titre: 'titre',
	// 		image: '/home/abdelhaq/Bureau/cned.jpg',
	// 		children: []
	// 	});
	// };

	// $scope.show = function() {

	// 	function walk(target) {
	// 		var children = target.children,
	// 			i;
	// 		if (children) {
	// 			i = children.length;
	// 			if (i == 0) {
	// 				console.log("\n");
	// 			}
	// 			while (i--) {
	// 				console.log(children[i].titre);
	// 				walk(children[i]);
	// 			}
	// 		}
	// 	}

	// 	var child = $scope.data.children;
	// 	var l = child.length;
	// 	while (l--) {
	// 		console.log(child[l].titre);
	// 		walk(child[l]);
	// 	}
	// };

	// $scope.save = function() {
	// 	$http.post('/ajouterDocuments', angular.toJson($scope.data.children))
	// 		.success(function(data) {
	// 		if (data == 'err') {
	// 			console.log("Désolé un problème est survenu lors de l'enregistrement");
	// 		} else {

	// 		}
	// 	});
	// 	console.log(angular.toJson($scope.data.children));
	// };


	// $scope.remove = function(child) {
	// 	function walk(target) {
	// 		var children = target.children,
	// 			i;
	// 		if (children) {
	// 			i = children.length;
	// 			while (i--) {
	// 				if (children[i] === child) {
	// 					return children.splice(i, 1);
	// 				} else {
	// 					walk(children[i]);
	// 				}
	// 			}
	// 		}
	// 	}
	// 	walk($scope.data);
	// };

	// $scope.update = function(event, ui) {

	// 	var root = event.target,
	// 		item = ui.item,
	// 		parent = item.parent(),
	// 		target = (parent[0] === root) ? $scope.data : parent.scope().child,
	// 		child = item.scope().child,
	// 		index = item.index();

	// 	target.children || (target.children = []);

	// 	function walk(target, child) {
	// 		var children = target.children,
	// 			i;
	// 		if (children) {
	// 			i = children.length;
	// 			while (i--) {
	// 				if (children[i] === child) {
	// 					return children.splice(i, 1);
	// 				} else {
	// 					walk(children[i], child)
	// 				}
	// 			}
	// 		}
	// 	}
	// 	walk($scope.data, child);

	// 	target.children.splice(index, 0, child);
	// };

});