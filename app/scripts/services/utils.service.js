/*File: loaderServices.js
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


cnedApp.service('UtilsService', function ($uibModal) {

    var methods = {

        /**
         * Show information modal
         * @param title
         * @param content
         * @param redirection
         */
        showInformationModal: function (title, content, redirection) {
            return $uibModal.open({
                templateUrl: 'views/common/information.modal.html',
                controller: 'InformationModalCtrl',
                size: 'sm',
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content;
                    },
                    redirection: function () {
                        return redirection;
                    }
                }
            }).result;
        },

        /**
         * Open the social share modal
         * @param mode (document | profile )
         * @param itemToShare
         */
        openSocialShareModal: function (mode, itemToShare) {
            return $uibModal.open({
                templateUrl: 'views/social-share/social-share.modal.html',
                controller: 'SocialShareModalCtrl',
                size: 'lg',
                resolve: {
                    mode: function () {
                        return mode;
                    },
                    itemToShare: function () {
                        return itemToShare;
                    }
                }
            }).result;
        },

        /**
         * Open confirm modal
         * @param title
         * @param content
         */
        openConfirmModal: function (title, content, isTranslate) {
            return $uibModal.open({
                templateUrl: 'views/common/confirm.modal.html',
                controller: 'ConfirmModalCtrl',
                size: 'md',
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content;
                    },
                    isTranslate: function () {
                        return isTranslate;
                    }
                }
            }).result;
        },


        /**
         * Test the truthfulness of a link (by checking the presence of the http protocol in String)
         *
         * @method verifyLink
         * @param String link
         * @return Boolean
         */
        verifyLink: function (link) {
            return link && ((link.toLowerCase().indexOf('https') > -1) || (link.toLowerCase().indexOf('http') > -1));
        },

        /**
         * Convert  base64 to Uint8Array
         *
         * @param base64
         *        The binary to be converted.
         * @method $scope.base64ToUint8Array
         */
        base64ToUint8Array: function (base64) {
            var raw = atob(base64);
            var uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
            for (var i = 0; i < raw.length; i++) {
                uint8Array[i] = raw.charCodeAt(i);
            }
            return uint8Array;
        }

    };

    return methods;

});