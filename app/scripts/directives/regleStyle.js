/* File: regleStyle.js
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

/*global cnedApp,Hyphenator, $:false */
'use strict';

/*
 * Directive to apply a rule of style to a paragraph.
 */
cnedApp.directive('regleStyle', ['$rootScope', '$timeout', 'removeHtmlTags', 'removeStringsUppercaseSpaces', '$compile', '$window',

function ($rootScope, $timeout, removeHtmlTags, removeStringsUppercaseSpaces, $compile) {
        return {
            restrict: 'EA',
            scope: {
                showLoader: '&?showLoader',
                hideLoader: '&?hideLoader',
                editorContent: '@?editorContent',
                tags: '=tags',
                regleStyle: '=regleStyle',
                applyRules: '=applyRules',
                setActive: '=?setActive',
                preview: '&?preview'
            },
            link: function (scope, element) {
                var watchApplyRulesInProgress = false;
                var watchContentInProgress = false;
                var watchTagsInProgress = false;
                $rootScope.lineWord = 0;
                $rootScope.tmpLine; // jshint ignore:line

                if ($rootScope.tmpLine !== 0) {
                    $rootScope.tmpLine = 0;
                }

                var removeAllSpan = function (element) {
                    var spans = element.find('span');
                    angular.forEach(spans, function (span) {
                        angular.element(span).contents().unwrap(); // replace all
                        // span with
                        // just content
                    });
                    element[0].normalize();
                };

                var adapt = function (newHTML) {

                    $(element).html(newHTML);

                    //console.log('Execute adaptation');

                    if (scope.showLoader !== undefined) {
                        //console.log('loader');
                        scope.showLoader();
                    }

                    // first apply css styles
                    $timeout(function () {
                        applyStyles();
                        //console.log('style done');
                        // then apply adaptation with coloration
                        $timeout(function () {
                            applyAdaptation();

                            if (scope.hideLoader !== undefined) {
                                //console.log('hideLoader');
                                scope.hideLoader();
                            }

                            watchApplyRulesInProgress = false;
                            watchContentInProgress = false;
                            watchTagsInProgress = false;

                        }, 1000);
                    });


                    // cleans white spaces at the end of empty lines so that rangy
                    // can find is way
                    angular.element('#editorAdd').find('p').each(function (idx, el) {
                        if ($(el).text() === '\xa0 ' || $(el).text() === '\xa0') {
                            if (!scope.editorContent)
                                $(el).html('<br/>');
                        }
                    });


                };

                var getTagsById = function (listTags, id) {
                    for (var i = 0; i < listTags.length; i++) {

                        //console.log('listtags i=' + listTags[i]._id + ' / id=' + id);

                        if (listTags[i]._id === id) {
                            return listTags[i];
                        }
                    }
                    return {};
                };

                scope.$watch('applyRules', function (value) {

                    //console.log('observe applyrules : ' + value + ' / ' + scope.applyRules);


                    //console.log(shallApplyStyleRules);
                    //console.log(value);

                    watchApplyRulesInProgress = (value === true);
                    //check if any other watch is in progress
                    if (watchApplyRulesInProgress && !watchContentInProgress && !watchTagsInProgress) {

                        //console.log('observe applyrules execution');


                        $rootScope.lineWord = 0;
                        $rootScope.tmpLine; // jshint ignore:line

                        if ($rootScope.tmpLine !== 0) {
                            $rootScope.tmpLine = 0;
                        }
                        adapt(scope.regleStyle, scope.tags); // Compile

                    }
                });


                scope.$watch('tags', function () {

                    //console.log('observe tags : applyRules=' + scope.applyRules);

                    //if no ask for applying rules, do nothing
                    if (!scope.applyRules)
                        return;

                    $rootScope.lineWord = 0;
                    $rootScope.tmpLine; // jshint ignore:line

                    if ($rootScope.tmpLine !== 0) {
                        $rootScope.tmpLine = 0;
                    }
                    if (!watchContentInProgress && !watchApplyRulesInProgress) {

                        watchTagsInProgress = true;

                        $rootScope.lineWord = 0;
                        $rootScope.tmpLine; // jshint ignore:line

                        if ($rootScope.tmpLine !== 0) {
                            $rootScope.tmpLine = 0;
                        }
                        adapt(scope.regleStyle, scope.tags);

                    }

                });

                var applyAdaptation = function () {


                    //console.log('applyAdaptation');

                    var listTagsByProfil = scope.tags;
                    var listTags = JSON.parse(localStorage.getItem('listTags'));

                    for (var i = 0; i < listTagsByProfil.length; i++) {
                        var tagByProfil = listTagsByProfil[i];
                        var tag = getTagsById(listTags, tagByProfil.tag);

                        //console.log(tag);

                        var balise = tag.balise;
                        var elementFound = [];
                        var j = 0;
                        if (balise !== 'div') {

                            elementFound = $(element).find(balise);
                            for (j = 0; j < elementFound.length; j++) {
                                regleColoration(tagByProfil.coloration, elementFound[j]);
                            }

                        } else {
                            elementFound = $(element).find('div.' + removeStringsUppercaseSpaces(tag.libelle));
                            for (j = 0; j < elementFound.length; j++) {
                                regleColoration(tagByProfil.coloration, elementFound[j]);
                            }
                        }
                        // regleColoration('Couleur par défaut', element);
                    }

                    //apply on DOM
                    $compile(element.contents())(scope);

                };

                var applyStyles = function () {

                    console.log('apply styles');

                    var listTagsByProfil = scope.tags;

                    var listTags = JSON.parse(localStorage.getItem('listTags'));

                    for (var i = 0; i < listTagsByProfil.length; i++) {
                        var tagByProfil = listTagsByProfil[i];
                        var tag = getTagsById(listTags, tagByProfil.tag);
                        var balise = tag.balise;
                        var elementFound = [];
                        var j = 0;
                        if (balise !== 'div') {

                            elementFound = $(element).find(balise);
                            for (j = 0; j < elementFound.length; j++) {
                                applyCSS(elementFound[j], tagByProfil);
                            }

                        } else {
                            elementFound = $(element).find('div.' + removeStringsUppercaseSpaces(tag.libelle));
                            for (j = 0; j < elementFound.length; j++) {
                                applyCSS(elementFound[j], tagByProfil);
                            }
                        }
                    }

                    //apply on DOM
                    $compile(element.contents())(scope);
                };

                var applyCSS = function (element, profilTag) {
                    // Transformation appropriate to the application

                    if(scope.preview && element.tagName != 'P' ){
                        $(element).css({
                            'height': (1.286 + (profilTag.interligne - 1) * 0.18) + 'em',
                            'overflow': 'hidden'
                        });
                    } else {
                        $(element).css({
                            'height': ((1.286 + (profilTag.interligne - 1) * 0.18) * 4)  + 'em',
                            'overflow': 'hidden'
                        });
                    }

                    $(element).css('font-family', profilTag.police);
                    $(element).css('font-size', (profilTag.taille / 12) + 'em');
                    $(element).css('line-height', (1.286 + (profilTag.interligne - 1) * 0.18) + 'em');
                    $(element).css('font-weight', profilTag.styleValue);
                    $(element).css('word-spacing', (0 + (profilTag.spaceSelected - 1) * 0.18) + 'em');
                    $(element).css('letter-spacing', (0 + (profilTag.spaceCharSelected - 1) * 0.12) + 'em');
                };

                var currentParam = '';
                var currentElementAction = '';
                var hyphenatorSettings = {
                    'onhyphenationdonecallback': function () {
                        // console.log('done ... ');
                        syllabeAction(currentParam, currentElementAction);
                    },
                    hyphenchar: '|',
                    defaultlanguage: 'fr',
                    useCSS3hyphenation: true,
                    displaytogglebox: true,
                };
                Hyphenator.config(hyphenatorSettings);

                /*
                 * Detect and separate the lines of a paragraph..
                 */
                var lineAction = function (elementAction, palette) {

                    removeAllSpan(angular.element(elementAction));
                    if (elementAction.children.length > 0) {
                        angular.forEach(elementAction.children, function (element) {
                            lineAction(element, palette);
                        });
                    }

                    //console.log('elementAction = ' + elementAction.tagName );

                    if (elementAction.tagName !== 'IMG' && elementAction.tagName !== 'A') {
                        // console.log('inside line action');
                        var textNodes = getTextNodes(elementAction);

                        angular.forEach(textNodes, function (textNode) {
                            //console.log('text node');
                            //console.log(textNode);

                            var tmpTxt = textNode.textContent;
                            tmpTxt = tmpTxt.replace(/</g, '&lt;');
                            tmpTxt = tmpTxt.replace(/>/g, '&gt;');
                            if (!scope.editorContent)
                                tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
                            tmpTxt = tmpTxt.replace(/\xA0/g, '&nbsp;');

                            var words = tmpTxt.split(' '); // p.text().split(' ');
                            var text = '';

                            $.each(words, function (i, w) {
                                if ($.trim(w)) {
                                    // Handle the case of - in a word
                                    var txtTiret = w.split('-');
                                    if (txtTiret.length > 1) {
                                        $.each(txtTiret, function (j, sw) {
                                            // end of a word: add a space char
                                            if (j === txtTiret.length - 1) {
                                                text = text + '<span>' + sw + ' </span>';
                                            } else {
                                                text = text + '<span>' + sw + '-</span>';
                                            }
                                        });
                                        // one word
                                    } else {
                                        // add a space
                                        text = text + '<span>' + w + ' </span>';
                                    }
                                }
                            });

                            // case one word
                            if (words.length === 1)
                                text = '<span>' + words[0] + '</span>';
                            if (!scope.editorContent)
                                text = text.replace(/<span><br\/> <\/span>/g, '<br/> ');
                            angular.element(textNode).replaceWith($.parseHTML(text));
                        });
                        var p = $(elementAction);
                        var line = $rootScope.tmpLine;

                        //console.log('p = ' + p);
                        var prevTop = -15;
                        $('span:not(.customSelect, .customSelectInner)', p).each(function () {
                            var word = $(this);
                            var top = word.offset().top;
                            var isEmptyLine = false;

                            if (top !== prevTop) {
                                prevTop = top;
                                if (line >= palette) { // jshint ignore:line
                                    line = 1;
                                } else {
                                    // only 1 word with only space(s)
                                    if (word.text().trim().length === 0) {
                                        isEmptyLine = true;
                                    } else {
                                        line++;
                                    }
                                }
                                $rootScope.tmpLine = line;
                            }
                            if (!isEmptyLine)
                                word.attr('class', 'line' + $rootScope.tmpLine);
                        }); // each
                    } else if (elementAction.tagName === 'A') {
                        addASpace(elementAction);
                    }

                };

                /*
                 * Detect and separate the words of a paragraph.
                 */
                var wordAction = function (elementAction) {
                    var p = $(elementAction);
                    removeAllSpan(p);
                    if (elementAction.children.length > 0) {
                        angular.forEach(elementAction.children, function (element) {
                            wordAction(element);
                        });
                    }
                    if (elementAction.tagName !== 'A') {

                        var textNodes = getTextNodes(elementAction);

                        angular.forEach(textNodes, function (textNode) {
                            var tmpTxt = textNode.textContent;
                            tmpTxt = tmpTxt.replace(/</g, '&lt;');
                            tmpTxt = tmpTxt.replace(/>/g, '&gt;');
                            if (!scope.editorContent)
                                tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
                            tmpTxt = tmpTxt.replace(/\xA0/g, '&nbsp;');

                            var words = tmpTxt.split(' ');

                            var text = '';
                            $.each(words, function (i, w) {
                                if ($.trim(w)) {
                                    if (w === '&nbsp;') {
                                        if (!scope.editorContent)
                                            text = text + '<br/>';
                                    } else {
                                        // add a space at the end of the word
                                        text = text + '<span >' + w + '</span> ';
                                    }
                                }
                            });

                            // case one word
                            if (words.length === 1)
                                text = '<span>' + words[0] + '</span>';
                            if (!scope.editorContent)
                                text = text.replace(/<span><br\/><\/span>/g, '<br/> ');
                            angular.element(textNode).replaceWith($.parseHTML(text));

                            var line = $rootScope.lineWord;
                            $('span:not(.customSelect, .customSelectInner)', p).each(function () {
                                var word = $(this);
                                if (line !== 3) {
                                    line++;
                                } else {
                                    line = 1;
                                }
                                word.attr('class', 'line' + line);
                                $rootScope.lineWord = line;
                            }); // each
                        });
                    } else {
                        addASpace(elementAction);
                    }
                };

                function addASpace(elementAction) {
                    if (elementAction.textContent)
                        elementAction.textContent = ' ' + elementAction.textContent + ' ';
                }

                /*
                 * Configure the Hyphenator plugin.
                 */
                var decoupe = function (param, elementAction) {
                    // removeAllSpan($(elementAction));
                    if (elementAction.children.length > 0) {
                        angular.forEach(elementAction.children, function (element) {
                            decoupe(param, element);
                        });
                    }

                    if (elementAction.tagName !== 'A') {

                        var textNodes = getTextNodes(elementAction);
                        angular.forEach(textNodes, function (textNode) {
                            textNode.textContent = Hyphenator.hyphenate(textNode.textContent, 'fr');
                            syllabeAction(param, textNode);
                        });

                    } else {
                        addASpace(elementAction);
                    }
                };

                /*
                 * Detect and separate the syllables of the words of a paragraph.
                 */
                var syllabeAction = function (param, elementAction) {
                    var p = elementAction.parentElement;
                    var tmpTxt = elementAction.textContent;
                    tmpTxt = tmpTxt.replace(/</g, '&lt;');
                    tmpTxt = tmpTxt.replace(/>/g, '&gt;');
                    if (!scope.editorContent)
                        tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
                    tmpTxt = tmpTxt.replace(/\xA0/g, '&nbsp;');

                    // wrap each syllables with a <span>, add a space after the last
                    // syllable
                    var words = tmpTxt.split(' ');
                    var text = '';
                    for (var i = 0; i < words.length; i++) {
                        var currentWord = words[i].trim();

                        if (currentWord.indexOf('|') > -1) {
                            var syllabes = currentWord.split('|');
                            for (var j = 0; j < syllabes.length; j++) {
                                if (j === syllabes.length - 1) {
                                    // add a space
                                    text = text + '<span>' + syllabes[j] + '</span> ';
                                } else {
                                    text = text + '<span>' + syllabes[j] + '</span>';
                                }
                            }
                        } else {
                            text = text + '<span>' + currentWord + '</span> ';
                        }
                    }
                    if (!scope.editorContent)
                        text = text.replace(/<span><br\/><\/span>/g, '<br/> ');

                    angular.element(elementAction).replaceWith($.parseHTML(text));

                    $(window).resize(function () {

                        //console.log('p = ' + p);

                        var line = 0;
                        $('span:not(.customSelect, .customSelectInner)', p).each(function () {
                            var word = $(this);
                            if (line !== 3) {
                                line++;
                            } else {
                                line = 1;
                            }
                            word.attr('class', 'line' + line);
                        }); // each
                    }); // resize

                    $(window).resize();
                };

                // Test on Listener if it is already registered
                if (!$rootScope.$$listeners.reglesStyleChange) {

                    /* Profiles Style rule  */
                    $rootScope.$on('reglesStyleChange', function (nv, params) {

                        //console.log('Regle style declenched ');
                        // console.log(nv);

                        nv.stopPropagation();
                        scope.colorationCount = 0;
                        $rootScope.tmpLine = 0;
                        switch (params.operation) {

                        case 'interligne':
                            var tmp;
                            tmp = 1.286 + (params.value - 1) * 0.18;
                            $('.' + params.element).css('line-height', tmp + 'em');
                            if (scope.colorationCount > 0) {
                                $('.' + params.element).text($('.' + params.element).text());
                                regleColoration(scope.oldColoration, $('.' + params.element));
                            }
                            break;

                        case 'style':
                            if (params.value === 'Gras') {
                                params.value = 'Bold';
                            }
                            $('.' + params.element).css('font-weight', params.value);
                            if (scope.colorationCount > 0) {
                                $('.' + params.element).text($('.' + params.element).text());
                                regleColoration(scope.oldColoration, $('.' + params.element));
                            }
                            regleColoration(scope.oldColoration, $('.' + params.element));

                            break;

                        case 'taille':
                            var tmp2;
                            tmp2 = params.value / 12;
                            $('.' + params.element).css('font-size', tmp2 + 'em');
                            if (scope.colorationCount > 0) {
                                $('.' + params.element).text($('.' + params.element).text());
                                regleColoration(scope.oldColoration, $('.' + params.element));
                            }
                            regleColoration(scope.oldColoration, $('.' + params.element));

                            break;

                        case 'police':
                            $('.' + params.element).css('font-family', params.value);
                            if (scope.colorationCount > 0) {
                                $('.' + params.element).text($('.' + params.element).text());
                                regleColoration(scope.oldColoration, $('.' + params.element));
                            }
                            regleColoration(scope.oldColoration, $('.' + params.element));
                            break;

                        case 'coloration':
                            scope.colorationCount = 0;
                            regleColoration(params.value, $('.' + params.element));
                            scope.colorationCount++;
                            scope.oldColoration = params.value;
                            break;

                        case 'space':
                            regleEspace(params.value, $('.' + params.element));
                            if (scope.colorationCount > 0) {
                                $('.' + params.element).text($('.' + params.element).text());
                                regleColoration(scope.oldColoration, $('.' + params.element));
                            }
                            regleColoration(scope.oldColoration, $('.' + params.element));
                            break;
                        case 'spaceChar':
                            regleCharEspace(params.value, $('.' + params.element));
                            if (scope.colorationCount > 0) {
                                $('.' + params.element).text($('.' + params.element).text());
                                regleColoration(scope.oldColoration, $('.' + params.element));
                            }
                            regleColoration(scope.oldColoration, $('.' + params.element));
                            break;

                        case 'initialiseColoration':
                            scope.oldColoration = null;
                            break;
                        }

                    });
                }

                function getTextNodes(elementAction) {
                    return $(elementAction).contents().filter(function () {
                        return this.nodeType === 3;
                    });
                }

                function regleEspace(param, elementAction) {
                    var tmp = 0 + (param - 1) * 0.18;
                    $(elementAction).css('word-spacing', '' + tmp + 'em');
                }

                function regleCharEspace(param, elementAction) {
                    var tmp = 0 + (param - 1) * 0.12;
                    $(elementAction).css('letter-spacing', '' + tmp + 'em');
                }

                function regleColoration(param, elementAction) {
                    //console.log('regle coloration');
                    var element;
                    switch (param) {
                    case 'Pas de coloration':
                        lineAction(elementAction, 3);
                        element = angular.element(elementAction);
                        element.find('.line1').css('background-color', '');
                        element.find('.line2').css('background-color', '');
                        element.find('.line3').css('background-color', '');
                        element.css('color', 'black');
                        element.find('span').css('color', 'black');
                        // $(elementAction).text($(elementAction).text());
                        break;

                    case 'Colorer les lignes RBV':
                        lineAction(elementAction, 3);
                        element = angular.element(elementAction);
                        element.find('.line1').css('color', '#D90629');
                        element.find('.line2').css('color', '#066ED9');
                        element.find('.line3').css('color', '#4BD906');
                        break;
                    case 'Colorer les lignes RVJ':
                        lineAction(elementAction, 3);
                        element = angular.element(elementAction);
                        element.find('.line1').css('color', '#D90629');
                        element.find('.line2').css('color', '#4BD906');
                        element.find('.line3').css('color', '#ECE20F');
                        break;

                    case 'Colorer les lignes RBVJ':
                        lineAction(elementAction, 4);
                        element = angular.element(elementAction);
                        element.find('.line1').css('color', '#D90629');
                        element.find('.line2').css('color', '#066ED9');
                        element.find('.line3').css('color', '#4BD906');
                        element.find('.line4').css('color', '#ECE20F');
                        break;

                    case 'Colorer les mots':
                        wordAction(elementAction);
                        element = angular.element(elementAction);
                        element.find('.line1').css('background-color', '');
                        element.find('.line2').css('background-color', '');
                        element.find('.line3').css('background-color', '');
                        element.find('.line1').css('color', '#D90629');
                        element.find('.line2').css('color', '#066ED9');
                        element.find('.line3').css('color', '#4BD906');
                        break;

                    case 'Surligner les mots':
                        wordAction(elementAction);
                        element = angular.element(elementAction);
                        element.find('.line1').css({
                            'background-color': '#fffd01',
                            'color': '#000'
                        });
                        element.find('.line2').css({
                            'background-color': '#04ff04',
                            'color': '#000'
                        });
                        element.find('.line3').css({
                            'background-color': '#04ffff',
                            'color': '#000'
                        });
                        break;

                    case 'Surligner les lignes RBV':
                        lineAction(elementAction, 3);
                        element = angular.element(elementAction);
                        element.css('color', '');
                        element.find('span').css('color', 'black');
                        element.find('.line1').css('background-color', '#D90629');
                        element.find('.line2').css('background-color', '#066ED9');
                        element.find('.line3').css('background-color', '#4BD906');
                        break;
                    case 'Surligner les lignes RVJ':
                        lineAction(elementAction, 3);
                        element = angular.element(elementAction);
                        element.css('color', '');
                        element.find('span').css('color', 'black');
                        element.find('.line1').css('background-color', '#D90629');
                        element.find('.line2').css('background-color', '#4BD906');
                        element.find('.line3').css('background-color', '#ECE20F');
                        break;
                    case 'Surligner les lignes RBVJ':
                        lineAction(elementAction, 4);
                        element = angular.element(elementAction);
                        element.css('color', '');
                        element.find('span').css('color', 'black');
                        element.find('.line1').css('background-color', '#D90629');
                        element.find('.line2').css('background-color', '#066ED9');
                        element.find('.line3').css('background-color', '#4BD906');
                        element.find('.line4').css('background-color', '#ECE20F');
                        break;
                    case 'Colorer les syllabes':
                        removeAllSpan(angular.element(elementAction));
                        decoupe('color-syllabes', elementAction);
                        element = angular.element(elementAction);
                        element.css('color', '');
                        element.find('span').css('color', '');
                        element.find('.line1').css('color', '#D90629');
                        element.find('.line2').css('color', '#066ED9');
                        element.find('.line3').css('color', '#4BD906');
                        break;

                    }
                }

            }
        };


                }]);