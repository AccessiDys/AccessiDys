/* File: confirm.modal.js
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

angular.module('cnedApp').controller('OcrModalCtrl', function ($scope, $rootScope, $uibModalInstance, $timeout, image) {

    $scope.image = image;
    $scope.croppedImageSrc = null;
    $scope.ocrBarProgress = {
        display: false,
        progress: 0,
        max: 100
    };


    $uibModalInstance.opened.then(function () {

        $timeout(function () {
            var image = document.getElementById('image');
            var cropper = new Cropper(image, {
                zoomable: false,
                autoCropArea: 1,
                crop: function (e) {
                    $scope.croppedImageSrc = cropper.getCroppedCanvas().toDataURL();
                    $scope.$apply();
                }
            });
        }, 0);
    });


    $scope.launchOcr = function () {

        var cropped = document.getElementById('cropped-image');

        if (Tesseract) {
            $scope.ocrBarProgress.display = true;
            Tesseract.recognize(cropped, {
                lang: 'fra'
            })
                .progress(function (packet) {
                    if (packet.status === 'recognizing text') {
                        $scope.ocrBarProgress.progress = parseInt(packet.progress * 100);
                        $scope.$apply();
                    }
                })

                .then(function (result) {
                    $scope.ocrBarProgress.display = false;
                    $uibModalInstance.close({
                        result: result.text
                    });
                })
        } else {
            // TODO display error message
        }


    };


    $scope.closeModal = function () {
        $uibModalInstance.close();
    };

    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };


});
