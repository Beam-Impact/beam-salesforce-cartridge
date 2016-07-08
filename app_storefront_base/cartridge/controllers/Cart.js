'use strict';

var server = require('server');
var BasketMgr = require('dw/order/BasketMgr');
var Cart = require('~/cartridge/models/cart');

server.get('MiniCart', function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var basket = new Cart(currentBasket);
    res.render('/components/header/minicart', basket);
    next();
});

module.exports = server.exports();
