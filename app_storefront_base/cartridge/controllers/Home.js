'use strict';

var server = require('server');
var locale = require('~/cartridge/scripts/middleware/locale');

server.get('Show', locale, function (req, res, next) {
    res.render('/home/homepage');
    next();
});

module.exports = server.exports();
