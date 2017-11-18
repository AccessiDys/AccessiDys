/* File: passport.js
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
/*jshint unused: false, undef:false */

var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;
var GoogleDriveStrategy = require('passport-google-drive').Strategy;
var OneDriveStrategy = require('passport-microsoft').Strategy;

var config = require('../../../env/config.json');
var URL_REQUEST = process.env.URL_REQUEST || config.URL_REQUEST;

var DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID || config.DROPBOX_CLIENT_ID;
var DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET || config.DROPBOX_CLIENT_SECRET;

var GOOGLE_DRIVE_CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID || config.GOOGLE_DRIVE_CLIENT_ID;
var GOOGLE_DRIVE_CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET || config.GOOGLE_DRIVE_CLIENT_SECRET;

var ONE_DRIVE_CLIENT_ID = process.env.ONE_DRIVE_CLIENT_ID || config.ONE_DRIVE_CLIENT_ID;
var ONE_DRIVE_CLIENT_SECRET = process.env.ONE_DRIVE_CLIENT_SECRET || config.ONE_DRIVE_CLIENT_SECRET;

var helpers = require('../helpers/helpers');

// expose this function to our app using module.exports

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        done(null, null);
    });

    passport.use(new DropboxOAuth2Strategy({
            apiVersion: '2',
            clientID: DROPBOX_CLIENT_ID,
            clientSecret: DROPBOX_CLIENT_SECRET,
            callbackURL: URL_REQUEST + '/auth/dropbox/callback',
            passReqToCallback: true,
            authorizationURL: 'https://www.dropbox.com/oauth2/authorize?force_reauthentication=true'
        },

        function (req, accessToken, refreshToken, profile, done) {
            if (req) {
                console.log(profile._json);

                return done(null, {
                    email: profile._json.email,
                    firstName: profile._json.name.given_name,
                    lastName: profile._json.name.surname,
                    token: accessToken,
                    provider: 'dropbox'
                });
            }
        }));

    passport.use(new GoogleDriveStrategy({
        clientID: GOOGLE_DRIVE_CLIENT_ID,
        clientSecret: GOOGLE_DRIVE_CLIENT_SECRET,
        callbackURL: URL_REQUEST + '/auth/google-drive/callback',
        scope: 'https://www.googleapis.com/auth/drive.file'
    }, function (accessToken, refreshToken, profile, done) {

        return done(null, {
            email: profile._json.user.emailAddress,
            firstName: profile._json.user.displayName,
            lastName: '',
            token: accessToken,
            provider: 'google-drive'
        });
    }));

    passport.use(new OneDriveStrategy({
            clientID: ONE_DRIVE_CLIENT_ID,
            clientSecret: ONE_DRIVE_CLIENT_SECRET,
            callbackURL: URL_REQUEST + '/auth/one-drive/callback',
            scope: 'user.read files.readwrite offline_access'
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, {
                email: profile._json.userPrincipalName,
                firstName: '',
                lastName: profile.displayName,
                token: accessToken,
                provider: 'one-drive'
            });
        }
    ));
};

