/* File: htmlEpubConverter.js
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
/* global $:false */
/* global cnedApp:false */
/* jshint unused: false, undef:false */

/**
 * Les fonctions déclarés directement dans le fichiers
 * 
 * @class Default
 */

var baseUrl = '';

/**
 * ce service offre 4 principales fonctionnalités à savoir : conversion de
 * l'html, changer les images, affecter les identifiants aux blocks, nettoyer
 * l'html
 * 
 * @class ServiceHtmlEpubTool
 */
cnedApp.factory('htmlEpubTool', [ '$q', 'generateUniqueId',

function($q, generateUniqueId) {
    return {
        cleanHTML : function(htmlFile) {
            var deferred = $q.defer();
            var dictionnaireHtml = {
                tagId : [ '#ad_container', '#google_ads', '#google_flash_embed', '#adunit', '#navbar', '#sidebar' ],
                tagClass : [ '.GoogleActiveViewClass', '.navbar', '.subnav', '.support', '.metabar' ],
                tag : [ 'objet', 'object', 'script', 'link', 'meta', 'button', 'embed', 'form', 'frame', 'iframe', 'noscript', 'nav', 'footer', 'aside', 'header' ]
            };
            var removeElements = function(text, selector) {
                var wrapped = $('<div>' + text + '</div>');
                wrapped.find(selector).remove();
                return wrapped.html();
            };
            var i;
            var htmlFilePure;
            if (!angular.isUndefined(htmlFile)) {
                try {
                    htmlFilePure = htmlFile.documentHtml.replace(/^[\S\s]*<body[^>]*?>/i, '<body>').replace(/<\/body[\S\s]*$/i, '</body>');
                } catch (err) {
                    try {
                        htmlFilePure = htmlFile.documentHtml.substring(htmlFile.documentHtml.indexOf('<body'), htmlFile.documentHtml.indexOf('</body>'));
                    } catch (err2) {
                        deferred.reject(err);
                        return deferred.promise;
                    }
                }
            }
            htmlFile = htmlFilePure;

            if (htmlFile !== null && htmlFile) {
                for (i = 0; i < dictionnaireHtml.tag.length; i++) {
                    htmlFile = removeElements(htmlFile, dictionnaireHtml.tag[i]);
                }
                for (i = 0; i < dictionnaireHtml.tagClass.length; i++) {
                    htmlFile = removeElements(htmlFile, dictionnaireHtml.tagClass[i]);
                }
                deferred.resolve(htmlFile);
            } else {
                deferred.reject('No html');
            }
            return deferred.promise;
        },
        convertToHtml : function(files) {
            var data = {
                html : [],
                img : []
            }, reader = new FileReader(), deffered = $q.defer();

            reader.onload = function(event) {
                var zip = new JSZip(event.target.result);

                for ( var name in zip.files) {
                    if (name.indexOf('.ncx') !== -1) {
                        var directory = name.substring(0, name.lastIndexOf('/'));
                        var indexFileName = name;
                        var indexFileNameContent = zip.files[name].asText();

                        var filesRegex = /content.*src=\"(.*)"/g;

                        var match = filesRegex.exec(indexFileNameContent);
                        while (match !== null) {
                            var file = match[1];
                            if (file.indexOf('#') === -1) {
                                data.html.push({
                                    link : directory + '/' + file,
                                    dataHtml : zip.files[directory + '/' + file].asText()
                                });
                            }
                            match = filesRegex.exec(indexFileNameContent);
                        }

                    } else if (name.indexOf('images') !== -1) {
                        var binary = zip.files[name].asBinary();
                        data.img.push({
                            link : name.replace('OEBPS/', '').replace('OPS/', ''),
                            data : btoa(binary)
                        });
                    }
                }
                deffered.resolve(data);
            };

            for (var i = 0; i < files.length; i++) {
                reader.readAsArrayBuffer(files[i]);
            }

            return deffered.promise;

        }

    };
} ]);
