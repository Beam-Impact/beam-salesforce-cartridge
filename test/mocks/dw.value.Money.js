'use strict';

var commonHelpers = require('./helpers/common');

function Money(args) {
    var defaults = {
        // properties
        available: commonHelpers.returnTrue,
        // methods
        getDecimalValue: commonHelpers.returnObject,
        getCurrencyCode: commonHelpers.returnString
    };

    var getProvidedOrDefault = commonHelpers.getProvidedOrDefault;

    return {
        // properties
        available: getProvidedOrDefault(args, defaults, 'available'),
        // methods
        getDecimalValue: getProvidedOrDefault(args, defaults, 'getDecimalValue'),
        getCurrencyCode: getProvidedOrDefault(args, defaults, 'getCurrencyCode')
    };
}

module.exports = Money;
