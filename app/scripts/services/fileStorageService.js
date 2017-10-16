/*File: fileStorageService.js
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

var cnedApp = cnedApp;

cnedApp.service('fileStorageService', function ($localForage, configuration, $q, $log,
                                                CacheProvider, DropboxProvider, UserService, $rootScope, md5) {

    var self = this;

    /** ************** Document management (offline/online) ******************* */

    /**
     *
     * Search files on Dropbox, updates the cache
     * if the files have been found. Returns a list of files from the cache
     * @param online
     *            if there is internet access
     * @param token
     *            the dropbox token
     * @method list
     */
    this.list = function (type) {
        $log.debug('fileStorageService - list ', UserService.getData());
        var query = '';
        var storageName = '';

        if (type === 'document') {
            query = '.html';
            storageName = 'listDocument';
        } else if (type === 'profile') {
            query = '-profile.json';
            storageName = 'listProfile';
        }

        if ($rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {
            return DropboxProvider.search(query, UserService.getData().token).then(function (files) {
                return CacheProvider.saveAll(files, storageName);
            }, function () {
                return CacheProvider.list(storageName);
            });
        } else {
            // Resolve Cache
            return CacheProvider.list(storageName);
        }

    };

    this.listAll = function(){

         var storageName = 'listDocument';
         var path = '';

         if ($rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {
            return DropboxProvider.listAllFiles(path, UserService.getData().token).then(function (files) {
                return CacheProvider.saveAll(files, storageName);
            }, function () {
                return CacheProvider.list(storageName);
            });
         } else {
             // Resolve Cache
             return CacheProvider.list(storageName);
         }
    };

    /**
     * Search files in Dropbox or in the cache if dropbox is not accessible
     * @param filename
     * @param type
     * @returns {*}
     */
    this.get = function (filename, type) {

        var storageName = '';

        if (type === 'document') {
            storageName = 'listDocument';
        } else if (type === 'profile') {
            storageName = 'listProfile';
        }

        if ($rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {


            return DropboxProvider.search('_' + filename + '_', UserService.getData().token).then(function (files) {


                if (files && files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        if (files[i].filename === filename) {
                            return DropboxProvider.download(files[i].filepath, UserService.getData().token).then(function (fileContent) {
                                files[i].data = fileContent;

                                return CacheProvider.save(files[i], storageName);
                            });
                        }
                    }
                } else {
                    return CacheProvider.get(filename, storageName);
                }

            }, function () {
                return CacheProvider.get(filename, storageName);
            });

        } else {
            return CacheProvider.get(filename, storageName);
        }
    };

    /**
     * Search files in Dropbox or in the cache if dropbox is not accessible
     *
     * @param online
     *           if there is internet access
     * @param query
     *            the search query
     * @param token
     *            the dropbox token
     * @method get
     */
    this.getData = function (file, type) {

        var storageName = '';

        if (type === 'document') {
            storageName = 'listDocument';
        } else if (type === 'profile') {
            storageName = 'listProfile';
        }

        if ($rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {

            return DropboxProvider.download(file.filepath, UserService.getData().token).then(function (fileContent) {
                file.data = fileContent;

                return CacheProvider.save(file, storageName).then(function (fileSaved) {
                    return fileSaved;
                });
            }, function () {
                return CacheProvider.get(file.filename, storageName).then(function (fileFound) {
                    return fileFound;
                });
            });

        } else {
            return CacheProvider.get(file.filename, storageName).then(function (fileFound) {
                return fileFound;
            });
        }
    };

    this.save = function (file, type) {

        var storageName = '';
        var extension = '';

        if (type === 'document') {
            storageName = 'listDocument';
            extension = '.html';
        } else if (type === 'profile') {
            storageName = 'listProfile';
            extension = '-profile.json';
        }

        if (!file.filepath) {
            file.filepath = this.generateFilepath(file.filename, extension);

            if(type === 'document'){
                file.filepath = file.folder.filepath + file.filepath;
            }
        }

        $log.debug('file.filepath', file.filepath);

        if ($rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {

            return DropboxProvider.upload(file.filepath, file.data, UserService.getData().token).then(function (_file) {
                _file.data = file.data;
                return CacheProvider.save(_file, storageName);
            }, function () {
                self.addFileToSynchronize(file, type, 'save');
                return CacheProvider.save(file, storageName);
            });

        } else {
            self.addFileToSynchronize(file, type, 'save');
            return CacheProvider.save(file, storageName);
        }
    };


    /**
     * Renames the file on Dropbox and if possible in the cache.
     * @param online
     *            if there is internet access
     * @param oldFilename
     *            the old file name.
     * @param newFilename
     *            the new file name.
     * @param le
     *           the dropbox token
     * @method renameFile
     */
    this.rename = function (file, newName, type) {
        var storageName = '';
        var extension = '';

        if (type === 'document') {
            storageName = 'listDocument';
            extension = '.html';
        } else if (type === 'profile') {
            storageName = 'listProfile';
            extension = '-profile.json';
        }

        var newFilePath = this.generateFilepath(newName, extension);

        if ($rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {
            if (UserService.getData().provider === 'dropbox') {
                return DropboxProvider.rename(file.filepath, newFilePath, UserService.getData().token).then(function (data) {
                    return CacheProvider.delete(file, storageName).then(function () {
                        return CacheProvider.save(data, storageName);
                    });
                }, function () {
                    self.addFileToSynchronize(file, type, 'delete');
                    return CacheProvider.delete(file, storageName).then(function () {
                        file.filename = newName;
                        file.filepath = newFilePath;
                        self.addFileToSynchronize(file, type, 'save');
                        return CacheProvider.save(file, storageName);
                    });
                });
            }
        } else {
            self.addFileToSynchronize(file, type, 'delete');

            $log.debug('Rename - addFileToSynchronize', file);

            return CacheProvider.delete(file, storageName).then(function () {
                file.filename = newName;
                file.filepath = newFilePath;

                $log.debug('Rename - addFileToSynchronize', file);
                self.addFileToSynchronize(file, type, 'save');
                return CacheProvider.save(file, storageName);
            });
        }
    };

    /**
     * Renames the file on Dropbox and if possible in the cache.
     * @param online
     *            if there is internet access
     * @param oldFilename
     *            the old file name.
     * @param newFilename
     *            the new file name.
     * @param le
     *           the dropbox token
     * @method renameFile
     */
    this.renameFolder = function (folder, newName) {
        var previousPath = folder.filepath;
        var pathArray = folder.filepath.split('/');
        pathArray.pop();
        var newPath = null;
        if(pathArray.length > 1) {
            newPath = pathArray.join('/');
            newPath += newName;
        } else if(pathArray.length === 1){
            newPath = '/' + newName;
        } else {
            $log.warn('There was à problem on the folder title.');
        }

        if (newPath!== null && $rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {
            if (UserService.getData().provider === 'dropbox') {
                return DropboxProvider.moveFiles(previousPath, newPath, UserService.getData().token);
            }
        }
    };

    /**
     * Delete the file on Dropbox and if possible in the cache.
     *
     * @param online
     *            if there is internet access
     * @param filename
     *            the name of the file
     * @param le
     *           the dropbox token
     * @method deleteFile
     */
    this.delete = function (file, type) {

        var storageName = '';

        if (type === 'document') {
            storageName = 'listDocument';
        } else if (type === 'profile') {
            storageName = 'listProfile';
        }

        if ($rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {
            return DropboxProvider.delete(file.filepath, UserService.getData().token).then(function () {
                return CacheProvider.delete(file, storageName);
            }, function () {
                self.addFileToSynchronize(file, type, 'delete');
                return CacheProvider.delete(file, storageName);
            });
        } else {
            self.addFileToSynchronize(file, type, 'delete');
            return CacheProvider.delete(file, storageName);
        }

    };

    /**
     * Share the file on dropbox and returns the sharing URL.
     *
     * @method shareFile
     */
    this.shareFile = function (filepath) {
        if (UserService.getData() && UserService.getData().token) {
            return DropboxProvider.shareLink(filepath, UserService.getData().token);
        } else {
            return null;
        }
    };

    /**
     * Share the file on dropbox and returns the sharing URL.
     *
     * @method shareFile
     */
    this.createFolder = function (filepath) {
        if (UserService.getData() && UserService.getData().token) {
            return DropboxProvider.createFolder(filepath, UserService.getData().token);
        } else {
            return null;
        }
    };

    /**
     * Share the file on dropbox and returns the sharing URL.
     *
     * @method shareFile
     */
    this.moveFiles = function (from_path, to_path) {
        if (UserService.getData() && UserService.getData().token) {
            return DropboxProvider.moveFiles(from_path, to_path, UserService.getData().token);
        } else {
            return null;
        }
    };
    
    /**
     * Copy a file
     * @param originalFile
     * @param destinationFile
     * @param type
     * @returns {*}
     */
    this.copyFile = function (originalFile, destinationFile, type) {

        var storageName = '';
        var extension = '';

        if (type === 'document') {
            storageName = 'listDocument';
            extension = '.html';
        } else if (type === 'profile') {
            storageName = 'listProfile';
            extension = '-profile.json';
        }

        // Generate new filepath
        destinationFile.filepath = decodeURIComponent(this.generateFilepath(destinationFile.filename, extension));

        $log.debug('file.filepath', destinationFile.filepath);

        if ($rootScope.isAppOnline && UserService.getData() && UserService.getData().provider) {

            if (UserService.getData().provider === 'dropbox') {

                return DropboxProvider.copy(originalFile.filepath, destinationFile.filepath, UserService.getData().token)
                    .then(function () {

                        $log.debug('File copied', destinationFile.filepath);

                        if(!destinationFile.data){
                            return DropboxProvider.download(destinationFile.filepath, UserService.getData().token)
                                .then(function (fileContent) {
                                    destinationFile.data = fileContent;

                                    return CacheProvider.save(destinationFile, storageName);
                                }, function(){
                                    return CacheProvider.save(destinationFile, storageName);
                                });
                        } else {
                            return CacheProvider.save(destinationFile, storageName);
                        }
                    }, function () {
                        self.addFileToSynchronize(destinationFile, type, 'save');
                        return CacheProvider.save(destinationFile, storageName);
                    });
            } else {
                return CacheProvider.save(destinationFile, storageName);
            }
        } else {
            self.addFileToSynchronize(destinationFile, type, 'save');
            return CacheProvider.save(destinationFile, storageName);
        }
    };


    /** **************************** storage Management ******************** */

    /**
     * Save the contents of the file for printing.
     *
     * @param filecontent
     *            The content fo the file
     * @return a promise
     * @method saveTempFileForPrint
     */
    this.saveTempFileForPrint = function (fileContent) {
        return $localForage.setItem('printTemp', fileContent);
    };


    /**
     * Return the document to be printed.
     */
    this.getTempFileForPrint = function () {
        return $localForage.getItem('printTemp');
    };

    /**
     * Save the contents of the temporary file.
     * @param filecontent
     *             The content fo the file
     * @method saveTempFile
     */
    this.saveTempFile = function (filecontent) {
        return $localForage.setItem('docTemp', filecontent);
    };

    /**
     * Retrieve the contents of the temporary file
     *
     * @method getTempFile
     */
    this.getTempFile = function () {
        return $localForage.getItem('docTemp');
    };

    this.generateFilepath = function (fileName, extension) {
        var now = new Date();
        var tmpDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        var hash = md5.createHash(fileName);

        return '/' + tmpDate + '_' + encodeURIComponent(fileName) + '_' + hash + extension;
    };

    this.addFileToSynchronize = function (file, type, action) {

        var storageName = '';

        if (type === 'document') {
            storageName = 'documentsToSynchronize';
        } else if (type === 'profile') {
            storageName = 'profilesToSynchronize';
        }

        CacheProvider.getItem(storageName).then(function (items) {
            if (!items) {
                items = [];
            }

            var isFound = false;
            for (var i = 0; i < items.length; i++) {
                if (items[i].file.filename == file.filename) {
                    isFound = true;

                    if (items[i].action === 'save' && action === 'delete') {
                        items.splice(i, 1);
                    } else {
                        items[i] = {
                            action: action,
                            file: file
                        };
                    }

                    break;
                }
            }

            if (!isFound) {
                items.push({
                    action: action,
                    file: file
                });
            }

            $log.debug('File to synchronize', items);
            CacheProvider.setItem(items, storageName);
        });
    };

    /**
     * Synchronize files in cache
     */
    this.synchronizeFiles = function () {
        var deferred = $q.defer();

        CacheProvider.getItem('documentsToSynchronize').then(function (documents) {

            CacheProvider.getItem('profilesToSynchronize').then(function (profiles) {

                var toSend = [];

                // Synchronize doc
                if (documents) {
                    for (var i = 0; i < documents.length; i++) {
                        if (documents[i].action === 'save') {
                            toSend.push(self.save(documents[i].file, 'document'));
                        } else if (documents[i].action === 'delete') {
                            toSend.push(self.delete(documents[i].file, 'document'));
                        }
                    }
                }

                // Synchronize profiles
                if (profiles) {

                    for (var i = 0; i < profiles.length; i++) {
                        profiles[i].file.data.owner = UserService.getData().email;
                        if (profiles[i].action === 'save') {
                            toSend.push(self.save(profiles[i].file, 'profile'));
                        } else if (profiles[i].action === 'delete') {
                            toSend.push(self.delete(profiles[i].file, 'profile'));
                        }
                    }
                }

                if (toSend.length > 0) {
                    $q.all(toSend).then(function (res) {
                        $log.debug('res from documentsToSynchronize', res);
                        CacheProvider.setItem(null, 'documentsToSynchronize');
                        CacheProvider.setItem(null, 'profilesToSynchronize');

                        deferred.resolve({
                            documentCount: documents ? documents.length : 0,
                            profilesCount: profiles ? profiles.length : 0
                        });
                    });
                } else {
                    deferred.resolve();
                }

            });
        });


        return deferred.promise;
    };

});