'use strict';

var cnedApp = angular.module('cnedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'gettext',
  'ui.bootstrap',
  'angular-md5',
  'services.config'
]);

cnedApp.config(function($routeProvider, $sceDelegateProvider, $httpProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    '**']);
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $routeProvider.when('/', {
    templateUrl: '<%= URL_REQUEST %>/views/index/main.html',
    controller: 'MainCtrl'
  })
    .when('/workspace', {
    templateUrl: '<%= URL_REQUEST %>/views/workspace/images.html',
    controller: 'ImagesCtrl'
  })
    .when('/apercu', {
    templateUrl: '<%= URL_REQUEST %>/views/workspace/apercu.html',
    controller: 'ApercuCtrl'
  })
    .when('/profiles', {
    templateUrl: '<%= URL_REQUEST %>/views/profiles/profiles.html',
    controller: 'ProfilesCtrl'
  })
    .when('/tag', {
    templateUrl: '<%= URL_REQUEST %>/views/tag/tag.html',
    controller: 'TagCtrl'
  })
    .when('/userAccount', {
    templateUrl: '<%= URL_REQUEST %>/views/userAccount/userAccount.html',
    controller: 'UserAccountCtrl'
  })
    .when('/inscriptionContinue', {
    templateUrl: '<%= URL_REQUEST %>/views/index/inscriptionContinue.html',
    controller: 'passportContinueCtrl'
  })
    .when('/adminPanel', {
    templateUrl: '<%= URL_REQUEST %>/views/adminPanel/adminPanel.html',
    controller: 'AdminPanelCtrl'
  })
    .when('/listDocument', {
    templateUrl: '<%= URL_REQUEST %>/views/listDocument/listDocument.html',
    controller: 'listDocumentCtrl'
  })
    .when('/passwordHelp', {
    templateUrl: '<%= URL_REQUEST %>/views/passwordRestore/passwordRestore.html',
    controller: 'passwordRestoreCtrl'
  })
    .when('/detailProfil', {
    templateUrl: '<%= URL_REQUEST %>/views/profiles/detailProfil.html',
    controller: 'detailProfilCtrl'
  })
    .otherwise({
    redirectTo: '/'
  });
});
angular.module('cnedApp').run(function(gettextCatalog) {
  gettextCatalog.currentLanguage = 'fr_FR';
  gettextCatalog.debug = true;
});

//rend les liens safe 
angular.module('cnedApp').config(['$compileProvider', function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
}]);


angular.module('cnedApp').run(function($rootScope, $location, $http, dropbox, configuration) {
  /*global $:false */

  $rootScope.$on('$routeChangeStart', function(event, next) {

    $rootScope.MonCompte = false;
    $rootScope.Document = false;
    $rootScope.Profil = false;

    var data = {
      id: false
    };

    if ($location.absUrl().indexOf('key=') > -1) {
      var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
      localStorage.setItem('compteId', callbackKey);
      localStorage.setItem('dropboxLink', $location.absUrl().substring(0, $location.absUrl().indexOf('?key')));
      $rootScope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('?key'));
      $rootScope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('?key'));
      window.location.href = $rootScope.listDocumentDropBox;

    }

    if (localStorage.getItem('compteId')) {
      data = {
        id: localStorage.getItem('compteId')
      };
    }

    if (next.templateUrl) {
      if (next.templateUrl === '<%= URL_REQUEST %>/views/index/main.html' || next.templateUrl === '<%= URL_REQUEST %>/views/index/inscriptionContinue.html' || next.templateUrl === '<%= URL_REQUEST %>/views/passwordRestore/passwordRestore.html') {

        $('body').addClass('page_authentification');
      } else {
        $('body').removeClass('page_authentification');
      }
      if (next.templateUrl === '<%= URL_REQUEST %>/views/workspace/images.html') {
        $rootScope.showWorkspaceAction = true;
      } else {
        $rootScope.showWorkspaceAction = false;
      }
    }
    var browzerState = false;
    if (navigator) {
      browzerState = navigator.onLine;
    } else {
      browzerState = true;
    }
    if (browzerState) {
      $http.get('<%= URL_REQUEST %>/profile', {params:data})
      .success(function(result){
      if (next.templateUrl && next.templateUrl === '<%= URL_REQUEST %>/views/listDocument/listDocument.html') {
        if (localStorage.getItem('lastDocument')) {
          var urlDocStorage = localStorage.getItem('lastDocument').replace('#/apercu', '');
          var titreDocStorage = decodeURI(urlDocStorage.substring(urlDocStorage.lastIndexOf('/') + 1, urlDocStorage.length));
          var searchDoc = dropbox.search(titreDocStorage, result.dropbox.accessToken, configuration.DROPBOX_TYPE);
          searchDoc.then(function(res) {
            if (!res || res.length <= 0) {
              localStorage.removeItem('lastDocument');
            }
          });
        }
      }
      })
        .error(function() {
        $rootScope.loged = false;
        $rootScope.dropboxWarning = true;
        if (next.templateUrl) {
          var lien = window.location.href;
          var verif = false;
          if ((lien.indexOf('https://dl.dropboxusercontent.com') > -1)) {
            console.log('lien dropbox');
            verif = true;
          }
          if (verif !== true && next.templateUrl !== '<%= URL_REQUEST %>/views/index/main.html' && next.templateUrl !== '<%= URL_REQUEST %>/views/workspace/images.html' && next.templateUrl !== '<%= URL_REQUEST %>/views/workspace/apercu.html' && next.templateUrl !== '<%= URL_REQUEST %>/views/passwordRestore/passwordRestore.html' && next.templateUrl !=='<%= URL_REQUEST %>/views/profiles/detailProfil.html') {
            $location.path('<%= URL_REQUEST %>/views/index/main.html');
          }
        }

      });
    }

  });


});