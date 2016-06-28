'use strict';

const helper = require('~/cartridge/scripts/dwHelpers');
const URLUtils = require('dw/web/URLUtils');

/**
 * Cart class that represents collection of line items
 * @param  {dw.order.Basket} basket Current uses's basket
 * @constructor
 */
function cart(basket) {
    if (basket !== null) {
        this.numItems = basket.productLineItems.length + basket.giftCertificateLineItems.length;
        const allItems = helper.concat(basket.productLineItems, basket.giftCertificate);
        this.totalPrice = 0;
        this.items = helper.map(allItems, function (item) {
            let result = {};
            if (item.product) {
                result = {
                    type: 'Product',
                    url: !item.categoryID
                        ? URLUtils.http('Product-Show', 'pid', item.productID)
                        : URLUtils.http(
                            'Product-Show',
                            'pid',
                            item.productID,
                            'cgid',
                            item.categoryID
                        ),
                    variationAttributes: null,
                    availability: null,
                    quantity: 0,
                    price: null
                };
                if (item.product.getImage('small', 0)) {
                    result.image = {
                        src: item.product.getImage('small', 0).getURL(),
                        alt: item.product.getImage('small', 0).getAlt(),
                        title: item.product.getImage('small', 0).getTitle()
                    };
                } else {
                    result.image = {
                        src: URLUtils.staticURL('/images/noimagesmall.png'),
                        alt: item.productName,
                        title: item.productName
                    };
                }
            } else {
                result = {
                    type: 'GiftCertificate',
                    name: item.lineItemText,
                    image: {
                        src: URLUtils.staticURL('/images/gift_cert.gif'),
                        alt: item.lineItemText
                    },
                    price: item.price
                };
            }
            return result;
        });
    } else {
        this.items = [];
        this.numItems = 0;
    }
}

module.exports = cart;
