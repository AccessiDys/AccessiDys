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
var wiredep = require('wiredep');

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            bower : {
                files : [ 'bower.json' ],
                tasks : [ 'bower_concat' ]
            },
            main: {
                files: ['app/**/*.{html,css,png,jpeg,GIF,jpg,eot,svg,ttf,woff}'],
                tasks: ['generate-cache', 'express:dev'],
            },
        },
        express: {
            dev: {
                options: {
                    script: 'app.js',
                }
            },
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
        karma: {
            unit: {
                configFile: 'karma.conf.js'
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
        //generate the service-worker.js for offine application 
        swPrecache: {
          dev: {
            handleFetch: false,
            rootDir: 'app'
          },
          prod: {
            handleFetch: true,
            rootDir: 'app'
          }
        },
        // Automatically inject Bower components into the app
        wiredep : {
            app : {
                src : [ 'app/index.html' ],
                ignorePath : /\.\.\//
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

    grunt.registerTask('setEnv', function () {
        grunt.config('NODE_ENV', process.env.NODE_ENV);
        grunt.config('URL_REQUEST', process.env.URL_REQUEST);
        grunt.config('DROPBOX_TYPE', process.env.DROPBOX_TYPE);
        grunt.config('CATALOGUE_NAME', process.env.CATALOGUE_NAME);
        grunt.config('SSL_KEY', process.env.SSL_KEY);
        grunt.config('SSL_CERT', process.env.SSL_CERT);
        console.log('ENV = ' + process.env.NODE_ENV);
    });

    grunt.registerTask('build-app', ['env:app','setEnv', 'html2js:main', 'wiredep','swPrecache:prod']);
    
    grunt.registerTask('server', ['env:app','setEnv', 'html2js:main', 'wiredep', ,'swPrecache:dev', 'express:dev', 'watch']);
    grunt.registerTask('serverWithCache', ['build-app','express:dev', 'watch']);

    grunt.registerTask('generate-test', ['env:test', 'setEnv', 'html2js:main']);

    grunt.registerTask('test', ['env:test', 'setEnv', 'html2js:main', 'clean:server',  'jshint:all', 'karma']);

    grunt.registerTask('generate-cache', ['html2js:main']);

    grunt.registerTask('removeLogs', ['removelogging']);
    
    function writeServiceWorkerFile(rootDir, handleFetch, callback) {
      var config = {
        cacheId: packageJson.name,
        handleFetch: handleFetch,
        maximumFileSizeToCacheInBytes : 5500000, // 5.5 MB
        ignoreUrlParametersMatching: [/v/], //because font-awesome js have ?v=x.x.x parameter added to request
        logger: grunt.log.writeln,
        staticFileGlobs:  Array.prototype.concat( [
          'app/*.html',
          'app/viewsScripts/*.js',
          'app/scripts/**/**.js',
          'app/styles/**/**',
          'app/external_components/**/**.js',
          'app/bower_components/components-font-awesome/fonts/fontawesome-webfont.woff2',
          'app/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
        ], getBowerRessourcesList()),
        // verbose defaults to false, but for the purposes of this demo, log more.
        verbose: false,
        stripPrefix: rootDir + '/',
      };
      swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
    }
    
    //use wiredep to get the list off resources to cache
    function getBowerRessourcesList(){
      var fullList = wiredep(
        {directory : 'app/bower_components',
      });
      var selectedRessourcesList = Array.prototype.concat( fullList.js , fullList.css );
      return selectedRessourcesList;
    };
    
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
