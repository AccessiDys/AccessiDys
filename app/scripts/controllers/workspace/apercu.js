/* File: apercu.js
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

/*jshint loopfunc:true*/
/*global $:false, blocks, ownerId */

'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $rootScope, $http, $window, $location, serviceCheck, configuration, dropbox, removeHtmlTags, verifyEmail, generateUniqueId, storageService) {


  $scope.data = [];
  $scope.blocksAlternative = [];
  $scope.plans = [];
  $scope.showApercu = 'hidden';
  $scope.showPlan = 'visible';
  $scope.counterElements = 0;
  $scope.styleParagraphe = '';
  $scope.loader = false;
  $scope.showDuplDocModal = false;
  $scope.showRestDocModal = false;
  $scope.showDestination = false;
  $scope.showEmail = false;
  $scope.emailMsgSuccess = '';
  $scope.emailMsgError = '';
  $scope.escapeTest = true;
  $scope.showPartagerModal = true;
  $scope.isEnableNoteAdd = false;
  // $scope.volume = 0.5;
  var numNiveau = 0;
  $rootScope.restructedBlocks = null;
  $scope.printPlan = true;

  $('#main_header').show();
  $('#titreDocument').hide();
  $('#detailProfil').hide();
  $('#titreTag').hide();
  $scope.testEnv = false;
  $scope.pasteNote = false;
  $scope.annotationOk = false;
  $scope.addAnnotation = false;
  var apercuPopulated = false;
  $rootScope.showSecondeloader = false;
  /*
   * Mette à jour le dernier document affiché.
   */
  if ($location.absUrl()) {
    localStorage.setItem('lastDocument', $location.absUrl());
    $scope.encodeURI = encodeURIComponent($location.absUrl());
  }

  if (localStorage.getItem('reloadRequired')) {
    storageService.removeService(['reloadRequired'], 0).then(function() {
      if($scope.testEnv == false){
        window.location.reload();
      }

    });
  }

  $scope.requestToSend = {};
  if (localStorage.getItem('compteId')) {
    $scope.requestToSend = {
      id: localStorage.getItem('compteId')
    };
  }
  $rootScope.$on('UpgradeProcess', function() {
    if (!$rootScope.showSecondeloader) {
      $rootScope.showSecondeloader = true;
      var dateNow = new Date();
      console.log(dateNow.getFullYear() + '/' + dateNow.getMonth() + '/' + dateNow.getDate() + ' - ' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + dateNow.getSeconds() + ':' + dateNow.getMilliseconds());
      $scope.loader = true;
      $scope.loaderMsg = 'Veuillez patienter ...';
      $scope.init();
    }
  });

  /*
   * Afficher le titre du document.
   */
  $scope.showTitleDoc = function() {
    var docUrl = decodeURI($location.absUrl());
    docUrl = docUrl.replace('#/apercu', '');
    $rootScope.titreDoc = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
    var docName = decodeURI(docUrl.substring(docUrl.lastIndexOf('/') + 1, docUrl.lastIndexOf('.html')));
    $scope.docSignature = decodeURIComponent(/((\d+)(-)(\d+)(-)(\d+)(_+)([A-Za-z0-9_%]*)(_+)([A-Za-z0-9_%]*))/i.exec(encodeURIComponent(docName))[0]);
    $('#titreDocumentApercu').show();
  };
  $scope.showTitleDoc();

  /*
   * Initialiser le style de la règle NORMAL.
   */

  function initStyleNormal() {

    for (var i = 0; i < $scope.tags.length; i++) {
      if ($scope.tags[i].libelle === 'Paragraphe') {
        for (var j = 0; j < $scope.profiltags.length; j++) {
          if ($scope.profiltags[j] && $scope.profiltags[j].tag === $scope.tags[i]._id) {
            var style = $scope.profiltags[j].texte;
            $scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
            break;
          }
        }

      }
    }

  }

  /*
   * Préparer les données à afficher dans l'apercu.
   */
  $scope.populateApercu = function() {
    if (blocks && blocks.children.length > 0 && apercuPopulated === false) {
      // console.log('in Populate Aperçu ... ');
      // console.log(apercuPopulated);
      apercuPopulated = true;

      /* Selection des tags par profil de localStorage */
      $scope.profiltags = JSON.parse(localStorage.getItem('listTagsByProfil'));
      /* Selection des tags de localStorage */
      $scope.tags = JSON.parse(localStorage.getItem('listTags'));
      /* Selection des blocks de la page applicative */
      var blocksArray = angular.fromJson(blocks);
      $scope.blocksPlan = [];
      $scope.blocksPlan[0] = [];
      $scope.blocksPlan[0][0] = [];
      $scope.idx2 = [];
      $scope.plans = [];

      /* Initialiser le style des annotations */
      initStyleAnnotation();

      for (var i = 0; i < blocksArray.children.length; i++) {
        $scope.blocksPlan[i + 1] = [];
        $scope.idx2[i + 1] = 0;
        blocksArray.children[i].root = true;
        /* Parcourir chaque Root */
        traverseRoot(blocksArray.children[i], i);
        /* Parcourir les Childrens de chaque Root */
        traverseLeaf(blocksArray.children[i].children, i);
      }

      /* Cas du style de la règle NORMAL non traitée */
      if ($scope.styleParagraphe.length <= 0) {
        initStyleNormal();
      }

      /* Affecter le style de la règle NORMAL aux lignes du plan */
      $scope.plans.forEach(function(entry) {
        entry.style = '<p ' + $scope.styleParagraphe + '> ' + entry.libelle + ' </p>';
      });

      /* Construire la liste des pages à imprimer */
      $scope.pagePrints = [];
      for (var k = 0; k < $scope.blocksPlan.length - 1; k++) {
        $scope.pagePrints.push(k + 1);
      }

    }
  };

  /*
   * Récuperer le profil actuel et ses tags.
   */
  $scope.verifProfil = function() {
    $scope.sentVar = {
      userID: $rootScope.currentUser._id,
      actuel: true
    };
    $scope.token.getActualProfile = $scope.sentVar;
    $http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.token)
      .success(function(dataActuel) {
      $scope.varToSend = {
        profilID: dataActuel.profilID
      };
      localStorage.setItem('profilActuel', JSON.stringify(dataActuel));
      $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
        idProfil: dataActuel.profilID
      }).success(function(data) {
        localStorage.setItem('listTagsByProfil', JSON.stringify(data));
        $http.get(configuration.URL_REQUEST + '/readTags', {
          params: $scope.requestToSend
        }).success(function(data) {
          localStorage.setItem('listTags', JSON.stringify(data));
          $scope.populateApercu();
        });
      });
    });
  };

  /*
   * Chercher le profil par defaut et recupérer ses tags.
   */
  $scope.defaultProfile = function() {
    $http.post(configuration.URL_REQUEST + '/chercherProfilParDefaut')
      .success(function(data) {
      if (data) {
        $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
          idProfil: data.profilID
        }).success(function(data) {
          localStorage.setItem('listTagsByProfil', JSON.stringify(data));
          $http.get(configuration.URL_REQUEST + '/readTags', {
            params: $scope.requestToSend
          }).success(function(data) {
            localStorage.setItem('listTags', JSON.stringify(data));
            $scope.populateApercu();
          });
        });
      }
    });
  };

  $scope.applySharedAnnotation = function() {
    var annotationStart = $location.absUrl().indexOf('?annotation=') + 12;
    var annotationEnd = $location.absUrl().length;
    var urlAnnotation = $location.absUrl().substring(annotationStart, annotationEnd);
    $http.get('https://dl.dropboxusercontent.com/s/' + urlAnnotation + '.json')
      .success(function(data) {
      var annotationKey = $scope.annotationDummy;
      var noteList = {};

      if (!$scope.testEnv) {
        annotationKey = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec($location.absUrl())[0]);
      }
      if (localStorage.getItem('notes') !== null) {
        noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
        noteList[annotationKey] = data;
        localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
      } else {
        noteList = {};
        noteList[annotationKey] = data;
        localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
      }
      $('#AnnotationModal').modal('hide');

    });
  };
  /*
   * Fonction appelée au chargement de la vue.
   */
  $scope.init = function() {
    // update lastDoc
    $rootScope.$broadcast('updateLastDoc');

    if ($location.absUrl().indexOf('key=') > -1) {
      var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
      localStorage.setItem('compteId', callbackKey);
    }

    if ($location.absUrl().indexOf('?annotation=') > 0) {
      if (!$scope.testEnv) {
        /* $('#AnnotationModal').modal('show');*/
        var annotationStart = $location.absUrl().indexOf('?annotation=') + 12;
        var annotationEnd = $location.absUrl().length;
        var urlAnnotation = $location.absUrl().substring(annotationStart, annotationEnd);
        $http.get('https://dl.dropboxusercontent.com/s/' + urlAnnotation + '.json')
          .success(function(data) {
          var annotationKey = $scope.annotationDummy;
          var noteList = {};

          if (!$scope.testEnv) {
            annotationKey = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec($location.absUrl())[0]);
          }
          if (localStorage.getItem('notes') !== null) {
            noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
            noteList[annotationKey] = data;
            localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
          } else {
            noteList = {};
            noteList[annotationKey] = data;
            localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
          }
          /*$('#AnnotationModal').modal('hide');*/
        });
      }
    }
    if ($scope.testEnv === false) {
      $scope.browzerState = navigator.onLine;
    } else {
      $scope.browzerState = true;
    }

    /* Mode non connecté à internet */
    if (!$scope.browzerState) {
      $scope.showPartagerModal = false;
      if (localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
        $scope.populateApercu();
      }
      return;
    }

    /* Mode connecté à internet */
    if (!localStorage.getItem('compteId') && localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
      $scope.populateApercu();
      $rootScope.$broadcast('hideMenueParts');
    } else if (localStorage.getItem('compteId')) {
      var tmp = serviceCheck.getData();
      tmp.then(function(result) {
        /* Cas authentifié */
        if (result.loged) {
          $rootScope.currentUser = result.user;
          if (ownerId && ownerId !== $rootScope.currentUser._id) {
            $scope.newOwnerId = $rootScope.currentUser._id;
            $scope.showDuplDocModal = true;
            $('#duplicateDocModal').modal('show');
            var docUrl = decodeURI($location.absUrl());
            docUrl = docUrl.replace('#/apercu', '');
            $scope.duplDocTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
          }

          if ($rootScope.currentUser) {
            $scope.showEmail = true;
          }

          if (ownerId && ownerId === $rootScope.currentUser._id) {
            $scope.showRestDocModal = true;
          }

          $scope.token = {
            id: $rootScope.currentUser.local.token
          };

          /* listTagsByProfil et listTags se trouvent dans localStorage */
          if (localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
            $scope.populateApercu();
          } else {
            $scope.verifProfil();
          }

        } else {
          /* Cas non authentifié */
          $scope.defaultProfile();
        }

      });
    } else {
      $scope.defaultProfile();
      $rootScope.$broadcast('hideMenueParts');
    }
  };

  /*
   * Limiter le nombre des caractères affichés à 80.
   */

  function limitParagraphe(titre) {
    var taille = 0;
    var limite = 80;
    if (titre.length <= limite) {
      return titre;
    }
    for (var i = 0; i < titre.length; i++) {
      taille = taille + 1;
      if (taille >= limite) {
        break;
      }
    }
    return titre.substring(0, taille) + '...';
  }

  /*
   * Chercher le tag dans la liste des tags par idTag.
   */

  function getTagById(idTag) {
    for (var i = 0; i < $scope.tags.length; i++) {
      if (idTag === $scope.tags[i]._id) {
        return $scope.tags[i];
      }
    }
  }

  /*
   * Initialiser le style de la règle ANNOTATION.
   */

  function initStyleAnnotation() {
    for (var profiltag in $scope.profiltags) {
      var style = $scope.profiltags[profiltag].texte;
      var currentTag = getTagById($scope.profiltags[profiltag].tag);
      if (currentTag && currentTag.libelle.toUpperCase().match('^ANNOTATION')) {
        $scope.styleAnnotation = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
        break;
      }
    }
  }

  /*
   * Appliquer au block la règle de style correspondante.
   */

  function applyRegleStyle(block, idx1) {
    var counterElement = $scope.counterElements;
    var debutStyle = '<p id="' + counterElement + '" regle-style="" >';
    var finStyle = '</p>';
    var tagExist = false;
    var libelle = '';
    var numNiveauTmp = numNiveau;
    var isTitre = false;

    for (var profiltag in $scope.profiltags) {
      var style = $scope.profiltags[profiltag].texte;
      var currentTag = getTagById($scope.profiltags[profiltag].tag);

      if (currentTag) {
        libelle = currentTag.libelle; //$scope.profiltags[profiltag].tagName;
      } else {
        libelle = '';
      }

      /* Cas de la règle NORMAL */
      if (libelle.match('^Paragraphe')) {
        $scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
      }

      if (block.tag === $scope.profiltags[profiltag].tag) {
        debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + counterElement + '" regle-style="" >';
        /* Construire le décalage des lignes du plan */
        if (currentTag && currentTag.niveau && parseInt(currentTag.niveau) > 0) {
          numNiveau = parseInt(currentTag.niveau);
          numNiveauTmp = numNiveau;
          numNiveau++;
        }

        /* Cas de la règle TITRE */
        if (libelle.match('^Titre')) {
          libelle = block.text;
          isTitre = true;
        }
        tagExist = true;
        break;
      }
    }

    /* Selectionner le Tag s'il n'existe pas dans les profilsTags */
    if (!tagExist) {
      for (var i = 0; i < $scope.tags.length; i++) {
        if (block.tag === $scope.tags[i]._id) {
          libelle = $scope.tags[i].libelle;
          /* Construire le décalage des lignes du plan */
          if ($scope.tags[i].niveau && parseInt($scope.tags[i].niveau) > 0) {
            numNiveau = parseInt($scope.tags[i].niveau);
            numNiveauTmp = numNiveau;
            numNiveau++;
          }
          if (libelle.match('^Titre')) {
            libelle = block.text;
            isTitre = true;
          }
          break;
        }
      }
    }

    if (!isTitre) {
      libelle = removeHtmlTags(libelle) + ' : ' + limitParagraphe(removeHtmlTags(block.text)).replace(/\n/g, ' ');
    } else {
      libelle = removeHtmlTags(libelle);
    }

    if (block.tag && block.tag.length > 0) {
      var marginLeft = 0;
      if (parseInt(numNiveauTmp) > 1) {
        marginLeft = (parseInt(numNiveauTmp) - 1) * 30;
      }

      $scope.plans.push({
        libelle: libelle,
        block: block.id,
        position: idx1,
        numNiveau: numNiveauTmp,
        pixelsDecalage: marginLeft
      });
    }

    block.text = debutStyle + block.text + finStyle;

    return block;
  }

  /*
   * Parcourir les fils des blocks du document d'une facon recursive.
   */

  function traverseLeaf(obj, idx1) {
    for (var key in obj) {
      if (typeof(obj[key]) === 'object') {
        if (obj[key].text && obj[key].text.length > 0) {
          $scope.counterElements += 1;
          obj[key] = applyRegleStyle(obj[key], idx1);
        }
        $scope.idx2[idx1 + 1] = $scope.idx2[idx1 + 1] + 1;
        $scope.blocksPlan[idx1 + 1][$scope.idx2[idx1 + 1]] = obj[key];

        /* Parcourir recursivement si le block a des childrens */
        if (obj[key].children && obj[key].children.length > 0) {
          traverseLeaf(obj[key].children, idx1);
        } else {
          obj[key].leaf = true;
        }
      }
    }
  }

  /*
   * Parcourir la racine des blocks du document d'une facon recursive.
   */

  function traverseRoot(obj, idx1) {
    if (obj.text && obj.text.length > 0 && obj.children.length <= 0) {
      $scope.counterElements += 1;
      obj = applyRegleStyle(obj, idx1);
    }
    $scope.blocksPlan[idx1 + 1][$scope.idx2[idx1 + 1]] = obj;
  }

  /*
   * Calculer le niveau de décalage des lignes du plan.
   */
  $scope.calculateNiveauPlan = function(nNiv) {
    var marginLeft = 0;
    if (parseInt(nNiv) > 1) {
      marginLeft = (parseInt(nNiv) - 1) * 30;
    }
    return marginLeft;
  };

  /*
   * Aller au Slide de position idx et du block blk.
   */
  $scope.setActive = function(idx, blk) {
    $rootScope.currentIndexPage = idx + 1;
    $scope.blocksPlan[idx + 1].active = true;
    $scope.currentBlock = blk;
    $scope.showApercu = 'visible';
    $scope.showPlan = 'hidden';
  };

  /*
   * Intercepter l'evenement goToArea de la fin de la transition.
   */
  $scope.$on('goToBlockSlide', function() {
    $scope.restoreNotesStorage($rootScope.currentIndexPage);
    var blockId = '#' + $scope.currentBlock;
    if ($scope.currentBlock && $(blockId).offset()) {
      $('html, body').animate({
        scrollTop: $(blockId).offset().top
      }, 1200);
      $scope.currentBlock = null;
    } else {
      if ($('#plan').offset()) {
        $('html, body').animate({
          scrollTop: $('#plan').offset().top
        }, 500);
      }
    }
  });

  //if ($scope.testEnv == false) {
  //  console.log('Mode offline :ON');
  //  $scope.browzerState = navigator.onLine;
  //  /* Mode non connecté à internet */
  //  if (!$scope.browzerState) {
  //    $scope.showPartagerModal = false;
  //    //if (localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
  //      console.log('populateApercu');
  //      $scope.populateApercu();
  //    //}
  //  }
  //}


  /*
   * Intercepter l'evenement ngRepeatFinishedApercu de la fin de l'affichage de l'apercu.
   */
  $scope.$on('ngRepeatFinishedApercu', function() {
    $('.toAddItem').addClass('item');
    $scope.loader = false;
    $scope.loaderMsg = 'Veuillez patienter ...';
    console.log('ngRepeatFinishedApercu ==> ');
    var dateNow = new Date();
    localStorage.setItem('lockOperationDropBox', false);
    console.log(dateNow.getFullYear() + '/' + dateNow.getMonth() + '/' + dateNow.getDate() + ' - ' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + dateNow.getSeconds() + ':' + dateNow.getMilliseconds());
    if (!$scope.$$phase) {
      $scope.$digest();
    }
  });

  // Catch detection of key up
  /*$scope.$on('keydown', function(msg, code) {
   if (code === 37) {
   $scope.$broadcast('prevSlide');
   } else if (code === 39) {
   $scope.$broadcast('nextSlide');
   }
   });*/

  /* Play de la source audio */
  $scope.playSong = function(source) {
    var audio = document.getElementById('player');
    audio.setAttribute('src', source);
    audio.load();
    audio.play();
  };

  /* Pause de la source audio */
  $scope.pauseAudio = function() {
    var audio = document.getElementById('player');
    if (audio) {
      audio.pause();
    }
  };

  /*
   * Afficher/Masquer le menu escamotable.
   */
  $scope.afficherMenu = function() {
    if ($('.open_menu').hasClass('shown')) {
      $('.open_menu').removeClass('shown');
      $('.open_menu').parent('.menu_wrapper').animate({
        'margin-left': '160px'
      }, 100);
      $('.zoneID').css('z-index', '9');

    } else {
      $('.open_menu').addClass('shown');
      $('.open_menu').parent('.menu_wrapper').animate({
        'margin-left': '0'
      }, 100);
      $('.zoneID').css('z-index', '8');
    }
  };

  /*
   * Aller au precedent.
   */
  $scope.precedent = function() {
    $scope.$broadcast('prevSlide');
  };

  /*
   * Aller au suivant.
   */
  $scope.suivant = function() {
    $scope.$broadcast('nextSlide');
  };

  /*
   * Aller au dernier.
   */
  $scope.dernier = function() {
    if ($scope.blocksPlan.length > 0) {
      $rootScope.currentIndexPage = $scope.blocksPlan.length - 1;
      $scope.blocksPlan[$scope.blocksPlan.length - 1].active = true;
    }
  };

  /*
   * Aller au premier.
   */
  $scope.premier = function() {
    if ($scope.blocksPlan.length === 1) {
      $rootScope.currentIndexPage = 0;
      $scope.blocksPlan[0].active = true;
    } else if ($scope.blocksPlan.length > 1) {
      $rootScope.currentIndexPage = 1;
      $scope.blocksPlan[1].active = true;
    }
  };

  /*
   * Aller au plan.
   */
  $scope.plan = function() {
    if ($scope.blocksPlan.length > 0) {
      $rootScope.currentIndexPage = 0;
      $scope.blocksPlan[0].active = true;
      if ($('#plan').offset()) {
        $('html, body').animate({
          scrollTop: $('#plan').offset().top
        }, 500);
      }
    }
  };

  /*
   * Fixer/Défixer le menu lors du défilement.
   */
  $(window).scroll(function() {
    var dif_scroll = 0;
    if ($('.carousel-inner').offset()) {
      if ($(window).scrollTop() >= $('.carousel-inner').offset().top) {
        dif_scroll = $(window).scrollTop() - 160;
        $('.fixed_menu').css('top', dif_scroll + 'px');
      } else {
        $('.fixed_menu').css('top', 0);
      }
    }

  });

  /*
   * Initialiser les blocks et se diriger vers l'espace de structuration.
   */
  $scope.restructurer = function() {
    $rootScope.currentIndexPage = undefined;
    if (blocks && blocks.children.length > 0) {
      $rootScope.restructedBlocks = blocks;
      var urlAp = $location.absUrl();
      urlAp = urlAp.replace('#/apercu', '');
      $rootScope.docTitre = decodeURI(urlAp.substring(urlAp.lastIndexOf('/') + 1, urlAp.lastIndexOf('.html')));
      if ($scope.escapeTest) {
        $window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
      }
    }
  };

  /*
   * Afficher la zone de saisie de l'email.
   */
  $scope.loadMail = function() {
    $scope.showDestination = true;
    // console.log($scope.encodeURI)
    // console.log(decodeURIComponent($scope.encodeURI));
  };

  /*
   * Initialiser les paramètres du partage d'un document.
   */
  $scope.clearSocialShare = function() {
    $scope.confirme = false;
    $scope.showDestination = false;
    $scope.destinataire = '';
    $scope.addAnnotation = false;
    if (localStorage.getItem('notes') !== null) {
      var noteList = JSON.parse(JSON.parse(localStorage.getItem('notes')));
      $scope.annotationToShare = [];

      $scope.docFullName = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec($location.absUrl())[0]);
      if (noteList.hasOwnProperty($scope.docFullName)) {
        $scope.addAnnotation = true;
        $scope.annotationToShare = noteList[$scope.docFullName];
      } else {
        $scope.addAnnotation = false;
      }
    } else {
      $scope.addAnnotation = false;
    }
  };

  /*
   * Annuler l'envoi d'un email.
   */
  $scope.dismissConfirm = function() {
    $scope.destinataire = '';
  };

  /*
   * Envoyer l'email au destinataire.
   */
  $scope.sendMail = function() {
    $('#confirmModal').modal('hide');
    var docApartager = $scope.encodeURI;
    $scope.loader = true;
    if ($rootScope.currentUser.dropbox.accessToken) {
      if (configuration.DROPBOX_TYPE) {
        if ($rootScope.currentUser && docApartager) {
          $scope.sharedDoc = $rootScope.titreDoc;

          $scope.encodeURI = decodeURIComponent($scope.encodeURI);
          if (!$scope.annotationOk) {
            $scope.encodeURI = $location.absUrl();
          }
          $scope.sendVar = {
            to: $scope.destinataire,
            content: ' a utilisé cnedAdapt pour partager un fichier avec vous !  ' + $scope.sharedDoc,
            encoded: '<span> vient d\'utiliser CnedAdapt pour partager un fichier avec vous !   <a href=\'' + $scope.encodeURI + '\'>' + $scope.sharedDoc + '</a> </span>',
            prenom: $rootScope.currentUser.local.prenom,
            fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
            doc: $scope.sharedDoc
          };
          $http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
            .success(function() {
            $('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
            $scope.envoiMailOk = true;
            $scope.destinataire = '';
            $scope.loader = false;
            $scope.showDestination = false;
            // $('#shareModal').modal('hide');
          });
        }
      }
    }
  };

  /*
   * Partager un document.
   */
  $scope.socialShare = function() {
    $scope.emailMsgSuccess = '';
    $scope.emailMsgError = '';

    if (!$scope.destinataire || $scope.destinataire.length <= 0) {
      $scope.emailMsgError = 'L\'Email est obligatoire!';
      return;
    }
    if (!verifyEmail($scope.destinataire)) {
      $scope.emailMsgError = 'L\'Email est invalide!';
      return;
    }
    $('#confirmModal').modal('show');
    $('#shareModal').modal('hide');

  };

  /*
   * Initialiser les paramètres du duplication d'un document.
   */
  $scope.clearDupliquerDocument = function() {
    $scope.showMsgSuccess = false;
    $scope.showMsgError = false;
    $scope.msgSuccess = '';
    $scope.showMsgError = '';
    var docUrl = decodeURI($location.absUrl());
    docUrl = docUrl.replace('#/apercu', '');
    $scope.duplDocTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
    $('#duplicateDocModal').modal('hide');
  };

  $scope.ete = function() {
    $scope.duplDocTitre = $('#duplDocTitre').val();
  };
  /*
   * Dupliquer un document.
   */
  $scope.dupliquerDocument = function() {


    if ($rootScope.currentUser) {
      console.log($scope.duplDocTitre);
      $('.loader_cover').show();
      $scope.loaderProgress = 10;
      $scope.showloaderProgress = true;
      $scope.loaderMessage = 'Copie du document dans votre DropBox en cours. Veuillez patienter ';

      var token = $rootScope.currentUser.dropbox.accessToken;
      var newOwnerId = $rootScope.currentUser._id;
      var url = $location.absUrl();
      url = url.replace('#/apercu', '');
      var filePreview = url.substring(url.lastIndexOf('_') + 1, url.lastIndexOf('.html'));
      var newDocName = $scope.duplDocTitre;

      var manifestName = newDocName + '_' + filePreview + '.appcache';
      var apercuName = newDocName + '_' + filePreview + '.html';
      console.log(apercuName);
      console.log(manifestName);
      // var listDocumentDropbox = configuration.CATALOGUE_NAME;
      // $scope.loader = true;
      var msg1 = 'Le document est copié avec succès !';
      var errorMsg1 = 'Le nom du document existe déja dans votre Dropbox !';
      var errorMsg2 = 'Le titre est obligatoire !';
      $scope.msgErrorModal = '';
      $scope.msgSuccess = '';
      $scope.showMsgSuccess = false;
      $scope.showMsgError = false;
      $('#duplDocButton').attr('data-dismiss', 'modal');
      /* Si le titre du document est non renseigné */
      if (!$scope.duplDocTitre || $scope.duplDocTitre.length <= 0) {
        $scope.msgErrorModal = errorMsg2;
        $scope.showMsgError = true;
        $scope.loader = false;
        $scope.showloaderProgress = false;
        $('#duplDocButton').attr('data-dismiss', '');
        return;
      }

      if (!serviceCheck.checkName($scope.duplDocTitre)) {
        $scope.msgErrorModal = 'Veuillez n\'utiliser que des lettres (de a à z) et des chiffres.';
        $scope.loader = false;
        $scope.showMsgError = true;
        $scope.showloaderProgress = false;
        $('#duplDocButton').attr('data-dismiss', '');
        return;
      }
      localStorage.setItem('lockOperationDropBox', true);
      var foundDoc =false;
      var searchApercu = dropbox.search('_' + $scope.duplDocTitre + '_', token, configuration.DROPBOX_TYPE);
      searchApercu.then(function(result) {
        $scope.loaderProgress = 30;
        for (var i = 0; i < result.length; i++) {
          if (result[i].path.indexOf('.html') > 0 && result[i].path.indexOf('_' + $scope.duplDocTitre + '_') > 0) {
            foundDoc = true;
            break;
          }
        }
        if (foundDoc) {
          /* Si le document existe déja dans votre Dropbox */
          $scope.showMsgError = true;
          $scope.msgErrorModal = errorMsg1;
          $scope.showloaderProgress = false;
          $scope.loaderProgress = 100;
          $scope.loader = false;
          $('#duplDocButton').attr('data-dismiss', '');
          $('#duplicateDocModal').modal('show');
          localStorage.setItem('lockOperationDropBox', false);
        } else {
          $scope.showloaderProgress = true;
          $('.loader_cover').show();
          console.log('i need to see loader');
          //$scope.loader = true;
          var dateDoc = new Date();
          dateDoc = dateDoc.getFullYear() + '-' + (dateDoc.getMonth() + 1) + '-' + dateDoc.getDate();
          apercuName = dateDoc + '_' + apercuName;
          manifestName = dateDoc + '_' + manifestName;
          $http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(response) {
            var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), response.data, token, configuration.DROPBOX_TYPE);
            uploadManifest.then(function(result) {
              $scope.loaderProgress = 50;
              if (result) {
                var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                shareManifest.then(function(result) {
                  $scope.loaderProgress = 70;
                  if (result) {
                    var urlManifest = result.url;
                    $http.get(($scope.url || url)).then(function(resDocDropbox) {
                      $scope.loaderProgress = 80;
                      var docDropbox = resDocDropbox.data;
                      docDropbox = docDropbox.replace(docDropbox.substring(docDropbox.indexOf('manifest="'), docDropbox.indexOf('.appcache"') + 10), 'manifest="' + urlManifest + '"');
                      docDropbox = docDropbox.replace('ownerId = \'' + ownerId + '\'', 'ownerId = \'' + newOwnerId + '\'');
                      var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), docDropbox, token, configuration.DROPBOX_TYPE);
                      uploadApercu.then(function(result) {
                        $scope.loaderProgress = 85;
                        var listDocument = result;
                        var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
                        shareApercu.then(function(result) {
                          $scope.loaderProgress = 90;
                          localStorage.setItem('lockOperationDropBox', false);
                          if (result) {
                            $scope.docTitre = '';
                            listDocument.lienApercu = result.url + '#/apercu';
                            $scope.loaderProgress = 100;
                            $scope.showloaderProgress = false;
                            $scope.loader = false;
                            $scope.showMsgSuccess = true;
                            $scope.msgSuccess = msg1;
                            $('#duplDocButton').attr('data-dismiss', '');
                            $('#duplicateDocModal').modal('show');
                          }
                        });
                      });
                    });
                  }
                });
              }
            });
          });
        }
      });
    }
  };

  /*
   * Initialiser les pages de début et fin lors de l'impression.
   */
  $scope.selectionnerMultiPage = function() {
    $scope.pageA = 1;
    $scope.pageDe = 1;
    $('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text('1');
    $('select[data-ng-model="pageA"]').val(1);
    $('select[data-ng-model="pageDe"] + .customSelect .customSelectInner').text('1');
    $('select[data-ng-model="pageDe"]').val(1);
  };

  /*
   * Selectionner la page de début pour l'impression.
   */
  $scope.selectionnerPageDe = function() {

    $scope.pageDe = parseInt($('select[data-ng-model="pageDe"]').val());
    $scope.pageA = parseInt($('select[data-ng-model="pageA"]').val());

    if ($scope.pageDe > $scope.pageA) {
      $scope.pageA = $scope.pageDe;
      $('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text($scope.pageA);
      $('select[data-ng-model="pageA"]').val($scope.pageA);
    }

    var pageDe = parseInt($scope.pageDe);
    $('select[data-ng-model="pageA"] option').prop('disabled', false);

    for (var i = 0; i < pageDe - 1; i++) {
      $('select[data-ng-model="pageA"] option').eq(i).prop('disabled', true);
    }
  };

  /*
   * Imprimer le document selon le mode choisi.
   */
  $scope.printByMode = function() {
    if ($location.absUrl()) {
      var printURL = decodeURI($location.absUrl());
      printURL = printURL.replace('#/apercu', '');
      var printP = 0;
      if ($scope.printPlan === true) {
        printP = 1;
      }
      printURL = printURL + '#/print?plan=' + printP + '&mode=' + $scope.printMode;

      if ($scope.printMode) {
        if ($scope.printMode === 1) {
          printURL = printURL + '&de=' + $rootScope.currentIndexPage + '&a=' + $rootScope.currentIndexPage;
        } else if ($scope.printMode === 2) {
          printURL = printURL + '&de=' + $scope.pageDe + '&a=' + $scope.pageA;
        }
      }
      $window.open(printURL);
      // $rootScope.currentIndexPage = undefined;
    }
  };

  /*
   * Initialiser l'impression au mode toutes les pages.
   */
  $scope.clearPrint = function() {
    $scope.printMode = 0;
    $scope.printPlan = true;
  };

  /* Debut Gestion des annotations dans l'apercu */
  $scope.notes = [];

  /*
   * Dessiner les lignes de toutes les annotations.
   */
  $scope.drawLine = function() {
    $('#noteBlock1 div').remove();
    if ($scope.notes.length > 0) {
      for (var i = 0; i < $scope.notes.length; i++) {
        $('#noteBlock1').line($scope.notes[i].xLink + 65, $scope.notes[i].yLink + 25, $scope.notes[i].x, $scope.notes[i].y + 20, {
          color: '#747474',
          stroke: 1,
          zindex: 10
        });
      }
    }
  };

  /*
   * Récuperer la liste des annotations de localStorage et les afficher dans l'apercu.
   */
  $scope.restoreNotesStorage = function(idx) {
    $scope.notes = [];
    if (idx && idx !== 0 && localStorage.getItem('notes')) {
      var mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
      var notes = [];
      if (mapNotes.hasOwnProperty($scope.docSignature)) {
        notes = mapNotes[$scope.docSignature];
      }
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].idPage === idx) {
          notes[i].styleNote = '<p ' + $scope.styleAnnotation + '> ' + notes[i].texte.replace(/<br>/g, ' \n ') + ' </p>';
          $scope.notes.push(notes[i]);
        }
      }
    }
    $scope.drawLine();
  };

  /*
   * Retourner le numero de l'annotation suivante.
   */

  function getNoteNextID() {
    if (!$scope.notes.length) {
      return (1);
    }
    var lastNote = $scope.notes[$scope.notes.length - 1];
    return (lastNote.idInPage + 1);
  }

  /*
   * Ajouter une annotation dans la position (x,y).
   */
  $scope.addNote = function(x, y) {
    var idNote = generateUniqueId();
    var idInPage = getNoteNextID();
    var defaultX = $('.carousel-caption').width() + 100;
    //var defaultW = defaultX + $('#noteBlock2').width();
    var defaultY = y-40;
    if(defaultY<0){
      defaultY=0;
    }
    var newNote = {
      idNote: idNote,
      idInPage: idInPage,
      idDoc: $scope.docSignature,
      idPage: $rootScope.currentIndexPage,
      texte: 'Note',
      x: defaultX,
      y: defaultY,
      xLink: x,
      yLink: y
    };
    console.log(newNote);
    //texte: 'Note ' + idInPage,
    newNote.styleNote = '<p ' + $scope.styleAnnotation + '> ' + newNote.texte + ' </p>';

    $scope.notes.push(newNote);
    $scope.drawLine();

    var notes = [];
    var mapNotes = {};
    if (localStorage.getItem('notes')) {
      mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
      if (mapNotes.hasOwnProperty($scope.docSignature)) {
        notes = mapNotes[$scope.docSignature];
      }
    }
    notes.push(newNote);
    mapNotes[$scope.docSignature] = notes;
    var element = [];
    element.push({
      name: 'notes',
      value: JSON.stringify(angular.toJson(mapNotes))
    });
    var t = storageService.writeService(element, 0);
    t.then(function(data) {});
    //localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
  };

  /*
   * Supprimer l'annotation de localStorage.
   */
  $scope.removeNote = function(note) {
    var index = $scope.notes.indexOf(note);
    $scope.notes.splice(index, 1);
    $scope.drawLine();

    var notes = [];
    var mapNotes = {};
    if (localStorage.getItem('notes')) {
      mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
      notes = mapNotes[$scope.docSignature];
      var idx = -1;
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].idNote === note.idNote) {
          idx = i;
          break;
        }
      }
      notes.splice(idx, 1);
      if (notes.length > 0) {
        mapNotes[$scope.docSignature] = notes;
      } else {
        delete mapNotes[$scope.docSignature];
      }
      localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
    }
  };

  $scope.styleDefault = 'data-font="" data-size="" data-lineheight="" data-weight="" data-coloration=""';

  /*
   * Fonction déclanchée lors du collage du texte dans l'annotation.
   */
  $scope.setPasteNote = function($event) {
    /* Le texte recuperé du presse-papier est un texte brute */
    if($scope.testEnv ==false){
      document.execCommand('insertText', false, $event.originalEvent.clipboardData.getData('text/plain'));
      $event.preventDefault();
    }
    $scope.pasteNote = true;
  };


  $scope.prepareNote = function(note, $event) {
    var currentAnnotation = $($event.target);
    currentAnnotation.attr('contenteditable', 'true');
    currentAnnotation.css('line-height', 'normal');
    currentAnnotation.css('font-family', 'helveticaCND, arial');
    //var isPlaceHolder = note.texte.match(/Note/g);
    //if (isPlaceHolder) {
    //  note.styleNote = '<p></p>';
    //} else {
    //  note.styleNote = '<p>' + note.texte + '</p>';
    //}
    currentAnnotation.removeClass('edit_status');
    currentAnnotation.addClass('save_status');
  };

  $scope.autoSaveNote = function(note, $event) {
    if($scope.testEnv ==false){
      var currentAnnotation = angular.element($event.target);
      note.texte = currentAnnotation.html();
    }else{
      note.texte='abc';
    }
    note.styleNote = '<p ' + $scope.styleAnnotation + '> ' + note.texte.replace(/<br>/g, ' \n ') + ' </p>';
    $scope.editNote(note);
  };

  /*
   * Enregistrer le texte saisi dans l'annotation.
   */
  //$scope.saveNote = function (note, $event) {
  //  var currentAnnotation = angular.element($event.target).parent('td').prev('.annotation_area');
  //
  //  if (currentAnnotation.hasClass('closed')) {
  //    currentAnnotation.removeClass('closed');
  //    currentAnnotation.addClass('opened');
  //    currentAnnotation.css('height', 'auto');
  //  }
  //
  //  if (currentAnnotation.hasClass('locked')) {
  //    currentAnnotation.removeClass('locked');
  //    currentAnnotation.addClass('unlocked');
  //    currentAnnotation.attr('contenteditable', 'true');
  //    currentAnnotation.css('line-height', 'normal');
  //    currentAnnotation.css('font-family', 'helveticaCND, arial');
  //    note.styleNote = '<p>' + note.texte + '</p>';
  //    angular.element($event.target).removeClass('edit_status');
  //    angular.element($event.target).addClass('save_status');
  //  } else {
  //    currentAnnotation.removeClass('unlocked');
  //    currentAnnotation.addClass('locked');
  //    currentAnnotation.attr('contenteditable', 'false');
  //    note.texte = currentAnnotation.html();
  //    note.styleNote = '<p ' + $scope.styleAnnotation + '> ' + note.texte.replace(/<br>/g, ' \n ') + ' </p>';
  //    $scope.editNote(note);
  //    angular.element($event.target).removeClass('save_status');
  //    angular.element($event.target).addClass('edit_status');
  //  }
  //};

  /*
   * Modifier une annotation.
   */
  $scope.editNote = function(note) {
    var notes = [];
    var mapNotes = {};
    if (localStorage.getItem('notes')) {
      mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
      notes = mapNotes[$scope.docSignature];
    }
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].idNote === note.idNote) {
        notes[i] = note;
        mapNotes[$scope.docSignature] = notes;
        localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
        break;
      }
    }
  };

  /*
   * Permettre d'ajouter une annotation.
   */
  $scope.enableNoteAdd = function() {
    $scope.isEnableNoteAdd = true;
  };

  /*
   * Ajouter une annotation dans l'apercu lors du click.
   */
  $scope.addNoteOnClick = function(event) {
    if ($scope.isEnableNoteAdd && $rootScope.currentIndexPage && $rootScope.currentIndexPage !== 0) {
      if ($('.open_menu').hasClass('shown')) {
        $('.open_menu').removeClass('shown');
        $('.open_menu').parent('.menu_wrapper').animate({
          'margin-left': '160px'
        }, 100);
        $('.zoneID').css('z-index', '9');

      }
      var parentOffset = $(event.currentTarget).offset();
      var relX = event.pageX - parentOffset.left - 30;
      var relY = event.pageY - parentOffset.top - 40;
      $scope.addNote(relX, relY);
      $scope.isEnableNoteAdd = false;
    }
  };
  /*
   * Réduire/Agrandir une annotation.
   */
  $scope.collapse = function($event) {
    if (angular.element($event.target).parent('td').prev('.annotation_area').hasClass('opened')) {
      angular.element($event.target).parent('td').prev('.annotation_area').removeClass('opened');
      angular.element($event.target).parent('td').prev('.annotation_area').addClass('closed');
      angular.element($event.target).parent('td').prev('.annotation_area').css('height', 36 + 'px');
    } else {
      angular.element($event.target).parent('td').prev('.annotation_area').removeClass('closed');
      angular.element($event.target).parent('td').prev('.annotation_area').addClass('opened');
      angular.element($event.target).parent('td').prev('.annotation_area').css('height', 'auto');
    }
  };

  $scope.processAnnotation = function() {
    localStorage.setItem('lockOperationDropBox', true);
    // console.log($scope.annotationOk);
    if ($scope.annotationOk && $scope.docFullName.length > 0 && $scope.annotationToShare !== null) {
      var tmp2 = dropbox.upload($scope.docFullName + '.json', $scope.annotationToShare, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
      tmp2.then(function() {
        var shareManifest = dropbox.shareLink($scope.docFullName + '.json', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
        shareManifest.then(function(result) {
          localStorage.setItem('lockOperationDropBox', false);
          var annoParam = result.url.substring(result.url.indexOf('/s/') + 3, result.url.indexOf('.json'));
          $scope.encodeURI = encodeURIComponent($location.absUrl() + '?annotation=' + annoParam);
          $scope.confirme = true;

        });
      });
    } else {
      localStorage.setItem('lockOperationDropBox', false);
      $scope.confirme = true;
    }
  };
});
