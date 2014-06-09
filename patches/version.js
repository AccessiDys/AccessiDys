var mongoose = require('mongoose'),
    sysParam = mongoose.model('sysParam');

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
                    console.log('success saving version ==> ');
                    console.log(sysParam);
                }
            });
        }
    }
});