'use strict';

module.exports = function(app) {

    // Documents structure routes
    var docStructure = require('../api/dao/docStructure');
    app.post('/ajouterDocStructure', docStructure.createDocuments);
    app.post('/getDocument', docStructure.getDocument);


    // Test for manipilating document
    var documents = require('../api/dao/document');
    app.post('/ajouterDocument', documents.create);
    app.post('/ajouterDocuments', documents.createDocuments);
    app.get('/listerDocument', documents.all);

    // Routes for tag manipulating
    var tags = require('../api/dao/tag');
    app.post('/addTag', tags.create);
    app.get('/readTags', tags.all);
    app.post('/updateTag', tags.update);
    app.post('/deleteTag', tags.remove);

    //test for manipulating image
    var images = require('../api/services/images');
    app.post('/images', images.cropImage);
    app.get('/pdfjpeg', images.convertsPdfToPng);
    app.post('/oceriser', images.oceriser);
    app.post('/fileupload', images.uploadFiles);
    app.post('/texttospeech', images.textToSpeech);
    app.post('/espeaktexttospeechdemo', images.espeakTextToSpeech);
    app.post('/festivaltexttospeechdemo', images.festivalTextToSpeech);


    //route for profile manipulations
    var profils = require('../api/dao/profils');
    app.get('/listerProfil', profils.all);
    app.post('/deleteProfil', profils.supprimer);
    app.post('/ajouterProfils', profils.createProfile);
    app.post('/updateProfil', profils.update);

    //route for ProfileTag manipulations
    var profilsTags = require('../api/dao/profilTag');
    app.post('/ajouterProfilTag', profilsTags.createProfilTag);
    app.post('/chercherTagsParProfil', profilsTags.findTagsByProfil);
    app.post('/supprimerProfilTag', profilsTags.supprimer);

};