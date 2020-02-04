const realBrowser = process.env.TRAVIS;

module.exports = (config) => {
  config.set({
    frameworks: [ 'jasmine', 'karma-typescript' ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-typescript',
      'karma-spec-reporter'
    ],
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json",
      reports: {
          "html": "coverage",
          "json": {
              directory: "coverage",
              filename: "coverage.json"
          }
      }
    },

    client: {
      // leave Jasmine Spec Runner output visible in browser
      clearContext: false
    },
    files: [
        { pattern: '**/*.ts' },
        { pattern: 'database/**/*.test.ts' }
    ],
    preprocessors: {
      '**/*.ts': [ 'karma-typescript' ],
      'database/**/*.test.ts': [ 'karma-typescript' ]
    },
    reporters: [ 'spec', 'karma-typescript' ],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: realBrowser ? [ 'chrome_travis' ] : [ 'Chrome' ],
    singleRun: realBrowser ? true : false,
    customLaunchers: {
        chrome_travis: {
            base: 'Chrome',
            flags: [ '--no-sandbox' ]
        }
    }
  })
};
