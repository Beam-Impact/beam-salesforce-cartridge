'use strict';

var assert = require('chai').assert;
var Collection = require('../../../mocks/dw.util.Collection');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var util = require('../../../util');

var commonHelpers = require('../../../mocks/helpers/common');
var getMockMoney = require('../../../mocks/dw.value.Money');
var getMockProduct = require('../../../mocks/dw.catalog.Product');
var getMockProductPriceModel = require('../../../mocks/dw.catalog.ProductPriceModel');
var getMockProductPriceTable = require('../../../mocks/dw.catalog.ProductPriceTable');

var urlUtilsMock = require('../../../mocks/dw.web.URLUtils');

var createShipmentShippingModel = function () {
    return {
        applicableShippingMethods: util.toArrayList([
            {
                description: 'Order received within 7-10 business days',
                displayName: 'Ground',
                ID: '001',
                custom: {
                    estimatedArrivalTime: '7-10 Business Days'
                }
            }
        ]),
        getShippingCost: function () {
            return {
                amount: {
                    valueOrNull: 7.99
                }
            };
        }
    };
};

var createApiProductLineItem = function (product) {
    return util.toArrayList([{ // Product Line Items
        product: {
            bundle: product.isBundle,
            master: product.isMaster,
            productSet: product.isProductSet,
            variant: product.isVariant,
            priceModel: {
                price: {
                    value: product.unitPrice
                }
            },
            variationModel: {
                productVariationAttributes: util.toArrayList([
                    {
                        displayName: 'Color'
                    },
                    {
                        displayName: 'Size'
                    }
                ]),
                getSelectedValue: function (attribute) {
                    var result;
                    if (attribute.displayName === 'Color') {
                        result = {
                            displayValue: 'Grey Heather'
                        };
                    } else if (attribute.displayName === 'Size') {
                        result = {
                            displayValue: 'XL'
                        };
                    }
                    return result;
                },
                getMaster: function () {
                    return getMockProduct({
                        master: true,
                        getPriceModel: function () {
                            return getMockProductPriceModel({
                                getPriceTable: function () {
                                    return getMockProductPriceTable({
                                        getQuantities: function () {
                                            return {
                                                toArray: function () {
                                                    return [];
                                                }
                                            };
                                        }
                                    });
                                },
                                minPrice: getMockMoney({
                                    getDecimalValue: function () {
                                        return {
                                            get: function () {
                                                return product.unitPrice;
                                            }
                                        };
                                    },
                                    getCurrencyCode: function () {
                                        return 'USD';
                                    }
                                })
                            });
                        }
                    });
                }
            },
            availabilityModel: {
                availability: product.isAvailable,
                inventoryRecord: {
                    ATS: {
                        value: 15
                    }
                },
                isOrderable: function () {
                    return true;
                }
            },
            getImage: function () {
                return {
                    URL: {
                        toString: function () {
                            return '/on/demandware.static/-/Sites-apparel-catalog/default/' +
                                'dw824c6de7/images/small/PG.10217069.JJ908XX.PZ.jpg';
                        }
                    },
                    alt: 'Long Sleeve Embellished Boat Neck Top, Grey Heather, small',
                    title: 'Long Sleeve Embellished Boat Neck Top, Grey Heather'
                };
            }
        },
        quantity: {
            value: product.quantity
        },
        adjustedPrice: {
            value: product.adjustedPrice
        },
        productName: product.productName,
        bonusProductLineItem: product.isBonusProductLineItem,
        gift: product.isGift,
        categoryID: product.categoryID,
        productID: product.productID
    }]);
};

var createApiBasket = function (product) {
    var basket = {
        totalGrossPrice: {
            value: 302.32,
            currencyCode: 'USD'
        },
        totalTax: {
            value: 14.40,
            currencyCode: 'USD'
        },
        shippingTotalPrice: {
            value: 9.99,
            currencyCode: 'USD'
        },
        adjustedMerchandizeTotalPrice: {
            value: 9.99,
            currencyCode: 'USD'
        }
    };

    basket.allProductLineItems = createApiProductLineItem(product);

    basket.shipments = util.toArrayList([{}]);

    return basket;
};

