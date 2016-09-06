'use strict';

var helper = require('~/cartridge/scripts/dwHelpers');

/**
 * Search class that represents product search
 * @param {dw.catalog.ProductSearchModel} productSearchModel - Current product search
 * @param {Object} req - local instance of request object
 * @constructor
 */
function search(productSearchModel, req) {
    var searchPhrase = req.querystring.q;

    productSearchModel.setSearchPhrase(searchPhrase);
    productSearchModel.search();

    this.products = productSearchModel.getProducts().asList();
    this.refinements = productSearchModel.getRefinements().getRefinementDefinitions();
    this.productIds = helper.pluck(this.products, 'ID');
    this.refinementNames = helper.pluck(this.refinements, 'displayName');
}

module.exports = search;
