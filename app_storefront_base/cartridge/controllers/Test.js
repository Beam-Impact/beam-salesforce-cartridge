'use strict';

const server = require('server');
const categories = require('~/cartridge/scripts/middleware/categories');
const locale = require('~/cartridge/scripts/middleware/locale');

server.get('Test', categories, locale, function (req, res, next) {
    res.render('test.isml', { CurrentPageMetaData: { title: 'Hello World!' } });
    next();
});

module.exports = server.exports();
