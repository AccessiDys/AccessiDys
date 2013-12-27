'use strict';

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope) {

    // Zones a découper
    $scope.zones = [];
    // Loader afficher/enlever manipulation
    $scope.loader = false;
    // Image courante dans l'espace de travail
    $scope.currentImage = {};
    // Liste générale des blocks
    $scope.blocks = [];
    // text océrisé
    $scope.textes ={};
    // paramétre d'affichage de l'éditor
    $scope.showEditor = false;
    // Liste des fichiers a uploader
    $scope.files = [];

    // $rootScope.bodystyle = "overflow:hidden;";

    $scope.selected = function(x) {
        // Ajouter les dimentions sélectionnés a la table des zones
        $scope.zones.push(x);
        // Enlever la selection
        $rootScope.$emit('releaseCrop');
    };

    // submit crop data
    $scope.sendCrop = function(source) {

        // initialiser le nombre d'appel du service du découpage a 0
        var callsFinish = 0;
        // Initialiser la table des image découpés
        $scope.cropedImages = [];
        // Manipulation du style du body
        // $scope.bodystyle = "overflow:hidden;";

        // Parcourir les zones pour déoupage
        angular.forEach($scope.zones, function(zone, key) {
            // afficher le loader
            $scope.loader = true;
            // Ajouter l'image de source pour le découpage
            zone.srcImg = source;

            // Appel du service de découpage
            $http.post("/images", {
                DataCrop: zone
            }).success(function(data, status, headers, config) {

                // Créer un objet avec l'image découpée
                var imageTreated = {};
                imageTreated.source = angular.fromJson(data);
                imageTreated.text = '';
                imageTreated.titre = '';
                imageTreated.level = Number($scope.currentImage.level + 1);
                imageTreated.children = [];
                $scope.cropedImages.push(imageTreated);

                // incrémenter le nombre d'appel du service de 1
                callsFinish += 1;
                /* Si le nombre d'appel est égale au nombre de zones 
                Parcourir le tableau des images découpés est l'ajouter a la liste generale des blocks  */
                if ($scope.zones.length == callsFinish) {

                    // Enlever le loader
                    $scope.loader = false;
                    // Initialiser les zones
                    initialiseZones();

                    // Détecter le parent des blocks et ajouter les images découpés a ce block
                    for (var i = $scope.blocks.length - 1; i >= 0; i--) {
                        if ($scope.blocks[i].source == $scope.currentImage.source) {
                            $scope.blocks[i].children = $scope.cropedImages;
                            for (var j = 0; j < $scope.cropedImages.length; j++) {
                                $scope.blocks.splice(i + j + 1, 0, $scope.cropedImages[j]);
                            };
                        }
                    };
                }
            }).error(function(data, status, headers, config) {
                $scope.msg = "ko";
            });
        });

    };

    /* Initialiser la liste des zones */
    function initialiseZones() {
        $scope.zones = [];
    }


    // Appliquer l'océrisation
    $scope.oceriser = function(source) {

        initialiseZones();

        // Appel du websevice de l'ocerisation
        $http.post("/oceriser", {
            sourceImage: source
        }).success(function(data, status, headers, config) {
            // Ajouter l'objet comportant le text et l'image pour l'affichage sur le workspace
            $scope.textes = {
                source: source,
                editor: $scope.addEditor(angular.fromJson(data)),
                text: angular.fromJson(data)
            };

            // Vider l'espace du découpage
            $scope.currentImage.source = "";
            // Affichage de l'éditeur
            $scope.showEditor = true;
            // console.log($scope.textes);
            $scope.msg = "ok";
        }).error(function(data, status, headers, config) {
            $scope.msg = "ko";
        });
    }

    $scope.textToSpeech = function() {
    var ocrText = CKEDITOR.instances.editor1.document.getBody().getText();

    ocrText = ocrText.replace(/['"]/g,"");
    console.log(ocrText);
    
    $http.post("/texttospeech", {
        text : ocrText
    }).success(function(data, status, headers, config) {
         console.log("ok");
    }).error(function(data, status, headers, config) {
         console.log("ko");
    });
    
    }



    // WYSIWYG Editor Methods
    $scope.addEditor = function(text) {
        var init = text;
        $scope.editor = {
            value: init
        };
    };

    $scope.getHtmlOcrText = function() {
        $scope.editorValue = CKEDITOR.instances['editor1'].getData();
    }

    /* Fonctions de l'upload des fichiers */
    $scope.setFiles = function(element) {
        $scope.$apply(function(scope) {
            // console.log('files:', element.files);
            // Turn the FileList object into an Array
            // $scope.files = [];
            for (var i = 0; i < element.files.length; i++) {
                if (element.files[i].type != "image/jpeg" && element.files[i].type != "image/png" && element.files[i].type != "application/pdf") {
                    alert("type de fichier non permit : " + element.files[i].type);
                } else {
                    $scope.files.push(element.files[i]);
                }
            }
            // console.log('files:', $scope.files);
            // $scope.progressVisible = false;
        });
    };

    $scope.uploadFile = function() {
        var fd = new FormData();
        for (var i in $scope.files) {
            fd.append("uploadedFile", $scope.files[i]);
        }
        var xhr = new XMLHttpRequest();
        // xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", $scope.uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        // xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/fileupload");
        $scope.progressVisible = true;
        xhr.send(fd);
    }

    // function uploadProgress(evt) {
    //     $scope.$apply(function() {
    //         if (evt.lengthComputable) {
    //             $scope.progress = Math.round(evt.loaded * 100 / evt.total);
    //         } else {
    //             $scope.progress = 'unable to compute';
    //         }
    //     })
    // }

    $scope.uploadComplete = function(evt) {
        /* This event is raised when the server send back a response */
        // console.log("load complete");
        $scope.affectSrcValue(angular.fromJson(evt.target.responseText));
    }

    function uploadFailed(evt) {
        console.log("There was an error attempting to upload the file.")
    }

    // function uploadCanceled(evt) {
    //     $scope.$apply(function() {
    //         $scope.progressVisible = false
    //     })
    //     console.log("The upload has been canceled by the user or the browser dropped the connection.")
    // }

    $scope.affectSrcValue = function(srcs) {
        $rootScope.$emit('distroyJcrop');
        for (var i = 0; i < srcs.length; i++) {
            $scope.blocks.push({
                source: srcs[i],
                text: '',
                children: [],
                level: 0
            });
        };
        initialiseZones();

        // refresh scope binding : for callbacks of methods not with angularJS
        $scope.$apply();
    }

    // Export Image to workspace
    $scope.workspace = function(image) {
        $scope.currentImage.source = image.source;
        $scope.currentImage.level = image.level;
        initialiseZones();
        $scope.textes = {};
        $scope.showEditor = false;
    }

});