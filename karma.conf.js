module.exports = function(config) {
  var configuration = {
    basePath: '',
    frameworks: ['jasmine', 'commonjs'],
    files: [
      'src/**/*.js',
      'spec/**/*.js'
    ],
    preprocessors: {
      'src/**/*.js': ['commonjs'],
      'spec/**/*.js': ['commonjs']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    browsers: ['Chrome'],
    concurrency: Infinity,

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};

