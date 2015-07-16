module.exports = function(config){
  config.set({

    basePath : './',
    preprocessors: {
      'app/javascripts/**/*.js': ['babel'],
      'app/javascripts/*.js': ['babel']
    },
    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-new-router/dist/router.es5.js',
      'bower_components/angular-indexed-db/angular-indexed-db.js',
      'bower_components/angular-ui-codemirror/ui-codemirror.js',
      'bower_components/lodash/lodash.js',
      'bower_components/lodash-mix/index.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/javascripts/*.js',
      'app/javascripts/**/*.js',
      'test/specs/**/*.js'
    ],
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-babel-preprocessor'
    ]
  });
};
