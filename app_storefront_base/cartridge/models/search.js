'use strict';

var helper = require('~/cartridge/scripts/dwHelpers');
var Iterator = require('dw/util/Iterator');

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