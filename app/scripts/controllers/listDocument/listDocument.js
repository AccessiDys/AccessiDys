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
	$('#detailProfil').hide();
	$('#titreDocumentApercu').hide();
	$('#titreListDocument').show();

	$scope.onlineStatus = true;
	$scope.files = [];
	$scope.errorMsg = '';
	$scope.displayDestination = false;
	$scope.files = [];
	$scope.errorMsg = '';
	$scope.escapeTest = true;
	$scope.afficheErreurModifier = false;
	$scope.videModifier = false;
	$scope.specialCaracterModifier = false;
	$scope.testEnv = false;
	$scope.envoiMailOk = false;
	$scope.deleteFlag = false;
	$scope.flagModifieDucoment = false;
	$scope.flagListDocument = false;
	$scope.modifyCompleteFlag = false;
	$scope.loader = false;
	$rootScope.restructedBlocks = null;
	$rootScope.uploadDoc = null;
	$scope.requestToSend = {};
	if (localStorage.getItem('compteId')) {
		$scope.requestToSend = {
			id: localStorage.getItem('compteId')
		};
	}
	$scope.showloaderProgress = false;
	$scope.showloaderProgressScope = false;
	$rootScope.$on('RefreshListDocument', function() {
		console.log(' event recieved');
		$scope.initListDocument();
	});

	$rootScope.socket.on('notif', function(data) {
		console.log('socket here');
	});

	$scope.initListDocument = function() {
		if ($location.absUrl().indexOf('key=') > -1) {
			var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
			localStorage.setItem('compteId', callbackKey);
			$rootScope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('?key'));
			localStorage.setItem('dropboxLink', $rootScope.listDocumentDropBox);
			//window.location.href = $rootScope.listDocumentDropBox;
		}

		if ($location.absUrl().indexOf('?reload=true') > -1) {
			var reloadParam = $location.absUrl().substring(0, $location.absUrl().indexOf('?reload=true'));
			window.location.href = reloadParam;
		}
		if ($scope.testEnv === false) {
			$scope.browzerState = navigator.onLine;
		} else {
			$scope.browzerState = true;
		}
		if ($scope.browzerState) {
			if (localStorage.getItem('compteId')) {
				var user = serviceCheck.getData();
				user.then(function(result) {
					// console.log(result);
					if (result.loged) {
						console.log('======== you are loged and online =========');
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
							$rootScope.currentUser = result.user;
							$rootScope.loged = true;
							$rootScope.admin = result.admin;
							$rootScope.apply; // jshint ignore:line
							if ($rootScope.currentUser.dropbox.accessToken) {
								var tmp5 = dropbox.search('.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
								tmp5.then(function(data) {
									console.log('=======  getting all .html  ========');
									console.log(data);
									if (data.status === 200) {
										console.log('status is 200');
										$scope.listDocument = listDocument;
										$scope.initialLenght = $scope.listDocument.length;
										for (var i = 0; i < $scope.listDocument.length; i++) {
											var documentExist = false;
											for (var y = 0; y < data.length; y++) {
												if ($scope.listDocument[i].path === data[y].path) {
													documentExist = true;
													break;
												}
												// console.log('to delete======> ' + $scope.listDocument[i].path + '=====' + data[y].path);
												// console.log('document exist = ' + documentExist);
											}
											if (!documentExist) {
												$scope.listDocument.splice(i, 1);
											}
										}
										// console.log($scope.listDocument);
										if ($scope.initialLenght !== $scope.listDocument.length) {
											var tmp7 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
											tmp7.then(function(entirePage) {
												var debut = entirePage.search('var listDocument') + 18;
												var fin = entirePage.indexOf('"}];', debut) + 3;
												entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
												// console.log(entirePage.substring(debut, fin), '[]');
												entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson($scope.listDocument));
												// console.log('===========================');
												// console.log($scope.listDocument);
												var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
												tmp6.then(function() {
													var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
													tmp3.then(function(dataFromDownload) {
														// console.log(dataFromDownload);
														var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
														dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
														var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
														tmp4.then(function() {
															console.log('new manifest uploaded');
															$scope.flagListDocument = true;
															if ($scope.testEnv === false) {
																//alert('attention reload');
																window.location.reload();
															}
														});
													});
												});
											});
										}
									} else {
										console.log('status is not 200');
										console.log(data);
									}
									$scope.loader = false;
									$scope.localSetting();
									$scope.listDocument = listDocument;
									$('#listDocumentPage').show();

									for (var y = 0; y < $scope.listDocument.length; y++) { // jshint ignore:line
										var tmp = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[y].path));
										if (tmp) {
											$scope.listDocument[y].nomAffichage = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[y].path))[0].replace('_', '').replace('_', ''));
											$scope.listDocument[y].dateFromate = /((\d+)(-)(\d+)(-)(\d+))/i.exec($scope.listDocument[y].path)[0];
										} else {
											// $scope.listDocument.splice(y, 1);
											console.log($scope.listDocument);
											//$scope.listDocument[y].nomAffichage = $scope.listDocument[y].path.replace('/', '');
										}
									}
									for (var i = 0; i < $scope.listDocument.length; i++) { // jshint ignore:line
										var tmp = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[i].path)); // jshint ignore:line
										if (!tmp) {
											$scope.listDocument.splice(i, 1);
										}
									}



									$http.post(configuration.URL_REQUEST + '/allVersion', {
										id: $rootScope.currentUser.local.token
									})
										.success(function(dataRecu) {
											console.log('succeeeees');
											console.log(dataRecu);
											if (dataRecu.length !== 0) {
												if (Appversion !== '' + dataRecu[0].appVersion + '') {
													console.log('different');
													$scope.newAppVersion = dataRecu[0].appVersion;
													$('#updateVersionModal').modal('show');
												} else {
													console.log('les meme');
												}
											}
										}).error(function() {
											console.log('erreur cheking version');
										});
									// console.log($scope.listDocument);
									var dataProfile;
									if (localStorage.getItem('compteId')) {
										dataProfile = {
											id: localStorage.getItem('compteId')
										};
									}
									$http.get(configuration.URL_REQUEST + '/profile', {
										params: dataProfile
									}).success(function(result) {
										$scope.sentVar = {
											userID: result._id,
											actuel: true
										};
										if (!$scope.token && localStorage.getItem('compteId')) {
											$scope.token = {
												id: localStorage.getItem('compteId')
											};
										}
										$scope.token.getActualProfile = $scope.sentVar;
										console.log('======-----=-===-=-=--=-=-=');
										$http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.token)
											.success(function(dataActuel) {
												$scope.dataActuelFlag = dataActuel;
												$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
													idProfil: $scope.dataActuelFlag.profilID
												}).success(function(data) {
													$scope.listTagsByProfil = data;
													localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
												}).error(function(err) {
													console.log(err);
												});

											});
									}).error(function() {
										console.log('erreur');
									});
								});
							} else {
								$location.path('/');
							}
						}
					} else {
						console.log('some probleme retrieving user info');
						console.log(result);
						$location.path('/');
					}
				});
			} else {
				console.log('you are disconnected');
				$location.path('/');
			}
		} else {
			console.log('you are offline');
			/* jshint ignore:start */
			localStorage.setItem('wasOffLine', true);
			$scope.listDocument = listDocument;
			$scope.onlineStatus = false;
			for (var y = 0; y < $scope.listDocument.length; y++) {
				var tmp = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[y].path));
				if (tmp) {
					$scope.listDocument[y].nomAffichage = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[y].path))[0].replace('_', '').replace('_', ''));
					$scope.listDocument[y].dateFromate = /((\d+)(-)(\d+)(-)(\d+))/i.exec($scope.listDocument[y].path)[0];
				} else {
					// $scope.listDocument.splice(y, 1);
					console.log($scope.listDocument);
					//$scope.listDocument[y].nomAffichage = $scope.listDocument[y].path.replace('/', '');
				}
			}
			for (var i = 0; i < $scope.listDocument.length; i++) {
				var tmp = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.listDocument[i].path));
				if (!tmp) {
					$scope.listDocument.splice(i, 1);
				}
			}
			// for (var i = 0; i < $scope.listDocument.length; i++) {
			//  $scope.listDocument[i].path = $scope.listDocument[i].path.replace('/', '');
			// };
			$('#listDocumentPage').show();
			/* jshint ignore:end */
		}
	};
	$scope.open = function(document) {
		if ($scope.testEnv === false) {
			$scope.deleteLink = document.path;
			$scope.deleteLienDirect = document.lienApercu;
			$scope.listDocument = angular.fromJson(listDocument);
		}
		$scope.flagDeleteOpened = true;
	};
	$scope.suprimeDocument = function() {
		$('.loader_cover').show();
		$scope.showloaderProgress = true;
		$scope.showloaderProgressScope = true;
		$scope.loaderMessage = 'Supression du document dans votre DropBox en cours.';
		$scope.loaderProgress = 10;
		if (localStorage.getItem('compteId')) {
			var tmp2 = dropbox.delete('/' + $scope.deleteLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
			tmp2.then(function() {
				var appcacheLink = $scope.deleteLink;
				appcacheLink = appcacheLink.replace('.html', '.appcache');
				$scope.loaderProgress = 30;
				var tmp12 = dropbox.delete('/' + appcacheLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
				tmp12.then(function(deleteResult) {

					$scope.deleteFlag = true;
					$('#myModal').modal('hide');
					$scope.oldFile = deleteResult;
					$scope.loaderMessage = 'Mise en cache de votre document en cours.';
					$scope.loaderProgress = 40;
					var tmp3 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
					tmp3.then(function(entirePage) {
						for (var i = 0; i < $scope.listDocument.length; i++) {
							if ($scope.listDocument[i].path === $scope.deleteLink) {
								$scope.listDocument.splice(i, 1);
								break;
							}
						}
						$scope.verifLastDocument($scope.deleteLienDirect, null);
						var debut = entirePage.search('var listDocument') + 18;
						var fin = entirePage.indexOf('"}];', debut) + 3;
						entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
						entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson($scope.listDocument));

						$scope.loaderProgress = 50;
						var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
						tmp6.then(function() {
							$scope.loaderProgress = 60;
							var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
							tmp3.then(function(dataFromDownload) {
								$scope.loaderProgress = 80;
								// console.log(dataFromDownload);
								var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
								dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
								var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
								tmp4.then(function() {
									$scope.loaderProgress = 100;
									// console.log('new manifest uploaded');
									//window.location.reload();

									$scope.modifyCompleteFlag = true;
									$scope.loader = false;
									if ($scope.testEnv === false) {
										window.location.reload();
									}
								});
							});
						});
					});
				});
			});
		}
	};
	$scope.openModifieTitre = function(document) {
		$scope.selectedItem = document.path;
		$scope.selectedItemLink = document.lienApercu;
		// console.log($scope.selectedItem);
		// $scope.signature = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent($scope.selectedItem))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.selectedItem))[0],'');
		// console.log($scope.signature);
		$scope.afficheErreurModifier = false;
		$scope.videModifier = false;
		$scope.specialCaracterModifier = false;
		$scope.nouveauTitre = '';
		$scope.oldName = document.nomAffichage;
		$scope.nouveauTitre = document.nomAffichage;
		// $scope.oldName = $scope.oldName.replace('.html', '');
		$scope.apply; // jshint ignore:line
	};
	$scope.modifieTitre = function() {
		$scope.loader = true;
		if ($scope.nouveauTitre !== '') {
			if (!serviceCheck.checkName($scope.nouveauTitre)) {
				$scope.specialCaracterModifier = true;
				$scope.loader = false;
				return;
			}
			$scope.videModifier = false;
			var documentExist = false;
			for (var i = 0; i < $scope.listDocument.length; i++) {
				if ($scope.listDocument[i].path.indexOf('_' + $scope.nouveauTitre + '_') > -1) {
					console.log($scope.listDocument[i]);
					documentExist = true;
					break;
				}
			}
			if (documentExist) {
				$scope.afficheErreurModifier = true;
				$scope.loader = false;
			} else {
				// console.log('in else');
				$('#EditTitreModal').modal('hide');
				$scope.flagModifieDucoment = true;
				$scope.modifieTitreConfirme();
			}
		} else {
			$scope.videModifier = true;
		}
	};
	$scope.verifLastDocument = function(oldUrl, newUrl) {
		var lastDocument = localStorage.getItem('lastDocument');
		if (lastDocument && oldUrl === lastDocument) {
			if (newUrl && newUrl.length > 0) {
				newUrl = newUrl + '#/apercu';
				localStorage.setItem('lastDocument', newUrl);
			} else {
				localStorage.removeItem('lastDocument');
			}
		}
	};
	$scope.modifieTitreConfirme = function() {
		// console.log('---1----1----');
		$('.loader_cover').show();
		$scope.showloaderProgress = true;
		$scope.showloaderProgressScope = true;
		$scope.loaderMessage = 'Enregistrement du document dans votre DropBox en cours.';
		$scope.loaderProgress = 10;
		$scope.signature = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent($scope.selectedItem))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.selectedItem))[0], '');
		var ladate = new Date();
		var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();
		$scope.nouveauTitre = tmpDate + '_' + encodeURIComponent($scope.nouveauTitre) + '_' + $scope.signature;
		console.log('old');
		console.log($scope.selectedItem);
		console.log('new');
		console.log($scope.nouveauTitre);
		var tmp = dropbox.rename($scope.selectedItem, '/' + $scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
		// console.log($scope.selectedItem);
		tmp.then(function(result) {
			$scope.loaderProgress = 20;
			// console.log('---2----2----');
			$scope.newFile = result;
			console.log(result);
			var tmp3 = dropbox.shareLink($scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
			tmp3.then(function(resultShare) {
				$scope.loaderProgress = 30;
				console.log('STEP 1');
				console.log(resultShare);
				$scope.newShareLink = resultShare.url;
				var tmp2 = dropbox.delete('/' + $scope.selectedItem, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
				tmp2.then(function(deleteResult) {
					$scope.oldFile = deleteResult;
					console.log('STEP 2');
					console.log($scope.oldFile);
					//new code start
					$scope.loaderProgress = 40;
					$scope.oldAppcacheName = $scope.selectedItem.replace('.html', '.appcache');
					var tmp11 = dropbox.rename($scope.oldAppcacheName, '/' + $scope.nouveauTitre + '.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
					tmp11.then(function() {
						console.log('STEP 3');
						console.log('appcache renamed');
						var tmp112 = dropbox.delete('/' + $scope.oldAppcacheName, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
						tmp112.then(function() {
							$scope.loaderProgress = 50;
							console.log('STEP 3 just delete old appcache');
							var tmp12 = dropbox.shareLink($scope.nouveauTitre + '.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
							tmp12.then(function(dataFromDownloadAppcache) {
								$scope.loaderProgress = 55;
								console.log('STEP 4');
								console.log('shareLink Of new appcache');
								console.log(dataFromDownloadAppcache);
								var tmp13 = dropbox.download($scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
								tmp13.then(function(entirePageApercu) {
									$scope.loaderProgress = 60;
									console.log('STEP 5');
									console.log(entirePageApercu);
									var debutApercu = entirePageApercu.search('manifest="') + 10;
									var finApercu = entirePageApercu.indexOf('.appcache"', debutApercu) + 9;
									console.log(debutApercu);
									console.log(finApercu);
									console.log(entirePageApercu.substring(debutApercu, finApercu));
									entirePageApercu = entirePageApercu.replace(entirePageApercu.substring(debutApercu, finApercu), '');
									entirePageApercu = entirePageApercu.replace('manifest=""', 'manifest="' + dataFromDownloadAppcache.url + '"');
									console.log('entirePage manifest replaced');
									// console.log(entirePageApercu);
									var tmp14 = dropbox.upload($scope.nouveauTitre + '.html', entirePageApercu, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
									tmp14.then(function() {
										$scope.loaderProgress = 65;
										console.log('STEP 6');
										var tmp3 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
										tmp3.then(function(entirePage) {
											$scope.loaderMessage = 'Mise en cache de votre document en cours.';
											$scope.loaderProgress = 70;
											console.log('STEP 7');
											console.log(entirePage);
											for (var i = 0; i < listDocument.length; i++) {
												if (listDocument[i].path === $scope.selectedItem) {
													// console.log('element a remplacer trouver');
													$scope.newFile.lienApercu = $scope.newShareLink + '#/apercu';
													listDocument[i] = $scope.newFile;
													break;
												}
											}
											$scope.verifLastDocument($scope.selectedItemLink, $scope.newShareLink);
											var debut = entirePage.search('var listDocument') + 18;
											var fin = entirePage.indexOf('"}];', debut) + 3;
											entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
											entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson(listDocument));
											console.log(debut);
											console.log(fin);
											console.log(entirePage.substring(debut, fin));
											console.log('new version');
											console.log(entirePage);
											var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
											tmp6.then(function() {
												$scope.loaderProgress = 80;
												console.log('STEP 8');
												var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
												tmp3.then(function(dataFromDownload) {
													$scope.loaderProgress = 90;
													console.log('STEP 9');
													console.log(dataFromDownload);
													var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
													dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
													var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
													tmp4.then(function() {
														console.log('STEP 10');
														console.log('new manifest uploaded');
														//window.location.reload();
														$scope.modifyCompleteFlag = true;
														if ($scope.testEnv === false) {
															console.log('reload manually');
															window.location.reload();
														}
													});
												});
											});
										});
									});
								});
							});
						});
					});
					//new code end
				});
			});
		});
	};
	$scope.verifyLink = function(link) {
		if (link) {
			if ((link.indexOf('https') > -1) || (link.indexOf('http') > -1)) {
				return true;
			}
		}
		return false;
	};

	$scope.ajouterDocument = function() {
		if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length <= 0) {
			$scope.errorMsg = 'Le titre est obligatoire !';
			return;
		}
		if (!serviceCheck.checkName($scope.doc.titre)) {
			$scope.errorMsg = 'Veuillez ne pas utiliser les caractères spéciaux.';
			return;
		}
		var searchApercu = dropbox.search('_' + $scope.doc.titre + '_', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
		searchApercu.then(function(result) {
			// console.log('search lanched');
			// console.log(result);
			if (result && result.length > 0) {
				// console.log('1');
				$scope.errorMsg = 'Le document existe déja dans Dropbox';
			} else {
				// console.log('2');
				if ((!$scope.doc.lienPdf && $scope.files.length <= 0) || ($scope.doc.lienPdf && $scope.files.length > 0)) {
					// console.log('3');
					$scope.errorMsg = 'Veuillez saisir un lien ou uploader un fichier !';
					return;
				}
				if ($scope.doc.lienPdf && !$scope.verifyLink($scope.doc.lienPdf)) {
					// console.log('4');
					$scope.errorMsg = 'Le lien saisi est invalide. Merci de respecter le format suivant : "http://www.example.com/chemin/NomFichier.pdf"';
					return;
				}
				// console.log('5');
				// console.log($scope.doc);
				$scope.modalToWorkspace = true;
				$('#addDocumentModal').modal('hide');
			}
		});
	};

	$('#addDocumentModal').on('hidden.bs.modal', function() {
		if ($scope.modalToWorkspace) {
			if ($scope.files.length > 0) {
				console.log('6');
				$scope.doc.uploadPdf = $scope.files;
			}
			// console.log('7');
			$rootScope.uploadDoc = $scope.doc;
			$scope.doc = {};
			if ($scope.escapeTest) {
				// console.log('8');
				$window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
			}
		} else {
			$scope.doc = {};
			$scope.files = [];
			$('#docUploadPdf').val('');
			$scope.errorMsg = null;
		}
	});

	$scope.setFiles = function(element) {
		console.log('pos1 setfiles');
		console.log(element.files);
		$scope.files = [];
		var field_txt = '';
		$scope.$apply(function() {
			console.log('pos2 setfiles');
			for (var i = 0; i < element.files.length; i++) {
				console.log('pos3 setfiles');
				console.log('element.files[i].type ' + element.files[i].name);

				console.log(element.files);
				if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf' && element.files[i].type !== 'application/epub+zip') {
					if (element.files[i].type === '' && element.files[i].name.indexOf('.epub')) {
						$scope.files.push(element.files[i]);
						field_txt += ' ' + element.files[i].name;
						$('#filename_show').val(field_txt);
					} else {
						$scope.errorMsg = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.';
						$scope.files = [];
						break;
					}
				} else {
					$scope.files.push(element.files[i]);
					field_txt += ' ' + element.files[i].name;
					$('#filename_show').val(field_txt);
				}
			}
		});
	};
	$scope.clearUploadPdf = function() {
		$scope.files = [];
		$('#docUploadPdf').val('');
		$('#filename_show').val('');
	};
	$scope.getfileName = function() {
		console.warn('UploadFile function ===>' + $scope.uploadFile)
		console.info(angular.element(this).scope().setFiles(this));
	};
	/*load email form*/
	$scope.loadMail = function() {
		$scope.displayDestination = true;
	};
	/*regex email*/
	$scope.verifyEmail = function(email) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (reg.test(email)) {
			return true;
		} else {
			return false;
		}
	};
	$scope.docPartage = function(param) {
		$scope.docApartager = param;
		$('.action_btn').attr('data-shown', 'false');
		$('.action_list').attr('style', 'display: none;');
		$scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
		if ($scope.docApartager && $scope.docApartager.lienApercu) {
			$scope.encodedLinkFb = $scope.docApartager.lienApercu.replace('#', '%23');
		}
	};
	/*envoi de l'email au destinataire*/
	$scope.sendMail = function() {
		$('#confirmModal').modal('hide');
		$scope.destination = $scope.destinataire;
		$scope.loader = true;
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			if ($scope.docApartager) {
				if ($rootScope.currentUser.dropbox.accessToken) {
					if (configuration.DROPBOX_TYPE) {
						if ($rootScope.currentUser && $scope.docApartager && $scope.docApartager.path) {
							$scope.docApartager.path = decodeURI($scope.docApartager.path);
							$scope.sharedDoc = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.docApartager.path))[0].replace('_', '').replace('_', ''));
							$scope.sendVar = {
								to: $scope.destinataire,
								content: ' a utilisé cnedAdapt pour partager un fichier avec vous !  ' + $scope.docApartager.lienApercu,
								encoded: '<span> vient d\'utiliser CnedAdapt pour partager ce fichier avec vous :   <a href=' + $scope.docApartager.lienApercu + '>' + $scope.sharedDoc + '</a> </span>',
								prenom: $rootScope.currentUser.local.prenom,
								fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
								doc: $scope.sharedDoc
							};
							$http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
								.success(function(data) {
									$('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
									$scope.sent = data;
									$scope.envoiMailOk = true;
									$scope.destinataire = '';
									$scope.loader = false;
									$scope.displayDestination = false;
									// $('#shareModal').modal('hide');
								});
						}
					}
				}
			}
		} else {
			$('.sendingMail').removeAttr('data-dismiss', 'modal');
			$('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');
		}
	};

	$scope.clearSocialShare = function() {
		$scope.confirme = false;
		$scope.displayDestination = false;
		$scope.destinataire = '';
	};

	$scope.socialShare = function() {
		$scope.destination = $scope.destinataire;
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			$('#confirmModal').modal('show');
			$('#shareModal').modal('hide');
		}
	};
	$scope.dismissConfirm = function() {
		$scope.destinataire = '';
	};
	// verifie l'exostance de listTags et listTagByProfil et les remplie si introuvable
	$scope.localSetting = function() {
		console.log(localStorage.getItem('listTags'));
		if (!localStorage.getItem('listTags')) {
			console.log('here');
			$http.get(configuration.URL_REQUEST + '/readTags', {
				params: $scope.requestToSend
			})
				.success(function(data) {
					$scope.listTags = data;
					$scope.flagLocalSettinglistTags = true;
					localStorage.setItem('listTags', JSON.stringify($scope.listTags));
				});
		}
		if (!localStorage.getItem('listTagsByProfil')) {
			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: localStorage.getItem('compteId')
			}).success(function(data) {
				$scope.listTagsByProfil = data;
				$scope.flagLocalSettinglistTagsByProfil = true;
				localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
			}).error(function() {
				console.log('err');
			});
		}
	};
	$scope.restructurerDocument = function(document) {
		$scope.loader = true;
		if ($rootScope.currentUser.dropbox.accessToken) {
			var apercuName = document.path.replace('/', '');
			var token = $rootScope.currentUser.dropbox.accessToken;
			var downloadApercu = dropbox.download(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
			downloadApercu.then(function(result) {
				var arraylistBlock = {
					children: []
				};
				if (result.indexOf('var blocks = null') < 0) {
					var debut = result.indexOf('var blocks = ') + 13;
					var fin = result.indexOf('};', debut) + 1;
					arraylistBlock = angular.fromJson(result.substring(debut, fin));
				}
				$rootScope.restructedBlocks = arraylistBlock;
				$rootScope.docTitre = apercuName.substring(0, apercuName.lastIndexOf('.html'));
				console.log($rootScope.docTitre);
				$scope.loader = false;
				if ($scope.escapeTest) {
					$window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
				}
			});
		}
	};
	$scope.startUpgrade = function() {
		$('.loader_cover').show();
		$scope.showloaderProgress = true;
		$scope.loaderMessage = 'Recuperation de la nouvelle Version de l\'application';
		$scope.loaderProgress = 30;

		var lienListDoc = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('.html') + 5);
		console.log('Lien dropbox : ' + lienListDoc);
		var tmp = dropbox.download('adaptation.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
		tmp.then(function(oldPage) {

			// console.log(oldPage);
			//manifest
			var manifestStart = oldPage.indexOf('manifest="');
			var manifestEnd = oldPage.indexOf('.appcache"', manifestStart) + 10;
			var manifestString = oldPage.substring(manifestStart, manifestEnd);
			console.log(manifestStart);
			console.log(manifestEnd);
			console.log(manifestString);
			// 					//document JSON
			var jsonStart = oldPage.indexOf('var listDocument');
			var jsonEnd = oldPage.indexOf(']', jsonStart) + 1;
			var jsonString = oldPage.substring(jsonStart, jsonEnd);
			console.log(jsonStart);
			console.log(jsonEnd);
			console.log(jsonString);
			$scope.loaderProgress = 50;
			$http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(newAppcache) {
				var newVersion = parseInt(newAppcache.data.charAt(29)) + parseInt(Math.random() * 100);
				newAppcache.data = newAppcache.data.replace(':v' + newAppcache.data.charAt(29), ':v' + newVersion);
				var tmp2 = dropbox.upload('listDocument.appcache', newAppcache.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
				tmp2.then(function() {
					$scope.loaderProgress = 70;
					$http.get(configuration.URL_REQUEST + '/index.html').then(function(dataIndexPage) {

						dataIndexPage.data = dataIndexPage.data.replace("var Appversion=''", "var Appversion='" + $scope.newAppVersion + "'");
						dataIndexPage.data = dataIndexPage.data.replace('<head>', '<head><meta name="utf8beacon" content="éçñøåá—"/>');
						dataIndexPage.data = dataIndexPage.data.replace('var listDocument= []', jsonString);
						dataIndexPage.data = dataIndexPage.data.replace('manifest=""', manifestString);
						console.log(dataIndexPage.data);
						$scope.loaderMessage = 'Upload de la nouvelle version de l\'application';
						$scope.loaderProgress = 90;
						var tmp = dropbox.upload(configuration.CATALOGUE_NAME, dataIndexPage.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
						tmp.then(function() { // this is only run after $http completes
							console.log('you can reload');
							if ($scope.testEnv === false) {
								window.location.reload();
							}
						});
					});
				})
			})
		})
	}
});