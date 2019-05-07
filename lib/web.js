module.exports = function(CT) {
	var app = CT.app;

	if (CT.devMode) {
		var webpack = require('webpack');
		var webpackDevMiddleware = require('webpack-dev-middleware');
		var config = require('../webpack.config.js');
		var compiler = webpack(config);

		app.use(webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }));
	} else 
		app.use(require('express').static('./dist'));
	
	app.use(require('express').static('./static'));

	app.get('/', function (req, res) {
		res.header('content-type', 'text/html');
	    require('fs').createReadStream('./dist/index.html').pipe(res);
	});
};