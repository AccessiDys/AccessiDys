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

cnedApp.service('fileStorageService', function ($localForage, configuration, dropbox, $q, synchronisationStoreService, $rootScope, $log) {

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
     * @method searchAllFiles
     */
    this.searchAllFiles = function (online, token) {
        $log.debug('fileStorageService - searchAllFiles : online ', online);
        if (online) {
            return dropbox.search('.html', token).then(function (dropboxFiles) {
                // Updating the list of documents in the cache.
                $log.debug('fileStorageService - searchAllFiles : dropbox.search OK - dropboxFiles ', dropboxFiles);
                return self.updateFileListInStorage(dropboxFiles).then($localForage.getItem('listDocument'));
            });
        } else {
            return $localForage.getItem('listDocument');
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
     * @method searchFiles
     */
    this.searchFiles = function (online, query, token) {
        if (online) {
            return self.searchFilesInDropbox('_' + query + '_', token).then(function (data) {
                return self.transformDropboxFilesToStorageFiles(data);
            });
        } else {
            return self.searchFilesInStorage(query);
        }

    };

    /**
     * Get the contents of the local file
     * @param filename
     *          the file
     */

    this.searchFileContentInStorage = function (filename) {
        return self.searchFilesInStorage(filename).then(function (files) {
            return self.getFileInStorage(files[0].filepath);
        });
    };

    /**
     * Gets the contents of the file on Dropbox if possible.
     * otherwise gets it from the cache.
     *
     * @param online
     *            if there is internet access
     * @param filename
     *            the file
     * @param token
     *            the  dropbox token
     * @method getFile
     */
    this.getFile = function (online, filename, token) {
        if (online) {
            return self.searchFilesInDropbox('_' + filename + '_', token).then(function (files) {
                var file = null;

                if (files && files.matches.length > 0) {

                    for (var i = 0; i < files.matches.length; i++) {
                        if (files.matches[i].metadata.name.indexOf('_' + filename + '_') > -1) {
                            file = files.matches[i].metadata
                        }
                    }

                }

                if (!file) {
                    return self.searchFileContentInStorage(filename);
                }

                return self.getDropboxFileContent(file.path_display, token).then(function (filecontent) {
                    var storageFile = self.transformDropboxFileToStorageFile(file);
                    return self.saveFileInStorage(storageFile, filecontent, false).then(function () {
                        return self.getFileInStorage(storageFile.filepath);
                    });
                }, function () {
                    return self.searchFileContentInStorage(filename);
                });
            }, function () {
                return self.searchFileContentInStorage(filename);
            });
        } else {
            return self.searchFileContentInStorage(filename);
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
    this.renameFile = function (online, oldFilename, newFilename, token, noPopup) {
        var filenameStartIndex = oldFilename.indexOf('_') + 1;
        var filenameEndIndex = oldFilename.lastIndexOf('_');
        var shortFilename = oldFilename.substring(filenameStartIndex, filenameEndIndex);

        if (online) {
            return dropbox.rename(oldFilename, newFilename, token, noPopup).then(function () {
                return self.getFileInStorage(oldFilename).then(function (filecontent) {
                    var file = {};
                    file.filename = shortFilename;
                    file.filepath = newFilename;
                    return self.saveFileInStorage(file, filecontent).then(function () {
                        return self.deleteFileInStorage(oldFilename);
                    });
                });
            });
        } else {
            var d = Date.parse(new Date());
            var docToSynchronize = {
                owner: $rootScope.currentUser.local.email,
                docName: newFilename,
                filename: shortFilename,
                newDocName: newFilename,
                oldDocName: oldFilename,
                action: 'rename',
                dateModification: d
            };
            synchronisationStoreService.storeDocumentToSynchronize(docToSynchronize);
            return self.renameFileInStorage(oldFilename, newFilename);
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
    this.deleteFile = function (online, filename, token, noPopup) {
        if (online) {
            return dropbox.delete(filename, token, noPopup).then(function () {
                return self.deleteFileInStorage(filename);
            });
        } else {
            var docToSynchronize = {
                owner: $rootScope.currentUser.local.email,
                docName: filename,
                action: 'delete',
                content: null
            };
            synchronisationStoreService.storeDocumentToSynchronize(docToSynchronize);
            return self.deleteFileInStorage(filename);
        }

    };

    /**
     * Save the file on Dropbox and if possible in the cache.
     *
     * @param online
     *            if there is internet access
     * @param filename
     *            the name of the file
     * @param filecontent
     *            lthe content of the file
     * @param le
     *            the dropbox token
     * @method saveFile
     */
    this.saveFile = function (online, filename, filecontent, token, noPopup) {
        if (online) {
            return dropbox.upload(filename, filecontent, token, noPopup).then(function (dropboxFile) {
                var storageFile = self.transformDropboxFileToStorageFile(dropboxFile);
                return self.saveFileInStorage(storageFile, filecontent).then(function () {
                    return storageFile;
                });
            });
        } else {
            var filepath = filename;
            var filenameStartIndex = filepath.indexOf('_') + 1;
            var filenameEndIndex = filepath.lastIndexOf('_');
            var shortFilename = filepath.substring(filenameStartIndex, filenameEndIndex);
            var storageFile = {
                filepath: filepath,
                filename: shortFilename,
                dateModification: new Date()
            };
            var d = Date.parse(new Date());
            var docToSynchronize = {
                owner: $rootScope.currentUser.local.email,
                docName: filename,
                action: 'update',
                content: filecontent,
                dateModification: d,
                creation: true
            };

            //Determine if it is about a creation or a modification of an existing file  on the server
            return self.searchFilesInStorage().then(function (filesFound) {
                if (filesFound && filesFound.length > 0) {
                    docToSynchronize.creation = false;
                }
                synchronisationStoreService.storeDocumentToSynchronize(docToSynchronize);
                // create doc to synchronize
                return self.saveFileInStorage(storageFile, filecontent).then(function () {
                    return storageFile;
                });
            });

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

    /**
     * Search files in the cache
     *
     * @param query
     *            the search query
     * @method searchFilesInStorage
     */
    this.searchFilesInStorage = function (query) {
        return $localForage.getItem('listDocument').then(function (files) {
            var filesFound = [];
            for (var i = 0; i < files.length; i++) {
                var filename = files[i].filename;
                if (filename === query) {
                    filesFound.push(files[i]);
                }
            }
            return filesFound;
        });
    };

    /**
     * Updates the list of files in the cache.
     * @param dropboxfiles
     *            The list of files
     * @method updateFileListInStorage
     */
    this.updateFileListInStorage = function (dropboxfiles) {
        var filesList = self.transformDropboxFilesToStorageFiles(dropboxfiles);
        return $localForage.setItem('listDocument', filesList);
    };

    /**
     * Save the contents of the file in the cache.
     *
     * @param file
     *            The file
     * @method saveFileInStorage
     */
    this.saveFileInStorage = function (file, fileContent) {
        // TODO update listDocument
        return $localForage.setItem('document.' + decodeURIComponent(file.filepath), fileContent).then(function () {
            return self.saveOrUpdateInListDocument(file);
        });
    };

    /**
     * Delete a file in the cache
     *
     * @param filepath
     *            The name of the file
     * @method deleteFileInStorage
     */
    this.deleteFileInStorage = function (filepath) {
        return $localForage.removeItem('document.' + filepath).then(function () {
            // maj de la liste des documents
            return self.deleteFromListDocument(filepath);
        });
    };

    /**
     * Rename a file in the cache
     *
     * @param filename
     *            the name of the file
     * @method deleteFileInStorage
     */
    this.renameFileInStorage = function (oldFilename, newFilename) {
        var filenameStartIndex = oldFilename.indexOf('_') + 1;
        var filenameEndIndex = oldFilename.lastIndexOf('_');
        var shortFilename = oldFilename.substring(filenameStartIndex, filenameEndIndex);

        return self.getFileInStorage(oldFilename).then(function (filecontent) {
            return self.searchFilesInStorage(shortFilename).then(function (file) {
                file[0].filepath = newFilename;
                return self.saveFileInStorage(file[0], filecontent).then(function () {
                    return self.deleteFileInStorage(oldFilename);
                });
            });
        });
    };

    /**
     *Get the contents of the file from the cache.
     *
     * @param filename
     *            le nom du fichier
     * @method getFileInStorage
     */
    this.getFileInStorage = function (filename) {
        return $localForage.getItem('document.' + filename);
    };

    /**
     * Save the object in the cache
     *
     * @param cssUrl
     *           The  URL object
     * @method saveCSSInStorage
     */
    this.saveCSSInStorage = function (cssURL, id) {
        return $localForage.setItem('cssURL.' + id, cssURL);
    };

    /**
     * Get the cache URL of the css for the given profile
     *
     * @param id
     *            The ID of the profile
     * @method getCSSInStorage
     */
    this.getCSSInStorage = function (id) {
        return $localForage.getItem('cssURL.' + id);
    };

    /**
     * Update a document in the list of documents.
     *
     * @parma document
     *          the document
     */
    this.saveOrUpdateInListDocument = function (document) {
        return $localForage.getItem('listDocument').then(function (listDocument) {
            var indexOfExistingFile = -1;
            for (var i = 0; i < listDocument.length; i++) {
                var doc = listDocument[i];
                if (doc.filename === document.filename) {
                    indexOfExistingFile = i;
                    break;
                }
            }

            var filenameStartIndex = document.filepath.indexOf('_') + 1;
            var filenameEndIndex = document.filepath.lastIndexOf('_');
            var shortFilename = document.filepath.substring(filenameStartIndex, filenameEndIndex);
            document.filename = decodeURIComponent(shortFilename);
            document.filepath = decodeURIComponent(document.filepath);
            if (indexOfExistingFile !== -1) {
                // update document if exists
                listDocument[i] = document;
            } else {
                // else add document
                listDocument.push(document);
            }
            return $localForage.setItem('listDocument', listDocument);
        });
    };

    /**
     * Delete a document in the list of documents.
     *
     * @parma documentName
     *           The name of the document
     */
    this.deleteFromListDocument = function (documentName) {
        return $localForage.getItem('listDocument').then(function (listDocument) {
            var indexOfExistingFile = -1;
            for (var i = 0; i < listDocument.length; i++) {
                var doc = listDocument[i];
                if (doc.filepath === documentName) {
                    indexOfExistingFile = i;
                    break;
                }
            }
            if (indexOfExistingFile !== -1) {
                // delete document if exists
                listDocument.splice(indexOfExistingFile, 1);
            }
            return $localForage.setItem('listDocument', listDocument);
        });
    };


    /** **************************** dropbox management ******************** */

    /**
     * Share the file on dropbox and returns the sharing URL.
     *
     * @method shareFile
     */
    this.shareFile = function (filename, token) {
        return dropbox.shareLink(filename, token).then(function (result) {
            return result.url;
        });
    };

    /**
     * Search the corresponding files to the query on dropbox.
     * The search query.
     *
     * @param token
     *            the dropbox token
     * @method searchFilesInDropbox
     */
    this.searchFilesInDropbox = function (query, token) {
        return dropbox.search(query, token);
    };

    /**
     * Gets the content of the file in Dropbox
     *
     * @param filepath
     *            the full name of the file
     * @param le
     *           the dropbox token
     * @method getDropboxFileContent
     */
    this.getDropboxFileContent = function (filepath, token) {
        return dropbox.download(filepath, token);
    };

    /**
     * Converts the format of dropbox files  in an internal file format
     *
     * @param dropboxFiles
     *            The dropbox files
     * @method transformDropboxFilesToStorageFiles
     */
    this.transformDropboxFilesToStorageFiles = function (dropboxFiles) {
        var files = [];
        for (var i = 0; i < dropboxFiles.matches.length; i++) {
            var file = self.transformDropboxFileToStorageFile(dropboxFiles.matches[i].metadata);
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
    this.transformDropboxFileToStorageFile = function (dropboxFile) {
        var filepath = dropboxFile.path_display;
        var filenameStartIndex = filepath.indexOf('_') + 1;
        var filenameEndIndex = filepath.lastIndexOf('_');
        var filename = filepath.substring(filenameStartIndex, filenameEndIndex);
        var dateModification = Date.parse(dropboxFile.server_modified);
        var file = null;

        file = {
            filepath: filepath,
            filename: filename,
            dateModification: dateModification
        };

        return file;
    };
});