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

angular.module('cnedApp').controller('listDocumentCtrl', function($scope, $rootScope, serviceCheck, $http, $location, uploadDropBox, configuration) {

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
					$('#listDocumentPage').show();

					if (document.getElementById('JSON') === null) {
						console.log('loaded from dropbox');
						$http.get('https://api.dropbox.com/1/search/sandbox/?access_token=tLV5CIPVEoAAAAAAAAAAAcZ5zmTIIKjC1VVmeR3zdMokH9dTnk_jIrmAm6oLaVsN&query=.html').success(function(data) {
							$scope.listDocument = data;

							var myscript = document.createElement('script');
							myscript.id = 'JSON';
							myscript.text = JSON.stringify($scope.listDocument);
							document.body.appendChild(myscript);
							console.log(JSON.parse(document.getElementById('JSON').text));

							$http.get('https://localhost:3000/index.html')
								.success(function(data) {
									var tmp = uploadDropBox.upload('test.html', data, 'tLV5CIPVEoAAAAAAAAAAAcZ5zmTIIKjC1VVmeR3zdMokH9dTnk_jIrmAm6oLaVsN');
									tmp.then(function(result) { // this is only run after $http completes
										console.log(result);
									});
								})
								.error(function() {
									console.log('erreur lors du telechargement de la page catalogue');
								});
							// $('body').html().toString();
						}).error(function() {
							console.log('une erreur');
						});
					} else {
						console.log('from page');
						$scope.listDocument = JSON.parse(document.getElementById('JSON').text);
					}

				}
			} else {
				if (localStorage.getItem('compte')) {
					console.log('access token trouve');
					$http.get('https://api.dropbox.com/1/search/sandbox/?access_token=tLV5CIPVEoAAAAAAAAAAAcZ5zmTIIKjC1VVmeR3zdMokH9dTnk_jIrmAm6oLaVsN&query=.html').success(function(data) {
						$scope.listDocument = data;

						var myscript = document.createElement('script');
						myscript.id = 'JSON';
						myscript.text = JSON.stringify($scope.listDocument);
						document.body.appendChild(myscript);
						console.log(JSON.parse(document.getElementById('JSON').text));
						$('#listDocumentPage').show();
						// $('body').html().toString();
					}).error(function() {
						console.log('une erreur');
					});

				} else {
					$location.path('/');
				};
				// console.log(window.location.href);
				// var lien = window.location.href;
				// var verif = false;
				// if ((lien.indexOf('http://dl.dropboxusercontent.com') > -1)) {
				// 	window.location=lien.replace('listDocument', '');
				// } else {
				// 	if ($location.path() !== '/') {
				// 		$location.path('/');
				// 	}
				// }

			}
		});
	};

});