/* File: profils.js
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
/*jshint unused: false, undef:false */

var tagDAO = require('../dao/tag');
var profilTagDAO = require('../dao/profilTag');

var resetCSS = '/* ----- Reset All Style ----- */ \n' +
    'div.resetAll > html, div.resetAll > body, div.resetAll > div, div.resetAll > span, div.resetAll > applet, div.resetAll > object, div.resetAll > iframe, div.resetAll > '+
    'h1, div.resetAll > h2, div.resetAll > h3, div.resetAll > h4, div.resetAll > h5, div.resetAll > h6, div.resetAll > p, div.resetAll > blockquote, div.resetAll > pre, div.resetAll > '+
    'a, div.resetAll > abbr, div.resetAll > acronym, div.resetAll > address, div.resetAll > big, div.resetAll > cite, div.resetAll > code, div.resetAll > '+
    'del, div.resetAll > dfn, div.resetAll > em, div.resetAll > img, div.resetAll > ins, div.resetAll > kbd, div.resetAll > q, div.resetAll > s, div.resetAll > samp, div.resetAll > '+
    'small, div.resetAll > strike, div.resetAll > strong, div.resetAll > sub, div.resetAll > sup, div.resetAll > tt, div.resetAll > var, div.resetAll > '+
    'b, div.resetAll > u, div.resetAll > i, div.resetAll > center, div.resetAll > '+
    'dl, div.resetAll > dt, div.resetAll > dd, div.resetAll > '+
    'fieldset, div.resetAll > form, div.resetAll > label, div.resetAll > legend, div.resetAll > '+
    'table, div.resetAll > caption, div.resetAll > tbody, div.resetAll > tfoot, div.resetAll > thead, div.resetAll > tr, div.resetAll > th, div.resetAll > td, div.resetAll > '+
    'article, div.resetAll > aside, div.resetAll > canvas, div.resetAll > details, div.resetAll > embed, div.resetAll > '+
    'figure, div.resetAll > figcaption, div.resetAll > footer, div.resetAll > header, div.resetAll > hgroup, div.resetAll > '+
    'menu, div.resetAll > nav, div.resetAll > output, div.resetAll > ruby, div.resetAll > section, div.resetAll > summary, div.resetAll > '+
    'time, div.resetAll > mark, div.resetAll > audio, div.resetAll > video { \n'+
    'margin: 0; \n'+
    'padding: 0; \n'+
    'border: 0; \n'+
    'font-size: 100%; \n'+
    'font: inherit; \n'+
    'color: black; \n'+
    'vertical-align: baseline; \n'+
    'text-transform: none; \n'+
    '} \n'+
    '/* HTML5 display-role reset for older browsers */ \n'+
    'div.resetAll >  article, div.resetAll > aside, div.resetAll > details, div.resetAll > figcaption, div.resetAll > figure, div.resetAll > '+
    'footer, div.resetAll > header, div.resetAll > hgroup, div.resetAll > menu, div.resetAll > nav, div.resetAll > section { \n'+
    'display: block; \n'+
    'color: black; \n'+
    '} \n'+
    'div.resetAll > body { \n'+
    'line-height: 1; \n'+
    'color: black; \n'+
    '} \n'+
    'div.resetAll > ul > li { \n'+
    'list-style: disc; \n'+
    'color: black; \n'+
    '} \n'+
    'div.resetAll > ol, div.resetAll > ul { \n'+
    'margin: 1em, 0;'+
    'padding: 0 0 0 40px; \n'+
    '} \n'+
    'div.resetAll > blockquote, q { \n'+
    'quotes: none; \n'+
    'color: black; \n'+
    '} \n'+
    'div.resetAll > blockquote:before, div.resetAll > blockquote:after, '+
    'q:before, q:after { \n'+
    'content: \'\'; \n'+
    'content: none; \n'+
    'color: black; \n'+
    '} \n'+
    'div.resetAll > table { \n'+
    'border-collapse: collapse; \n'+
    'background-color: transparent;'+
    'border-spacing: 0; \n'+
    'color: black; \n'+
    '} \n \n'+
    '/* ----- Adapt Content Style ----- */ \n';


/**
  * Supprime les accents, mets en minuscule et supprime les espaces
  * @param string
  * @method  cleanString
  */
var cleanString = function (string) {
    // apply toLowerCase() function
    string = string.toLowerCase();
    // specified letters for replace
    var from = 'àáäâèéëêěìíïîòóöôùúüûñçčřšýžďť';
    var to = 'aaaaeeeeeiiiioooouuuunccrsyzdt';
    // replace each special letter
    for (var i = 0; i < from.length; i++)
        string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        string = string.replace(/ /g, '');
    // return clean string
    return string;
};

/**
  * Génère le fichier CSS à partir de laiste des tags
  * du profil et liste complète des tags
  * @param tags
  * @param profilTags
  * @method  generateCSS
  */
var generateCSS = function(tags, profilTags){
    var css = resetCSS;
    tags.forEach(function (tag) {
        var found = false;
        var cssTag = '';
        var cssTitle = 'div.adaptContent > ';
        profilTags.forEach(function (profilTag) {
            //Si le tag est défini dans le profil
            if (tag._id.toString() === profilTag.tag) {
                found = true;
                //Si c'est un balise on mets le libelle comme classe
                if (tag.balise === 'div') {
                    cssTitle += 'div.' + cleanString(tag.libelle);
                }
                else {
                    cssTitle += tag.balise;
                }
                var fontstyle = 'Normal';
                if (profilTag.styleValue === 'Gras') {
                    fontstyle = 'Bold';
                }
                //Transformation propre à l'application
                cssTag = cssTitle +
                ' { \nfont-family: ' + profilTag.police + ';  \n' +
                'font-size: ' + (1 + (profilTag.taille - 1) * 0.18) + 'em;  \n' +
                'line-height: ' + (1.286 + (profilTag.interligne - 1) * 0.18) + 'em;  \n' +
                'font-weight: ' + fontstyle + ';  \n' +
                'word-spacing: ' + (0 + (profilTag.spaceSelected - 1) * 0.18) + 'em;  \n' +
                'letter-spacing: ' + (0 + (profilTag.spaceCharSelected - 1) * 0.12) + 'em;  \n' +
                '}  \n';
            }
        });
        css += cssTag;
    });
    return css;
};

/**
  * Envoie le fichier CSS correspondant à l'id du profil
  * Id contenu dans req.params.id
  * @param req
  * @param res
  * @method  getCSSProfil
  */
exports.getCSSProfil = function (req, res) {
    var profilId = req.params.id;
    //Récupère les tags du profil
    profilTagDAO.findProfilTagByProfil(profilId, function (err, profilTags) {
        if (!err) {

            //Récupère tous les tags
            tagDAO.findAllTags(function (err, tags) {
                if (!err) {
                    var css = generateCSS(tags, profilTags);
                    res.writeHead(200, {'Content-Type': 'text/css'});
                    res.write(css);
                    res.end();
                } else {
                    res.jsonp(500);
                }
            });
        } else {
            res.jsonp(500);
        }
    });
};
