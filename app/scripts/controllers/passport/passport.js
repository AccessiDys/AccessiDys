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

angular.module('cnedApp').controller('passportCtrl', function ($scope, $rootScope, md5, $http, $location, configuration, serviceCheck, dropbox, storageService) {

  $('#titreCompte').hide();
  $('#titreProfile').hide();
  $('#titreDocument').hide();
  $('#titreAdmin').hide();
  $('#titreListDocument').hide();
  $('#detailProfil').hide();
  $('#titreDocumentApercu').hide();

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
  $scope.locationURL = window.location.href;
  $scope.servUrl = configuration.URL_REQUEST;
  $rootScope.$watch('dropboxWarning', function () {
    $scope.guest = $rootScope.loged;
    $scope.apply; // jshint ignore:line
  });

  $rootScope.$on('initPassport', function () {
    console.log('event recieved of passport');
    $scope.init();
  });

  $scope.init = function () {
    if ($location.absUrl().indexOf('https://dl.dropboxusercontent.com/') > -1) {
      $scope.showBascule = false;
    }

    if ($location.absUrl().indexOf('?Acces=true') > -1) {
      if (localStorage.getItem('redirectionEmail') && localStorage.getItem('redirectionPassword')) {
        $scope.emailLogin = localStorage.getItem('redirectionEmail');
        $scope.passwordLogin = localStorage.getItem('redirectionPassword');
        $scope.apply; // jshint ignore:line

        storageService.removeService(['redirectionEmail', 'redirectionPassword'], 0).then(function (data) {
          $scope.login();
        });
        //localStorage.removeItem('redirectionEmail');
        //localStorage.removeItem('redirectionPassword');
        //setTimeout(function(){
        //$scope.login();
        //},1000);
      } else {
        $scope.goNext();
      }
    }

    if ($scope.testEnv === false) {
      $scope.browzerState = navigator.onLine;
    } else {
      $scope.browzerState = true;
    }
    if ($scope.browzerState) {
      var tmp = serviceCheck.getData();
      tmp.then(function (result) { // this is only run after $http completes
        if (result.loged) {
          if (result.dropboxWarning == false) {
            $rootScope.dropboxWarning = false;
            $scope.missingDropbox = false;
            $rootScope.loged = true;
            $rootScope.admin = result.admin;
            $rootScope.apply; // jshint ignore:line
            if ($location.path() !== '/inscriptionContinue') {
              $location.path('/inscriptionContinue');
            }
          } else {
            console.log('loged full');
            $rootScope.loged = true;
            $rootScope.admin = result.admin;
            $rootScope.apply; // jshint ignore:line
            //if (window.location.href.indexOf('https://dl.dropboxusercontent.com/') < 0 && localStorage.getItem('dropboxLink')) {
            //window.location.href = localStorage.getItem('dropboxLink');
            //}
            var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, result.user.dropbox.accessToken, configuration.DROPBOX_TYPE);
            tmp4.then(function (result) {
              if ($scope.testEnv === false) {
                window.location.href = result.url + '#/listDocument?key=' + localStorage.getItem('compteId');
              }
            });
          }
        } else {
          /*
           if (result.inactif) {
           localStorage.removeItem('compteId');
           $('#reconnexionModal').modal('show');
           }
           */
          if ($location.path() !== '/') {
            $location.path('/');
          }
        }
      });
    } else {
      console.log('common you are offline');
      storageService.readService('dropboxLink').then(function (data) {
        if (data.exist) {
          window.location.href = data.value;
        }else{
          console.log('link to dropbox not found');
        }
      });
    }


  };

  $scope.signin = function () {
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
        .success(function (data) {
          $scope.basculeButton = false;
          $scope.steps = 'step_two';
          $scope.stepsTitle = 'COMPTE DROPBOX';
          $scope.stepsSubTitle = 'Association avec compte DropBox';
          $scope.singinFlag = data;
          var tmp = [{name: 'compteId', value: data.local.token}]
          storageService.writeService(tmp, 0).then(function (data) {
              $scope.inscriptionStep1 = false;
              $scope.inscriptionStep2 = true;
              $scope.step2 = 'btn btn-primary btn-circle';
              $scope.step1 = 'btn btn-default btn-circle';
              $('#myModal').modal('show');
          });
          //localStorage.setItem('compteId', data.local.token);
        })
        .error(function () {
          $scope.erreur.erreurSigninEmail = false;
          $scope.erreur.erreurSigninEmailNonDisponible = true;
        });
    } else {

      if (!$scope.verifyString($scope.obj.nomSign)) {
        if ($scope.obj.nomSign === '') {
          $scope.erreur.erreurSigninNomMessage = 'Nom : Cette donnée est obligatoire. Merci de compléter le champ.';
        } else {
          $scope.erreur.erreurSigninNomMessage = 'Nom : Le nom contient des caractères spéciaux non autorisé.';
        }
        $scope.erreur.erreurSigninNom = true;
      } else {
        $scope.erreur.erreurSigninNom = false;
      }

      if (!$scope.verifyString($scope.obj.prenomSign)) {
        if ($scope.obj.prenomSign === '') {
          $scope.erreur.erreurSigninPrenomMessage = 'Prénom : Cette donnée est obligatoire. Merci de compléter le champ.';
        } else {
          $scope.erreur.erreurSigninPrenomMessage = 'Prénom : Le prénom contient des caractères spéciaux non autorisé.';

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
        if ($scope.obj.passwordSign.length > 20) {
          $scope.erreur.erreurSigninPasseMessage = 'Le mot de passe doit comporter entre 6 et 20 caractères.';
          $scope.erreur.erreurSigninPasse = true;
        } else if ($scope.obj.passwordSign.length < 6) {
          $scope.erreur.erreurSigninPasseMessage = 'Le mot de passe doit comporter entre 6 et 20 caractères.';
          $scope.erreur.erreurSigninPasse = true;
        } else {
          $scope.erreur.erreurSigninPasseMessage = 'Veuillez ne pas utiliser de caractères spéciaux.';
          $scope.erreur.erreurSigninPasse = true;
        }
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


  $scope.login = function () {

    if ($scope.testEnv === false) {
      if (document.getElementById('email').value && document.getElementById('mdp').value) {
        $scope.emailLogin = document.getElementById('email').value;
        $scope.passwordLogin = document.getElementById('mdp').value
      }
    }
    if ($scope.verifyEmail($scope.emailLogin) && $scope.verifyPassword($scope.passwordLogin)) {
      $scope.emailLogin = $scope.emailLogin.toLowerCase();
      // $rootScope.salt
      var data = {
        email: $scope.emailLogin,
        password: md5.createHash($scope.passwordLogin)
      };
      $http.get(configuration.URL_REQUEST + '/login', {
        params: data
      })
        .success(function (dataRecue) {
          //localStorage.setItem('compte', dataRecue.dropbox.accessToken);

          var tmp = [{name: 'compteId', value: dataRecue.local.token}];
          storageService.writeService(tmp, 0).then(function (data) {
            console.log(data)
            $scope.loginFlag = dataRecue;
            $rootScope.loged = true;
            $rootScope.currentUser = dataRecue;
            $rootScope.apply; // jshint ignore:line
            if (dataRecue.dropbox) {
              var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
              tmp4.then(function (result) {
                $rootScope.listDocumentDropBox = result.url;
                $rootScope.apply; // jshint ignore:line
                //$scope.verifProfil();
                $scope.roleRedirect();
                console.log('hereoooo');
              });
            } else {
              if ($location.path() !== '/inscriptionContinue') {
                $location.path('/inscriptionContinue');
              }
            }
          });
          //localStorage.setItem('compteId', dataRecue.local.token);
        }).error(function () {
          $scope.erreurLogin = true;
        });
    } else {
      $scope.erreurLogin = true;
    }
  };

  $scope.setListTagsByProfil = function () {
    var token = {
      id: localStorage.getItem('compteId')
    };
    $http.post(configuration.URL_REQUEST + '/chercherProfilsParDefaut', token)
      .success(function (data) {
        $scope.profilDefautFlag = data;
        $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
          idProfil: $scope.profilDefautFlag[0].profilID
        }).success(function (data) {
          $scope.listTagsByProfil = data;
          localStorage.setItem('listTagsByProfil', JSON.stringify($scope.listTagsByProfil));
        });


      });
  };

  $scope.roleRedirect = function () {
    $rootScope.uploadDoc = {};
    if ($scope.loginFlag.local.role === 'admin') {
      //$rootScope.$broadcast('refreshprofileCombo');
      storageService.writeService([{
        name: 'listDocLink',
        value: $rootScope.listDocumentDropBox + '#/listDocument?key=' + localStorage.getItem('compteId')
      }], 0).then(function (data) {
        if (localStorage.getItem('bookmarkletDoc') && localStorage.getItem('bookmarkletDoc') !== '') {
          var bookmarkletUrl = encodeURI(localStorage.getItem('bookmarkletDoc'));
          localStorage.removeItem('bookmarkletDoc');
          if ($scope.testEnv === false) {
            //setTimeout(function() {
            window.location.href = $rootScope.listDocumentDropBox + '#/workspace?pdfUrl=' + bookmarkletUrl;
            //}, 1000);
          }
        } else {
          if ($scope.testEnv === false) {
            //setTimeout(function() {
            window.location.href = $rootScope.listDocumentDropBox + '#/adminPanel?key=' + localStorage.getItem('compteId');
            //}, 1000);
          }
        }
      });
      //localStorage.setItem('listDocLink', $rootScope.listDocumentDropBox + '#/listDocument?key=' + localStorage.getItem('compteId'));
    } else {
      if ($scope.locationURL.indexOf('https://dl.dropboxusercontent.com/') > -1) {
        // window.location.href = $rootScope.listDocumentDropBox + '#/listDocument';
        // $scope.verifProfil();

        storageService.writeService([{
          name: 'listDocLink',
          value: $rootScope.listDocumentDropBox + '#/listDocument?key=' + localStorage.getItem('compteId')
        }], 0).then(function (data) {
          $scope.setListTagsByProfil();
          $scope.requestToSend = {
            id: localStorage.getItem('compteId')
          };
          $http.get(configuration.URL_REQUEST + '/readTags', {
            params: $scope.requestToSend
          })
            .success(function (data) {
              $scope.listTags = data;
              localStorage.removeItem('listTags');
              localStorage.setItem('listTags', JSON.stringify($scope.listTags));
            });
          if (localStorage.getItem('bookmarkletDoc') && localStorage.getItem('bookmarkletDoc') !== '') {
            $rootScope.uploadDoc.lienPdf = localStorage.getItem('bookmarkletDoc');
            storageService.removeService(['bookmarkletDoc'], 0).then(function () {
              if (!$rootScope.$$phase) {
                $rootScope.$digest();
              }
              if ($scope.testEnv === false) {
                //$rootScope.$broadcast('refreshprofileCombo');
                setTimeout(function () {
                  window.location.href = $rootScope.listDocumentDropBox + '#/workspace';
                }, 1000);
              }
            });
            //localStorage.removeItem('bookmarkletDoc');
          } else {

            if ($scope.testEnv === false) {
              //setTimeout(function () {
              window.location.href = $rootScope.listDocumentDropBox + '#/listDocument?key=' + $scope.requestToSend.id;
              //}, 1000);
            }
          }
        });
      } else {
        if ($scope.testEnv === false) {
          setTimeout(function () {
            window.location.href = $rootScope.listDocumentDropBox + '#/listDocument?key=' + localStorage.getItem('compteId');
          }, 1000);
        }
      }
    }
    // }
  };

  $scope.goNext = function () {
    // $location.path('?Acces=true');
    if (window.location.href.indexOf('https://dl.dropboxusercontent.com/') > -1) {
      window.location.href = configuration.URL_REQUEST + '?create=true';
    } else {
      $scope.showlogin = !$scope.showlogin;
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
      $scope.erreurLogin = false; //false

    }
  };

  $scope.verifyEmail = function (email) {
    var reg = /^([a-zA-Z0-9éèàâîôç_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (reg.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  $scope.verifyString = function (chaine) {
    var ck_nomPrenom = /^[A-Za-z0-9éèàâîôç_\.\-\+' ]{1,100}$/;
    if (chaine === null) {
      return false;
    }
    if (!ck_nomPrenom.test(chaine)) {
      return false;
    }
    return true;
  };

  $scope.verifyPassword = function (password) {
    var ck_password = /^[A-Za-z0-9éèàâîôç!@#$%^&*()_]{6,20}$/;

    if (!ck_password.test(password)) {
      return false;
    }
    return true;
  };

  $scope.showPasswordRestorePanel = function () {
    $scope.loginSign = !$scope.loginSign;
    $scope.passwordForgotten = !$scope.passwordForgotten;
  };

  $scope.restorePassword = function () {
    if ($scope.verifyEmail($scope.emailRestore)) {
      var data = {};
      data.email = $scope.emailRestore;

      /* jshint ignore:start */

      $http.post(configuration.URL_REQUEST + '/restorePassword', data)
        .success(function (dataRecue) {
          $scope.successRestore = true;
          $scope.failRestore = false;
        }).error(function (error) {
          $scope.failRestore = true;
          $scope.passwordRestoreMessage = 'Email : l\'adresse entré n\'existe pas.';
          $scope.successRestore = false;
          console.log(error);
        });
      /* jshint ignore:end */

    } else {
      $scope.failRestore = true;
      if (!$scope.emailRestore) {
        $scope.passwordRestoreMessage = 'Email : Ce champ est obligatoire.';
      } else {
        $scope.passwordRestoreMessage = 'Email : Les données saisies sont invalides.';
      }


    }
  };

  $scope.reuplaodFiles = function () {


    var data = {
      id: $rootScope.currentUser.local.token
    };
    $http.post(configuration.URL_REQUEST + '/allVersion', data)
      .success(function (dataRecu) {

        var sysVersion = dataRecu[0].appVersion;

        var tmp = dropbox.search('.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
        tmp.then(function (data) {
          $scope.listDocument = data;
          $http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function (dataIndexPage) {
            var tmp = dropbox.upload('listDocument.appcache', dataIndexPage.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
            tmp.then(function () { // this is only run after $http completes
              var tmp2 = dropbox.shareLink('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
              tmp2.then(function (result) {
                $scope.manifestLink = result.url;
                $http.get(configuration.URL_REQUEST + '/index.html').then(function (dataIndexPage) {
                  dataIndexPage.data = dataIndexPage.data.replace("var Appversion=''", "var Appversion='" + sysVersion + "'"); // jshint ignore:line
                  dataIndexPage.data = dataIndexPage.data.replace('<head>', '<head><meta name="utf8beacon" content="éçñøåá—"/>');
                  dataIndexPage.data = dataIndexPage.data.replace('var listDocument=[]', 'var listDocument= ' + angular.toJson($scope.listDocument));
                  dataIndexPage.data = dataIndexPage.data.replace('manifest=""', 'manifest=" ' + $scope.manifestLink + '"');
                  dataIndexPage.data = dataIndexPage.data.replace('ownerId = null', 'ownerId = \'' + $rootScope.currentUser._id + '\'');
                  var tmp = dropbox.upload(configuration.CATALOGUE_NAME, dataIndexPage.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                  tmp.then(function () { // this is only run after $http completes
                    var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    tmp4.then(function (result) {
                      $rootScope.listDocumentDropBox = result.url;
                      $rootScope.apply; // jshint ignore:line
                      //$scope.roleRedirect();
                    });
                  });
                });
              });
            });
          });
        });
      })
      .error(function () {
        console.log('error getting sysVersion');
      });


  };
});
