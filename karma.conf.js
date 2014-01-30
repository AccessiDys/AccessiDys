// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/ui.bootstrap/ui-bootstrap-tpls-0.9.0.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/ckeditor/ckeditor.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/spec/frontend/*.js',
      'app/scripts/services/helpers.js'],

    preprocessors: {
      'app/scripts/**/*.js': 'coverage',
      'app/scripts/*.js': 'coverage'
    },

    // list of files / patterns to exclude
    exclude: ['app/scripts/directives/**/*'],

    // web server port
    port: 9080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
    reporters: ['dots', 'junit', 'coverage'],
    junitReporter: {
      outputFile: 'generated/tests/test-results.xml'
    },
    coverageReporter: {
      type: 'cobertura',
      dir: 'generated/tests/coverage/',
      file: 'coverage.xml'
    }
  });
};