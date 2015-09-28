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

angular.module('cnedApp').controller('AdminPanelCtrl', function ($scope, $http, $location, configuration, $rootScope, serviceCheck) {
  /*global $:false */

  $scope.headers = ['Nom', 'Prenom', 'Email', 'Autorisation', 'Action'];

  $scope.showOptions = function(event){
    if(event.currentTarget.className.indexOf('active') > -1){
      $scope.hideDroDownOptions();
    }else{
      $scope.hideDroDownOptions();
      event.currentTarget.className =  event.currentTarget.className + ' active';
    }
  };

  $scope.hideDroDownOptions = function(){
    $('.user_lbl').removeClass('active');
  };

  $scope.updateOcrAutorisation = function (compte) {
    $scope.hideDroDownOptions();
    if (compte.local.authorisations) {
      compte.local.authorisations.ocr = !compte.local.authorisations.ocr;
    } else {
      compte.local.authorisations.ocr = true;
    }
    $scope.updateAutorisation(compte);
  };

  $scope.updateAudioAutorisation = function (compte) {
    $scope.hideDroDownOptions();
    if (compte.local.authorisations) {
      compte.local.authorisations.audio = !compte.local.authorisations.audio;
    } else {
      compte.local.authorisations.audio = true;
    }
    $scope.updateAutorisation(compte);
  };

  $scope.updateAutorisation = function (compte) {

    $http.post(configuration.URL_REQUEST + '/setAuthorisations', {

      id: $rootScope.currentUser.local.token,
      authorisations: {
        ocr: compte.local.authorisations.ocr,
        audio: compte.local.authorisations.audio
      },
      compte: compte._id
    }).success(function (data) {

      console.log('********************* ///// ******************');
      console.log(data);
    });
  };


  $scope.updateAll = function (att, status) {

    $http.post(configuration.URL_REQUEST +'/updateall', {
      att: att,
      status: status,
      id: $rootScope.currentUser.local.token
    }).success(function () {
      $scope.listAccounts();
    })
  };
  $scope.loader = false;
  $scope.versionStatShow = false;

  $rootScope.area = 'ADMIN ';


  $('#titreCompte').hide();
  $('#titreProfile').hide();
  $('#titreDocument').hide();
  $('#titreAdmin').show();
  $('#titreListDocument').hide();
  $('#detailProfil').hide();
  $('#titreDocumentApercu').hide();
  $('#titreTag').hide();
  $scope.upgradeMode = false;
  $scope.listAccounts = function () {
    $http.get(configuration.URL_REQUEST + '/allAccounts', {
      params: {
        id: $rootScope.currentUser.local.token
      }
    }).success(function (data) {
      $scope.comptes = data;
      for (var i = 0; i < $scope.comptes.length; i++) {
        $scope.comptes[i].showed = true;
      }
    });
  };
  $scope.initial = function () {
    if ($rootScope.emergencyUpgrade === false) {
      $rootScope.indexLoader = false;
      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }
    }
    if (!$rootScope.$$phase) {
      $rootScope.$digest();
    }
    var tmp = serviceCheck.getData();
    tmp.then(function (result) { // this is only run after $http completes
      if (result.loged) {
        if (result.dropboxWarning === false) {

          $rootScope.dropboxWarning = false;
          $scope.missingDropbox = false;
          $rootScope.loged = true;
          $rootScope.admin = result.admin;
          if (!$rootScope.$$phase) {
            $rootScope.$digest();
          }
          if ($location.path() !== '/inscriptionContinue') {
            $location.path('/inscriptionContinue');
          }

        } else {
          $rootScope.loged = true;
          $rootScope.admin = result.admin;
          $rootScope.currentUser = result.user;
          if (!$rootScope.$$phase) {
            $rootScope.$digest();
          }
          if (result.admin) {
            $http.get(configuration.URL_REQUEST + '/adminService', {
              params: {
                id: $rootScope.currentUser.local.token
              }
            })
              .success(function (data) {
                $scope.admin = data;
                $rootScope.admin = true;

                console.log($scope.admin);
                $scope.roles = [
                  'Ocerisation'
                ];
                $scope.autorisations = [];

                if (!$rootScope.$$phase) {
                  $rootScope.$digest();
                }
              }).error(function () {
                console.log('/adminService error');
                //$location.path('/');
              });
            $scope.listAccounts();
          }

        }
      } else {
        if ($location.path() !== '/') {
          $location.path('/');
        }
      }
    });

  };

  $scope.deleteAccount = function () {
    $scope.loader = true;
    $http.post(configuration.URL_REQUEST + '/deleteAccounts', {
      id: $rootScope.currentUser.local.token,
      compte: $scope.compteAsupprimer
    })
      .success(function (data) {
        $scope.deleted = data;
        $scope.listAccounts();
        $scope.loader = false;

      });
  };

  $scope.preSupprimer = function (account) {
    $scope.compteAsupprimer = account;
  };

  $scope.specificFilter = function () {
    for (var i = 0; i < $scope.comptes.length; i++) {
      if ($scope.comptes[i].local.nom.indexOf($scope.query) !== -1 || $scope.comptes[i].local.prenom.indexOf($scope.query) !== -1 || $scope.comptes[i].local.email.indexOf($scope.query) !== -1) {
        $scope.comptes[i].showed = true;
      } else {
        $scope.comptes[i].showed = false;
      }
    }
  };

});
