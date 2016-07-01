'use strict';

var defaultImageViewTypes = ['large', 'medium', 'small', 'swatch'];
var dwHelpers = require('../../scripts/dwHelpers');
var PricingModel = require('./productPricingModel');

/**
 * Retrieves the Demandware ProductVariationAttribute within a collection of such objects
 *
 * @param {dw.util.Collection} dwVariationAttrs - Collection of dw.catalog.ProductVariationAttribute
 *     objects
 * @param {dw.catalog.ProductVariationAttribute} attr - Instance of a ProductVariationAttribute to
 *     look for in dwVariationAttrs
 * @returns {dw.catalog.ProductVariationAttribute|undefined}
 */
function getDwVariationAttr(dwVariationAttrs, attr) {
    var iter = dwVariationAttrs.iterator();
    while (iter.hasNext()) {
        var dwVariationAttr = iter.next();
        if (dwVariationAttr.attributeID === attr) {
            return dwVariationAttr;
        }
    }

    return null;
}

/**
 * Gets the ProductVariationAttributeValue with the provided value
 *
 * @param {dw.catalog.ProductVariationModel} dwVariationModel
 * @param {dw.catalog.ProductVariationAttribute} dwVariationAttr
 * @param {String|undefined} value
 */
function getVariationValue(dwVariationModel, dwAttr, value) {
    var dwAttrValues = dwVariationModel.getAllValues(dwAttr);
    var iter = dwAttrValues.iterator();
    while (iter.hasNext()) {
        var dwAttrValue = iter.next();
        if (dwAttrValue.value === value) {
            return dwAttrValue;
        }
    }

    return null;
}

/**
 * Updates a ProductVariationModel with the selected attributes
 *
 * @param {Object} args
 * @param {dw.catalog.Product} args.dwProduct - Product instance
 * @param {Object} args.attrs - Query parameter values of selected product attributes
 * @returns {dw.catalog.ProductVariationModel} - Updated ProductVariationModel with selected
 *     attributes taken into consideration
 */
function updateVariationSelection(args) {
    var dwProduct = args.dwProduct;
    var attrs = args.attrs;

    var dwVariationModel = dwProduct.getVariationModel();
    var dwVariationAttrs = dwVariationModel.getProductVariationAttributes();

    if (attrs) {
        Object.keys(attrs).forEach(function (attr) {
            var dwAttr = getDwVariationAttr(dwVariationAttrs, attr);
            var dwAttrValue = getVariationValue(dwVariationModel, dwAttr, attrs[attr].value);

            dwVariationModel.setSelectedAttributeValue(dwAttr.ID, dwAttrValue.ID);
        });
    }

    return dwVariationModel;
}

/**
 * Determines whether a product attribute has image swatches.  Currently, the only attribute that
 *     does is Color.
 * @param {String} dwAttributeId
 * @returns {boolean}
 */
function isSwatchable(dwAttributeId) {
    var imageableAttrs = ['color'];
    return imageableAttrs.indexOf(dwAttributeId) > -1;
}

/**
 * Retrieve a Product's or Attribute Value's images
 *
 * @param {dw.catalog.Product | dw.catalog.ProductVariationAttributeValue} imageHolder - DW Script
 *     object that has a getImages method
 * @returns {Object[]} - List of image objects
 */
function getImages(imageHolder) {
    var images = {};

    defaultImageViewTypes.forEach(function (type) {
        var imageList = [];
        var dwImages = imageHolder.getImages(type);

        dwHelpers.forEach(dwImages, function (dwMediaFile) {
            imageList.push({
                alt: dwMediaFile.alt,
                url: dwMediaFile.URL.relative().toString(),
                title: dwMediaFile.title
            });
        });

        images[type] = imageList;
    });

    return images;
}

/**
 * Retrieve all attribute values
 *
 * @param {dw.catalog.ProductVariationModel} dwVariationModel - A product's variation model
 * @param {dw.catalog.ProductVariationAttributeValue} dwSelectedValue - Selected attribute value
 * @param {dw.catalog.ProductVariationAttribute} dwAttr - Attribute value
 * @returns {Object[]} - List of attribute value objects for template context
 */
