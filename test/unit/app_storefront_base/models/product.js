'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var commonHelpers = require('../../../mocks/helpers/common');

// Capitalized because it must be instantiated with 'new'
var MockCollection = require('../../../mocks/dw.util.Collection');

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
var mockDwHelpers = proxyquire('../../../../app_storefront_base/cartridge/scripts/dwHelpers', {
    // We use the Collection mock because the intent of many of the dwHelpers methods is to
    // aid in the use of Collection subclass instances
    'dw/util/ArrayList': MockCollection
});
var Product = proxyquire('../../../../app_storefront_base/cartridge/models/product/Product', {
    './productPricingModel': mockProductPricingModel,
    '../../scripts/dwHelpers': mockDwHelpers
});
var getMockMoney = require('../../../mocks/dw.value.Money');
var getMockProduct = require('../../../mocks/dw.catalog.Product');
var getMockProductAvailabilityModel = require('../../../mocks/dw.catalog.ProductAvailabilityModel');
var getMockProductPriceModel = require('../../../mocks/dw.catalog.ProductPriceModel');
var getMockProductPriceTable = require('../../../mocks/dw.catalog.ProductPriceTable');
var getMockProductVariationModel = require('../../../mocks/dw.catalog.ProductVariationModel');
var getMockProductVariationAttribute = require('../../../mocks/dw.catalog.ProductVariationAttribute');
var getMockProductVariationAttributeValue = require('../../../mocks/dw.catalog.ProductVariationAttributeValue');

