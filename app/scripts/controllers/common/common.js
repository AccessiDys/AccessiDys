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


angular.module('cnedApp').controller('CommonCtrl', function($scope, $rootScope, $location, $timeout, serviceCheck, gettextCatalog, $http, configuration, dropbox) {


  $scope.logout = $rootScope.loged;
  $scope.admin = $rootScope.admin;
  $scope.missingDropbox = $rootScope.dropboxWarning;
  $scope.showMenuParam = false;

  // $scope.currentUserData = {};
  $rootScope.updateListProfile = false;
  $rootScope.updateProfilListe = false;
  $rootScope.modifProfilListe = false;
  $scope.testEnv = false;

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

  $scope.workspaceLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
  $scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'profiles';
  $scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'userAccount';
  $scope.adminLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'adminPanel';
  $scope.tagLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'tag';
  $scope.docUrl = configuration.URL_REQUEST + '/styles/images/docs.png';
  $scope.logoUrl = configuration.URL_REQUEST + '/styles/images/header_logoCned.png';
  $scope.logoRedirection = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
  $scope.connectLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2).replace('adaptation.html#/', 'adaptation.html');
  $scope.bookmarklet_howto = configuration.URL_REQUEST + '/styles/images/bookmarklet_howto.png';
  $scope.bookmarklet_dropbox = configuration.URL_REQUEST + '/styles/images/dropbox.png';
  if ($location.absUrl().indexOf('https://dl.dropboxusercontent.com') === -1) {
    $scope.connectLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2).replace('/#/', '');
  }

  $scope.setlangueCombo = function() {
    $timeout(function() {
      if (!localStorage.getItem('langueDefault')) {
        localStorage.setItem('langueDefault', JSON.stringify($scope.languages[0]));
      }
      $('.select-language + .customSelect .customSelectInner').text(JSON.parse(localStorage.getItem('langueDefault')).name);
    }, 500);
  };
  //detect current location
  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.showMenu = function() {
    $scope.showMenuParam = !$scope.showMenuParam;
  };
  $scope.changeStatus = function($event) {
    $('.actions_menu .drob_down li a').removeClass('active');
    angular.element($event.currentTarget).addClass('active');
  };


  $scope.hideMenu = function() {
    $scope.showMenuParam = false;
    // $scope.$apply();
    if (!$scope.$$phase) {
      $scope.$digest();
    } // jshint ignore:line
  };

  $rootScope.$on('setHideMenu', $scope.hideMenu());

  // Changer la langue
  $scope.changerLangue = function() {
    gettextCatalog.currentLanguage = $scope.langue.shade;
    $('.select-language + .customSelect .customSelectInner').text($scope.langue.name);
    $scope.showMenuParam = false;
    localStorage.setItem('langueDefault', JSON.stringify($scope.langue));
    $scope.setlangueCombo();
  };

  $scope.bookmarkletPopin = function() {
    var tmp = serviceCheck.getData();
    tmp.then(function(result) { // this is only run after $http completes
      if (result.loged) {
        var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
        tmp4.then(function(result) {
          $scope.userDropBoxLink = '\'' + result.url + '#/workspace?pdfUrl=\'+document.URL';
          $('#bookmarkletGenerator').modal('show');
        });
      } else {
        if (!$scope.testEnv) {
          window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
        }

      }
    });


  };


  $scope.currentUserFunction = function() {
    var token;
    if (localStorage.getItem('compteId')) {
      token = {
        id: localStorage.getItem('compteId')
      };
    }
    $http.post(configuration.URL_REQUEST + '/profilActuByToken', token)
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
  };

  $rootScope.$watch('loged', function() {
    $scope.logout = $rootScope.loged;
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
          $scope.menueShow = true;
          $scope.menueShowOffline = true;
          $scope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
          $scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
          $scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
        }
      } else if (localStorage.getItem('dropboxLink')) {
        $scope.workspaceLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'listDocument';
        $scope.profilLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'profiles';
        $scope.userAccountLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'userAccount';
        $scope.adminLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'adminPanel';
        $scope.logoRedirection = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'listDocument';
      }
      $scope.apply; // jshint ignore:line
    } else {
      $scope.menueShow = false;
      $scope.showMenuParam = false;
      $scope.menueShowOffline = true;
      if (localStorage.getItem('dropboxLink')) {
        $scope.listDocumentDropBox = localStorage.getItem('dropboxLink');
        $scope.logoRedirection = localStorage.getItem('dropboxLink');
      } else {
        $scope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
        $scope.logoRedirection = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
      }
      if (localStorage.getItem('profilActuel')) {
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

  $rootScope.$watch('currentUser', function() {
    if ($scope.testEnv === false) {
      $scope.currentUserData = $rootScope.currentUser;
      $scope.apply; // jshint ignore:line
    }
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

  $scope.$watch('setDropDownActuel', function() {
    if ($scope.setDropDownActuel) {
      $scope.apply; // jshint ignore:line
    }
  });

  $rootScope.$watch('updateListProfile', function() {
    if ($scope.currentUserData) {

      $scope.afficherProfilsParUser();
    }
  });

  $rootScope.$watch('listDocumentDropBox', function() {
    var browserState;
    if ($scope.testEnv === false) {
      browserState = navigator.onLine;
    } else {
      browserState = true;
    }
    if (browserState) {
      if ($rootScope.loged === true) {
        if ($rootScope.currentUser) {
          $scope.listDocumentDropBox = $rootScope.listDocumentDropBox + '#/listDocument';
          // $scope.apply; // jshint ignore:line
        }
      } else {
        $scope.listDocumentDropBox = '';
      }
    } else {
      if (localStorage.getItem('dropboxLink')) {
        $scope.listDocumentDropBox = localStorage.getItem('dropboxLink');
      }
    }

  });


  $scope.initCommon = function() {
    console.log('initCommon');
    if (window.location.href.indexOf('create=true') > -1) {
      $scope.logoRedirection = $location.absUrl().substring(0, $location.absUrl().indexOf('/?create=true'));
    }
    $scope.setlangueCombo();
    $('#masterContainer').show();

    if ($scope.testEnv === false) {
      $scope.browzerState = navigator.onLine;
    } else {
      $scope.browzerState = true;
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
          $scope.menueShow = true;
          $scope.menueShowOffline = true;
          $rootScope.dropboxWarning = true;
          $rootScope.admin = result.admin;
          $rootScope.currentUser = result.user;

          if (localStorage.getItem('compteId')) {
            $scope.requestToSend = {
              id: localStorage.getItem('compteId')
            };
            $http.get(configuration.URL_REQUEST + '/readTags', {
                params: $scope.requestToSend
              })
              .success(function(data) {
                $scope.listTags = data;
                localStorage.removeItem('listTags');
                localStorage.setItem('listTags', JSON.stringify($scope.listTags));
              });
          }
          $scope.token = {
            id: $rootScope.currentUser.local.token
          };
          if (!$rootScope.$$phase) {
            $rootScope.$digest();
          }
          $scope.afficherProfilsParUser();
          $scope.listDocumentDropBox = $rootScope.listDocumentDropBox;
          console.log($scope.listDocumentDropBox);
          // var tmp4 = dropbox.shareLink(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
          // tmp4.then(function(result) {

          // 	if (result && result.status === 200) {
          // 		$rootScope.listDocumentDropBox = result.url;
          // 		$rootScope.apply; // jshint ignore:line
          // 	}
          // });
        }
      } else {
        var lien = window.location.href;
        var verif = false;
        if ((lien.indexOf('https://dl.dropboxusercontent.com') > -1)) {
          verif = true;
          if (lien.indexOf('#/apercu') > -1) {
            console.log('navigator.onLine', navigator.onLine);
            if (navigator.onLine) {
              lien = window.location.href;
              if (lien.indexOf('#/apercu') > -1) {
                $scope.menueShow = true;
                $scope.menueShowOffline = true;
                $scope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
                $scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
                $scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
              }
            } else {
              $scope.menueShow = false;
              $scope.menueShowOffline = true;
              document.getElementById('headerSelect').setAttribute('disabled', 'true');
              $scope.workspaceLink = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'listDocument';
              $scope.logoRedirection = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('#/') + 2) + 'listDocument';

            }
          }
          if (!navigator.onLine) {
            document.getElementById('headerSelect').setAttribute('disabled', 'true');
          }
        } else {
          lien = window.location.href;
          if ($scope.browzerState) {
            if ($location.path() !== '/' && $location.path() !== '/passwordHelp' && $location.path() !== '/detailProfil' && $location.path() !== '/needUpdate' && verif !== true) {
              $location.path('/');
            }
            if ($location.path() === '/detailProfil' && lien.indexOf('#/detailProfil') > -1 && $rootScope.loged !== true) {
              $scope.menueShow = true;
              $scope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
              $scope.profilLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
              $scope.userAccountLink = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));

            }
          }
        }
      }
    });


  };

  $scope.logoutFonction = function() {
    angular.element($('#headerSelect option').each(function() {
      $('#headerSelect + .customSelect .customSelectInner').text('');
    }));

    localStorage.removeItem('profilActuel');
    // localStorage.removeItem('listTagsByProfil');
    var toLogout = serviceCheck.deconnect();
    toLogout.then(function(responce) {
      if (responce.deconnected) {

        if (localStorage.getItem('compteId')) {
          localStorage.removeItem('compteId');
        }
        $rootScope.loged = false;
        $rootScope.dropboxWarning = false;
        $rootScope.admin = null;
        $rootScope.currentUser = {};
        $scope.listDocumentDropBox = '';
        $rootScope.listDocumentDropBox = '';
        $rootScope.uploadDoc = {};
        $scope.logoRedirection = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
        //$rootScope.$apply(); // jshint ignore:line
        if (!$rootScope.$$phase) {
          $rootScope.$digest();
        }
        if ($scope.testEnv === false) {
          setTimeout(function() {
            window.location.href = configuration.URL_REQUEST; //$location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2);
          }, 1000)
        } else {
          console.log('deconnection testEnv');
        }
      }
    });
  };
  //displays user profiles
  $scope.afficherProfilsParUser = function() {

    $http.get(configuration.URL_REQUEST + '/listeProfils', {
      params: $scope.token
    }).success(function(data) {
      /* Filtrer les profiles de l'Admin */
      if ($scope.currentUserData && $scope.currentUserData.local.role === 'admin') {
        for (var i = 0; i < data.length; i++) {
          if (data[i].type === 'profile' && data[i].state === 'mine') {
            for (var j = 0; j < data.length; j++) {
              if (data[i]._id === data[j]._id && data[j].state === 'default' && data[j].owner === $scope.currentUserData._id) {
                data[i].stateDefault = true;
                data.splice(j, 2);
              }
            }
          }
        }
      }
      $scope.listeProfilsParUser = data;
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
  };


  $scope.changeProfilActuel = function() {

    // Set du Json du profil actuel sélectionné
    var profilActuelSelected = {};
    for (var i = 0; i < $scope.listeProfilsParUser.length; i++) {
      if ($scope.listeProfilsParUser[i].type == 'profile' && $scope.listeProfilsParUser[i].nom === $scope.profilActuel) {
        profilActuelSelected = $scope.listeProfilsParUser[i];
      }
    }

    $scope.profilUser = {
      profilID: profilActuelSelected._id,
      userID: $scope.currentUserData._id
    };

    $scope.profilUserFavourite = {
      profilID: profilActuelSelected._id,
      userID: $scope.currentUserData._id,
      favoris: true
    };
    if ($scope.token && $scope.token.id) {
      $scope.token.profilesFavs = $scope.profilUserFavourite;
    } else {
      $scope.token.id = localStorage.getItem('compteId');
      $scope.token.profilesFavs = $scope.profilUserFavourite;
    }


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
        localStorage.setItem('profilActuel', profilActuelSelected);
        $scope.userProfilFlag = data;
        $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
          idProfil: profilActuelSelected._id
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
      if ($scope.lastDocTitre && $scope.lastDocTitre.length > 0 && $scope.lastDocTitre.lastIndexOf('.html') <= -1) {
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


  $rootScope.$on('updateLastDoc', function() {
    $scope.showLastDocument();
  });

  $rootScope.$on('hideMenueParts', $scope.initCommon());

  $rootScope.$on('hideMenueParts', $scope.initCommon());

  $rootScope.$on('initCommon', $scope.afficherProfilsParUser());

  $rootScope.$on('initProfil', $scope.afficherProfilsParUser());


});