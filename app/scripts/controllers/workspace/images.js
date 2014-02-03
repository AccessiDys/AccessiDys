'use strict';

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope, $location, $compile, _, removeAccents, removeHtmlTags) {

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
    $rootScope.idDocument = [];
    // Liste des tags
    $scope.listTags = [];
    // Initialisation liste profils
    $scope.listProfils = [];
    // Ordonner les zones sur decoupage
    var orderZones = 0;


    /* Ajout nouveaux blocks */
    $scope.toggleMinimized = function(child) {
        child.minimized = !child.minimized;
    };

    /* Mettre à jour la structure des Blocks apres un Drag && Drop */
    $scope.updateDragDrop = function(event, ui) {
        var root = event.target,
            item = ui.item,
            parent = item.parent(),
            target = (parent[0] === root) ? $scope.blocks : parent.scope().child,
            child = item.scope().child,
            index = item.index();

        if (!target.children) {
            target.children = [];
        }

        // target.children || (target.children = []);

        function walk(target, child) {
            var children = target.children,
                i;
            if (children) {
                i = children.length;
                while (i--) {

                    if (children[i] === child) {
                        return children.splice(i, 1);
                    } else {
                        walk(children[i], child);
                    }
                }
            }
        }
        walk($scope.blocks, child);
        target.children.splice(index, 0, child);
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
            if (typeof(obj[key]) === 'object') {
                if ($scope.currentImage.source === obj[key].source) {
                    for (var j = 0; j < $scope.cropedImages.length; j++) {
                        obj[key].children.push({
                            text: cropedImages[j].text,
                            source: cropedImages[j].source,
                            order: cropedImages[j].order,
                            children: []
                        });
                    }
                }
                traverse(obj[key], cropedImages);
            }
        }
    }

    function traverseOcrSpeech(obj) {
        for (var key in obj) {
            if (typeof(obj[key]) === 'object') {
                if ($scope.currentImage.source === obj[key].source) {
                    obj[key].text = $scope.currentImage.text;
                    obj[key].synthese = $scope.currentImage.synthese;
                    obj[key].tag = $scope.currentImage.tag;
                    break;
                }
                traverseOcrSpeech(obj[key]);
            }
        }
    }

    $scope.selected = function(x) {
        // Ajouter les dimentions sélectionnés a la table des zones
        orderZones += 1;
        x.order = orderZones;
        x._id = Math.random();
        $scope.zones.push(x);
        // Enlever la selection
        $rootScope.$emit('releaseCrop');
    };

    $scope.removeZone = function(idZone) {
        for (var i = 0; i < $scope.zones.length; i++) {
            if ($scope.zones[i]._id === idZone) {
                $scope.zones.splice(i, 1);
            }
        }
    };

    /*Envoi des zones pour le découpage*/
    $scope.sendCrop = function(source) {

        if ($scope.zones.length < 1) {
            alert('Aucune zone n\'est encore sélectionnéz ... ');
        }

        // initialiser le nombre d'appel du service du découpage a 0
        var callsFinish = 0;
        // Initialiser la table des image découpés
        $scope.cropedImages = [];

        // Parcourir les zones pour déoupage
        angular.forEach($scope.zones, function(zone) {
            // afficher le loader
            $scope.loader = true;
            // Ajouter l'image de source pour le découpage
            zone.srcImg = source;

            // Appel du service de découpage
            $http.post('/images', {
                DataCrop: zone
            }).success(function(data) {

                // Créer un objet avec l'image découpée
                var responseImage = angular.fromJson(data);
                var imageTreated = {};
                imageTreated.source = responseImage.source;
                imageTreated.text = '';
                imageTreated.level = Number($scope.currentImage.level + 1);
                imageTreated.children = [];
                imageTreated.order = responseImage.order;
                $scope.cropedImages.push(imageTreated);

                // incrémenter le nombre d'appel du service de 1
                callsFinish += 1;
                /* Si le nombre d'appel est égale au nombre de zones 
                Parcourir le tableau des images découpés est l'ajouter a la liste generale des blocks  */
                if ($scope.zones.length === callsFinish) {

                    // Enlever le loader
                    $scope.loader = false;
                    // Initialiser les zones
                    initialiseZones();
                    $scope.cropedImages = _.sortBy($scope.cropedImages, 'order');
                    // Détecter le parent des blocks et ajouter les images découpés a ce block
                    traverse($scope.blocks, $scope.cropedImages);
                }
            }).error(function() {
                $scope.msg = 'ko';
            });
        });

    };

    // Initialiser la liste des zones

    function initialiseZones() {
        $scope.zones = [];
    }


    // Appliquer l'océrisation
    $scope.oceriser = function() {

        // console.log('in controller ==> ');
        // console.log($scope.currentImage);

        // Appel du websevice de l'ocerisation
        if ($scope.currentImage.source) {
            initialiseZones();
            $scope.loader = true;
            $http.post('/oceriser', {
                sourceImage: $scope.currentImage.source
            }).success(function(data) {
                // Ajouter l'objet comportant le text et l'image pour l'affichage sur le workspace
                $scope.textes = {
                    source: $scope.currentImage.source,
                    text: angular.fromJson(data)
                };
                $scope.currentImage.text = angular.fromJson(data);

                // Affichage de l'éditeur
                $scope.showEditor = true;
                $scope.loader = false;
                $scope.msg = 'ok';
            }).error(function() {
                $scope.msg = 'ko';
            });
        } else {
            alert('Vous devez selectionner un block ... ');
        }

    };

    $scope.modifierTexte = function() {
        if ($scope.currentImage.source) {
            $scope.textes = {
                text: $scope.currentImage.text
            };
            $scope.showEditor = true;
        } else {
            alert('Vous devez selectionner un block ... ');
        }
    };

    $scope.textToSpeech = function() {
        var ocrText = removeAccents(removeHtmlTags($scope.currentImage.text));
        $scope.currentImage.text = ocrText;
        if ($scope.currentImage.text) {
            $scope.loader = true;
            if ($scope.currentImage.text.length > 0) {
                $http.post('/texttospeech', {
                    text: $scope.currentImage.text
                }).success(function(data) {
                    $scope.currentImage.synthese = angular.fromJson(data);
                    traverseOcrSpeech($scope.blocks);
                    $scope.loader = false;
                    return false;
                }).error(function() {
                    console.log('ko');
                });
            } else {
                alert('Pas de texte enregistré pour ce block');
            }
        } else {
            alert('Pas de texte enregistré pour ce block');
        }

    };



    /* WYSIWYG Editor Methods */
    /* Get OCR and save it */
    $scope.getOcrText = function() {
        $rootScope.$emit('getCkEditorValue');
        $scope.currentImage.text = removeHtmlTags($rootScope.ckEditorValue);
        traverseOcrSpeech($scope.blocks);
        $scope.textes = {};
        // Affichage de l'éditeur
        $scope.showEditor = false;
    };


    /* Fonctions de l'upload des fichiers */
    $scope.setFiles = function(element) {
        $scope.$apply(function() {
            // Turn the FileList object into an Array
            for (var i = 0; i < element.files.length; i++) {
                if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf') {
                    alert('Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.');
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
                fd.append('uploadedFile', $scope.files[i]);
            }
            var xhr = new XMLHttpRequest();
            // xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener('load', $scope.uploadComplete, false);
            xhr.addEventListener('error', uploadFailed, false);
            // xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open('POST', '/fileupload');
            $scope.progressVisible = true;
            xhr.send(fd);
            $scope.loader = true;
        } else {
            alert('Vous devez choisir un fichier');
        }

    };

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
        console.log('upload complete');
        console.log(angular.fromJson(evt.target.responseText));
        $scope.affectSrcValue(angular.fromJson(evt.target.responseText));
    };

    function uploadFailed(evt) {
        console.log('Erreure survenue lors de l\'pload du fichier ');
        console.log(evt);
    }

    /*function uploadCanceled(evt) {
        $scope.$apply(function() {
            $scope.progressVisible = false
        })
        console.log("The upload has been canceled by the user or the browser dropped the connection.")
    }*/

    $scope.affectSrcValue = function(srcs) {
        $rootScope.$emit('distroyJcrop');
        console.log('sources ==> ');
        console.log(srcs);
        for (var i = 0; i < srcs.length; i++) {
            console.log('sources ==> ');
            console.log(srcs[i]);
            if (srcs[i].extension === '.pdf') {
                alert('Le fichier est chargé avec succès, Conversion des pages en cours ... ');
                // Convert Pdf to images
                convertImage(0, srcs[i].numberPages, srcs[i].path);
            } else {
                $scope.blocks.children.push({
                    level: 0,
                    text: '',
                    synthese: '',
                    source: srcs[i].path,
                    children: []
                });
            }

        }
        initialiseZones();
        $scope.files = [];
        $scope.loader = false;

        // refresh scope binding : for callbacks of methods not with angularJS
        $scope.$apply();
    };

    function convertImage(page, totalPages, source) {
        $http.post('/pdfimage', {
            pdfData: {
                source: source,
                page: page
            }
        }).success(function(data) {
            console.log(angular.fromJson(data));
            $scope.blocks.children.push({
                level: 0,
                text: '',
                synthese: '',
                source: angular.fromJson(data).path,
                children: []
            });
            console.log('success N ==> ' + page);
            console.log(page < totalPages);
            page += 1;
            if (page < totalPages) {
                console.log('inside IF ==> ');
                convertImage(page, totalPages, source);
            }
        }).error(function() {
            console.log('ko');
        });
    }

    // Export Image to workspace
    $scope.workspace = function(image) {
        $scope.currentImage = image;
        initialiseZones();
        $scope.textes = {};
        $scope.showEditor = false;
    };

    $scope.permitSaveblocks = function() {
        if ($scope.blocks.children.length < 1) {
            // alert("il n y a pas encore de choses a enregistrer");
            return true;
        } else {
            return false;
        }
    };

    $scope.saveblocks = function() {

        // Selection des profils
        $http.get('/listerProfil')
            .success(function(data) {
            if (data !== 'err') {
                $scope.listProfils = data;
            }
        });

        $http.post('/ajouterDocStructure', angular.toJson($scope.blocks.children))
            .success(function(data) {
            $rootScope.idDocument = angular.fromJson(data);
            console.log(data);
            console.log('ok');
        }).error(function() {
            console.log('ko');
        });

    };

    $scope.showlocks = function() {
        console.log('show blocks clicked ... ');
        if ($rootScope.idDocument && $rootScope.idDocument.length > 0) {
            $rootScope.profilId = $scope.profilSelected;
            $location.path('/apercu');
        }
    };

    // Selection des tags
    $scope.afficherTags = function() {
        $http.get('/readTags')
            .success(function(data) {
            if (data !== 'err') {
                $scope.listTags = data;
            }
        });
    };

    $scope.afficherTags();

    $scope.updateBlockType = function() {
        $scope.currentImage.tag = $scope.tagSelected;
        traverseOcrSpeech($scope.blocks);
        // Parcour blocks and update with currentImage
    };

    $scope.playSong = function() {
        var audio = document.getElementById('player');
        audio.setAttribute('src', $scope.currentImage.synthese);
        audio.load();
        audio.play();
    };

    $scope.showPlaySong = function() {
        if ($scope.currentImage.synthese) {
            if ($scope.currentImage.synthese !== '') {
                return true;
            }
        }
        return false;
    };

});