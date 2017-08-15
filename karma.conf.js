// Karma configuration
// Generated on Sat May 21 2016 14:35:48 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    urlRoot:'cffex-frame/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-cookies/angular-cookies.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/lodash/dist/lodash.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/ng-file-upload/ng-file-upload.min.js',
        'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
        'bower_components/angular-filter/dist/angular-filter.min.js',
        'bower_components/ngtoast/dist/ngToast.min.js',
        'bower_components/rangy/rangy-core.js',
        'bower_components/rangy/rangy-selectionsaverestore.min.js',
       // 'bower_components/textAngular/dist/textAngular-rangy.min.js',
        'bower_components/textAngular/dist/textAngular-sanitize.js',
        'bower_components/textAngular/dist/textAngular.min.js',
        'frameSrc/asset/datetimepicker/bootstrap-datetimepicker.js',
        'frameSrc/asset/jsxcompressor.min.js',
        'dist/frame/dep/angular-dialog-service/*.js',
        'dist/frame/dep/angular-bootstrap/*.js',
        'dist/frame/dep/angular-local-storage/*.js',
        'dist/frame/dep/angular-confirm-modal/*.js',
        'dist/frame/dep/angular-modal-service/*.js',

        'frameSrc/scripts/**/*.js',
        'dist/frame/frame-templates.js',
        'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'frameSrc/scripts/**/*.js': ['coverage']
    },


    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-junit-reporter'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'junit','coverage'],

    //junit-report output file
    junitReporter : {
      outputFile: 'test_out_unit.xml',
      suite: 'unit'
    },
    coverageReporter:{
      type:'html',
      dir:'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
