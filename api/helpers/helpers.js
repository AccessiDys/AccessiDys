// Getting Extension of Files
exports.getFileExtension = function(filename) {
    var path = require('path');
    return path.extname(filename);
}

// Check if File exists
exports.fileExists = function(filePath) {
    var fs = require('fs');
    // var fileExists;
    // fs.existsSync(filePath, function(exists) {
    //     console.log("this fucking shit ==> ");
    //     console.log(exists);
    //     // return exists;
    // });

    
    fs.stat(filePath, function(err, stat) {
        if (err == null) {
            console.log('File exists');
            console.log(stat);
            return true;
        } else if (err.code == 'ENOENT') {
            console.log("error ENOENT");
            console.log(err);
            return false;
            // fs.writeFile('log.txt', 'Some log\n');
        } else {
            console.log('Some other error: ', err.code);
            console.log(err);
            return false;
        }
    });
}