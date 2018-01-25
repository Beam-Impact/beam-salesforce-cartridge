'use strict';

var server = require('server');

server.get('Start', function (req, res, next) {
    var URLRedirectMgr = require('dw/web/URLRedirectMgr');

    var redirect = URLRedirectMgr.redirect;
    var location = redirect ? redirect.location : null;

    if (!location) {
        res.setStatus(404);
        res.render('error/notFound');
    } else {
        res.redirect(location);
    }

    next();
});

server.get('Hostname', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');

    var url = req.querystring.Location.stringValue;
    var hostRegExp = new RegExp('^https?://' + req.httpHost + '(?=/|$)');
    var location;

    if (!url || !hostRegExp.test(url)) {
        location = URLUtils.httpHome().toString();
    } else {
        location = url;
    }

    res.redirect(location);
    next();
});

module.exports = server.exports();
