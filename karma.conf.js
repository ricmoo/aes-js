module.exports = function(config) {
  config.set({
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
    concurrency: Infinity
  });
};

