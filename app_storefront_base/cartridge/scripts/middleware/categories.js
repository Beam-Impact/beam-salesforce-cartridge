'use strict';

const catalogMgr = require('dw/catalog/CatalogMgr');
const Categories = require('~/cartridge/models/categories');
const ProductSearch = require('dw/catalog/ProductSearchModel');
const helper = require('~/cartridge/scripts/dwHelpers');

/**
 * Retrieves the list of categories and sets it in viewData
 * @param {Object} req - Request object
 * @param {Object} res - Response objects
 * @param {Function} next - Next callback
 * @return {void}
 */
function setCategories(req, res, next) {
    const siteRootCategory = catalogMgr.getSiteCatalog().getRoot();
    const ps = new ProductSearch();
    let topLevelCategories = null;
    let categories = null;
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
