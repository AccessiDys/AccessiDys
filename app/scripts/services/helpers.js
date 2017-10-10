/*File: helpers.js
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
/* jshint unused: false, undef:false */

var cnedApp = cnedApp;


// include underscore
cnedApp.factory('_', function () {
    return window._; // assumes underscore has already been loaded on the
    // page
});

cnedApp.factory('protocolToLowerCase', function () {
    /**
     * if the http/https protocol is uppercase, return the url with lowercase
     * protocol
     *
     * @param {string}
     *            url parameter url
     * @return {string} the url with lowercased protocol
     */
    return function (url) {
        var res = url;

        if (res) {
            var match = new RegExp('http(s)?', 'ig').exec(url);
            if (match && match.length > 0) {
                res = url.replace(match[0], match[0].toLowerCase());
            }
        }
        return res;
    };
});

cnedApp.factory('canvasToImage', function () {
    /**
     * Converts a canvas in image.
     *
     * @param canvas
     *            The canvas to convert
     * @param context
     *            The context of the canvas
     * @param backgroundColor
     *            the background color to be applied to the canvas before its conversion
     * @method $scope.canvasToImage
     */
    return function (canvas, context, backgroundColor) {
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
});


cnedApp.factory('serviceCheck',
    function ($http, $q, $location, configuration, protocolToLowerCase) {

        var statusInformation = {};
        return {
            htmlPreview: function (htmlUrl) {
                htmlUrl = protocolToLowerCase(htmlUrl);
                var deferred = $q.defer();
                var data = {
                    lien: htmlUrl
                };
                var finalData = {};
                var serviceName = '/htmlPage';

                /*$http.get(htmlUrl).then(function(res){
                    console.log('res.data');
                }, function(error){
                    console.log('error');
                });*/

                $http.post(serviceName, data)
                    .success(function (data) {
                        if (data && data.length > 0) {
                            finalData.documentHtml = data;
                        } else {
                            finalData.erreurIntern = true;
                            deferred.resolve(finalData);
                        }
                        deferred.resolve(finalData);
                        return deferred.promise;
                    })
                    .error(function (err) {
                        deferred.reject(err);
                    });
                return deferred.promise;
            },
            getSign: function (chunck) {
                var deferred = $q.defer();
                var loacalSign = {
                    filechunck: chunck
                };
                var localFilePreview = {};

                $http.post('/generateSign', loacalSign)
                    .success(function (loacalSign) {
                        console.log('loacalSign --> ', loacalSign);
                        if (loacalSign && loacalSign.sign) {
                            localFilePreview.sign = loacalSign.sign;
                        }
                        deferred.resolve(localFilePreview);
                        return deferred.promise;
                    }).error(function () {
                    localFilePreview.erreurIntern = true;
                    deferred.resolve(localFilePreview);
                });

                return deferred.promise;
            },
            checkName: function (str) {
                return /[^a-zA-Z0-9 ]+/g.test(str); // jshint ignore:line
            },
            isOnline: function () {
                return $http.head('/?t=' + Date.now());
            }
        };
    }
);

// HTTP interceptor
cnedApp.factory('app.httpinterceptor', ['$q', '_', '$rootScope',
    function ($q, _, $rootScope) {
        return {
            // optional method
            'request': function (config) {
                var exeptionUrl = [
                    'views/404/404.html',
                    'views/500/500.html',
                    'views/addDocument/addDocument.html',
                    'views/addDocument/edit-title.modal.html',
                    'views/addDocument/open-document.modal.html',
                    'views/backup/my-backup.html',
                    'views/common/bookmarklet.modal.html',
                    'views/common/confirm.modal.html',
                    'views/common/footer.html',
                    'views/common/header.html',
                    'views/common/information.modal.html',
                    'views/index/home.html',
                    'views/infoPages/about.html',
                    'views/infoPages/contribute.html',
                    'views/infoPages/mentions.html',
                    'views/infoPages/vocalHelp.html',
                    'views/listDocument/listDocument.html',
                    'views/listDocument/listDocumentModal.html',
                    'views/profiles/delegate-profile.modal.html',
                    'views/profiles/detailProfil.html',
                    'views/profiles/editProfilStyleModal.html',
                    'views/profiles/profilAffichageModal.html',
                    'views/profiles/profiles.html',
                    'views/profiles/renameProfilModal.html',
                    'views/social-share/social-share.modal.html',
                    'views/tag/edit-tag.modal.html',
                    'views/tag/tag.html',
                    'views/workspace/apercu.html',
                    'views/workspace/print.html',
                    'views/workspace/print.modal.html',
                    'template/carousel/slide.html',
                    'template/carousel/carousel.html',
                    'uib/template/modal/backdrop.html',
                    'uib/template/modal/window.html',
                    'uib/template/progressbar/progressbar.html',
                    'images/sub_menu_icons.png',
                    'images/resize_icn.png',
                    'images/list_action-arrow.png',
                    'images/action.png',
                    'images/bookmarklet_howto.png',
                    'images/bookmarklet_btn.png',
                    'images/popin_close.png',
                    'images/add_profile.png',
                    'images/pencil.png',
                    'images/select_bg.png',
                    'images/favourit_icn.png',
                    'images/add_document.png',
                    'images/parcourir.png',
                    'images/clear_uploadpdf.png',
                    'tree.html'
                ];
                if (config.method == 'GET') { // jshint ignore:line
                    if (!_.contains(exeptionUrl, config.url)) {
                        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                        if ($rootScope.testEnv) {
                            config.url = config.url;
                        } else {
                            config.url = config.url + separator + 't=' + Date.now();
                        }
                    }
                }
                return config || $q.when(config);
            },
            // optional method
            'requestError': function (rejection) {
                return $q.reject(rejection);
            },
            // optional method
            'response': function (response) {
                return response || $q.when(response);
            }
        };
    }
]);

