'use strict';

var server = require('server');
var categories = require('~/cartridge/scripts/middleware/categories');
var locale = require('~/cartridge/scripts/middleware/locale');

server.get('Test', categories, locale, function (req, res, next) {
    res.render('test.isml', { CurrentPageMetaData: { title: 'Hello World!' } });
    next();
});

module.exports = server.exports();
