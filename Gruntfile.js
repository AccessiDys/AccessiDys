/* File: GruntFile.js
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

var path = require('path');

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: '.',
        dist: 'dist',
        generated: 'generated'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {}

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            main: {
                files: ['app/**/*.{html,css,png,jpeg,GIF,jpg,eot,svg,ttf,woff}'],
                tasks : ['generate-cache']
            },
            options: {
                livereload: true/*,
                 port: 3000,
                 key: grunt.file.read('../sslcert/key.pem'),
                 cert: grunt.file.read('../sslcert/cert.pem')*/
            }
        },
        express: {
            options: {
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    server: path.resolve('./app.js'),
                    livereload: true,
                    serverreload: false,
                    bases: [path.resolve('./.tmp'), path.resolve(__dirname, yeomanConfig.app)],
                    spawn: false
                }
            },
            test: {
                options: {
                    server: path.resolve('./app.js'),
                    bases: [path.resolve('./.tmp'), path.resolve(__dirname, 'test')]
                }
            },
            dist: {
                options: {
                    server: path.resolve('./app.js'),
                    bases: path.resolve(__dirname, yeomanConfig.dist)
                }
            },
            server: {
                options: {
                    port: 80
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= express.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '<%= yeoman.generated %>/*',
                        '!<%= yeoman.dist %>/.git*']
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: 'checkstyle',
                reporterOutput: 'generated/jshint/resultJSHint.xml'
            },
            all: {
                src: ['Gruntfile.js', 'app/scripts/**/*.js', 'api/**/*.js', 'test/spec/**/*.js']
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*']
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
        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of
            // minification. This option is pre-configured if you do not wish to use
            // Usemin blocks.
            // dist: {
            //   files: {
            //     '<%= yeoman.dist %>/styles/main.css': [
            //       '.tmp/styles/{,*/}*.css',
            //       '<%= yeoman.app %>/styles/{,*/}*.css'
            //     ]
            //   }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
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
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'app/**/*.{html,css,png,jpeg,GIF,jpg,eot,svg,ttf,woff,appcache,gif}',
                        'app/bower_components/**/*.js',
                        'app/bower_components/**/*.mem',
                        'app/bower_components/**/*.traineddata',
                        'app/scripts/**/*.js',
                        'app.js',
                        'app/viewsScripts/**/*.js',
                        'api/**/*',
                        'models/**/*',
                        'routes/**/*',
                        'custom_node_modules/**',
                        'Gruntfile.js',
                        'package.json',
                        'files/**/**/**',
                        'po/**',
                        'patches/**',
                        'env/generalParams.json']
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: ['../../env/config.<%= [NODE_ENV] %>.json'],
                    rename: function(dest) {
                        return dest + '/env/config.json';
                    }
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*']
                }]
            }
        },
        concurrent: {
            dist: [
                'imagemin',
                'svgmin']
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
        ngAnnotate : {
            dist : {
                files : [ {
                    expand : true,
                    cwd : 'app',
                    src : ['scripts/**/*.js', 'viewsScripts/*.js'],
                    dest: 'generated/'
                } ]
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
            dev: {
                src: '../../env/config.json'
            },
            test: {
                src: '../../env/config.test.json'
            },
            integ: {
                src: '../../env/config.integ.json'
            },
            recette: {
                src: '../../env/config.recette.json'
            },
            recettecned: {
                src: '../../env/config.recettecned.json'
            },
            prerecette: {
                src: '../../env/config.prerecette.json'
            },
            prod: {
                src: '../../env/config.prod.json'
            }
        },
        /**
         *  Generation des fichiers avec
         *  des liens absoluts selon l'environnement
         */
        template: {
            'generate-from-tpl': {
                options: {
                    data: {
                        'URL_REQUEST': '<%= [URL_REQUEST] %>',
                        'DROPBOX_TYPE': '<%= [DROPBOX_TYPE] %>',
                        'CATALOGUE_NAME':'<%= [CATALOGUE_NAME] %>'
                    }
                },
                files: {
                    './app/index.html': ['./app/index.html.tpl'],
                    './app/scripts/app.js': ['./app/scripts/app.js.tpl'],
                    './app/scripts/services/config.js': ['./app/scripts/services/config.js.tpl'],
                    './app/listDocument.appcache': ['./app/listDocument.appcache.tpl'],
                }
            },
            'replace-custom-node-modules': {
                files: {
                    './node_modules/passport-local/lib/passport-local/strategy.js': ['./custom_node_modules/passport-local/lib/passport-local/strategy.js']
                }
            }
        },
        removelogging: {
            dist: {
                src: ['api/**/*.js', 'app/scripts/**/*.js'],
                options: {
                    // see below for options. this is optional.
                }
            }
        }

    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'useminPrepare',
        'ngAnnotate',
        'uglify',
        'usemin']);

    grunt.registerTask('setEnv', function() {
        grunt.config('NODE_ENV', process.env.NODE_ENV);
        grunt.config('URL_REQUEST', process.env.URL_REQUEST);
        grunt.config('DROPBOX_TYPE', process.env.DROPBOX_TYPE);
        grunt.config('CATALOGUE_NAME',process.env.CATALOGUE_NAME);
        grunt.config('SSL_KEY',process.env.SSL_KEY);
        grunt.config('SSL_CERT',process.env.SSL_CERT);
        console.log('ENV = ' + process.env.NODE_ENV);
    });

    grunt.registerTask('build-dev', [
        'env:dev',
        'setEnv',
        'template:generate-from-tpl',
        'html2js:main',
        'build']);

    grunt.registerTask('build-integ', [
        'env:integ',
        'setEnv',
        'template:generate-from-tpl',
        'html2js:main',
        'build']);

    grunt.registerTask('build-prerecette', [
        'env:prerecette',
        'setEnv',
        'template:generate-from-tpl',
        'html2js:main',
        'build']);

    grunt.registerTask('build-recette', [
        'env:recette',
        'setEnv',
        'template:generate-from-tpl',
        'html2js:main',
        'build']);

    grunt.registerTask('build-recettecned', [
        'env:recettecned',
        'setEnv',
        'template:generate-from-tpl',
        'html2js:main',
        'build']);

    grunt.registerTask('build-prod', [
        'env:prod',
        'setEnv',
        'template:generate-from-tpl',
        'html2js:main',
        'build']);

    grunt.registerTask('server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'express:dist:keepalive']);
        }

        var env = grunt.file.readJSON('./env/config.json').NODE_ENV;
        if (env === 'dev') {
            grunt.task.run([
                'env:dev',
                'setEnv',
                'template:generate-from-tpl',
                'template:replace-custom-node-modules',
                'html2js:main',
                'clean:server',
                'express:livereload',
                'watch:main']);
            //'concurrent:server',
        } else {
            grunt.task.run([
                'template:replace-custom-node-modules',
                'html2js:main',
                'clean:server',
                //'concurrent:server',
                'express:livereload',
                'watch:main']);
        }
    });

    grunt.registerTask('generate-test', [
        'env:test',
        'setEnv',
        'template:generate-from-tpl',
        'template:replace-custom-node-modules',
        'html2js:main']);

    grunt.registerTask('test', [
        'env:test',
        'setEnv',
        'template:generate-from-tpl',
        'template:replace-custom-node-modules',
        'html2js:main',
        'clean:server',
        'express:test',
        'jshint:all',
        'karma']);
    
    grunt.registerTask('generate-cache', ['html2js:main']);

    grunt.registerTask('removeLogs', ['removelogging']);
};