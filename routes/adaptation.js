/* File: adaptation.js
 *
 * Copyright (c) 2014
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

'use strict';
var User = require('../models/User');

var jwt = require('jwt-simple');
var salt = 'toGenerateSalt';

module.exports = function(app, passport) {


    function isLoggedIn(req, res, next) {

        var errMessage = {};
        var mydate = new Date();
        var search = '';
        var message = '';
        var param = '';
        if (req.method === 'GET') {
            search = req.query.id;
            message = req._parsedUrl.pathname;
            param = JSON.stringify(req.query);
        } else if (req.method === 'POST') {
            message = req._parsedUrl.pathname;
            if (req._parsedUrl.path.indexOf('/fileupload') > -1) {
                param = JSON.stringify(req.files.uploadedFile);
                search = req._parsedUrl.path.substring(req._parsedUrl.path.indexOf('id=') + 3, req._parsedUrl.path.length);
            } else if (req._parsedUrl.path.indexOf('/oceriser') > -1) {
                param = 'image base64 sended';
                search = req.body.id;
            } else {
                param = JSON.stringify(req.body);
                search = req.body.id;
            }

        }
        if (search !== '') {
            User.findOne({
                'local.token': search
            }, function(err, user) {
                if (err !== null || !user) {
                    errMessage = {
                        message: 'le token est introuveble',
                        code: 1
                    };
                    res.send(401, errMessage);
                } else {
                    var nowTime = mydate.getTime();
                    if (user && parseInt(nowTime) < parseInt(user.local.tokenTime)) {
                        helpers.journalisation(0, user, message, param);
                        user.local.tokenTime = mydate.getTime() + 3600000;
                        user.save(function(err) {
                            if (err) {
                                var item = {
                                    message: 'il ya un probleme dans la sauvgarde '
                                };
                                res.send(401, item);
                            } else {
                                req.user = user;
                                return next();
                            }
                        });
                    } else {
                        errMessage = {
                            message: 'le token est perime veuillez vous reconnectez',
                            code: 2
                        };
                        res.send(401, errMessage);
                    }
                }
            });
        }
    }

    function checkIsLoged(req, res, next) {
        var errMessage = {};
        var mydate = new Date();
        var search = '';
        var message = '';
        var param = '';
        if (req.method === 'GET') {
            if (req.query.id) {
                search = req.query.id;
            };
            message = req._parsedUrl.pathname;
            param = JSON.stringify(req.query);
        } else if (req.method === 'POST') {
            if (req.body.id) {
                search = req.body.id;
            }
            message = req._parsedUrl.pathname;
            param = JSON.stringify(req.body);
        }
        if (search !== '') {
            User.findOne({
                'local.token': search
            }, function(err, user) {
                if (err !== null || !user) {
                    errMessage = {
                        message: 'le token est introuveble',
                        code: 1
                    };
                    res.send(401, errMessage);
                } else {
                    var nowTime = mydate.getTime();
                    if (user && parseInt(nowTime) < parseInt(user.local.tokenTime)) {
                        helpers.journalisation(0, user, message, param);
                        user.local.tokenTime = mydate.getTime() + 3600000;
                        user.save(function(err) {
                            if (err) {
                                var item = {
                                    message: 'il ya un probleme dans la sauvgarde '
                                };
                                res.send(401, item);
                            } else {
                                req.user = user;
                                return next();
                            }
                        });
                    } else {
                        errMessage = {
                            message: 'le token est perime veuillez vous reconnectez',
                            code: 2
                        };
                        helpers.journalisation(0, 'GUEST', message, param);
                        return next();
                    }
                }
            });
        } else {
            helpers.journalisation(0, 'GUEST', message, param);
            return next();
        }
    }

    function isLoggedInAdmin(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.local.role === 'admin') {
                return next();
            }
        }
        res.send(401);
    }

    app.get('/adminService', isLoggedInAdmin, function(req, res) {
        res.jsonp(200, req.user);
    });



    // Documents structure routes
    var docStructure = require('../api/dao/docStructure');
    app.post('/ajouterDocStructure', docStructure.createDocuments);
    app.post('/getDocument', docStructure.getDocument);
    app.post('/getDocuments', docStructure.all);

    // Routes for tag manipulating
    var tags = require('../api/dao/tag');
    app.post('/addTag', checkIsLoged, tags.create);
    app.get('/readTags', checkIsLoged, tags.all);
    app.post('/updateTag', checkIsLoged, tags.update);
    app.post('/deleteTag', checkIsLoged, tags.remove);
    app.post('/getTagById', tags.findTagById);

    //test for manipulating image
    var images = require('../api/services/images');
    // app.post('/images', images.cropImage);
    // app.post('/pdfimage', images.convertsPdfToPng);
    app.post('/oceriser', isLoggedIn, images.oceriser);
    app.post('/fileupload', isLoggedIn, images.uploadFiles);
    app.post('/texttospeech', isLoggedIn, images.textToSpeech);
    // app.post('/espeaktexttospeechdemo', images.espeakTextToSpeech);
    // app.post('/festivaltexttospeechdemo', images.festivalTextToSpeech);
    app.post('/sendPdf', isLoggedIn, images.sendPdf);
    app.post('/sendPdfHTTPS', isLoggedIn, images.sendPdfHTTPS);

    //test for manipulating emailSend
    var helpers = require('../api/helpers/helpers');
    app.post('/sendMail', helpers.sendMail);



    //route for profile manipulations
    var profils = require('../api/dao/profils');
    app.get('/listerProfil', profils.all);
    app.post('/deleteProfil', profils.supprimer);
    app.post('/ajouterProfils', profils.createProfile);
    app.post('/updateProfil', profils.update);
    app.post('/profilParUser', profils.allByUser);
    app.post('/chercherProfil', profils.chercherProfil);
    app.post('/ajoutDefaultProfil', profils.ajoutDefaultProfil);


    //route for userProfile manipulations
    var userProfil = require('../api/dao/userProfil');
    app.post('/ajouterUserProfil', userProfil.createUserProfil);
    app.post('/addUserProfil', userProfil.addUserProfil);
    app.post('/removeUserProfile', userProfil.removeUserProfile);
    app.post('/setDefaultProfile', userProfil.setDefaultProfile);
    app.post('/chercherProfilParDefaut', userProfil.chercherProfilParDefaut);
    app.post('/chercherProfilActuel', userProfil.chercherProfilActuel);
    app.post('/defaultByUserProfilId', userProfil.defaultByUserProfilId);
    app.post('/addUserProfilFavoris', userProfil.addUserProfilFavoris);
    app.post('/findUserProfilFavoris', userProfil.findUserProfilFavoris);
    app.post('/findUserProfilsFavoris', userProfil.findUserProfilsFavoris);
    app.post('/removeUserProfileFavoris', userProfil.removeUserProfileFavoris);
    app.post('/findUsersProfilsFavoris', userProfil.findUsersProfilsFavoris);
    app.post('/cancelDefaultProfile', userProfil.cancelDefaultProfile);
    app.post('/chercherProfilsParDefaut', userProfil.chercherProfilsParDefaut);


    //route for ProfileTag manipulations
    var profilsTags = require('../api/dao/profilTag');
    app.post('/ajouterProfilTag', profilsTags.createProfilTag);
    app.post('/chercherTagsParProfil', profilsTags.findTagsByProfil);
    app.post('/supprimerProfilTag', profilsTags.supprimer);
    app.post('/modifierProfilTag', profilsTags.update);
    app.post('/chercherProfilsTagParProfil', profilsTags.chercherProfilsTagParProfil);
    app.post('/saveProfilTag', profilsTags.saveProfilTag);

    //route for userAccount manipulations
    var userAccount = require('../api/dao/userAccount');
    app.post('/modifierInfosCompte', userAccount.update);
    app.get('/allAccounts', isLoggedInAdmin, userAccount.all);
    app.post('/deleteAccounts', isLoggedInAdmin, userAccount.supprimer);
    app.post('/modifierPassword', userAccount.modifierPassword);
    app.post('/checkPassword', userAccount.checkPassword);
    app.post('/restorePassword', userAccount.restorePassword);
    app.post('/saveNewPassword', userAccount.saveNewPassword);
    app.post('/createAccount', userAccount.create);
    app.post('/checkPasswordToken', userAccount.checkPasswordToken);
    app.post('/findAdmin', userAccount.findAdmin);

    //passportJS
    app.post('/signup', passport.authenticate('local-signup', {
            failureRedirect: '/#/',
            failureFlash: true
        }),
        function(req, res) {
            res.jsonp(req.user);
        });

    app.get('/login', passport.authenticate('local-login', {
            failureRedirect: '/#/',
            failureFlash: true
        }),
        function(req, res) {
            res.jsonp(200, req.user);
        });

    app.get('/profile', isLoggedIn, function(req, res) {
        var user = req.user;
        // console.log('END: userId ----> ' + req.user._id + ' service ---->' + req._parsedUrl.path);
        helpers.journalisation(1, req.user, req._parsedUrl.path, '');
        res.jsonp(200, user);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/auth/dropbox',
        passport.authenticate('dropbox-oauth2'));

    app.get('/auth/dropbox/callback',
        passport.authenticate('dropbox-oauth2', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/#/inscriptionContinue');
        });
};