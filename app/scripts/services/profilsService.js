/*File: tagsService.js
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

cnedApp.service('profilsService', function ($http, configuration, fileStorageService) {

    /**
     * Recupere l'url du css
     * @param id l'identifiant du profil
     * @method getUrl
     */
    this.getUrl = function () {
        var token = localStorage.getItem('compteId');
        var id = JSON.parse(localStorage.getItem('profilActuel'))._id.toString();
        var url = configuration.URL_REQUEST + '/cssProfil/' + id + '?id=' + token;

        return $http({
            url: url,
            method: "GET",
            responseType: "blob"
        }).then(function (response) {
            url = URL.createObjectURL(response.data);
            return fileStorageService.saveCSSInStorage(url, id);
        }, function () {
            return fileStorageService.getCSSInStorage(id);
        }).then(function () {
            return fileStorageService.getCSSInStorage(id);
        });
    };
});