function getAllAttrValues(dwVariationModel, dwSelectedValue, dwAttr) {
    var dwAttrValues = dwVariationModel.getAllValues(dwAttr);
    var actionEndpoint = 'Product-Variation';

    return dwHelpers.map(dwAttrValues, function (dwValue) {
        var isSelected = (dwSelectedValue && dwSelectedValue.equals(dwValue)) || false;

        var processedAttr = {
            id: dwValue.ID,
            description: dwValue.description,
            displayValue: dwValue.displayValue,
            value: dwValue.value,
            isSelected: isSelected,
            isSelectable: dwVariationModel.hasOrderableVariants(dwAttr, dwValue)
        };

        if (processedAttr.isSelectable) {
            processedAttr.url = isSelected
                ? dwVariationModel.urlUnselectVariationValue(actionEndpoint, dwAttr)
                : dwVariationModel.urlSelectVariationValue(actionEndpoint, dwAttr, dwValue);
        }

        if (isSwatchable(dwAttr.attributeID)) {
            processedAttr.images = getImages(dwValue);
        }

        return processedAttr;
    });
}

/**
 * Generate a list of objects that represent the product's attributes that will be used in a
 *     template's context
 * @param {Object} args
 * @param {dw.catalog.ProductVariationModel} args.dwVariationModel - ProductVariationModel to look
 *     up dw.catalog.ProductVariationAttributes
 * @returns {Object[]} - Attribute objects used in template context
 */
function getAttrs(args) {
    var dwVariationModel = args.dwVariationModel;

    var variant = dwVariationModel.getSelectedVariant() || dwVariationModel.getDefaultVariant();
    var variantVariationModel = variant.getVariationModel();
    var dwAttrs = variantVariationModel.getProductVariationAttributes();

    return dwHelpers.map(dwAttrs, function (dwAttr) {
        var dwSelectedValue = dwVariationModel.getSelectedValue(dwAttr);
        return {
            attributeID: dwAttr.attributeID,
            displayName: dwAttr.displayName,
            id: dwAttr.ID,
            isSwatchable: isSwatchable(dwAttr.attributeID),
            values: getAllAttrValues(dwVariationModel, dwSelectedValue, dwAttr)
        };
    });
}

/**
 * Determines whether a product is available
 *
 * @param {Object} params
 * @param {String} [params.quantity] - Quantity value to check against product availability
 * @param {dw.catalog.Product} dwProduct - Product to check for availability
 * @returns {boolean} - True if available, False if not
 */
function getIsAvailable(params, dwProduct) {
    var availabilityModel = dwProduct.getAvailabilityModel();
    var quantity = parseFloat(params.quantity) || 1;

    return availabilityModel.isOrderable(quantity);
}

/**
 * Determine whether all required attributes have been selected.  Value is used as one criteria as
 *     to whether the product can be added to the customer's cart
 * @param {dw.catalog.ProductVariationModel} dwVariationModel - The product's variation model
 * @returns {boolean}
 */
function hasRequiredAttrsSelected(dwVariationModel) {
    return !!dwVariationModel.getSelectedVariant();
}

/**
 * Product Model for Master and Variant Products
 *
 * @param {Object} args
 * @param {Object} args.params
 * @param {dw.catalog.Product} args.dwProduct - Product instance retrieved by calling
 *     ProductMgr.get(pid)
 * @return {Object} - Product model instance for use in template context
 */
function Product(args) {
    var params = args.params;
    var dwProduct = args.dwProduct;

    var updatedVariationModel = updateVariationSelection({
        dwProduct: dwProduct,
        attrs: params.variables
    });

    var defaultMaxOrderQuantity = 9;

    this.id = dwProduct.ID;
    this.name = dwProduct.name;
    this.isOnline = dwProduct.online;
    this.isSearchable = dwProduct.searchable;
    this.minOrderQuantity = dwProduct.minOrderQuantity.value || 1;
    this.maxOrderQuantity = defaultMaxOrderQuantity;

    this.attributes = getAttrs({
        dwVariationModel: updatedVariationModel
    });
    this.price = new PricingModel(dwProduct, []);
    this.images = getImages(updatedVariationModel);

    // Criteria for "Add to Cart" button enablement.  isAvailable confirms that the product is both
    // "Online" and has sufficient inventory for the quantity selected
    this.isAvailable = getIsAvailable(params, dwProduct);
    this.hasRequiredAttrsSelected = hasRequiredAttrsSelected(updatedVariationModel);

    this.productType = 'master';
    if (dwProduct.variant) {
        this.productType = 'variant';
    } else if (dwProduct.variationGroup) {
        this.productType = 'variationGroup';
    } else if (dwProduct.productSet) {
        this.productType = 'set';
    } else if (dwProduct.bundle) {
        this.productType = 'bundle';
    }
}

Product.updateVariationSelection = updateVariationSelection;

module.exports = Product;
