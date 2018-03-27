'use strict';

module.exports = function(grunt) {

	grunt.config('eslint', {
		options: {
			rulePaths: ['./node_modules/@esscorp/eslint/rules']
		},

		backend: {
			options: {
				configFile: './node_modules/@esscorp/eslint/configs/backend.js'
			},
			src: [
				'*.js',
				'grunts/**/*.js',
				'controllers/**/*.js',
				'config/**/*.js',
				'dbs/**/*.js',
				'logger/**/*.js',
				'models/**/*.js',
				'hbs/**/*.js',
				'middlewares/**/*.js',
				'views/helpers/**/*.js',
				'validators/**/*.js',
				'!models/dox/fixes/logic.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-eslint');
};
