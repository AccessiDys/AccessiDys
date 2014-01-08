'use strict';

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope, $location) {

    // Zones a découper
    $scope.zones = [];
    // Loader afficher/enlever manipulation
    $scope.loader = false;
    // Image courante dans l'espace de travail
    $scope.currentImage = {};
    // Liste générale des blocks
    $scope.blocks = {
        children: []
    };
    // text océrisé
    $scope.textes = {};
    // paramétre d'affichage de l'éditor
    $scope.showEditor = false;
    // Liste des fichiers a uploader
    $scope.files = [];
    // Garder l'ID du docuument enregistre
    $rootScope.idDocument;


    /* Ajout nouveaux blocks */
    $scope.toggleMinimized = function(child) {
        child.minimized = !child.minimized;
    };

    $scope.remove = function(child) {
        function walk(target) {
            var children = target.children,
                i;
            if (children) {
                i = children.length;
                while (i--) {
                    if (children[i] === child) {
                        return children.splice(i, 1);
                    } else {
                        walk(children[i]);
                    }
                }
            }
        }
        walk($scope.blocks);
    };

    function traverse(obj, cropedImages) {
        for (var key in obj) {
            if (typeof(obj[key]) == "object") {
                if ($scope.currentImage.source == obj[key].source) {
                    for (var j = 0; j < $scope.cropedImages.length; j++) {
                        obj[key].children.push({
                            titre: 'fils ' + (j + 1),
                            text: cropedImages[j].text,
                            source: cropedImages[j].source,
                            children: []
                        });
                    };
                }
                traverse(obj[key], cropedImages);
            }
        }
    }

    function traverseOcrSpeech(obj, param, typeParam) {
        for (var key in obj) {
            if (typeof(obj[key]) == "object") {
                if ($scope.textes.source == obj[key].source) {
                    if (typeParam == 'text') {
                        obj[key].text = param;
                    } else if (typeParam == 'speech') {
                        obj[key].synthese = param;
                    }
                    break;
                }
                traverseOcrSpeech(obj[key], param, typeParam);
            }
        }
    }

    // $rootScope.bodystyle = "overflow:hidden;";

    $scope.selected = function(x) {
        // Ajouter les dimentions sélectionnés a la table des zones
        $scope.zones.push(x);
        console.log(x);
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
                    traverse($scope.blocks, $scope.cropedImages);

                    // for (var i = $scope.blocks.length - 1; i >= 0; i--) {
                    //     if ($scope.blocks[i].source == $scope.currentImage.source) {
                    //         $scope.blocks[i].children = $scope.cropedImages;
                    //         for (var j = 0; j < $scope.cropedImages.length; j++) {
                    //             $scope.blocks.splice(i + j + 1, 0, $scope.cropedImages[j]);
                    //         };
                    //     }
                    // };
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
        $scope.loader = true;

        // Appel du websevice de l'ocerisation
        $http.post("/oceriser", {
            sourceImage: source
        }).success(function(data, status, headers, config) {
            // Ajouter l'objet comportant le text et l'image pour l'affichage sur le workspace
            $scope.textes = {
                source: source,
                text: angular.fromJson(data)
            };

            // Affichage de l'éditeur
            $scope.showEditor = true;
            $scope.loader = false;
            $scope.msg = "ok";
        }).error(function(data, status, headers, config) {
            $scope.msg = "ko";
        });
    }

    $scope.textToSpeech = function() {
        var ocrText = CKEDITOR.instances.editor1.document.getBody().getText();

        ocrText = ocrText.replace(/['"]/g, "");
        console.log(ocrText);

        $http.post("/texttospeech", {
            text: ocrText
        }).success(function(data, status, headers, config) {
            console.log("file of speech text ==> ");
            console.log(data);
            traverseOcrSpeech($scope.blocks, angular.fromJson(data), "speech");
            console.log("synthese finshed ==>  ");
            console.log($scope.blocks);
            console.log("ok");
        }).error(function(data, status, headers, config) {
            console.log("ko");
        });

    }



    // WYSIWYG Editor Methods
    /* Get OCR and save it */
    $scope.getOcrText = function(argument) {
        traverseOcrSpeech($scope.blocks, htmlToPlaintext(CKEDITOR.instances['editor1'].getData()), "text");
        console.log("ocr finshed ==> ");
        console.log($scope.blocks);
        $scope.textes = {};
        // Affichage de l'éditeur
        $scope.showEditor = false;
    }

    // Get Plain text without html tags

    function htmlToPlaintext(text) {
        return String(text).replace(/<(?:.|\n)*?>/gm, '');
    }

    /* Fonctions de l'upload des fichiers */
    $scope.setFiles = function(element) {
        $scope.$apply(function(scope) {
            // Turn the FileList object into an Array
            for (var i = 0; i < element.files.length; i++) {
                if (element.files[i].type != "image/jpeg" && element.files[i].type != "image/png" && element.files[i].type != "application/pdf") {
                    alert("type de fichier non permit : " + element.files[i].type);
                } else {
                    $scope.files.push(element.files[i]);
                }
            }
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
        $scope.loader = true;
    }

    /*function uploadProgress(evt) {
        $scope.$apply(function() {
            if (evt.lengthComputable) {
                $scope.progress = Math.round(evt.loaded * 100 / evt.total);
            } else {
                $scope.progress = 'unable to compute';
            }
        })
    }*/

    $scope.uploadComplete = function(evt) {
        /* This event is raised when the server send back a response */
        $scope.affectSrcValue(angular.fromJson(evt.target.responseText));
    }

    function uploadFailed(evt) {
        console.log("There was an error attempting to upload the file.")
    }

    /*function uploadCanceled(evt) {
        $scope.$apply(function() {
            $scope.progressVisible = false
        })
        console.log("The upload has been canceled by the user or the browser dropped the connection.")
    }*/

    $scope.affectSrcValue = function(srcs) {
        $rootScope.$emit('distroyJcrop');
        for (var i = 0; i < srcs.length; i++) {
            $scope.blocks.children.push({
                level: 0,
                titre: '',
                text: '',
                synthese: '',
                source: srcs[i],
                children: []
            });

        };
        initialiseZones();
        $scope.files = [];
        $scope.loader = false;

        // refresh scope binding : for callbacks of methods not with angularJS
        $scope.$apply();
    }

    // Export Image to workspace
    $scope.workspace = function(image) {
        $scope.currentImage.source = image.source;
        //$scope.currentImage.level = image.level;
        initialiseZones();
        $scope.textes = {};
        $scope.showEditor = false;
    }

    $scope.showByLevel = function(level) {
        console.log("calling level ==> " + level);
        if (level > 0) {
            return true;
            $scope.$apply();
        } else {
            return false;
            $scope.$apply();
        }
        // return show;
    }

    $scope.saveblocks = function() {
        console.log("save blocks saved ==> ");
        console.log($scope.blocks);

        /*var parentBlocks = [];
        for (var i = 0; i < $scope.blocks.length; i++) {
            if ($scope.blocks[i].level == 0) {
                parentBlocks.push($scope.blocks[i]);
            }
        };
        console.log(parentBlocks);
        $http.post("/ajouterDocStructure", {
            blocks: parentBlocks
        }).success(function(data, status, headers, config) {
            $rootScope.idDocument = angular.fromJson(data);
            console.log(data);
            console.log("ok");
        }).error(function(data, status, headers, config) {
            console.log("ko");
        });*/

        $http.post('/ajouterDocStructure', angular.toJson($scope.blocks.children))
            .success(function(data, status, headers, config) {
            $rootScope.idDocument = angular.fromJson(data);
            console.log(data);
            console.log("ok");
        })
            .error(function(data, status, headers, config) {
            console.log("ko");
        });

    }

    $scope.showlocks = function() {
        console.log("show blocks clicked ... ");
        $location.path("/apercu");
    }
});