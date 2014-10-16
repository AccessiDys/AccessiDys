var mongoose = require('mongoose'),
    sysParam = mongoose.model('sysParam'),
    ProfilTag = mongoose.model('ProfilTag');

sysParam.find({}, function(err, sysParamList) {
    if (err) {
        console.log('error getting list ==> ');
        console.log(err);
    } else {
        if (sysParamList.length == 0) {
            var newSysParam = new sysParam();
            var mydate = new Date();
            newSysParam.appVersion = 0;
            newSysParam.dateVersion = mydate.getDate() + "/" + (mydate.getMonth() + 1) + "/" + mydate.getFullYear() + '_' + mydate.getHours() + ":" + mydate.getMinutes() + ":" + mydate.getSeconds();
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

function updateProfilTag(ListProfilTag, counter) {
    var item = ListProfilTag[counter];
    ProfilTag.findById(item._id, function(err, foundItem) {
        foundItem.spaceSelected = 0;
        foundItem.spaceCharSelected = 0;
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
    });
};

ProfilTag.find({
    spaceSelected: {
        $exists: false
    }
}, function(err, ListProfilTag) {
    updateProfilTag(ListProfilTag, 0);
})