/*File: dropbox.provider.js
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

angular.module('cnedApp').factory('DropboxProvider',
    function ($http, $q) {

        /**
         * Converts the format of dropbox files  in an internal file format
         *
         * @param dropboxFiles
         *            The dropbox files
         * @method transformDropboxFilesToStorageFiles
         */
        var transformDropboxFilesToStorageFiles = function (dropboxFiles) {
            var files = [];
            for (var i = 0; i < dropboxFiles.matches.length; i++) {
                var file = transformDropboxFileToStorageFile(dropboxFiles.matches[i].metadata);
                if (file !== null) {
                    files.push(file);
                }
            }
            return files;
        };

        /**
         * Converts the format of a dropbox file  in an internal file format
         * @param dropboxFiles
         *            a dropbox file
         * @method transformDropboxFileToStorageFile
         */
        var transformDropboxFileToStorageFile = function (dropboxFile) {
            var filepath = dropboxFile.path_display;
            var filenameStartIndex = filepath.indexOf('_') + 1;
            var filenameEndIndex = filepath.lastIndexOf('_');
            var filename = filepath.substring(filenameStartIndex, filenameEndIndex);
            var dateModification = Date.parse(dropboxFile.server_modified);
            var file = {
                filepath: filepath,
                filename: filename,
                dateModification: dateModification,
                provider: 'dropbox'
            };

            return file;
        };

        var downloadService = function (path, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'https://content.dropboxapi.com/2/files/download',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Dropbox-API-Arg': decodeURIComponent(JSON.stringify({
                        'path': path
                    }))
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        var uploadService = function (filePath, dataToSend, access_token) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: 'https://content.dropboxapi.com/2/files/upload',
                data: dataToSend,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/octet-stream',
                    'Dropbox-API-Arg': decodeURIComponent(JSON.stringify({
                        path: filePath,
                        mode: 'overwrite'
                    }))
                }
            }).success(function (data) {
                deferred.resolve(transformDropboxFileToStorageFile(data));
            }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        var deleteService = function (filePath, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/files/delete',
                data: {
                    path: filePath
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        var searchService = function (query, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/files/search',
                data: {
                    path: '',
                    query: query,
                    start: 0,
                    mode: 'filename',
                    max_results: 1000
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).success(function (files) {
                deferred.resolve(transformDropboxFilesToStorageFiles(files));
            }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        var listShareLinkService = function (path, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/sharing/list_shared_links',
                data: {
                    path: path
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).success(function (data, status) {

                if (data && data.links) {
                    var link = data.links[0];
                    link.status = status;
                    link.url = link.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
                    deferred.resolve(link);
                } else {
                    deferred.resolve(null);
                }

            }).error(function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
        var shareLinkService = function (path, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
                data: {
                    path: path,
                    settings: {
                        requested_visibility: 'public'
                    }
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).success(function (data, status) {
                if (data) {
                    data.url = data.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
                    data.status = status;
                }
                deferred.resolve(data);
            }).error(function (data) {
                if (data.error && data.error['.tag'] === 'shared_link_already_exists') {

                    listShareLinkService(path, access_token).then(function (data) {
                        deferred.resolve(data);
                    });

                } else if (data.error && data.error['.tag'] === 'email_not_verified') {

                    deferred.reject({
                        error: 'email_not_verified'
                    });

                } else {
                    deferred.reject(data);
                }

            });
            return deferred.promise;
        };

        var renameService = function (oldFilePath, newFilePath, access_token) {
            var deferred = $q.defer();

            downloadService(oldFilePath, access_token).then(function (data) {
                var documentData = data;

                deleteService(oldFilePath, access_token).then(function () {

                    uploadService(newFilePath, documentData, access_token).then(function (data) {
                        deferred.resolve(data);
                    }, function () {
                        deferred.reject();
                    });

                }, function () {

                    deferred.reject();
                });

            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        };

        var authService = function () {
            window.location.href = '/auth/dropbox';
        };

        var copyService = function (from_path, to_path, access_token) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/files/copy_v2',
                data: {
                    from_path: from_path,
                    to_path: to_path,
                    allow_shared_folder: true,
                    autorename: false,
                    allow_ownership_transfer: false
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).then(function () {
                deferred.resolve();
            }, function () {
                // Error
                deferred.reject();
            });
            return deferred.promise;
        };


        return {
            upload: uploadService,
            delete: deleteService,
            search: searchService,
            shareLink: shareLinkService,
            download: downloadService,
            rename: renameService,
            copy: copyService,
            auth: authService
        };
    });


