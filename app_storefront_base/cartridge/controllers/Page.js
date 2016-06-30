'use strict';

const logger = require('dw/system/Logger');
const server = require('server');
const ContentMgr = require('dw/content/ContentMgr');

server.get('Include', server.middleware.include, function (req, res, next) {
    const content = ContentMgr.getContent(req.querystring.cid);

    if (content) {
        res.render(content.template || 'components/content/contentassetinc', {
            content: content.custom ? content.custom.body : null
        });
    } else {
        logger.warn('Content asset with ID {0} was included but not found', req.querystring.cid);
    }
    next();
});

module.exports = server.exports();
