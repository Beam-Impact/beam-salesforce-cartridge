'use strict';

const server = require('./server/server');
server.middleware = require('./server/middleware');

module.exports = server;
