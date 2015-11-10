/* File: fileStorageService.js
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
/* global spyOn:false */

describe(
		'Service: fileStorageService',
		function() {

			var dropbox, q, deferred, localForage;

			beforeEach(module('cnedApp'));

			beforeEach(function() {
				dropbox = {
					search : function(query) {
						deferred = q.defer();
						// Place the fake return object here
						if (query === '.html' || query === 'file1') {
							deferred
									.resolve([ {
										path : '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
										modified: 'Sun, 20 Sep 2015 16:09:46 +0000'
									} ]);
						} else {
							deferred.reject({
								error : 'une erreur est survenue'
							});
						}
						return deferred.promise;
					},
					download : function() {
						deferred = q.defer();
						// Place the fake return object here
						deferred.resolve('fileContent');
						return deferred.promise;
					},
					rename : function() {
						deferred = q.defer();
						// Place the fake return object here
						deferred.resolve('<h1>test</h1>');
						return deferred.promise;
					},
					delete : function() {
						deferred = q.defer();
						// Place the fake return object here
						deferred.resolve();
						return deferred.promise;
					},
					upload : function() {
						deferred = q.defer();
						// Place the fake return object here
						deferred.resolve({
                            path : '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                            modified: 'Sun, 20 Sep 2015 16:09:46 +0000'
                        });
						return deferred.promise;
					},
					shareLink : function() {
						deferred = q.defer();
						// Place the fake return object here
						deferred.resolve({url: 'http://test.com'});
						return deferred.promise;
					}
				};
				localForage = {
					getItem : function(item) {
						deferred = q.defer();
						// Place the fake return object here
						if (item === 'listDocument') {
							deferred
									.resolve([ {
										filepath : '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
										filename : 'file1',
										dateModification : '2015-9-20'
									} ]);
						} else {
							deferred.reject({
								error : 'une erreur est survenue'
							});
						}
						return deferred.promise;
					},
					setItem : function(item) {
						deferred = q.defer();
						// Place the fake return object here
						if (item === 'listDocument') {
							deferred.resolve();
						} else {
							deferred.reject({
								error : 'une erreur est survenue'
							});
						}
						return deferred.promise;
					},
					removeItem : function(item) {
						deferred = q.defer();
						// Place the fake return object here
						if (item === 'file1') {
							deferred.resolve();
						} else {
							deferred.reject({
								error : 'une erreur est survenue'
							});
						}
						return deferred.promise;
					}
				};
				spyOn(dropbox, 'search').andCallThrough();
				spyOn(dropbox, 'download').andCallThrough();
				spyOn(dropbox, 'rename').andCallThrough();
				spyOn(dropbox, 'delete').andCallThrough();
				spyOn(dropbox, 'upload').andCallThrough();
				spyOn(dropbox, 'shareLink').andCallThrough();
				spyOn(localForage, 'setItem').andCallThrough();
				spyOn(localForage, 'removeItem').andCallThrough();

				module(function($provide) {
					$provide.value('dropbox', dropbox);
					$provide.value('$localForage', localForage);
				});
			});

			it('fileStorageService:searchAllFiles', inject(function(
					fileStorageService, configuration, $q) {
				q=$q;
				
				var deferredSuccess = $q.defer();
				spyOn(localForage, 'getItem').andReturn(deferredSuccess.promise);
				
				configuration.DROPBOX_TYPE = 'sandbox';
				fileStorageService.searchAllFiles('token');
				expect(dropbox.search).toHaveBeenCalledWith('.html', 'token',
						'sandbox');
				expect(localForage.getItem)
						.toHaveBeenCalledWith('listDocument');
				deferredSuccess.resolve();
				
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
				fileStorageService.searchFilesInStorage('file1').then(function (files) {
					result = files;
				});
				expect(localForage.getItem).toHaveBeenCalledWith('listDocument');
				// resolves the promise
				deferredSuccess.resolve([ {
					filepath : '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
					filename : 'file1',
					dateModification : '2015-9-20'
				} ]);
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
				fileStorageService.searchFiles('file1', 'token').then(function(data) {
					result = data;
				});
				expect(dropbox.search).toHaveBeenCalledWith('file1', 'token',
						'sandbox');
				// Force to execute callbacks
				$rootScope.$apply();
				expect(result.length).toBe(1);
				expect(result[0].filename).toEqual('file1');
				expect(result[0].dateModification).toEqual(1442765386000);
			}));
			
			it('fileStorageService:updateFileListInStorage', inject(function(
					fileStorageService, configuration, $q) {
				q = $q;
				
				var dropboxFiles = [ {
					path : '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
					modified: 'Sun, 20 Sep 2015 16:09:46 +0000'
				} ];
				configuration.DROPBOX_TYPE = 'sandbox';
				fileStorageService.updateFileListInStorage(dropboxFiles);
				expect(localForage.setItem).toHaveBeenCalledWith('listDocument',[ {
					filepath : '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
					filename : 'file1',
					dateModification : 1442765386000
				} ]);
			}));
			
			it('fileStorageService:saveFileInStorage', inject(function(
					fileStorageService, configuration, $q) {
				q = $q;
				fileStorageService.saveFileInStorage('file1', 'content');
				expect(localForage.setItem).toHaveBeenCalledWith('document.file1','content');
			}));
			
			it('fileStorageService:deleteFileInStorage', inject(function(
					fileStorageService, configuration, $q, $rootScope) {
				q = $q;
				fileStorageService.deleteFileInStorage('file1');
				$rootScope.$apply();
				expect(localForage.removeItem).toHaveBeenCalledWith('document.file1');
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
				expect(localForage.setItem).toHaveBeenCalledWith('cssURL.css1','blob:css');
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
				configuration.DROPBOX_TYPE = 'sandbox';
				fileStorageService.getFile('file1', 'token');
				$rootScope.$apply();
				expect(dropbox.search).toHaveBeenCalledWith('file1', 'token',
						'sandbox');
			}));
			
			it('fileStorageService:renameFile', inject(function(
					fileStorageService, configuration, $q, $rootScope) {
				q = $q;
				configuration.DROPBOX_TYPE = 'sandbox';
				fileStorageService.renameFile('file1', 'file2', 'token');
				$rootScope.$apply();
				expect(dropbox.rename).toHaveBeenCalledWith('file1', 'file2', 'token',
						'sandbox');
			}));
			
			it('fileStorageService:deleteFile', inject(function(
					fileStorageService, configuration, $q) {
				q = $q;
				configuration.DROPBOX_TYPE = 'sandbox';
				fileStorageService.deleteFile('file1', 'token');
				expect(dropbox.delete).toHaveBeenCalledWith('file1', 'token',
						'sandbox');
			}));
			
			it('fileStorageService:saveFile', inject(function(
					fileStorageService, configuration, $q, $rootScope) {
				q = $q;
				configuration.DROPBOX_TYPE = 'sandbox';
				fileStorageService.saveFile('file1', 'content', 'token');
				$rootScope.$apply();
				expect(dropbox.upload).toHaveBeenCalledWith('file1', 'content', 'token',
						'sandbox');
			}));
			
			it('fileStorageService:saveTempFile', inject(function(
					fileStorageService, configuration, $q) {
				q = $q;
				fileStorageService.saveTempFile('content');
				expect(localForage.setItem).toHaveBeenCalledWith('document.temp','content');
			}));
			
			it('fileStorageService:saveTempFileForPrint', inject(function(
                    fileStorageService, configuration, $q) {
                q = $q;
                fileStorageService.saveTempFileForPrint('content');
                expect(localForage.setItem).toHaveBeenCalledWith('document.printTemp','content');
            }));
			
			it('fileStorageService:getTempFileForPrint', inject(function(
                    fileStorageService, configuration, $q, $rootScope) {
                q = $q;
                var deferredSuccess = $q.defer();
                spyOn(localForage, 'getItem').andReturn(deferredSuccess.promise);
                fileStorageService.getTempFileForPrint();
                // Force to execute callbacks
                $rootScope.$apply();
                expect(localForage.getItem).toHaveBeenCalledWith('document.printTemp');
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
				expect(localForage.getItem).toHaveBeenCalledWith('document.temp');
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
		});
