'use strict';

var server = require('server');

var BasketMgr = require('dw/order/BasketMgr');
var Cart = require('~/cartridge/models/cart');
var HookMgr = require('dw/system/HookMgr');
var locale = require('~/cartridge/scripts/middleware/locale');
var ProductMgr = require('dw/catalog/ProductMgr');
var ShippingMgr = require('dw/order/ShippingMgr');
var Transaction = require('dw/system/Transaction');

/**
 * performs cart calculation
 * @param {dw.order.Basket} basket - Current users's basket
 * @return {void}
 */
function calculateCart(basket) {
    HookMgr.callHook('dw.ocapi.shop.basket.calculate', 'calculate', basket);
}

server.get('MiniCart', server.middleware.include, function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var quantityTotal = Cart.getTotalQuantity(currentBasket.allProductLineItems);
    res.render('/components/header/minicart', { quantityTotal: quantityTotal });
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

    var quantityTotal = Cart.getTotalQuantity(dwBasket.allProductLineItems);

    res.json({ quantityTotal: quantityTotal });
    next();
});

server.get('Show', locale, function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentOrNewBasket();

    Transaction.wrap(function () {
        var productLineItem = currentBasket.createProductLineItem(
            '701642823940',
            currentBasket.defaultShipment
        );

        productLineItem.setQuantityValue(1);
        calculateCart(currentBasket);
    });

    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(currentBasket.defaultShipment);
    var basket = new Cart(currentBasket, shipmentShippingModel);
    res.render('cart', basket);
    next();
});

module.exports = server.exports();
