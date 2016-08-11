'use strict';

var commonHelpers = require('./helpers/common');

function ProductPriceModel(args) {
    var defaults = {
        // properties
        maxPrice: commonHelpers.returnObject(),
        minPrice: commonHelpers.returnObject(),
        priceInfo: commonHelpers.returnObject(),
        // methods
        getBasePriceQuantity: commonHelpers.returnString,
        getCurrencyCode: commonHelpers.returnString,
        getPrice: commonHelpers.returnObject,
        getPriceBookPrice: commonHelpers.returnObject,
        getPriceTable: commonHelpers.returnObject,
        isPriceRange: commonHelpers.returnFalse
    };

    var getProvidedOrDefault = commonHelpers.getProvidedOrDefault;

    return {
        // properties
        maxPrice: getProvidedOrDefault(args, defaults, 'maxPrice'),
        minPrice: getProvidedOrDefault(args, defaults, 'minPrice'),
        priceInfo: getProvidedOrDefault(args, defaults, 'priceInfo'),
        // methods
        getBasePriceQuantity: getProvidedOrDefault(args, defaults, 'getBasePriceQuantity'),
        getCurrencyCode: getProvidedOrDefault(args, defaults, 'getCurrencyCode'),
        getPrice: getProvidedOrDefault(args, defaults, 'getPrice'),
        getPriceBookPrice: getProvidedOrDefault(args, defaults, 'getPriceBookPrice'),
        getPriceTable: getProvidedOrDefault(args, defaults, 'getPriceTable'),
        isPriceRange: getProvidedOrDefault(args, defaults, 'isPriceRange')
    };
}

module.exports = ProductPriceModel;
