'use strict';

var server = require('server');

var BasketMgr = require('dw/order/BasketMgr');
var Cart = require('~/cartridge/models/cart');
var HookMgr = require('dw/system/HookMgr');
var locale = require('~/cartridge/scripts/middleware/locale');
var ProductMgr = require('dw/catalog/ProductMgr');
var ShippingMgr = require('dw/order/ShippingMgr');
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');

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
        calculateCart(currentBasket);
    });

    var removeProductLineItemUrl = URLUtils.url('Cart-RemoveProductLineItem').toString();
    var updateQuantityUrl = URLUtils.url('Cart-UpdateQuantity').toString();
    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(currentBasket.defaultShipment);
    var basket = new Cart(
        currentBasket,
        shipmentShippingModel,
        removeProductLineItemUrl,
        updateQuantityUrl
    );

    res.render('cart', basket);
    next();
});

server.get('RemoveProductLineItem', categories, locale, function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var removeProductLineItemUrl = URLUtils.url('Cart-RemoveProductLineItem').toString();
    var updateQuantityUrl = URLUtils.url('Cart-UpdateQuantity').toString();

    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(currentBasket.defaultShipment);

    Transaction.wrap(function () {
        if (req.querystring.pid && req.querystring.uuid) {
            var productLineItems = currentBasket.getAllProductLineItems(req.querystring.pid);
            for (var i = 0; i < productLineItems.length; i++) {
                var item = productLineItems[i];
                if ((item.UUID === req.querystring.uuid)) {
                    currentBasket.removeProductLineItem(item);
                    break;
                }
            }
            calculateCart(currentBasket);
        }
    });

    var basket = new Cart(
        currentBasket,
        shipmentShippingModel,
        removeProductLineItemUrl,
        updateQuantityUrl
    );

    res.json(basket);
    next();
});

server.get('UpdateQuantity', categories, locale, function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var removeProductLineItemUrl = URLUtils.url('Cart-RemoveProductLineItem').toString();
    var updateQuantityUrl = URLUtils.url('Cart-UpdateQuantity').toString();

    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(currentBasket.defaultShipment);

    Transaction.wrap(function () {
        if (req.querystring.pid && req.querystring.uuid) {
            var productLineItems = currentBasket.getAllProductLineItems(req.querystring.pid);
            for (var i = 0; i < productLineItems.length; i++) {
                var item = productLineItems[i];
                if ((req.querystring.quantity && item.UUID === req.querystring.uuid)) {
                    item.setQuantityValue(req.querystring.quantity);
                    break;
                }
            }
            calculateCart(currentBasket);
        }
    });

    var basket = new Cart(
        currentBasket,
        shipmentShippingModel,
        removeProductLineItemUrl,
        updateQuantityUrl
    );

    res.json(basket);
    next();
});


module.exports = server.exports();
