'use strict';

var commonHelpers = require('./helpers/common');
var MockCollection = require('./dw.util.Collection');

function defaultGetProductVariationAttributes() {
    return new MockCollection(commonHelpers.returnList);
}

function defaultGetAllValues() {
    return new MockCollection(commonHelpers.returnList());
}

function defaultGetImages(imageViewType) {
    var suffixAlt = ' alt';
    var suffixTitle = ' title';
    var suffixUrl = ' url';

    return new MockCollection([{
        alt: imageViewType + suffixAlt,
        title: imageViewType + suffixTitle,
        URL: {
            relative: function () {
                return {
                    toString: function () {
                        return imageViewType + suffixUrl;
                    }
                };
            }
        }
    }]);
}

function defaultGetDefaultVariant() {
    return {
        getVariationModel: function () {
            return new ProductVariationModel();
        }
    };
}

/**
 * Mock class for ProductVariationModel
 *
 * @param {Object} args - Map of properties and/or methods to be overridden from default values
 */
function ProductVariationModel(args) {
    var defaults = {
        // properties
        master: commonHelpers.returnFalse,
        variationGroup: commonHelpers.returnFalse,
        // methods
        getAllValues: defaultGetAllValues,
        getDefaultVariant: defaultGetDefaultVariant,
        getImages: defaultGetImages,
        getMaster: commonHelpers.returnObject,
        getProductVariationAttributes: defaultGetProductVariationAttributes,
        setSelectedAttributeValue: commonHelpers.returnObject,
        getSelectedValue: commonHelpers.returnNull,
        getSelectedVariant: commonHelpers.returnNull,
        hasOrderableVariants: commonHelpers.returnTrue,
        urlUnselectVariationValue: commonHelpers.returnString,
        urlSelectVariationValue: commonHelpers.returnString
    };

    var getProvidedOrDefault = commonHelpers.getProvidedOrDefault;

    return {
        // properties
        master: getProvidedOrDefault(args, defaults, 'master'),
        variationGroup: getProvidedOrDefault(args, defaults, 'variationGroup'),
        // methods
        getAllValues: getProvidedOrDefault(args, defaults, 'getAllValues'),
        getDefaultVariant: getProvidedOrDefault(args, defaults, 'getDefaultVariant'),
        getMaster: getProvidedOrDefault(args, defaults, 'getMaster'),
        getProductVariationAttributes: getProvidedOrDefault(args, defaults, 'getProductVariationAttributes'),
        getSelectedValue: getProvidedOrDefault(args, defaults, 'getSelectedValue'),
        setSelectedAttributeValue: getProvidedOrDefault(args, defaults, 'setSelectedAttributeValue'),
        getSelectedVariant: getProvidedOrDefault(args, defaults, 'getSelectedVariant'),
        getImages: getProvidedOrDefault(args, defaults, 'getImages'),
        hasOrderableVariants: getProvidedOrDefault(args, defaults, 'hasOrderableVariants'),
        urlSelectVariationValue: getProvidedOrDefault(args, defaults, 'urlSelectVariationValue'),
        urlUnselectVariationValue: getProvidedOrDefault(args, defaults, 'urlUnselectVariationValue')
    };
}

module.exports = ProductVariationModel;
