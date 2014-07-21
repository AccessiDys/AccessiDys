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

describe('Controller: CommonCtrl', function() {

  // load the controller's module
  beforeEach(module('cnedApp'));

  var MainCtrl,
    $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, gettextCatalog, $httpBackend, configuration,serviceCheck) {
    $scope = $rootScope.$new();
    MainCtrl = $controller('CommonCtrl', {
      $scope: $scope
    });

    $scope.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec";

    $scope.dataRecu = {
      __v: 0,
      _id: "5347c304a7338a14500e3068",
      dropbox: {
        accessToken: "wyoEkXeYTqwAAAAAAAAAQ3S0cHhOjNeUGun3-YrW1w3qAzuuVofDEHx-S3TqhASp",
        country: "MA",
        display_name: "youbi anas",
        emails: "anasyoubi@gmail.com",
        referral_link: "https://db.tt/t85GO47x",
        uid: "264998156"
      },
      local: {
        email: "anasyoubi@gmail.com",
        nom: "youbi",
        password: "$2a$08$H9.mjNkGgxLL1pSwdK/cCePuF1l2J2Ai0sCFc9Vc37.Pqp4Bdx2P.",
        prenom: "anas",
        restoreSecret: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs",
        role: "user",
        secretTime: "201431340",
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec",
        tokenTime: 1397469765520
      },
      loged: true
    };
    $scope.currentUserData = $scope.dataRecu;
    $scope.languages = [{
      name: 'FRANCAIS',
      shade: 'fr_FR'
    }, {
      name: 'ANGLAIS',
      shade: 'en_US'
    }];

    $scope.profilsParUsers = {
      owner: '53301d8b5836a5be73dc5d50',
      nom: 'test',
      descriptif: 'sefeqsfv',
      photo: '/9j/4AAQSkZJR',
      _id: '53301fbfadb072be27f48106',
      __v: 0
    };

    // $scope.currentUserData = {
    //   local: {
    //     token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec"
    //   }
    // };

    // $rootScope.currentUser = {
    //   local: {
    //     token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec"
    //   }
    // };
    // $rootScope.loged = true;
    localStorage.setItem('dropboxLink', 'https://dl.dropboxusercontent.com/s/ungf6ylr8vs0658/adaptation.html#/');

    localStorage.setItem('compteId', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec');

    // $rootScope.currentUser = {
    //   _id: '53301fbfadb072be27f48106'
    // };

    $scope.shareLink = {
      'url': 'https://www.dropbox.com/s/ee44iev4pgw0avb/test.html',
      'expires': 'Tue, 01 Jan 2030 00:00:00 +0000'
    };

    $scope.listeProfilsParUser = [{
      owner: '53301d8b5836a5be73dc5d50',
      nom: 'test',
      descriptif: 'sefeqsfv',
      photo: '/9j/4AAQSkZJR',
      _id: '53301fbfadb072be27f48106',
      __v: 0
    }];

    var profils = [{
      _id: '52d8f928548367ee2d000006',
      photo: './files/profilImage.jpg',
      descriptif: 'descriptif3',
      nom: 'Nom3',
      profilID: '5329acd20c5ebdb429b2ec66'
    }];

    $scope.tagProfil = [{
      tag: '53359e9c153022351017d757',
      texte: '<p data-font=\'Arial\' data-size=\'12\' data-lineheight=\'22\' data-weight=\'Bold\' data-coloration=\'Surligner les mots\'> </p>',
      profil: '53359f97153022351017d758',
      tagName: 'azerty',
      police: 'Arial',
      taille: '12',
      interligne: '22',
      styleValue: 'Bold',
      coloration: 'Surligner les mots',
      _id: '53359f97153022351017d75a',
      __v: 0
    }, {
      tag: '53359e5a153022351017d756',
      texte: '<p data-font=\'Arial\' data-size=\'16\' data-lineheight=\'22\' data-weight=\'Bold\' data-coloration=\'Colorer les mots\'> </p>',
      profil: '53359f97153022351017d758',
      tagName: 'uyuy',
      police: 'Arial',
      taille: '16',
      interligne: '22',
      styleValue: 'Bold',
      coloration: 'Colorer les mots',
      _id: '53398a0d439bd8702158db6f',
      __v: 0
    }];

    var tags = [{
      _id: '52c588a861485ed41c000001',
      libelle: 'Exercice'
    }, {
      _id: '52c588a861485ed41c000002',
      libelle: 'Cours'
    }];

    localStorage.setItem('lastDocument', '2000-2-2_nnn_anjanznjjjdjcjc.html');

    $scope.testEnv = true;
    $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + localStorage.getItem('compteId')).respond($scope.dataRecu);
    $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/profilParUser').respond(profils);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajouterUserProfil').respond($scope.profilsParUsers);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond($scope.tagProfil);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond($scope.dataRecu);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfil').respond(profils);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/findUsersProfilsFavoris').respond($scope.user);
    $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec').respond(tags);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilsParDefaut').respond(profils);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/addUserProfil').respond($scope.dataRecu);

    $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $scope.dataRecu.dropbox.accessToken + '&path=' + configuration.CATALOGUE_NAME + '&root=sandbox&short_url=false').respond($scope.shareLink);
    $httpBackend.whenPOST(configuration.URL_REQUEST + '/findUserProfilsFavoris').respond(profils);
    $httpBackend.whenGET(configuration.URL_REQUEST +'/logout?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec').respond();
    $httpBackend.whenPOST(configuration.URL_REQUEST+'/profilActuByToken').respond(profils)
    $httpBackend.whenGET(configuration.URL_REQUEST+'/listeProfils?id='+localStorage.getItem('compteId')).respond(profils);
    $httpBackend.whenGET(configuration.URL_REQUEST+'/listeProfils?0=e&1=y&10=J&100=l&101=Z&102=e&103=D&104=T&105=W&106=8&107=E&108=c&11=K&12=V&13=1&14=Q&15=i&16=L&17=C&18=J&19=h&2=J&20=b&21=G&22=c&23=i&24=O&25=i&26=J&27=I&28=U&29=z&3=0&30=I&31=1&32=N&33=i&34=J&35=9&36=.&37=e&38=y&39=J&4=e&40=j&41=a&42=G&43=F&44=p&45=b&46=m&47=U&48=i&49=O&5=X&50=i&51=I&52=5&53=d&54=W&55=5&56=n&57=c&58=3&59=l&6=A&60=2&61=a&62=S&63=J&64=9&65=.&66=y&67=G&68=5&69=k&7=i&70=C&71=z&72=i&73=w&74=7&75=x&76=M&77=L&78=a&79=9&8=O&80=_&81=6&82=f&83=z&84=l&85=J&86=p&87=Q&88=n&89=X&9=i&90=6&91=P&92=S&93=U&94=R&95=y&96=X&97=8&98=C&99=G').respond(profils);
  
  }));

  it('CommonCtrl : Detecter actuel route', function() {
    $scope.isActive('/profiles/');
  });

  it('CommonCtrl : Show Menu', function() {
    $scope.showMenuParam = false;
    $scope.showMenu();
  });

  it('CommonCtrl : changerLangue ', function() {
    $scope.changerLangue();
  });

  it('CommonCtrl : afficherProfilsParUser ', inject(function($httpBackend) {
    //$scope.listeProfilsParUser[0] = $scope.profilsParUsers;
    $scope.afficherProfilsParUser();
    $httpBackend.flush();
    expect($scope.listeProfilsParUser).toEqual([{
      _id: '52d8f928548367ee2d000006',
      photo: './files/profilImage.jpg',
      descriptif: 'descriptif3',
      nom: 'Nom3',
      profilID: '5329acd20c5ebdb429b2ec66'
    }]);
  }));

  it('CommonCtrl : initCommon ', inject(function($httpBackend) {

    $scope.initCommon();
    $httpBackend.flush();
    // expect($scope.dataRecu.loged).toBeTruthy();

  }));

  it('CommonCtrl : changeProfilActuel ', inject(function($httpBackend) {
    $scope.profilActuel = '{"libelle":"nom","_id":"53301fbfadb072be27f48106","__v":0}';
    $scope.profilUser = {
      profilID: '53301fbfadb072be27f48106',
      userID: '53301d8b5836a5be73dc5d50'
    };

    expect($scope.profilUser.profilID).toEqual(JSON.parse($scope.profilActuel)._id);
    $scope.changeProfilActuel();
    $httpBackend.flush();
    expect($scope.userProfilFlag).toEqual($scope.profilsParUsers);
    expect($scope.listTags).toEqual([{
      _id: '52c588a861485ed41c000001',
      libelle: 'Exercice'
    }, {
      _id: '52c588a861485ed41c000002',
      libelle: 'Cours'
    }]);
    expect($scope.listTagsByProfil).toEqual($scope.tagProfil);

  }));

  it('CommonCtrl:showLastDocument()', function() {
    $scope.showLastDocument();
  });

  it('CommonCtrl:currentUserFunction()', inject(function($httpBackend) {
    $scope.currentUserFunction();
    expect($scope.setDropDownActuel).toEqual($scope.user);
    $httpBackend.flush();
  }));

  it('CommonCtrl:logoutFonction()', inject(function($httpBackend) {
    $scope.logoutFonction();
    $httpBackend.flush();
  }));

});