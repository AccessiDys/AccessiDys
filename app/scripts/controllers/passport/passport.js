/* File: passeport.js
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
/**
 *controller responsacle de tout les operation ayant rapport avec la bookmarklet
 */

/*global $:false */
/* jshint undef: true, unused: true */

angular.module('cnedApp').controller('passportCtrl', function($scope, $rootScope, $http, $location, configuration, serviceCheck, dropbox) {

	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$scope.stepsTitle = 'CRÉATION DE VOTRE COMPTE SUR CNEDADAPT';
	$scope.stepsSubTitle = 'Saisissez vos informations et créez votre compte CnedAdapt';
	$scope.testEnv = false;
	$scope.passwordForgotten = false;
	$scope.loginSign = true;
	$scope.guest = $rootScope.loged;
	$scope.passwordRestoreMessage = '';
	$scope.obj = {
		nomSign: '',
		prenomSign: '',
		emailSign: '',
		passwordSign: '',
		passwordConfirmationSign: ''
	};
	$scope.erreur = {
		erreurSigninNom: false,
		erreurSigninNomMessage: '',
		erreurSigninPrenom: false,
		erreurSigninPrenomMessage: '',
		erreurSigninEmail: false,
		erreurSigninEmailMessage: '',
		erreurSigninPasse: false,
		erreurSigninPasseMessage: '',
		erreurSigninConfirmationPasse: false,
		erreurSigninConfirmationPasseMessage: '',
		erreurSigninEmailNonDisponibleMessage: false
	};
	$scope.emailLogin = null;
	$scope.passwordLogin = null;
	$scope.showlogin = true; //true
	$scope.erreurLogin = false; //false
	$scope.erreurSignin = false; //false
	$scope.inscriptionStep1 = true; //true
	$scope.inscriptionStep2 = false; //false
	$scope.showStep2part1 = true; //true
	$scope.erreurSigninConfirmationPasse = false;
	$scope.erreurSigninEmailNonDisponible = false;
	$scope.step1 = 'btn btn-primary btn-circle';
	$scope.step2 = 'btn btn-default btn-circle';
	$scope.step3 = 'btn btn-default btn-circle';
	$scope.step4 = 'btn btn-default btn-circle';
	$scope.steps = 'step_one';
	$scope.logout = $rootScope.loged;
	$scope.missingDropbox = $rootScope.dropboxWarning;
	$scope.showpart2 = false;
	$scope.basculeButton = true;
	$scope.showBascule = true;


	$rootScope.$watch('dropboxWarning', function() {
		$scope.guest = $rootScope.loged;
		$scope.apply; // jshint ignore:line
	});

	$scope.init = function() {
		if (window.location.href.indexOf('https://dl.dropboxusercontent.com/') > -1) {
			$scope.showBascule = false;
		}

		if (window.location.href.indexOf('?Acces=true') > -1) {
			console.log('i have been redirected here');
			console.log(localStorage.getItem('redirectionEmail'));
			console.log(localStorage.getItem('redirectionPassword'));
			if (localStorage.getItem('redirectionEmail') && localStorage.getItem('redirectionPassword')) {
				console.log('inside Acces true if');
				$scope.emailLogin = localStorage.getItem('redirectionEmail');
				$scope.passwordLogin = localStorage.getItem('redirectionPassword');
				$scope.apply; // jshint ignore:line
				localStorage.removeItem('redirectionEmail');
				localStorage.removeItem('redirectionPassword');
				$scope.login();
			}
		}
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
				}
			} else {
				if ($location.path() !== '/') {
					$location.path('/');
				}
			}
		});
	};

	$scope.signin = function() {
		$scope.erreurSigninEmailNonDisponible = false;
		if ($scope.verifyEmail($scope.obj.emailSign) && $scope.verifyPassword($scope.obj.passwordSign) && $scope.verifyString($scope.obj.nomSign) && $scope.verifyString($scope.obj.prenomSign) && $scope.obj.passwordConfirmationSign === $scope.obj.passwordSign) {
			$scope.obj.emailSign = $scope.obj.emailSign.toLowerCase();
			var data = {
				email: $scope.obj.emailSign,
				password: $scope.obj.passwordSign,
				nom: $scope.obj.nomSign,
				prenom: $scope.obj.prenomSign
			};
			$http.post(configuration.URL_REQUEST + '/signup', data)
				.success(function(data) {
					$scope.basculeButton = false;
					$scope.steps = 'step_two';
					$scope.stepsTitle = 'COMPTE DROPBOX';
					$scope.stepsSubTitle = 'Association avec compte DropBox';
					$scope.singinFlag = data;
					console.log('signinFlag ==>');
					console.log($scope.singinFlag);
					localStorage.setItem('compteId', data._id);
					$scope.inscriptionStep1 = false;
					$scope.inscriptionStep2 = true;
					$scope.step2 = 'btn btn-primary btn-circle';
					$scope.step1 = 'btn btn-default btn-circle';
					$('#myModal').modal('show');
					/*chercher le userProfil avec default true*/
					$http.post(configuration.URL_REQUEST + '/chercherProfilParDefaut')
						.success(function(data) {
							$scope.chercherProfilParDefautFlag = data;
							console.log('data 1  ====>');
							/*chercher le profil avec l'id*/
							$http.post(configuration.URL_REQUEST + '/chercherProfil', $scope.chercherProfilParDefautFlag)
								.success(function(data) {
									$scope.chercherProfilFlag = data;
									console.log('data 2====>');
									console.log(data);
									/*création du profil dans la collection Profils*/

									$scope.ajoutDefault = {
										nom: $scope.chercherProfilFlag.nom,
										descriptif: $scope.chercherProfilFlag.descriptif,
										photo: $scope.chercherProfilFlag.photo,
										owner: $scope.singinFlag._id
									};
									/*Ajout d'un nouveau profil*/
									$http.post(configuration.URL_REQUEST + '/ajoutDefaultProfil', $scope.ajoutDefault)
										.success(function(data) {
											$scope.ajoutDefaultProfilFlag = data;
											console.log('$scope.ajoutDefaultProfilFlag ===>');
											console.log($scope.ajoutDefaultProfilFlag);

											/*création du profil dans la collection userProfil*/
											$scope.ajoutUserProfil = {
												profilID: $scope.ajoutDefaultProfilFlag._id,
												userID: $scope.singinFlag._id,
												favoris: false,
												actuel: true,
												default: false
											};
											$http.post(configuration.URL_REQUEST + '/addUserProfil', $scope.ajoutUserProfil)
												.success(function(data) {
													$scope.ajoutUserProfilFlag = data;
													console.log('saved into userProfil ===>');
													console.log($scope.ajoutUserProfilFlag);
													/*Chercher profils Tag par profil*/
													$http.post(configuration.URL_REQUEST + '/chercherProfilsTagParProfil', $scope.chercherProfilParDefautFlag)
														.success(function(data) {
															$scope.chercherProfilsTagParProfilFlag = data;
															console.log('chercherProfilsTagParProfilFlag ===>');
															console.log(data);
															/*STOCKAGE des profilTag de l'admin au niveau de profilTag*/
															if (data) {
																data.forEach(function(entry) {
																	entry._id = null;
																	entry.profil = $scope.ajoutDefaultProfilFlag._id;
																	$http.post(configuration.URL_REQUEST + '/saveProfilTag', entry)
																		.success(function(data2) {
																			console.log('insertion profilTag==>');
																			console.log(data2);
																			$scope.saveProfilTagFlag = data2;
																		});
																});
															}
														});
												});
										});
								});
						});
				})
				.error(function() {
					$scope.erreur.erreurSigninEmail = false;
					$scope.erreur.erreurSigninEmailNonDisponible = true;
				});
		} else {

			if (!$scope.verifyString($scope.obj.nomSign)) {
				if ($scope.obj.nomSign === '') {
					$scope.erreur.erreurSigninNomMessage = 'Nom : Cette donnée est obligatoire. Merci de compléter le champ.';
				} else {
					$scope.erreur.erreurSigninNomMessage = 'Nom : Veuillez n\'utiliser que des lettres (de a à z), des chiffres et des points.';
				}
				$scope.erreur.erreurSigninNom = true;
			} else {
				$scope.erreur.erreurSigninNom = false;
			}

			if (!$scope.verifyString($scope.obj.prenomSign)) {
				if ($scope.obj.prenomSign === '') {
					$scope.erreur.erreurSigninPrenomMessage = 'Prénom : Cette donnée est obligatoire. Merci de compléter le champ.';
				} else {
					$scope.erreur.erreurSigninPrenomMessage = 'Prénom : Veuillez n\'utiliser que des lettres (de a à z), des chiffres et des points.';

				}
				$scope.erreur.erreurSigninPrenom = true;
			} else {
				$scope.erreur.erreurSigninPrenom = false;
			}

			if (!$scope.verifyEmail($scope.obj.emailSign)) {
				if ($scope.obj.emailSign === '') {
					$scope.erreur.erreurSigninEmailMessage = 'Email : Cette donnée est obligatoire. Merci de compléter le champ.';
				} else {
					$scope.erreur.erreurSigninEmailMessage = 'Email : Veuillez entrer une adresse mail valable.';
				}
				$scope.erreur.erreurSigninEmail = true;
			} else {
				$scope.erreur.erreurSigninEmail = false;
			}

			if (!$scope.verifyPassword($scope.obj.passwordSign)) {
				$scope.erreur.erreurSigninPasseMessage = 'Le mot de passe doivent comporter au moins six caractères.';
				$scope.erreur.erreurSigninPasse = true;
			} else {
				$scope.erreur.erreurSigninPasse = false;
			}

			if ($scope.obj.passwordSign !== $scope.obj.passwordConfirmationSign) {
				if ($scope.obj.passwordConfirmationSign === '') {
					$scope.erreur.erreurSigninConfirmationPasseMessage = 'Veuillez confirmer votre mot de passe ici.';
				} else {
					$scope.erreur.erreurSigninConfirmationPasseMessage = 'Ces mots de passe ne correspondent pas.';
				}
				$scope.erreur.erreurSigninConfirmationPasse = true;
			} else {
				$scope.erreur.erreurSigninConfirmationPasse = false;
			}
		}
	};

	$scope.login = function() {

		if ($scope.testEnv === false) {
			if (document.getElementById('email').value && document.getElementById('mdp').value) {
				$scope.emailLogin = document.getElementById('email').value;
				$scope.passwordLogin = document.getElementById('mdp').value;
			}
		}
		if ($scope.verifyEmail($scope.emailLogin) && $scope.verifyPassword($scope.passwordLogin)) {
			$scope.emailLogin = $scope.emailLogin.toLowerCase();
			var data = {
				email: $scope.emailLogin,
				password: $scope.passwordLogin
			};
			$http.post(configuration.URL_REQUEST + '/login', data)
				.success(function(dataRecue) {
					//localStorage.setItem('compte', dataRecue.dropbox.accessToken);
					localStorage.setItem('compteId', dataRecue._id);
					$scope.loginFlag = dataRecue;
					$rootScope.loged = true;
					$rootScope.currentUser = dataRecue;
					$rootScope.apply; // jshint ignore:line
					console.log(configuration.CATALOGUE_NAME);
					console.log(dataRecue);
					if (dataRecue.dropbox) {
						var tmp = dropbox.search(configuration.CATALOGUE_NAME, dataRecue.dropbox.accessToken, configuration.DROPBOX_TYPE);
						tmp.then(function(result) {
							console.log('the result ==> ');
							console.log(result);
							if (result && result.length === 1) {
								var tmp2 = dropbox.search('listDocument.appcache', dataRecue.dropbox.accessToken, configuration.DROPBOX_TYPE);
								tmp2.then(function(resultCache) {
									if (resultCache.length === 1) {
										console.log('cache trouve aussi');
									} else {
										var tmp = dropbox.search('.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
										tmp.then(function(data) {
											$scope.listDocument = data;
											$http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(dataIndexPage) {
												var tmp = dropbox.upload('listDocument.appcache', dataIndexPage.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
												tmp.then(function() { // this is only run after $http completes
													console.log('manifest uploaded');
													var tmp2 = dropbox.shareLink('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
													tmp2.then(function(result) {
														$scope.manifestLink = result.url;
														$http.get(configuration.URL_REQUEST + '/index.html').then(function(dataIndexPage) {
															dataIndexPage.data = dataIndexPage.data.replace('<head>', '<head><meta name="utf8beacon" content="éçñøåá—"/>');
															dataIndexPage.data = dataIndexPage.data.replace('var listDocument=[]', 'var listDocument= ' + angular.toJson($scope.listDocument));
															dataIndexPage.data = dataIndexPage.data.replace('manifest=""', 'manifest=" ' + $scope.manifestLink + '"');
															var tmp = dropbox.upload(configuration.CATALOGUE_NAME, dataIndexPage.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
															tmp.then(function() { // this is only run after $http completes
																var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
																tmp4.then(function(result) {
																	$rootScope.listDocumentDropBox = result.url;
																	$rootScope.apply; // jshint ignore:line
																	// $scope.verifProfil();
																	$scope.roleRedirect();

																});
															});
														});
													});
												});
											});
										});
									}
								});
								/* localstorage when changing navigator */
								var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
								tmp4.then(function(result) {
									$rootScope.listDocumentDropBox = result.url;
									$rootScope.apply; // jshint ignore:line
									// $scope.verifProfil();
									$scope.roleRedirect();

								});
							} else {
								console.log('fichier non trouve ou plusieur fichier trouve');
								var tmp = dropbox.search('.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
								tmp.then(function(data) {
									$scope.listDocument = data;
									$http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(dataIndexPage) {
										var tmp2 = dropbox.upload('listDocument.appcache', dataIndexPage.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
										tmp2.then(function() { // this is only run after $http completes
											console.log('manifest uploaded');
											var tmp2 = dropbox.shareLink('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
											tmp2.then(function(result) {
												if (result) {
													$scope.manifestLink = result.url;
													$http.get(configuration.URL_REQUEST + '/index.html').then(function(dataIndexPage) {
														dataIndexPage.data = dataIndexPage.data.replace('var listDocument=[]', 'var listDocument= ' + angular.toJson($scope.listDocument));
														dataIndexPage.data = dataIndexPage.data.replace('manifest=""', 'manifest=" ' + $scope.manifestLink + '"');
														var tmp3 = dropbox.upload(configuration.CATALOGUE_NAME, dataIndexPage.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
														tmp3.then(function() { // this is only run after $http completes
															var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
															tmp4.then(function(result) {
																$rootScope.listDocumentDropBox = result.url;
																$rootScope.apply; // jshint ignore:line
																// $scope.verifProfil();
																$scope.roleRedirect();

															});
														});
													});
												}
											});
										});
									});
								});
							}
						});

					} else {
						if ($location.path() !== '/inscriptionContinue') {
							$location.path('/inscriptionContinue');
						}
					}
				}).error(function() {
					$scope.erreurLogin = true;
				});
		} else {
			$scope.erreurLogin = true;
		}
	};

	$scope.roleRedirect = function() {
		if ($scope.loginFlag.data) {
			if ($scope.loginFlag.data.local) {
				if ($scope.loginFlag.data.local === 'admin') {
					$location.path('/adminPanel');
				} else {

					window.location.href = $rootScope.listDocumentDropBox + '#/listDocument?key=' + localStorage.getItem('compteId');

				}
			}
		} else {
			//appele service uploader un fichier
			if ($scope.loginFlag.local.role === 'admin') {
				$location.path('/adminPanel');
			} else {
				if (window.location.href.indexOf('https://dl.dropboxusercontent.com/') > -1) {
					window.location.href = $rootScope.listDocumentDropBox + '#/listDocument';
				} else {
					window.location.href = $rootScope.listDocumentDropBox + '#/listDocument?key=' + localStorage.getItem('compteId');

				}
			}
		}
	};

	$scope.verifProfil = function() {
		console.log('setDropDownActuel ====>');
		if (!localStorage.getItem('profilActuel')) {
			console.log('inside FFF ');
			$scope.sentVar = {
				userID: $rootScope.currentUser._id,
				actuel: true
			};
			console.log($scope.sentVar);
			$http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.sentVar)
				.success(function(dataActuel) {
					console.log('dataActuel ==> ');
					console.log(dataActuel);
					$scope.chercherProfilActuelFlag = dataActuel;
					$scope.varToSend = {
						profilID: $scope.chercherProfilActuelFlag.profilID
					};
					$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
						idProfil: $scope.chercherProfilActuelFlag.profilID
					}).success(function(data) {
						console.log(data);
						$scope.chercherTagsParProfilFlag = data;
						localStorage.setItem('listTagsByProfil', JSON.stringify($scope.chercherTagsParProfilFlag));

					});
				});
		}
	};

	$scope.goNext = function() {
		// $location.path('?Acces=true');
		if (window.location.href.indexOf('https://dl.dropboxusercontent.com/') > -1) {
			window.location.href = configuration.URL_REQUEST;
		} else {
			$scope.showlogin = !$scope.showlogin;
		}
	};

	$scope.verifyEmail = function(email) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (reg.test(email)) {
			return true;
		} else {
			return false;
		}
	};

	$scope.verifyString = function(chaine) {
		var ck_nomPrenom = /^[A-Za-z0-9éèàâîôç' ]{3,20}$/;
		if (chaine === null) {
			return false;
		}
		if (!ck_nomPrenom.test(chaine)) {
			return false;
		}
		return true;
	};

	$scope.verifyPassword = function(password) {
		var ck_password = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;

		if (!ck_password.test(password)) {
			return false;
		}
		return true;
	};

	$scope.showPasswordRestorePanel = function() {
		$scope.loginSign = !$scope.loginSign;
		$scope.passwordForgotten = !$scope.passwordForgotten;
	};

	$scope.restorePassword = function() {
		if ($scope.verifyEmail($scope.emailRestore)) {
			var data = {
				email: $scope.emailRestore
			};
			$http.post(configuration.URL_REQUEST + '/restorePassword', data)
				.success(function(dataRecue) {
					console.log('success');
					console.log(dataRecue);
					$scope.successRestore = true;
					$scope.failRestore = false;
				}).error(function(error) {
					console.log('erreur');
					$scope.failRestore = true;
					$scope.successRestore = false;
					console.log(error);
				});
		} else {
			$scope.failRestore = true;
			if (!$scope.emailRestore) {
				$scope.passwordRestoreMessage = 'Email : Ce champ est obligatoire.';
			} else {
				$scope.passwordRestoreMessage = 'Email : Les données saisies sont invalides.';
			}


		}
	};
});