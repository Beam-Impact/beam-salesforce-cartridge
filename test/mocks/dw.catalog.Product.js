'use strict';

var commonHelpers = require('./helpers/common');

function Product(args) {
    var defaults = {
        // properties
        ID: '',
        name: '',
        online: true,
        searchable: true,
        bundle: false,
        master: false,
        minOrderQuantity: 1,
        productSet: false,
        variant: false,
        variationGroup: false,
        variationModel: {},
        // methods
        getAvailabilityModel: commonHelpers.returnObject,
        getPriceModel: commonHelpers.returnObject,
        getVariationModel: commonHelpers.returnObject
    };

    var getProvidedOrDefault = commonHelpers.getProvidedOrDefault;

    return {
        // properties
        ID: getProvidedOrDefault(args, defaults, 'ID'),
        name: getProvidedOrDefault(args, defaults, 'name'),
        online: getProvidedOrDefault(args, defaults, 'online'),
        searchable: getProvidedOrDefault(args, defaults, 'searchable'),
        bundle: getProvidedOrDefault(args, defaults, 'bundle'),
        master: getProvidedOrDefault(args, defaults, 'master'),
        minOrderQuantity: getProvidedOrDefault(args, defaults, 'minOrderQuantity'),
        productSet: getProvidedOrDefault(args, defaults, 'productSet'),
        variant: getProvidedOrDefault(args, defaults, 'variant'),
        variationGroup: getProvidedOrDefault(args, defaults, 'variationGroup'),
        variationModel: getProvidedOrDefault(args, defaults, 'variationModel'),
        // methods
        getAvailabilityModel: getProvidedOrDefault(args, defaults, 'getAvailabilityModel'),
        getPriceModel: getProvidedOrDefault(args, defaults, 'getPriceModel'),
        getVariationModel: getProvidedOrDefault(args, defaults, 'getVariationModel')
    };
}

module.exports = Product;
