var express = require('express');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var morgan = require('morgan');
var async = require('async');
var Datastore = require('nedb');
var DailyFileStream = require('./log-daily').DailyFileStream;
var fs = require('fs');

var PORT    = process.env.PORT    || 3000;
var LOGPATH = process.env.LOGPATH || './logs';

var log = bunyan.createLogger({
    src: false,
    name: 'core',
    level: 'debug',
});
log.addStream({ stream:new DailyFileStream({ path:LOGPATH }), level:'debug' });

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan({ stream: new DailyFileStream({ path:LOGPATH, prefix: 'HTTP_' }) }));

var CT = {
    app, log,
    db: null,

    devMode: process.argv.includes('--dev'),
};

log.info('starting');

async.series([
    function(next) {
        CT.db = new Datastore({ filename: 'db.json' });
        CT.db.loadDatabase(function (err) {
            next(err);
        });
    },

    function(next) {
        require('./access')(CT);
        require('./api')(CT);
        require('./web')(CT);
        next();
    },
    
    function(next) {
        var server = require('http').createServer(app);
        server.on('error', function(err) {
            CT.log.fatal(err, 'HTTPS server error');
            if (err.code == 'EADDRINUSE')
                process.exit(1);
        });

        server.listen(PORT, function(err) {
            if (err) {
                next(err);
                return;
            }

            log.info('listening on port', PORT);
            next();
        });
    },

], function(err) {
    if (err) {
        log.error(err, 'failed to start');
        process.exit(1);
    }

    log.info('startup done');
});
