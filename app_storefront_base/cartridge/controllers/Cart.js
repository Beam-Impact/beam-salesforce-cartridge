'use strict';

const server = require('server');
const BasketMgr = require('dw/order/BasketMgr');
const Cart = require('~/cartridge/models/cart');

server.get('MiniCart', function (req, res, next) {
    const currentBasket = BasketMgr.getCurrentBasket();
    const basket = new Cart(currentBasket);
    res.render('/components/header/minicart', basket);
    next();
});

module.exports = server.exports();
