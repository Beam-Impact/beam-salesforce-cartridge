'use strict';

var ProductMgr = require('dw/catalog/ProductMgr');
var ProductModel = require('./../../models/product/Product');

/**
 * Factory utility that returns a ProductModel instance that encapsulates a Demandware Product
 * instance.
 */
function ProductFactory() {}

ProductFactory.get = function (params) {
    var productId = params.pid;
    var dwProduct = ProductMgr.getProduct(productId);

    var selectedVariationModel = ProductModel.updateVariationSelection({
        dwProduct: dwProduct,
        attrs: params.variables
    });

    var selectedVariant = selectedVariationModel.getSelectedVariant();

    if (selectedVariant) {
        dwProduct = selectedVariant;
    }

    var product = {};

    if (dwProduct.isVariant() || dwProduct.isMaster() || dwProduct.isVariationGroup()) {
        product = new ProductModel({
            dwProduct: dwProduct,
            params: params
        });
    } else if (dwProduct.isProductSet()) {
        // TODO: Add ProductSet factory
    } else if (dwProduct.isBundle()) {
        // TODO: Add ProductBundle factory
    } else {
        throw new TypeError('Invalid Product Type');
    }

    return product;
};

module.exports = ProductFactory;
