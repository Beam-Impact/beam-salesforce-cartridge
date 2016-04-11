'use strict';

/**
 * @constructor
 * @classdesc Pricing model for a given product
 * @param {Object} product - API object for a product
 * @param {Object} promotions - API object for promotions for a current product
 * @param {Object} currency - Current session currencyCode
 * @param {Object} currentOptionModel - No idea what this is
 */
function productPricing(product, promotions, currency, currentOptionModel) {
    var priceModel = product.getPriceModel();

    var standardPrice = getStandardPrice();
    var promotionalPrice = getPromotionalPrice(); // TODO: promotions don't seem to work
    var rangePrice = getRangePrice();
    var tieredPrice = getTieredPrice();

    if (promotionalPrice && standardPrice) {
        return {
            type: 'promotion',
            standard: standardPrice,
            promo: promotionalPrice
        };
    }
    if (tieredPrice) {
        tieredPrice.type = 'tiered';
        return tieredPrice;
    }
    if (rangePrice && rangePrice.min.value !== rangePrice.max.value) {
        rangePrice.type = 'range';
        return rangePrice;
    }

    standardPrice.type = 'standard';
    return standardPrice;

    /**
     * Get standard price for a product
     * @returns {Object} price object
     * @private
     */
    function getStandardPrice() {
        if (promotions.length > 0) {
            var priceBook = getPriceBook(priceModel);
            if (priceModel.length > 0 && priceModel.getPrice().available) {
                var priceBookPrice = priceModel.getPriceBookPrice(priceBook.ID);
                if (priceBookPrice.available && priceBookPrice.getCurrency().getCurrencyCode() === standardPrice.getCurrency().getCurrencyCode()) {
                    return toPriceModel(priceBookPrice);
                }
            }
        }
        if (priceModel.getPrice().available) {
            return toPriceModel(priceModel.getPrice());
        } else {
            return toPriceModel(priceModel.minPrice);
        }
    }

    /**
     * Get promotional price for a product
     * @returns {Object} price object
     * @private
     */
    function getPromotionalPrice() {
        if (promotions.length > 0) {
            var promotionalPrice = null;
            promotions.toArray().forEach(function(promo) {
                if (promo.getPromotionClass() && promo.getPromotionClass().equals(dw.compaign.Promotion.PROMOTION_CLASS_PRODUCT)) {
                    if (product.optionProduct) {
                        promotionalPrice = promo.getPromotionalPrice(product, currentOptionModel ? currentOptionModel : product.getOptionModel); // TODO: remove usage of currentOptionModel
                    } else {
                        promotionalPrice = promo.getPromotionalPrice(product);
                    }
                }
            });

            if (promotionalPrice) {
                return toPriceModel(promotionalPrice);
            }
        }
        return null;
    }

    /**
     * Get range price for a product
     * @returns {Object} object with min and max pricing
     * @private
     */
    function getRangePrice() {
        if (product.master || product.variationGroup && priceModel.isPriceRange()) {
            return {
                min: toPriceModel(priceModel.minPrice),
                max: toPriceModel(priceModel.maxPrice)
            };
        }
    }

    /**
     * Get tiered price for a product
     * @returns {Object} object with keys containing quantity brakets and prices
     * @private
     */
    function getTieredPrice() {
        var priceTable = priceModel.getPriceTable();
        var basePriceQuantity = priceModel.getBasePriceQuantity();
        var tieredPricing = null;
        priceTable.getQuantities().toArray().forEach(function(quantity) {
            if (quantity.compareTo(basePriceQuantity) !== 0) {
                if (!tieredPricing) {
                    tieredPricing = {};
                }
                tieredPricing[quantity.getValue()] = toPriceModel(priceTable.getPrice(quantity));
            }
        });

        return tieredPricing;
    }
}

/**
 * Return correct price book for a given priceModel
 * @param {Object} priceModel - the price model of the product object
 * @returns {Object} priceBook of a given priceModel
 */
function getPriceBook(priceModel) {
    var priceBook = priceModel.priceInfo.priceBook;
    while (priceBook.parentPriceBook) {
        priceBook = priceBook.parentPriceBook ? priceBook.parentPriceBook : priceBook;
    }
    return priceBook;
}

/**
 * Convert API price to an object
 * @param {Object} price - Price object returned from the API
 * @returns {Object} price formatted as a simple object
 */
function toPriceModel(price) {
    var value = price.available ? price.getDecimalValue().get() : null;
    var currency = price.available ? price.getCurrencyCode() : null;

    return {
        value: value,
        currency: currency,
        formatted: dw.util.StringUtils.formatMoney(dw.value.Money(value, currency))
    };
}

module.exports = productPricing;
