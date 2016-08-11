'use strict';

var server = require('server');
var BasketMgr = require('dw/order/BasketMgr');
var Cart = require('~/cartridge/models/cart');
var ProductMgr = require('dw/catalog/ProductMgr');
var Transaction = require('dw/system/Transaction');

server.get('MiniCart', function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var basket = new Cart(currentBasket);
    res.render('/components/header/minicart', basket);
    next();
});

// FIXME: This is just a temporary endpoint to add a simple variant from the Product Detail Page.
server.post('AddProduct', function (req, res, next) {
    var productId = req.querystring.pid;
    var quantity = parseInt(req.querystring.quantity, 10);
    var dwProduct = ProductMgr.getProduct(productId);
    var dwOptionModel = dwProduct.getOptionModel();
    var dwBasket = BasketMgr.getCurrentOrNewBasket();
    var dwShipment = dwBasket.getDefaultShipment();

    Transaction.begin();
    dwBasket.createProductLineItem(dwProduct, dwOptionModel, dwShipment)
        .setQuantityValue(quantity);
    Transaction.commit();

    var basket = new Cart(dwBasket);

    res.render('/components/header/minicart', basket);

    next();
});

module.exports = server.exports();
