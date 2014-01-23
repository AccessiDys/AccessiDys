'use strict';

// Getting Extension of Files
exports.getFileExtension = function(filename) {
    var path = require('path');
    return path.extname(filename);
};