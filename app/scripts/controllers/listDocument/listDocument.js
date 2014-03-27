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

angular.module('cnedApp').controller('listDocumentCtrl', function($scope, $rootScope, serviceCheck, $http, $location, dropbox, $window, configuration) {

	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').show();

	$scope.files = [];
	$scope.errorMsg = '';

	$scope.listDocument = [{
		titre: 'wahed test',
		date: '3/23/2014',
		_id: 1
	}, {
		titre: 'wahed test 2',
		date: '3/23/2014',
		_id: 2
	}];

	var appCache = window.applicationCache;

	appCache.addEventListener('updateready', function(e) {
		console.log(e);
		console.log('update ready');
		window.location.reload();
	}, false);

	appCache.addEventListener('cached', function(e) {
		console.log(e);
		console.log('cached');
		window.location.reload();
	}, false);
	appCache.addEventListener('noupdate', function(e) {
		console.log(e);
		console.log('no update found');
	}, false);

	$scope.initListDocument = function() {



		// var refresh = window.location.hash;
		// if (refresh.indexOf('?refresh=true') > -1) {
		// var url = window.location.href;
		// url = url.replace('?refresh=true', '');
		// window.location.href = url;
		// }


		if (navigator.onLine) {
			console.log('======== you are online ========');
			if (localStorage.getItem('compteId')) {
				var user = serviceCheck.getData();
				user.then(function(result) {
					console.log(result);
					if (result.loged) {
						console.log('======== you are loged =========')
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
							console.log('=======  you have full account  ========');
							$rootScope.myUser = result.user;
							$rootScope.loged = true;
							$rootScope.admin = result.admin;
							$rootScope.apply; // jshint ignore:line
							if ($rootScope.myUser.dropbox.accessToken) {
								var tmp5 = dropbox.search('.html', $rootScope.myUser.dropbox.accessToken, 'sandbox');
								tmp5.then(function(data) {
									console.log('=======  getting all .html  ========');
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
										}
									}
									if ($scope.initialLenght !== $scope.listDocument.length) {

										var tmp7 = dropbox.download('/test.html', $rootScope.myUser.dropbox.accessToken, 'sandbox');
										tmp7.then(function(entirePage) {
											var debut = entirePage.search('var listDocument') + 18;
											var fin = entirePage.indexOf('"}];', debut) + 3;
											entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
											entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson(listDocument));
											var tmp6 = dropbox.upload('test.html', entirePage, $rootScope.myUser.dropbox.accessToken, 'sandbox');
											tmp6.then(function() {
												var tmp3 = dropbox.download('/listDocument.appcache', localStorage.getItem('compte'), 'sandbox');
												tmp3.then(function(dataFromDownload) {
													console.log(dataFromDownload);
													var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
													dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
													var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.myUser.dropbox.accessToken, 'sandbox');
													tmp4.then(function() {
														console.log('new manifest uploaded');
														window.location.reload();
													});
												});
											});
										});
									}
									$('#listDocumentPage').show();
									$scope.listDocument = listDocument;
								});
							} else {
								$location.path('/');
							}
						}
					}
				});
			}
		} else {
			console.log('you are offline');
			/* jshint ignore:start */
			$scope.listDocument = listDocument;
			$('#listDocumentPage').show();

			/* jshint ignore:end */
		}
	};
	$scope.open = function(path) {
		$scope.deleteLink = path;
	};

	$scope.suprimeDocument = function() {
		if (localStorage.getItem('compte')) {
			var tmp = dropbox.delete($scope.deleteLink, localStorage.getItem('compte'), 'sandbox');
			tmp.then(function(result) {
				$('#myModal').modal('hide');
				$scope.initListDocument();
			});
		}

	};

	$scope.ajouterDocument = function() {
		if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length <= 0) {
			$scope.errorMsg = 'Le titre est obligatoire !';
			return;
		}
		var searchApercu = dropbox.search($scope.doc.titre + '.html', localStorage.getItem('compte'), configuration.DROPBOX_TYPE);
		searchApercu.then(function(result) {
			if (result && result.length > 0) {
				$scope.errorMsg = 'Le document existe déja dans Dropbox';
			} else {
				if ((!$scope.doc.lienPdf && $scope.files.length <= 0) || ($scope.doc.lienPdf && $scope.files.length > 0)) {
					$scope.errorMsg = 'Veuillez saisir un lien ou uploader un fichier !';
					return;
				}
				$('#addDocumentModal').modal('hide');
				$('#addDocumentModal').on('hidden.bs.modal', function() {
					if ($scope.files.length > 0) {
						$scope.doc.uploadPdf = $scope.files;
					}
					$rootScope.uploadDoc = $scope.doc;
					$scope.doc = {};
					$window.location.href = '/#/workspace';
				});
			}
		});
	};

	$scope.setFiles = function(element) {
		$scope.files = [];
		$scope.$apply(function() {
			for (var i = 0; i < element.files.length; i++) {
				if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf') {
					$scope.errorMsg = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.';
					$scope.files = [];
					break;
				} else {
					$scope.files.push(element.files[i]);
				}
			}
		});
	};

});