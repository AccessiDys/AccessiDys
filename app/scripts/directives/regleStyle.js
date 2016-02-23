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
 * Directive pour appliquer une règle de style à un paragraphe.
 */
cnedApp.directive('regleStyle', ['$rootScope', '$timeout', 'removeHtmlTags', 'removeStringsUppercaseSpaces', '$compile', '$window',

  function($rootScope, $timeout, removeHtmlTags, removeStringsUppercaseSpaces, $compile) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {

        var shallApplyRules = false;

        $rootScope.lineWord = 0;
        $rootScope.tmpLine; // jshint ignore:line

        if ($rootScope.tmpLine !== 0) {
          $rootScope.tmpLine = 0;
        }

        var tagsValue = '';

        var removeAllSpan = function(element) {
          var spans = element.find('span');
          angular.forEach(spans, function(span) {
            angular.element(span).contents().unwrap(); //replace all span with just content
          });
          element[0].normalize();
        };

        var compile = function(newHTML, listTagsByProfil) {

          $(element).html(newHTML);
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
                regleColoration(tagByProfil.coloration, elementFound[j]);
              }

            } else {
              elementFound = $(element).find('div.' + removeStringsUppercaseSpaces(tag.libelle));
              for (j = 0; j < elementFound.length; j++) {
                regleColoration(tagByProfil.coloration, elementFound[j]);
              }
            }
            //regleColoration('Couleur par défaut', element);
          }

          $compile(element.contents())(scope);

          // cleans white spaces at the end of empty lines so that rangy can find is way
          angular.element('#editorAdd').find('p').each(function(idx, el) {
            if ($(el).text() === '\xa0 ' || $(el).text() === '\xa0') {
              $(el).html('<br/>');
            }
          });
        };

        var getTagsById = function(listTags, id) {
          for (var i = 0; i < listTags.length; i++) {
            if (listTags[i]._id === id) {
              return listTags[i];
            }
          }
          return {};
        };

        //var htmlName = attrs.regleStyle;

        scope.$watch(attrs.regleStyle, function(newHTML) {
          // the HTML
          if (!newHTML || !attrs.tags || (!shallApplyRules && attrs.applyRules)) return;
          $rootScope.lineWord = 0;
          $rootScope.tmpLine; // jshint ignore:line

          if ($rootScope.tmpLine !== 0) {
            $rootScope.tmpLine = 0;
          }
          compile(scope.$eval(attrs.regleStyle), scope.$eval(attrs.tags)); // Compile
        });

        attrs.$observe('applyRules', function(value) {
          shallApplyRules = (value === 'true');
          if (shallApplyRules) {
            $rootScope.lineWord = 0;
            $rootScope.tmpLine; // jshint ignore:line

            if ($rootScope.tmpLine !== 0) {
              $rootScope.tmpLine = 0;
            }
            compile(scope.$eval(attrs.regleStyle), scope.$eval(attrs.tags)); // Compile
          }
        });

        attrs.$observe('tags', function(value) {

          $rootScope.lineWord = 0;
          $rootScope.tmpLine; // jshint ignore:line

          if ($rootScope.tmpLine !== 0) {
            $rootScope.tmpLine = 0;
          }
          if (tagsValue === '') {
            tagsValue = value;
          } else {
            $rootScope.lineWord = 0;
            $rootScope.tmpLine; // jshint ignore:line

            if ($rootScope.tmpLine !== 0) {
              $rootScope.tmpLine = 0;
            }
            compile(scope.$eval(attrs.regleStyle), scope.$eval(attrs.tags));

          }

        });

        var currentParam = '';
        var currentElementAction = '';
        var hyphenatorSettings = {
          'onhyphenationdonecallback': function() {
            // console.log('done ... ');
            syllabeAction(currentParam, currentElementAction);
          },
          hyphenchar: '|',
          displaytogglebox: true,
        };
        Hyphenator.config(hyphenatorSettings);

        /*
         * Détecter et séparer les lignes d'un paragraphe.
         */
        var lineAction = function(elementAction, palette) {

          removeAllSpan(angular.element(elementAction));
          if (elementAction.children.length > 0) {
            angular.forEach(elementAction.children, function(element) {
              lineAction(element, palette);
            });
          }

          if (elementAction.tagName !== 'IMG' && elementAction.tagName !== 'A') {
            //console.log('inside line action');
            var textNodes = getTextNodes(elementAction);

            angular.forEach(textNodes, function(textNode) {
              var tmpTxt = textNode.textContent; //.replace(/\n/g, ' <br/> ');
              tmpTxt = tmpTxt.replace(/</g, '&lt;');
              tmpTxt = tmpTxt.replace(/>/g, '&gt;');
              tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
              tmpTxt = tmpTxt.replace(/\xA0/g, '&nbsp;');

              var words = tmpTxt.split(' '); //p.text().split(' ');
              var text = '';

              $.each(words, function(i, w) {
                if ($.trim(w)) {
                  //traiter le cas de - dans un mot
                  var txtTiret = w.split('-');
                  if (txtTiret.length > 1) {
                    $.each(txtTiret, function(j, sw) {
                      //end of a word: add a space char
                      if (j === txtTiret.length - 1) {
                        text = text + '<span>' + sw + ' </span>';
                      } else {
                        text = text + '<span>' + sw + '-</span>';
                      }
                    });
                    //one word
                  } else {
                    //add a space
                    text = text + '<span>' + w + ' </span>';
                  }
                }
              });

              //case one word
              if (words.length === 1) text = '<span>' + words[0] + '</span>';

              text = text.replace(/<span><br\/> <\/span>/g, '<br/> ');
              angular.element(textNode).replaceWith($.parseHTML(text));
              //$(elementAction).html(text);
            });
            var p = $(elementAction);
            var line = $rootScope.tmpLine;
            var prevTop = -15;
            $('span', p).each(function() {
              var word = $(this);
              var top = word.offset().top;
              var isEmptyLine = false;

              if (top !== prevTop) {
                prevTop = top;
                if (line >= palette) { // jshint ignore:line
                  line = 1;
                } else {
                  //only 1 word with only space(s)
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
            }); //each
          } else if (elementAction.tagName === 'A') {
            addASpace(elementAction);
          }

        };


        /*
         * Détecter et séparer les mots d'un paragraphe.
         */
        var wordAction = function(elementAction) {
          var p = $(elementAction);
          removeAllSpan(p);
          if (elementAction.children.length > 0) {
            angular.forEach(elementAction.children, function(element) {
              wordAction(element);
            });
          }
          if (elementAction.tagName !== 'A') {


            var textNodes = getTextNodes(elementAction);

            angular.forEach(textNodes, function(textNode) {
              var tmpTxt = textNode.textContent;
              tmpTxt = tmpTxt.replace(/</g, '&lt;');
              tmpTxt = tmpTxt.replace(/>/g, '&gt;');
              tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
              tmpTxt = tmpTxt.replace(/\xA0/g,
                '&nbsp;');

              var words = tmpTxt.split(' '); //p.text().split(' ');

              var text = '';
              $.each(words, function(i, w) {
                if ($.trim(w)) {
                  if (w === '&nbsp;') {
                    text = text + '<br/>';
                  } else {
                    //add a space at the end of the word
                    text = text + '<span >' + w + '</span> ';
                  }
                }
              });

              //case one word
              if (words.length === 1) text = '<span>' + words[0] + '</span>';

              text = text.replace(/<span><br\/><\/span>/g, '<br/> ');
              angular.element(textNode).replaceWith($.parseHTML(text));

              var line = $rootScope.lineWord;
              $('span', p).each(function() {
                var word = $(this);
                if (line !== 3) {
                  line++;
                } else {
                  line = 1;
                }
                word.attr('class', 'line' + line);
                $rootScope.lineWord = line;
              }); //each
            });
          } else {
            addASpace(elementAction);
          }
        };


        function addASpace(elementAction) {
          if (elementAction.textContent) elementAction.textContent = ' ' + elementAction.textContent + ' ';
        }

        /*
         * Configurer le plugin Hyphenator.
         */
        var decoupe = function(param, elementAction) {
          //  removeAllSpan($(elementAction));
          if (elementAction.children.length > 0) {
            angular.forEach(elementAction.children, function(element) {
              decoupe(param, element);
            });
          }

          if (elementAction.tagName !== 'A') {

            var textNodes = getTextNodes(elementAction);
            angular.forEach(textNodes, function(textNode) {
              textNode.textContent = Hyphenator.hyphenate(textNode.textContent, 'fr');
              syllabeAction(param, textNode);
            });
            /*
            var palinText = '';
            if (elementAction.text) {
              palinText = removeHtmlTags($(elementAction).html());
              $(elementAction).html('');
              elementAction.text(palinText);
              currentParam = param;
              currentElementAction = elementAction;

              elementAction.text(Hyphenator.hyphenate($(elementAction).text(), 'fr'));
              syllabeAction(currentParam, elementAction);
            } else if (elementAction.textContent) {
              palinText = removeHtmlTags($(elementAction).html());
              $(elementAction).html('');
              elementAction.textContent = palinText;
              currentParam = param;
              currentElementAction = elementAction;

              elementAction.textContent = Hyphenator.hyphenate(palinText, 'fr');
              syllabeAction(currentParam, elementAction);
            }
            */
          } else {
            addASpace(elementAction);
          }
        };

        /*
         * Détecter et séparer les syllabes des mots d'un paragraphe.
         */
        var syllabeAction = function(param, elementAction) {
          var p = elementAction.parentElement;
          var tmpTxt = elementAction.textContent;
          tmpTxt = tmpTxt.replace(/</g, '&lt;');
          tmpTxt = tmpTxt.replace(/>/g, '&gt;');
          tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
          tmpTxt = tmpTxt.replace(/\xA0/g, '&nbsp;');


          // wrap each syllables with a <span>, add a space after the last syllable
          var words = tmpTxt.split(' ');
          var text = '';
          for (var i = 0; i < words.length; i++) {
            var currentWord = words[i].trim();

            if (currentWord.indexOf('|') > -1) {
              var syllabes = currentWord.split('|');
              for (var j = 0; j < syllabes.length; j++) {
                if (j === syllabes.length - 1) {
                  //add a space
                  text = text + '<span>' + syllabes[j] + '</span> ';
                } else {
                  text = text + '<span>' + syllabes[j] + '</span>';
                }
              }
            } else {
              text = text + '<span>' + currentWord + '</span> ';
            }
          }

          text = text.replace(/<span><br\/><\/span>/g, '<br/> ');

          angular.element(elementAction).replaceWith($.parseHTML(text));

          $(window).resize(function() {

            var line = 0;
            $('span', p).each(function() {
              var word = $(this);
              if (line !== 3) {
                line++;
              } else {
                line = 1;
              }
              word.attr('class', 'line' + line);
            }); //each
          }); //resize

          $(window).resize();

          // if (param === 'color-syllabes') {
          //   var paragraphe = angular.element(p);
          //   paragraphe.css('color', '');
          //   paragraphe.find('span').css('color', '');
          //   paragraphe.find('.line1').css('color', '#D90629');
          //   paragraphe.find('.line2').css('color', '#066ED9');
          //   paragraphe.find('.line3').css('color', '#4BD906');
          // }

        };


        /* Test sur le Listener s'il est déjà enregistré */
        if (!$rootScope.$$listeners.reglesStyleChange) {

          /* Relges de style Profils */
          $rootScope.$on('reglesStyleChange', function(nv, params) {

            // console.log('Regle style declenched ');
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
                tmp2 = 1 + (params.value - 1) * 0.18;
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
                regleColoration(params.value, $('.' + params.element)[0]);
                scope.colorationCount++;
                scope.oldColoration = params.value;
                break;

              case 'space':
                regleEspace(params.value, $('.' + params.element));
                if (scope.colorationCount > 0) {
                  $('.' + params.element).text($('.' + params.element).text());
                  regleColoration(scope.oldColoration, $('.' + params.element)[0]);
                }
                regleColoration(scope.oldColoration, $('.' + params.element)[0]);
                break;
              case 'spaceChar':
                regleCharEspace(params.value, $('.' + params.element));
                if (scope.colorationCount > 0) {
                  $('.' + params.element).text($('.' + params.element).text());
                  regleColoration(scope.oldColoration, $('.' + params.element)[0]);
                }
                regleColoration(scope.oldColoration, $('.' + params.element)[0]);
                break;

              case 'initialiseColoration':
                scope.oldColoration = null;
                break;
            }

          });
        }

        function getTextNodes(elementAction) {
          return $(elementAction).contents().filter(function() {
            return this.nodeType === 3;
          });
        }


        function regleEspace(param, elementAction) {
          // $('.shown-text-add span').each(function() {
          //   $(this).css('margin-left', param)
          // });

          var tmp = 0 + (param - 1) * 0.18;
          $(elementAction).css('word-spacing', '' + tmp + 'em');
        }

        function regleCharEspace(param, elementAction) {
          // $('.shown-text-add span').each(function() {
          //   $(this).css('margin-left', param)
          // });
          var tmp = 0 + (param - 1) * 0.12;
          $(elementAction).css('letter-spacing', '' + tmp + 'em');
        }

        function regleColoration(param, elementAction) {
          // console.log(param);
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
  }
]);
