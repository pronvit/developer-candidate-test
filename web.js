var swig = require('swig-templates');

module.exports = function(CT) {
	var app = CT.app;

	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');

	swig.setDefaults({
	    cache: CT.devMode ? false : 'memory',
	    tagControls: ['<%', '%>']
	});

	app.get('/', function (req, res) {
	    res.render('index.html');
	});
};