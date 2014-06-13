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
var socket = require('./socket.js');
module.exports = function(app, passport) {


    function isLoggedIn(req, res, next) {
        global.io.sockets.emit('notif', {
            lastItem: 'newProduct'
        });

        var errMessage = {};
        var mydate = new Date();
        var search = '';
        var message = '';
        var param = '';
        if (req.method === 'GET') {
            search = req.query.id;
            message = req._parsedUrl.pathname;
            param = JSON.stringify(req.query);
            if (param.length > 100) {
                param = param.substring(0, 100);
            }
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
                if (param.length > 100) {
                    param = param.substring(0, 100);
                }
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
        console.log('------------------------- Using ISCHECKED --------------------');
        var mydate = new Date();
        var search = '';
        var message = '';
        var param = '';
        if (req.method === 'GET') {
            if (req.query.id) {
                search = req.query.id;
            }
            message = req._parsedUrl.pathname;
            param = JSON.stringify(req.query);
            if (param.length > 100) {
                param = param.substring(0, 100);
            }
        } else if (req.method === 'POST') {
            if (req.body.id) {
                search = req.body.id;
            }

            message = req._parsedUrl.pathname;
            param = JSON.stringify(req.body);
            if (param.length > 100) {
                param = param.substring(0, 100);
            }
        }
        if (search !== '') {
            User.findOne({
                'local.token': search
            }, function(err, user) {
                if (err !== null || !user) {
                    helpers.journalisation(0, 'GUEST', message, param);
                    return next();
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
            param = JSON.stringify(req.body);
            search = req.body.id;
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

                    if (user.local.role === 'admin') {
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
                    } else {
                        errMessage = {
                            message: 'Vous navez pas le droit d entre ici',
                            code: 3
                        };
                        res.send(401, errMessage);
                    }
                }
            });
        }
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

    app.post('/previewPdf', isLoggedIn, images.previewPdf);
    app.post('/previewPdfHTTPS', isLoggedIn, images.previewPdfHTTPS);
    app.post('/htmlImage', images.htmlImage);
    app.post('/htmlPage', images.htmlPage);
    app.post('/epubUpload', images.epubUpload);
    app.post('/externalEpub', images.externalEpub);

    
    //test for manipulating emailSend
    var helpers = require('../api/helpers/helpers');
    app.post('/sendMail', helpers.sendMail);
    app.post('/sendEmail', helpers.sendEmail);

    //route for profile manipulations
    var profils = require('../api/dao/profils');
    app.post('/deleteProfil', isLoggedIn, profils.supprimer);
    app.post('/ajouterProfils', isLoggedIn, profils.createProfile);
    app.post('/updateProfil', isLoggedIn, profils.update);
    app.post('/profilParUser', isLoggedIn, profils.allByUser);
    app.post('/chercherProfil', checkIsLoged, profils.chercherProfil);
    app.post('/ajoutDefaultProfil', profils.ajoutDefaultProfil); //terre
    app.post('/delegateProfil', profils.delegateProfil);
    app.post('/annulerDelegateUserProfil', profils.annulerDelegateUserProfil);
    app.get('/listeProfils', isLoggedIn, profils.listeProfils);

    //route for userProfile manipulations
    var userProfil = require('../api/dao/userProfil');
    app.post('/ajouterUserProfil', isLoggedIn, userProfil.createUserProfil);
    app.post('/addUserProfil', userProfil.addUserProfil); //terre
    app.post('/removeUserProfile', isLoggedIn, userProfil.removeUserProfile);
    app.post('/setDefaultProfile', isLoggedIn, userProfil.setDefaultProfile);
    app.post('/chercherProfilParDefaut', userProfil.chercherProfilParDefaut); //free
    app.post('/chercherProfilActuel', isLoggedIn, userProfil.chercherProfilActuel);
    app.post('/defaultByUserProfilId', isLoggedIn, userProfil.defaultByUserProfilId);
    app.post('/addUserProfilFavoris', isLoggedIn, userProfil.addUserProfilFavoris);
    app.post('/findUserProfilFavoris', isLoggedIn, userProfil.findUserProfilFavoris);
    app.post('/findUserProfilsFavoris', isLoggedIn, userProfil.findUserProfilsFavoris);
    app.post('/findUserProfilsDelegate', isLoggedIn, userProfil.findUserProfilsDelegate);
    app.post('/removeUserProfileFavoris', isLoggedIn, userProfil.removeUserProfileFavoris);
    app.post('/findUsersProfilsFavoris', isLoggedIn, userProfil.findUsersProfilsFavoris);
    app.post('/cancelDefaultProfile', isLoggedIn, userProfil.cancelDefaultProfile);
    app.post('/chercherProfilsParDefaut', isLoggedIn, userProfil.chercherProfilsParDefaut);
    app.post('/delegateUserProfil', userProfil.delegateUserProfil);
    app.post('/retirerDelegateUserProfil', userProfil.retirerDelegateUserProfil);
    app.post('/findUserProfil', userProfil.findUserProfil);
    app.post('/findByUserProfil', userProfil.findByUserProfil);



    //route for ProfileTag manipulations
    var profilsTags = require('../api/dao/profilTag');
    app.post('/ajouterProfilTag', isLoggedIn, profilsTags.createProfilTag);
    app.post('/chercherTagsParProfil', profilsTags.findTagsByProfil); //free
    app.post('/supprimerProfilTag', isLoggedIn, profilsTags.supprimer);
    app.post('/modifierProfilTag', isLoggedIn, profilsTags.update);
    app.post('/chercherProfilsTagParProfil', isLoggedIn, profilsTags.chercherProfilsTagParProfil);
    app.post('/saveProfilTag', isLoggedIn, profilsTags.saveProfilTag); //terre

    //route for userAccount manipulations
    var userAccount = require('../api/dao/userAccount');
    app.post('/modifierInfosCompte', isLoggedIn, userAccount.update);
    app.get('/allAccounts', isLoggedInAdmin, userAccount.all);
    app.post('/deleteAccounts', isLoggedInAdmin, userAccount.supprimer);
    app.post('/modifierPassword', isLoggedIn, userAccount.modifierPassword);
    app.post('/checkPassword', isLoggedIn, userAccount.checkPassword);
    app.post('/restorePassword', userAccount.restorePassword); //not loged
    app.post('/saveNewPassword', userAccount.saveNewPassword); //not loged
    app.post('/createAccount', userAccount.create);
    app.post('/checkPasswordToken', userAccount.checkPasswordToken);
    app.post('/findAdmin', userAccount.findAdmin);
    app.post('/findUserById', userAccount.findUserById);
    app.post('/findUserByEmail', userAccount.findUserByEmail);

    var sysParamDAO = require('../api/dao/sysParamDAO');

    app.post('/createVersion', isLoggedInAdmin, sysParamDAO.create);
    app.post('/updateVersion', isLoggedInAdmin, sysParamDAO.update);
    app.post('/allVersion', isLoggedIn, sysParamDAO.all);
    app.post('/findTagByIdVersion', sysParamDAO.findTagById);

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

    app.get('/logout', isLoggedIn, function(req, res) {
        User.findOne({
            'local.token': req.user.local.token
        }, function(err, user) {
            if (err !== null || !user) {
                res.send(200);
            } else {
                user.local.token = '';
                user.local.tokenTime = '';
                user.save(function(err) {
                    if (err) {
                        var item = {
                            message: 'il ya un probleme dans la sauvgarde '
                        };
                        helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
                        res.send(401, item);
                    } else {
                        helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
                        req.user = user;
                        res.send(200);
                    }
                });

            }
        });
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