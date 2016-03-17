'use strict';

var productPricing = function (obj) {
	var priceModel = obj.getPriceModel();

	this.isPriceRange = priceModel.isPriceRange();
	this.decimalPrice = getDecimalPrice(priceModel);
	this.currency = getCurrency(priceModel);
	this.formattedPrice = getFormattedPrice(priceModel);
	this.salePrice = {};
	this.tierPricing = {};
};

function getDecimalPrice(priceModel) {
	var price = priceModel.getPrice();

	return price.available ? price.getDecimalValue().get() : priceModel.getMinPrice().getDecimalValue().get();
}

function getCurrency(priceModel) {
	var price = priceModel.getPrice();

	return price.available ? price.getCurrencyCode() : priceModel.getMinPrice().getCurrencyCode();
}

// TODO: price range stuff
function getFormattedPrice(priceModel) {
	var price = priceModel.getPrice();

	return price.available ? price.toString() : priceModel.getMinPrice().toString();
}


module.exports = productPricing;