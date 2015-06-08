// Karma configuration
// Generated on Mon Jun 08 2015 15:20:13 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../node_modules/angular/angular.js',
      '../node_modules/angular-mocks/angular-mocks.js',
      '../public/js/controllers/main.js',
      'unit/*Spec.js'
    ],

    port: 9876,

    autoWatch: false,

    browsers:['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
