var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		main: './src/app.js',
	},

	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},

	module: {
	    rules: [
			{
				test: /\.js/,
				include: path.resolve(__dirname, 'src'),
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
					{
						loader: 'eslint-loader',
						options: {
							configFile:'eslint.json',
						},
					},
				],
			},
  			{
				test: /\.css$/,
				use: [ { loader: 'style-loader' }, { loader: 'css-loader' }],
			},
		],
	},

	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	],
  
  	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};