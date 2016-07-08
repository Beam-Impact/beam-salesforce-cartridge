'use strict';

var Locale = require('~/cartridge/models/locale');

/**
 * Sets current locale in viewData
 * @param {Object} req - Request object
 * @param {Object} res - Response objects
 * @param {Function} next - Next callback
 * @return {void}
 */
function setLocale(req, res, next) {
    res.setViewData(new Locale(req.locale));
    next();
}

module.exports = setLocale;
