/* File: profiles.js
 *
 * Copyright (c) 2013-2016
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
/* global $:false */
/* jshint loopfunc:true */

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http, $rootScope, removeStringsUppercaseSpaces, configuration, $location, serviceCheck, verifyEmail, $window, profilsService,$modal) {

  /* Initialisations */
  $scope.successMod = 'Profil Modifie avec succes !';
  $scope.successAdd = 'Profil Ajoute avec succes !';
  $scope.successDefault = 'defaultProfileSelection';
  $scope.displayText = '<p>CnedAdapt : une solution web pour industrialiser le processus d’adaptation personnalisée de documents au bénéfice des personnes souffrant de troubles cognitifs spécifiques.</p>';
  $scope.displayTextSimple = 'CnedAdapt : une solution web pour industrialiser le processus d’adaptation personnalisée de documents au bénéfice des personnes souffrant de troubles cognitifs spécifiques.';
  $scope.cancelDefault = 'cancelDefault';
  $scope.flag = false;
  $scope.colorLists = ['Pas de coloration', 'Colorer les mots', 'Colorer les syllabes', 'Colorer les lignes RBV', 'Colorer les lignes RVJ', 'Colorer les lignes RBVJ', 'Surligner les mots', 'Surligner les lignes RBV', 'Surligner les lignes RVJ', 'Surligner les lignes RBVJ'];
  $scope.weightLists = ['Gras', 'Normal'];
  $scope.headers = ['Nom', 'Descriptif', 'Action'];
  $scope.profilTag = {};
  $scope.profil = {};
  $scope.listTag = {};
  $scope.editTag = null;
  $scope.colorList = null;
  $scope.tagStyles = [];
  $scope.deletedParams = [];
  $scope.tagProfilInfos = [];
  $scope.variableFlag = false;
  $scope.trashFlag = false;
  $scope.admin = $rootScope.admin;
  $scope.displayDestination = false;
  $scope.testEnv = false;
  $scope.loader = false;
  $scope.loaderMsg = '';
  $scope.tagStylesToDelete = [];

  $('#titreCompte').hide();
  $('#titreProfile').show();
  $('#titreDocument').hide();
  $('#titreAdmin').hide();
  $('#titreListDocument').hide();
  $('#detailProfil').hide();
  $('#titreDocumentApercu').hide();
  $('#titreTag').hide();

  $scope.policeLists = ['Arial', 'opendyslexicregular', 'Times New Roman'];
  $scope.tailleLists = [{
    number: '1',
    label: 'one'
  }, {
    number: '2',
    label: 'two'
  }, {
    number: '3',
    label: 'three'
  }, {
    number: '4',
    label: 'four'
  }, {
    number: '5',
    label: 'five'
  }, {
    number: '6',
    label: 'six'
  }, {
    number: '7',
    label: 'seven'
  }, {
    number: '8',
    label: 'eight'
  }, {
    number: '9',
    label: 'nine'
  }, {
    number: '10',
    label: 'ten'
  }];

  $scope.spaceLists = [{
    number: '1',
    label: 'one'
  }, {
    number: '2',
    label: 'two'
  }, {
    number: '3',
    label: 'three'
  }, {
    number: '4',
    label: 'four'
  }, {
    number: '5',
    label: 'five'
  }, {
    number: '6',
    label: 'six'
  }, {
    number: '7',
    label: 'seven'
  }, {
    number: '8',
    label: 'eight'
  }, {
    number: '9',
    label: 'nine'
  }, {
    number: '10',
    label: 'ten'
  }];
  $scope.spaceCharLists = [{
    number: '1',
    label: 'one'
  }, {
    number: '2',
    label: 'two'
  }, {
    number: '3',
    label: 'three'
  }, {
    number: '4',
    label: 'four'
  }, {
    number: '5',
    label: 'five'
  }, {
    number: '6',
    label: 'six'
  }, {
    number: '7',
    label: 'seven'
  }, {
    number: '8',
    label: 'eight'
  }, {
    number: '9',
    label: 'nine'
  }, {
    number: '10',
    label: 'ten'
  }];
  $scope.interligneLists = [{
    number: '1',
    label: 'one'
  }, {
    number: '2',
    label: 'two'
  }, {
    number: '3',
    label: 'three'
  }, {
    number: '4',
    label: 'four'
  }, {
    number: '5',
    label: 'five'
  }, {
    number: '6',
    label: 'six'
  }, {
    number: '7',
    label: 'seven'
  }, {
    number: '8',
    label: 'eight'
  }, {
    number: '9',
    label: 'nine'
  }, {
    number: '10',
    label: 'ten'
  }];

  $scope.requestToSend = {};
  if (localStorage.getItem('compteId')) {
    $scope.requestToSend = {
      id: localStorage.getItem('compteId')
    };
  }

  $rootScope.$watch('admin', function() {
    $scope.admin = $rootScope.admin;
    $scope.apply; // jshint ignore:line
  });
  
  /**
     * Ouvre une modal permettant de signaler à l'utilisateur que le partage est
     * indisponible en mode déconnecté
     * 
     * @method $partageInfoDeconnecte
     */
 $scope.partageInfoDeconnecte= function(){
    var modalInstance = $modal.open({
        templateUrl: 'views/common/informationModal.html',
        controller: 'InformationModalCtrl',
        size: 'sm',
        resolve: {
          title: function () {
            return 'Pas d\'accès internet';
          },
          content: function () {
            return 'La fonctionnalité de partage de profile nécessite un accès à internet';
          },
          reason: function () {
              return null;
            }
        }
      });
};


/**
 * Ouvre une modal permettant de signaler à l'utilisateur que la délégation est
 * indisponible en mode déconnecté
 * 
 * @method $delegationInfoDeconnecte
 */
$scope.delegationInfoDeconnecte= function(){
  var modalInstance = $modal.open({
      templateUrl: 'views/common/informationModal.html',
      controller: 'InformationModalCtrl',
      size: 'sm',
      resolve: {
        title: function () {
          return 'Pas d\'accès internet';
        },
        content: function () {
          return 'La fonctionnalité délégation de profile nécessite un accès à internet';
        },
        reason: function () {
            return null;
          }
      }
    });
};

  // $scope.currentTagProfil = null;
  $scope.initProfil = function() {
          $scope.verifProfil();
          $('#profilePage').show();
          $scope.currentUser();
          $scope.token = {
            id: localStorage.getItem('compteId')
          };
          $scope.afficherProfils();
  };

  $scope.displayOwner = function(param) {
    if (param.state === 'mine' || ($rootScope.currentUser.local.role === 'admin' && $rootScope.currentUser._id === param.owner)) {
      return 'Moi-même';
    } else if (param.state === 'favoris') {
      return 'Favoris';
    } else if (param.state === 'delegated') {
      return 'Délégué';
    } else if (param.state === 'default') {
      return 'CnedAdapt';
    }
  };

  $scope.verifProfil = function() {
    if (!localStorage.getItem('listTagsByProfil')) {
      if (!$scope.token && localStorage.getItem('compteId')) {
        $scope.token = {
          id: localStorage.getItem('compteId')
        };
      }
      $http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.token)
        .success(function(dataActuel) {
          $scope.chercherProfilActuelFlag = dataActuel;
          $scope.varToSend = {
            profilID: $scope.chercherProfilActuelFlag.profilID
          };
          $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
            idProfil: $scope.chercherProfilActuelFlag.profilID
          }).success(function(data) {
            $scope.chercherTagsParProfilFlag = data;
            localStorage.setItem('listTagsByProfil', JSON.stringify($scope.chercherTagsParProfilFlag));

          });
        });
    }
  };

  // Affichage des differents profils sur la page
  $scope.afficherProfils = function() {
    $http.get(configuration.URL_REQUEST + '/listerProfil', {
        params: $scope.token
      })
      .success(function(data) {
        $scope.listeProfils = data;
      }).error(function() {});
  };

  // gets the user that is connected
  $scope.currentUser = function() {
      $scope.afficherProfilsParUser();
  };


  $scope.tests = {};
  // displays user profiles
  $scope.afficherProfilsParUser = function() {

    console.log('afficherProfilsParUser ==> ');

    $scope.loader = true;
    $scope.loaderMsg = 'Affichage de la liste des profils en cours ...';
    profilsService.getProfilsByUser().then(function(data) {
        if (data) {
          /* Filtre Profiles de l'Admin */
          if ($rootScope.currentUser.local.role === 'admin') {
            for (var i = 0; i < data.length; i++) {
              if (data[i].type === 'profile' && data[i].state === 'mine') {
                for (var j = 0; j < data.length; j++) {
                  if (data[i]._id === data[j]._id && data[j].state === 'default' && data[j].owner === $rootScope.currentUser._id) {
                    data[i].stateDefault = true;
                    data.splice(j, 2);
                  }
                }
              }
            }
          }

          $scope.listTags = JSON.parse(localStorage.getItem('listTags'));
          var tagText = {};

          for (var i = data.length - 1; i >= 0; i--) { // jshint ignore:line
            if (data[i].type === 'tags') {
              var tagShow = [];
              var nivTag = 0;
              var nivTagTmp = 0;
              // Ordere des Tags
              for (var j = 0; j < data[i].tags.length; j++) { // jshint
                                                                // ignore:line
                for (var k = 0; k < $scope.listTags.length; k++) {
                  if (data[i].tags[j].tag === $scope.listTags[k]._id) {
                    data[i].tags[j].position = $scope.listTags[k].position;
                  }
                }
              }
              data[i].tags.sort(function(a, b) {
                return a.position - b.position;
              });

              for (var j = 0; j < data[i].tags.length; j++) { // jshint
                                                                // ignore:line
                nivTagTmp = nivTag;
                for (var k = 0; k < $scope.listTags.length; k++) { // jshint
                                                                    // ignore:line
                  if (data[i].tags[j].tag === $scope.listTags[k]._id) {
                    var tmpText = {};
                    tmpText.spaceSelected = 0 + (data[i].tags[j].spaceSelected - 1) * 0.18;
                    tmpText.spaceCharSelected = 0 + (data[i].tags[j].spaceCharSelected - 1) * 0.12;
                    tmpText.interligneList = 1.286 + (data[i].tags[j].interligne - 1) * 0.18;
                    tmpText.tailleList = 1 + (data[i].tags[j].taille - 1) * 0.18;

                    var fontstyle = 'Normal';
                    if (data[i].tags[j].styleValue === 'Gras') {
                      fontstyle = 'Bold';
                    }


                    if ($scope.listTags[k].niveau && parseInt($scope.listTags[k].niveau) > 0) {
                      nivTag = parseInt($scope.listTags[k].niveau);
                      nivTagTmp = nivTag;
                      nivTag++;
                    }

                    if (nivTagTmp === 0) {
                      tagText.niveau = 0;
                      tagText.width = 1055;
                    } else {
                      tagText.niveau = (nivTagTmp - 1) * 30;
                      var calculatedWidth = (1055 - tagText.niveau);
                      tagText.width = calculatedWidth;
                    }

                    // génération du style
                    var fontstyle = 'Normal';
                    if (data[i].tags[j].styleValue === 'Gras') {
                        fontstyle = 'Bold';
                    }
                    // Transformation propre à l'application
                    var style='font-family: ' + data[i].tags[j].police + ';' +
                    'font-size: ' + (1 + (data[i].tags[j].taille - 1) * 0.18) + 'em; ' +
                    'line-height: ' + (1.286 + (data[i].tags[j].interligne - 1) * 0.18) + 'em;' +
                    'font-weight: ' + fontstyle + ';  ' +
                    'word-spacing: ' + (0 + (data[i].tags[j].spaceSelected - 1) * 0.18) + 'em;' +
                    'letter-spacing: ' + (0 + (data[i].tags[j].spaceCharSelected - 1) * 0.12) + 'em;';

                    if($scope.listTags[k].balise !== 'div') {
                      var texteTag = '<'+$scope.listTags[k].balise+' style="' + style+'" data-margin-left="' + tagText.niveau + '" >' + $scope.listTags[k].libelle;
                    } else {
                      var texteTag = '<'+$scope.listTags[k].balise+' style="' + style+'" data-margin-left="' + tagText.niveau + '" class="'+removeStringsUppercaseSpaces($scope.listTags[k].libelle)+'">' + $scope.listTags[k].libelle;
                    }
                    if ($scope.listTags[k].libelle.toUpperCase().match('^TITRE')) {
                      texteTag += ' : Ceci est un exemple de ' + $scope.listTags[k].libelle + ' </'+$scope.listTags[k].balise+'>';
                    } else {
                      texteTag += ' : CnedAdapt est une application qui permet d\'adapter les documents. </'+$scope.listTags[k].balise+'>';
                    }


                    tagText = {
                      texte: texteTag
                    };

                    tagShow.push(tagText);
                    break;
                  }
                }

              }
              data[i].tagsText = tagShow;

            }
            data[i].showed = true;
          }

          $scope.tests = data;
          if (!$scope.$$phase) {
            $scope.$digest();
          }
          console.log($scope.tests);
        }

        $scope.loader = false;
        $scope.loaderMsg = '';

      });

  };


  $scope.isDeletable = function(param) {
    if (param.favourite && param.delete) {
      return true;
    }
    if (param.favourite && !param.delete) {
      return false;
    }
  };

  // Affichage des differents profils sur la page avec effacement des styles
  $scope.afficherProfilsClear = function() {

    // $scope.listeProfils = data;
    $scope.profil = {};
    $scope.tagList = {};
    $scope.policeList = {};
    $scope.tailleList = {};
    $scope.interligneList = {};
    $scope.weightList = {};
    $scope.colorList = {};
    $scope.tagStyles = [];
    $scope.erreurAfficher = false;
    $('.shown-text-add').text($scope.displayTextSimple);
    $('.shown-text-add').css('font-family', '');
    $('.shown-text-add').css('font-size', '');
    $('.shown-text-add').css('line-height', '');
    $('.shown-text-add').css('font-weight', '');
    $('.shown-text-add').css('word-spacing', '0em');
    $('.shown-text-add').css('letter-spacing', '0em');
    $('.shown-text-add').removeAttr('style');


    $('.shown-text-edit').text($scope.displayTextSimple);
    $('.shown-text-edit').css('font-family', '');
    $('.shown-text-edit').css('font-size', '');
    $('.shown-text-edit').css('line-height', '');
    $('.shown-text-edit').css('font-weight', '');
    $('.shown-text-edit').css('word-spacing', '0em');
    $('.shown-text-edit').css('letter-spacing', '0em');
    $('.shown-text-edit').removeAttr('style');

    $('.shown-text-duplique').text($scope.displayTextSimple);
    $('.shown-text-duplique').css('font-family', '');
    $('.shown-text-duplique').css('font-size', '');
    $('.shown-text-duplique').css('line-height', '');
    $('.shown-text-duplique').css('font-weight', '');
    $('.shown-text-duplique').css('word-spacing', '0em');
    $('.shown-text-duplique').css('letter-spacing', '0em');
    $('.shown-text-duplique').removeAttr('style');

    // set customSelect jquery plugin span text to empty after cancel
    $('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="tagList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');
    $scope.tagList = null;
    $scope.editTag = null;
    $scope.hideVar = true;
    $scope.policeList = null;
    $scope.tailleList = null;
    $scope.interligneList = null;
    $scope.weightList = null;
    $scope.colorList = null;
    $scope.affichage = false;
    $scope.spaceSelected = null;
    $scope.spaceCharSelected = null;

    $('#selectId').prop('disabled', false);
    $scope.currentTagProfil = null;
    $scope.reglesStyleChange('initialiseColoration', null);
    $scope.editStyleChange('initialiseColoration', null);

    $('#add_tag').removeAttr('disabled');

  };

  // Affiche les widgets en bleu;
  $scope.isTagStylesNotEmpty = function() {
    if ($scope.tagStyles.length >= 0) {
      return true;
    }
  };
  // Ajout d'un profil
  $scope.erreurAfficher = false;
  $scope.errorAffiche = [];

  $scope.ajouterProfil = function() {
    $scope.errorAffiche = [];
    $scope.addFieldError = [];

    if (!$scope.profil.nom || !$scope.profil.descriptif) { // jshint
                                                            // ignore:line
      if ($scope.profil.nom == null) { // jshint ignore:line
        $scope.addFieldError.push(' Nom ');
        $scope.affichage = true;
      }
      if ($scope.profil.descriptif == null) { // jshint ignore:line
        $scope.addFieldError.push(' Descriptif ');
        $scope.affichage = true;
      }
    } else {
      $scope.affichage = false;
    }

    if ((!$scope.profil.nom || !$scope.profil.descriptif) && $scope.addFieldError.state) {
      $scope.erreurAfficher = true;
      $scope.errorAffiche.push(' profilInfos ');
    }

    if ($scope.tagStyles.length == 0) { // jshint ignore:line
      $scope.errorAffiche.push(' Règle ');
      $scope.erreurAfficher = true;
    }

    if ($scope.profil.nom !== null && $scope.profil.descriptif !== null && $scope.addFieldError.state) {
      $scope.errorAffiche = [];
    }

    if ($scope.tagStyles.length > 0 && $scope.errorAffiche.length === 0 && $scope.affichage === false) { // jshint
                                                                                                        // ignore:line
      $scope.loader = true;
      $scope.loaderMsg = 'Enregistrement du profil en cours ...';
      $('.addProfile').attr('data-dismiss', 'modal');
      $scope.profil.photo = './files/profilImage/profilImage.jpg';
      $scope.profil.owner = $rootScope.currentUser._id;
      profilsService.addProfil($rootScope.isAppOnline,$scope.profil, $scope.tagStyles).then(function(data) {
          $scope.profilFlag = data;
          $scope.lastDocId = data._id;
          $scope.loader = false;
          $scope.loaderMsg = '';
          $scope.afficherProfilsParUser();
          $scope.resetAddProfilModal();
        });
    }
  };
  
  $scope.resetAddProfilModal = function() {
      $scope.profil = {};
      $scope.tagStyles.length = 0;
      $scope.tagStyles = [];
      $scope.colorList = {};
      $scope.errorAffiche = [];
      $scope.addFieldError = [];
      $('.shown-text-add').text($scope.displayTextSimple);
      $('.shown-text-add').css('font-family', '');
      $('.shown-text-add').css('font-size', '');
      $('.shown-text-add').css('line-height', '');
      $('.shown-text-add').css('font-weight', '');
      $('.shown-text-add').removeAttr('style');
      $('#addPanel').fadeIn('fast').delay(5000).fadeOut('fast');
      $scope.tagList = {};
      $scope.policeList = {};
      $scope.tailleList = {};
      $scope.interligneList = {};
      $scope.weightList = {};
      $scope.colorList = {};
      $scope.spaceSelected = null;
      $scope.spaceCharSelected = null;
      $scope.editTag = null;
      $('.addProfile').removeAttr('data-dismiss');
      $scope.affichage = false;
      $scope.erreurAfficher = false;
      $scope.profilTag = {};
  };

  // Modification du profil
  $scope.modifierProfil = function() {
    $scope.addFieldError = [];
    $scope.errorAffiche = [];

    if (!$scope.profMod.nom) { // jshint ignore:line
      $scope.addFieldError.push(' Nom ');
      $scope.affichage = true;
    }
    if (!$scope.profMod.descriptif) { // jshint ignore:line
      $scope.addFieldError.push(' Descriptif ');
      $scope.affichage = true;
    }
    if ($scope.tagStyles.length == 0) { // jshint ignore:line
      $scope.errorAffiche.push(' Règle ');
      $scope.erreurAfficher = true;
    }
    if ($scope.addFieldError.length === 0 && $scope.tagStyles.length > 0) { // jshint
                                                                            // ignore:line
      $scope.loader = true;
      $scope.loaderMsg = 'Modification du profil en cours ...';
      $('.editionProfil').attr('data-dismiss', 'modal');
      profilsService.updateProfil($rootScope.isAppOnline,$scope.profMod).then(function(data) {
          $scope.profilFlag = data;
          /* unit tests */
          if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
            $scope.detailProfil.nom = $scope.profMod.nom;
            $scope.detailProfil.descriptif = $scope.profMod.descriptif;
          }
          $scope.editionAddProfilTag();
          $('.editionProfil').removeAttr('data-dismiss');
          $scope.affichage = false;
          $scope.tagStyles = [];
          $rootScope.updateListProfile = !$rootScope.updateListProfile;
          if ($scope.oldProfilNom === $('#headerSelect + .customSelect .customSelectInner').text()) {
            $('#headerSelect + .customSelect .customSelectInner').text($scope.profMod.nom);
          }

          $rootScope.actu = data;
          $rootScope.apply; // jshint ignore:line

          $scope.loader = false;
          $scope.loaderMsg = '';

        });
    }

  };

  // Suppression du profil
  $scope.supprimerProfil = function() {
    $scope.loader = true;
    $scope.loaderMsg = 'Suppression du profil en cours ...';
    profilsService.deleteProfil($rootScope.isAppOnline,$rootScope.currentUser._id, $scope.sup._id).then(function(data){
        $scope.profilFlag = data;
        $('#deleteModal').modal('hide');
        $scope.loader = false;
        $scope.loaderMsg = '';

        $scope.tagStyles.length = 0;
        $scope.tagStyles = [];
        $scope.removeUserProfileFlag = data;
        if ($scope.sup.nom === $('#headerSelect + .customSelect .customSelectInner').text()) {
          $scope.token.defaultProfile = $scope.removeVar;
          $http.post(configuration.URL_REQUEST + '/setProfilParDefautActuel', $scope.token)
            .success(function() {
              localStorage.removeItem('profilActuel');
              localStorage.removeItem('listTags');
              localStorage.removeItem('listTagsByProfil');
              $window.location.reload();
            });
        } else {
          $rootScope.updateListProfile = !$rootScope.updateListProfile;
          $scope.afficherProfilsParUser();
        }
      });
  };

  // Premodification du profil
  $scope.preModifierProfil = function(profil) {
    $scope.actionType = 'modification';
    if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
      $scope.profMod = {};
      $scope.profMod._id = profil._id;
      $scope.profMod.nom = profil.nom;
      $scope.profMod.descriptif = profil.descriptif;
      $scope.profMod.owner = profil.owner;
      $scope.profMod.photo = profil.photo;
      if (profil.preDelegated) {
        $scope.profMod.preDelegated = profil.preDelegated;
      }
      if (profil.delegated) {
        $scope.profMod.delegated = profil.delegated;
      }
    } else {
      $scope.profMod = profil;
    }
    $scope.oldProfilNom = $scope.profMod.nom;
    profilsService.getProfilTags($scope.profMod._id).then(function(data) {
        $scope.tagStylesFlag = data;
        /* Unit tests */
        $scope.tagStyles = data;
        $scope.afficherTags();
      });
    $('.shown-text-edit').text($scope.displayTextSimple);
  };

  // Presuppression du profil
  $scope.preSupprimerProfil = function(profil) {
    $scope.sup = profil;
    $scope.profilName = profil.nom;
  };

  // Affichage des tags
  $scope.afficherTags = function() {

    if (localStorage.getItem('listTags')) {
      $scope.listTags = JSON.parse(localStorage.getItem('listTags'));
      // Set disabled tags
      for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
        for (var j = $scope.listTags.length - 1; j >= 0; j--) {
          if ($scope.listTags[j]._id === $scope.tagStyles[i].tag) {
            $scope.listTags[j].disabled = true;
            $scope.tagStyles[i].tagLibelle = $scope.listTags[j].libelle;
          }
        }
      }
    } else {
      $http.get(configuration.URL_REQUEST + '/readTags', {
          params: $scope.requestToSend
        })
        .success(function(data) {
          $scope.listTags = data;
          // Set disabled tags
          for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
            for (var j = $scope.listTags.length - 1; j >= 0; j--) {
              if ($scope.listTags[j]._id === $scope.tagStyles[i].tag) {
                $scope.listTags[j].disabled = true;
                $scope.tagStyles[i].tagLibelle = $scope.listTags[j].libelle;
              }
            }
          }

        });
    }

  };

  $scope.preAddProfil = function() {
    $scope.tagStyles = [];
    $scope.afficherTags();
    $scope.affichage = false;

    // Ajouter le texte de l'aperçu des Tags
    $('.shown-text-add').text($scope.displayTextSimple);

  };

  /* Mettre à jour la liste des TagsParProfil */
  $scope.updateProfilActual = function() {
    var profilActual = JSON.parse(localStorage.getItem('profilActuel'));

    /* Mettre à jour l'apercu de la liste des profils */
      if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
        $scope.initDetailProfil();
      } else {
        $scope.afficherProfilsParUser();
      }
    if (profilActual && $scope.profMod._id === profilActual._id) {
        profilsService.getProfilTags($scope.profilFlag._id).then(function(data) {
            localStorage.setItem('listTagsByProfil', JSON.stringify(data));
        });
    }
  };

  // enregistrement du profil-tag lors de l'edition
  $scope.editionAddProfilTag = function() {
    var profilTagsResult = [];

    if (!$scope.token || !$scope.token.id) {
      $scope.token = {
        id: localStorage.getItem('compteId')
      };
    }

    $scope.tagStyles.forEach(function(item) {
        var profilTag = {
          id_tag: item.tag,
          style: item.texte,
          police: item.police,
          taille: item.taille,
          interligne: item.interligne,
          styleValue: item.styleValue,
          coloration: item.coloration,
          spaceSelected: item.spaceSelected,
          spaceCharSelected: item.spaceCharSelected
        };
        if(item.state !=='deleted') {
            profilTagsResult.push(profilTag);
        }
    });

    $scope.resetEditProfilModal();
    
    console.log('new tags : ');
    console.log(profilTagsResult);
    
    profilsService.updateProfilTags($rootScope.isAppOnline,$scope.profMod, profilTagsResult).then(function(result) {
        if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
            $scope.initDetailProfil();
        } else {
            $scope.afficherProfilsParUser();
        }
        $scope.updateProfilActual();
        $('#editPanel').fadeIn('fast').delay(1000).fadeOut('fast');
    });

  };
  
  $scope.resetEditProfilModal = function() {
      $scope.tagStyles = [];
      $scope.tagList = {};
      $scope.policeList = null;
      $scope.tailleList = null;
      $scope.interligneList = null;
      $scope.weightList = null;
      $scope.listeProfils = {};
      $scope.editTag = null;
      $scope.colorList = null;
      $scope.spaceSelected = null;
      $scope.spaceCharSelected = null;
      $('.shown-text-edit').text($scope.displayTextSimple);
      $('.shown-text-edit').css('font-family', '');
      $('.shown-text-edit').css('font-size', '');
      $('.shown-text-edit').css('line-height', '');
      $('.shown-text-edit').css('font-weight', '');
      $('.shown-text-edit').removeAttr('style');

      $('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text('');
      $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
      $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
      $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
      $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
      $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
      $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
      $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');
  };

  // Griser select après validation
  $scope.affectDisabled = function(param) {
    if (param) {
      return true;
    } else {
      return false;
    }
  };

  // verification des champs avant validation lors de l'ajout
  $scope.beforeValidationAdd = function() {
    $scope.addFieldError = [];
    $scope.affichage = false;

    if ($scope.profil.nom == null) { // jshint ignore:line
      $scope.addFieldError.push(' Nom ');
      $scope.affichage = true;
    }
    if ($scope.profil.descriptif == null) { // jshint ignore:line
      $scope.addFieldError.push(' Descriptif ');
      $scope.affichage = true;
    }
    if ($scope.tagList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Règle ');
      $scope.affichage = true;
    }
    if ($scope.policeList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Police ');
      $scope.affichage = true;
    }
    if ($scope.tailleList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Taille ');
      $scope.affichage = true;
    }
    if ($scope.interligneList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Interligne ');
      $scope.affichage = true;
    }
    if ($scope.colorList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Coloration ');
      $scope.affichage = true;
    }
    if ($scope.weightList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Graisse ');
      $scope.affichage = true;
    }
    if ($scope.spaceSelected == null) { // jshint ignore:line
      $scope.addFieldError.push(' espace entre les mots ');
      $scope.affichage = true;
    }
    if ($scope.spaceCharSelected == null) { // jshint ignore:line
      $scope.addFieldError.push(' Espace entre Les caractères ');
      $scope.affichage = true;
    }

    if ($scope.addFieldError.length === 0) {
      $scope.validerStyleTag();
      $scope.addFieldError.state = true;
      $scope.affichage = false;
      $scope.erreurAfficher = false;
      $scope.errorAffiche = [];
      $scope.colorationCount = 0;
      $scope.oldColoration = null;
      $scope.spaceSelected = null;
      $scope.spaceSelected = null;
    }
  };
  $scope.addFieldError = [];

  // verification des champs avant validation lors de la modification
  $scope.beforeValidationModif = function() {
    $scope.affichage = false;
    $scope.addFieldError = [];

    if ($scope.profMod.nom == null) { // jshint ignore:line
      $scope.addFieldError.push(' Nom ');
      $scope.affichage = true;
    }
    if ($scope.profMod.descriptif == null) { // jshint ignore:line
      $scope.addFieldError.push(' Descriptif ');
      $scope.affichage = true;
    }
    if ($scope.editTag == null) { // jshint ignore:line
      $scope.addFieldError.push(' Règle ');
      $scope.affichage = true;
    }
    if ($scope.policeList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Police ');
      $scope.affichage = true;
    }
    if ($scope.tailleList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Taille ');
      $scope.affichage = true;
    }
    if ($scope.interligneList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Interligne ');
      $scope.affichage = true;
    }
    if ($scope.colorList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Coloration ');
      $scope.affichage = true;
    }
    if ($scope.weightList == null) { // jshint ignore:line
      $scope.addFieldError.push(' Graisse ');
      $scope.affichage = true;
    }
    if ($scope.spaceSelected == null) { // jshint ignore:line
      $scope.addFieldError.push(' Espace entre Les mots ');
      $scope.affichage = true;
    }
    if ($scope.spaceCharSelected == null) { // jshint ignore:line
      $scope.addFieldError.push(' Espace entre Les caractères ');
      $scope.affichage = true;
    }
    if ($scope.addFieldError.length === 0) {
      $scope.editerStyleTag();
    }
    if ($scope.tagStyles.length > 0) {
      $scope.erreurAfficher = false;
    }
    console.log($scope.tagStyles.length);
    console.log($scope.affichage);
  };

  // Valider les attributs d'un Tag
  $scope.validerStyleTag = function() {

    try {
      $scope.currentTag = JSON.parse($scope.tagList);
    } catch (ex) {
      console.log('Exception ==> ', ex);
      $scope.currentTag = $scope.tagList;
    }

    var fontstyle = 'Normal';
    if ($scope.weightList === 'Gras') {
      fontstyle = 'Bold';
    }
    var tmpText = {};
    tmpText.spaceSelected = 0 + ($scope.spaceSelected - 1) * 0.18;
    tmpText.spaceCharSelected = 0 + ($scope.spaceCharSelected - 1) * 0.12;
    tmpText.interligneList = 1.286 + ($scope.interligneList - 1) * 0.18;
    tmpText.tailleList = 1 + ($scope.tailleList - 1) * 0.18;

    var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + tmpText.tailleList + '" data-lineheight="' + tmpText.interligneList + '" data-weight="' + fontstyle + '" data-coloration="' + $scope.colorList + '" data-word-spacing="' + tmpText.spaceSelected + '" data-letter-spacing="' + tmpText.spaceCharSelected + '" > </p>';

    var tagExist = false;
    for (var i = 0; i < $scope.tagStyles.length; i++) {
      if ($scope.tagStyles[i].id_tag === $scope.currentTag._id) { // jshint
                                                                    // ignore:line
        $scope.tagStyles[i].style = mytext;
        $scope.tagStyles[i].label = $scope.currentTag.libelle;
        $scope.tagStyles[i].police = $scope.policeList;
        $scope.tagStyles[i].taille = $scope.tailleList;
        $scope.tagStyles[i].interligne = $scope.interligneList;
        $scope.tagStyles[i].styleValue = $scope.weightList;
        $scope.tagStyles[i].coloration = $scope.colorList;
        $scope.tagStyles[i].spaceSelected = $scope.spaceSelected;
        $scope.tagStyles[i].spaceCharSelected = $scope.spaceCharSelected;
        tagExist = true;
        break;
      }
    }

    // If Tag does not exist already, add a new One
    if (!tagExist) {
      $scope.tagStyles.push({
        id_tag: $scope.currentTag._id,
        style: mytext,
        label: $scope.currentTag.libelle,
        police: $scope.policeList,
        taille: $scope.tailleList,
        interligne: $scope.interligneList,
        styleValue: $scope.weightList,
        coloration: $scope.colorList,
        spaceSelected: $scope.spaceSelected,
        spaceCharSelected: $scope.spaceCharSelected
      });
    }


    angular.element($('#style-affected-add').removeAttr('style'));
    $scope.editStyleChange('initialiseColoration', null);
    $('.shown-text-add').removeAttr('style');
    $('.shown-text-add').text($scope.displayTextSimple);

    $scope.colorationCount = 0;
    $scope.tagList = null;
    $scope.policeList = null;
    $scope.tailleList = null;
    $scope.interligneList = null;
    $scope.weightList = null;
    $scope.colorList = null;
    $scope.spaceSelected = null;
    $scope.spaceCharSelected = null;
    $scope.editTag = null;
    $('.label_action').removeClass('selected_label');
    $('#addProfile .customSelectInner').text('');
    $('#add_tag').prop('disabled', false);
    $scope.hideVar = true;

    // Disable Already Selected Tags
    for (var i = $scope.listTags.length - 1; i >= 0; i--) { // jshint
                                                            // ignore:line
      for (var j = 0; j < $scope.tagStyles.length; j++) {
        if ($scope.listTags[i]._id === $scope.tagStyles[j].id_tag) { // jshint
                                                                    // ignore:line
          $scope.listTags[i].disabled = true;
        }
      }
    }
  };


  // Modifier les attributs d'un Tag
  $scope.editStyleTag = function(tagStyleParametre) {

    // Set Selected Tag
    $('.label_action').removeClass('selected_label');
    $('#' + tagStyleParametre.id_tag).addClass('selected_label');
    $scope.currentTagProfil = tagStyleParametre;

    for (var i = 0; i < $scope.tagStyles.length; i++) {
      if (tagStyleParametre.id_tag === $scope.tagStyles[i].id_tag) {

        // Afficher le nom du tag dans le Select
        $scope.tagStyles[i].disabled = true;
        $scope.hideVar = false;
        angular.element($('#add_tag option').each(function() {
          var itemText = $(this).text();
          if (itemText === tagStyleParametre.label) {
            $(this).prop('selected', true);
            $('#add_tag').prop('disabled', 'disabled');
            $('#addProfileValidation').prop('disabled', false);
          }
        }));

        // Disable le bouton de Validation du Tag
        // $('#addProfileValidation').prop('disabled', false);

        // Set des paramétres à afficher
        $scope.tagList = {
          _id: tagStyleParametre.id_tag,
          libelle: tagStyleParametre.label
        };
        $scope.policeList = tagStyleParametre.police;
        $scope.tailleList = tagStyleParametre.taille;
        $scope.interligneList = tagStyleParametre.interligne;
        $scope.weightList = tagStyleParametre.styleValue;
        $scope.colorList = tagStyleParametre.coloration;
        $scope.spaceSelected = tagStyleParametre.spaceSelected;
        $scope.spaceCharSelected = tagStyleParametre.spaceCharSelected;

        // Activation de du changement de l'aperçu Profil
        $scope.reglesStyleChange('police', $scope.policeList);
        $scope.reglesStyleChange('taille', $scope.tailleList);
        $scope.reglesStyleChange('interligne', $scope.interligneList);
        $scope.reglesStyleChange('style', $scope.weightList);
        $scope.reglesStyleChange('coloration', $scope.colorList);
        $scope.reglesStyleChange('space', $scope.spaceSelected);
        $scope.reglesStyleChange('spaceChar', $scope.spaceCharSelected);

        /* Selection de la pop-up d'ajout de Profil */
        var addModal = $('#addProfileModal');

        // set span text value of Customselects
        $(addModal).find('select[data-ng-model="tagList"] + .customSelect .customSelectInner').text(tagStyleParametre.label);
        $(addModal).find('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text(tagStyleParametre.police);
        $(addModal).find('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text(tagStyleParametre.taille);
        $(addModal).find('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text(tagStyleParametre.interligne);
        $(addModal).find('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text(tagStyleParametre.styleValue);
        $(addModal).find('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text(tagStyleParametre.coloration);
        $(addModal).find('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text(tagStyleParametre.spaceSelected);
        $(addModal).find('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text(tagStyleParametre.spaceCharSelected);
      }
    }
  };

  $scope.checkStyleTag = function() {
    if ($scope.tagStyles.length > 0) {
      return false;
    }
    if ($scope.tagStyles.length === 0 && $scope.trashFlag) {
      return false;
    }
    return true;
  };

  // Edition StyleTag
  $scope.editerStyleTag = function() {

    var fontstyle = 'Normal';
    if ($scope.weightList === 'Gras') {
      fontstyle = 'Bold';
    }
    if (!$scope.currentTagProfil) {
      console.log('addiction of new element');
      /* Aucun tag n'est sélectionné */
      $scope.currentTagEdit = JSON.parse($scope.editTag);
      for (var i = $scope.listTags.length - 1; i >= 0; i--) {
        if ($scope.listTags[i]._id === $scope.currentTagEdit._id) {
          $scope.listTags[i].disabled = true;
          break;
        }
      }
      var tmpText = {};
      tmpText.spaceSelected = 0 + ($scope.spaceSelected - 1) * 0.18;
      tmpText.spaceCharSelected = 0 + ($scope.spaceCharSelected - 1) * 0.12;
      tmpText.interligneList = 1.286 + ($scope.interligneList - 1) * 0.18;
      tmpText.tailleList = 1 + ($scope.tailleList - 1) * 0.18;


      var textEntre = '<p data-font="' + $scope.policeList + '" data-size="' + tmpText.tailleList + '" data-lineheight="' + tmpText.interligneList + '" data-weight="' + fontstyle + '" data-coloration="' + $scope.colorList + '" data-word-spacing="' + tmpText.spaceSelected + '" data-letter-spacing="' + tmpText.spaceCharSelected + '" > </p>';
      // var textEntre = '<p data-font="' + $scope.policeList + '"
        // data-size="' + $scope.tailleList + '" data-lineheight="' +
        // $scope.interligneList + '" data-weight="' + $scope.weightList + '"
        // data-coloration="' + $scope.colorList + '" data-word-spacing ="' +
        // $scope.spaceSelected + '" data-letter-spacing="' +
        // $scope.spaceCharSelected + '"> </p>';

      /* Liste nouveaux Tags */
      $scope.tagStyles.push({
        tag: $scope.currentTagEdit._id,
        tagLibelle: $scope.currentTagEdit.libelle,
        profil: $scope.lastDocId,
        police: $scope.policeList,
        taille: $scope.tailleList,
        interligne: $scope.interligneList,
        styleValue: $scope.weightList,
        coloration: $scope.colorList,
        spaceSelected: $scope.spaceSelected,
        spaceCharSelected: $scope.spaceCharSelected,
        texte: textEntre,
        state: 'added'
      });
      console.log($scope.tagStyles);
      angular.element($('.shown-text-edit').text($scope.displayTextSimple));
      angular.element($('#style-affected-edit').removeAttr('style'));
    } else {
      /* Tag sélectionné */
      console.log('edition tagstyle');
      if (!$scope.currentTagProfil.state) {
        console.log('edition of element 2');
        var tmpText2 = {};
        tmpText2.spaceSelected = 0 + ($scope.spaceSelected - 1) * 0.18;
        tmpText2.spaceCharSelected = 0 + ($scope.spaceCharSelected - 1) * 0.12;
        tmpText2.interligneList = 1.286 + ($scope.interligneList - 1) * 0.18;
        tmpText2.tailleList = 1 + ($scope.tailleList - 1) * 0.18;

        var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + tmpText2.tailleList + '" data-lineheight="' + tmpText2.interligneList + '" data-weight="' + fontstyle + '" data-coloration="' + $scope.colorList + '" data-word-spacing="' + tmpText2.spaceSelected + '" data-letter-spacing="' + tmpText2.spaceCharSelected + '" > </p>';
        /* Liste tags modifiés */
        for (var c = 0; c < $scope.tagStyles.length; c++) {
          if ($scope.tagStyles[c]._id === $scope.currentTagProfil._id) {
            $scope.tagStyles[c].texte = mytext;
            $scope.tagStyles[c].police = $scope.policeList;
            $scope.tagStyles[c].taille = $scope.tailleList;
            $scope.tagStyles[c].interligne = $scope.interligneList;
            $scope.tagStyles[c].styleValue = $scope.weightList;
            $scope.tagStyles[c].coloration = $scope.colorList;
            $scope.tagStyles[c].spaceSelected = $scope.spaceSelected;
            $scope.tagStyles[c].spaceCharSelected = $scope.spaceCharSelected;
            $scope.tagStyles[c].state = 'modified';
          }
        }

        $scope.currentTagProfil = null;
        $scope.noStateVariableFlag = true;
      }
    }

    $('#selectId option').eq(0).prop('selected', true);
    $('#selectIdDuplisuer option').eq(0).prop('selected', true);
    $('#selectId').prop('disabled', false);
    $('#selectIdDuplisuer').prop('disabled', false);
    $scope.hideVar = true;
    $scope.editTag = null;
    $scope.policeList = null;
    $scope.tailleList = null;
    $scope.interligneList = null;
    $scope.weightList = null;
    $scope.colorList = null;
    $scope.spaceSelected = null;
    $scope.spaceCharSelected = null;
    $scope.colorationCount = 0;
    $scope.oldColoration = null;
    $scope.editStyleChange('initialiseColoration', null);
    $('.selected_label').removeClass('selected_label');

    // set customSelect jquery plugin span text to empty string
    $('.shown-text-edit').removeAttr('style');
    $('.shown-text-duplique').removeAttr('style');
    $('.shown-text-edit').text($scope.displayTextSimple);
    $('.shown-text-duplique').text($scope.displayTextSimple);
    $('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');
  };

  // Suppression d'un paramètre
  $scope.ajoutSupprimerTag = function(parameter) {
    var index = $scope.tagStyles.indexOf(parameter);
    if (index > -1) {
      $scope.tagStyles.splice(index, 1);
    }
    for (var j = $scope.listTags.length - 1; j >= 0; j--) {
      if ($scope.listTags[j]._id === parameter.id_tag) {
        $scope.listTags[j].disabled = false;
      }
    }

    if ($scope.tagStyles.length < 1) {
      $scope.erreurAfficher = true;
    } else {
      $scope.erreurAfficher = false;
    }
    // Set des valeures par défaut
    $('.shown-text-add').text($scope.displayTextSimple);
    $('.shown-text-add').removeAttr('style');

    $scope.hideVar = true;

    $('select[data-ng-model="tagList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');
    $('#add_tag option').eq(0).prop('selected', true);
    $scope.policeList = null;
    $scope.tailleList = null;
    $scope.interligneList = null;
    $scope.colorList = null;
    $scope.weightList = null;
    $scope.spaceSelected = null;
    $scope.spaceCharSelected = null;
    $scope.tagList = null;
    $scope.reglesStyleChange('initialiseColoration', null);
    $('#add_tag').removeAttr('disabled');
  };


  $scope.PreeditionSupprimerTag = function(toDelete){
    $('#myModal').modal('show');
    $scope.toDeleteTag = toDelete ;
  };

  // Supression d'un tag lors de l'edition
  $scope.editionSupprimerTag = function() {
    var parameter  = $scope.toDeleteTag ;
    // if (parameter.state) {
    var index = $scope.tagStyles.indexOf(parameter);
    if (index > -1) {
      var tmp = $scope.tagStyles[index];
      tmp.state = 'deleted';
      $scope.tagStylesToDelete.push(tmp);
      $scope.tagStyles.splice(index, 1);

    }
    for (var k = $scope.listTags.length - 1; k >= 0; k--) {
      if (parameter.tag === $scope.listTags[k]._id) {
        $scope.listTags[k].disabled = false;
      }
    }

    if ($scope.tagStyles.length < 1) {
      $scope.erreurAfficher = true;
    } else {
      $scope.erreurAfficher = false;
    }
    $scope.currentTagProfil = null;

    $scope.editStyleChange('initialiseColoration', null);

    angular.element($('.shown-text-edit').text($scope.displayTextSimple));
    angular.element($('.shown-text-duplique').text($scope.displayTextSimple));
    angular.element($('.shown-text-edit').removeAttr('style'));
    angular.element($('.shown-text-duplique').removeAttr('style'));

    $scope.hideVar = true;

    $('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
    $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');

    $('#selectId option').eq(0).prop('selected', true);
    $('#selectIdDuplisuer option').eq(0).prop('selected', true);
    $('#selectId').removeAttr('disabled');
    $('#selectIdDuplisuer').removeAttr('disabled');
    $scope.policeList = null;
    $scope.tailleList = null;
    $scope.interligneList = null;
    $scope.colorList = null;
    $scope.weightList = null;
    $scope.spaceSelected = null;
    $scope.spaceCharSelected = null;
    $scope.editTag = null;
    $scope.editStyleChange('initialiseColoration', null);

  };

  $scope.hideVar = true;
  // Modification d'un tag lors de l'edition
  $scope.label_action = 'label_action';

  $scope.editionModifierTag = function(parameter) {
    console.time('editionModifierTag');
    $scope.hideVar = false;
    $('.label_action').removeClass('selected_label');
    $('#' + parameter._id).addClass('selected_label');
    $scope.currentTagProfil = parameter;
    for (var i = $scope.listTags.length - 1; i >= 0; i--) {
      if (parameter.tag === $scope.listTags[i]._id) {

        $scope.listTags[i].disabled = true;
        $('#selectId option').each(function() {
          var itemText = $(this).text();
          if (itemText === parameter.tagLibelle) {
            $(this).prop('selected', true);
            $('#selectId').prop('disabled', 'disabled');
            $('#editValidationButton').prop('disabled', false);
          }
        });
        $('#editValidationButton').prop('disabled', false);
        $scope.editTag = parameter.tagLibelle;
        $scope.policeList = parameter.police;
        $scope.tailleList = parameter.taille;
        $scope.interligneList = parameter.interligne;
        $scope.weightList = parameter.styleValue;
        $scope.colorList = parameter.coloration;
        $scope.spaceSelected = parameter.spaceSelected;
        $scope.spaceCharSelected = parameter.spaceCharSelected;

        $scope.editStyleChange('police', $scope.policeList);
        $scope.editStyleChange('taille', $scope.tailleList);
        $scope.editStyleChange('interligne', $scope.interligneList);
        $scope.editStyleChange('style', $scope.weightList);
        $scope.editStyleChange('space', $scope.spaceSelected);
        $scope.editStyleChange('spaceChar', $scope.spaceCharSelected);
        $scope.editStyleChange('coloration', $scope.colorList);

        /* Selection du pop-up de Modification */
        var modalEdit = $('#editModal');

        // set span text value of customselect
        $(modalEdit).find('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text(parameter.tagLibelle);
        $(modalEdit).find('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text(parameter.police);
        $(modalEdit).find('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text(parameter.taille);
        $(modalEdit).find('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text(parameter.interligne);
        $(modalEdit).find('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text(parameter.styleValue);
        $(modalEdit).find('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text(parameter.coloration);
        $(modalEdit).find('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text(parameter.spaceSelected);
        $(modalEdit).find('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text(parameter.spaceCharSelected);
        console.timeEnd('editionModifierTag');
      }
    }
  };

  $scope.reglesStyleChange = function(operation, value) {
    $rootScope.$emit('reglesStyleChange', {
      'operation': operation,
      'element': 'shown-text-add',
      'value': value
    });
  };

  $scope.editStyleChange = function(operation, value) {
    $rootScope.$emit('reglesStyleChange', {
      'operation': operation,
      'element': 'shown-text-edit',
      'value': value
    });
  };

  $scope.editHyphen = function() {
    angular.element($('.shown-text-edit').addClass('hyphenate'));
    $('#selectId').removeAttr('disabled');
    angular.element($('.shown-text-edit').removeAttr('style'));
  };

  $scope.mettreParDefaut = function(param) {
    $scope.defaultVar = {
      userID: param.owner,
      profilID: param._id,
      defaultVar: true
    };
    param.defautMark = true;
    param.defaut = true;
    $scope.token.addedDefaultProfile = $scope.defaultVar;
    $http.post(configuration.URL_REQUEST + '/setDefaultProfile', $scope.token)
      .success(function(data) {
        $scope.defaultVarFlag = data;
        $('#defaultProfile').fadeIn('fast').delay(5000).fadeOut('fast');
        $('.action_btn').attr('data-shown', 'false');
        $('.action_list').attr('style', 'display:none');
        if ($scope.testEnv === false) {
          $scope.afficherProfilsParUser();
        }
      });
  };

  $scope.retirerParDefaut = function(param) {
    $scope.defaultVar = {
      userID: param.owner,
      profilID: param._id,
      defaultVar: false
    };

    if ($scope.token && $scope.token.id) {
      $scope.token.cancelFavs = $scope.defaultVar;
    } else {
      $scope.token.id = localStorage.getItem('compteId');
      $scope.token.cancelFavs = $scope.defaultVar;
    }

    $http.post(configuration.URL_REQUEST + '/cancelDefaultProfile', $scope.token)
      .success(function(data) {
        $scope.cancelDefaultProfileFlag = data;
        $('#defaultProfileCancel').fadeIn('fast').delay(5000).fadeOut('fast');
        $('.action_btn').attr('data-shown', 'false');
        $('.action_list').attr('style', 'display:none');
        if ($scope.testEnv === false) {
          $scope.afficherProfilsParUser();
        }
      });
  };

  $scope.isDefault = function(param) {
    if (param && param.stateDefault) {
      return true;
    }
    return false;
  };

  $scope.isDelegated = function(param) {
    if (param && param.state === 'delegated') {
      return true;
    }
    return false;
  };

  $scope.isFavourite = function(param) {
    if (param && (param.state === 'favoris' || param.state === 'default')) {
      return true;
    }
    return false;
  };

  $scope.isProfil = function(param) {
    if (param && param.showed) {
      if (param.type === 'profile') {
        return true;
      }
    }
    return false;
  };

  $scope.isOwnerDelagate = function(param) {
    if (param && param.delegated && param.owner === $rootScope.currentUser._id) {
      return true;
    }
    return false;
  };

  $scope.isAnnuleDelagate = function(param) {
    if (param && param.preDelegated && param.owner === $rootScope.currentUser._id) {
      return true;
    }
    return false;
  };

  $scope.isDelegatedOption = function(param) {
    if (param && !param.delegated && !param.preDelegated && param.owner === $rootScope.currentUser._id) {
      return true;
    }
    return false;
  };

  $scope.isDeletableIHM = function(param) {
    if (param.owner === $rootScope.currentUser._id) {
      return true;
    }
    return false;
  };

  $scope.toViewProfil = function(param) {
    $location.search('idProfil', param._id).path('/detailProfil').$$absUrl; // jshint
                                                                            // ignore:line
  };

  $scope.preRemoveFavourite = function(param) {
    $scope.profilId = param._id;
  };

  $scope.removeFavourite = function() {
    $scope.sendVar = {
      profilID: $scope.profilId,
      userID: $rootScope.currentUser._id,
      favoris: true
    };

    if ($scope.token && $scope.token.id) {
      $scope.token.favProfile = $scope.sendVar;
    } else {
      $scope.token.id = localStorage.getItem('compteId');
      $scope.token.favProfile = $scope.sendVar;
    }
    $http.post(configuration.URL_REQUEST + '/removeUserProfileFavoris', $scope.token)
      .success(function(data) {
        $scope.removeUserProfileFavorisFlag = data;
        localStorage.removeItem('profilActuel');
        localStorage.removeItem('listTagsByProfil');
        $rootScope.$broadcast('initProfil');
        if ($scope.testEnv === false) {
          $scope.afficherProfilsParUser();
        }

      });

  };

  /* envoi de l'email lors de la dupliquation */
  $scope.sendEmailDuplique = function() {
    $http.post(configuration.URL_REQUEST + '/findUserById', {
      idUser: $scope.oldProfil.owner
    }).success(function(data) {
      $scope.findUserByIdFlag = data;
      if (data && data.local) {
        var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
        $scope.sendVar = {
          emailTo: data.local.email,
          content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour dupliquer votre profil : ' + $scope.oldProfil.nom + '. </span>',
          subject: fullName + ' a dupliqué votre profil'
        };
        $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
          .success(function() {});
      }
    }).error(function() {
      console.log('erreur lors de lenvoie du mail dupliquer');
    });
  };

  // preDupliquer le profil favori
  $scope.preDupliquerProfilFavorit = function(profil) {
    $scope.actionType = 'duplicate';
    if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
      $scope.profMod = {};
      $scope.profMod._id = profil._id;
      $scope.profMod.nom = profil.nom;
      $scope.profMod.descriptif = profil.descriptif;
      $scope.profMod.owner = profil.owner;
      $scope.profMod.photo = profil.photo;
    } else {
      $scope.profMod = profil;
    }

    $scope.oldProfil = {
      nom: $scope.profMod.nom,
      owner: $scope.profMod.owner
    };

    $scope.profMod.nom = $scope.profMod.nom + ' Copie';
    $scope.profMod.descriptif = $scope.profMod.descriptif + ' Copie';
    $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
        idProfil: profil._id
      })
      .success(function(data) {
        $scope.tagStylesFlag = data;
        /* Unit tests */
        $scope.tagStyles = data;
        /*
         * $scope.tagStyles.forEach(function(item) { item.state = true; });
         */
        $scope.afficherTags();
      });
  };

  // OnchangeStyle du profil
  $scope.dupliqueStyleChange = function(operation, value) {
    $rootScope.$emit('reglesStyleChange', {
      'operation': operation,
      'element': 'shown-text-duplique',
      'value': value
    });
  };

  // Dupliquer les tags du profil
  $scope.dupliqueProfilTag = function() {
    if (!$scope.token || !$scope.token.id) {
      $scope.token = {
        id: localStorage.getItem('compteId')
      };
    }

    var tagsToDupl = [];
    $scope.tagStyles.forEach(function(item) {
      // if (item.state) {
      var profilTag = {
        id_tag: item.tag,
        style: item.texte,
        police: item.police,
        taille: item.taille,
        interligne: item.interligne,
        styleValue: item.styleValue,
        coloration: item.coloration,
        spaceSelected: item.spaceSelected,
        spaceCharSelected: item.spaceCharSelected

      };
      tagsToDupl.push(profilTag);
      // }
    });
    for (var i = 0; i < tagsToDupl.length; i++) {
      for (var k = $scope.tagStylesToDelete.length - 1; k >= 0; k--) {
        if (tagsToDupl[i].id === $scope.tagStylesToDelete[k]._id) {
          tagsToDupl.splice(i, 1);
        }
      }

    }

    if (tagsToDupl.length > 0) {
      $http.post(configuration.URL_REQUEST + '/ajouterProfilTag', {
          id: $scope.token.id,
          profilID: $scope.profMod._id,
          profilTags: JSON.stringify(tagsToDupl)
        })
        .success(function(data) {
          $scope.editionFlag = data;
          /* unit tests */
          $scope.loader = false;
          $scope.loaderMsg = '';

          if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
            $scope.initDetailProfil();
          } else {
            $scope.afficherProfilsParUser();
          }
          $scope.tagStyles.length = 0;
          $scope.tagStyles = [];
          $scope.tagList = {};
          $scope.policeList = null;
          $scope.tailleList = null;
          $scope.interligneList = null;
          $scope.weightList = null;
          $scope.listeProfils = {};
          $scope.editTag = null;
          $scope.colorList = null;
          $scope.spaceSelected = null;
          $scope.spaceCharSelected = null;

          $('.shown-text-edit').text($scope.displayTextSimple);
          $('.shown-text-edit').css('font-family', '');
          $('.shown-text-edit').css('font-size', '');
          $('.shown-text-edit').css('line-height', '');
          $('.shown-text-edit').css('font-weight', '');
          $('.shown-text-add').css('word-spacing', '0em');
          $('.shown-text-add').css('letter-spacing', '0em');
        }).error(function() {
          console.log('dupliqueProfilTag');
        });
    }
  };

  // Dupliquer le profil
  $scope.dupliquerFavoritProfil = function() {
    $scope.addFieldError = [];
    if ($scope.profMod.nom == null) { // jshint ignore:line
      $scope.addFieldError.push(' Nom ');
      $scope.affichage = true;
    }
    if ($scope.profMod.descriptif == null) { // jshint ignore:line
      $scope.addFieldError.push(' Descriptif ');
      $scope.affichage = true;
    }
    if ($scope.addFieldError.length === 0) { // jshint ignore:line
      $scope.loader = true;
      $scope.loaderMsg = 'Duplication du profil en cours ...';
      $('.dupliqueProfil').attr('data-dismiss', 'modal');
      var newProfile = {};
      newProfile.photo = './files/profilImage/profilImage.jpg';
      newProfile.owner = $rootScope.currentUser._id; // $rootScope.currentUser._id;
      newProfile.nom = $scope.profMod.nom;
      newProfile.descriptif = $scope.profMod.descriptif;
      if (!$scope.token || !$scope.token.id) {
        $scope.token = {
          id: localStorage.getItem('compteId')
        };
      }
      $scope.token.newProfile = newProfile;
      $http.post(configuration.URL_REQUEST + '/ajouterProfils', $scope.token)
        .success(function(data) {
          $scope.sendEmailDuplique();
          $scope.profilFlag = data;
          /* unit tests */
          $scope.profMod._id = $scope.profilFlag._id;
          $rootScope.updateListProfile = !$rootScope.updateListProfile;
          $scope.dupliqueProfilTag();
          $('.dupliqueProfil').removeAttr('data-dismiss');
          $scope.affichage = false;
          $scope.tagStyles = [];

        }).error(function() {
          console.log('3-2');
        });
    }
  };

  $scope.dupliqueModifierTag = function(parameter) {
    $scope.hideVar = false;
    $('.label_action').removeClass('selected_label');
    $('#' + parameter._id).addClass('selected_label');
    $scope.currentTagProfil = parameter;
    for (var i = $scope.listTags.length - 1; i >= 0; i--) {
      if (parameter.tag === $scope.listTags[i]._id) {
        $scope.listTags[i].disabled = true;
        angular.element($('#selectIdDuplisuer option').each(function() {
          var itemText = $(this).text();
          if (itemText === parameter.tagLibelle) {
            $(this).prop('selected', true);
            $('#selectIdDuplisuer').prop('disabled', 'disabled');
            $('#dupliqueValidationButton').prop('disabled', false);
          }
        }));
        $('#dupliqueValidationButton').prop('disabled', false);
        $scope.editTag = parameter.tagLibelle;
        $scope.policeList = parameter.police;
        $scope.tailleList = parameter.taille;
        $scope.interligneList = parameter.interligne;
        $scope.weightList = parameter.styleValue;
        $scope.colorList = parameter.coloration;
        $scope.spaceSelected = parameter.spaceSelected;
        $scope.spaceCharSelected = parameter.spaceCharSelected;

        $scope.dupliqueStyleChange('police', $scope.policeList);
        $scope.dupliqueStyleChange('taille', $scope.tailleList);
        $scope.dupliqueStyleChange('interligne', $scope.interligneList);
        $scope.dupliqueStyleChange('style', $scope.weightList);
        $scope.dupliqueStyleChange('coloration', $scope.colorList);
        $scope.dupliqueStyleChange('space', $scope.spaceSelected);
        $scope.dupliqueStyleChange('spaceChar', $scope.spaceCharSelected);

        /* Selection de la pop-up de la duplication */
        var dupliqModal = $('#dupliqueFavoritModal, #dupliqueModal');

        // set span text value of customselect
        $(dupliqModal).find('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text(parameter.tagLibelle);
        $(dupliqModal).find('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text(parameter.police);
        $(dupliqModal).find('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text(parameter.taille);
        $(dupliqModal).find('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text(parameter.interligne);
        $(dupliqModal).find('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text(parameter.styleValue);
        $(dupliqModal).find('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text(parameter.coloration);
        $(dupliqModal).find('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text(parameter.spaceSelected);
        $(dupliqModal).find('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text(parameter.spaceCharSelected);

      }
    }
  };

  $scope.preDeleguerProfil = function(profil) {
      if(!$rootScope.isAppOnline){
          $scope.delegationInfoDeconnecte();
      }else{
          $('#delegateModal').modal('show');
          $scope.profDelegue = profil;
          $scope.errorMsg = '';
          $scope.successMsg = '';
          $scope.delegateEmail = '';
      }
  };

  $scope.deleguerProfil = function() {
    $scope.errorMsg = '';
    $scope.successMsg = '';
    if (!$scope.delegateEmail || $scope.delegateEmail.length <= 0) {
      $scope.errorMsg = 'L\'email est obligatoire !';
      return;
    }
    if (!verifyEmail($scope.delegateEmail)) {
      $scope.errorMsg = 'L\'email est invalide !';
      return;
    }
    $http.post(configuration.URL_REQUEST + '/findUserByEmail', {
        email: $scope.delegateEmail
      })
      .success(function(data) {
        if (data) {
          $scope.findUserByEmailFlag = data;
          var emailTo = data.local.email;

          if (emailTo === $rootScope.currentUser.local.email) {
            $scope.errorMsg = 'Vous ne pouvez pas déléguer votre profil à vous même !';
            return;
          }

          $('#delegateModal').modal('hide');

          var sendParam = {
            idProfil: $scope.profDelegue._id,
            idDelegue: data._id
          };
          $http.post(configuration.URL_REQUEST + '/delegateProfil', sendParam)
            .success(function() {
              var profilLink = $location.absUrl();
              profilLink = profilLink.replace('#/profiles', '#/detailProfil?idProfil=' + $scope.profDelegue._id);
              var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
              $scope.sendVar = {
                emailTo: emailTo,
                content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour vous déléguer son profil : <a href=' + profilLink + '>' + $scope.profDelegue.nom + '</a>. </span>',
                subject: 'Profil délégué'
              };
              $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
                .success(function() {
                  $('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
                  $scope.msgSuccess = 'La demande est envoyée avec succés.';
                  $scope.errorMsg = '';
                  $scope.delegateEmail = '';
                  $scope.afficherProfilsParUser();
                }).error(function() {
                  $('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
                  $scope.msgError = 'Erreur lors de l\'envoi de la demande.';
                });
            });
        } else {
          $scope.errorMsg = 'L\'email est introuvable !';
        }
      });
  };

  $scope.preRetirerDeleguerProfil = function(profil) {
    $scope.profRetirDelegue = profil;
  };

  $scope.retireDeleguerProfil = function() {
    var sendParam = {
      id: $rootScope.currentUser.local.token,
      sendedVars: {
        idProfil: $scope.profRetirDelegue._id,
        idUser: $rootScope.currentUser._id
      }
    };
    $http.post(configuration.URL_REQUEST + '/retirerDelegateUserProfil', sendParam)
      .success(function(data) {
        if (data) {
          $scope.retirerDelegateUserProfilFlag = data;
          $http.post(configuration.URL_REQUEST + '/findUserById', {
              idUser: data.delegatedID
            })
            .success(function(data) {
              if (data) {
                $scope.findUserByIdFlag2 = data;
                var emailTo = data.local.email;
                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                $scope.sendVar = {
                  emailTo: emailTo,
                  content: '<span> ' + fullName + ' vient de vous retirer la délégation de son profil : ' + $scope.profRetirDelegue.nom + '. </span>',
                  subject: 'Retirer la délégation'
                };
                $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
                  .success(function() {
                    $('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
                    $scope.msgSuccess = 'La demande est envoyée avec succés.';
                    $scope.errorMsg = '';
                    $scope.afficherProfilsParUser();
                  }).error(function() {
                    $('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
                    $scope.msgError = 'Erreur lors de l\'envoi de la demande.';
                  });
              }
            });
        }
      });
  };

  $scope.preAnnulerDeleguerProfil = function(profil) {
    $scope.profAnnuleDelegue = profil;
  };

  $scope.annuleDeleguerProfil = function() {
    var sendParam = {
      id: $rootScope.currentUser.local.token,
      sendedVars: {
        idProfil: $scope.profAnnuleDelegue._id,
        idUser: $rootScope.currentUser._id
      }
    };
    $http.post(configuration.URL_REQUEST + '/annulerDelegateUserProfil', sendParam)
      .success(function(data) {
        // $rootScope.updateListProfile = !$rootScope.updateListProfile;
        if (data) {
          $scope.annulerDelegateUserProfilFlag = data;
          $http.post(configuration.URL_REQUEST + '/findUserById', {
              idUser: $scope.profAnnuleDelegue.preDelegated
            })
            .success(function(data) {
              if (data) {
                $scope.findUserByIdFlag2 = data;
                var emailTo = data.local.email;
                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                $scope.sendVar = {
                  emailTo: emailTo,
                  content: '<span> ' + fullName + ' vient d\'annuler la demande de délégation de son profil : ' + $scope.profAnnuleDelegue.nom + '. </span>',
                  subject: 'Annuler la délégation'
                };
                $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
                  .success(function() {
                    $('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
                    $scope.msgSuccess = 'La demande est envoyée avec succés.';
                    $scope.errorMsg = '';
                    $scope.afficherProfilsParUser();
                  }).error(function() {
                    $('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
                    $scope.msgError = 'Erreur lors de l\'envoi de la demande.';
                  });
              }
            });
        }
      });
  };


  $scope.profilApartager = function(param) {
      if(!$rootScope.isAppOnline){
          $scope.partageInfoDeconnecte();
      }else{
            $('#shareModal').modal('show');
            $scope.profilPartage = param;
            $scope.currentUrl = $location.absUrl();
            $scope.socialShare();
      }
  };

  /* load email form */
  $scope.loadMail = function() {
    $scope.displayDestination = true;
  };

  $scope.clearSocialShare = function() {
    $scope.displayDestination = false;
    $scope.destinataire = '';
  };

  $scope.attachFacebook = function() {
    console.log(decodeURIComponent($scope.encodeURI));
    $('.facebook-share .fb-share-button').remove();
    $('.facebook-share span').before('<div class="fb-share-button" data-href="' + decodeURIComponent($scope.envoiUrl) + '" data-layout="button"></div>');
    try {
      FB.XFBML.parse();
    } catch (ex) {
      console.log('gotchaa ... ');
      console.log(ex);
    }
  };

  $scope.attachGoogle = function() {
    console.log('IN ==> ');
    var options = {
      contenturl: decodeURIComponent($scope.envoiUrl),
      contentdeeplinkid:'/pages',
      clientid: '807929328516-g7k70elo10dpf4jt37uh705g70vhjsej.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      prefilltext: '',
      calltoactionlabel: 'LEARN_MORE',
      calltoactionurl: decodeURIComponent($scope.envoiUrl),
      callback: function(result) {
        console.log(result);
        console.log('this is the callback');
      },
      onshare: function(response){
        console.log(response);
        if(response.status === 'started'){
          $scope.googleShareStatus++;
          if($scope.googleShareStatus > 1){
            $('#googleShareboxIframeDiv').remove();
            // alert('some error in sharing');
            $('#shareModal').modal('hide');
            $('#informationModal').modal('show');
            localStorage.setItem('googleShareLink',$scope.envoiUrl);
          }
        }else{
          localStorage.removeItem('googleShareLink');
          $scope.googleShareStatus = 0;
          $('#shareModal').modal('hide');
        }

        // These are the objects returned by the platform
        // When the sharing starts...
        // Object {status: "started"}
        // When sharing ends...
        // Object {action: "shared", post_id: "xxx", status: "completed"}
      }
    };

    gapi.interactivepost.render('google-share', options);
  };

  $scope.socialShare = function() {
    $scope.destination = $scope.destinataire;
    $scope.encodeURI = encodeURIComponent($location.absUrl());
    $scope.currentUrl = $location.absUrl();
    if ($scope.currentUrl.lastIndexOf('detailProfil') > -1) {
      $scope.envoiUrl = encodeURIComponent($scope.currentUrl);
      $scope.attachFacebook();
      $scope.attachGoogle();
    } else {
      $scope.envoiUrl = encodeURIComponent($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
      $scope.attachFacebook();
      $scope.attachGoogle();
    }
    if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
      $('#confirmModal').modal('show');
      $('#shareModal').modal('hide');
    }
  };

  /* regex email */
  $scope.verifyEmail = function(email) {
    var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (reg.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  /* envoi de l'email au destinataire */
  $scope.sendMail = function() {
    $('#confirmModal').modal('hide');
    $scope.loaderMsg = 'Partage du profil en cours. Veuillez patienter ..';
    $scope.currentUrl = $location.absUrl();
    if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
      $scope.envoiUrl = decodeURI($scope.currentUrl);
    } else {
      $scope.envoiUrl = decodeURI($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
    }
    $scope.destination = $scope.destinataire;
    $scope.loader = true;
    if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
      if ($location.absUrl()) {
        if ($rootScope.currentUser.dropbox.accessToken) {
          if (configuration.DROPBOX_TYPE) {
            if ($rootScope.currentUser) {
              $scope.sendVar = {
                to: $scope.destinataire,
                content: ' vient de partager avec vous un profil sur l\'application CnedAdapt.  ' + $scope.envoiUrl,
                encoded: '<span> vient de partager avec vous un profil sur l\'application CnedAdapt.   <a href=' + $scope.envoiUrl + '>Lien de ce profil</a> </span>',
                prenom: $rootScope.currentUser.local.prenom,
                fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
                doc: $scope.envoiUrl
              };
              $http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
                .success(function(data) {
                  $('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
                  $scope.sent = data;
                  $scope.envoiMailOk = true;
                  $scope.destinataire = '';
                  $scope.loader = false;
                  $scope.displayDestination = false;
                  $scope.loaderMsg = '';
                });
            }
          }
        }
      }
    } else {
      $('.sendingMail').removeAttr('data-dismiss', 'modal');
      $('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');
    }
  };

  $scope.specificFilter = function() {
    // parcours des Profiles
    for (var i = 0; i < $scope.tests.length; i++) {
      if ($scope.tests[i].type === 'profile') {
        if ($scope.tests[i].nom.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1 || $scope.tests[i].descriptif.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1) {
          // Query Found
          $scope.tests[i].showed = true;
          $scope.tests[i + 1].showed = true;
        } else {
          // Query not Found
          $scope.tests[i].showed = false;
          $scope.tests[i + 1].showed = false;
        }
      }
    }
  };


  /** **** Debut Detail Profil ***** */
  /*
     * Afficher la liste des tags triés avec gestion des niveaux.
     */
  $scope.showTags = function() {
    if ($scope.listTags && $scope.listTags.length > 0) {
      /* Récuperer la position de listTags dans tagsByProfils */
      for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
        for (var j = $scope.listTags.length - 1; j >= 0; j--) {
          if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
            $scope.tagsByProfils[i].position = $scope.listTags[j].position;
          }
        }
      }
      /* Trier tagsByProfils avec position */
      $scope.tagsByProfils.sort(function(a, b) {
        return a.position - b.position;
      });
      var nivTag = 0;
      var nivTagTmp = 0;
      for (var i = 0; i < $scope.tagsByProfils.length; i++) { // jshint
                                                                // ignore:line
        nivTagTmp = nivTag;
        for (var j = 0; j < $scope.listTags.length; j++) { // jshint
                                                            // ignore:line
          if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
            var tmpText = {};
            var fontstyle = 'Normal';
            if ($scope.tagsByProfils[i].styleValue === 'Gras') {
              fontstyle = 'Bold';
            }

            /* Si le tag contient un niveau strictement positif */
            if ($scope.listTags[j].niveau && parseInt($scope.listTags[j].niveau) > 0) {
              nivTag = parseInt($scope.listTags[j].niveau);
              nivTagTmp = nivTag;
              nivTag++;
            }

            if (nivTagTmp === 0) {
              $scope.regles[i] = {niveau: 0};
            } else {
              var calculatedNiveau = (nivTagTmp - 1) * 30;
              $scope.regles[i] = {niveau : calculatedNiveau};
            }

            var calculatedWidth = 1055 - $scope.regles[i].niveau;

            $scope.regles[i].profStyle = {
              'width': calculatedWidth
            };

            // Transformation propre à l'application
            var style='font-family: ' + $scope.tagsByProfils[i].police + ';' +
            'font-size: ' + (1 + ($scope.tagsByProfils[i].taille - 1) * 0.18) + 'em; ' +
            'line-height: ' + (1.286 + ($scope.tagsByProfils[i].interligne - 1) * 0.18) + 'em;' +
            'font-weight: ' + fontstyle + ';  ' +
            'word-spacing: ' + (0 + ($scope.tagsByProfils[i].spaceSelected - 1) * 0.18) + 'em;' +
            'letter-spacing: ' + (0 + ($scope.tagsByProfils[i].spaceCharSelected - 1) * 0.12) + 'em;';

            if($scope.listTags[j].balise !== 'div') {
              var texteTag = '<'+$scope.listTags[j].balise+' style="' + style+'" data-margin-left="' + nivTag + '" >' + $scope.listTags[j].libelle;
            } else {
              var texteTag = '<'+$scope.listTags[j].balise+' style="' + style+'" data-margin-left="' + nivTag + '" class="'+$scope.listTags[j].libelle.replace(/ /g,'')+'"><span style="color:#000">' + $scope.listTags[j].libelle;
            }
            if ($scope.listTags[j].libelle.toUpperCase().match('^TITRE')) {
              texteTag += ' : Ceci est un exemple de ' + $scope.listTags[j].libelle + ' </'+$scope.listTags[i].balise+'>';
            } else {
              texteTag += ' : CnedAdapt est une application qui permet d\'adapter les documents. </'+$scope.listTags[j].balise+'>';
            }

            $scope.regles[i].texte = texteTag;
            break;
          }
        }
      }
    }
  };

  /*
     * Gérer les buttons d'action dans le détail du profil.
     */
  $scope.showProfilAndTags = function() {
    $scope.target = $location.search()['idProfil']; // jshint ignore:line
    /* Récuperer le profil et le userProfil courant */
    profilsService.getUserProfil($scope.target).then(function(data) {
        $scope.detailProfil = data;
        if ($rootScope.currentUser) {
          $scope.showPartager = true;
          /* Non propriétaire du profil */
          if ($rootScope.currentUser._id !== $scope.detailProfil.owner) {
            $scope.showDupliquer = true;
          }
          /* Propriétaire du profil */
          if ($rootScope.currentUser._id === $scope.detailProfil.owner && !$scope.detailProfil.delegated) {
            $scope.showEditer = true;
          }
          /* Propriétaire du profil ou profil délégué ou profil par defaut */
          if ($rootScope.currentUser._id === $scope.detailProfil.owner || $scope.detailProfil.delegated || $scope.detailProfil.default || $scope.detailProfil.preDelegated) {
            $scope.showFavouri = false;
          } else {
              $scope.showFavouri = !$scope.detailProfil.favoris; 
          }
          /* profil délégué à l'utlisateur connecté */
          if ($scope.detailProfil.preDelegated && $rootScope.currentUser._id === $scope.detailProfil.preDelegated) {
            $scope.showDeleguer = true;
          }
        }
        
        profilsService.getProfilTags($scope.detailProfil.profilID).then(function(data) {
            $scope.tagsByProfils = data;
            $scope.regles = [];
            
            if (localStorage.getItem('listTags')) {
              $scope.listTags = JSON.parse(localStorage.getItem('listTags'));
              $scope.showTags();
            } else {
              var requestToSend = {};
              if (localStorage.getItem('compteId')) {
                requestToSend = {
                  id: localStorage.getItem('compteId')
                };
              }
              $http.get(configuration.URL_REQUEST + '/readTags', {
                params: requestToSend
              }).success(function(data) {
                localStorage.setItem('listTags', JSON.stringify(data));
                $scope.listTags = JSON.parse(localStorage.getItem('listTags'));
                $scope.showTags();
              });
            }
        });
      });
  };

  /*
     * Initialiser le detail du profil.
     */
  $scope.initDetailProfil = function() {
    $scope.showDupliquer = false;
    $scope.showEditer = false;
    $scope.showFavouri = true;
    $scope.showDeleguer = false;
    $scope.showPartager = false;


    if(localStorage.getItem('googleShareLink')){
      // $scope.docApartager = {lienApercu:
        // localStorage.getItem('googleShareLink')}
      $scope.envoiUrl = localStorage.getItem('googleShareLink');
      $scope.attachFacebook();
      $scope.attachGoogle();
      $('#shareModal').modal('show');
      localStorage.removeItem('googleShareLink');
    }

    var dataProfile = {};
    if (localStorage.getItem('compteId')) {
      dataProfile = {
        id: localStorage.getItem('compteId')
      };
    }
    var random = Math.random()*10000;
    $http.get(configuration.URL_REQUEST + '/profile', {
        params: dataProfile
      })
      .success(function(result) {
        /* Authentifié */
        $rootScope.currentUser = result;
        $scope.showProfilAndTags();
      }).error(function() {
        /* Non authentifié */
        $scope.showFavouri = false;
        $scope.showProfilAndTags();
      });
  };

  /*
     * Ajouter un profil à ses favoris.
     */
  $scope.ajouterAmesFavoris = function() {
    if ($rootScope.currentUser && $scope.detailProfil) {
      var token = {
        id: $rootScope.currentUser.local.token,
        newFav: {
          userID: $rootScope.currentUser._id,
          profilID: $scope.detailProfil.profilID,
          favoris: true,
          actuel: false,
          default: false
        }
      };
      $http.post(configuration.URL_REQUEST + '/addUserProfilFavoris', token).success(function(data) {
        $scope.favourite = data;
        $scope.showFavouri = false;
        $('#favoris').fadeIn('fast').delay(5000).fadeOut('fast');
        $rootScope.$broadcast('initCommon');
      });
    }
  };

  /*
     * Accepter la délégation d'un profil.
     */
  $scope.deleguerUserProfil = function() {
    $scope.loader = true;
    $scope.varToSend = {
      profilID: $scope.detailProfil.profilID,
      userID: $scope.detailProfil.owner,
      delegatedID: $rootScope.currentUser._id
    };
    var tmpToSend = {
      id: $rootScope.currentUser.local.token,
      sendedVars: $scope.varToSend
    };
    $http.post(configuration.URL_REQUEST + '/delegateUserProfil', tmpToSend)
      .success(function(data) {
        $scope.delegateUserProfilFlag = data;

        $http.post(configuration.URL_REQUEST + '/findUserById', {
            idUser: $scope.detailProfil.owner
          })
          .success(function(data) {
            if (data) {
              var emailTo = data.local.email;
              var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
              $scope.sendVar = {
                emailTo: emailTo,
                content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour accepter la délégation de votre profil : ' + $scope.detailProfil.nom + '. </span>',
                subject: 'Confirmer la délégation'
              };
              $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
                .success(function() {
                  $scope.loader = false;
                  $rootScope.updateListProfile = !$rootScope.updateListProfile;
                  var profilLink = $location.absUrl();
                  profilLink = profilLink.substring(0, profilLink.lastIndexOf('#/detailProfil?idProfil'));
                  profilLink = profilLink + '#/profiles';
                  $window.location.href = profilLink;
                });
            }
          });
      });
  };

  $scope.detailsProfilApartager = function() {
      if(!$rootScope.isAppOnline){
          $scope.partageInfoDeconnecte();
      }else{
            $('#shareModal').modal('show');
            $scope.socialShare();
      }
  };
  
  

  /** **** Fin Detail Profil ***** */

});