describe('cart', function () {
    var Cart = null;
    var helper = proxyquire('../../../../app_storefront_base/cartridge/scripts/dwHelpers', {
        'dw/util/ArrayList': Collection
    });
    var mockProductPricingModel = proxyquire('../../../../app_storefront_base/cartridge/models/product/productPricingModel', {
        'dw/value/Money': commonHelpers.returnObject,
        'dw/util/StringUtils': {
            formatMoney: function () {
                return 'formattedMoney';
            }
        },
        'dw/campaign/Promotion': {
            PROMOTION_CLASS_PRODUCT: 'someClass'
        }
    });
    Cart = proxyquire('../../../../app_storefront_base/cartridge/models/cart', {
        '~/cartridge/scripts/dwHelpers': helper,
        'dw/web/URLUtils': urlUtilsMock,
        './product/productPricingModel': mockProductPricingModel,
        'dw/util/StringUtils': {
            formatMoney: function () {
                return 'formattedMoney';
            }
        },
        'dw/value/Money': getMockMoney
    });

    it('should accept/process a null Basket object', function () {
        var nullBasket = null;
        var result = new Cart(nullBasket);
        assert.equal(result.items.length, 0);
        assert.equal(result.numItems, 0);
    });

    it('should convert ProductLineItems to a plain object', function () {
        var simpleProduct = {
            unitPrice: 28.99,
            productVariationAttributes: ['Color, Size'],
            selectedValue: ['Grey Heather', 'XL'],
            isBundle: false,
            isMaster: false,
            isProductSet: false,
            isVariant: true,
            isBonusProductLineItem: false,
            isGift: false,
            quantity: 2,
            adjustedPrice: 57.98,
            productName: 'Long Sleeve Embellished Boat Neck Top',
            productID: '701642823940',
            categoryID: 'something',
            hasImage: true
        };

        var result = new Cart(createApiBasket(simpleProduct));
        assert.equal(result.items.length, 1);
        assert.equal(result.items[0].quantity, 2);
        assert.equal(result.items[0].priceModelPricing.value, 28.99);
        assert.equal(
            result.items[0].name,
            'Long Sleeve Embellished Boat Neck Top'
        );
        assert.isFalse(result.items[0].isBundle);
        assert.isFalse(result.items[0].isMaster);
        assert.isFalse(result.items[0].isProductSet);
        assert.isFalse(result.items[0].isBonusProductLineItem);
        assert.isFalse(result.items[0].isGift);
        assert.isTrue(result.items[0].isVariant);
        assert.equal(result.items[0].type, 'Product');
        assert.equal(result.items[0].variationAttributes.length, 2);
        assert.equal(result.items[0].variationAttributes[0].displayName, 'Color');
        assert.equal(result.items[0].variationAttributes[0].displayValue, 'Grey Heather');
        assert.equal(result.items[0].variationAttributes[1].displayName, 'Size');
        assert.equal(result.items[0].variationAttributes[1].displayValue, 'XL');
        assert.equal(
            result.items[0].image.alt,
            'Long Sleeve Embellished Boat Neck Top, Grey Heather, small'
        );
        assert.equal(
            result.items[0].image.title,
            'Long Sleeve Embellished Boat Neck Top, Grey Heather'
        );
    });

    it('should create product line item with no image', function () {
        var productNoImage = {
            unitPrice: 99.99,
            isBundle: false,
            isMaster: false,
            isProductSet: false,
            isVariant: false,
            isBonusProductLineItem: false,
            isGift: false,
            quantity: 1,
            adjustedPrice: 99.99,
            productName: 'Upright Case (33L - 3.7Kg)',
            productID: 'P0150'
        };

        var result = new Cart(createApiBasket(productNoImage));
        assert.equal(result.items.length, 1);
        assert.equal(result.items[0].quantity, 1);
        assert.equal(result.items[0].priceModelPricing.value, 99.99);
        assert.equal(
            result.items[0].name,
            'Upright Case (33L - 3.7Kg)'
        );
        assert.isFalse(result.items[0].isBundle);
        assert.isFalse(result.items[0].isMaster);
        assert.isFalse(result.items[0].isProductSet);
        assert.isFalse(result.items[0].isBonusProductLineItem);
        assert.isFalse(result.items[0].isGift);
        assert.isFalse(result.items[0].isVariant);
        assert.equal(result.items[0].type, 'Product');
        assert.equal(result.items[0].variationAttributes.length, 2);
        assert.equal(result.items[0].variationAttributes[0].displayName, 'Color');
        assert.equal(result.items[0].variationAttributes[0].displayValue, 'Grey Heather');
        assert.equal(result.items[0].variationAttributes[1].displayName, 'Size');
        assert.equal(result.items[0].variationAttributes[1].displayValue, 'XL');
        assert.equal(
            result.items[0].image.alt,
            'Upright Case (33L - 3.7Kg)'
        );
        assert.equal(
            result.items[0].image.title,
            'Upright Case (33L - 3.7Kg)'
        );
    });

    it('should get shippingMethods and convert to a plain object', function () {
        var simpleProduct = {
            unitPrice: 28.99,
            productVariationAttributes: ['Color, Size'],
            selectedValue: ['Grey Heather', 'XL'],
            isAvailable: 1,
            isBundle: false,
            isMaster: false,
            isProductSet: false,
            isVariant: true,
            isBonusProductLineItem: false,
            isGift: false,
            quantity: 2,
            adjustedPrice: 57.98,
            productName: 'Long Sleeve Embellished Boat Neck Top',
            productID: '701642823940',
            categoryID: 'something',
            hasImage: true
        };

        var result = new Cart(createApiBasket(simpleProduct), createShipmentShippingModel());
        assert.equal(result.shippingMethods.length, 1);
        assert.equal(
            result.shippingMethods[0].description,
            'Order received within 7-10 business days'
        );
        assert.equal(result.shippingMethods[0].displayName, 'Ground');
        assert.equal(result.shippingMethods[0].ID, '001');
        assert.equal(result.shippingMethods[0].estimatedArrivalTime, '7-10 Business Days');
    });
});
