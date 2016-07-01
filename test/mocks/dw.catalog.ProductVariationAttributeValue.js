'use strict';

var commonHelpers = require('./helpers/common');
var MockCollection = require('./dw.util.Collection');

function ProductVariationAttributeValue(args) {
    var defaults = {
        ID: '',
        description: '',
        value: '',
        displayValue: '',
        equals: commonHelpers.returnFalse,
        getImages: defaultGetImages
    };

    var getProvidedOrDefault = commonHelpers.getProvidedOrDefault;

    return {
        // properties
        ID: getProvidedOrDefault(args, defaults, 'ID'),
        description: getProvidedOrDefault(args, defaults, 'description'),
        value: getProvidedOrDefault(args, defaults, 'value'),
        displayValue: getProvidedOrDefault(args, defaults, 'displayValue'),
        // functions
        equals: getProvidedOrDefault(args, defaults, 'equals'),
        getImages: getProvidedOrDefault(args, defaults, 'getImages')
    };
}

function defaultGetImages() {
    return new MockCollection(commonHelpers.returnList());
}

module.exports = ProductVariationAttributeValue;
