/* File: main.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';
/* global $ */
/* global listDocument */

angular.module('cnedApp').controller('listDocumentCtrl', function($scope, $rootScope, serviceCheck, $http, $location, dropbox) {

	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').show();

	$scope.listDocument = [{
		titre: 'wahed test',
		date: '3/23/2014',
		_id: 1
	}, {
		titre: 'wahed test 2',
		date: '3/23/2014',
		_id: 2
	}];

	$scope.initListDocument = function() {


		var appCache = window.applicationCache;

		appCache.addEventListener('updateready', function() {
			console.log('update ready');
			window.location.reload();
		}, false);



		// var refresh = window.location.hash;
		// if (refresh.indexOf('?refresh=true') > -1) {
		// 	var url = window.location.href;
		// 	url = url.replace('?refresh=true', '');
		// 	window.location.href = url;
		// }

		var tmp = serviceCheck.getData();
		tmp.then(function(result) { // this is only run after $http completes
			if (result.loged) {
				if (result.dropboxWarning === false) {
					$rootScope.dropboxWarning = false;
					$scope.missingDropbox = false;
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					if ($location.path() !== '/inscriptionContinue') {
						$location.path('/inscriptionContinue');
					}
				} else {
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					var tmp2 = dropbox.shareLink('test.html', localStorage.getItem('compte'), 'sandbox');
					tmp2.then(function(data) {
						window.location.href = data.url + '#/listDocument';
					});
				}
			} else {
				$('#listDocumentPage').show();
				if (navigator.onLine) {
					if (localStorage.getItem('compte')) {
						var tmp5 = dropbox.search('.html', localStorage.getItem('compte'), 'sandbox');
						tmp5.then(function(data) {
							$scope.listDocument = listDocument;
							$scope.initialLenght = $scope.listDocument.length;
							for (var i = 0; i < $scope.listDocument.length; i++) {
								var documentExist = false;
								for (var y = 0; y < data.length; y++) {
									if ($scope.listDocument[i].path === data[y].path) {
										console.log('ce document exist');
										documentExist = true;
									}
								}
								if (!documentExist) {
									console.log('ce document nexist pas');
									$scope.listDocument.splice(i);
									//console.log(listDocument);
									// entirePage = entirePage.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
								}
							}
							console.log($scope.initialLenght + '============' + $scope.listDocument.length);
							if ($scope.initialLenght !== $scope.listDocument.length) {

								var tmp7 = dropbox.download('/test.html', localStorage.getItem('compte'), 'sandbox');
								tmp7.then(function(entirePage) {
									console.log(entirePage);
									var debut = entirePage.search('var listDocument') + 18;
									var fin = entirePage.indexOf('"}];', debut) + 3; //entirePage.search('"}];') + 3;
									console.log(entirePage.charAt(fin));
									console.log('====================================' + debut + '========' + fin);
									console.log(entirePage.substring(debut, fin));
									entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
									console.log(entirePage);
									console.log('====================================');
									entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson(listDocument));
									// console.log(entirePage);
									// console.log('====================================');
									var tmp6 = dropbox.upload('test.html', entirePage, localStorage.getItem('compte'), 'sandbox');
									tmp6.then(function() {
										var tmp3 = dropbox.download('/listDocument.appcache', localStorage.getItem('compte'), 'sandbox');
										tmp3.then(function(dataFromDownload) {
											console.log(dataFromDownload);
											var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
											console.log('9dima ' + dataFromDownload.charAt(29) + 'jdoide' + newVersion);
											dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
											var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, localStorage.getItem('compte'), 'sandbox');
											tmp4.then(function() {
												console.log('new manifest uploaded');
												window.location.href = window.location.href + '?refresh=true';
											});
										});
									});
								});
							}

							// console.log(entirePage.search('var listDocument') + '---' + entirePage.charAt(entirePage.search('var listDocument')));
							// console.log(entirePage.search('bytes"}];') + '---' + entirePage.charAt(entirePage.search('bytes"}];')));
							$('#listDocumentPage').show();
							$scope.listDocument = listDocument;
						});
					} else {
						$location.path('/');
					}
				} else {
					console.log('you are offline');
					/* jshint ignore:start */
					$scope.listDocument = listDocument;
					/* jshint ignore:end */

				}
			}
		});
	};
	$scope.open = function(path) {
		$scope.deleteLink = path;
	};

	$scope.suprimeDocument = function() {
		if (localStorage.getItem('compte')) {
			var tmp = dropbox.delete($scope.deleteLink, localStorage.getItem('compte'), 'sandbox');
			tmp.then(function(result) {
				$('#myModal').modal('hide');
				console.log(result);
			});
		}

	};
});