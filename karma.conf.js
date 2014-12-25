// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: './',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/viewsScripts/**/*.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-md5/angular-md5.min.js',
      'app/bower_components/angular-gettext/dist/angular-gettext.min.js',
      'app/bower_components/ui.bootstrap/ui-bootstrap-tpls-0.9.0.js',
      'app/bower_components/bindonce-master/bindonce.js',
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/jqueryUI/jquery-ui.js',
      'app/bower_components/jquery/jquery.line.js',
      'app/bower_components/sass-bootstrap/js/modal.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/ckeditor/ckeditor.js',
      'app/bower_components/jasmine-jquery/jasmine-jquery-1.3.1.js',
      'app/bower_components/pdfjs/pdf.js',
      'app/bower_components/pdfjs/pdf.worker.js',
      'app/bower_components/crypto/crypter.js',
      'app/bower_components/ngDialog-master/js/ngDialog.js',
      'app/scripts/**/*.js',
      'app/scripts/services/helpers.js',
      'test/spec/frontend/utils.js',
      'test/spec/frontend/*.js'],

    preprocessors: {
      'app/scripts/**/*.js': 'coverage',
      'app/scripts/app.js': 'coverage'
    },

    // list of files / patterns to exclude
    exclude: ['app/scripts/directives/**/*', 'app/scripts/translations.js'],

    reporters: ['coverage', 'dots', 'junit'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    junitReporter: {
      outputFile: 'generated/tests/test-results.xml'
    },

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
    // - Oper
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true

  });
};
