'use strict';

var catalogMgr = require('dw/catalog/CatalogMgr');
var Categories = require('~/cartridge/models/categories');
var ProductSearch = require('dw/catalog/ProductSearchModel');
var helper = require('~/cartridge/scripts/dwHelpers');

/**
 * Retrieves the list of categories and sets it in viewData
 * @param {Object} req - Request object
 * @param {Object} res - Response objects
 * @param {Function} next - Next callback
 * @return {void}
 */
function setCategories(req, res, next) {
    var siteRootCategory = catalogMgr.getSiteCatalog().getRoot();
    var ps = new ProductSearch();
    var topLevelCategories = null;
    var categories = null;
    ps.setCategoryID(siteRootCategory.getID());
    ps.search();
    topLevelCategories = ps.getRefinements().getNextLevelCategoryRefinementValues(siteRootCategory);
    categories = helper.map(topLevelCategories, function (item) {
        return catalogMgr.getCategory(item.value);
    });
    res.setViewData(new Categories(categories));
    next();
}

module.exports = setCategories;
