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


module.exports = function (app , passport) {

    // Routes for tag manipulating
    var tags = require('../api/dao/tag');
    app.route('/addTag').post(tags.create);
    app.route('/readTags').get(tags.all);
    app.route('/updateTag').post( tags.update);
    app.route('/deleteTag').post( tags.remove);
    app.route('/getTagById').post( tags.findTagById);

    //test for manipulating image
    var images = require('../api/services/images');
    app.route('/fileupload').post( images.uploadFiles);
    app.route('/sendPdf').post( images.sendPdf);
    app.route('/sendPdfHTTPS').post( images.sendPdfHTTPS);
    app.route('/htmlPage').post( images.htmlPage);
    app.route('/epubUpload').post( images.epubUpload);
    app.route('/externalEpub').post( images.externalEpub);
    app.route('/generateSign').post( images.generateSign);

    app.route('/file/download').get(images.downloadFIle);
    app.route('/one-drive/download-link').post( images.getOneDriveDownloadLink);

    //test for manipulating emailSend
    var helpers = require('../api/helpers/helpers');
    app.route('/sendMail').post( helpers.sendMail);
    app.route('/sendEmail').post( helpers.sendEmail);

    //route for profile manipulations
    var profils = require('../api/dao/profils');

    app.route('/profiles').get(profils.getProfiles);
    app.route('/profile/:profileId').get(profils.getProfile);
    app.route('/profile').post( profils.createProfile);
    app.route('/profile').put(profils.updateProfile);
    app.route('/profile/:profileId').delete(profils.deleteProfile);

    app.route('/auth/dropbox').get(passport.authenticate('dropbox-oauth2'));

    app.route('/auth/dropbox/callback').get(passport.authenticate('dropbox-oauth2', {
        failureRedirect: '/'
    }), function (req, res) {
        req.session.user = req.user;
        res.redirect('/#/ma-sauvegarde.html?auth=true');
    });

    app.route('/auth/google-drive').get(passport.authenticate('google-drive'));
    app.route('/auth/google-drive/callback').get(passport.authenticate('google-drive', {
        failureRedirect: '/'
    }), function (req, res) {
        req.session.user = req.user;
        res.redirect('/#/ma-sauvegarde.html?auth=true');
    });

    app.route('/auth/one-drive').get(passport.authenticate('microsoft'));
    app.route('/auth/one-drive/callback').get(passport.authenticate('microsoft', {
        failureRedirect: '/'
    }), function (req, res) {
        req.session.user = req.user;
        res.redirect('/#/ma-sauvegarde.html?auth=true');
    });

    app.route('/auth/token').get(function (req, res) {

        if (req.session.user) {
            res.send(req.session.user);
        } else {
            res.send();
        }
    });

    app.route('/user/isAdmin').post( function (req, res) {

        var email = req.body.email;
        var provider = req.body.provider;

        if (email && provider) {

            res.send({
                isAdmin: helpers.isAdmin(email, provider)
            });

        } else {
            res.sendStatus(400);
        }

    });


};