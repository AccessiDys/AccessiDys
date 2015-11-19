/* File: helpers.js
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

describe('factory: helpers',

function() {
    beforeEach(module('cnedApp'));

    beforeEach(function() {

    });
    it('helpers:removeAccents', inject(function(removeAccents) {
        expect(removeAccents('&agrave;&eacute;')).toEqual('àé');
    }));
    it('helpers:removeStringsUppercaseSpaces', inject(function(removeStringsUppercaseSpaces) {
        expect(removeStringsUppercaseSpaces('àé AE')).toEqual('aeae');
    }));
    it('helpers:removeHtmlTags', inject(function(removeHtmlTags) {
        expect(removeHtmlTags('<span>test<br/></span>')).toEqual('test');
    }));
    it('helpers:htmlToPlaintext', inject(function(htmlToPlaintext) {
        expect(htmlToPlaintext('<span>test<br/></span>')).toEqual('test');
    }));

    it('helpers:protocolToLowerCase', inject(function(protocolToLowerCase){
      expect(protocolToLowerCase('HTTP://test.com')).toEqual('http://test.com');
      expect(protocolToLowerCase('HTTPS://test.com')).toEqual('https://test.com');
      expect(protocolToLowerCase('HttPS://test.com')).toEqual('https://test.com');
    }));

    it('serviceCheck:getData', inject(function(serviceCheck, $rootScope) {
        localStorage.removeItem('compteId');
        var result;
        serviceCheck.getData().then(function(data) {
            result = data;
        });
        $rootScope.$apply();
        expect(result.loged).toBe(false);
        expect(result.dropboxWarning).toBe(true);
    }));
});
