var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs-extra');
var assert = require('assert');
var path = require('path');

function DailyFileStream(options) {
    options = options || {};

    this.formatter = options.formatter;
    this.ext = options.ext || 'log';
    this.path = options.path;
	fs.ensureDirSync(this.path);

    this.prefix = options.prefix || '';

    this.lastDay = 0;
}

util.inherits(DailyFileStream, EventEmitter);

DailyFileStream.prototype._makeFilename = function (date) {
    var now = date || new Date();

    var m = now.getMonth() + 1, d = now.getDate();
    m = (m < 10 ? '0' : '') + m;
    d = (d < 10 ? '0' : '') + d;

    return path.join(this.path, this.prefix + now.getFullYear() + m + d + '.' + this.ext);
};

DailyFileStream.prototype.rotate = function rotate(date) {
    if (this.stream)
        this.stream.end();

    this.stream = fs.createWriteStream(this._makeFilename(date), { flags: 'a', encoding: 'utf8' });
    //TODO: nullify on end or close

    this.emit('drain');

    this.lastDay = date.getDate();
};

DailyFileStream.prototype.write = function write(s) {
    var d = new Date();
    if (d.getDate() != this.lastDay || !this.stream) {
        var newday = this.stream;
        this.rotate(d);
    }

    return this.stream.write(this.formatter ? this.formatter(s) : s);
};

DailyFileStream.prototype.end = function end(s) {
    this.stream.end();
};

DailyFileStream.prototype.destroy = function destroy(s) {
    this.stream.destroy();
};

DailyFileStream.prototype.destroySoon = function destroySoon(s) {
    this.stream.destroySoon();
};

module.exports.DailyFileStream = DailyFileStream;