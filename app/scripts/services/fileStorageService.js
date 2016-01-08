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

cnedApp.service('fileStorageService', function ($localForage, configuration, dropbox, $q, synchronisationStoreService) {

    var self = this;

    /** ************** Gestion des documents (offline/online) ******************* */
    
    /**
     * Recherche les fichiers sur dropbox, met à jour le cache si les fichiers
     * ont été trouvés. Retourne la liste des fichiers depuis le cache
     * 
     * @param online
     *            si il y a accès à internet
     * @param token
     *            le token dropbox
     * @method searchAllFiles
     */
    this.searchAllFiles = function (online, token) {
        if(online) {
            return dropbox.search('.html', token, configuration.DROPBOX_TYPE).then(function(dropboxFiles) {
                // Mise à jour de la liste des documents dans le cache
                return self.updateFileListInStorage(dropboxFiles).then($localForage.getItem('listDocument'));
            });
        } else {
            return $localForage.getItem('listDocument');
        }
    };

    /**
     * Recherche des fichiers dans le dropbox ou dans le cache si dropbox n'est
     * pas accessible
     * 
     * @param online
     *            si il y a accès à internet
     * @param query
     *            la requete de recherche
     * @param token
     *            le token dropbox
     * @method searchFiles
     */
    this.searchFiles = function (online, query, token) {
        if(online) {
            return self.searchFilesInDropbox(query, token).then(function (data) {
                return self.transformDropboxFilesToStorageFiles(data);
            });
        } else {
            return self.searchFilesInStorage(query);
        }

    };

    /**
     * Recupere le contenu du fichier sur dropbox si possible. sinon le recupere
     * dans le cache
     * 
     * @param online
     *            si il y a accès à internet
     * @param filename
     *            le fichier
     * @param le
     *            token dropbox
     * @method getFile
     */
    this.getFile = function (online, filename, token) {
        if(online) {
            return self.searchFilesInDropbox(filename, token).then(function (files) {
                return self.getDropboxFileContent(files[0].path, token).then(function(filecontent) {
                    var storageFile = self.transformDropboxFileToStorageFile(files[0]);
                    return self.saveFileInStorage(storageFile, filecontent, false).then(function() {
                        return self.getFileInStorage(storageFile.filepath);
                    });
                });
            });
        } else {
            return self.searchFilesInStorage(filename).then(function(files) {
                return self.getFileInStorage(files[0].filepath);
            });
        }
    };

    /**
     * Renomme le du fichier sur dropbox si possible et dans le cache
     * 
     * @param online
     *            si il y a accès à internet
     * @param oldFilename
     *            l'ancien nom du fichier
     * @param newFilename
     *            le nouveau nom du fichier
     * @param le
     *            token dropbox
     * @method renameFile
     */
    this.renameFile = function (online, oldFilename, newFilename, token) {
        var filenameStartIndex = oldFilename.indexOf('_') + 1;
        var filenameEndIndex = oldFilename.lastIndexOf('_');
        var shortFilename = oldFilename.substring(filenameStartIndex, filenameEndIndex);

        if(online) {
            return dropbox.rename(oldFilename, newFilename, token, configuration.DROPBOX_TYPE).then(function () {
                return self.getFileInStorage(oldFilename).then(function (filecontent) {
                    var file= {};
                    file.filename = shortFilename;
                    file.filepath = newFilename;
                    return self.saveFileInStorage(file, filecontent).then(function () {
                        return self.deleteFileInStorage(oldFilename);
                    });
                });
            });
        } else {
            var d= Date.parse(new Date());
            var docToSynchronize= {docName: newFilename,filename: shortFilename, newDocName: newFilename, oldDocName: oldFilename,action : 'rename',dateModification: d};
            synchronisationStoreService.storeDocumentToSynchronize(docToSynchronize);
            return self.renameFileInStorage(oldFilename, newFilename);
        }
    };

    /**
     * Supprime le fichier sur dropbox et dans le cache
     * 
     * @param online
     *            si il y a accès à internet
     * @param filename
     *            le nom du fichier
     * @param le
     *            token dropbox
     * @method deleteFile
     */
    this.deleteFile = function (online, filename, token) {
        if(online) {
            return dropbox.delete(filename, token, configuration.DROPBOX_TYPE).then(function () {
                return self.deleteFileInStorage(filename);
            });
        } else {
            var docToSynchronize= {docName: filename,action : 'delete', content: null};
            synchronisationStoreService.storeDocumentToSynchronize(docToSynchronize);
            return self.deleteFileInStorage(filename);
        }

    };

    /**
     * Sauvegarde le contenu du fichier sur dropbox et dans le cache
     * 
     * @param online
     *            si il y a accès à internet
     * @param filename
     *            le nom du fichier
     * @param filecontent
     *            le contenu du fichier
     * @param le
     *            token dropbox
     * @method saveFile
     */
    this.saveFile = function (online, filename, filecontent, token) {
        if(online) {
            return dropbox.upload(filename, filecontent, token, configuration.DROPBOX_TYPE).then(function (dropboxFile) {
                var storageFile = self.transformDropboxFileToStorageFile(dropboxFile);
                return self.saveFileInStorage(storageFile, filecontent).then(function () {
                    return storageFile;
                });
            });
        } else {
            // create doc to synchronize
            var filepath = filename;
            var filenameStartIndex = filepath.indexOf('_') + 1;
            var filenameEndIndex = filepath.lastIndexOf('_');
            var shortFilename = filepath.substring(filenameStartIndex, filenameEndIndex);
            var storageFile = {
                    filepath: filepath,
                    filename: shortFilename,
                    dateModification: new Date()
            };
            var d= Date.parse(new Date());
            var docToSynchronize= {docName: filename,action : 'update', content: filecontent,dateModification: d};
            synchronisationStoreService.storeDocumentToSynchronize(docToSynchronize);
            return self.saveFileInStorage(storageFile, filecontent).then(function () {
                  return storageFile;
             });
        }
    };

    
    /** **************************** Gestion storage ******************** */

    /**
     * Sauvegarde le contenu du fichier pour l'impression
     * 
     * @param filecontent
     *            le contenu du fichier
     * @return a promise
     * @method saveTempFileForPrint
     */
    this.saveTempFileForPrint = function (fileContent) {
        return $localForage.setItem('printTemp', fileContent);
    };


    /**
     * Retourne le document à imprimer.
     */
    this.getTempFileForPrint = function () {
        return $localForage.getItem('printTemp');
    };
    
    /**
     * Sauvegarde le contenu du fichier temporaire
     * 
     * @param filecontent
     *            le contenu du fichier
     * @method saveTempFile
     */
    this.saveTempFile = function (filecontent) {
        return $localForage.setItem('docTemp', filecontent);
    };

    /**
     * Recupere le contenu du fichier temporaire
     * 
     * @method getTempFile
     */
    this.getTempFile = function () {
        return $localForage.getItem('docTemp');
    };
    
    /**
     * Recherche des fichiers dans le cache
     * 
     * @param query
     *            la requete de recherche
     * @method searchFilesInStorage
     */
    this.searchFilesInStorage = function (query) {
        return $localForage.getItem('listDocument').then(function (files) {
            var filesFound = [];
            for (var i = 0; i < files.length; i++) {
                var filepath = files[i].filepath;
                if (filepath.indexOf(query) !== -1) {
                    filesFound.push(files[i]);
                }
            }
            return filesFound;
        });
    };
    
    /**
     * Mets à jour la liste des fichiers dans le cache
     * 
     * @param dropboxfiles
     *            la liste des fichiers
     * @method updateFileListInStorage
     */
    this.updateFileListInStorage = function (dropboxfiles) {
        var filesList = self.transformDropboxFilesToStorageFiles(dropboxfiles);
        return $localForage.setItem('listDocument', filesList);
    };

    /**
     * Sauvegarde le contenu du fichier dans le cache
     * 
     * @param file
     *            le fichier
     * @method saveFileInStorage
     */
    this.saveFileInStorage = function (file, fileContent) {
        // TODO update listDocument
        return $localForage.setItem('document.' + file.filepath, fileContent).then(function() {
            return self.saveOrUpdateInListDocument(file);
        });
    };

    /**
     * Supprime un fichier du cache
     * 
     * @param filepath
     *            le nom du fichier
     * @method deleteFileInStorage
     */
    this.deleteFileInStorage = function (filepath) {
        return $localForage.removeItem('document.' + filepath).then(function() {
            // maj de la liste des documents
            return self.deleteFromListDocument(filepath);
        });
    };
    
    /**
     * Renomme un fichier dans le cache
     * 
     * @param filename
     *            le nom du fichier
     * @method deleteFileInStorage
     */
    this.renameFileInStorage = function (oldFilename, newFilename) {
        return self.getFileInStorage(oldFilename).then(function (filecontent) {
            return self.searchFilesInStorage(oldFilename).then(function(file) {
                file[0].filepath = newFilename;
                return self.saveFileInStorage(file[0], filecontent).then(function () {
                    return self.deleteFileInStorage(oldFilename);
                });
            });
        });
    };

    /**
     * Recupere le contenu du fichier dans le cache
     * 
     * @param filename
     *            le nom du fichier
     * @method getFileInStorage
     */
    this.getFileInStorage = function (filename) {
        return $localForage.getItem('document.' + filename);
    };

    /**
     * Sauvegarde l'objet dans le cache
     * 
     * @param cssUrl
     *            l'objet URL
     * @method saveCSSInStorage
     */
    this.saveCSSInStorage = function (cssURL, id) {
        return $localForage.setItem('cssURL.' + id, cssURL);
    };

    /**
     * Récupère l'url du cache du css pour le profil donné
     * 
     * @param id
     *            l'id du profil
     * @method getCSSInStorage
     */
    this.getCSSInStorage = function (id) {
        return $localForage.getItem('cssURL.' + id);
    };
    
    /**
     * Met à jour un document dans la liste des documents.
     * 
     * @parma document le document
     */
    this.saveOrUpdateInListDocument = function(document) {
        return $localForage.getItem('listDocument').then(function(listDocument) {
            var indexOfExistingFile = -1;
            for(var i = 0; i < listDocument.length; i++) {
                var doc = listDocument[i];
                if(doc.filename === document.filename) {
                    indexOfExistingFile = i;
                    break;
                }
            }
            
            var filenameStartIndex = document.filepath.indexOf('_') + 1;
            var filenameEndIndex = document.filepath.lastIndexOf('_');
            var shortFilename = document.filepath.substring(filenameStartIndex, filenameEndIndex);
            document.filename = decodeURIComponent(shortFilename);
            if(indexOfExistingFile !== -1) {
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
     * Supprime un document de la liste des documents.
     * 
     * @parma documentName le nom du document
     */
    this.deleteFromListDocument = function(documentName) {
        return $localForage.getItem('listDocument').then(function(listDocument) {
            var indexOfExistingFile = -1;
            for(var i = 0; i < listDocument.length; i++) {
                var doc = listDocument[i];
                if(doc.filepath === documentName) {
                    indexOfExistingFile = i;
                    break;
                }
            }
            if(indexOfExistingFile !== -1) {
                // delete document if exists
                listDocument.splice(i, 1);
            }
            return $localForage.setItem('listDocument', listDocument);
        });
    };
    
    
    /** **************************** Gestion dropbox ******************** */

    /**
     * Partage le fichier sur dropbox et retourne l'url du partage
     * 
     * @method shareFile
     */
    this.shareFile = function (filename, token) {
        return dropbox.shareLink(filename, token, configuration.DROPBOX_TYPE).then(function (result) {
            return result.url;
        });
    };

    /**
     * Recherche des fichiers correspondants à la requete sur dropbox La requête
     * de recherche
     * 
     * @param token
     *            le token dropbox
     * @method searchFilesInDropbox
     */
    this.searchFilesInDropbox = function (query, token) {
        return dropbox.search(query, token, configuration.DROPBOX_TYPE);
    };
    
    /**
     * Recupere le contenu du fichier dans dropbox
     * 
     * @param filepath
     *            le nom complet du fichier
     * @param le
     *            token dropbox
     * @method getDropboxFileContent
     */
    this.getDropboxFileContent = function (filepath, token) {
        return dropbox.download(filepath, token, configuration.DROPBOX_TYPE);
    };

    /**
     * Converti le format des fichiers dropbox en format de fichier interne
     * 
     * @param dropboxFiles
     *            les fichiers dropbox
     * @method transformDropboxFilesToStorageFiles
     */
    this.transformDropboxFilesToStorageFiles = function (dropboxFiles) {
        var files = [];
        for (var i = 0; i < dropboxFiles.length; i++) {
            var file = self.transformDropboxFileToStorageFile(dropboxFiles[i]);
            if (file !== null) {
                files.push(file);
            }
        }
        return files;
    };

    /**
     * Converti le format du fichier dropbox en format de fichier interne
     * 
     * @param dropboxFiles
     *            les fichiers dropbox
     * @method transformDropboxFileToStorageFile
     */
    this.transformDropboxFileToStorageFile = function (dropboxFile) {
        var filepath = dropboxFile.path;
        var filenameStartIndex = filepath.indexOf('_') + 1;
        var filenameEndIndex = filepath.lastIndexOf('_');
        var filename = filepath.substring(filenameStartIndex, filenameEndIndex);
        var dateModification = Date.parse(dropboxFile.modified);
        var file = null;

        file = {
                filepath: filepath,
                filename: filename,
                dateModification: dateModification
        };

        return file;
    };
});
