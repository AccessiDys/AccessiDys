/*File: documentService.js
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


cnedApp.service('loaderService', function ($rootScope) {

    $rootScope.showDocumentLoader = false;
    $rootScope.documentLoaderMessage = '';
    $rootScope.documentLoaderProgress = 0;


    var methods = {

        /**
         * Show the document loader
         * @param message to display
         */
        showDocumentLoader: function (message) {
            $rootScope.documentLoaderMessage = message;
            $rootScope.documentLoaderProgress = 0;
            $rootScope.showDocumentLoader = true;
        },

        /**
         * Hide the document loader
         */
        hideDocumentLoader: function () {
            $rootScope.documentLoaderMessage = '';
            $rootScope.documentLoaderProgress = 0;
            $rootScope.showDocumentLoader = false;
        },

        /**
         * Set document loader progress
         * @param loaderProgress
         */
        setDocumentLoaderProgress: function (loaderProgress) {
            $rootScope.documentLoaderProgress = loaderProgress;
        }

    };

    return methods;

});