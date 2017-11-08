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
var config = require('../../env/config.json');
var helpers = require('../api/helpers/helpers.js');

module.exports = function (app, passport) {

    // Routes for tag manipulating
    var tags = require('../api/dao/tag');
    app.post('/addTag', tags.create);
    app.get('/readTags', tags.all);
    app.post('/updateTag', tags.update);
    app.post('/deleteTag', tags.remove);
    app.post('/getTagById', tags.findTagById);

    //test for manipulating image
    var images = require('../api/services/images');
    app.post('/fileupload', images.uploadFiles);
    app.post('/sendPdf', images.sendPdf);
    app.post('/sendPdfHTTPS', images.sendPdfHTTPS);
    app.post('/htmlPage', images.htmlPage);
    app.post('/epubUpload', images.epubUpload);
    app.post('/externalEpub', images.externalEpub);
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

    app.get('/auth/dropbox', passport.authenticate('dropbox-oauth2'));

    app.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', {
        failureRedirect: '/'
    }), function (req, res) {
        req.session.user = req.user;
        res.redirect('/#/ma-sauvegarde.html?auth=true');
    });

    app.get('/auth/google-drive', passport.authenticate('google-drive'));
    app.get('/auth/google-drive/callback', passport.authenticate('google-drive', {
        failureRedirect: '/'
    }), function (req, res) {
        req.session.user = req.user;
        res.redirect('/#/ma-sauvegarde.html?auth=true');
    });

    app.get('/auth/one-drive', passport.authenticate('onedrive'));
    app.get('/auth/one-drive/callback', passport.authenticate('onedrive', {
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
                isAdmin: helpers.isAdmin(email, provider)
            });

        } else {
            res.send(400);
        }

    });


};