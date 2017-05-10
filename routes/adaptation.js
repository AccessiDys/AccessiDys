/* File: adaptation.js
 *
 * Copyright (c) 2013-2016
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

var socket = require('./socket.js');
var config = require('../../env/config.json');

var helpers = require('../api/helpers/helpers.js');

module.exports = function (app, passport) {




    function isLoggedIn(req, res, next) {

        console.log('------------ isLoggedIn => ' + req._parsedUrl.pathname);

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
            }, function (err, user) {
                if (err || !user) {
                    errMessage = {
                        message: 'le token est introuveble',
                        code: 1
                    };
                    res.send(404, errMessage);
                } else {
                    var nowTime = mydate.getTime();
                    if (user && parseInt(nowTime) < parseInt(user.local.tokenTime)) {
                        helpers.journalisation(0, user, message, param);
                        user.local.tokenTime = mydate.getTime() + 43200000;
                        user.save(function (err) {
                            if (err) {
                                var item = {
                                    message: 'il ya un probleme dans la sauvgarde '
                                };
                                res.send(404, item);
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

        console.log('------------ checkIsLoged => ' + req._parsedUrl.pathname);

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
            }, function (err, user) {
                if (err !== null || !user) {
                    helpers.journalisation(0, 'GUEST', message, param);
                    return next();
                } else {
                    var nowTime = mydate.getTime();
                    if (user && parseInt(nowTime) < parseInt(user.local.tokenTime)) {
                        helpers.journalisation(0, user, message, param);
                        user.local.tokenTime = mydate.getTime() + 43200000;
                        user.save(function (err) {
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

        console.log('------------ isLoggedInAdmin => ' + req._parsedUrl.pathname);

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
            }, function (err, user) {
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
                            user.local.tokenTime = mydate.getTime() + 43200000;
                            user.save(function (err) {
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


    // Routes for tag manipulating
    var tags = require('../api/dao/tag');
    app.post('/addTag', isLoggedInAdmin, tags.create);
    app.get('/readTags', tags.all);
    app.post('/updateTag', isLoggedInAdmin, tags.update);
    app.post('/deleteTag', isLoggedInAdmin, tags.remove);
    app.post('/getTagById', tags.findTagById);

    //test for manipulating image
    var images = require('../api/services/images');
    app.post('/fileupload', isLoggedIn, images.uploadFiles);
    app.post('/sendPdf', images.sendPdf);
    app.post('/sendPdfHTTPS', images.sendPdfHTTPS);
    app.post('/previewPdf', isLoggedIn, images.previewPdf);
    app.post('/previewPdfHTTPS', isLoggedIn, images.previewPdfHTTPS);
    app.post('/htmlImage', images.htmlImage);
    app.post('/htmlPage', images.htmlPage);
    app.post('/epubUpload', images.epubUpload);
    app.post('/externalEpub', images.externalEpub);
    app.post('/externalEpubPreview', images.externalEpubPreview);
    app.post('/htmlPagePreview', images.htmlPagePreview);
    app.post('/generateSign', images.generateSign);

    //test for manipulating emailSend
    var helpers = require('../api/helpers/helpers');
    app.post('/sendMail', helpers.sendMail);
    app.post('/sendEmail', helpers.sendEmail);

    //route for profile manipulations
    var profils = require('../api/dao/profils');

    app.get('/profiles', profils.getProfiles);
    app.get('/profile/:profileId', profils.getProfile);
    app.post('/profile', profils.createProfile);
    app.put('/profile', profils.updateProfile);
    app.delete('/profile/:profileId', profils.deleteProfile);


    //route for ProfileTag manipulations
    var profilsTags = require('../api/dao/profilTag');
    app.post('/ajouterProfilTag', isLoggedIn, profilsTags.createProfilTag);
    app.post('/chercherTagsParProfil', profilsTags.findTagsByProfil); //free
    app.post('/supprimerProfilTag', isLoggedIn, profilsTags.supprimer);
    app.post('/modifierProfilTag', isLoggedIn, profilsTags.update);
    app.post('/chercherProfilsTagParProfil', isLoggedIn, profilsTags.chercherProfilsTagParProfil);
    app.post('/saveProfilTag', isLoggedIn, profilsTags.saveProfilTag); //terre
    app.post('/deleteByProfilID', isLoggedIn, profilsTags.deleteByProfilID);
    app.post('/setProfilTags', isLoggedIn, profilsTags.setProfilTags);


    app.get('/auth/dropbox', passport.authenticate('dropbox-oauth2'));

    app.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', {
        failureRedirect: '/'
    }), function (req, res) {
        req.session.user = req.user;
        res.redirect('/#/ma-sauvegarde.html?auth=true');
    });

    app.get('/auth/token', function (req, res) {

        if (req.session.user) {
            res.send(req.session.user);
        } else {
            res.send();
        }
    });

    app.post('/user/isAdmin', function (req, res) {

        var email = req.body.email;
        var provider = req.body.provider;

        if (email && provider) {

            res.send({
                isAdmin: helpers.isAdmin(email , provider)
            });

        } else {
            res.send(400);
        }

    });


};