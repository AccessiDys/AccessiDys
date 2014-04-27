/* File: common.js
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

/*global $:false */

angular.module('cnedApp').controller('CommonCtrl', function($scope, $rootScope, $location, serviceCheck, gettextCatalog, $http, configuration, dropbox, ShareService) {


	$scope.logout = $rootScope.loged;
	$scope.admin = $rootScope.admin;
	$scope.missingDropbox = $rootScope.dropboxWarning;
	$scope.showMenuParam = false;

	// $scope.currentUserData = {};
	$rootScope.updateListProfile = false;
	$rootScope.updateProfilListe = false;
	$rootScope.modifProfilListe = false;
	$rootScope.listDocumentDropBox = '';
	//if ($location.absUrl().indexOf('https://dl.dropboxusercontent.com/') > -1) {
	//$scope.deconnectionLink = window.location.href + 'logout';

	//};
	$scope.languages = [{
		name: 'FRANCAIS',
		shade: 'fr_FR'
	}, {
		name: 'ANGLAIS',
		shade: 'en_US'
	}];
	$scope.langue = $scope.languages[0];
	$scope.testEnv = false;

	$scope.workspaceLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
	$scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'profiles';
	$scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'userAccount';
	$scope.adminLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'adminPanel';
	$scope.docUrl = configuration.URL_REQUEST + '/styles/images/docs.png';
	$scope.logoUrl = configuration.URL_REQUEST + '/styles/images/header_logoCned.png';
	$scope.logoRedirection = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
	$scope.connectLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2).replace('adaptation.html#/', 'adaptation.html');
	if ($location.absUrl().indexOf('https://dl.dropboxusercontent.com') === -1) {
		$scope.connectLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2).replace('/#/', '');
		console.log($location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2));
	}
	// detect current location
	$scope.isActive = function(route) {
		return route === $location.path();
	};

	$scope.showMenu = function() {
		$scope.showMenuParam = !$scope.showMenuParam;
	};

	$rootScope.$on('setHideMenu', function() {
		$scope.showMenuParam = false;
		$scope.$apply();
	});

	$rootScope.$on('setHideMenu', function() {
		$scope.showMenuParam = false;
		$scope.$apply();
	});

	// Changer la langue
	$scope.changerLangue = function() {
		gettextCatalog.currentLanguage = $scope.langue.shade;
		$scope.showMenuParam = false;
	};

	$rootScope.$watch('loged', function() {
		$scope.logout = $rootScope.loged;
		console.log('==>' + $rootScope.loged);
		$scope.menueShow = $rootScope.loged;
		$scope.menueShowOffline = $rootScope.loged;
		if ($scope.testEnv === false) {
			$scope.browzerState = navigator.onLine;
		} else {
			$scope.browzerState = true;
		}
		if ($scope.browzerState) {
			if ($scope.menueShow !== true) {
				var lien = window.location.href;
				if (lien.indexOf('#/apercu') > -1) {
					console.log('inside apercu ... ');
					$scope.menueShow = true;
					$scope.menueShowOffline = true;
					$scope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
					$scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
					$scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
				}
			} else {
				console.log('setting menu Url');
				$scope.workspaceLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'listDocument';
				$scope.profilLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'profiles';
				$scope.userAccountLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'userAccount';
				$scope.adminLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'adminPanel';
				$scope.logoRedirection = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'listDocument';
			}
			$scope.apply; // jshint ignore:line	
		} else {
			console.log('common watch loged offline');
			$scope.menueShow = false;
			$scope.menueShowOffline = true;
			if (localStorage.getItem('dropboxLink')) {
				$scope.listDocumentDropBox = localStorage.getItem('dropboxLink');
				$scope.logoRedirection = localStorage.getItem('dropboxLink');

			} else {
				$scope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
				$scope.logoRedirection = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';

			}

			if (localStorage.getItem('profilActuel')) {
				console.log(JSON.parse(localStorage.getItem('profilActuel')).nom);
				$(this).prop('selected', true);
				$('#headerSelect + .customSelect .customSelectInner').text(JSON.parse(localStorage.getItem('profilActuel')).nom);
				$('#HideIfOffLine').hide();
			}
		}

	});

	$rootScope.$watch('admin', function() {
		$scope.admin = $rootScope.admin;
		$scope.apply; // jshint ignore:line
	});

	$rootScope.$watch('dropboxWarning', function() {
		$scope.guest = $rootScope.loged;
		$scope.apply; // jshint ignore:line
	});

	$scope.currentUserFunction = function() {
		if (localStorage.getItem('compteId')) {
			var dataProfile = {
				id: localStorage.getItem('compteId')
			};
		}

		$http.get(configuration.URL_REQUEST + '/profile', {
			params: dataProfile
		})
			.success(function(result) {
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
				$http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.token)
					.success(function(dataActuel) {
						$scope.dataActuelFlag = dataActuel;
						var tmp = {
							id: $scope.token.id,
							getActualProfile: dataActuel
						};
						console.log(dataActuel);
						$http.post(configuration.URL_REQUEST + '/chercherProfil', {
							id: $scope.token.id,
							searchedProfile: dataActuel.profilID
						})
							.success(function(data) {
								console.log(data);
								localStorage.setItem('profilActuel', JSON.stringify(data));
								$scope.setDropDownActuel = data;
								angular.element($('#headerSelect option').each(function() {
									var itemText = $(this).text();
									if (itemText === $scope.setDropDownActuel.nom) {
										$(this).prop('selected', true);
										$('#headerSelect + .customSelect .customSelectInner').text($scope.setDropDownActuel.nom);
									}
								}));
							});
					});
			});



	};

	$rootScope.$watch('currentUser', function() {
		$scope.currentUserData = $rootScope.currentUser;
		$scope.apply; // jshint ignore:line
		console.log('$scope.currentUserData ==> ');
		console.log($scope.currentUserData);
		if ($scope.currentUserData && $scope.currentUserData._id) {
			$scope.token = {
				id: $scope.currentUserData.local.token
			};
			$scope.currentUserFunction();
		}
	});

	$rootScope.$watch('actu', function() {

		if ($rootScope.actu && $scope.dataActuelFlag) {

			if ($rootScope.actu.owner === $scope.dataActuelFlag.userID && $scope.dataActuelFlag.actuel === true) {
				$scope.currentUserFunction();
				angular.element($('#headerSelect option').each(function() {
					$('#headerSelect + .customSelect .customSelectInner').text($scope.actu.nom);
					$(this).prop('selected', true);


				}));
			}
		}


	});

	$rootScope.$watch('updateListProfile', function() {
		if ($scope.currentUserData) {

			$scope.afficherProfilsParUser();
		}
	});

	$rootScope.$watch('updateProfilListe', function() {
		if ($scope.currentUserData) {
			$scope.afficherProfilsParUser();
		}
	});

	$scope.$watch('setDropDownActuel', function() {
		if ($scope.setDropDownActuel) {
			$scope.apply; // jshint ignore:line
		}
	});

	// $rootScope.$watch('favActu', function() {
	// 	console.log('inside favAc---->');
	// 	angular.element($('#headerSelect option').each(function() {
	// 		var itemText = $(this).text();
	// 		if (itemText === JSON.parse($scope.profilActuel).nom) {
	// 			$(this).prop('selected', true);
	// 			$('#headerSelect + .customSelect .customSelectInner').text(JSON.parse($scope.profilActuel).nom);

	// 		}
	// 	}));
	// });

	// $scope.initialFavActu = function() {
	// 	console.log('inside initialFavActu ----------------->');
	// 	angular.element($('#headerSelect option').each(function() {
	// 		var itemText = $(this).text();
	// 		if (itemText === JSON.parse($scope.profilActuel).nom) {
	// 			$(this).prop('selected', true);
	// 			$('#headerSelect + .customSelect .customSelectInner').text(JSON.parse($scope.profilActuel).nom);

	// 		}
	// 	}));
	// };

	// $scope.initialFavActu();


	$rootScope.$watch('modifProfilListe', function() {
		if ($scope.currentUserData) {
			$scope.afficherProfilsParUser();
		}
	});

	$rootScope.$watch('listDocumentDropBox', function() {
		console.log($rootScope.loged);
		if ($rootScope.loged === true) {
			if ($rootScope.currentUser) {
				$scope.listDocumentDropBox = $rootScope.listDocumentDropBox + '#/listDocument?key=' + $rootScope.currentUser.local.token;
				$scope.apply; // jshint ignore:line
				if ($location.absUrl().indexOf('https://dl.dropboxusercontent.com') < 0 && $location.absUrl().indexOf('inscriptionContinue') < 0) {
					//window.location.href = $scope.listDocumentDropBox;
					ShareService.emitEventsParam('storeDropboxLink', {
						'dropboxLink': $rootScope.listDocumentDropBox + '#/listDocument?key=' + $rootScope.currentUser.local.token,
						'redirectionLink': $rootScope.listDocumentDropBox + '#/listDocument?key=' + $rootScope.currentUser.local.token
					});
				};
			}
		} else {
			$scope.listDocumentDropBox = '';
		}
	});


	$scope.initCommon = function() {

		// var appCache = window.applicationCache;

		// console.log(appCache);
		//appCache.update(); // Attempt to update the user's cache.
		if ($location.absUrl().indexOf('key=') > -1) {
			var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
			localStorage.setItem('compteId', callbackKey);
		}
		$('#masterContainer').show();

		if ($scope.testEnv === false) {
			$scope.browzerState = navigator.onLine;
		} else {
			$scope.browzerState = true;
		}

		console.log('about to start getData');
		var tmp = serviceCheck.getData();
		tmp.then(function(result) { // this is only run after $http completes
			console.log('getData finished');
			console.log(result);
			if (result.loged) {
				console.log('i am loged');
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
					$scope.menueShow = true;
					$scope.menueShowOffline = true;
					$rootScope.dropboxWarning = true;
					$rootScope.admin = result.admin;
					$rootScope.currentUser = result.user;
					$scope.token = {
						id: $rootScope.currentUser.local.token
					};
					console.log($scope.token);
					console.log('token seted');
					$rootScope.apply; // jshint ignore:line
					$scope.afficherProfilsParUser();
					var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
					tmp4.then(function(result) {
						if (result) {
							$rootScope.listDocumentDropBox = result.url;
							$rootScope.apply; // jshint ignore:line
						}
					});
				}
			} else {
				var lien = window.location.href;
				var verif = false;
				if ((lien.indexOf('https://dl.dropboxusercontent.com') > -1)) {
					verif = true;
					if (lien.indexOf('#/apercu') > -1) {
						if ($scope.menueShow !== true && navigator.onLine) {
							var lien = window.location.href;
							if (lien.indexOf('#/apercu') > -1) {
								console.log('inside apercu ... ');
								$scope.menueShow = true;
								$scope.menueShowOffline = true;
								$scope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
								$scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
								$scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
							}
						} else {
							$scope.menueShow = false;
							$scope.workspaceLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'listDocument';
							$scope.logoRedirection = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'listDocument';

						}
					}
				}

				lien = window.location.href;
				if ($scope.browzerState) {
					if ($location.path() !== '/' && $location.path() !== '/passwordHelp' $location.path() !== '/detailProfil' && verif !== true) {
						$location.path('/');
					}

					if (lien.indexOf('Acces=true') > 0 && localStorage.getItem('redirectionEmail') && localStorage.getItem('redirectionPassword')) {
						console.log('event emited');
						$rootScope.$broadcast('initPassport');
					};
				} else {
					lien = window.location.href;
					$scope.listDocumentDropBox = localStorage.getItem('dropboxLink');
					$scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
					$scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
					console.log('======================>1');
					if (localStorage.getItem('dropboxLink') && lien.indexOf('https://dl.dropboxusercontent.com') < 0) {
						window.location.href = localStorage.getItem('dropboxLink');
					}
				}
			}
		});


	};

	$scope.logoutFonction = function() {
		angular.element($('#headerSelect option').each(function() {
			$('#headerSelect + .customSelect .customSelectInner').text('');
			console.log('done angular dropdown');
		}));

		localStorage.removeItem('profilActuel');
		// localStorage.removeItem('listTagsByProfil');
		var toLogout = serviceCheck.deconnect();
		toLogout.then(function() {
			if (localStorage.getItem('compteId')) {
				localStorage.removeItem('compteId');
				console.log('localStorage compteId removed');
			}
			$rootScope.loged = false;
			$rootScope.dropboxWarning = false;
			$rootScope.admin = null;
			$rootScope.currentUser = {};
			$scope.listDocumentDropBox = '';
			$rootScope.listDocumentDropBox = '';
			$rootScope.uploadDoc = {};
			$rootScope.apply; // jshint ignore:line
			$scope.logoRedirection = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
			console.log('all variable have been unsted');
			window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2);
		});
	};
	//displays user profiles
	$scope.afficherProfilsParUser = function() {
		$http.post(configuration.URL_REQUEST + '/profilParUser', $scope.token)
			.success(function(data) {
				$scope.listeProfilsParUser = data;
				/*Ajout des profils par défaut de l'administrateur à la liste tests des profils*/
				if ($rootScope.currentUser && $rootScope.currentUser.local.role !== 'admin') {
					var token = {
						id: $rootScope.currentUser.local.token
					};
					$http.post(configuration.URL_REQUEST + '/chercherProfilsParDefaut', token)
						.success(function(data) {
							$scope.profilsParDefautFlag = data;

							/*ajout profil actuel true à user profil*/
							if ($scope.profilsParDefautFlag.length > 0) {
								for (var i = $scope.profilsParDefautFlag.length - 1; i >= 0; i--) {
									$scope.ajoutUserProfil = {
										profilID: $scope.profilsParDefautFlag[i].profilID,
										userID: $rootScope.currentUser._id,
										favoris: false,
										actuel: false,
										default: false
									};
									$http.post(configuration.URL_REQUEST + '/addUserProfil', $scope.ajoutUserProfil)
										.success(function(data) {
											console.log(data);
										});
								};


								for (var i = $scope.profilsParDefautFlag.length - 1; i >= 0; i--) {
									$http.post(configuration.URL_REQUEST + '/chercherProfil', {
										id: $scope.token.id,
										searchedProfile: $scope.profilsParDefautFlag[i].profilID
									}).success(function(data) {
										console.log(data);
										$scope.profilArray = [];
										$scope.profilArray.push(data);
										for (var j = $scope.profilArray.length - 1; j >= 0; j--) {
											if ($scope.listeProfilsParUser.indexOf($scope.profilArray[j]) <= -1) {
												$scope.listeProfilsParUser.push($scope.profilArray[j]);
											}
										}
										$scope.currentUserFunction();

									});
								}
							}



						});
				}

				if (localStorage.getItem('compteId')) {
					var dataProfile = {
						id: localStorage.getItem('compteId')
					};
				}

				$http.get(configuration.URL_REQUEST + '/profile', {
					params: dataProfile
				})
					.success(function(result) {
						$scope.currentUser = result;


						$scope.varToGo = {
							userID: $scope.currentUser._id,
							favoris: true
						};

						$http.post(configuration.URL_REQUEST + '/findUserProfilsFavoris', $scope.token)
							.success(function(data2) {
								$scope.findUserProfilsFavorisFlag = data2;
								for (var i = $scope.findUserProfilsFavorisFlag.length - 1; i >= 0; i--) {
									$http.post(configuration.URL_REQUEST + '/chercherProfil', {
										id: $scope.token.id,
										searchedProfile: $scope.findUserProfilsFavorisFlag[i].profilID
									})
										.success(function(data3) {
											$scope.listeProfilsParUser.push(data3);
											$scope.currentUserFunction();
										});

								}


							});



					});



				$scope.requestToSend = {};
				if (localStorage.getItem('compteId')) {
					$scope.requestToSend = {
						id: localStorage.getItem('compteId')
					};
				}

				$http.get(configuration.URL_REQUEST + '/readTags', {
					params: $scope.requestToSend
				})
					.success(function(data) {
						$scope.listTags = data;
						localStorage.setItem('listTags', JSON.stringify($scope.listTags));
					});
			});


	};

	$rootScope.$on('initCommon', function(event) {
		$scope.afficherProfilsParUser();
	});

	$rootScope.$on('initProfil', function(event) {
		$scope.afficherProfilsParUser();
	});

	$rootScope.$on('afterSignInlisteProfilsParUser', function(event) {
		$scope.afficherProfilsParUser();
	});
	$scope.changeProfilActuel = function() {
		// $rootScope.favActu = !$rootScope.favActu;

		$scope.profilUser = {
			profilID: JSON.parse($scope.profilActuel)._id,
			userID: $scope.currentUserData._id,
		};

		$scope.profilUserFavourite = {
			profilID: JSON.parse($scope.profilActuel)._id,
			userID: $scope.currentUserData._id,
			favoris: true
		};
		if ($scope.token && $scope.token.id) {
			$scope.token.profilesFavs = $scope.profilUserFavourite;
		} else {
			$scope.token.id = localStorage.getItem('compteId');
			$scope.token.profilesFavs = $scope.profilUserFavourite;
		}
		$http.post(configuration.URL_REQUEST + '/findUsersProfilsFavoris', $scope.token)
			.success(function(data) {});

		$scope.token.newActualProfile = $scope.profilUser;

		$scope.requestToSend = {};
		if (localStorage.getItem('compteId')) {
			$scope.requestToSend = {
				id: localStorage.getItem('compteId')
			};
		}

		$http.get(configuration.URL_REQUEST + '/readTags', {
			params: $scope.requestToSend
		})
			.success(function(data) {
				$scope.listTags = data;
				localStorage.setItem('listTags', JSON.stringify($scope.listTags));
			});

		$http.post(configuration.URL_REQUEST + '/ajouterUserProfil', $scope.token)
			.success(function(data) {
				$scope.userProfilFlag = data;
				localStorage.setItem('profilActuel', $scope.profilActuel);
				$scope.userProfilFlag = data;
				$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
					idProfil: JSON.parse($scope.profilActuel)._id
				}).success(function(data) {
					$scope.listTagsByProfil = data;
					localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
					if ($location.absUrl().substring($location.absUrl().length - 8, $location.absUrl().length) === '#/apercu') {
						location.reload(true);
					}
				});
			});
	};

	$scope.showLastDocument = function() {
		var lastDocument = localStorage.getItem('lastDocument');
		$scope.lastDoc = '';
		if (lastDocument && lastDocument.length > 0) {
			$scope.lastDoc = lastDocument;
			var url = lastDocument.replace('#/apercu', '');
			$scope.lastDocTitre = decodeURI(url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.html')));
			// console.log($scope.lastDoc);
			// console.log($scope.lastDocTitre);
			if ($scope.lastDocTitre.length > 0) {
				var tmp = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.lastDocTitre))[0].replace('_', '').replace('_', ''));
				if (tmp) {
					$scope.lastDocTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($scope.lastDocTitre))[0].replace('_', '').replace('_', ''));
				} else {
					$scope.lastDocTitre = $scope.lastDocTitre.replace('/', '');
				}
				return true;
			}

		}
		return false;
	};

});