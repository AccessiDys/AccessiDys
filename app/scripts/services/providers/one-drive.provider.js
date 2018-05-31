/*File: google-drive.provider.js
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

angular.module('cnedApp').factory('OneDriveProvider',
    function ($http, $q, $log, configuration, _, FileConstant) {
        var apiUrl = 'https://graph.microsoft.com/v1.0';

        /**
         * Build files tree
         * @param arr file array
         */
        function buildTree(arr) {
            var indexed = _.reduce(arr, function (result, item) {
                result[item.id] = item;
                return result;
            }, {});

            // retain the root items only
            var result = _.filter(arr, function (item) {

                // get parent
                var parent = indexed[item.parentNode];

                // make sure to remove unnecessary keys
                delete item.parentNode;

                // has parent?
                if (parent) {
                    // add item as a child
                    parent.content = (parent.content || []).concat(item);
                }

                // This part determines if the item is a root item or not
                return !parent;
            });


            return result;
        }

        /**
         * Converts the format of google files  in an internal file format
         * @param oneDriveFiles google files
         * @param type
         * @returns {Array} File list
         */
        var transformOneDriveFilesToStorageFiles = function (oneDriveFiles) {
            var res = [];


            _.forEach(oneDriveFiles, function (value) {
                res.push(transformOneDriveFileToStorageFile(value));
            });

            return buildTree(res);
        };

        /**
         * On reçoit dans un objet où il y a une tableau value:[] il faudra itérer dessus
         * @param onedriveFile
         * @returns {{id, filename: string, dateModification: *, mimeType: (*|string|string), type: string, provider: string, parent: null, parents: (*|jQuery.parents|Array), content: Array}}
         */
        var transformOneDriveFileToStorageFile = function (onedriveFile) {


            var filename = onedriveFile.name ? onedriveFile.name.replace(FileConstant.ONE_DRIVE.query.profile, '').replace(FileConstant.ONE_DRIVE.query.document, '') : '';

            var file = {
                id: onedriveFile.id,
                filename: filename,
                dateModification: onedriveFile.lastModifiedDateTime ? new Date(onedriveFile.lastModifiedDateTime) : '',
                type: '',
                provider: 'one-drive',
                parentNode: onedriveFile.parentReference ? onedriveFile.parentReference.id : null,
                parent: onedriveFile.parentReference ? onedriveFile.parentReference.id : null,
                filepath: onedriveFile.parentReference ? onedriveFile.parentReference.path + '/' + onedriveFile.name : null,
                downloadUrl: onedriveFile['@microsoft.graph.downloadUrl'],
                content: []
            };


            if (onedriveFile.folder) {
                file.type = 'folder';
            } else {
                file.type = 'file';
            }

            return file;
        };

        var downloadService = function (file, type, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: apiUrl + file.filepath + ':/content',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(function (res) {
                var data = decodeURIComponent(res.data);
                if (type === FileConstant.TYPE.profile) {
                    data = JSON.parse(data);
                }
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var uploadService = function (file, extension, access_token) {
            var deferred = $q.defer();

            var fileName = file.filename + extension;

            var url = apiUrl;

            if (file.folder) {
                url += file.folder.filepath + '/' + fileName + ':/createUploadSession';
            } else {
                if (file.id && file.id !== -1) {
                    url += file.filepath + ':/content';
                } else {
                    url += '/drive/special/approot:/' + fileName + ':/createUploadSession';
                }
            }

            var data = null;
            if (extension === FileConstant.ONE_DRIVE.query.profile) {
                data = JSON.stringify(file.data);
            } else {
                data = file.data;
            }
            data = encodeURIComponent(data);

            if (file.id && file.id !== -1) {

                $http({
                    method: 'PUT',
                    url: url,
                    data: data,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    }
                }).then(function (res) {
                    deferred.resolve(res.data);

                }, function (err) {
                    deferred.reject(err);
                });

            } else {
                $http({
                    method: 'POST',
                    url: url,
                    data: {
                        item: {
                            '@microsoft.graph.conflictBehavior': 'rename',
                            name: fileName
                        }
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    }
                }).then(function (res) {

                    $http({
                        method: 'PUT',
                        url: res.data.uploadUrl,
                        data: data,
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Range': 'bytes 0-' + (data.length - 1) + '/' + data.length
                        }
                    }).then(function (res) {
                        deferred.resolve(res.data);

                    }, function (err) {
                        deferred.reject(err);
                    });

                }, function (data) {
                    deferred.reject(data);
                });
            }


            return deferred.promise;
        };


        var deleteService = function (file, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: apiUrl + '/me/drive/items/' + file.id,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        var searchService = function (query, access_token, type) {


            var deferred = $q.defer();

            var url = apiUrl + '/drive/special/approot/delta';

            $http({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(function (files) {
                var res = [];
                if (files.data && files.data.value) {
                    if (files.data.value.length > 0) {
                        files.data.value.splice(0, 1);
                    }

                    var oneDriveFiles = [];

                    if (query) {

                        oneDriveFiles = _.filter(files.data.value, function (file) {
                            if (query === FileConstant.ONE_DRIVE.query.filesAndFolders) {
                                return file.name.indexOf(FileConstant.ONE_DRIVE.query.profile) === -1;
                            }
                            return file.name.indexOf(query) > -1;
                        });

                    } else {

                        oneDriveFiles = files.data.value;
                    }

                    res = transformOneDriveFilesToStorageFiles(oneDriveFiles);

                }


                deferred.resolve(res);

            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        };


        var shareLinkService = function (file, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: apiUrl + '/me/drive/items/' + file.id + '/createLink',
                data: {
                    type: 'view',
                    scope: 'anonymous'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).then(function (data) {

                $http({
                    method: 'POST',
                    url: '/one-drive/download-link',
                    data: {
                        url: data.data && data.data.link ? data.data.link.webUrl : ''
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Content-Type': 'application/json'
                    }
                }).then(function (res) {

                    deferred.resolve({
                        url: res.data
                    });
                }, function (err) {
                    deferred.reject(err);
                });


            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var renameService = function (file, newName, type, access_token) {
            var deferred = $q.defer();

            var url = '/me/drive/items/' + file.id;
            $http({
                method: 'PATCH',
                url: apiUrl + url,
                data: {
                    name: newName + FileConstant.ONE_DRIVE.query[type]
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                deferred.resolve(transformOneDriveFileToStorageFile(res.data));
            }, function () {
                // Error
                deferred.reject();
            });
            return deferred.promise;
        };

        var authService = function () {
            window.location.href = configuration.BASE_URL + '/auth/one-drive';
        };

        var copyService = function (file, copy, access_token) {
            var deferred = $q.defer();
            var url = apiUrl + '/me/drive/items/' + file.id + '/copy';


            $http({
                method: 'POST',
                url: url,
                data: {
                    name: copy
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).then(function (data) {
                deferred.resolve();
            }, function (data) {
                // Error
                deferred.reject();
            });
            return deferred.promise;
        };

        var createFolderService = function (path, folderName, access_token) {
            var deferred = $q.defer();
            var url = apiUrl + '/drive/special/approot/children';
            $http({
                method: 'POST',
                url: url,
                data: {
                    name: folderName,
                    folder: {}
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                deferred.resolve(transformOneDriveFileToStorageFile(res.data));
            }, function () {
                // Error
                deferred.reject();
            });
            return deferred.promise;
        };

        var moveFilesService = function (file, newFolderId, access_token) {
            var deferred = $q.defer();

            var url = '/me/drive/items/' + file.id;

            var parentRefrence = {};
            if (newFolderId) {
                parentRefrence.id = newFolderId;
            } else {
                parentRefrence.path = '/drive/special/approot';
            }

            $http({
                method: 'PATCH',
                url: apiUrl + url,
                data: {
                    parentReference: parentRefrence,
                    name: file.name
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
            createFolder: createFolderService,
            move: moveFilesService,
            auth: authService
        };
    });


