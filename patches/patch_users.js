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
