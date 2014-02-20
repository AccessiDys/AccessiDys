/* File: regleStyle.js
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

/*global cnedApp,Hyphenator, $:false */
'use strict';

cnedApp.directive('regleStyle', ['$rootScope', 'removeHtmlTags', '$compile',
  function($rootScope, removeHtmlTags, $compile) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {

        $rootScope.lineWord = 0;
        $rootScope.lineLine = 1;

        var compile = function(newHTML) {
          newHTML = $compile(newHTML)($rootScope);
          element.html('').append(newHTML);

          console.log('ffff compile');
          console.log($(element).attr('data-id'));
          console.log(element);

          $(element).css({
            'font-weight': $(element).find('p').attr('data-weight'),
            'font-size': $(element).find('p').attr('data-size') + 'px',
            'line-height': $(element).find('p').attr('data-lineheight') + 'px',
            'font-family': $(element).find('p').attr('data-font')
          });

          regleColoration($(element).find('p').attr('data-coloration'), element);

          console.log('adding slide');
          console.log($('.text-slides[data-id="' + $(element).attr('data-id') + '"]').append($(element)));
          // $(element).remove();
          //$('.slider slide').append($(element));
        };

        var htmlName = attrs.regleStyle;

        scope.$watch(htmlName, function(newHTML) {
          // the HTML
          if (!newHTML) return;
          compile(newHTML); // Compile
        });

        angular.element(document).ready(function() {
          console.log('document ready');
          //console.log(attrs);
        });

        var currentParam = '';
        var currentElementAction = '';
        var hyphenatorSettings = {
          'onhyphenationdonecallback': function() {
            console.log('done ... ');
            syllabeAction(currentParam, currentElementAction);
          },
          hyphenchar: '|',
          displaytogglebox: true,
        };
        Hyphenator.config(hyphenatorSettings);

        var lineAction = function(elementAction) {
          console.log('inside line action');
          var p = $(elementAction);
          //p.html(p.html().replace(/\&nbsp;/g, ' '));
          var words = p.text().split(' ');
          var text = '';

          $.each(words, function(i, w) {
            if ($.trim(w)) text = text + '<span>' + w + ' </span>';
          });
          $(elementAction).html(text);

          var line = $rootScope.lineLine;
          var prevTop = -15;
          $('span', p).each(function() {
            var word = $(this);
            var top = word.offset().top;
            if (top !== prevTop) {
              prevTop = top;
              if (line === 3) {
                line = 1;
              } else {
                line++;
              }
              $rootScope.lineLine = line;
            }
            word.attr('class', 'line' + line);
          }); //each
        };


        // var lineAction = function(elementAction) {
        //   console.log('inside line action');
        //   console.log($(elementAction));

        //   var current = $(elementAction);
        //   var text = current.text();
        //   var words = text.split(' ');
        //   var previous = '';
        //   var lines = '';
        //   current.text(words[0]);
        //   var height = current.height();
        //   var line = $rootScope.lineLine;
        //   console.log('words = ' + words);
        //   for (var i = 1; i <= words.length; i++) {
        //     previous = current.text();

        //     if (current.text() === '') {
        //       current.text(words[i]);
        //     } else {
        //       current.text(current.text() + ' ' + words[i]);
        //     }

        //     console.log('text = ' + current.height());
        //     console.log(current);

        //     if (current.height() > height) {
        //       height = (current.height() - height);
        //       console.log('word = ' + words[i]);
        //       current.text('');
        //       i = i - 1;
        //       if (previous !== '') {
        //         lines += '<span class="line' + line + '">' + previous + ' </span>';
        //         console.log('lines = ');
        //         console.log(lines);
        //       }

        //       if (line === 3) {
        //         line = 1;
        //       } else {
        //         line++;
        //       }
        //       $rootScope.lineLine = line;
        //       console.log('line = ' + $rootScope.lineLine);

        //     }
        //   }

        //   if (lines === '') {
        //     lines = '<span class="line' + $rootScope.lineLine + '">' + previous + ' </span>';
        //   }

        //   $(elementAction).html(lines);
        // };

        var wordAction = function(elementAction) {

          var p = $(elementAction);
          p.html(p.html().replace(/\&nbsp;/g, ' '));
          var words = p.text().split(' ');
          var text = '';
          $.each(words, function(i, w) {
            if ($.trim(w)) text = text + '<span >' + w + '</span> ';
          });
          p.html(text);

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
        };

        var decoupe = function(param, elementAction) {

          var palinText = removeHtmlTags($(elementAction).html());
          $(elementAction).html('');
          elementAction.text(palinText);
          //$(elementAction).addClass('hyphenate');
          //Hyphenator.toggleHyphenation(3);

          // Hyphenator = new Hyphenator();
          currentParam = param;
          currentElementAction = elementAction;

          //Hyphenator.run();
          elementAction.text(Hyphenator.hyphenate($(elementAction).text(), 'fr'));
          syllabeAction(currentParam, elementAction);

        };

        var syllabeAction = function(param, elementAction) {
          console.log('inside syllab action');
          var p = $(elementAction);
          var words = p.text().split(' ');
          var text = '';
          $.each(words, function(i, w) {
            if ($.trim(w)) {
              if (w.indexOf('|') > -1) {
                var wordss = w.split('|');
                $.each(wordss, function(i, ww) {
                  if (i === wordss.length - 1) {
                    text = text + '<span class="syllab">' + ww + '</span> ';
                  } else {
                    text = text + '<span class="syllab">' + ww + '</span>';
                  }
                });
              } else {
                text = text + '<span >' + w + '</span> ';
              }
            }
          });

          p.html(text);
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

          if (param === 'color-syllabes') {
            $(elementAction).css('color', '');
            $(elementAction).find('span').css('color', '');

            $(elementAction).find('.line1').css('color', '#D90629');
            $(elementAction).find('.line2').css('color', '#066ED9');
            $(elementAction).find('.line3').css('color', '#4BD906');
          }

        };

        /* Relges de style Profils */
        $rootScope.$on('reglesStyleChange', function(nv, params) {
          nv.stopPropagation();
          switch (params.operation) {

            case 'interligne':
              $('.' + params.element).css('line-height', params.value + 'px');
              break;

            case 'style':
              $('.' + params.element).css('font-weight', params.value);
              if (scope.colorationCount > 0) {
                angular.element($('.' + params.element).text($('.' + params.element).text()));
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              break;

            case 'taille':
              $('.' + params.element).css('font-size', params.value + 'px');
              if (scope.colorationCount > 0) {
                angular.element($('.' + params.element).text($('.' + params.element).text()));
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              break;

            case 'police':
              $('.' + params.element).css('font-family', params.value);
              if (scope.colorationCount > 0) {
                angular.element($('.' + params.element).text($('.' + params.element).text()));
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              break;

            case 'coloration':
              scope.colorationCount = 0;
              regleColoration(params.value, $('.' + params.element));
              scope.colorationCount++;
              scope.oldColoration = params.value;
              break;
          }

        });

        function regleColoration(param, elementAction) {
          // console.log(param);
          switch (param) {
            case 'Couleur par défaut':
              $(elementAction).find('.line1').css('background-color', '');
              $(elementAction).find('.line2').css('background-color', '');
              $(elementAction).find('.line3').css('background-color', '');
              $(elementAction).css('color', 'black');
              $(elementAction).find('span').css('color', 'black');
              $(elementAction).text($(elementAction).text());
              break;

            case 'Colorer les lignes':
              lineAction(elementAction);
              $(elementAction).find('.line1').css('color', '#D90629');
              $(elementAction).find('.line2').css('color', '#066ED9');
              $(elementAction).find('.line3').css('color', '#4BD906');
              break;

            case 'Colorer les mots':
              wordAction(elementAction);
              $(elementAction).find('.line1').css('background-color', '');
              $(elementAction).find('.line2').css('background-color', '');
              $(elementAction).find('.line3').css('background-color', '');
              $(elementAction).find('.line1').css('color', '#D90629');
              $(elementAction).find('.line2').css('color', '#066ED9');
              $(elementAction).find('.line3').css('color', '#4BD906');
              break;

            case 'Surligner les mots':
              wordAction(elementAction);
              $(elementAction).find('.line1').css({
                'background-color': '#fffd01',
                'color': '#000'
              });
              $(elementAction).find('.line2').css({
                'background-color': '#04ff04',
                'color': '#000'
              });
              $(elementAction).find('.line3').css({
                'background-color': '#04ffff',
                'color': '#000'
              });
              break;

            case 'Surligner les lignes':
              lineAction(elementAction);
              $(elementAction).css('color', '');
              $(elementAction).find('span').css('color', '');
              $(elementAction).find('.line1').css('background-color', '#fffd01');
              $(elementAction).find('.line2').css('background-color', '#04ff04');
              $(elementAction).find('.line3').css('background-color', '#04ffff');
              break;

            case 'Colorer les syllabes':
              console.log('Colorer les syllabes');
              console.log(elementAction);
              decoupe('color-syllabes', elementAction);
              break;

          }
        }

      }
    };
  }
]);