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

// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// dropBox
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;

var config = require('./../../env/config.json');
var URL_REQUEST = process.env.URL_REQUEST || config.URL_REQUEST;

var dropbox_type = process.env.DROPBOX_TYPE || config.DROPBOX_TYPE;
var listDocPath = process.env.CATALOGUE_NAME || config.CATALOGUE_NAME;

var DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID || config.DROPBOX_CLIENT_ID; // 'ko5rdy0yozdjizw';
var DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET || config.DROPBOX_CLIENT_SECRET; //'iqct32159hizifd';

// load up the user model
var User = require('../../models/User');

//token generator and secret grainSalt
var jwt = require('jwt-simple');
var secret = 'nownownow';
var md5 = require('MD5');
var helpers = require('../helpers/helpers');
var https = require('https');
var http = require('http');
var rest = require('restler');
var fs = require('fs');
var path = require('path');

var events = require('events');

// expose this function to our app using module.exports

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new DropboxOAuth2Strategy({
      clientID: DROPBOX_CLIENT_ID,
      clientSecret: DROPBOX_CLIENT_SECRET,
      callbackURL: URL_REQUEST + '/auth/dropbox/callback',
      passReqToCallback: true
    },

    function(req, accessToken, refreshToken, profile, done) {
      if (req) {
        helpers.journalisation(0, req.user, req._parsedUrl.pathname, '[]');
        var tmp = req.user;
        tmp.dropbox.uid = profile._json.uid;
        tmp.dropbox.display_name = profile._json.display_name;
        tmp.dropbox.emails = profile._json.email;
        tmp.dropbox.country = profile._json.country;
        tmp.dropbox.referral_link = profile._json.referral_link;
        tmp.dropbox.accessToken = accessToken;
        tmp.save(function(err) {
          if (err) throw err;
          helpers.journalisation(1, tmp, req._parsedUrl.pathname, 'ID : [' + tmp._id + '] ' + ' Email : [' + tmp.local.email + ']' + ' dropbox-Email : [' + profile._json.email + '] ');
          return done(null, tmp);
        });
      }
    }));


  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      nomField: 'nom',
      prenomField: 'prenom',

      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, nom, prenom, done) {

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        helpers.journalisation(0, null, req._parsedUrl.pathname, 'Email : [' + email + '] ');
        User.findOne({
          'local.email': email
        }, function(err, user) {
          // if there are any errors, return the error
          if (err) return done(err);

          // check to see if theres already a user with that email
          if (user) {
            // console.log('That email is already taken');
            //var newUser = new User();
            var erreur = {
              message: 'email deja pris',
              email: true
            };
            return done(404, erreur);
            // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {

            // if there is no user with that email
            // create the user
            // console.log('creation new user');
            var newUser = new User();
            // set the user's local credentials
            newUser.local.email = email;
            newUser.local.password = md5(password);
            newUser.local.nom = nom;
            newUser.local.prenom = prenom;
            newUser.local.role = 'user';
            var mydate = new Date();

            newUser.local.tokenTime = mydate.getTime() + 4329000;
            var randomString = {
              chaine: Math.random().toString(36).slice(-8)
            };
            newUser.local.token = jwt.encode(randomString, secret);
            // console.log(newUser.local);
            // save the user
            // console.log('going to save in bdd');
            
            if(!newUser.local.authorisations){
            	newUser.local.authorisations = {
            	          ocr: false,
            	          audio: false
            	        };
            }
            newUser.save(function(err) {
              if (err) {
                throw err;
              } else {
                helpers.journalisation(1, newUser, req._parsedUrl.pathname, 'ID : [' + newUser._id + '] ' + ' Email : [' + newUser.local.email + ']');
                return done(null, newUser);
              }
            });
          }

        });

      });

    }));

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      nomField: 'nom',
      prenomField: 'prenom',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, nom, prenom, done) { // callback with email and password from our form

      helpers.journalisation(0, null, req._parsedUrl.pathname, 'email :[' + email + ']' + ' password:[' + password + ']');

      User.findOne({
        'local.email': email
      }, function(err, user) {
        if (!user) {
          return done(404, null);
        }
        if (user.local.password !== password) {
          return done(404, null);
        }

        var mydate = new Date();
        var nowTime = mydate.getTime();
        var generateNewToken = true;
        if (user.local.token && user.local.token !== '') {
          if (parseInt(nowTime) < parseInt(user.local.tokenTime)) {
            generateNewToken = false;
          }
        }
        if (generateNewToken) {
          var randomString = {
            chaine: Math.random().toString(36).slice(-8)
          };
          user.local.token = jwt.encode(randomString, secret);
        }

        user.local.tokenTime = mydate.getTime() + 4329000;

        user.save(function(err) {
          if (err) {
            var item = {
              message: 'il ya un probleme dans la sauvgarde '
            };
            helpers.journalisation(-1, user, req._parsedUrl.pathname, err);
            req.session.loged = true;
            return done(401);
          } else {
            helpers.journalisation(1, user, req._parsedUrl.pathname, 'ID : [' + user._id + '] ' + ' Email : [' + user.local.email + ']');
            req.session.loged = true;
            return done(null, user);
          }
        });
      });
    }
  ));
};
