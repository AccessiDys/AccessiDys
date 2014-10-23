'use strict';

var mongoose = require('mongoose'),
    sysParam = mongoose.model('sysParam'),
    ProfilTag = mongoose.model('ProfilTag');

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


function updateProfilTagToEm(ListProfilTag, counter) {
    var item = ListProfilTag[counter];
    ProfilTag.findById(item._id, function(err, foundItem) {
        if (item !== null && foundItem !== null) {

            switch (foundItem.taille) {
                case 8:
                    foundItem.taille = 1;
                    break;
                case 10:
                    foundItem.taille = 2;

                    break;
                case 12:
                    foundItem.taille = 3;

                    break;
                case 14:
                    foundItem.taille = 4;

                    break;
                case 16:
                    foundItem.taille = 5;

                    break;
                case 18:
                    foundItem.taille = 6;

                    break;
                case 20:
                    foundItem.taille = 7;

                    break;
                default:
                    foundItem.taille = 1;

            }

            switch (foundItem.interligne) {
                case 10:
                    foundItem.interligne = 1;
                    break;
                case 14:
                    foundItem.interligne = 2;

                    break;
                case 18:
                    foundItem.interligne = 3;

                    break;
                case 22:
                    foundItem.interligne = 4;

                    break;
                case 26:
                    foundItem.interligne = 5;

                    break;
                case 30:
                    foundItem.interligne = 6;

                    break;
                case 35:
                    foundItem.interligne = 7;

                    break;
                case 40:
                    foundItem.interligne = 8;

                    break;
                default:
                    foundItem.interligne = 1;

            }

            foundItem.texte = '<p data-font=\'' + foundItem.police + '\' data-size=\'' + foundItem.taille + '\' data-lineheight=\'' + foundItem.interligne + '\' data-weight=\'' + foundItem.styleValue + '\' data-coloration=\'' + foundItem.coloration + '\'data-word-spacing=\'' + foundItem.spaceSelected + '\' data-letter-spacing=\'' + foundItem.spaceCharSelected + '\'> </p>';

            console.log(foundItem);
            /*
            foundItem.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    counter++;
                    if (counter < ListProfilTag.length) {
                        updateProfilTagToEm(ListProfilTag, counter);
                    } else {
                        console.log('update style unit from PX to EM Finished');
                    }
                }
            });
            */
        }
    });
}
/*
function updateProfilTag(ListProfilTag, counter) {
    var item = ListProfilTag[counter];
    ProfilTag.findById(item._id, function(err, foundItem) {
        if (item !== null && foundItem !== null) {
            foundItem.spaceSelected = 0;
            foundItem.spaceCharSelected = 0;
            if (item.texte) {
                var start = item.texte.indexOf('</p>') - 2;
                foundItem.texte = item.texte.substring(0, start) + 'data-word-spacing=\"0\" data-letter-spacing=\"0\"> </p>';
                foundItem.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        counter++;
                        if (counter < ListProfilTag.length) {
                            updateProfilTag(ListProfilTag, counter);
                        } else {
                            console.log('update Finished');
                        }
                    }
                });
            }
        }
    });
};

ProfilTag.find({
    spaceSelected: {
        $exists: false
    }
}, function(err, ListProfilTag) {
    if (ListProfilTag) {
        if (ListProfilTag.length > 0) {
            updateProfilTag(ListProfilTag, 0);
        }
    }

})

*/

/*
 ProfilTag.find({}, function(err, ListProfilTag) {
    if (ListProfilTag) {
        if (ListProfilTag.length > 0) {
            updateProfilTagToEm(ListProfilTag, 0);
        }
    }

});
 */