describe('Product model', function () {
    var productId = 'product123';
    var productName = 'Product 123';

    function mockGetAllValuesOverride() {
        return new MockCollection([getMockProductVariationAttributeValue({
            ID: 'color',
            attributeID: 'color',
            value: 'red',
            displayValue: 'Red'
        })]);
    }

    function mockGetProductVariationAttributesOverride() {
        return new MockCollection([getMockProductVariationAttribute({
            attributeID: 'color',
            ID: 'color',
            displayName: 'Color'
        })]);
    }

    function mockGetPriceModel() {
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
            maxPrice: getMockMoney({
                getDecimalValue: function () {
                    return {
                        get: function () {
                            return 10;
                        }
                    };
                },
                getCurrencyCode: function () {
                    return 'XYZ';
                }
            }),
            minPrice: getMockMoney({
                getDecimalValue: function () {
                    return {
                        get: function () {
                            return 5;
                        }
                    };
                },
                getCurrencyCode: function () {
                    return 'XYZ';
                }
            }),
            priceInfo: {
                priceBook: {
                    parentPriceBook: {}
                }
            }
        });
    }

    describe('.getIsAvailable()', function () {
        var params = {
            pid: productId,
            variables: {
                color: {
                    ID: 'color',
                    attributeID: 'color',
                    value: 'red',
                    displayValue: 'Red'
                }
            }
        };

        var mockDwProductIsAvailable = getMockProduct({
            ID: productId,
            name: productName,
            master: true,
            variationModel: getMockProductVariationModel({
                getMaster: function () {
                    return getMockProduct({
                        master: true,
                        getPriceModel: mockGetPriceModel
                    });
                }
            }),
            getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
            getPriceModel: mockGetPriceModel,
            getVariationModel: function () {
                return getMockProductVariationModel({
                    getProductVariationAttributes: mockGetProductVariationAttributesOverride,
                    getAllValues: mockGetAllValuesOverride
                });
            },
            getDefaultVariant: function () {
                return {
                    getVariationModel: function () {
                        return getMockProductVariationModel({
                            getProductVariationAttributes: mockGetProductVariationAttributesOverride
                        });
                    }
                };
            }
        });

        var isOrderableStub = sinon.stub();
        isOrderableStub.returns(false);

        var mockAvailabilityModelNotAvailable = function () {
            return {
                isOrderable: isOrderableStub
            };
        };

        var mockDwProductNotAvailable = getMockProduct({
            getAvailabilityModel: mockAvailabilityModelNotAvailable,
            ID: productId,
            name: productName,
            master: true,
            variationModel: getMockProductVariationModel({
                getMaster: function () {
                    return getMockProduct({
                        master: true,
                        getPriceModel: mockGetPriceModel
                    });
                }
            }),
            getPriceModel: mockGetPriceModel,
            getVariationModel: function () {
                return getMockProductVariationModel({
                    getProductVariationAttributes: mockGetProductVariationAttributesOverride,
                    getAllValues: mockGetAllValuesOverride
                });
            }
        });

        var productAvailable = new Product({
            dwProduct: mockDwProductIsAvailable,
            params: params
        });

        var productNotAvailable = new Product({
            dwProduct: mockDwProductNotAvailable,
            params: params
        });

        it('should return true if available', function () {
            assert.isTrue(productAvailable.isAvailable);
        });

        it('should return false if not available', function () {
            assert.isFalse(productNotAvailable.isAvailable);
        });

        it('should call availabilityModel.isOrderable() with 1 if no quantity in params', function () {
            assert.isTrue(isOrderableStub.calledWith(1));
        });

        it('should call availabilityModel.isOrderable() with specified quantity in params', function () {
            params.quantity = 3;

            var mockAvailabilityModel = function () {
                return {
                    isOrderable: isOrderableStub
                };
            };
            var mockDwProduct = getMockProduct({
                ID: productId,
                name: productName,
                master: true,
                variationModel: getMockProductVariationModel({
                    getMaster: function () {
                        return getMockProduct({
                            master: true,
                            getPriceModel: mockGetPriceModel
                        });
                    }
                }),
                getAvailabilityModel: mockAvailabilityModel,
                getPriceModel: mockGetPriceModel,
                getVariationModel: function () {
                    return getMockProductVariationModel({
                        getProductVariationAttributes: mockGetProductVariationAttributesOverride,
                        getAllValues: mockGetAllValuesOverride
                    });
                }
            });

            new Product({
                dwProduct: mockDwProduct,
                params: params
            });

            assert.isTrue(isOrderableStub.calledWith(params.quantity));
        });
    });

    describe('.hasRequiredAttrsSelected()', function () {
        var params = {
            pid: productId,
            variables: {
                color: {
                    ID: 'color',
                    attributeID: 'color',
                    value: 'red',
                    displayValue: 'Red'
                }
            }
        };

        it('should return true when selectedVariant is populated in the ProductVariationModel', function () {
            var mockDwProduct = getMockProduct({
                ID: productId,
                name: productName,
                master: true,
                variationModel: getMockProductVariationModel({
                    getMaster: function () {
                        return getMockProduct({
                            master: true,
                            getPriceModel: mockGetPriceModel
                        });
                    }
                }),
                getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
                getPriceModel: mockGetPriceModel,
                getVariationModel: function () {
                    return getMockProductVariationModel({
                        getProductVariationAttributes: mockGetProductVariationAttributesOverride,
                        getAllValues: mockGetAllValuesOverride,
                        getSelectedVariant: function () {
                            return getMockProduct({
                                getVariationModel: function () {
                                    return getMockProductVariationModel({
                                        getProductVariationAttributes: mockGetProductVariationAttributesOverride
                                    });
                                }
                            });
                        }
                    });
                }
            });

            var product = new Product({
                dwProduct: mockDwProduct,
                params: params
            });

            assert.isTrue(product.hasRequiredAttrsSelected);
        });

        it('should return false when selectedVariant is undefined in the ProductVariationModel', function () {
            var mockVariationModel = getMockProductVariationModel({
                getSelectedVariant: commonHelpers.returnNull
            });

            var mockDwProduct = getMockProduct({
                ID: productId,
                name: productName,
                master: true,
                variationModel: getMockProductVariationModel({
                    getMaster: function () {
                        return getMockProduct({
                            master: true,
                            getPriceModel: mockGetPriceModel
                        });
                    }
                }),
                getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
                getPriceModel: mockGetPriceModel,
                getVariationModel: function () { return mockVariationModel; }
            });

            params = { pid: productId };
            var product = new Product({
                dwProduct: mockDwProduct,
                params: params
            });

            assert.isFalse(product.hasRequiredAttrsSelected);
        });
    });

    describe('.getAttrs()', function () {
        var mockDwProduct = getMockProduct({
            ID: productId,
            name: productName,
            master: true,
            variationModel: getMockProductVariationModel({
                getMaster: function () {
                    return getMockProduct({
                        master: true,
                        getPriceModel: mockGetPriceModel
                    });
                }
            }),
            getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
            getPriceModel: mockGetPriceModel,
            getVariationModel: function () {
                return getMockProductVariationModel({
                    getAllValues: mockGetAllValuesOverride,
                    getProductVariationAttributes: mockGetProductVariationAttributesOverride,
                    getSelectedVariant: function () {
                        return getMockProduct({
                            getVariationModel: function () {
                                return getMockProductVariationModel({
                                    getProductVariationAttributes: mockGetProductVariationAttributesOverride
                                });
                            }
                        });
                    }
                });
            }
        });

        var params = {
            pid: productId,
            variables: {
                color: {
                    ID: 'color',
                    attributeID: 'color',
                    value: 'red',
                    displayValue: 'red'
                }
            }
        };

        var product = new Product({
            dwProduct: mockDwProduct,
            params: params
        });

        it('should attach a list of properties to the product', function () {
            assert.isAtLeast(1, product.attributes.length);
        });
    });

    describe('.getAllAttrValues()', function () {
        var variationAttrId = 'someAttrId';
        var swatchableVariationAttrId = 'color';

        var variationAttr = getMockProductVariationAttribute({
            ID: variationAttrId,
            attributeID: variationAttrId,
            displayName: 'Some Attr'
        });
        var swatchableAttr = getMockProductVariationAttribute({
            ID: swatchableVariationAttrId,
            attributeID: swatchableVariationAttrId,
            displayName: 'Color'
        });


        var selectedAttrValue = getMockProductVariationAttributeValue({
            ID: 'selectedAttrValueID',
            description: 'Some Selected Value Description',
            value: 'someSelectedValue',
            displayValue: 'Some Selected Value'
        });

        var unSelectedAttrValue = getMockProductVariationAttributeValue({
            ID: 'unselectedAttrValueID',
            description: 'Some Unselected Value Description',
            value: 'someUnselectedValue',
            displayValue: 'Some Unselected Value'
        });

        var swatchableSelectedAttrValue = getMockProductVariationAttributeValue({
            ID: 'swatchableSelectedAttrValueID',
            description: 'Red Variant',
            value: 'red',
            displayValue: 'Red'
        });

        sinon.stub(selectedAttrValue, 'equals', function (dwValue) {
            return selectedAttrValue.ID === dwValue.ID;
        });

        var params = {
            pid: productId,
            variables: {}
        };

        params.variables[variationAttrId] = {
            ID: selectedAttrValue.ID,
            attributeID: selectedAttrValue.attributeID,
            value: selectedAttrValue.value,
            displayValue: selectedAttrValue.display
        };
        params.variables.color = {
            ID: 'color',
            attributeID: 'color',
            value: 'red',
            displayValue: 'red'
        };

        var selectUrl = 'http://some.select.url';
        var unselectUrl = 'http://some.unselect.url';

        var mockDwProduct = getMockProduct({
            ID: productId,
            name: productName,
            master: true,
            variationModel: getMockProductVariationModel({
                getMaster: function () {
                    return getMockProduct({
                        master: true,
                        getPriceModel: mockGetPriceModel
                    });
                }
            }),
            getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
            getPriceModel: mockGetPriceModel,
            getVariationModel: function () {
                return getMockProductVariationModel({
                    getAllValues: function (dwAttr) {
                        var attrValues = [];

                        if (dwAttr.attributeID === variationAttr.attributeID) {
                            attrValues = [selectedAttrValue, unSelectedAttrValue];
                        } else if (dwAttr.attributeID === swatchableAttr.attributeID) {
                            attrValues = [swatchableSelectedAttrValue];
                        }

                        return new MockCollection(attrValues);
                    },
                    getProductVariationAttributes: function () {
                        return new MockCollection([variationAttr, swatchableAttr]);
                    },
                    getSelectedValue: function () {
                        return selectedAttrValue;
                    },
                    getSelectedVariant: function () {
                        return getMockProduct({
                            getVariationModel: function () {
                                return getMockProductVariationModel({
                                    getProductVariationAttributes: function () {
                                        return new MockCollection([variationAttr, swatchableAttr]);
                                    }
                                });
                            }
                        });
                    },
                    urlSelectVariationValue: function () { return selectUrl; },
                    urlUnselectVariationValue: function () { return unselectUrl; }
                });
            }
        });

        var product = new Product({
            dwProduct: mockDwProduct,
            params: params
        });

        var productSelectedAttrValue = product.attributes[0].values[0];
        var productUnselectedAttrValue = product.attributes[0].values[1];
        var productSwatchableAttrValue = product.attributes[1].values[0];

        it('should set a selected attribute value\'s "isSelected" flag to true', function () {
            assert.equal(productSelectedAttrValue.id, selectedAttrValue.ID);
            assert.isTrue(productSelectedAttrValue.isSelected);
        });

        it('should set an unselected attribute value\'s "isSelected" flag to false', function () {
            assert.equal(productUnselectedAttrValue.id, unSelectedAttrValue.ID);
            assert.isFalse(productUnselectedAttrValue.isSelected);
        });

        it('should call urlUnselectVariationValue for an selected attr value', function () {
            assert.equal(productSelectedAttrValue.url, unselectUrl);
        });

        it('should call urlSelectVariationValue for an unselected attr value', function () {
            assert.equal(productUnselectedAttrValue.url, selectUrl);
        });

        it('should attach a swatchable attribute value\'s images', function () {
            assert.isTrue(productSwatchableAttrValue.hasOwnProperty.call(productSwatchableAttrValue,
                'images'));
            assert.isAbove(Object.keys(productSwatchableAttrValue.images).length, 0);
        });

        it('should not attach images to a non-swatchable attribute value', function () {
            assert.isFalse(productSelectedAttrValue.hasOwnProperty.call(productSelectedAttrValue,
                'images'));
        });
    });

    describe('.getImages()', function () {
        var suffixAlt = ' alt';
        var suffixTitle = ' title';
        var suffixUrl = ' url';

        var mockVariationModel = getMockProductVariationModel({
            getImages: function (imageViewType) {
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
            },
            getProductVariationAttributes: mockGetProductVariationAttributesOverride,
            getAllValues: mockGetAllValuesOverride
        });

        var mockDwProduct = getMockProduct({
            ID: productId,
            name: productName,
            master: true,
            variationModel: getMockProductVariationModel({
                getMaster: function () {
                    return getMockProduct({
                        master: true,
                        getPriceModel: mockGetPriceModel
                    });
                }
            }),
            getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
            getPriceModel: mockGetPriceModel,
            getVariationModel: function () { return mockVariationModel; }
        });

        var params = {
            pid: productId,
            variables: {
                color: {
                    ID: 'color',
                    attributeID: 'color',
                    value: 'red',
                    displayValue: 'red'
                }
            }
        };

        var product = new Product({
            dwProduct: mockDwProduct,
            params: params
        });

        it('should retrieve the images for a product', function () {
            var images = product.images;

            Object.keys(images).forEach(function (imageViewType) {
                var image = images[imageViewType];
                assert.isTrue(image[0].alt.endsWith(suffixAlt));
                assert.isTrue(image[0].title.endsWith(suffixTitle));
                assert.isTrue(image[0].url.endsWith(suffixUrl));
            });
        });
    });

    describe('.isSwatchable()', function () {
        var mockGetDefaultVariant = function () {
            return {
                getVariationModel: function () {
                    return getMockProductVariationModel({
                        getProductVariationAttributes: mockGetProductVariationAttributesOverride
                    });
                }
            };
        };

        var mockDwProduct = getMockProduct({
            ID: productId,
            name: productName,
            master: true,
            variationModel: getMockProductVariationModel({
                getMaster: function () {
                    return getMockProduct({
                        master: true,
                        getPriceModel: mockGetPriceModel
                    });
                }
            }),
            getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
            getPriceModel: mockGetPriceModel,
            getVariationModel: function () {
                return getMockProductVariationModel({
                    getProductVariationAttributes: mockGetProductVariationAttributesOverride,
                    getAllValues: mockGetAllValuesOverride,
                    getDefaultVariant: mockGetDefaultVariant
                });
            }
        });

        var params = {
            pid: productId,
            variables: {
                color: {
                    ID: 'color',
                    attributeID: 'color',
                    value: 'red',
                    displayValue: 'red'
                }
            }
        };

        var product = new Product({
            dwProduct: mockDwProduct,
            params: params
        });

        it('should return true if an attribute has image swatches', function () {
            // Currently, the only attribute that has image swatches is 'color'
            var swatchableAttr = product.attributes[0];
            assert.isTrue(swatchableAttr.isSwatchable);
            assert.equal(swatchableAttr.attributeID, 'color');
        });

        it('should return false if an attribute does not have image swatches', function () {
            function localMockGetAllValuesOverride() {
                return new MockCollection([getMockProductVariationAttributeValue({
                    ID: 'size',
                    attributeID: 'size',
                    value: 'large',
                    displayValue: 'Large'
                })]);
            }

            function localMockGetProductVariationAttributesOverride() {
                return new MockCollection([getMockProductVariationAttribute({
                    attributeID: 'size',
                    ID: 'size',
                    displayName: 'Size'
                })]);
            }

            var localMockGetDefaultVariant = function () {
                return {
                    getVariationModel: function () {
                        return getMockProductVariationModel({
                            getProductVariationAttributes: localMockGetProductVariationAttributesOverride
                        });
                    }
                };
            };

            var localMockDwProduct = getMockProduct({
                ID: productId,
                name: productName,
                master: true,
                variationModel: getMockProductVariationModel({
                    getMaster: function () {
                        return getMockProduct({
                            master: true,
                            getPriceModel: mockGetPriceModel
                        });
                    }
                }),
                getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
                getPriceModel: mockGetPriceModel,
                getVariationModel: function () {
                    return getMockProductVariationModel({
                        getProductVariationAttributes: localMockGetProductVariationAttributesOverride,
                        getAllValues: localMockGetAllValuesOverride,
                        getDefaultVariant: localMockGetDefaultVariant
                    });
                }
            });

            var localParams = {
                pid: productId,
                variables: {
                    size: {
                        ID: 'size',
                        attributeID: 'size',
                        value: 'large',
                        displayValue: 'Large'
                    }
                }
            };

            var sampleProduct = new Product({
                dwProduct: localMockDwProduct,
                params: localParams
            });

            var swatchableAttr = sampleProduct.attributes[0];
            assert.isFalse(swatchableAttr.isSwatchable);
            assert.notEqual(swatchableAttr.attributeID, 'color');
        });
    });

    describe('.updateVariationSelection()', function () {
        var attr = {
            attributeID: 'someAttrId',
            ID: 'someAttrId',
            displayName: 'Some Attr'
        };

        var attrValue = {
            ID: 'someValueId',
            value: 'someValue',
            displayValue: 'some DisplayName'
        };

        var params = {
            pid: productId,
            variables: {
                someAttrId: {
                    ID: 'someAttrId',
                    attributeID: 'someAttrId',
                    value: 'someValue',
                    displayValue: 'some DisplayName'
                }
            }
        };

        function localMockGetProductVariationAttributesOverride() {
            return new MockCollection([getMockProductVariationAttribute(attr)]);
        }

        function localMockGetAllValuesOverride() {
            return new MockCollection([getMockProductVariationAttributeValue(attrValue)]);
        }

        var stubSetSelectedAttributeValue = sinon.stub();

        var mockDwProduct = getMockProduct({
            ID: productId,
            name: productName,
            master: true,
            variationModel: getMockProductVariationModel({
                getMaster: function () {
                    return getMockProduct({
                        master: true,
                        getPriceModel: mockGetPriceModel
                    });
                }
            }),
            getAvailabilityModel: function () { return getMockProductAvailabilityModel(); },
            getPriceModel: mockGetPriceModel,
            getVariationModel: function () {
                return getMockProductVariationModel({
                    getProductVariationAttributes: localMockGetProductVariationAttributesOverride,
                    getAllValues: localMockGetAllValuesOverride,
                    setSelectedAttributeValue: stubSetSelectedAttributeValue
                });
            }
        });

        new Product({
            dwProduct: mockDwProduct,
            params: params
        });

        it('should call setSelectedAttributeValue with the attribute and attributeValue IDs', function () {
            assert.isTrue(stubSetSelectedAttributeValue.calledWith(attr.ID, attrValue.ID));
        });
    });
});
