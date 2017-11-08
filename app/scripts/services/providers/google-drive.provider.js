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

angular.module('cnedApp').factory('GoogleDriveProvider',
    function ($http, $q, _) {

        var baseUrl = 'https://www.googleapis.com/drive/v3/';
        var uploadUrl = 'https://www.googleapis.com/upload/drive/v3/';


        function addFileToParent(list, file) {
            var found = false;

            if (list && file) {
                _.each(list, function (value) {

                    if (!found) {

                        if (value.type === 'folder') {

                            if (value.id && value.id === file.parents[0]) {
                                value.content.push(file);
                                found = true;

                            } else if (value.content && value.content.length > 0) {
                                res = addFileToParent(value.content, file);
                            }
                        }

                    }

                });
            }

            return found;
        }


        /**
         * Converts the format of google files  in an internal file format
         * @param googleFiles google files
         * @param type
         * @returns {Array} File list
         */
        var transformGoogleFilesToStorageFiles = function (googleFiles, type) {
            var res = [];


            _.forEach(googleFiles, function (value) {

                var file = transformGoogleFileToStorageFile(value);

                if (file) {
                    console.log('file ', file);
                    if (type === 'document' && file.filename && file.filename.indexOf('-profile.json') < 0 ) {
                        if (file.parents && file.parents.length > 0) {
                            addFileToParent(res, file);
                        } else {
                            res.push(file);
                        }
                    } else if(type === 'profile' && file.filename.indexOf('-profile.json') > -1){
                        res.push(file);
                    }
                }

            });

            console.log('transform type ' + type, res);

            return res;
        };

        /**
         * Converts the format of a google file  in an internal file format
         * @param googleFile a google file
         * @returns {{filename, dateModification: *, type: string, provider: string, content: Array}}
         */
        var transformGoogleFileToStorageFile = function (googleFile) {

            var file = {
                id: googleFile.id,
                filename: googleFile.name,
                dateModification: googleFile.modifiedTime ? new Date(googleFile.modifiedTime) : '',
                type: '',
                provider: 'google-drive',
                parents: [],
                content: []
            };


            if (googleFile.mimeType === 'application/vnd.google-apps.folder') {
                file.type = 'folder';
            } else {
                file.type = 'file';
            }

            return file;
        };

        var downloadService = function (fileId, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: baseUrl + 'files/' + fileId + '?alt=media',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                responseType: 'arraybuffer'
            }).then(function (res) {
                // TODO get data

                console.log('dowload get data', res);

                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };
        var uploadService = function (filename, dataToSend, access_token) {
            var deferred = $q.defer();


            gapi.client.request({
                'path': '/drive/v3/files',
                'method': 'GET',
                'params': {
                    'pageSize': 10,
                    'fields': "nextPageToken, files(id, name)"
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(function(response) {
                console.log('response', response);
            });




            /*var body = '--foo_bar_baz\n';
            body += 'Content-Type: application/json; charset=UTF-8\n\n';
            body += '{\n';
            body += '"name": "' + (filename || '') + '"\n';
            body += '}\n\n';

            body += '--foo_bar_baz\n';
            body += 'Content-Type: txt/html\n\n';
            body += dataToSend;
            body += '\n--foo_bar_baz--';

            $http({
                method: 'POST',
                url: uploadUrl + 'files',
                data: body,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'multipart/related; boundary=foo_bar_baz',
                    'Content-Length': body.length
                },
                transformRequest: angular.identity
            }).then(function (res) {

                console.log('upload', res.data);


                // TODO
                //deferred.resolve(transformDropboxFileToStorageFile(data));
            }, function (data) {
                deferred.reject(data);
            });*/
            return deferred.promise;
        };
        var deleteService = function (fileId, access_token) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: baseUrl + 'files/' + fileId,

                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).then(function () {
                deferred.resolve();
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };
        var searchService = function (query, access_token, type) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: baseUrl + 'files',
                data: {
                    q: query ? "name contains '" + query + "'" : null,
                    pageSize: 1000,
                    spaces: 'appDataFolder'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {

                if (res.data && res.data.files) {
                    deferred.resolve(transformGoogleFilesToStorageFiles(res.data.files, type));
                } else {
                    deferred.resolve([]);
                }

            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        var listAllFilesService = function (path, access_token) { // TODO a voir si besoin
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/files/list_folder',
                data: {
                    path: path,
                    recursive: true,
                    include_media_info: false,
                    include_deleted: false,
                    include_has_explicit_shared_members: false,
                    include_mounted_folders: true
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).success(function (files) {
                var matches = [];
                for (var f = 0; f < files.entries.length; f++) {
                    matches.push({metadata: files.entries[f]});
                }
                var trueFiles = {matches: matches};
                deferred.resolve(transformDropboxFilesToStorageFiles(trueFiles, 'document'));
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
            window.location.href = '/auth/google-drive';
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

        var createFolderService = function (folderName, access_token) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: baseUrl + 'files',
                data: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(function (res) {

                console.log('create folder', res.data);
                // TODO
                //deferred.resolve(transformDropboxFileToStorageFile(data));
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        var moveFilesService = function (from_path, to_path, access_token) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/files/move_v2',
                data: {
                    from_path: from_path,
                    to_path: to_path
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
            moveFiles: moveFilesService,
            auth: authService
        };
    });


