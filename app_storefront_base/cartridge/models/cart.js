'use strict';

var helper = require('~/cartridge/scripts/dwHelpers');
var PricingModel = require('./product/productPricingModel');

var URLUtils = require('dw/web/URLUtils');
var formatMoney = require('dw/util/StringUtils').formatMoney;
var money = require('dw/value/Money');

/**
 * Creates an array of objects containing a product line item's selected variants
 * @param {dw.catalog.Product} product - the product that the line item represents
 * @returns {Object[]} an array of objects containing a product line item's selected variants
 */
function getSelectedVariationAttributes(product) {
    var variationAttributes = product.variationModel.productVariationAttributes;
    var selectedAttributes = helper.map(variationAttributes, function (attribute) {
        return {
            displayName: attribute.displayName,
            displayValue: product.variationModel.getSelectedValue(attribute).displayValue
        };
    });

    return selectedAttributes;
}

/**
 * Creates an array of numbers
 * @param {dw.order.ProductLineItem} productLineItem - a line item of the basket
 * @returns {Array} an array of numbers
 */
function getQuantityOptions(productLineItem) {
    var quantity = productLineItem.quantity.value;
    var availableToSell = productLineItem.product.availabilityModel.inventoryRecord.ATS.value;

    var min = Math.min(availableToSell, 10);
    var max = Math.max(min, quantity);
    return max;
}

/**
 * Creates an array of objects containing Product line item information
 * @param {dw.util.Collection <dw.order.ProductLineItem>} allLineItems - All product
 * line items of the basket
 * @returns {Array} an array of objects that contain information about each product line item.
 */
function createProductLineItemsObject(allLineItems) {
    var lineItems = helper.map(allLineItems, function (item) {
        var result = {
            type: 'Product',
            url: !item.categoryID
                ? URLUtils.http('Product-Show', 'pid', item.productID).toString()
                : URLUtils.http(
                    'Product-Show',
                    'pid',
                    item.productID,
                    'cgid',
                    item.categoryID
                ).toString(),
            variationAttributes: getSelectedVariationAttributes(item.product),
            quantity: item.quantity.value,
            quantityOptions: getQuantityOptions(item),
            priceModelPricing: new PricingModel(item.product, []),
            priceTotal: formatMoney(money(
                item.adjustedPrice.value,
                item.adjustedPrice.currencyCode
            )),
            name: item.productName,
            isBundle: item.product.bundle,
            isMaster: item.product.master,
            isProductSet: item.product.productSet,
            isVariant: item.product.variant,
            isBonusProductLineItem: item.bonusProductLineItem,
            isGift: item.gift,
            isOrderable: item.product.availabilityModel.isOrderable(item.quantity.value)
        };

        if (item.product.getImage('small', 0)) {
            result.image = {
                src: item.product.getImage('small', 0).URL.toString(),
                alt: item.product.getImage('small', 0).alt,
                title: item.product.getImage('small', 0).title
            };
        } else {
            result.image = {
                src: URLUtils.staticURL('/images/noimagesmall.png').toString(),
                alt: item.productName,
                title: item.productName
            };
        }
        return result;
    });

    return lineItems;
}

/**
 * Loops through all of the product line items and adds the quantities together.
 * @param {dw.util.Collection <dw.order.ProductLineItem>} productLineItems - All product
 * line items of the basket
 * @returns {Number} a number representing all product line items in the lineItem container.
 */
function getTotalQuantity(productLineItems) {
    // TODO add giftCertificateLineItems quantity
    var totalQuantity = 0;
    helper.forEach(productLineItems, function (lineItem) {
        totalQuantity += lineItem.quantity.value;
    });

    return totalQuantity;
}

/**
 * Creates an array of objects containing the information of applicable shipping methods
 * @param {dw.order.ShipmentShippingModel} shipmentModel - Instance of the shipping model
 * @returns {Array} an array of objects containing the information of applicable shipping methods
 */
function getApplicableShippingMethods(shipmentModel) {
    var shippingMedthods = shipmentModel.applicableShippingMethods;
    return helper.map(shippingMedthods, function (shippingMethod) {
        var shippingCost = shipmentModel.getShippingCost(shippingMethod);
        return {
            description: shippingMethod.description,
            displayName: shippingMethod.displayName,
            ID: shippingMethod.ID,
            shippingCost: formatMoney(money(
                shippingCost.amount.value,
                shippingCost.amount.currencyCode
            )),
            estimatedArrivalTime: shippingMethod.custom.estimatedArrivalTime
        };
    });
}

function cart(basket, shipmentShippingModel) {
    if (basket !== null) {
        this.items = createProductLineItemsObject(basket.allProductLineItems);
        this.numItems = getTotalQuantity(basket.allProductLineItems);
        this.numOfShipments = basket.shipments.length;
        if (shipmentShippingModel) {
            this.shippingMethods = getApplicableShippingMethods(shipmentShippingModel);
        }
        this.grandTotal = formatMoney(money(
            basket.totalGrossPrice.value,
            basket.totalGrossPrice.currencyCode
        ));
        this.subTotal = formatMoney(money(
            basket.adjustedMerchandizeTotalPrice.value,
            basket.adjustedMerchandizeTotalPrice.currencyCode
        ));
        this.totalTax = formatMoney(money(
            basket.totalTax.value,
            basket.totalTax.currencyCode
        ));
        this.totalShippingCost = formatMoney(money(
            basket.shippingTotalPrice.value,
            basket.shippingTotalPrice.currencyCode
        ));
    } else {
        this.items = [];
        this.numItems = 0;
    }
}

cart.getTotalQuantity = getTotalQuantity;

module.exports = cart;
