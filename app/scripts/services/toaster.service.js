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


cnedApp.service('ToasterService', function ($rootScope, $timeout, gettextCatalog) {

    $rootScope.toasterMsg = '';
    $rootScope.forceToasterApdapt = false;
    $rootScope.listTagsByProfilToaster = [];


    var methods = {

        /**
         * Show success toaster
         * @param msg
         */
        showToaster: function (id, msg) {
            $rootScope.listTagsByProfilToaster = JSON.parse(localStorage.getItem('listTagsByProfil'));
            $rootScope.toasterMsg = '<h1>' + gettextCatalog.getString(msg) + '</h1>';
            $rootScope.forceToasterApdapt = true;
            $timeout(function () {
                angular.element(id).fadeIn('fast').delay(10000).fadeOut('fast');
                $rootScope.forceToasterApdapt = false;
            }, 0);
        }

    };

    return methods;

});