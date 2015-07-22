/* File: adminPanel.js
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
/* jshint indent: false */

describe('Controller:AdminPanelCtrl', function() {
	var $scope, controller;

	var serviceCheck;
	var q;
	var deferred;
	var accounts = [{
		_id: '52c588a861485ed41c000001',
		local: {
			email: 'email@email.com',
			nom: 'nom1',
			prenom: 'prenom1',
			password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
			role: 'user',
			restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
			secretTime: '201431340',
			token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
			tokenTime: 1397469765520,
      authorisations : {
        audio : true,
        ocr : false
      }

		},
		loged: true,
		dropboxWarning: false,
		admin: true
	}, {
		_id: '52c588a861485ed41c000002',
		local: {
			email: 'email2@email.com',
			nom: 'nom2',
			prenom: 'prenom2',
			password: '$2a$089.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
			role: 'admin',
			restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
			secretTime: '201431340',
			token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
			tokenTime: 1397469765520,
      authorisations : {
        audio : true,
        ocr : false
      }
		},
		loged: true,
		dropboxWarning: false,
		admin: true
	}];

	var account = {
		_id: '52c588a861485ed41c210001',
		local: {
			email: 'mail@email.com',
			nom: 'nom3',
			prenom: 'prenom3',
			password: '$2a$08$.tZ6f5O4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
			role: 'user'

		}
	};



	beforeEach(module('cnedApp'));

	beforeEach(function() {
		serviceCheck = {
			getData: function() {
				deferred = q.defer();
				deferred.resolve({
					_id: '52c588a861485ed41c000001',
					dropbox: {
						accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
						country: 'MA',
						display_name: 'youbi anas', // jshint ignore:line
						emails: 'anasyoubi@gmail.com',
						referral_link: 'https://db.tt/wW61wr2c', // jshint ignore:line
						uid: '264998156'
					},
					local: {
						email: 'email@email.com',
						nom: 'nom1',
						prenom: 'prenom1',
						password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
						role: 'user',
						restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
						secretTime: '201431340',
						token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
						tokenTime: 1397469765520,
            authorisations : {
              audio : true,
              ocr : false
            }
					},
					loged: true,
					dropboxWarning: true,
					admin: true,
					user: {

						_id: '52c588a861485ed41c000001',
						dropbox: {
							accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
							country: 'MA',
							display_name: 'youbi anas', // jshint ignore:line
							emails: 'anasyoubi@gmail.com',
							referral_link: 'https://db.tt/wW61wr2c', // jshint ignore:line
							uid: '264998156'
						},
						local: {
							email: 'email@email.com',
							nom: 'nom1',
							prenom: 'prenom1',
							password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
							role: 'user',
							restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
							secretTime: '201431340',
							token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
							tokenTime: 1397469765520,
              authorisations : {
                audio : true,
                ocr : false
              }
						},
						loged: true,
						dropboxWarning: true,
						admin: true

					}
				});
				return deferred.promise;
			}
		};
	});
	beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration, $q) {
		$scope = $rootScope.$new();
		q = $q;

		controller = $controller('AdminPanelCtrl', {
			$scope: $scope,
			serviceCheck: serviceCheck
		});

		$rootScope.currentUser = {
			local: {
				token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec'
			}
		};

		$scope.dataRecu = {
			__v: 0,
			_id: '5347c304a7338a14500e3068',
			dropbox: {
				accessToken: 'wyoEkXeYTqwAAAAAAAAAQ3S0cHhOjNeUGun3-YrW1w3qAzuuVofDEHx-S3TqhASp',
				country: 'MA',
				display_name: 'youbi anas', // jshint ignore:line
				emails: 'anasyoubi@gmail.com',
				referral_link: 'https://db.tt/t85GO47x', // jshint ignore:line
				uid: '264998156'
			},
			local: {
				email: 'anasyoubi@gmail.com',
				nom: 'youbi',
				password: '$2a$08$H9.mjNkGgxLL1pSwdK/cCePuF1l2J2Ai0sCFc9Vc37.Pqp4Bdx2P.',
				prenom: 'anas',
				restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
				role: 'user',
				secretTime: '201431340',
				token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
				tokenTime: 1397469765520
			},
			loged: true,
			admin: true
		};
		localStorage.setItem('compteId', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec');

		$scope.upgradeurl = '/updateVersion';
		$scope.oldVersion = {
			valeur: 3,
			date: '',
			newvaleur: 4,
			sysVersionId: 'okjkhb67587G',
			id: localStorage.getItem('compteId')
		};
		$rootScope.testEnv = true;
		$httpBackend.whenGET(configuration.URL_REQUEST + '/allAccounts?id=' + $scope.dataRecu.local.token).respond(accounts);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/adminService').respond(accounts);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + $scope.dataRecu.local.token).respond($scope.dataRecu);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/deleteAccounts').respond(account);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond([{
			appVersion: 10
		}]);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/updateVersion').respond({});
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/setAuthorisations').respond({});
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/updateall').respond({});
		$httpBackend.whenGET(configuration.URL_REQUEST + '/adminService?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec').respond($scope.dataRecu);
	}));


	it('AdminPanelCtrl:	showOptions', inject(function() {
		expect($scope.showOptions).toBeDefined();
    var event = {
      currentTarget:{
        className : 'active'
      }
    };
    $scope.hideDroDownOptions();

    event = {
      currentTarget:{
        className : ''
      }
    };
    $scope.hideDroDownOptions();

	}));


  it('AdminPanelCtrl:	hideDroDownOptions', inject(function() {
		expect($scope.hideDroDownOptions).toBeDefined();
    $scope.hideDroDownOptions();
	}));


  it('AdminPanelCtrl:	updateOcrAutorisation', inject(function() {
		expect($scope.updateOcrAutorisation).toBeDefined();
    $scope.updateOcrAutorisation(accounts[0]);
	}));

  it('AdminPanelCtrl:	updateAudioAutorisation', inject(function() {
		expect($scope.updateAudioAutorisation).toBeDefined();
    $scope.updateAudioAutorisation(accounts[0]);
	}));

  it('AdminPanelCtrl:	updateAutorisation', inject(function($httpBackend) {
    expect($scope.updateAutorisation).toBeDefined();
    $scope.updateAutorisation(accounts[0]);
    $httpBackend.flush();
	}));

  it('AdminPanelCtrl:	updateAll', inject(function($httpBackend) {
    expect($scope.updateAll).toBeDefined();
    var att, status;

    att = 'audio';
    status = false;
    $scope.updateAll(att,status);
    $httpBackend.flush();
	}));


	it('AdminPanelCtrl:allAccounts should set allAccounts 1 function', function() {
		expect($scope.listAccounts).toBeDefined();
	});

	it('AdminPanelCtrl:allAccounts should set allAccounts 2 function', inject(function($httpBackend) {
		$scope.listAccounts();
		$httpBackend.flush();
	}));

	it('AdminPanelCtrl:allAccounts should set allAccounts 3 function', inject(function($httpBackend) {
		$scope.listAccounts();
		$httpBackend.flush();
		expect($scope.comptes).toBe(accounts);
	}));

	it('AdminPanelCtrl:initial should set initial function 1', inject(function() {
		expect($scope.initial).toBeDefined();

		spyOn(serviceCheck, 'getData').andCallThrough();

		$scope.initial();

		deferred.resolve();

		$scope.$root.$digest();
	}));

	it('AdminPanelCtrl: initial should set initial function', inject(function($httpBackend) {
		$scope.initial();
		$httpBackend.flush();
		expect(accounts[0].loged).toBeTruthy();
	}));

	it('AdminPanelCtrl:deleteAccount should set deleteAccount function', function() {
		expect($scope.deleteAccount).toBeDefined();
	});

	it('AdminPanelCtrl:deleteAccount should set deleteAccount function', inject(function($httpBackend) {
		$scope.deleteAccount();
		$httpBackend.flush();
	}));

	it('AdminPanelCtrl:deleteAccount should set deleteAccount function', inject(function($httpBackend) {
		$scope.deleteAccount();
		expect($scope.loader).toBe(true);
		$httpBackend.flush();
		expect($scope.deleted).toBe(account);
		expect($scope.loader).toBe(false);
		expect($scope.listAccounts).toBeDefined();
	}));

	it('AdminPanelCtrl:preSupprimer should set preSupprimer function', function() {
		expect($scope.preSupprimer).toBeDefined();
		$scope.preSupprimer(account);
		expect($scope.compteAsupprimer).toBe(account);
	});

	it('AdminPanelCtrl:specificFilter function', function() {
		$scope.comptes = [{
			_id: '52c588a861485ed41c000001',
			local: {
				email: 'email@email.com',
				nom: 'nom1',
				prenom: 'prenom1',
				password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
				role: 'user',
				restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
				secretTime: '01431340',
				token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
				tokenTime: 1397469765520,
        authorisations : {
          audio : true,
          ocr : false
        }

			},
			loged: true,
			dropboxWarning: false,
			admin: true
		}, {
			_id: '52c588a861485ed41c000002',
			local: {
				email: 'email2@email.com',
				nom: 'nom2',
				prenom: 'prenom2',
				password: '$2a$089.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
				role: 'admin',
				restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
				secretTime: '201431340',
				token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
				tokenTime: 1397469765520,
        authorisations : {
          audio : true,
          ocr : false
        }
			},
			loged: true,
			dropboxWarning: false,
			admin: true
		}];
		expect($scope.specificFilter).toBeDefined();
		$scope.specificFilter();
		// expect($scope.compteAsupprimer).toBe(account);
	});

});
