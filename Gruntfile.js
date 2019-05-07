module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var pkg = grunt.file.readJSON('package.json');

	require('load-grunt-tasks')(grunt);
	 
	grunt.initConfig({
	    eslint: {
	        target: ['lib/**/*.js', 'src/**/*.js'],
			options: {
	            configFile: 'eslint.json',
	        },
	    },

	    webpack: {
	    	prod: require('./webpack.config.js'),
	    }
	});
	 
	grunt.registerTask('default', ['eslint', 'webpack']);    
};
