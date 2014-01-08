var async = require('async');

module.exports = function(app) {
    //Client Routes
    var clients = require('../api/dao/scrum');
    app.get('/clients', clients.all);
    app.post('/clients', clients.createClient);
    app.get('/clients/:clientId', clients.show);
    //Finish with setting up the clientId param
    app.param('clientId', clients.client);

    // Documents structure routes
    var docStructure = require('../api/dao/docStructure');
    app.post('/ajouterDocStructure', docStructure.createDocuments);
    app.post('/getDocument', docStructure.getDocument);


    // Test for manipilating document
    var documents = require('../api/dao/document');
    app.post('/ajouterDocument', documents.create);
    app.post('/ajouterDocuments', documents.createDocuments);
    app.get('/listerDocument', documents.all);
    
    // Test for manipilating tag
    var tags = require('../api/dao/tag');
    app.post('/addTag', tags.create);
    app.get('/readTags', tags.all);
    app.post('/updateTag', tags.update);
    app.post('/deleteTag', tags.remove);

    //test for manipulating image
    var images = require('../api/services/images');
    app.get('/images', images.index);
    app.post('/images', images.cropImage);
    app.get('/pdfjpeg', images.convertsPdfToPng);
    app.post('/oceriser', images.oceriser);
    app.post('/fileupload', images.uploadFiles);
    app.post('/texttospeech', images.textToSpeech);

    //route for profile manipulations
    var profils = require('../api/dao/profils');
    app.get('/listerProfil', profils.all);
    app.post('/deleteProfil', profils.supprimer);
    app.post('/ajouterProfils', profils.createProfile);
    app.post('/updateProfil', profils.update);
};