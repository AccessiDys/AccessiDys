'use strict';

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope, $location, $compile) {

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
    // Liste des tags
    $scope.listTags = [];
    // Initialisation liste profils
    $scope.listProfils = [];


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

    function traverseOcrSpeech(obj) {
        for (var key in obj) {
            if (typeof(obj[key]) == "object") {
                if ($scope.currentImage.source == obj[key].source) {
                    obj[key].text = $scope.currentImage.text;
                    obj[key].synthese = $scope.currentImage.synthese;
                    obj[key].tag = $scope.currentImage.tag;
                    break;
                }
                traverseOcrSpeech(obj[key]);
            }
        }
    }

    // $rootScope.bodystyle = "overflow:hidden;";

    $scope.selected = function(x) {
        // Ajouter les dimentions sélectionnés a la table des zones
        $scope.zones.push(x);
        // Enlever la selection
        $rootScope.$emit('releaseCrop');
    };

    // submit crop data
    $scope.sendCrop = function(source) {

        if ($scope.zones.length < 1) {
            alert("pas de zones a découper ... ");
        }

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
    $scope.oceriser = function() {

        console.log("in controller ==> ");
        console.log($scope.currentImage);

        // Appel du websevice de l'ocerisation
        if ($scope.currentImage.source) {
            initialiseZones();
            $scope.loader = true;
            $http.post("/oceriser", {
                sourceImage: $scope.currentImage.source
            }).success(function(data, status, headers, config) {
                console.log(data);
                // Ajouter l'objet comportant le text et l'image pour l'affichage sur le workspace
                $scope.textes = {
                    source: $scope.currentImage.source,
                    text: angular.fromJson(data)
                };
                $scope.currentImage.text = angular.fromJson(data);

                // Affichage de l'éditeur
                $scope.showEditor = true;
                $scope.loader = false;
                $scope.msg = "ok";
            }).error(function(data, status, headers, config) {
                $scope.msg = "ko";
            });
        } else {
            alert("Vous devez selectionner un block ... ");
        }

    }

    $scope.modifierTexte = function() {
        // Appel du websevice de l'ocerisation
        if ($scope.currentImage.source) {
            $scope.textes = {
                text: $scope.currentImage.text
            };
            // Affichage de l'éditeur
            $scope.showEditor = true;

        } else {
            alert("Vous devez selectionner un block ... ");
        }
    }

    $scope.textToSpeech = function() {
        // var ocrText = CKEDITOR.instances.editorOcr.document.getBody().getText();
        // 
        // console.log(ocrText);
        console.log("currentImage in textToSpeech ==> ");
        var ocrText = $scope.removeAccents($scope.removeHtmlTags($scope.currentImage.text));
        $scope.currentImage.text = ocrText;
        console.log(ocrText);
        // $scope.currentImage.synthese = './files/audio/mp3/audio_0.9142583780921996.mp3';
        console.log($scope.currentImage);
        if ($scope.currentImage.text) {
            $scope.loader = true;
            if ($scope.currentImage.text.length > 0) {
                $http.post("/texttospeech", {
                    text: $scope.currentImage.text
                }).success(function(data, status, headers, config) {
                    console.log("file of speech text ==> ");
                    console.log(data);
                    $scope.currentImage.synthese = angular.fromJson(data);
                    traverseOcrSpeech($scope.blocks);
                    console.log("synthese finshed ==>  ");
                    console.log($scope.blocks);
                    console.log("ok");
                    $scope.loader = false;
                    return false;
                }).error(function(data, status, headers, config) {
                    console.log("ko");
                });
            } else {
                alert("Pas de texte enregistré pour ce block");
            }
        } else {
            alert("Pas de texte enregistré pour ce block");
        }

    }



    // WYSIWYG Editor Methods
    /* Get OCR and save it */
    $scope.getOcrText = function(argument) {
        // $scope.currentImage.text = htmlToPlaintext(CKEDITOR.instances['editorOcr'].getData());
        $scope.currentImage.text = $scope.removeHtmlTags(CKEDITOR.instances['editorOcr'].getData());
        // console.log($compile(CKEDITOR.instances['editorOcr'].getData()));
        console.log("currentImage ==> ");
        console.log($scope.currentImage);
        traverseOcrSpeech($scope.blocks);

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
                    alert("Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.");
                    console.log(+element.files[i]);
                } else {
                    $scope.files.push(element.files[i]);
                }
            }
            // $scope.progressVisible = false;
        });
    };

    $scope.uploadFile = function() {
        if ($scope.files.length > 0) {
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
        } else {
            alert("Vous devez choisir un fichier")
        }

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
        $scope.files = [];
        $scope.affectSrcValue(angular.fromJson(evt.target.responseText));
    }

    function uploadFailed(evt) {
        console.log("Erreure survenue lors de l'pload du fichier ")
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
        console.log("in workspace ==> ");
        console.log(image);
        $scope.currentImage = image;
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

    $scope.permitSaveblocks = function() {
        if ($scope.blocks.children.length < 1) {
            // alert("il n y a pas encore de choses a enregistrer");
            return true;
        } else {
            return false;
        }
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
        if ($rootScope.idDocument && $rootScope.idDocument.length > 0) {
            $rootScope.profil_id = $scope.profilSelected;
            $location.path("/apercu");
        }
    }

    /* Faire un select sur les tags / les profils */
    // Selection des tags
    $scope.afficherTags = function() {
        $http.get('/readTags')
            .success(function(data) {
            if (data != 'err') {
                $scope.listTags = data;
            }
        });
    };

    $scope.afficherTags();

    // Selection des profils
    $scope.afficherProfils = function() {
        $http.get('/listerProfil')
            .success(function(data) {
            if (data != 'err') {
                $scope.listProfils = data;
            }
        });
    };

    $scope.afficherProfils();


    $scope.updateBlockType = function() {
        $scope.currentImage.tag = $scope.tagSelected;
        traverseOcrSpeech($scope.blocks);
        // Parcour blocks and update with currentImage
    }

    $scope.playSong = function() {
        var audio = document.getElementById("player");
        audio.setAttribute("src", $scope.currentImage.synthese);
        audio.load();
        audio.play();
    }

    $scope.showPlaySong = function() {
        if ($scope.currentImage.synthese) {
            if ($scope.currentImage.synthese != '') {
                return true;
            }
        }
        return false;
    }

    // Remplacer les accents pour la synthese vocale
    $scope.removeAccents = function(value) {
        return value.replace(/&acirc;/g, 'â')
            .replace(/&Acirc;/g, 'Â')
            .replace(/&agrave/g, 'à')
            .replace(/&Agrave/g, 'À')
            .replace(/&eacute;/g, 'é')
            .replace(/&Eacute;/g, 'É')
            .replace(/&ecirc;/g, 'ê')
            .replace(/&Ecirc;/g, 'Ê')
            .replace(/&egrave;/g, 'è')
            .replace(/&Egrave;/g, 'È')
            .replace(/&euml;/g, 'ë')
            .replace(/&Euml;/g, 'Ë')
            .replace(/&icirc;/g, 'î')
            .replace(/&Icirc;/g, 'Î')
            .replace(/&iuml;/g, 'ï')
            .replace(/&Iuml;/g, 'Ï')
            .replace(/&ocirc;/g, 'ô')
            .replace(/&Ocirc;/g, 'Ô')
            .replace(/&oelig;/g, 'œ')
            .replace(/&Oelig;/g, 'Œ')
            .replace(/&ucirc;/g, 'û')
            .replace(/&Ucirc;/g, 'Û')
            .replace(/&ugrave;/g, 'ù')
            .replace(/&Ugrave;/g, 'Ù')
            .replace(/&uuml;/g, 'ü')
            .replace(/&Uuml;/g, 'Ü')
            .replace(/&ccedil;/g, 'ç')
            .replace(/&Ccedil;/g, 'Ç')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }

    // enlever les tags HTML
    $scope.removeHtmlTags = function(value) {
        // return value.replace(/['"]/g, "");
        return value.replace(/<\/?[^>]+(>|$)/g, "");
    }

});