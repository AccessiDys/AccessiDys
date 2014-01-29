cnedApp.directive('regleStyle', ['$rootScope',
  function($rootScope) {
    return {
      restrict: 'EA',
      replace: true,
      require: '?ngModel',
      scope: {
        interligneList: '@'
      },
      link: function(scope, element, attr) {

        console.log('the element is ==> ');
        console.log(element);
        console.log(attr);

        var lineAction = function() {

          var p = $(element);
          var words = p.text().split(' ');
          var text = '';
          $.each(words, function(i, w) {
            if ($.trim(w)) text = text + '<span>' + w + ' </span>'
          });

          p.html(text);

          $(window).resize(function() {
            var line = 0;
            var prevTop = -15;
            $('span', p).each(function() {
              var word = $(this);
              var top = word.offset().top;
              if (top != prevTop) {
                prevTop = top;
                if (line == 3) {
                  line = 1;
                } else {
                  line++;
                }
              }
              word.attr('class', 'line' + line);
            }); //each
          }); //resize
          $(window).resize();

        }


        var wordAction = function() {

          var p = $(element);
          var words = p.text().split(' ');
          var text = '';
          $.each(words, function(i, w) {
            if ($.trim(w))
              text = text + '<span >' + w + '</span> '
          });
          p.html(text);
          $(window).resize(function() {

            var line = 0;
            $('span', p).each(function() {
              var word = $(this);
              if (line != 3) {
                line++;
              } else {
                line = 1;
              };
              word.attr('class', 'line' + line);
            }); //each
          }); //resize
          $(window).resize();
        }

       var syllabeAction = function() {
          var p = $(element);
          var words = p.text().split(' ');
          var text = '';
          $.each(words, function(i, w) {
            if ($.trim(w)) {
              if (w.indexOf('|') > -1) {
                var wordss = w.split('|');
                $.each(wordss, function(i, ww) {
                  if (i == wordss.length - 1) {
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
              if (line != 3) {
                line++;
              } else {
                line = 1;
              };
              word.attr('class', 'line' + line);
            }); //each
          }); //resize

          $(window).resize();

        
        }

        $rootScope.$on('reglesStyleChange', function(nv, params) {
          switch (params.operation) {

            case 'interligne':
              $(element).css('line-height', params.value + 'px');
              break;
            case 'style':
              $(element).css('font-weight', params.value);
              break;
            case 'taille':
              $(element).css('font-size', params.value + 'px');
              break;
            case 'police':
              $(element).css('font-family', params.value);
              break;
            case 'coloration':
              switch (params.value) {
                case 'Couleur par défaut':
                  $('.line1').css('background-color', '');
                  $('.line2').css('background-color', '');
                  $('.line3').css('background-color', '');
                  $(element).css('color', 'black');
                  $(element).find('span').css('color', 'black');

                  break;
                case 'Colorer les lignes':
                  lineAction();
                  $('.line1').css('color', '#D90629');
                  $('.line2').css('color', '#066ED9');
                  $('.line3').css('color', '#4BD906');
                  break;
                case 'Colorer les mots':
                  wordAction();
                  $('.line1').css('background-color', '');
                  $('.line2').css('background-color', '');
                  $('.line3').css('background-color', '');
                  $(element).find('.line1').css('color', '#D90629');
                  $(element).find('.line2').css('color', '#066ED9');
                  $(element).find('.line3').css('color', '#4BD906');
                  break;
                case 'Surligner les mots':

                  wordAction();
                  $(element).find('.line1').css({
                    'background-color': '#fffd01',
                    'color': '#000'
                  });
                  $(element).find('.line2').css({
                    'background-color': '#04ff04',
                    'color': '#000'
                  });
                  $(element).find('.line3').css({
                    'background-color': '#04ffff',
                    'color': '#000'
                  });
                  break;
                case 'Surligner les lignes':
                  lineAction();
                  $(element).css('color', '');
                  $(element).find('span').css('color', '');
                  $('.line1').css('background-color', '#fffd01');
                  $('.line2').css('background-color', '#04ff04');
                  $('.line3').css('background-color', '#04ffff');
                  break;
                case 'Colorer les syllabes':
                  syllabeAction();

                  $(element).css('color', '');
                  $(element).find('span').css('color', '');

                  $('.line1').css('color', '#D90629');
                  $('.line2').css('color', '#066ED9');
                  $('.line3').css('color', '#4BD906');

                  break;
                case 'Surligner les syllabes':
                  syllabeAction();
                  $(element).css('color', '');
                  $(element).find('span').css('color', '');
                  $('.line1').css('background-color', '#fffd01');
                  $('.line2').css('background-color', '#04ff04');
                  $('.line3').css('background-color', '#04ffff');
                  break;
                default:
                  $('.line1').css('background-color', '');
                  $('.line2').css('background-color', '');
                  $('.line3').css('background-color', '');
              }
              break;


          }

        });

      }
    };
  }
]);