'use strict';

var commonHelpers = require('./helpers/common');

function ProductAvailabilityModel(args) {
    var defaultMethods = { isOrderable: commonHelpers.returnTrue };

    var getProvidedOrDefault = commonHelpers.getProvidedOrDefault;

    return {
        isOrderable: getProvidedOrDefault(args, defaultMethods, 'isOrderable')
    };
}

module.exports = ProductAvailabilityModel;
