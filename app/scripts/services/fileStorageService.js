/*File: fileStorageService.js
 *
 * Copyright (c) 2014
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

cnedApp.service('fileStorageService', function ($localForage, configuration, dropbox) {

  var self = this;

  /**
   * Recherche les fichiers sur dropbox, met à jour le cache si les fichiers ont été trouvés.
   * Retourne la liste des fichiers depuis le cache
   * @param token le token dropbox
   * @method searchAllFiles
   */
  this.searchAllFiles = function (token) {
    return dropbox.search('.html', token, configuration.DROPBOX_TYPE).then(self.updateFileListInStorage, function () {
      // en cas d'erreur lors de l'appel a dropbox on prend dans le cache
      return $localForage.getItem('listDocument');
    }).then($localForage.getItem('listDocument'));
  };

  /**
   * Recherche des fichiers correspondants à la requete sur dropbox
   * La requête de recherche
   * @param token le token dropbox
   * @method searchFilesInDropbox
   */
  this.searchFilesInDropbox = function (query, token) {
    return dropbox.search(query, token, configuration.DROPBOX_TYPE);
  };

  /**
   * Converti le format des fichiers dropbox en format de fichier interne
   * @param dropboxFiles les fichiers dropbox
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
   * @param dropboxFiles les fichiers dropbox
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

  /**
   * Recherche des fichiers dans le cache
   * @param query la requete de recherche
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
   * Recherche des fichiers dans le dropbox ou dans le cache si dropbox n'est pas accessible
   * @param query la requete de recherche
   * @param token le token dropbox
   * @method searchFiles
   */
  this.searchFiles = function (query, token) {
    return self.searchFilesInDropbox(query, token).then(function (data) {
        return self.transformDropboxFilesToStorageFiles(data);
      },
      // si dropbox n'est pas joignable on cherche dans le cache
      function () {
        return self.searchFilesInStorage(query);
      });
  };

  /**
   * Mets à jour la liste des fichiers dans le cache
   * @param dropboxfiles la liste des fichiers
   * @method updateFileListInStorage
   */
  this.updateFileListInStorage = function (dropboxfiles) {
    var filesList = self.transformDropboxFilesToStorageFiles(dropboxfiles);
    return $localForage.setItem('listDocument', filesList);
  };

  /**
   * Sauvegarde le contenu du fichier dans le cache
   * @param filename le nom du fichier
   * @param le contenu du fichier
   * @method saveFileInStorage
   */
  this.saveFileInStorage = function (filename, fileContent) {
    return $localForage.setItem('document.' + filename, fileContent);
  };

  /**
   * Supprime un fichier du cache
   * @param filename le nom du fichier
   * @method deleteFileInStorage
   */
  this.deleteFileInStorage = function (filename) {
    return $localForage.removeItem('document.' + filename);
  };

  /**
   * Recupere le contenu du fichier dans le cache
   * @param filename le nom du fichier
   * @method getFileInStorage
   */
  this.getFileInStorage = function (filename) {
    return $localForage.getItem('document.' + filename);
  };

  /**
   * Sauvegarde l'objet dans le cache
   * @param cssUrl l'objet URL
   * @method saveCSSInStorage
   */
  this.saveCSSInStorage = function (cssURL, id) {
    return $localForage.setItem('cssURL.' + id, cssURL);
  };

  /**
   * Sauvegarde l'objet dans le cache
   * @param cssUrl l'objet URL
   * @method getCSSInStorage
   */
  this.getCSSInStorage = function (id) {
    return $localForage.getItem('cssURL.' + id);
  };

  /**
   * Recupere le contenu du fichier dans dropbox
   * @param filepath le nom complet du fichier
   * @param le token dropbox
   * @method getDropboxFileContent
   */
  this.getDropboxFileContent = function (filepath, token) {
    return dropbox.download(filepath, token, configuration.DROPBOX_TYPE);
  };

  /**
   * Recupere le contenu du fichier sur dropbox si possible. sinon le recupere dans le cache
   * @param filename le nom du fichier
   * @param le token dropbox
   * @method getFile
   */
  this.getFile = function (filename, token) {
    return self.searchFilesInDropbox(filename, token).then(function (files) {
        return self.getDropboxFileContent(files[0].path, token);
      },
      // si dropbox n'est pas joignable, on récupère le fichier dans le cache
      function () {
        return self.getFileInStorage(filename);
      }).then(function (filecontent) {
      return self.saveFileInStorage(filename, filecontent);
    }).then(function () {
      return self.getFileInStorage(filename);
    });
  };

  /**
   * Renomme le du fichier sur dropbox si possible et dans le cache
   * @param oldFilename l'ancien nom du fichier
   * @param newFilename le nouveau nom du fichier
   * @param le token dropbox
   * @method renameFile
   */
  this.renameFile = function (oldFilename, newFilename, token) {
    return dropbox.rename(oldFilename, newFilename, token, configuration.DROPBOX_TYPE).then(function () {
      self.getFileInStorage(oldFilename).then(function (filecontent) {
        self.saveFileInStorage(newFilename, filecontent).then(function () {
          return self.deleteFileInStorage(oldFilename);
        });
      });
    });
  };

  /**
   * Supprime le fichier sur dropbox et dans le cache
   * @param filename le nom du fichier
   * @param le token dropbox
   * @method deleteFile
   */
  this.deleteFile = function (filename, token) {
    return dropbox.delete(filename, token, configuration.DROPBOX_TYPE).then(function () {
      return self.deleteFileInStorage(filename);
    });
  };

  /**
   * Sauvegarde le contenu du fichier sur dropbox et dans le cache
   * @param filename le nom du fichier
   * @param filecontent le contenu du fichier
   * @param le token dropbox
   * @method saveFile
   */
  this.saveFile = function (filename, filecontent, token) {
    return dropbox.upload(filename, filecontent, token, configuration.DROPBOX_TYPE).then(function (dropboxFile) {
      var storageFile = self.transformDropboxFileToStorageFile(dropboxFile);
      return self.saveFileInStorage(storageFile.filename, filecontent).then(function () {
        return storageFile;
      });
    });
  };

  /**
   * Sauvegarde le contenu du fichier pour l'impression
   * @param filecontent le contenu du fichier
   * @return a promise
   * @method saveTempFileForPrint
   */
  this.saveTempFileForPrint = function (fileContent) {
    return self.saveFileInStorage('printTemp', fileContent);
  };


  this.getTempFileForPrint = function () {
    return self.getFileInStorage('printTemp');
  };
  /**
   * Sauvegarde le contenu du fichier temporaire
   * @param filecontent le contenu du fichier
   * @method saveTempFile
   */
  this.saveTempFile = function (filecontent) {
    return self.saveFileInStorage('temp', filecontent);
  };

  /**
   * Recupere le contenu du fichier temporaire
   * @method getTempFile
   */
  this.getTempFile = function () {
    return self.getFileInStorage('temp');
  };

  /**
   * Partage le fichier sur dropbox et retourne l'url du partage
   * @method shareFile
   */
  this.shareFile = function (filename, token) {
    return dropbox.shareLink(filename, token, configuration.DROPBOX_TYPE).then(function (result) {
      return result.url;
    });
  };
});
