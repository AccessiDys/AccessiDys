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

describe('Service: fileStorageService', function() {

    var dropbox, q, deferred, localForage;

    beforeEach(module('cnedApp'));

    beforeEach(function(){
      dropbox = {
              search : function(query, access_token, dropbox_type) {
                  deferred = q.defer();
                  // Place the fake return object here
                  if (query === '.html') {
                      deferred.resolve([{
                        path: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html'
                      }]);
                  } else {
                      deferred.reject({error : 'une erreur est survenue'});
                  }
                  return deferred.promise;
              }
      };
      localForage = {
            getItem : function(item) {
                deferred = q.defer();
                // Place the fake return object here
                if (item === 'listDocument') {
                    deferred.resolve([{
                      filepath: '/path/file1',
                      filename: '2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                      dateModification : '2015-9-20'
                    }]);
                } else {
                    deferred.reject({error : 'une erreur est survenue'});
                }
                return deferred.promise;
            },
            setItem : function(item, value) {
                deferred = q.defer();
                // Place the fake return object here
                if (item === 'listDocument') {
                    deferred.resolve();
                } else {
                    deferred.reject({error : 'une erreur est survenue'});
                }
                return deferred.promise;
            }
      };
      spyOn(dropbox, 'search').andCallThrough();
      spyOn(localForage, 'setItem').andCallThrough();
      spyOn(localForage, 'getItem').andCallThrough();


      module(function($provide) {
  		  $provide.value('dropbox', dropbox);

        $provide.value('$localForage', localForage);
      });
  	});

    it('fileStorageService:searchAllFiles', inject(function (fileStorageService, configuration, $q) {
        q=$q;
        configuration.DROPBOX_TYPE = 'sandbox';
        fileStorageService.searchAllFiles('token');
        expect(dropbox.search).toHaveBeenCalledWith('.html', 'token', 'sandbox');
        expect(localForage.setItem).toHaveBeenCalled();
        expect(localForage.getItem).toHaveBeenCalledWith('listDocument');
    }));
});
