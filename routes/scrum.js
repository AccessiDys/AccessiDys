var async = require('async');

module.exports = function(app) {
    //Client Routes
    console.log("init routes");
    var clients = require('../api/scrum');
    app.get('/clients', clients.all);
    app.post('/clients', clients.createClient);
    app.get('/clients/:clientId', clients.show);

    //Finish with setting up the clientId param
    app.param('clientId', clients.client);

    //test for manipulating image
    var images = require('../api/images');
    app.get('/images', images.index);
    // app.get('/image', images.manipImage);
    app.post('/images', images.cropImage);
    app.get('/pdfpng', images.convertsPdfToPng);
    app.post('/oceriser', images.oceriser);
    app.post('/fileupload', images.uploadFiles);
      
};