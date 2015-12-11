/* File: patch_users.js
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
/**
 * Created by user on 14/07/15.
 */



var mongoose = require('mongoose'),
  UserAccount = mongoose.model('User');


function createClones(number) {

    UserAccount.where({"local.email": {$regex: "agent*"}}).count(function (err, clones) {
        if (clones < 1) {
            console.log('about to create ' + number + ' clone');
            var theOne = {
                dropbox: {
                    "accessToken": "jkI5SShNlhAAAAAAAAAAFOCP79si4CE50YAzHNABXBQ0vaufQkFV7MRYKSOiRfM1",
                    "country": "MA",
                    "display_name": "cned cned",
                    "emails": "anas.youbi@neoxia.com",
                    "referral_link": "https://db.tt/oyIYlYQA",
                    "uid": "444779994"
                },
                local: {
                    authorisations: {
                        audio: false,
                        ocr: false
                    },
                    email: "agent@gmail.com",
                    nom: "smith",
                    password: "0b4e7a0e5fe84ad35fb5f95b9ceeac79",
                    prenom: "agent",
                    role: "user",
                    token: "",
                    tokenTime: 0
                }
            };
            var tmp = theOne;
            console.log('starting the cloning process');
            console.log('email have this form is [agent(number)@gmail.com');
            console.log('password for all users is [aaaaaa]');
            console.log('all users shares the same dropbox account');
            console.log('dropbox account email ' + theOne.dropbox.emails);

            for (var i = 0; i < number; i++) {
                tmp.local.email = 'agent' + i + '@gmail.com';
                UserAccount.create(tmp, function (data) {
                });
            }
            console.log(number + ' clones created');

        } else {
            console.log('clones already exists');
        }
    });
}


function killClones() {
    UserAccount.where({"local.email": {$regex: "agent*"}}).count(function (err, clones) {
        console.log(clones + ' clones where found');
        if (clones > 0) {
            console.log('about to wipe all clones');
            UserAccount.remove({"local.email": {$regex: "agent*"}}, function (clones) {
                console.log('all clones removed');
            });
        } else {
            console.log('no clones found');
        }
    });
}

refreshDummyUsers = function () {
    console.log('refreshing all dummy users');
    UserAccount.where({"local.email": {$regex: "agent*"}}).count(function (err, clones) {
        console.log(clones + ' clones where found');
        console.log('about to wipe all clones');
        UserAccount.remove({"local.email": {$regex: "agent*"}}, function (clones) {
            console.log('all clones removed');
            createClones(400);
        });
    });
};


addOcrAudioAuthorisations = function () {
    //console.log('refreshing all dummy users');
    UserAccount.where({"local.authorisations": {$exists: false}}).count(function (err, numberofUsers) {
        //console.log(numberofUsers + ' not updated found');

        UserAccount.where({"local.authorisations": {$exists: false}}).exec(function (err, usersList) {
            //console.log(usersList);


            usersList.forEach(function (n) {

                //console.log(n.local.email)
                n.local.authorisations = {
                    ocr: false,
                    audio: false
                };

                n.save(function (err) {
                    //if (err) {
                    //    console.log('failed updating users')
                    //} else {
                    //    console.log('updated ' + numberofUsers +' users');
                    //}
                });

            });

        });

    });
};

addOcrAudioAuthorisations();

//killClones();

//createClones(400);

//refreshDummyUsers();

//commande export db to csv
// mongoexport --db adaptation --collection users --fields local.email,local.password --csv
