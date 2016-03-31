/*eslint no-use-before-define: ["error", { "functions": false }]*/
'use strict';

/**
 * the product merchandizing model
 * @param {Object} obj -product Object.
 * @returns {Object} the product merchandizing model
 */
function productPricing(obj) {
    var priceModel = obj.getPriceModel();

    this.isPriceRange = priceModel.isPriceRange();
    this.decimalPrice = getDecimalPrice(priceModel);
    this.currency = getCurrency(priceModel);
    this.formattedPrice = getFormattedPrice(priceModel);
    this.salePrice = {};
    this.tierPricing = {};
}

/**
 * Retrieves a number representing the price of a product
 * @param {Object} priceModel - the price model of the product object
 * @returns {Number} a number representing the price of a product
 */
function getDecimalPrice(priceModel) {
    var price = priceModel.getPrice();

    return price.available ? price.getDecimalValue().get() : priceModel.getMinPrice().getDecimalValue().get();
}

/**
 * Retrieves a string representing the currency of a price
 * @param {Object} priceModel - the price model of the product object
 * @returns {String} a string representing the currency of a price
 */
function getCurrency(priceModel) {
    var price = priceModel.getPrice();

    return price.available ? price.getCurrencyCode() : priceModel.getMinPrice().getCurrencyCode();
}

// TODO: price range stuff
/**
 * Retrieves a string representing the price of a product
 * @param {Object} priceModel - the price model of the product object
 * @returns {String} a string representing the price of a product
 */
function getFormattedPrice(priceModel) {
    var price = priceModel.getPrice();

    return price.available ? price.toString() : priceModel.getMinPrice().toString();
}


module.exports = productPricing;
