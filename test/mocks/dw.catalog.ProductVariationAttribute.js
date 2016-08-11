'use strict';

var commonHelpers = require('./helpers/common');

function ProductVariationAttribute(args) {
    var defaults = {
        ID: '',
        attributeID: '',
        displayName: ''
    };

    var getProvidedOrDefault = commonHelpers.getProvidedOrDefault;

    return {
        ID: getProvidedOrDefault(args, defaults, 'ID'),
        attributeID: getProvidedOrDefault(args, defaults, 'attributeID'),
        displayName: getProvidedOrDefault(args, defaults, 'displayName')
    };
}

module.exports = ProductVariationAttribute;
