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

/*global cnedApp */
cnedApp.service('UtilsService', function ($uibModal) {

    var methods = {

        /**
         * Show information modal
         * @param title
         * @param content
         * @param redirection
         */
        showInformationModal: function (title, content, redirection, isTranslate) {
            return $uibModal.open({
                templateUrl: 'views/common/information.modal.html',
                controller: 'InformationModalCtrl',
                size: 'md',
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content;
                    },
                    redirection: function () {
                        return redirection;
                    },
                    isTranslate: function () {
                        return isTranslate;
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
         * Open upgrade modal
         */
        openUpgradeModal: function () {

            return $uibModal.open({
                templateUrl: 'views/common/upgrade.modal.html',
                controller: 'UpgradeModalCtrl',
                size: 'upgrade'
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
        },

        /**
         * Verify if a string is valid
         * @param chaine
         * @returns {boolean}
         */
        verifyString: function (chaine) {
            var ck_nomPrenom = /^[A-Za-z0-9éèàâîôç\-' ]{1,100}$/;
            if (chaine === null) {
                return false;
            }
            if (!ck_nomPrenom.test(chaine)) {
                return false;
            }
            return true;
        },

        /**
         * Verify a password
         * @param password
         * @returns {boolean}
         */
        verifyPassword: function (password) {
            var ck_password = /^[A-Za-z0-9éèàâîôç!@#$%^&*()_]{6,20}$/;

            if (!ck_password.test(password)) {
                return false;
            }
            return true;
        },

        /**
         * Clean all special chars
         * @param str String to clean
         * @returns {string}
         */
        cleanUpSpecialChars: function (str) {
            str = str.replace(/[ÀÁÂÃÄÅÆ]/g, 'A');
            str = str.replace(/[àáâãäåæ]/g, 'a');
            str = str.replace(/[Ç]/g, 'C');
            str = str.replace(/[ç]/g, 'c');
            str = str.replace(/[éèêë]/g, 'e');
            str = str.replace(/[ÈÉÊË]/g, 'E');
            str = str.replace(/[îï]/g, 'i');
            str = str.replace(/[ÎÏ]/g, 'I');
            str = str.replace(/[ôœ]/g, 'o');
            str = str.replace(/[ÔŒ]/g, 'O');
            str = str.replace(/[ùûü]/g, 'u');
            str = str.replace(/[ÙÛÜ]/g, 'U');
            str = str.replace(/[ÿ]/g, 'y');
            str = str.replace(/[Ÿ]/g, 'y');

            return str.replace(/[^a-z0-9]/gi, ' ');
        }

    };

    return methods;

});