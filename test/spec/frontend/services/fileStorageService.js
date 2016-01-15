/* File: fileStorageService.js
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
/* global spyOn:false */

describe(
    'Service: fileStorageService',
    function() {

        var dropbox, q, deferred, localForage, synchronisationStoreService, docArray = [{
            filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
            filename: 'file1',
            dateModification: '2015-9-20'
        }];

        beforeEach(module('cnedApp'));

        beforeEach(function() {
            dropbox = {
                search: function(query) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (query === '.html' || query === 'file1') {
                        deferred
                            .resolve([{
                                path: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                                modified: 'Sun, 20 Sep 2015 16:09:46 +0000'
                            }]);
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                },
                download: function() {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve('fileContent');
                    return deferred.promise;
                },
                rename: function() {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve('<h1>test</h1>');
                    return deferred.promise;
                },
                delete: function() {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve();
                    return deferred.promise;
                },
                upload: function() {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve({
                        path: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                        modified: 'Sun, 20 Sep 2015 16:09:46 +0000'
                    });
                    return deferred.promise;
                },
                shareLink: function() {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve({
                        url: 'http://test.com'
                    });
                    return deferred.promise;
                }
            };
            localForage = {
                getItem: function(item) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (item === 'listDocument' || item === 'document.file1') {
                        deferred
                            .resolve(docArray);
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                },
                setItem: function(item) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (item === 'listDocument' || item === 'document.file1') {
                        deferred.resolve();
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                },
                removeItem: function(item) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (item === 'document.file1' || item === 'file1') {
                        deferred.resolve();
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                }
            };
            synchronisationStoreService = {
                storeDocumentToSynchronize: function() {},
            };
            spyOn(dropbox, 'search').andCallThrough();
            spyOn(dropbox, 'download').andCallThrough();
            spyOn(dropbox, 'rename').andCallThrough();
            spyOn(dropbox, 'delete').andCallThrough();
            spyOn(dropbox, 'upload').andCallThrough();
            spyOn(dropbox, 'shareLink').andCallThrough();
            spyOn(localForage, 'setItem').andCallThrough();
            spyOn(localForage, 'removeItem').andCallThrough();
            spyOn(synchronisationStoreService, 'storeDocumentToSynchronize').andCallThrough();

            module(function($provide) {
                $provide.value('dropbox', dropbox);
                $provide.value('$localForage', localForage);
                $provide.value('synchronisationStoreService', synchronisationStoreService);
            });
        });

        it('fileStorageService:searchAllFiles', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            var deferredSuccess;
            spyOn(localForage, 'getItem').andCallFake(function() {
                return deferredSuccess.promise;
            });

            // online case
            q = $q;
            deferredSuccess = $q.defer();
            deferredSuccess.resolve();
            spyOn(fileStorageService, 'updateFileListInStorage').andReturn(deferredSuccess.promise);
            configuration.DROPBOX_TYPE = 'sandbox';
            fileStorageService.searchAllFiles(true, 'token');
            $rootScope.$apply();
            expect(dropbox.search).toHaveBeenCalledWith('.html', 'token', 'sandbox');
            expect(fileStorageService.updateFileListInStorage).toHaveBeenCalled();

            // offline case
            q = $q;
            deferredSuccess = $q.defer();
            deferredSuccess.resolve();
            configuration.DROPBOX_TYPE = 'sandbox';
            fileStorageService.searchAllFiles(false, 'token');
            expect(localForage.getItem).toHaveBeenCalledWith('listDocument');
        }));

        it('fileStorageService:searchFilesInDropbox', inject(function(
            fileStorageService, configuration, $q) {
            q = $q;
            configuration.DROPBOX_TYPE = 'sandbox';
            fileStorageService.searchFilesInDropbox('text', 'token');
            expect(dropbox.search).toHaveBeenCalledWith('text', 'token',
                'sandbox');
        }));

        it('fileStorageService:transformDropboxFilesToStorageFiles', inject(function(
            fileStorageService) {
            var dropboxFiles = [{
                path: '/2015-10-6_Picard_182020eedf7c2742bc19bf59a61ad419.html'
            }];
            var storageFiles = fileStorageService.transformDropboxFilesToStorageFiles(dropboxFiles);
            expect(storageFiles.length).toBe(1);
            expect(storageFiles[0].filename).toEqual('Picard');
            expect(storageFiles[0].filepath).toEqual('/2015-10-6_Picard_182020eedf7c2742bc19bf59a61ad419.html');
        }));

        it('fileStorageService:transformDropboxFileToStorageFile', inject(function(
            fileStorageService) {
            var dropboxFile = {
                path: '/2015-10-6_Picard_182020eedf7c2742bc19bf59a61ad419.html'
            };
            var storageFile = fileStorageService.transformDropboxFileToStorageFile(dropboxFile);
            expect(storageFile.filename).toEqual('Picard');
            expect(storageFile.filepath).toEqual('/2015-10-6_Picard_182020eedf7c2742bc19bf59a61ad419.html');
        }));

        it('fileStorageService:searchFilesInStorage', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var deferredSuccess = $q.defer();
            var result;
            spyOn(localForage, 'getItem').andReturn(deferredSuccess.promise);
            fileStorageService.searchFilesInStorage('file1').then(function(files) {
                result = files;
            });
            expect(localForage.getItem).toHaveBeenCalledWith('listDocument');
            // resolves the promise
            deferredSuccess.resolve([{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }]);
            // Force to execute callbacks
            $rootScope.$apply();
            expect(result.length).toBe(1);
            expect(result[0].filepath).toEqual('/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html');
            expect(result[0].filename).toEqual('file1');
            expect(result[0].dateModification).toEqual('2015-9-20');
        }));

        it('fileStorageService:searchFiles', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var result;
            configuration.DROPBOX_TYPE = 'sandbox';
            // for online
            fileStorageService.searchFiles(true, 'file1', 'token').then(function(data) {
                result = data;
            });
            expect(dropbox.search).toHaveBeenCalledWith('file1', 'token', 'sandbox');
            // Force to execute callbacks
            $rootScope.$apply();
            expect(result.length).toBe(1);
            expect(result[0].filename).toEqual('file1');
            expect(result[0].dateModification).toEqual(1442765386000);

            // for offline
            spyOn(fileStorageService, 'searchFilesInStorage').andCallThrough();
            fileStorageService.searchFiles(false, 'file1', 'token');
            expect(fileStorageService.searchFilesInStorage).toHaveBeenCalledWith('file1');
        }));

        it('fileStorageService:updateFileListInStorage', inject(function(
            fileStorageService, configuration, $q) {
            q = $q;

            var dropboxFiles = [{
                path: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                modified: 'Sun, 20 Sep 2015 16:09:46 +0000'
            }];
            configuration.DROPBOX_TYPE = 'sandbox';
            fileStorageService.updateFileListInStorage(dropboxFiles);
            expect(localForage.setItem).toHaveBeenCalledWith('listDocument', [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: 1442765386000
            }]);
        }));

        it('fileStorageService:saveFileInStorage', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            spyOn(fileStorageService, 'saveOrUpdateInListDocument').andCallThrough();
            fileStorageService.saveFileInStorage({
                filepath: 'file1'
            }, 'content');
            $rootScope.$apply();
            expect(localForage.setItem).toHaveBeenCalledWith('document.file1', 'content');
            expect(fileStorageService.saveOrUpdateInListDocument).toHaveBeenCalled();
        }));

        it('fileStorageService:deleteFileInStorage', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            spyOn(fileStorageService, 'deleteFromListDocument').andCallThrough();
            fileStorageService.deleteFileInStorage('file1');
            $rootScope.$apply();
            expect(localForage.removeItem).toHaveBeenCalledWith('document.file1');
            expect(fileStorageService.deleteFromListDocument).toHaveBeenCalledWith('file1');
        }));

        it('fileStorageService:getFileInStorage', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var deferredSuccess = $q.defer();
            spyOn(localForage, 'getItem').andReturn(deferredSuccess.promise);
            fileStorageService.getFileInStorage('file1');
            deferredSuccess.resolve();
            expect(localForage.getItem).toHaveBeenCalledWith('document.file1');
            // Force to execute callbacks
            $rootScope.$apply();
        }));

        it('fileStorageService:saveCSSInStorage', inject(function(
            fileStorageService, configuration, $q) {
            q = $q;
            fileStorageService.saveCSSInStorage('blob:css', 'css1');
            expect(localForage.setItem).toHaveBeenCalledWith('cssURL.css1', 'blob:css');
        }));

        it('fileStorageService:getCSSInStorage', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var deferredSuccess = $q.defer();
            spyOn(localForage, 'getItem').andReturn(deferredSuccess.promise);
            fileStorageService.getCSSInStorage('css1');
            deferredSuccess.resolve();
            // Force to execute callbacks
            $rootScope.$apply();
            expect(localForage.getItem).toHaveBeenCalledWith('cssURL.css1');
        }));

        it('fileStorageService:getDropboxFileContent', inject(function(
            fileStorageService, configuration, $q) {
            q = $q;
            configuration.DROPBOX_TYPE = 'sandbox';
            fileStorageService.getDropboxFileContent('file1', 'token');
            expect(dropbox.download).toHaveBeenCalledWith('file1', 'token', 'sandbox');
        }));

        it('fileStorageService:getFile', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            spyOn(fileStorageService, 'getFileInStorage').andCallThrough();
            configuration.DROPBOX_TYPE = 'sandbox';
            // for online
            var deferred19 = q.defer();
            deferred19.resolve([{
                path: '/file1',
                filepath: '/file1'
            }]);
            spyOn(fileStorageService, 'getDropboxFileContent').andReturn(deferred19.promise);
            spyOn(fileStorageService, 'saveFileInStorage').andReturn(deferred19.promise);
            fileStorageService.getFile(true, 'file1', 'token');
            $rootScope.$apply();
            expect(dropbox.search).toHaveBeenCalledWith('file1', 'token', 'sandbox');
            expect(fileStorageService.getDropboxFileContent).toHaveBeenCalled();
            expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();
            expect(fileStorageService.getFileInStorage).toHaveBeenCalled();
            // for offline
            deferred19 = q.defer();
            deferred19.resolve([{
                filepath: '/file1'
            }]);
            spyOn(fileStorageService, 'searchFilesInStorage').andReturn(deferred19.promise);
            fileStorageService.getFile(false, 'file1', 'token');
            $rootScope.$apply();
            expect(fileStorageService.searchFilesInStorage).toHaveBeenCalled();
            expect(fileStorageService.getFileInStorage).toHaveBeenCalledWith('/file1');
        }));

        it('fileStorageService:renameFile', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            configuration.DROPBOX_TYPE = 'sandbox';
            // for an online user
            var deferred19 = q.defer();
            deferred19.resolve('content');
            spyOn(fileStorageService, 'getFileInStorage').andReturn(deferred19.promise);
            spyOn(fileStorageService, 'saveFileInStorage').andReturn(deferred19.promise);
            spyOn(fileStorageService, 'deleteFileInStorage').andCallThrough();
            fileStorageService.renameFile(true, 'file1', 'file2', 'token');
            $rootScope.$apply();
            expect(dropbox.rename).toHaveBeenCalledWith('file1', 'file2', 'token', 'sandbox');
            expect(fileStorageService.getFileInStorage).toHaveBeenCalledWith('file1');
            expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();
            expect(fileStorageService.deleteFileInStorage).toHaveBeenCalled();
            
            // for an offline user
            spyOn(fileStorageService, 'renameFileInStorage').andCallThrough();
            fileStorageService.renameFile(false, 'file1', 'file2', 'token');
            expect(synchronisationStoreService.storeDocumentToSynchronize).toHaveBeenCalled();
            expect(fileStorageService.renameFileInStorage).toHaveBeenCalledWith('file1', 'file2');
        }));

        it('fileStorageService:deleteFile', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            configuration.DROPBOX_TYPE = 'sandbox';

            // For an online user
            spyOn(fileStorageService, 'deleteFileInStorage').andCallThrough();
            fileStorageService.deleteFile(true, 'file1', 'token');
            $rootScope.$apply();
            expect(dropbox.delete).toHaveBeenCalledWith('file1', 'token', 'sandbox');
            expect(fileStorageService.deleteFileInStorage).toHaveBeenCalled();

            // for an offline user
            fileStorageService.deleteFile(false, 'file1', 'token');
            expect(synchronisationStoreService.storeDocumentToSynchronize).toHaveBeenCalledWith({
                docName: 'file1',
                action: 'delete',
                content: null
            });
        }));

        it('fileStorageService:saveFile', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            spyOn(fileStorageService, 'saveFileInStorage').andCallFake(function() {
                return deferred.promise;
            });
            spyOn(fileStorageService, 'searchFilesInStorage').andCallFake(function() {
                var defer2 = q.defer();
                defer2.resolve([]);
                return defer2.promise;
            });
            configuration.DROPBOX_TYPE = 'sandbox';
            fileStorageService.saveFile(true, 'file1', 'content', 'token');
            $rootScope.$apply();
            expect(dropbox.upload).toHaveBeenCalledWith('file1', 'content', 'token', 'sandbox');

            // for an offline user and no files corresponding
            deferred = q.defer();
            deferred.resolve();
            fileStorageService.saveFile(false, 'file1', 'content', 'token');
            $rootScope.$apply();
            expect(synchronisationStoreService.storeDocumentToSynchronize).toHaveBeenCalled();
            expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();

         // for an offline user and a file corresponding
            deferred = q.defer();
            deferred.resolve([{file: 'file1'}]);
            fileStorageService.saveFile(false, 'file1', 'content', 'token');
            $rootScope.$apply();
            expect(synchronisationStoreService.storeDocumentToSynchronize).toHaveBeenCalled();
            expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();
        }));

        it('fileStorageService:saveTempFile', inject(function(
            fileStorageService, configuration, $q) {
            q = $q;
            fileStorageService.saveTempFile('content');
            expect(localForage.setItem).toHaveBeenCalledWith('docTemp', 'content');
        }));

        it('fileStorageService:saveTempFileForPrint', inject(function(
            fileStorageService, configuration, $q) {
            q = $q;
            fileStorageService.saveTempFileForPrint('content');
            expect(localForage.setItem).toHaveBeenCalledWith('printTemp', 'content');
        }));

        it('fileStorageService:getTempFileForPrint', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var deferredSuccess = $q.defer();
            spyOn(localForage, 'getItem').andReturn(deferredSuccess.promise);
            fileStorageService.getTempFileForPrint();
            // Force to execute callbacks
            $rootScope.$apply();
            expect(localForage.getItem).toHaveBeenCalledWith('printTemp');
        }));

        it('fileStorageService:getTempFile', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var deferredSuccess = $q.defer();
            spyOn(localForage, 'getItem').andReturn(deferredSuccess.promise);
            fileStorageService.getTempFile();
            deferredSuccess.resolve();
            // Force to execute callbacks
            $rootScope.$apply();
            expect(localForage.getItem).toHaveBeenCalledWith('docTemp');
        }));

        it('fileStorageService:shareFile', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            configuration.DROPBOX_TYPE = 'sandbox';
            fileStorageService.shareFile('file1', 'token');
            $rootScope.$apply();
            expect(dropbox.shareLink).toHaveBeenCalledWith('file1', 'token',
                'sandbox');
        }));


        it('fileStorageService:deleteFromListDocument ', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            // file founded
            docArray = [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }];
            fileStorageService.deleteFromListDocument('/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html');
            $rootScope.$apply();
            expect(docArray.length).toBe(0);
            expect(localForage.setItem).toHaveBeenCalled();

            // file not founded
            docArray = [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }];
            fileStorageService.deleteFromListDocument('inexistant');
            $rootScope.$apply();
            expect(docArray.length).toBe(1);
            expect(localForage.setItem).toHaveBeenCalled();
        }));

        it('fileStorageService:saveOrUpdateInListDocument   ', inject(function(
            fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            // file founded
            docArray = [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }];
            fileStorageService.saveOrUpdateInListDocument({
                filepath: 'nouveau chemin',
                filename: 'file1',
                dateModification: '2015-9-20'
            });
            $rootScope.$apply();
            expect(docArray.length).toBe(1);
            expect(localForage.setItem).toHaveBeenCalled();


            // file not founded
            docArray = [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }];
            fileStorageService.saveOrUpdateInListDocument({
                filepath: 'nouveau chemin',
                filename: 'file2',
                dateModification: '2015-9-20'
            });
            $rootScope.$apply();
            expect(docArray.length).toBe(2);
            expect(localForage.setItem).toHaveBeenCalled();
        }));
        
        it('fileStorageService:renameFileInStorage', inject(function(
                fileStorageService, configuration, $q, $rootScope) {
                q = $q;
                configuration.DROPBOX_TYPE = 'sandbox';
                var deferred19 = q.defer();
                deferred19.resolve([{filepath: '/content'}]);
                spyOn(fileStorageService, 'searchFilesInStorage').andReturn(deferred19.promise);
                spyOn(fileStorageService, 'getFileInStorage').andReturn(deferred19.promise);
                spyOn(fileStorageService, 'saveFileInStorage').andReturn(deferred19.promise);
                spyOn(fileStorageService, 'deleteFileInStorage').andCallThrough();
                fileStorageService.renameFileInStorage('file1', 'file2');
                $rootScope.$apply();
                expect(fileStorageService.getFileInStorage).toHaveBeenCalled();
                expect(fileStorageService.searchFilesInStorage).toHaveBeenCalled();
                expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();
                expect(fileStorageService.deleteFileInStorage).toHaveBeenCalled();
            }));
    });