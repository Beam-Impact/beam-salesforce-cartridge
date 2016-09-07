'use strict';

var server = require('server');
var locale = require('~/cartridge/scripts/middleware/locale');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');

/**
 * Creates a plain object of the product search model
 * @param {Object} req - local instance of request object
 * @returns {Object} a plain object of the product search model
 */
function getModel(req) {
    var SearchModel = require('~/cartridge/models/search');
    var productSearchModel = new ProductSearchModel();
    var dataForSearch = {
        searchPhrase: req.querystring.q
    };
    return new SearchModel(productSearchModel, dataForSearch);
}

server.get('Show', locale, function (req, res, next) {
    res.render('search/searchresult', getModel(req));
    next();
});

// FIX ME: separate function for formatting refinements from querystring HERE!

module.exports = server.exports();
