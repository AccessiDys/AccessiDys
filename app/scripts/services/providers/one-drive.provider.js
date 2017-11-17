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
    function ($http, $q, $log, configuration, FileConstant) {
        var apiUrl = 'https://graph.microsoft.com/v1.0';
        /**
         * Converts the format of a dropbox file  in an internal file format
         * @param dropboxFiles
         *            a dropbox file
         * @method transformDropboxFileToStorageFile
         */
        /*var transformOneDriveFileToStorageFile = function (file) {
            return {
                fileID: file.id,
                filename: file.name,
                filepath: '',
                dateModification: Date.parse(file.modifiedTime),
                provider: 'one-drive'
            };
        };*/

        function buildTree(arr) {
            var indexed = _.reduce(arr, function (result, item) {
                result[item.id] = item;
                return result;
            }, {});

            // retain the root items only
            var result = _.filter(arr, function (item) {

                // get parent
                var parent = indexed[item.parent];

                // make sure to remove unnecessary keys
                delete item.parent;

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
         * @param googleFiles google files
         * @param type
         * @returns {Array} File list
         */
        var transformOneDriveFilesToStorageFiles = function (oneDriveFiles) {
            var res = [];

            _.forEach(oneDriveFiles, function (value) {
                if(value.name !== "Accessidys") {
                    res.push(transformOneDriveFileToStorageFile(value));
                }
            });

            return buildTree(res);
        };

        /**
         * On reçoit dans un objet où il y a une tableau value:[] il faudra itérer dessus
         * @param onedriveFile
         * @returns {{id, filename: string, dateModification: *, mimeType: (*|string|string), type: string, provider: string, parent: null, parents: (*|jQuery.parents|Array), content: Array}}
         */
        var transformOneDriveFileToStorageFile = function (onedriveFile) {

            //console.log(onedriveFile.parentReference);
            var file = {
                id: onedriveFile.id,
                filename: onedriveFile.name,
                dateModification: onedriveFile.lastModifiedDateTime ? new Date(onedriveFile.lastModifiedDateTime) : '',
                type: '',
                provider: 'one-drive',
                parent: onedriveFile.parentReference && onedriveFile.parentReference.name != 'Accessidys' ? onedriveFile.parentReference.id: FileConstant.onedrive_default_folder, // TODO mettre le nom du dossier par défaut dans FileConstant
                folder: {
                    id: onedriveFile.parentReference.id
                },
                content: []
            };


            if (onedriveFile.folder) {
                file.type = 'folder';
            } else {
                file.type = 'file';
            }

            return file;
        };

        var downloadService = function (fileId, access_token) {
            var deferred = $q.defer();
            console.log("Download: " + fileId);
            $http({
                method: 'GET',
                url: apiUrl + '/me/drive/items/' + fileId + '/content',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                }
            }).success(function (content) {
                console.log(content);
                deferred.resolve(content);
            }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        var uploadService = function (file, extension, access_token) {
            var deferred = $q.defer();

            if(file.filename.indexOf('.html') > 0){
                console.log("test");
                console.log(file);
                console.log(file.id);
                file.filename = file.filename.replace('.html', '');
            }
            if(extension==="-profile.json"){
                extension = ".txt";
            }
            var url = file.folder
                ? apiUrl + '/me/drive/items/' + file.folder.id + ':/' + file.filename + '.html'
                : apiUrl + '/me/drive/root:/Accessidys/' + file.filename + extension;

            console.log("Url de départ : " + url)
            $http({
                method: 'POST',
                url: url + ':/createUploadSession',
                data: {
                    item: {
                        "@microsoft.graph.conflictBehavior": "rename",
                        name: file.filename + extension
                    }
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(function (res) {
                var data;
                if(extension === ".txt"){
                    data = JSON.stringify(file.data);
                } else {
                    data = file.data;
                }

                console.log(data);

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

                }, function (data) {
                    console.log("C'est ici ? ");
                    console.log(data);
                    deferred.reject(data);
                });

            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        var uploadContent = function (file, access_token) {
            var deferred = $q.defer();
            var url = apiUrl + '/me/drive/root:/' + file.folder.id + '/' + file.name + '/content';

            var fd = new FormData();
            fd.append('file', file);

            $http({
                method: 'PUT',
                url: url,
                data: {
                    name: file.name,
                    folder: {}
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(function (metadata) {
                console.log('metadata', metadata);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        var deleteService = function (file, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: apiUrl + '/me/drive/items/' + file.id,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        var searchService = function (search, access_token) {
            var deferred = $q.defer();

            if( search === "-profile.json"){
                deferred.resolve([]);
            }
            console.log(search)
            var url = apiUrl + '/me/drive/root:/Accessidys:/delta';


            $http({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then (function (files) {
                deferred.resolve(transformOneDriveFilesToStorageFiles(files.data.value));
            }, function (data) {
                // Error Accessidys folder doesn't exist
                var url = apiUrl + '/me/drive/root/children';
                $http({
                    method: 'POST',
                    url: url,
                    data: {
                        name: 'Accessidys',
                        folder: {}
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    }
                }).then(function(data2){
                    deferred.resolve(data2);
                }, function (data2){
                    // Error
                    deferred.reject(data2);
                });
            });
            return deferred.promise;
        };

        var searchAllService = function (search, access_token) {
            var deferred = $q.defer();

            if( search === "-profile.json"){
                deferred.resolve([]);
            }
            console.log(search)
            var url = apiUrl + '/me/drive/root:/Accessidys:/delta';

            $http({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then (function (files) {
                deferred.resolve(files.data.value.map(transformOneDriveFileToStorageFile));
            }, function (data) {
                // Error
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
        var shareLinkService = function (file, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: apiUrl + '/me/drive/items/' + file.id + '/createLink',
                data: {
                    type: 'edit'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).then(function (data) {
                console.log(data.data.link.webUrl);
                deferred.resolve(data.data.link.webUrl);
            }, function (data) {
                /*if (data.error && data.error['.tag'] === 'shared_link_already_exists') {

                    listShareLinkService(path, access_token).then(function (data) {
                        deferred.resolve(data);
                    });

                } else if (data.error && data.error['.tag'] === 'email_not_verified') {

                    deferred.reject({
                        error: 'email_not_verified'
                    });

                } else {*/
                    deferred.reject(data);
                //}

            });
            return deferred.promise;
        };

        var renameService = function (file, newName, type, access_token) {
            var deferred = $q.defer();

            var url = "/me/drive/items/" + file.id;
            $http({
                method: 'PATCH',
                url: apiUrl + url,
                data: {
                    name: newName
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

        var authService = function () {
            window.location.href = configuration.BASE_URL + '/auth/one-drive';
        };

        var copyService = function (file, copy, access_token) {
            var deferred = $q.defer();
            var url = apiUrl + '/me/drive/items/' + file.id + '/copy';

            console.log(url);
            console.log(file);
            console.log(copy);

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
                console.log(data);
                deferred.resolve();
            }, function (data) {
                // Error
                console.log(data);
                deferred.reject();
            });
            return deferred.promise;
        };

        var createFolderService = function (path, folderName, access_token) {
            var deferred = $q.defer();
            var url = apiUrl + '/me/drive/root:/Accessidys:/children';
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
                console.log(res);
                deferred.resolve(transformOneDriveFileToStorageFile(res.data));
            }, function () {
                // Error
                deferred.reject();
            });
            return deferred.promise;
        };

        var moveFilesService = function (file, newFolderId, access_token) {
            var deferred = $q.defer();

            var url = "/me/drive/items/" + file.id;

            $http({
                method: 'PATCH',
                url: apiUrl + url,
                data: {
                    parentReference: {
                        id: newFolderId
                    },
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
            searchAll: searchAllService,
            shareLink: shareLinkService,
            download: downloadService,
            rename: renameService,
            copy: copyService,
            createFolder: createFolderService,
            move: moveFilesService,
            auth: authService
        };
    });


