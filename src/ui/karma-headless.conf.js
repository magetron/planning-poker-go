// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-electron'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/ui'),
      reports: ['text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    
	browsers: ['HeadlessBrowser'],
	customLaunchers: {
		HeadlessBrowser: {
			base: 'Electron',
			flags: [
				'--no-sandbox'
			]
		}
	},
    singleRun: true,
    restartOnFileChange: true,
  });
};
