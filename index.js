var express = require('express');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
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

var CT = {
    app, log,
    db: null,

    devMode: process.argv.includes('--dev'),
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./static'));

CT.fetchPeople = function(filters, cb) {
    try {
        var query = {};

        CT.db.find(query, {}, function(err,docs) {
            console.log(err,docs);
            cb(err, docs)
        });        
    } catch (e) {
        cb(e);
    }
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
        require('./api')(CT);
        require('./web')(CT);
        next();
    },
    
    function(next) {
        app.listen(PORT, function(err) {
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
        log.error(err);
        process.exit(1);
    }

    log.info('startup done');
});
