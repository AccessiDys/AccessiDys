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
cnedApp.service('UserService', function ($http, configuration, $localForage, $q) {

    var userData = {
        email: null,
        firstName: null,
        lastName: null,
        provider: null,
        token: null
    };

    var methods = {

        init: function () {
            var deferred = $q.defer();

            $localForage.getItem('userData').then(function (data) {
                if (data) {
                    userData = data;
                }
                deferred.resolve(userData);
            });

            return deferred.promise;
        },

        getData: function () {
            return userData;
        },

        saveData: function (data) {
            var deferred = $q.defer();

            $localForage.setItem('userData', data).then(function () {
                userData = data;
                deferred.resolve(data);
            });

            return deferred.promise;
        },

        findUserByEmail: function (email) {
            return $http.post(configuration.URL_REQUEST + '/findUserByEmail', {
                email: email
            });
        }

    };

    return methods;

});