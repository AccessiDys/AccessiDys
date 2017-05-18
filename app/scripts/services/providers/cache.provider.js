/*File: cache.provider.js
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

angular.module('cnedApp').factory('CacheProvider',
    function ($q, $localForage, _) {

        return {
            list: function (storageName) {
                return $localForage.getItem(storageName);
            },
            get: function (filename, storageName) {

                var deferred = $q.defer();
                $localForage.getItem(storageName).then(function (items) {
                    if (items) {
                        _.each(items, function (item) {
                            if (item && item.filename === filename) {
                                deferred.resolve(item);
                            }
                        });
                    } else {
                        deferred.resolve();
                    }
                });

                return deferred.promise;
            },
            delete: function (file, storageName) {

                var deferred = $q.defer();

                return $localForage.getItem(storageName).then(function (items) {
                    if (items) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i] && items[i].filename === file.filename) {

                                items.splice(i, 1);



                                break;
                            }
                        }

                        $localForage.setItem(storageName, items).then(function () {
                            deferred.resolve(items);
                        });

                    } else {
                        deferred.resolve();
                    }
                });

                return deferred.promise;
            },
            saveAll: function (files, storageName) {
                var deferred = $q.defer();

                $localForage.setItem(storageName, files).then(function () {
                    deferred.resolve(files);
                });

                return deferred.promise;
            },
            /**
             * Save a file into local storage
             * @param file
             * @param storageName
             */
            save: function (file, storageName) {
                var deferred = $q.defer();

                $localForage.getItem(storageName).then(function (items) {

                    if (items) {
                        var isFound = false;
                        var index = 0;

                        for (var i = 0; i < items.length; i++) {
                            if (items[i] && file && items[i].filename === file.filename) {
                                isFound = true;
                                break;
                            }
                            index++;
                        }

                        if (isFound) {
                            items[index] = file;
                            $localForage.setItem(storageName, items).then(function () {
                                deferred.resolve(file);
                            });
                        } else {
                            items.push(file);

                            $localForage.setItem(storageName, items).then(function () {
                                deferred.resolve(file);
                            });
                        }
                    } else {
                        $localForage.setItem(storageName, [file]).then(function () {
                            deferred.resolve(file);
                        });
                    }
                });

                return deferred.promise;
            },

            setItem: function (item, storageName) {
                return $localForage.setItem(storageName, item);
            },

            getItem: function (storageName) {
                return $localForage.getItem(storageName);
            }
        };
    });


