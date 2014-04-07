'use strict';

var cnedApp = angular.module('cnedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'gettext',
  'ui.bootstrap',
  'services.config'
]);

cnedApp.config(function($routeProvider, $sceDelegateProvider, $httpProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    '**'
  ]);
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
    .otherwise({
      redirectTo: '/'
    });
});
angular.module('cnedApp').run(function(gettextCatalog) {
  gettextCatalog.currentLanguage = 'fr_FR';
  gettextCatalog.debug = true;
});



angular.module('cnedApp').run(function($rootScope, $location, $http) {
  $rootScope.$on('$routeChangeStart', function(event, next) {

    $rootScope.MonCompte = false;
    $rootScope.Document = false;
    $rootScope.Profil = false;

   var data = {
        id: false
      };
      if (localStorage.getItem('compteId')) {
        data = {
          id: localStorage.getItem('compteId')
        };
      }

       if (next.templateUrl) {
        if (next.templateUrl === '<%= URL_REQUEST %>/views/index/main.html' || next.templateUrl==='<%= URL_REQUEST %>/views/index/inscriptionContinue.html') {
          $('body').addClass('page_authentification');
        }else{
          $('body').removeClass('page_authentification');
        }
         if (next.templateUrl === '<%= URL_REQUEST %>/views/workspace/images.html') {
          $rootScope.showWorkspaceAction=true;
        }else{
          $rootScope.showWorkspaceAction=false;
        }
      }
    $http.post('<%= URL_REQUEST %>/profile', data)
      .error(function() {
        $rootScope.loged = false;
        $rootScope.dropboxWarning = true;
        if (next.templateUrl) {
          var lien = window.location.href;
          var verif = false;
          if ((lien.indexOf('http://dl.dropboxusercontent.com') > -1)) {
            console.log('lien dropbox');
            verif = true;
          }
          if (verif!==true && next.templateUrl !== '<%= URL_REQUEST %>/views/index/main.html' && next.templateUrl !== '<%= URL_REQUEST %>/views/workspace/images.html' && next.templateUrl !== '<%= URL_REQUEST %>/views/workspace/apercu.html') {
            $location.path('<%= URL_REQUEST %>/views/index/main.html');
          }
        }

      });
  });

 $rootScope.$on('$routeChangeSuccess', function(event, next) {
     if (next.templateUrl) {
        

        if (next.templateUrl === '<%= URL_REQUEST %>/views/workspace/images.html') {
          $rootScope.showWorkspaceAction=true;
                 
                   $( document ).ready(function() {
                 
                    var body_height = $(window).outerHeight()
                    var header_height = $('#main_header').outerHeight();
/*                    console.log('after sliding Down : ' + body_height);
                    console.log('header height : ' + header_height);*/
                    var dif_heights =  body_height - header_height;
/*                    console.log('dif height : ' + dif_heights);*/
                    dif_heights = dif_heights - 127;
/*                    console.log('dif_heights : ' + dif_heights);
                    console.log($('#global_container'));*/
                    setTimeout(function(){
/*                    console.log($('#global_container'));*/
                    $('#global_container').css('height', dif_heights);
                    },3000)
                });
                
        }else{
          $rootScope.showWorkspaceAction=false;
        }
      }
  });
});