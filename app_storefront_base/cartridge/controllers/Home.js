'use strict';

const server = require('server');

server.get('IncludeHeaderCustomerInfo', function (req, res, next) {
    res.render('/components/header/myaccount', {});
    next();
});

module.exports = server.exports();
