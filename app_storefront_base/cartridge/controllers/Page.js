'use strict';

var logger = require('dw/system/Logger');
var server = require('server');
var ContentMgr = require('dw/content/ContentMgr');
var Content = require('~/cartridge/models/content');

server.get('Include', server.middleware.include, function (req, res, next) {
    var contentMgr = ContentMgr.getContent(req.querystring.cid);

    if (contentMgr) {
        var content = new Content(contentMgr);
        res.cacheExpiration(24);
        res.render(content.template, { content: content });
    } else {
        logger.warn('Content asset with ID {0} was included but not found', req.querystring.cid);
    }
    next();
});

module.exports = server.exports();
