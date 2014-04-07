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

angular.module('cnedApp').controller('CommonCtrl', function($scope, $rootScope, $location, serviceCheck, gettextCatalog, $http, configuration, dropbox, $window) {


	$scope.logout = $rootScope.loged;
	$scope.admin = $rootScope.admin;
	$scope.missingDropbox = $rootScope.dropboxWarning;
	$scope.showMenuParam = false;

	// $scope.currentUserData = {};
	$rootScope.updateListProfile = false;
	$rootScope.updateProfilListe = false;
	$rootScope.modifProfilListe = false;

	//if ($location.absUrl().indexOf('http://dl.dropboxusercontent.com/') > -1) {
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

	$scope.workspaceLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
	$scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'profiles';
	$scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'userAccount';
	$scope.adminLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'adminPanel';
	$scope.docUrl = configuration.URL_REQUEST + '/styles/images/docs.png';
	$scope.logoUrl = configuration.URL_REQUEST + '/styles/images/header_logoCned.png';
	$scope.connectLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2);
	// detect current location
	$scope.isActive = function(route) {
		return route === $location.path();
	};

	$scope.showMenu = function() {
		$scope.showMenuParam = !$scope.showMenuParam;
	};

	// Changer la langue
	$scope.changerLangue = function() {
		gettextCatalog.currentLanguage = $scope.langue.shade;
		$scope.showMenuParam = false;
	};

	$rootScope.$watch('loged', function() {
		$scope.logout = $rootScope.loged;

		$scope.apply; // jshint ignore:line
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
		$scope.sentVar = {
			userID: $rootScope.currentUser._id,
			actuel: true
		};
		$http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.sentVar)
			.success(function(dataActuel) {
			$scope.dataActuelFlag = dataActuel;
			$http.post(configuration.URL_REQUEST + '/chercherProfil', dataActuel)
				.success(function(data) {

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
	};

	$rootScope.$watch('currentUser', function() {
		$scope.currentUserData = $rootScope.currentUser;
		$scope.apply; // jshint ignore:line
		console.log('$scope.currentUserData ==> ');
		console.log($scope.currentUserData);
		if ($scope.currentUserData && $scope.currentUserData._id) {
			$scope.afficherProfilsParUser();
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
			$scope.apply;
		}
	});

	$rootScope.$watch('modifProfilListe', function() {
		if ($scope.currentUserData) {
			$scope.afficherProfilsParUser();
		}
	});

	$rootScope.$watch('listDocumentDropBox', function() {
		console.log($rootScope.loged);
		if ($rootScope.loged === true) {
			if ($rootScope.currentUser) {
				$scope.listDocumentDropBox = $rootScope.listDocumentDropBox + '#/listDocument?key=' + $rootScope.currentUser._id;
				$scope.apply;
			};
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
		};
		$('#masterContainer').show();
		var tmp = serviceCheck.getData();
		tmp.then(function(result) { // this is only run after $http completes
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
					$rootScope.dropboxWarning = true;
					$rootScope.admin = result.admin;
					$rootScope.currentUser = result.user;

					$rootScope.apply; // jshint ignore:line
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
				if ((lien.indexOf('http://dl.dropboxusercontent.com') > -1)) {
					verif = true;
				}
				if ($location.path() !== '/' && $location.path() !== '/passwordHelp' && verif !== true) {
					$location.path('/');
				}
			}
		});
	};

	$scope.logoutFonction = function() {
		angular.element($('#headerSelect option').each(function() {
			$('#headerSelect + .customSelect .customSelectInner').text('');
			console.log('done angular dropdown');
		}));

		// localStorage.removeItem('profilActuel');
		// localStorage.removeItem('listTagsByProfil');
		if (localStorage.getItem('compteId')) {
			localStorage.removeItem('compteId');
			console.log('se deconnecter');
			$rootScope.loged = false;
			$rootScope.dropboxWarning = false;
			$rootScope.admin = null;
			$rootScope.currentUser = {};
			$scope.listDocumentDropBox = '';
			$rootScope.apply; // jshint ignore:line
			$location.path('/#/');
		};
	}
	//displays user profiles
	$scope.afficherProfilsParUser = function() {
		$http.post(configuration.URL_REQUEST + '/profilParUser', {
			id: $scope.currentUserData._id
		})
			.success(function(data) {
			console.log('finish afficherProfilsParUser ... ');
			console.log(data);
			$scope.listeProfilsParUser = data;
			$http.get(configuration.URL_REQUEST + '/readTags')
				.success(function(data) {
				$scope.listTags = data;
				localStorage.setItem('listTags', JSON.stringify($scope.listTags));
			});

			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: $scope.listeProfilsParUser[0]._id
			}).success(function(data) {
				$scope.listTagsByProfil = data;
				localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
			});
		});

	};

	$scope.changeProfilActuel = function() {
		$scope.profilUser = {
			profilID: JSON.parse($scope.profilActuel)._id,
			userID: $scope.currentUserData._id,
		};

		$http.post(configuration.URL_REQUEST + '/ajouterUserProfil', $scope.profilUser)
			.success(function(data) {
			$scope.userProfilFlag = data;
			localStorage.setItem('profilActuel', $scope.profilActuel);
			$scope.userProfilFlag = data;
			if ($location.absUrl().substring($location.absUrl().length - 8, $location.absUrl().length) === '#/apercu') {
				location.reload(true);
			}

		});

		$http.get(configuration.URL_REQUEST + '/readTags')
			.success(function(data) {
			$scope.listTags = data;
			localStorage.setItem('listTags', JSON.stringify($scope.listTags));
		});

		$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
			idProfil: JSON.parse($scope.profilActuel)._id
		}).success(function(data) {
			$scope.listTagsByProfil = data;
			localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
		});

	};

	$scope.showLastDocument = function() {
		var lastDocument = localStorage.getItem('lastDocument');
		$scope.lastDoc = '';
		if (lastDocument && lastDocument.length > 0) {
			$scope.lastDoc = lastDocument;
			var url = lastDocument.replace('#/apercu', '');
			$scope.lastDocTitre = decodeURI(url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.html')));
			return true;
		}
		return false;
	};

});