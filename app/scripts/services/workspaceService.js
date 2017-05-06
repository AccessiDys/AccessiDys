/* File: workspaceService.js
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
/*jslint browser: true, plusplus: true*/
/* jshint loopfunc:true */
/*global angular*/

'use strict';
var cnedApp = cnedApp;

cnedApp.service('workspaceService', function workspaceService($log, $localForage, configuration, $rootScope) {
    var retContent = [],
        urlHost,
        urlPort,
        self = this;

    /**
     * Generate the html line of the plan corresponding to the element
     * @param element
     *  @param tag
     * @method  $scope.generatePlan
     */
    function generatePlan(element, tag, page, block) {

        var balise = tag.balise;
        if (balise === 'h1' || balise === 'h2' || balise === 'h3' || balise === 'h4' || balise === 'h5' || balise === 'h6') {
            var margin = 180;
            if (tag.niveau !== 0) {
                margin = (tag.niveau - 1) * 30;
            }
            var name = element.innerHTML;
            var reg = new RegExp('<.[^<>]*>', 'gi');
            name = name.replace(reg, '');
            retContent[0] += '<p style="margin-left:' + margin + 'px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" data-ng-click="setActive($event,' + page + ',' +
                block + ')">' + name + '</p>';
        }

    }

    /**
     * Handle the links recursively(for the lists in particular).
     * @param element
     * @method  $scope.processChildNode
     */
    function processChildNode(element) {
        for (var i = 0; i < element.childNodes.length; i++) {
            var child = element.childNodes[i];
            if (child.localName === 'a') {
                if (child.hash) {

                    var text = document.createTextNode(child.innerHTML);
                    element.replaceChild(text, child);
                } else {
                    if (configuration.URL_REQUEST.indexOf(child.host) > -1) {
                        if (urlHost && urlPort !== 0) {
                            child.hostname = urlHost;
                            child.port = urlPort;
                            //child.href = child.href.replace(/https:\/\//g, 'http://');
                        }
                    }
                    // replacing "%3A" by ":" .Otherwise the browser makes a rerouting and the page is present twice in the history
                    child.href = configuration.URL_REQUEST + '/#/apercu?url=' + encodeURIComponent(child.href).replace(/%3A/g, ':');
                }
            }
            if (child.localName === 'img') {
                if (child.src.indexOf(configuration.URL_REQUEST) > -1) {
                    child.src = child.src.replace(configuration.URL_REQUEST, 'https://' + urlHost);
                }
            }
            if (child.childNodes.length > 0) {
                processChildNode(child);
            }
        }
    }

    this.restoreNotesStorage = function (docSignature) {
        var mapNotes,
            notes,
            retNotes = [],
            i;
        if (localStorage.getItem('notes')) {
            mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
            notes = [];

            if (mapNotes.hasOwnProperty(docSignature)) {
                notes = mapNotes[docSignature];
            }
            for (i = 0; i < notes.length; i++) {
                retNotes.push(notes[i]);
            }
        }
        return retNotes;
    };

    /**
     * temporary saves notes for printing
     * @param  an array of note objects
     * @return a promise
     */
    this.saveTempNotesForPrint = function (notes) {
        localStorage.setItem('tempNotes', angular.toJson(notes));
    };

    /**
     * get temporary stored notes for printing
     * @return an array of notes
     */
    this.getTempNotesForPrint = function () {
        var mapNotes = [];
        if (localStorage.getItem('tempNotes')) {
            mapNotes = angular.fromJson(localStorage.getItem('tempNotes'));
        }
        return mapNotes;
    };

    /*
     * Gets the list of notes of localStorage and display them in the overview.
     */
    this.parcourirHtml = function (data, host, port) {

        urlHost = host;
        urlPort = port;
        retContent = [];
        retContent[0] = '<h1>Sommaire</h1><br />';

        data = data.replace(/<span(.*?)>/gi, '');
        data = data.replace(/<\/span>/gi, '');


        var pages = self.splitPages(data);

        for (var page = 0; page < pages.length; page++) {
            var block = 0;

            console.log('Ret content before', retContent);

            //retContent.push(pages[page]);
            console.log('Ret content after', retContent);
            var element = angular.element(pages[page]);


            angular.forEach(element, function (element) {
                $rootScope.tags.forEach(function (tag) {
                    if (element.localName === tag.balise) {
                        if (tag.balise === 'div') {
                            if (angular.element(element).hasClass(self.cleanString(tag.libelle))) {
                                block = self.processElement(element, tag, page, block);
                            }
                        } else {
                            block = self.processElement(element, tag, page, block);
                        }

                    }
                });
            });

        }

        return retContent;
    };
    /**
     * Delete accents
     * @param string
     * @method  $scope.cleanAccent
     */
    this.cleanAccent = function (string) {

        // specified letters for replace
        var from = 'àáäâèéëêěìíïîòóöôùúüûñçčřšýžďťÀÁÄÂÈÉËÊĚÌÍÏÎÒÓÖÔÙÚÜÛÑÇČŘŠÝŽĎŤ';
        var to = 'aaaaeeeeeiiiioooouuuunccrsyzdtAAAAEEEEEIIIIOOOOUUUUNCCRSYZDT';
        // replace each special letter
        for (var i = 0; i < from.length; i++) {
            string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        // return clean string
        return string;
    };

    /**
     * [cleanString description]
     * @param  {String} param
     * @return {String}        'Cleaned string'
     */
    this.cleanString = function (string) {
        // apply toLowerCase() function
        string = string.toLowerCase();
        string = self.cleanAccent(string);
        string = string.replace(/ /g, '');
        // return clean string
        return string;
    };

    /**
     * Performs processing on an element
     * Generation of the line of the plan
     * Assigning an Id
     * Insertion of the element in the structure of the document.
     * @param element
     * @param tag
     * @param page
     * @param block
     * @return block + 1
     * @method $scope.processElement
     */
    this.processElement = function (element, tag, page, block) {
        page++;
        generatePlan(element, tag, page, block);
        element.id = block;
        if (!retContent[page]) {
            retContent[page] = '';
        }

        console.log('retContent', retContent);
        console.log('processElement , ', element);
        processChildNode(element);
        retContent[page] += element.outerHTML;
        return (block + 1);
    };
    /**
     * Split a doc in multiple pages
     * @function splitPages
     * @param {String} html
     * @return {String} html
     */
    this.splitPages = function (html) {
        return html.split('<div class="accessidys-break-page"></div>');
    };
});