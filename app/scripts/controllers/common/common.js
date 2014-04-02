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

angular.module('cnedApp').controller('CommonCtrl', function($scope, $rootScope, $location, serviceCheck, gettextCatalog, $http, configuration) {


	$scope.logout = $rootScope.loged;
	$scope.admin = $rootScope.admin;
	$scope.missingDropbox = $rootScope.dropboxWarning;
	$scope.showMenuParam = false;

	$scope.currentUserData = {};
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


	$rootScope.$watch('currentUser', function() {
		$scope.currentUserData = $rootScope.currentUser;
		$scope.apply; // jshint ignore:line
		if ($scope.currentUserData) {
			$scope.afficherProfilsParUser();
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

	$rootScope.$watch('modifProfilListe', function() {
		if ($scope.currentUserData) {
			$scope.afficherProfilsParUser();
		}
	});

	$rootScope.$watch('listDocumentDropBox', function() {
		if ($rootScope.currentUser) {
			$scope.listDocumentDropBox = $rootScope.listDocumentDropBox + '#/listDocument?key=' + $rootScope.currentUser._id;
			$scope.apply;
		};

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

				}
			} else {
				var lien = window.location.href;
				var verif = false;
				if ((lien.indexOf('http://dl.dropboxusercontent.com') > -1)) {
					verif = true;
				}
				if ($location.path() !== '/' && verif !== true) {
					$location.path('/');
				}
			}
		});
	};

	$scope.logoutFonction = function() {
		if (localStorage.getItem('compteId')) {
			localStorage.removeItem('compteId');
			console.log('se deconnecter');
			$rootScope.loged = false;
			$rootScope.dropboxWarning = false;
			$rootScope.admin = null;
			$rootScope.currentUser = {};
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
				$scope.listeProfilsParUser = data;
				console.log('profil/user ==>');
				console.log(data);
			});

	};

	$scope.changeProfilActuel = function() {
		$scope.profilUser = {
			profilID: JSON.parse($scope.profilActuel)._id,
			userID: $scope.currentUserData._id,
		};
		console.log('$scope.profilUser ====>');
		console.log($scope.profilUser);
		$http.post(configuration.URL_REQUEST + '/ajouterUserProfil', $scope.profilUser)
			.success(function(data) {
				$scope.userProfilFlag = data;
				localStorage.setItem('profilActuel', $scope.profilActuel);

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