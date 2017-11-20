/*File: utils.service.js
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

/* global Hyphenator  */

'use strict';

/**
 * Utils service
 */
angular.module('cnedApp').service('UtilsService', function ($uibModal) {

    var methods = {

        /**
         * Show information modal
         * @param title
         * @param content
         * @param redirection
         */
        showInformationModal: function (title, content, redirection, isTranslate, showTipsAgain) {
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
                    },
                    showTipsAgain: function() {
                        return showTipsAgain;
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
         * Open new folder modal
         * @param title
         * @param erros
         * @param mode
         */
        openNewFolderModal: function (title, errors, mode) {
            return $uibModal.open({
                templateUrl: 'views/addDocument/add-folder.modal.html',
                controller: 'AddFolderCtrl',
                size: 'md',
                resolve: {
                    title: function () {
                        return title;
                    },
                    errors: function () {
                        return errors;
                    },
                    mode: function () {
                        return mode;
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
         * Generate a unique key
         * @returns {number}
         */
        generateUniqueId: function () {
            var date = new Date().getTime();
            date += (parseInt(Math.random() * 1000)).toString();
            return date;
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
        },

        replaceLink: function (text) {
            var res = text;
            if (res) {
                res = res.replace(/href="#(?:.*?)"/gi, '');
                res = res.replace(/href="\/{2}(?:.*?)"/gi, '');
                res = res.replace(/href="null(?:.*?)"/gi, '');
                res = res.replace(/href="(.*?)"/gi, 'href="/#/apercu?url=$1"');
            }
            return res;
        },

        /**
         * Remove span in html string
         * @param html
         * @returns {*} Html cleaned
         */
        removeSpan: function (html) {
            var cleanedHtml = html;

            if (cleanedHtml) {
                cleanedHtml = cleanedHtml.replace(/<span(.*?)>/gi, '');
                cleanedHtml = cleanedHtml.replace(/<\/span>/gi, '');
            }

            return cleanedHtml;
        },

        /**
         * Split text by syllable
         * @param text
         */
        splitOnSyllable: function (text) {
            var formattedText = text;

            if (formattedText) {
                formattedText = Hyphenator.hyphenate(formattedText, 'fr');

                formattedText = formattedText.replace(methods.wordRegex, '<span>$1</span>');
                formattedText = formattedText.replace(/(\|)/gi, '</span><span>');
            }

            return formattedText;
        },

        /**
         * Split text by word
         * @param text
         */
        splitOnWordWithOutSpace: function (text) {
            var formattedText = text;

            if (formattedText) {
                formattedText = text.replace(/&nbsp;/gi, ' ');
                formattedText = formattedText.replace(methods.wordRegex, '<span>$1</span> ');
            }

            return formattedText;
        },

        /**
         * Split Text by word
         * @param text
         */
        splitOnWordWithSpace: function (text) {
            var formattedText = text;

            if (formattedText) {
                formattedText = text.replace(/&nbsp;/gi, ' ');
                formattedText = formattedText.replace(methods.wordRegex, '<span>$1 </span>');
            }

            return formattedText;
        },

        /**
         * Split Text by sentences (Maj to point)
         * @param text
         */
        splitOnSentenceWithPoint: function (text) {
            var formattedText = text;
            var tmpText = '';

            if (formattedText) {
                formattedText = text.replace(/&nbsp;/gi, ' ');
                //formattedText = formattedText.replace(methods.sentenceRegex, '<span>$1 </span>');
                formattedText = formattedText.split(methods.sentencePointRegex);

                for(var i = 0; i < formattedText.length; i++){
                    if( i % 2 === 0 ) {
                        tmpText += '<span>' + formattedText[i];
                    } else {
                        tmpText += formattedText[i] + ' </span>';
                    }
                }
            }

            return tmpText;
        },

        /**
         * Split Text by sentences (Maj to point)
         * @param text
         */
        splitOnSentenceWithComma: function (text) {
            var formattedText = text;
            var tmpText = '';

            if (formattedText) {
                formattedText = text.replace(/&nbsp;/gi, ' ');
                //formattedText = formattedText.replace(methods.sentenceRegex, '<span>$1 </span>');
                formattedText = formattedText.split(methods.sentencePointRegex);
                for(var j = 0; j < formattedText.length; j++) {
                    formattedText[j] = formattedText[j].split(',');
                }

                for(var i = 0; i < formattedText.length; i++){
                    if( i % 2 === 0) {
                        for (var l = 0; l < formattedText[i].length; l++) {
                            if (formattedText[i].length > 1 && (l < (formattedText[i].length - 1))) {
                                tmpText += '<span>' + formattedText[i][l] + ', </span>';
                            } else {
                                tmpText += '<span>' + formattedText[i][l];
                            }
                        }
                    } else {
                        tmpText += formattedText[i] + ' </span>';
                    }
                }
                if(formattedText.length % 2 === 1){
                    tmpText += '</span>';
                }
            }

            return tmpText;
        },

        /**
         * Split Text by sentences (Maj to point)
         * @param text
         */
        splitOnSentenceWithSemicolon: function (text) {
            var formattedText = text;
            var tmpText = '';

            if (formattedText) {
                formattedText = text.replace(/&nbsp;/gi, ' ');
                formattedText = formattedText.split(methods.sentencePointRegex);
                for(var j = 0; j < formattedText.length; j++) {
                    formattedText[j] = formattedText[j].split(';');
                }

                for(var i = 0; i < formattedText.length; i++){
                    if( i % 2 === 0) {
                        for (var l = 0; l < formattedText[i].length; l++) {
                            if (formattedText[i].length > 1 && (l < (formattedText[i].length - 1))) {
                                tmpText += '<span>' + formattedText[i][l] + '; </span>';
                            } else {
                                tmpText += '<span>' + formattedText[i][l];
                            }
                        }
                    } else {
                        tmpText += formattedText[i] + ' </span>';
                    }
                }
            }

            return tmpText;
        },

        /**
         * Regex to select words in text
         */
        wordRegex: /([^><\s]+)(?![^<]*>)/gi,
        // /([\w,.'&;:"«»:%\?\-éèœëêçàâôîùïö\(\)\/]+)(?![^<]*>)/gi
        sentencePointRegex: /([.?!])\s*(?=[A-Z])/g,

        /**
         * Color lines of Node element
         * @param ref Node element
         * @param maxLines
         * @returns {DocumentFragment}
         */
        colorLines: function (ref, maxLines, prevTop, line) {
            var isLink = ref.tagName === 'A';
            var documentFragment = document.createDocumentFragment();
            documentFragment.appendChild(ref.cloneNode(true));
            documentFragment.childNodes[0].innerHTML = '';

            for (var i = 0; i < ref.children.length; i++) {

                var child = ref.children[i];
                var clone = child.cloneNode(true);

                if (child.tagName !== 'SPAN' && child.hasChildNodes()) {
                    var res = methods.colorLines(child, maxLines, prevTop, line);
                    clone = res.documentFragment;
                    line = res.line;
                    prevTop = res.prevTop;
                } else if (child.tagName === 'SPAN') {
                    if (!child.id) {
                        var top = child.offsetTop;

                        if (top > prevTop) {
                            if (line >= maxLines) {
                                line = 1;
                            } else {
                                line++;
                            }
                            prevTop = top;
                        }
                        clone.className = 'line' + line;
                        clone.setAttribute("prevtop", prevTop);
                        clone.setAttribute("currenttop", top);
                        if(isLink){
                            clone.setAttribute("style","text-decoration:underline;cursor:pointer");
                        }

                    }
                }
                documentFragment.childNodes[0].appendChild(clone);
            }

            return {
                documentFragment : documentFragment,
                prevTop: prevTop,
                line: line
            };
        },

        decodeHtmlEntities: function (html) {
            if(html){
                return html.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi,
                    function (str) {
                        var temp = document.createElement('p');
                        temp.innerHTML = str;
                        str = temp.textContent || temp.innerText;
                        return str;
                    }
                );
            } else {
                return html;
            }
        },

        verifyColorsList: function(profileTag) {
            if( !profileTag.colorsList || profileTag.colorsList.length < 1) {
                var coloration = profileTag.coloration;
                var colorationType = '';
                var colors = '';
                var colorsList = [];


                if(profileTag.coloration.indexOf('Pas de coloration') > -1) {
                    colorationType = 'Pas de coloration';
                }else if(profileTag.coloration.indexOf('Colorer les lignes') > -1) {
                    colorationType = 'Colorer les lignes';
                }else if(profileTag.coloration.indexOf('Colorer les mots') > -1) {
                    colorationType = 'Colorer les mots';
                    colors = 'RBV';
                    colorsList = ['#D90629', '#066ED9', '#4BD906'];
                }else if(profileTag.coloration.indexOf('Colorer les syllabes') > -1) {
                    colorationType = 'Colorer les syllabes';
                    colors = 'RBV';
                    colorsList = ['#D90629', '#066ED9', '#4BD906'];
                }else if(profileTag.coloration.indexOf('Surligner les lignes') > -1) {
                    colorationType = 'Surligner les lignes';
                }else if(profileTag.coloration.indexOf('Surligner les mots') > -1) {
                    colorationType = 'Surligner les mots';
                    colors = 'RBV';
                    colorsList = ['#D90629', '#066ED9', '#4BD906'];
                }else if(profileTag.coloration.indexOf('Surligner les syllabes') > -1) {
                    colorationType = 'Surligner les syllabes';
                    colors = 'RBV';
                    colorsList = ['#D90629', '#066ED9', '#4BD906'];
                }

                if(profileTag.coloration.indexOf('RBV') > -1) {
                    colors = 'RBV';
                    colorsList = ['#D90629', '#066ED9', '#4BD906'];
                }else if(profileTag.coloration.indexOf('RVJ') > -1) {
                    colors = 'RVJ';
                    colorsList = ['#D90629', '#4BD906', '#ECE20F'];
                }else if(profileTag.coloration.indexOf('RBVJ') > -1) {
                    colors = 'RBVJ';
                    colorsList = ['#D90629', '#066ED9', '#4BD906', '#ECE20F'];
                }else if(profileTag.coloration.indexOf('Personnaliser') > -1) {
                    colors = 'Personnaliser';
                }

                profileTag.colorationType = colorationType;
                profileTag.colors = colors;
                profileTag.colorsList = colorsList;
                profileTag.souffleType = '[Maj. - \'.\']';
            }
        }
    };

    return methods;

});