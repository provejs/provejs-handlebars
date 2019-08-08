'use strict';

module.exports = function(grunt) {

	grunt.config('eslint', {
		options: {
			rulePaths: ['./node_modules/@ravdocs/eslint/rules']
		},

		backend: {
			options: {
				configFile: './node_modules/@ravdocs/eslint/configs/backend.js'
			},
			src: [
				'*.js',
				'src/**/*.js',
				'grunts/**/*.js',
				'test/**/*.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-eslint');
};
