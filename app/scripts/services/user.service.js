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
        token: null,
        isAdmin: false
    };

    var methods = {

        init: function () {
            var deferred = $q.defer();

            $localForage.getItem('userData').then(function (data) {
                if (data) {
                    userData = data;

                    methods.isAdmin().then(function (res) {
                        userData.isAdmin = res.data.isAdmin;
                        deferred.resolve(userData);
                    }, function () {
                        userData.isAdmin = false;
                        deferred.resolve(userData);
                    });
                } else {
                    deferred.resolve(userData);
                }


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

        isAdmin: function () {
            return $http.post(configuration.BASE_URL  + '/user/isAdmin', {
                email: userData.email,
                provider: userData.provider
            });
        },

        logout: function(){

            userData = {
                email: null,
                firstName: null,
                lastName: null,
                provider: null,
                token: null,
                isAdmin: false
            };

            $localForage.setItem('initDefaultFolder', null);

            $localForage.setItem('userData', userData);
        }

    };

    return methods;

});