'use strict';

var server = require('server');
var locale = require('~/cartridge/scripts/middleware/locale');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
var SearchModel = require('dw/catalog/SearchModel');
var Iterator = require('dw/util/Iterator');

server.get('Show', locale, function (req, res, next) {
	res.render('search/searchresult', getModel(req));
    next();
});

function getModel(req){
	
	var SearchModel = require('~/cartridge/models/search');
	
	var productSearchModel = new ProductSearchModel();
	
	return new SearchModel(productSearchModel, req);
}

//separate function for formatting refinements from querystring HERE!

module.exports = server.exports();
