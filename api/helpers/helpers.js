/* File: helpers.js
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

var config = require('../../../env/config.json');


var nodemailer = require('nodemailer');
var https = require('https');
var fs = require('fs');
var path = require('path');

/**
 * Get SMTP host options
 * @returns {{host: string, port: integer}}
 */
function getSmtpOptions() {

    // setting smtp config
    var smtpConfig = {
        host: config.EMAIL_HOST, // hostname
        port: config.EMAIL_PORT // port for secure SMTP,
    };

    if (config.EMAIL_HOST_UID && config.EMAIL_HOST_UID !== '') {
        smtpConfig.auth = {
            user: config.EMAIL_HOST_UID,
            pass: config.EMAIL_HOST_PWD
        };
    }

    return smtpConfig;
}

/**
 * Logging method
 * the message contents : the user Id, Username, firstname of the user,service
 * and parameter
 */
exports.journalisation = function (status, user, message, param) {
    var statusMessage = '';
    switch (status) {
        case 0:
            statusMessage = 'BEGIN';
            break;
        case 1:
            statusMessage = 'END';
            break;
        case -1:
            statusMessage = 'END:ERROR';
            break;
        default:
            statusMessage = 'END:ERROR';
    }
    var msg = '[' + statusMessage + ']';
    if (user && user !== '' && user._id && user.local.nom && user.local.prenom) {
        msg = msg + ' UtilisateurId : [' + user._id + '] ' + ' Utilisateur Nom : [' + user.local.nom + '] ' + ' Utilisateur Prenom : [' + user.local.prenom + '] ';
    } else {
        msg = msg + ' UtilisateurId : ' + 'GUEST';
    }

    msg = msg + ' | service :[' + message + '] | parametre :[' + param + ']';
    console.log(msg);

};

exports.sendMail = function (req, res) {
    var sentMailInfos = req.body;
    var mailOptions = {};
    // create reusable transport method (opens pool of SMTP connections)

    var smtpTransport = nodemailer.createTransport('SMTP', getSmtpOptions());
    // setup e-mail data with unicode symbols

    if (sentMailInfos.doc && sentMailInfos.doc.indexOf('idProfil') !== -1) {
        mailOptions = {
            from: config.EMAIL_FROM,
            to: sentMailInfos.to,
            subject: sentMailInfos.fullName + ' vient de partager avec vous un profil sur l\'application Accessidys. ',
            text: sentMailInfos.prenom + ' ' + sentMailInfos.content,
            html: sentMailInfos.prenom + ' ' + sentMailInfos.encoded
        };
    } else {
        mailOptions = {
            from: config.EMAIL_FROM,
            to: sentMailInfos.to,
            subject: sentMailInfos.fullName + ' a partagé ' + sentMailInfos.doc + ' avec vous',
            text: sentMailInfos.prenom + ' ' + sentMailInfos.content,
            html: sentMailInfos.prenom + ' ' + sentMailInfos.encoded
        };
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            res.send(error);
        } else {
            res.send(response);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
};
exports.passwordRestoreEmail = function (emailTo, subject, content) {

    //configuration of email
    var smtpTransport = nodemailer.createTransport('SMTP', getSmtpOptions());

    var mailOptions = {
        from: config.EMAIL_FROM,
        to: emailTo,
        subject: subject,
        text: '',
        html: content
    };
    smtpTransport.sendMail(mailOptions, function (error) {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
};

exports.sendEmail = function (req, res) {

    var smtpTransport = nodemailer.createTransport('SMTP', getSmtpOptions());

    var emailTo = req.body.emailTo;
    var subject = req.body.subject;
    var content = req.body.content;


    var mailOptions = {
        from: config.EMAIL_FROM,
        to: emailTo,
        subject: subject,
        text: '',
        html: content
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            throw error;
        } else {
            res.send(response);
        }
    });
};

exports.clone = function (a) {
    return JSON.parse(JSON.stringify(a));
};

exports.getVersion = function (str) {
    if (str.indexOf('Appversion=') > -1) {
        var theStart = str.indexOf('Appversion=');
        var theEnd = str.indexOf("';", theStart) + 1; // jshint ignore:line
        var extracted = str.substring(theStart, theEnd);


        if (extracted.match(/\d+/)) {
            return {
                versionExist: true,
                version: parseInt(extracted.match(/\d+/)[0]),
                upgradeType: 1
            };
        } else {
            return {
                versionExist: false
            };
        }
    } else {
        return {
            versionExist: false
        };
    }
};


