/* File: GruntFile.js
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

var path = require('path');
var packageJson = require('./package.json');
var swPrecache = require('sw-precache');

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: '.',
        dist: 'dist',
        generated: 'generated'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            bower : {
                files : [ 'bower.json' ],
                tasks : [ 'wiredep' ]
            },
            main: {
                files: ['app/**/*.{html,css,png,jpeg,GIF,jpg,eot,svg,ttf,woff}'],
                tasks: ['generate-cache']
            },
            options: {
                livereload: true
                    /*
                     * , port: 3000, key: grunt.file.read('../sslcert/key.pem'), cert:
                     * grunt.file.read('../sslcert/cert.pem')
                     */
            }
        },
        express: {
            options: {
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    server: 'app.js',
                    livereload: true,
                    serverreload: false,
                    bases: ['.tmp', yeomanConfig.app],
                    spawn: false
                }
            },
            test: {
                options: {
                    server: path.resolve(__dirname, 'app.js'),
                    bases: ['./.tmp', './test']
                }
            },
            dist: {
                options: {
                    server: 'app.js',
                    bases: yeomanConfig.dist
                }
            },
            server: {
                options: {
                    port: 80
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['.tmp', '<%= yeoman.dist %>/*', '<%= yeoman.generated %>/*', '!<%= yeoman.dist %>/.git*']
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'generated/jshint/resultJSHint.html'
            },
            all: {
                src: ['Gruntfile.js', 'app/scripts/**/*.js', 'api/**/*.js', 'test/spec/**/*.js']
            }
        },
        rev: {
            dist: {
                files: {
                    src: ['<%= yeoman.dist %>/scripts/{,*/}*.js', '<%= yeoman.dist %>/styles/{,*/}*.css', '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}', '<%= yeoman.dist %>/styles/fonts/*']
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*
                     * removeCommentsFromCDATA: true, //
                     * https://github.com/yeoman/grunt-usemin/issues/44
                     * //collapseWhitespace: true, collapseBooleanAttributes: true,
                     * removeAttributeQuotes: true, removeRedundantAttributes: true,
                     * useShortDoctype: true, removeEmptyAttributes: true,
                     * removeOptionalTags: true
                     */
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: ['*.html', 'views/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.',
                        dest: '<%= yeoman.dist %>/app/data',
                        src: ['./AccessiDys_0028_USM_Guide_utilisateur_V01.4.pdf'],
                        rename: function (dest) {
                            return dest + '/User_guide.pdf';
                        }
                },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: ['app/**/*.{html,css,png,jpeg,GIF,jpg,eot,svg,ttf,woff,appcache,gif,ico,pdf}', 'app/bower_components/**/*.js', 'app/bower_components/**/*.mem', 'app/bower_components/**/*.traineddata', 'app/scripts/**/*.js', 'app.js', 'app/viewsScripts/**/*.js', 'api/**/*', 'models/**/*', 'routes/**/*', 'Gruntfile.js', 'package.json', 'files/**/**/**', 'po/**', 'patches/**', 'env/generalParams.json']
                }, {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: ['../env/config.<%= [NODE_ENV] %>.json'],
                        rename: function (dest) {
                            return dest + '/env/config.json';
                        }
                },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: ['generated/*']
                }]
            }
        },
        concurrent: {
            dist: ['imagemin', 'svgmin']
        },
        html2js: {
            options: {
                base: 'app',
                module: 'templates',
                singleModule: true,
                useStrict: true,
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                }
            },
            main: {
                src: ['app/views/**/*.html'],
                dest: 'app/viewsScripts/template_cache.js'
            }
        },
        // ng-annotate tries to make the code safe for minification
        // automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    src: ['scripts/**/*.js', 'viewsScripts/*.js'],
                    dest: 'generated/'
                }]
            }
        },
        uglify: {
            build: {
                src: ['<%= yeoman.generated %>/scripts/**/*.js', '<%= yeoman.generated %>/viewsScripts/*.js'],
                dest: '<%= yeoman.dist %>/app/scripts/front.js'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        nggettext_extract: {
            pot: {
                files: {
                    'po/template.pot': ['app/views/**/*.html']
                }
            }
        },
        nggettext_compile: {
            all: {
                files: {
                    'app/scripts/translations.js': ['po/*.po']
                }
            }
        },
        /**
         * Specification de chaque configuration d'un ENV comme task
         */
        env: {
            app: {
                src: '../env/config.json'
            },
            test: {
                src: '../env/config.test.json'
            }
        },
        removelogging: {
            dist: {
                src: ['api/**/*.js', 'app/scripts/**/*.js'],
                options: {
                    // see below for options. this is optional.
                }
            }
        },

        // Automatically inject Bower components into the app
        wiredep : {
            app : {
                src : [ 'app/index.html' ],
                ignorePath : /\.\.\//
            }
        },
        swPrecache: {
          dev: {
            handleFetch: true,
            rootDir: 'app'
          }
        }
    });
    grunt
        .registerTask(
            'verifyCopyright',
            function () {

                var fileRead, counter = 0;
                var copyrightInfo = ' * Copyright (c) 2013-2016\n * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France\n * (direction-innovation@cned.fr)\n *\n * GNU Affero General Public License (AGPL) version 3.0 or later version\n *\n * This file is part of a program which is free software: you can\n * redistribute it and\/or modify it under the terms of the\n * GNU Affero General Public License as published by\n * the Free Software Foundation, either version 3 of the License, or\n * (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public\n * License along with this program.\n * If not, see <http:\/\/www.gnu.org\/licenses\/>';
                grunt.log.writeln();

                // read all subdirectories from your modules folder
                grunt.file.expand({
                    filter: 'isFile',
                    cwd: '.'
                }, ['app/scripts/**/*.js', 'app/views/**/*.html', 'app/styles/main.css', 'app/styles/styles.css', 'app/*.html', 'api/**/*.js', 'models/*.js', 'patches/*.js', 'routes/*.js', 'test/**/*.js', '!app/scripts/app.js', '!app/scripts/services/config.js', '!app/scripts/front.js', '!app/index.html']).forEach(function (dir) {
                    fileRead = grunt.file.read('./' + dir);

                    if (fileRead.indexOf(copyrightInfo) === -1) {
                        counter++;
                        grunt.log.write(dir);
                        grunt.log.writeln(' --> doesn\'t have copyright.');
                        grunt.fail.warn('Some files doesn\'t have copyright');
                    }
                });

                grunt.log.ok('Found', counter, 'files without copyright');
            });
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'useminPrepare', 'ngAnnotate', 'uglify', 'usemin']);

    grunt.registerTask('setEnv', function () {
        grunt.config('NODE_ENV', process.env.NODE_ENV);
        grunt.config('URL_REQUEST', process.env.URL_REQUEST);
        grunt.config('DROPBOX_TYPE', process.env.DROPBOX_TYPE);
        grunt.config('CATALOGUE_NAME', process.env.CATALOGUE_NAME);
        grunt.config('SSL_KEY', process.env.SSL_KEY);
        grunt.config('SSL_CERT', process.env.SSL_CERT);
        console.log('ENV = ' + process.env.NODE_ENV);
    });

    grunt.registerTask('build-app', ['env:app', 'setEnv', 'html2js:main', 'build']);

    grunt.registerTask('generate-test', ['env:test', 'setEnv', 'html2js:main']);

    grunt.registerTask('test', ['env:test', 'setEnv', 'html2js:main', 'clean:server',  'jshint:all', 'karma']);

    grunt.registerTask('generate-cache', ['html2js:main']);

    grunt.registerTask('removeLogs', ['removelogging']);
    
    function writeServiceWorkerFile(rootDir, handleFetch, callback) {
      var config = {
        cacheId: packageJson.name,
        // dynamicUrlToDependencies: {
        //   'dynamic/page1': [
        //     path.join(rootDir, 'views', 'layout.jade'),
        //     path.join(rootDir, 'views', 'page1.jade')
        //   ],
        //   'dynamic/page2': [
        //     path.join(rootDir, 'views', 'layout.jade'),
        //     path.join(rootDir, 'views', 'page2.jade')
        //   ]
        // },
        // If handleFetch is false (i.e. because this is called from swPrecache:dev), then
        // the service worker will precache resources but won't actually serve them.
        // This allows you to test precaching behavior without worry about the cache preventing your
        // local changes from being picked up during the development cycle.
        handleFetch: handleFetch,
        ignoreUrlParametersMatching: [/v/], //because font-awesome js have ?v=x.x.x parameter added to request
        logger: grunt.log.writeln,
        staticFileGlobs: [
          rootDir + '/*.html',
          rootDir + '/viewsScripts/*.js',
          rootDir + '/scripts/**/**.js',
          rootDir + '/styles/**/**',
          //rootDir + '/fonts/*',
          rootDir + '/external_components/**/**.js',
          rootDir + '/',
          rootDir + '/bower_components/bootstrap/dist/css/bootstrap.min.css',
          rootDir + '/bower_components/components-font-awesome/css/font-awesome.css',
          rootDir + '/bower_components/slick-carousel/slick/slick.css',
          rootDir + '/bower_components/slick-carousel/slick/slick-theme.css',
          rootDir + '/bower_components/textAngular/dist/textAngular.css',
          rootDir + '/bower_components/cropperjs/dist/cropper.css',
          rootDir + '/bower_components/angular-cookie-law/dist/angular-cookie-law.min.css',
          rootDir + '/bower_components/angular/angular.js',
          rootDir + '/bower_components/angular-animate/angular-animate.js',
          rootDir + '/bower_components/angular-sanitize/angular-sanitize.js',
          rootDir + '/bower_components/angular-cookies/angular-cookies.js',
          rootDir + '/bower_components/angular-resource/angular-resource.js',
          rootDir + '/bower_components/angular-gettext/dist/angular-gettext.js',
          rootDir + '/bower_components/angular-audio/app/angular.audio.js',
          rootDir + '/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          rootDir + '/bower_components/jquery/dist/jquery.js',
          rootDir + '/bower_components/underscore/underscore.js',
          rootDir + '/bower_components/rangy/rangy-core.js',
          rootDir + '/bower_components/rangy/rangy-classapplier.js',
          rootDir + '/bower_components/rangy/rangy-highlighter.js',
          rootDir + '/bower_components/rangy/rangy-selectionsaverestore.js',
          rootDir + '/bower_components/rangy/rangy-serializer.js',
          rootDir + '/bower_components/rangy/rangy-textrange.js',
          rootDir + '/bower_components/angular-google-analytics/dist/angular-google-analytics.min.js',
          rootDir + '/bower_components/localforage/dist/localforage.js',
          rootDir + '/bower_components/angular-localforage/dist/angular-localForage.js',
          rootDir + '/bower_components/angular-md5/angular-md5.js',
          rootDir + '/bower_components/Hyphenator/Hyphenator.js',
          rootDir + '/bower_components/Hyphenator/patterns/fr.js',
          rootDir + '/bower_components/jszip/dist/jszip.js',
          rootDir + '/bower_components/pdfjs-dist/build/pdf.js',
          rootDir + '/bower_components/pdfjs-dist/build/pdf.worker.js',
          rootDir + '/bower_components/angular-socialshare/dist/angular-socialshare.min.js',
          rootDir + '/bower_components/angular-ui-router/release/angular-ui-router.js',
          rootDir + '/bower_components/slick-carousel/slick/slick.min.js',
          rootDir + '/bower_components/angular-slick/dist/slick.js',
          rootDir + '/bower_components/textAngular/dist/textAngular.js',
          rootDir + '/bower_components/textAngular/dist/textAngular-sanitize.js',
          rootDir + '/bower_components/textAngular/dist/textAngularSetup.js',
          rootDir + '/bower_components/docxtemplater/build/docxtemplater-latest.js',
          rootDir + '/bower_components/cropperjs/dist/cropper.js',
          rootDir + '/bower_components/matchmedia/matchMedia.js',
          rootDir + '/bower_components/ngSticky/lib/sticky.js',
          rootDir + '/bower_components/angular-cookie-law/dist/angular-cookie-law.min.js',
          rootDir + '/bower_components/components-font-awesome/fonts/fontawesome-webfont.woff2',
          rootDir + '/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
        ],
        stripPrefix: rootDir + '/',
        // verbose defaults to false, but for the purposes of this demo, log more.
        verbose: true
      };
      
      swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
    }
    
    grunt.registerMultiTask('swPrecache', function() {
      /* eslint-disable no-invalid-this */
      var done = this.async();
      var rootDir = this.data.rootDir;
      var handleFetch = this.data.handleFetch;
      /* eslint-enable */
      
      writeServiceWorkerFile(rootDir, handleFetch, function(error) {
        if (error) {
          grunt.fail.warn(error);
        }
        done();
      });
    });
};
