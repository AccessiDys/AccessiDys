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
    function ($q, $localForage, _, $log) {


        /**
         * Search file
         * @param list The file list
         * @param filename The filename
         * @returns {*} The file found
         */
        function searchFile(list, filename) {
            var res = null;

            $log.debug('CacheProvider - searchFile list=', list);
            $log.debug('CacheProvider - searchFile filename=', filename);

            if (list && list.length > 0 && filename) {
                _.each(list, function (value) {

                    if (res === null) {

                        if (value.filename && value.filename.toLowerCase() === filename.toLowerCase()) {

                            $log.debug('CacheProvider - searchFile fileFound=', value);

                            res = value;

                        } else if (value.content && value.content.length > 0) {
                            res = searchFile(value.content, filename);
                        }

                    }

                });
            }

            return res;
        }

        /**
         * Edit a file
         * @param list The file list
         * @param file The file
         * @param action The action {update | delete}
         * @returns {*} The status of action {true | false}
         */
        function editFile(list, file, action) {
            var res = {
                status: false,
                list: list
            };

            $log.debug('CacheProvider - editFile list=', list);
            $log.debug('CacheProvider - editFile filename=', file);

            if (list && list.length > 0 && file && file.filename && action) {
                _.each(list, function (value, index) {

                    if (!res.status) {

                        if (value.filename && value.filename.toLowerCase() === file.filename.toLowerCase()) {

                            if (action === 'update') {
                                res.list[index] = file;
                                res.status = true;
                            } else if (action === 'delete') {
                                res.list.splice(index, 1);
                                res.status = true;
                            } else {
                                res.status = false;
                            }

                        } else if (value.content && value.content.length > 0) {

                            var result = editFile(value.content, file, action);
                            res.status = result.status;
                            res.list[index].content = result.list;
                        }

                    }

                });
            }

            return res;
        }

        return {
            /**
             * List all from storage
             * @param storageName The storage name
             * @returns {*}
             */
            list: function (storageName) {
                return $localForage.getItem(storageName);
            },
            get: function (filename, storageName) {

                var deferred = $q.defer();
                $localForage.getItem(storageName).then(function (items) {
                    deferred.resolve(searchFile(items, filename));
                });

                return deferred.promise;
            },
            delete: function (file, storageName) {

                var deferred = $q.defer();

                $localForage.getItem(storageName).then(function (items) {
                    if (items) {

                        $log.debug('CacheProvider - Delete before', items);

                        var res = editFile(items, file, 'delete');

                        $log.debug('CacheProvider - Delete after', items);

                        $localForage.setItem(storageName, res.list).then(function () {
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

                $log.debug('Save all profiles', files);

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

                        $log.debug('CacheProvider - Save before', items);

                        var res = editFile(items, file, 'update');

                        $log.debug('CacheProvider - Save isFound', res.status);

                        if (!res.status && file.folder && file.folder.filename) {

                            var folder = file.folder;

                            $log.debug('CacheProvider - Save folder', folder);

                            if (!folder.content) {
                                folder.content = [];
                            }

                            delete file.folder;

                            file.parent = {
                                filename: folder.filename
                            };

                            folder.content.push(file);

                            res = editFile(items, folder, 'update');

                            $log.debug('CacheProvider - Save folder isFound', res.status);

                        }

                        if (!res.status) {
                            res.list.push(file);
                        }

                        $log.debug('CacheProvider - Save after', res.list);

                        $localForage.setItem(storageName, res.list)
                            .then(function () {
                                deferred.resolve(file);
                            }, function (err) {
                                $log.error('CacheProvider - Save err', err);
                                deferred.reject(err);
                            });

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


