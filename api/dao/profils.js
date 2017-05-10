/* File: profils.js
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
/* jshint unused: false, undef:false */


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Profil = mongoose.model('Profil'),
    UserProfil = mongoose.model('UserProfil'),
    ProfilTag = mongoose.model('ProfilTag');

var fs = require('fs');
var helpers = require('../helpers/helpers.js');
var async = require('async');


/**
 * Search a profile and the user associated with this profile
 */
exports.getProfiles = function (req, res) {

    var userData = {
        email: req.get('AccessiDys-user')
    };


    async.waterfall([

            function (callback) {

                // Default profiles
                Profil.find({
                    $or: [
                        {
                            owner: 'scripted'
                        },
                        {
                            owner: 'admin'
                        }]
                })
                    .populate('profileTags')
                    .exec(function (err, profiles) {
                        callback(err, profiles);

                    });

            },

            function (defaultProfiles, callback) {


                console.log('get user email', userData.email);

                if (userData.email) {
                    // Default profiles
                    Profil.find({
                        $or: [
                            {
                                owner: userData.email
                            },
                            {
                                preDelegated: userData.email
                            }]
                    })
                        .populate('profileTags')
                        .exec(function (err, profiles) {
                            callback(err, defaultProfiles, profiles);

                        });
                } else {
                    callback(null, defaultProfiles, []);
                }


            }
        ],
        function (err, defaultProfiles, delegatedProfiles) {

            var profiles = defaultProfiles.concat(delegatedProfiles);

            if (!err) {

                var result = [];

                for (var i = 0; i < profiles.length; i++) {
                    result.push({
                        filename: profiles[i].nom,
                        data: profiles[i],
                        provider: 'accessidys'
                    });
                }

                res.send(result);
            } else {
                res.send();
            }


        });
};

/**
 * Search a profile by id
 */
exports.getProfile = function (req, res) {

    var profileId = req.params.profileId;

    if (profileId) {
        Profil.findOne({
            _id: profileId
        })
            .populate('profileTags')
            .exec(function (err, profile) {

                if (profile) {
                    res.send({
                        filename: profile.nom,
                        data: profile,
                        provider: 'accessidys'
                    });
                } else {
                    res.send();
                }

            });
    } else {
        res.send(400);
    }
};

/**
 * Create a profile
 */
exports.createProfile = function (req, res) {

    var profile = req.body.profile;
    var userData = {
        email: req.get('AccessiDys-user'),
        provider: req.get('AccessiDys-provider')
    };

    console.log('Create profile', userData);

    if (profile && profile.data) {

        var newProfile = new Profil({
            nom: profile.data.nom,
            descriptif: profile.data.descriptif,
            owner: helpers.isAdmin(userData.email, userData.provider) ? 'admin' : userData.email,
            isFavourite: profile.data.isFavourite,
            delegated: profile.data.delegated,
            preDelegated: profile.data.preDelegated
        });

        newProfile.save(function (err) {
            if (!err) {

                var profileTags = [];

                for (var i = 0; i < profile.data.profileTags.length; i++) {

                    var newProfileTag = new ProfilTag(profile.data.profileTags[i]);
                    newProfileTag.save();
                    profileTags.push(newProfileTag);

                    newProfile.profileTags.push(newProfileTag._id);
                    newProfile.save();
                }

                profile.data = newProfile;
                profile.data.profileTags = profileTags;

                res.send(200, profile);

            } else {
                console.log('err', err);
                res.send({
                    'result': 'error'
                });
            }
        });
    } else {
        res.send(400);
    }
};

/**
 * Update a profile
 */
exports.updateProfile = function (req, res) {

    var profile = req.body.profile;
    var userData = {
        email: req.get('AccessiDys-user'),
        provider: req.get('AccessiDys-provider')
    };

    console.log('Update profile ', userData);

    if (profile && profile.data) {

        Profil.findOne({
            _id: profile.data._id
        })
            .exec(function (err, _profile) {

                if (_profile && ((helpers.isAdmin(userData.email, userData.provider) && (_profile.owner === 'admin' || 'scripted')) || _profile.owner === userData.email)) {

                    _profile.nom = profile.data.nom;
                    _profile.descriptif = profile.data.descriptif;
                    _profile.owner = profile.data.owner;
                    _profile.isFavourite = profile.data.isFavourite;
                    _profile.delegated = profile.data.delegated;
                    _profile.preDelegated = profile.data.preDelegated;

                    _profile.save();

                    for (var i = 0; i < profile.data.profileTags.length; i++) {

                        console.log('before save', profile.data.profileTags[i]);

                        ProfilTag.findByIdAndUpdate(profile.data.profileTags[i]._id, {
                            'police': profile.data.profileTags[i].police,
                            'taille': profile.data.profileTags[i].taille,
                            'interligne': profile.data.profileTags[i].interligne,
                            'styleValue': profile.data.profileTags[i].styleValue,
                            'coloration': profile.data.profileTags[i].coloration,
                            'spaceSelected': profile.data.profileTags[i].spaceSelected,
                            'spaceCharSelected': profile.data.profileTags[i].spaceCharSelected
                        }, function (err) {

                        });
                    }

                    res.send(profile);

                } else {
                    res.send(400);
                }

            });
    } else {
        res.send(400);
    }
};

/**
 * Delete a profile
 */
exports.deleteProfile = function (req, res) {

    var profileId = req.params.profileId;
    var userData = {
        email: req.get('AccessiDys-user'),
        provider: req.get('AccessiDys-provider')
    };

    if (profileId) {

        Profil.findOne({
            _id: profileId
        })
            .exec(function (err, _profile) {

                if (_profile && ((helpers.isAdmin(userData.email, userData.provider) && (_profile.owner === 'admin' || 'scripted')) || _profile.owner === userData.email)) {

                    for (var i = 0; i < _profile.profileTags.length; i++) {
                        ProfilTag.remove({
                            _id: _profile.profileTags[i]._id
                        }, function () {
                        });
                    }

                    _profile.remove();
                    res.send(200);

                } else {
                    res.send(400);
                }

            });
    } else {
        res.send(400);
    }
};