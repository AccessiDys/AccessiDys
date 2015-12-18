/* File: addDocument.js
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

/*global $:false */
/* jshint undef: true, unused: true */
/* global PDFJS ,Promise, CKEDITOR  */
/*jshint unused: false, undef:false */

angular.module('cnedApp').controller('AddDocumentCtrl', function($scope, $rootScope, $routeParams, $timeout, $compile, tagsService, serviceCheck, $http, $location, dropbox, $window, configuration, htmlEpubTool, md5, fileStorageService, removeStringsUppercaseSpaces) {

  $scope.idDocument = $routeParams.idDocument;
  $scope.applyRules = false;
  //Gestion du menu
  $('#titreCompte').hide();
  $('#titreProfile').hide();
  $('#titreDocument').hide();
  $('#titreAdmin').hide();
  $('#detailProfil').hide();
  $('#titreDocumentApercu').hide();
  $('#titreTag').hide();
  $('#titreListDocument').hide();

  //Paramètres à intialiser
  $scope.pageTitre = 'Ajouter un document';
  $scope.showloaderProgress = false;
  $scope.files = [];
  $scope.errorMsg = false;
  $scope.alertNew = '#addDocumentModal';
  $scope.currentData = '';
  $scope.pageBreakElement = '<div aria-label="Saut de page" class="cke_pagebreak" contenteditable="false" data-cke-display-name="pagebreak" data-cke-pagebreak="1" style="page-break-after: always" title="Saut de page"></div><div></div><br />';
  $scope.resizeDocEditor = 'Agrandir';
  //Initialise le veouillage du document (pour déclencher popup d'alerte si sortie de la page) à false
  localStorage.setItem('lockOperationDropBox', false);


  /**
   * object managing the 2 seconds delay for applying styles
   * @type {Object}
   */
  $scope.chrono = {
    timer: 0,
    lastTimestamp: 0,
    lastFrameId: 0,
    run: function() {
      $scope.applyRules = false;
      $scope.chrono.lastFrameId = requestAnimationFrame($scope.chrono.count);
    },
    count: function(timestamp) {
      $scope.chrono.timer += (timestamp - ($scope.chrono.lastTimestamp || timestamp)) / 1000;
      $scope.chrono.lastTimestamp = timestamp || 0;

      if ($scope.chrono.timer < 2) {
        $scope.chrono.lastFrameId = requestAnimationFrame($scope.chrono.count);
      } else {
        $scope.caret.savePosition();
        $scope.$apply(function() {
          $scope.applyRules = true;
        });
        $scope.chrono.stop();
      }
    },
    stop: function() {
      $scope.chrono.timer = 0;
      $scope.chrono.lastTimestamp = 0;
      cancelAnimationFrame($scope.chrono.lastFrameId);
      $scope.$apply(function() {
        $scope.applyRules = false;
      });
    },
    end: function(){
      $scope.chrono.timer = 2;
    }
  };


  $scope.caret = {
    lastPosition: null,
    savePosition: function() {
      $scope.caret.lastPosition = rangy.getSelection().saveCharacterRanges(document.getElementById('editorAdd'));
    },
    restorePosition: function() {
      if ($scope.caret.lastPosition) {
        rangy.getSelection().restoreCharacterRanges(document.getElementById('editorAdd'), $scope.caret.lastPosition);
      }
    }
  };
  /**
   * Return le modal à afficher lors du click sur ouvrir un doc
   * @method  $scope.openDocument
   */
  $scope.openDocument = function() {
    $scope.errorMsg = false;
    $scope.msgErrorModal = '';
    $scope.clearUploadFile();
    $scope.lien = '';
    $($scope.alertNew).modal('show');
  };

  $scope.openDocumentEditorWithData = function() {
    $scope.alertNew = '#addDocumentModal';
    $scope.openDocument();
  };

  /**
   * Générer un identifiant MD5 à partir de l'html fourni
   * Utiliser pour la signature du document dans le titre lors de l'enregistrement
   * @param {String} html
   * @method  $scope.generateMD5
   */
  $scope.generateMD5 = function(html) {
    return md5.createHash(html);
  };


  /**
   * Stocke le contenu de l'éditeur dans $scope.currentData
   * Verouille la sortie de l'éditeur si du contenu est présent
   * @method  $scope.getText
   */
  $scope.getText = function() {
    $scope.currentData = CKEDITOR.instances.editorAdd.getData();
    //console.log($scope.currentData);
    if ($scope.currentData === '') {
      localStorage.setItem('lockOperationDropBox', false);
      $scope.alertNew = '#addDocumentModal';
    } else {
      localStorage.setItem('lockOperationDropBox', true);
      $scope.alertNew = '#save-new-modal';
    }
    if (!CKEDITOR.instances.editorAdd.checkDirty()) {
      localStorage.setItem('lockOperationDropBox', false);
    }

    $scope.chrono.stop();
    $scope.chrono.run();
  };

  /**
   * Affiche la popup d'enregistrement
   * @method  $scope.showSaveDialog
   */
  $scope.showSaveDialog = function() {
    // si le titre n'a pas été renseigné on affiche la popup d'enregistrement
    if (!$scope.docTitre) {
      $scope.errorMsg = false;
      $scope.msgErrorModal = '';
      $('#save-modal').modal('show');
    } else {
      // sinon on enregistre directement
      $scope.save();
    }
  };

  /**
   * Effectue le replace des liens interne
   * @method  $scope.processLink
   */
  $scope.processLink = function(data) {
    if ($scope.lien) {
      var parser = document.createElement('a');
      parser.href = $scope.lien;
      $scope.urlHost = parser.hostname;
      $scope.urlPort = 443;
      data = data.replace(new RegExp('href="\/(?!\/)', 'g'), 'href="https://' + $scope.urlHost + '/');
      data = data.replace(new RegExp('src="\/(?!\/)', 'g'), 'src="https://' + $scope.urlHost + '/');
    }
    return data;
  };

  /**
   * Sauvegarde exécutée suite à l'enregistrment dans la popup "Enregistrer"
   * @method  $scope.save
   */
  $scope.save = function() {

    $scope.errorMsg = false;

    $scope.msgErrorModal = '';
    var errorMsg1 = 'Veuillez-vous connecter pour pouvoir enregistrer votre document';
    var errorMsg2 = 'Erreur lors de l\'enregistrement de votre document';
    var errorMsg3 = 'Erreur lors du partage du document';
    var errorMsg4 = 'Le document existe déjà';
    if (!$scope.docTitre || $scope.docTitre.length <= 0) {
      $scope.msgErrorModal = 'Le titre est obligatoire !';
      $scope.errorMsg = true;
      $('#save-modal').modal('show');
      return;
    } else {
      if ($scope.docTitre.length > 201) {
        $scope.msgErrorModal = 'Le titre est trop long !';
        $scope.errorMsg = true;
        $('#save-modal').modal('show');
        return;
      } else if (!serviceCheck.checkName($scope.docTitre)) {
        $scope.msgErrorModal = 'Veuillez ne pas utiliser les caractères spéciaux.';
        $scope.errorMsg = true;
        $('#save-modal').modal('show');
        return;
      }
    }
    if (!$scope.errorMsg) {
      $('#save-modal').modal('hide');
    }

    $scope.showLoader('Enregistrement du document en cours veuillez patienter.');
    $scope.loaderProgress = 20;
    localStorage.setItem('lockOperationDropBox', true);
    if ($rootScope.currentUser.dropbox.accessToken) {
      var token = $rootScope.currentUser.dropbox.accessToken;
      var documentExist = false;
      fileStorageService.searchFiles('_' + $scope.docTitre + '_', token).then(function(filesFound) {
        for (var i = 0; i < filesFound.length; i++) {
          if (filesFound[i].filepath.indexOf('.html') > 0 && filesFound[i].filepath.indexOf('_' + $scope.docTitre + '_') > 0) {
            documentExist = true;
            break;
          }
        }
        $scope.loaderProgress = 25;

        if (documentExist && !$scope.existingFile) {
          localStorage.setItem('lockOperationDropBox', false);
          $scope.hideLoader();
          $scope.msgErrorModal = errorMsg4;
          $scope.errorMsg = true;
          $('#save-modal').modal('show');
        } else {
          var ladate = new Date();
          var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();

          $scope.filePreview = $scope.generateMD5($scope.currentData);
          var apercuName = tmpDate + '_' + encodeURIComponent($scope.docTitre) + '_' + $scope.filePreview + '.html';
          if ($scope.existingFile) {
            apercuName = $scope.existingFile.filepath;
          }
          $scope.loaderProgress = 30;
          localStorage.setItem('lockOperationDropBox', true);
          $scope.loaderProgress = 60;

          $scope.currentData = $scope.processLink($scope.currentData);

          fileStorageService.saveFile(($scope.apercuName || apercuName), $scope.currentData, token).then(function(data) {
            // On passe en mode modificication
            $scope.pageTitre = 'Editer le document';
            $scope.loaderProgress = 70;
            localStorage.setItem('lockOperationDropBox', false);
            $scope.loaderProgress = 75;
            $scope.existingFile = data;
            $scope.idDocument = $scope.docTitre;
            $scope.hideLoader();
            $scope.resetDirtyCKEditor();
          });
        }
      });
    } else {
      localStorage.setItem('lockOperationDropBox', false);
      $scope.loader = false;
      $scope.msgErrorModal = errorMsg1;
      $scope.errorMsg = true;
      $('#save-modal').modal('show');
    }
  };

  /**
   * Appelé lorsque l'utilisateur annule l'enregistrement. Réinitialise les messages d'erreur.
   * @method $scope.cancelSave
   */
  $scope.cancelSave = function() {
    $scope.errorMsg = false;
    $scope.msgErrorModal = '';
  };

  /**
   * Montre le modal de chargement
   * @method  $scope.showLoader
  //  */
  // $scope.showLoader = function(loaderMessage) {
  //   $scope.loader = true;
  //   $scope.showloaderProgress = true;
  //   $scope.loaderMessage = loaderMessage;
  //   $('.loader_cover').show();
  // };
  //
  // /**
  //  * Cache le modal de chargement
  //  * @method  $scope.hideLoader
  //  */
  // $scope.hideLoader = function() {
  //   $scope.loader = false;
  //   $scope.showloaderProgress = false;
  //   $scope.loaderMessage = '';
  //   $('.loader_cover').hide();
  // };


  /**
   * Test la véracité d'un lien (en vérifiant la présence du protocole http dans la String)
   * @method  $scope.verifyLink
   * @param String link
   * @return Boolean
   */
  $scope.verifyLink = function(link) {
    return link && ((link.toLowerCase().indexOf('https') > -1) || (link.toLowerCase().indexOf('http') > -1));
  };

  /**
   * Vérification des données de la popup d'ouverture d'un document
   *     Gestion des messages d'erreurs à travers $scope.errorMsg
   * @method  $scope.ajouterDocument
   */
  $scope.ajouterDocument = function() {
    if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length <= 0) {
      $scope.msgErrorModal = 'Le titre est obligatoire !';
      $scope.errorMsg = true;
      return;
    }
    if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length > 201) {
      $scope.msgErrorModal = 'Le titre est trop long !';
      $scope.errorMsg = true;
      return;
    }
    if (!serviceCheck.checkName($scope.doc.titre)) {
      $scope.msgErrorModal = 'Veuillez ne pas utiliser les caractères spéciaux.';
      $scope.errorMsg = true;
      return;
    }
    var foundDoc = false;
    var searchApercu = dropbox.search('_' + $scope.doc.titre + '_', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
    searchApercu.then(function(result) {
      for (var i = 0; i < result.length; i++) {
        if (result[i].path.indexOf('.html') > 0 && result[i].path.indexOf('_' + $scope.doc.titre + '_') > 0) {
          foundDoc = true;
          break;
        }
      }
      if (foundDoc) {
        $scope.msgErrorModal = 'Le document existe déjà';
        $scope.errorMsg = true;
      } else {
        if ((!$scope.lien && $scope.files.length <= 0) || (($scope.lien && /\S/.test($scope.lien)) && $scope.files.length > 0)) {
          $scope.msgErrorModal = 'Veuillez saisir un lien ou uploader un fichier !';
          $scope.errorMsg = true;
          return;
        }
        if ($scope.lien && !$scope.verifyLink($scope.lien)) {
          $scope.msgErrorModal = 'Le lien saisi est invalide. Merci de respecter le format suivant : "http://www.example.com/chemin/NomFichier.pdf"';
          $scope.errorMsg = true;
          return;
        }
        $('#addDocumentModal').modal('hide');
      }
    });
  };

  /**
   * Récupération du contenu html d'un epub
   * @method $scope.getEpub
   * @return {String} html
   */
  $scope.getEpubLink = function() {

    function errorFn() {
      $scope.msgErrorModal = 'Erreur lors du téléchargement de votre epub.';
      $scope.errorMsg = true;
      $scope.hideLoader();
    }

    $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
    var epubLink = $scope.lien;
    $http.post(configuration.URL_REQUEST + '/externalEpub', {
      id: $rootScope.currentUser.local.token,
      lien: epubLink
    }).success(function(data) {

      var epubContent = angular.fromJson(data);

      if (epubContent.html.length > 1) {
        var tabHtml = [];
        var makeHtml = function(i, length) {
          if (i !== length) {
            var pageHtml = epubContent.html[i].dataHtml;
            var resultHtml = {
              documentHtml: pageHtml
            };
            var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
            promiseClean.succes(function(resultClean) {
              for (var j in epubContent.img) {
                if (resultClean.indexOf(epubContent.img[j].link)) {
                  resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                }
              }
              tabHtml[i] = resultClean;
              makeHtml(i + 1, length);
            }).error(errorFn);
          } else {
            var html = tabHtml.join($scope.pageBreakElement);
            CKEDITOR.instances.editorAdd.setData(html);
          }
        };

        makeHtml(0, epubContent.html.length);
      } else {
        var resultHtml = epubContent.html[0].dataHtml;
        var promiseClean = htmlEpubTool.cleanHTML(resultHtml);

        promiseClean.then(function(resultClean) {
          for (var j in epubContent.img) {
            if (resultClean.indexOf(epubContent.img[j].link)) {
              resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
            }
          }
          CKEDITOR.instances.editorAdd.setData(resultClean);
        });
      }
      $scope.hideLoader();
    }).error(errorFn);
  };

  /**
   * Ouvrir le document selectionne par l'utilisateur.
   */
  $scope.validerAjoutDocument = function() {
    $scope.pageTitre = 'Ajouter un document';
    $scope.existingFile = null;
    if ($scope.doc && $scope.doc.titre) {
      $scope.docTitre = $scope.doc.titre;
    }

    $rootScope.uploadDoc = $scope.doc;
    $scope.doc = {};

    //Présence d'un fichier avec parcourir
    if ($scope.files.length > 0) {
      $rootScope.uploadDoc.uploadPdf = $scope.files;
      if ($rootScope.uploadDoc.uploadPdf[0].type === 'application/pdf') {
        $scope.loadPdf();
      } else if ($rootScope.uploadDoc.uploadPdf[0].type === 'image/jpeg' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/png' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/jpg') {
        $scope.loadImage();
      } else if ($rootScope.uploadDoc.uploadPdf[0].type === 'application/epub+zip' || ($rootScope.uploadDoc.uploadPdf[0].type === '' && $rootScope.uploadDoc.uploadPdf[0].name.indexOf('.epub'))) {
        $scope.uploadFile();
      } else {
        $scope.msgErrorModal = 'Le type de fichier n\'est pas supporté. Merci de ne rattacher que des fichiers PDF, des ePub  ou des images.';
        $scope.errorMsg = true;
      }
    }

    //Gestion d'un lien
    else if ($scope.lien) {
      if ($scope.lien.indexOf('.epub') > -1) {
        $scope.getEpubLink();
      } else if ($scope.lien.indexOf('.pdf') > -1) {
        $scope.loadPdfByLien($scope.lien);
      } else {
        $scope.loaderProgress = 10;
        $scope.showLoader('Traitement de votre document en cours');
        //Récupération du contenu du body du lien par les services
        var promiseHtml = serviceCheck.htmlPreview($scope.lien, $rootScope.currentUser.dropbox.accessToken);
        promiseHtml.then(function(resultHtml) {
            var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
            promiseClean.then(function(resultClean) {
              //Insertion dans l'éditeur
              CKEDITOR.instances.editorAdd.setData(resultClean);
              $scope.hideLoader();
            });
          },
          function(err) {

            $scope.hideLoader();
            $scope.techError = err;
            angular.element('#myModalWorkSpaceTechnical').modal('show');
          });
      }
    }
  };

  /**
   * Déclenché lors de l'ouverture d'un document
   */
  $('#addDocumentModal').on('hidden.bs.modal', function() {
    $scope.validerAjoutDocument();
  });

  /**
   * Charge l'image dans l'éditeur
   * @method $scope.loadImage
   */
  $scope.loadImage = function() {
    var reader = new FileReader();
    // Lecture de l'image
    reader.onload = function(e) {
      // Insert image
      CKEDITOR.instances.editorAdd.setData('<img src="' + e.target.result + '" width="790px"/>');
    };

    // Read in the image file as a data URL.
    reader.readAsDataURL($rootScope.uploadDoc.uploadPdf[0]);
    $scope.clearUploadFile();
  };

  /**
   * Charge le pdf par lien dans l'editeur
   * @method $scope.loadPdfByLien
   */
  $scope.loadPdfByLien = function(url) {
    $scope.loaderProgress = 0;
    $scope.showLoader('Traitement de votre document en cours');
    var contains = (url.indexOf('https') > -1); //true
    if (contains === false) {
      $scope.serviceNode = configuration.URL_REQUEST + '/sendPdf';
    } else {
      $scope.serviceNode = configuration.URL_REQUEST + '/sendPdfHTTPS';
    }
    $http.post($scope.serviceNode, {
      lien: url,
      id: localStorage.getItem('compteId')
    }).success(function(data) {
      // Clear editor content
      CKEDITOR.instances.editorAdd.setData('');
      var pdfbinary = $scope.base64ToUint8Array(data);
      PDFJS.getDocument(pdfbinary).then(function(pdf) {
        $scope.loadPdfPage(pdf, 1);
      });
    }).error(function() {
      $scope.hideLoader();
      $('#myModalWorkSpace').modal('show');
      $scope.pdferrLien = true;
    });
    $scope.clearUploadFile();
  };

  /**
   * Convertion du base64 en  en Uint8Array
   * @param base64 le binaire à convertir
   * @method $scope.base64ToUint8Array
   */
  $scope.base64ToUint8Array = function(base64) {
    var raw = atob(base64);
    var uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
    for (var i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  };

  /**
   * Charge le pdf local dans l'editeur
   * @method $scope.loadPdf
   */
  $scope.loadPdf = function() {
    $scope.loaderProgress = 0;
    $scope.showLoader('Traitement de votre document en cours');

    //Step 1: Get the file from the input element
    var file = $rootScope.uploadDoc.uploadPdf[0];

    //Step 2: Read the file using file reader
    var fileReader = new FileReader();

    fileReader.onload = function() {
      //Step 4:turn array buffer into typed array
      var typedarray = new Uint8Array(this.result);

      //clear ckeditor
      CKEDITOR.instances.editorAdd.setData('');

      //Step 5:PDFJS should be able to read this
      PDFJS.getDocument(typedarray).then(function(pdf) {
        $scope.loadPdfPage(pdf, 1);
      });
    };

    //Step 3:Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(file);
  };

  /**
   * Charge les pages du pdf en tant qu'image dans l'éditeur
   * @param pdf le le pdf à charger
   * @param le numéro de la page à partir de laquelle charger le pdf
   * @method $scope.loadPdfPage
   */
  $scope.loadPdfPage = function(pdf, pageNumber) {
    return pdf.getPage(pageNumber).then(function(page) {
      $('#canvas').remove();
      $('body').append('<canvas class="hidden" id="canvas" width="790px" height="830px"></canvas>');
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width); //page.getViewport(1.5);
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      var pageRendering = page.render(renderContext);
      //var completeCallback = pageRendering.internalRenderTask.callback;
      pageRendering.internalRenderTask.callback = function(error) {
        if (error) {
          $scope.hideLoader();
          $scope.$apply();
          console.log(error);
        } else {
          new Promise(function(resolve) {
            var dataURL = $scope.canvasToImage(canvas, context, '#FFFFFF');
            if (dataURL) {
              CKEDITOR.instances.editorAdd.insertHtml('<img src="' + dataURL + '" />');

              pageNumber++;
              if (pageNumber <= pdf.numPages) {
                $scope.loaderProgress = (pageNumber / pdf.numPages) * 100;
                $scope.insertPageBreak();
                $scope.loadPdfPage(pdf, pageNumber);
              } else {
                window.scrollTo(0, 0);
                $scope.hideLoader();
              }
              resolve();
              $scope.$apply();
            }
          });
        }
      };
    });
  };

  /**
   * Convertit un canvas en image.
   * @param canvas le canvas à convertir
   * @param context le context du canvas
   * @param backgroundColor la couleur de fond à appliquer au canvas avant sa conversion
   * @method $scope.canvasToImage
   */
  $scope.canvasToImage = function(canvas, context, backgroundColor) {
    var data;
    var width = canvas.width;
    var height = canvas.height;
    var compositeOperation;

    if (backgroundColor) {
      data = context.getImageData(0, 0, width, height);
      compositeOperation = context.globalCompositeOperation;
      context.globalCompositeOperation = 'destination-over';
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
    }

    var imageData = canvas.toDataURL('image/png');

    if (backgroundColor) {
      context.clearRect(0, 0, width, height);
      context.putImageData(data, 0, 0);
      context.globalCompositeOperation = compositeOperation;
    }

    return imageData;
  };

  /**
   * Insère un saut de page dans l'éditeur
   * @method $scope.insertPageBreak
   */
  $scope.insertPageBreak = function() {
    CKEDITOR.instances.editorAdd.insertHtml($scope.pageBreakElement);
  };

  /**
   * Gestion de l'ajout d'un fichier via 'parcourir'
   * @method $scope.setFiles
   */
  $scope.setFiles = function(element) {
    $scope.files = [];
    var field_txt = '';
    $scope.$apply(function() {
      for (var i = 0; i < element.files.length; i++) {
        var filename = '';
        if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf' && element.files[i].type !== 'application/epub+zip') {
          if (element.files[i].type === '' && element.files[i].name.indexOf('.epub') > -1) {
            filename = element.files[i].name;
            $scope.doc = {};
            $scope.doc.titre = filename.substring(0, filename.lastIndexOf('.'));
            $scope.files.push(element.files[i]);
            field_txt += ' ' + element.files[i].name;
            $scope.msgErrorModal = '';
            $scope.errorMsg = false;
            $('#filename_show').val(field_txt);
          } else if (element.files[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || element.files[i].type === 'application/msword' || element.files[i].type === 'application/vnd.oasis.opendocument.text' || element.files[i].type === 'text/plain') {
            $scope.msgErrorModal = 'Les documents de ce type doivent être insérés en effectuant un copier/coller du contenu.';
            $scope.errorMsg = true;
            $scope.files = [];
            break;
          } else {
            $scope.msgErrorModal = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.';
            $scope.errorMsg = true;
            $scope.files = [];
            break;
          }
        } else {
          filename = element.files[i].name;
          $scope.doc = {};
          $scope.doc.titre = filename.substring(0, filename.lastIndexOf('.'));
          if (element.files[i].type == 'image/jpeg' || element.files[i].type == 'image/png' || element.files[i].type == 'image/jpg') { // jshint ignore:line
            $rootScope.imgFile = true;
          } else {
            $rootScope.imgFile = false;
          }
          $scope.files.push(element.files[i]);
          field_txt += ' ' + element.files[i].name;
          $scope.msgErrorModal = '';
          $scope.errorMsg = false;
          $('#filename_show').val(field_txt);
        }
      }
    });
  };


  /**
   * Réinitialise le champ parcourir
   */
  $scope.clearUploadFile = function() {
    $scope.files = [];
    $('#docUploadPdf').val('');
    $('#filename_show').val('');
  };


  /**
   * Traitement suite à l'upload des fichiers sur le serveur
   * @method $scope.uploadComplete
   * @param evt l'evenement d'upload
   */
  $scope.uploadComplete = function(evt) {
    $scope.loaderProgress = 100;
    $scope.hideLoader();

    if (evt.target.status === 200) {

      var serverResp = angular.fromJson(evt.target.responseText);

      $scope.files = [];

      if (serverResp.tooManyHtml) {
        $('#myModalWorkSpaceTooMany').modal('show');
      } else if (serverResp.oversized || serverResp.oversizedIMG) {
        $('#myModalWorkSpaceBig').modal('show');
      } else {
        var fileChunck = evt.target.responseText.substring(0, 50000).replace('"', '');
        var tmp = serviceCheck.getSign(fileChunck);
        tmp.then(function(loacalSign) {
          if (loacalSign.erreurIntern) {
            $('#myModalWorkSpace').modal('show');
          } else {
            $scope.filePreview = loacalSign.sign;
            if ($scope.serviceUpload !== '/fileupload') {
              var epubContent = angular.fromJson(evt.target.responseText);
              if (epubContent.html.length > 1) {

                //Fonction récursive pour concaténer les différentes pages HTML
                var tabHtml = [];
                var makeHtml = function(i, length) {
                  if (i !== length) {
                    var pageHtml = atob(epubContent.html[i].dataHtml);
                    var resultHtml = {
                      documentHtml: pageHtml
                    };
                    var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                    promiseClean.then(function(resultClean) {
                      for (var j in epubContent.img) {
                        if (resultClean.indexOf(epubContent.img[j].link)) {
                          resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                        }
                      }
                      tabHtml[i] = resultClean;
                      makeHtml(i + 1, length);
                    });
                  } else {
                    var html = tabHtml.join($scope.pageBreakElement);
                    CKEDITOR.instances.editorAdd.setData(html);
                  }
                };

                makeHtml(0, epubContent.html.length);
              } else {
                var resultHtml = atob(epubContent.html[0].dataHtml);
                htmlEpubTool.cleanHTML(resultHtml).then(function(resultClean) {
                  for (var j in epubContent.img) {
                    if (resultClean.indexOf(epubContent.img[j].link)) {
                      resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                    }
                  }
                  CKEDITOR.instances.editorAdd.setData(resultClean);
                }, function() {
                  $scope.msgErrorModal = 'Erreur lors du téléchargement de votre epub. TEST';
                  $scope.errorMsg = true;
                  $scope.hideLoader();
                  angular.element('#myModalWorkSpace').modal('show');
                });
              }
            }
          }
        });
      }
    } else {
      $('#myModalWorkSpace').modal('show');
    }

  };

  /**
   * Traitement suite à une erreur lors de l'upload des fichiers
   * @method $scope.uploadFailed
   */
  $scope.uploadFailed = function() {
    $scope.hideLoader();
  };

  $scope.uploadProgress = function(evt) {
    if (evt.lengthComputable) {
      //evt.loaded the bytes browser receive
      //evt.total the total bytes seted by the header
      $scope.loaderProgress = (evt.loaded / evt.total) * 100;
    }
  };

  /**
   * Traitement suite à l'envoi du formulaire d'upload
   * @method $scope.uploadFile
   */
  $scope.uploadFile = function() {
    if ($scope.files.length > 0) {
      $scope.loaderProgress = 10;
      var fd = new FormData();
      for (var i in $scope.files) {
        fd.append('uploadedFile', $scope.files[i]);
        if ($scope.files[i].type === 'application/epub+zip') {
          $scope.serviceUpload = '/epubUpload';
          $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
        } else {
          if ($scope.files[i].type === '' && $scope.files[i].name.indexOf('.epub')) {
            $scope.serviceUpload = '/epubUpload';
            $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
          } else if ($scope.files[i].type.indexOf('image/') > -1) {
            // appel du service de conversion image -> base64
            $scope.serviceUpload = '/fileupload';
            $scope.showLoader('Chargement de votre/vos image(s) en cours. Veuillez patienter ');
          } else {
            // appel du service de conversion pdf -> base64
            $scope.serviceUpload = '/fileupload';
            $scope.showLoader('Chargement de votre document PDF en cours. Veuillez patienter ');
          }
        }
      }
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', $scope.uploadComplete, false);
      xhr.addEventListener('error', $scope.uploadFailed, false);
      xhr.open('POST', configuration.URL_REQUEST + $scope.serviceUpload + '?id=' + localStorage.getItem('compteId'));
      $scope.$apply();
      xhr.send(fd);
    } else {
      $scope.msgErrorModal = 'Vous devez choisir un fichier.';
      $scope.errorMsg = true;
    }

  };


  /**
   * Ouverture de l'apercu
   * @method $scope.openApercu
   */
  $scope.openApercu = function() {
    fileStorageService.saveTempFile($scope.currentData).then(function() {
      $window.open('#/apercu?tmp=true');
    });
  };

  /**
   * Met à jour les formats disponibles dans l'éditeur
   * @method $scope.updateFormats
   */
  $scope.updateFormats = function() {
    var formatsArray = [];
    var ckConfig = {};
    tagsService.getTags(localStorage.getItem('compteId')).then(function(data) {
      for (var i = 0; i < data.length; i++) {
        var balise = data[i].balise;
        if (balise === 'div') {
          var classes = removeStringsUppercaseSpaces(data[i].libelle);
          ckConfig['format_' + classes] = {
            element: balise,
            attributes: {
              'class': classes
            }
          };
          formatsArray.push(classes);
        } else if (balise === 'blockquote') {
          // FIX on CKEDITOR which does not support blockquote in format list by default
          formatsArray.push(data[i].balise);
          ckConfig.format_blockquote = {
            element: 'blockquote'
          };
          // format non presents dans la liste
        } else if (balise !== 'li' && balise !== 'ol' && balise !== 'ul') {
          formatsArray.push(data[i].balise);
        }
      }
      var formats = formatsArray.join(';');
      ckConfig.format_tags = formats;
      // suppression du title
      ckConfig.title = false;
      $scope.createCKEditor(ckConfig, data);
    });
  };

  /**
   * Charge le document a éditer.
   * @method $scope.editExistingDocument
   */
  $scope.editExistingDocument = function() {
    $scope.pageTitre = 'Editer le document';
    fileStorageService.searchFiles($scope.idDocument, $rootScope.currentUser.dropbox.accessToken).then(function(files) {
      $scope.existingFile = files[0];
      $scope.docTitre = $scope.idDocument;
      $scope.loaderProgress = 27;
      fileStorageService.getFile($scope.idDocument, $rootScope.currentUser.dropbox.accessToken).then(function(filecontent) {
        CKEDITOR.instances.editorAdd.setData(filecontent, {
          callback: $scope.resetDirtyCKEditor
        });

        $scope.hideLoader();
      });
    });
  };

  /**
   * Création de l'éditeur avec les formats récupérés précédemment et en ajustant les libellés affichés
   * @param ckConfig la configuration de ckEditor à appliquer
   * @param formatTags les formats disponibles dans l'éditeur
   * @method $scope.createCKEditor
   */
  $scope.createCKEditor = function(ckConfig, listTags) {
    // Creation de l'editeur inline
    for (var name in CKEDITOR.instances) {
      CKEDITOR.instances[name].destroy(true);
    }

    ckConfig.on = {
      instanceReady: function() {
        for (var i = 0; i < listTags.length; i++) {
          var tag = listTags[i];
          if (tag.balise === 'blockquote') {
            // FIX CKEDITOR blockquote
            CKEDITOR.instances.editorAdd.lang.format.tag_blockquote = tag.libelle;
          } else if (tag.balise !== 'div') {
            CKEDITOR.instances.editorAdd.lang.format['tag_' + tag.balise] = tag.libelle;
          } else {
            CKEDITOR.instances.editorAdd.lang.format['tag_' + removeStringsUppercaseSpaces(tag.libelle)] = tag.libelle;
          }
        }
        if ($scope.idDocument) {
          $scope.$apply(function() {
            $scope.editExistingDocument();
          });
        }
      },
      change: function() {
        $timeout(function() {
          $scope.getText();
        });
      },
      afterPaste: function(evt) {
        $scope.chrono.end();
      }

    };

    $scope.editor = CKEDITOR.inline('editorAdd', ckConfig);

    // Ajustement de la taille de l'éditeur à la taille de la fenêtre moins les menus
    $('#editorAdd').css('min-height', $(window).height() - 380 + 'px');
    $scope.setupRegleStyle();
  };

  /**
   * Désactivation de la création automatique des editeurs inline
   * @method $scope.disableAutoInline
   */
  $scope.disableAutoInline = function() {
    CKEDITOR.disableAutoInline = true;
  };

  /**
   * Affiche la barre de chargement et change le titre de la page si le parametre idDocument est present.
   */
  $scope.initLoadExistingDocument = function() {
    if ($scope.idDocument) {
      $scope.loaderProgress = 10;
      $scope.pageTitre = 'Editer le document';
      $scope.showLoader('Chargement de votre document en cours');
    }
    var toto = 999;
  };

  $scope.resetDirtyCKEditor = function() {
    CKEDITOR.instances.editorAdd.resetDirty();
  };

  /**
   * Affiche la popup de chargement.
   */
  $scope.showLoader = function(msg, callback) {
    $scope.loader = true;
    $scope.loaderMessage = msg;
    $scope.showloaderProgress = true;
     $('.loader_cover').show(callback);
    if (callback) callback();
  };

  /**
   * Cache la popup de chargement.
   */
  $scope.hideLoader = function() {
    $timeout(function() {
      $scope.loader = false;
      $scope.loaderMessage = '';
      $scope.showloaderProgress = false;
      $scope.caret.restorePosition();
        $('.loader_cover').hide();
    }, 0);
  };

  $rootScope.$on('profilChanged', function() {
    $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');
  });

  $scope.setupRegleStyle = function() {
    var editor = angular.element('#editorAdd');
    editor.attr('regle-style', 'currentData');
    $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');
    editor.attr('tags', '{{listTagsByProfil}}');
    editor.attr('apply-rules', '{{applyRules}}');
    editor = $compile(editor)($scope);
  };
  
  //réduit ou agrandit l'éditeur de texte
  $scope.resizeEditor = function () {
      
      if ($scope.resizeDocEditor === 'Agrandir') {
          $scope.resizeDocEditor = 'Réduire';
          $('.header_zone').slideUp(300, function () {
          });

      } else {
          $scope.resizeDocEditor = 'Agrandir';
          $('.header_zone').slideDown(300, function () {
          });
      }
  };
  // Désactive la creation automatique des editeurs inline
  $scope.disableAutoInline();

  // Récupère la liste des formats disponibles
  $scope.updateFormats();

  $scope.initLoadExistingDocument();

});
