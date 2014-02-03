/*global cnedApp,Hyphenator, $:false */
'use strict';

cnedApp.directive('regleStyle', ['$rootScope', 'removeHtmlTags',

function($rootScope, removeHtmlTags) {
  return {
    restrict: 'EA',
    replace: false,
    priority: 100000,
    link: function() {

      var currentParam = '';
      var currentElementAction = '';
      var hyphenatorSettings = {
        'onhyphenationdonecallback': function() {
          syllabeAction(currentParam, currentElementAction);
        },
        hyphenchar: '|'
      };
      Hyphenator.config(hyphenatorSettings);

      $rootScope.$on('ElementHtmlAdded', function(ev, el) {
        // ev.stopPropagation();
        console.log('ElementHtmlAdded');
        console.log($(el).find('p').attr('data-weight'));
        el.css({
          fontWeight: $(el).find('p').attr('data-weight'),
          fontSize: $(el).find('p').attr('data-size') + 'px',
          lineHeight: $(el).find('p').attr('data-lineheight') + 'px',
          fontFamily: $(el).find('p').attr('data-font')
        });

        // Regles coloration
        regleColoration($(el).find('p').attr('data-coloration'), $(el).find('p'));
      });

      var lineAction = function(elementAction) {

        var p = $(elementAction);
        var words = p.text().split(' ');
        var text = '';
        $.each(words, function(i, w) {
          if ($.trim(w)) text = text + '<span>' + w + ' </span>';
        });
        $(elementAction).html(text);

        $(window).resize(function() {
          var line = 0;
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
            }
            word.attr('class', 'line' + line);
          }); //each
        }); //resize
        $(window).resize();

      };


      var wordAction = function(elementAction) {

        var p = $(elementAction);
        var words = p.text().split(' ');
        var text = '';
        $.each(words, function(i, w) {
          if ($.trim(w)) text = text + '<span >' + w + '</span> ';
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
      };

      var decoupe = function(param, elementAction) {

        var palinText = removeHtmlTags($(elementAction).html());
        $(elementAction).html('');
        elementAction.text(palinText);
        $(elementAction).addClass('hyphenate');
        Hyphenator.toggleHyphenation(3);

        // Hyphenator = new Hyphenator();
        currentParam = param;
        currentElementAction = elementAction;

        Hyphenator.run();


      };

      var syllabeAction = function(param, elementAction) {
        // $(elementAction).removeClass('hyphenate');
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

          $('.line1').css('color', '#D90629');
          $('.line2').css('color', '#066ED9');
          $('.line3').css('color', '#4BD906');
        }

      };

      $rootScope.$on('reglesStyleChange', function(nv, params) {
        // nv.stopPropagation();
        switch (params.operation) {

          case 'interligne':
            $('.' + params.element).css('line-height', params.value + 'px');
            break;

          case 'style':
            $('.' + params.element).css('font-weight', params.value);
            break;

          case 'taille':
            $('.' + params.element).css('font-size', params.value + 'px');
            break;

          case 'police':
            $('.' + params.element).css('font-family', params.value);
            break;

          case 'coloration':
            regleColoration(params.value, $('.' + params.element));
            break;
        }

      });

      function regleColoration(param, elementAction) {
        switch (param) {
          case 'Couleur par défaut':
            $('.line1').css('background-color', '');
            $('.line2').css('background-color', '');
            $('.line3').css('background-color', '');
            $(elementAction).css('color', 'black');
            $(elementAction).find('span').css('color', 'black');
            $(elementAction).text($(elementAction).text());
            break;

          case 'Colorer les lignes':
            lineAction(elementAction);
            $('.line1').css('color', '#D90629');
            $('.line2').css('color', '#066ED9');
            $('.line3').css('color', '#4BD906');
            break;

          case 'Colorer les mots':
            wordAction(elementAction);
            $('.line1').css('background-color', '');
            $('.line2').css('background-color', '');
            $('.line3').css('background-color', '');
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
            $('.line1').css('background-color', '#fffd01');
            $('.line2').css('background-color', '#04ff04');
            $('.line3').css('background-color', '#04ffff');
            break;

          case 'Colorer les syllabes':
            decoupe('color-syllabes', elementAction);
            break;

        }
      }

    }
  };
}]);