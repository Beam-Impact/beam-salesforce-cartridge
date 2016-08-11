'use strict';

var commonHelpers = require('./helpers/common');

function ProductPriceTable(args) {
    var defaults = {
        getPrice: commonHelpers.returnObject,
        getQuantities: commonHelpers.returnObject
    };

    var getProvidedOrDefault = commonHelpers.getProvidedOrDefault;

    return {
        getPrice: getProvidedOrDefault(args, defaults, 'getPrice'),
        getQuantities: getProvidedOrDefault(args, defaults, 'getQuantities')
    };
}

module.exports = ProductPriceTable;
