'use strict';

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope) {

    $scope.cropedImages = [];
    $scope.zones = [];
    $scope.loader = false;
    $scope.editor = false;
    $scope.srcfile = ""; //files/cours.png
    $scope.currentImage = {};
    $scope.blocks = [];
    $scope.textes = [];
    // $rootScope.bodystyle = "overflow:hidden;";

    $scope.selected = function(x) {
        $scope.zones.push(x);
        // console.log($scope.zones);
        $rootScope.$emit('releaseCrop');
    };

    // submit crop data
    $scope.sendCrop = function(source) {

        // get crop informations
        // console.log("sendCrop");
        var callsFinish = 0;
        $scope.cropedImages = [];

        $scope.bodystyle = "overflow:hidden;";

        angular.forEach($scope.zones, function(zone, key) {
            $scope.loader = true;
            zone.srcImg = source;
            $http.post("/images", {
                DataCrop: zone
            }).success(function(data, status, headers, config) {
                var imageTreated = {};
                imageTreated.source = angular.fromJson(data);
                imageTreated.text = '';
                imageTreated.titre = '';
                imageTreated.level = Number($scope.currentImage.level + 1);
                imageTreated.children = [];
                $scope.cropedImages.push(imageTreated);

                callsFinish += 1;
                if ($scope.zones.length == callsFinish) {
                    // console.log("Ajax calls ae finished");
                    $scope.loader = false;
                    $scope.zones = [];

                    // Get parent of images
                    for (var i = $scope.blocks.length - 1; i >= 0; i--) {
                        if ($scope.blocks[i].source == $scope.currentImage.source) {
                            // console.log("this is parent ... ");
                            $scope.blocks[i].children = $scope.cropedImages;
                            for (var j = 0; j < $scope.cropedImages.length; j++) {
                                $scope.blocks.splice(i + j + 1, 0, $scope.cropedImages[j]);
                            };
                            // $scope.cropedImages = [];
                        }
                    };
                }
            }).error(function(data, status, headers, config) {
                $scope.msg = "ko";
            });
        });

    };


    // Appliquer l'océrisation
    $scope.oceriser = function(source) {
        // console.log(source);
        $scope.zones = [];

        // Get text by OCR
        $http.post("/oceriser", {
            sourceImage: source
        }).success(function(data, status, headers, config) {

            // console.log(data);
            $scope.textes.push({
                source: source,
                editor: $scope.addEditor(angular.fromJson(data)),
                text: angular.fromJson(data)
            });
            $scope.currentImage.source = "";
            $scope.editor = true;

            // imageTreated.text = angular.fromJson(data);
            // imageTreated.editor = $scope.addEditor(imageTreated.text);
            // $scope.cropedImages.push(imageTreated);
            // console.log($scope.cropedImages);

            $scope.msg = "ok";
        }).error(function(data, status, headers, config) {
            $scope.msg = "ko";
        });
    }



    // WYSIWYG Editor Methods
    $scope.addEditor = function(text) {
        $scope.isDisabled = true;
        $scope.ckEditors = [];
        var init = text;
        $scope.ckEditors.push({
            value: init
        });
        $scope.decision = true;

        $scope.editor = {
            value: init
        };
    };

    $scope.getHtmlOcrText = function() {
        $scope.editorValue = CKEDITOR.instances['editor1'].getData();
    }

    // Upload Files fiunctions
    $scope.setFiles = function(element) {
        $scope.$apply(function(scope) {
            // console.log('files:', element.files);
            // Turn the FileList object into an Array
            $scope.files = []
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

    $scope.affectSrcValue = function(src) {
        $rootScope.$emit('distroyJcrop');
        $scope.srcfile = src;
        $scope.blocks.push({
            source: src,
            text: '',
            children: [],
            level: 0
        });
        $scope.zones = [];

        // refresh scope binding : for callbacks of methods not with angularJS
        $scope.$apply();
    }

    // Export Image to workspace
    $scope.workspace = function(image) {
        // console.log(image + ' ==> in workspace');
        $scope.currentImage.source = image.source;
        $scope.currentImage.level = image.level;
        $scope.zones = [];
        $scope.textes = [];
    }

    $scope.textToSpeech = function() {
        var ocrText =  CKEDITOR.instances.editor1.document.getBody().getText();
        //remplace les caractères spéciaux
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
    
});