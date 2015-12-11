/* File: version.js
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

var mongoose = require('mongoose'),
    sysParam = mongoose.model('sysParam');

sysParam.find({}, function(err, sysParamList) {
    if (err) {
        console.log('error getting list ==> ');
        console.log(err);
    } else {
        if (sysParamList.length === 0) {
            var newSysParam = new sysParam();
            var mydate = new Date();
            newSysParam.appVersion = 0;
            newSysParam.dateVersion = mydate.getDate() + '/' + (mydate.getMonth() + 1) + '/' + mydate.getFullYear() + '_' + mydate.getHours() + ':' + mydate.getMinutes() + ':' + mydate.getSeconds();
            newSysParam.save(function(err, sysParam) {
                if (err) {
                    console.log('error saving version ==> ');
                } else {
                    global.appVersion = {
                        version: 0,
                        hard: false
                    };
                    console.log('success saving version ==> ');
                    console.log(sysParam);
                }
            });
        } else {
            global.appVersion = {
                version: sysParamList[0].appVersion,
                hard: sysParamList[0].hardUpdate
            };
            console.log('App Version : ' + global.appVersion.version + ' - Hard Mode  : ' + global.appVersion.hard);
        }
    }
});