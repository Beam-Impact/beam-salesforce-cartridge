'use strict';

const logger = require('dw/system/Logger');
const server = require('server');
const ContentMgr = require('dw/content/ContentMgr');
const Content = require('~/cartridge/models/content');

server.get('Include', server.middleware.include, function (req, res, next) {
    const contentMgr = ContentMgr.getContent(req.querystring.cid);

    if (contentMgr) {
        const content = new Content(contentMgr);
        res.cacheExpiration(24);
        res.render(content.template, { content: content });
    } else {
        logger.warn('Content asset with ID {0} was included but not found', req.querystring.cid);
    }
    next();
});

module.exports = server.exports();
