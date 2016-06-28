'use strict';

const countries = require('~/cartridge/models/countries');
const locale = require('dw/util/Locale');

/**
 * Represents current locale information in plain object
 * @param {string} requestLocale locale of current request (i.e. en_US)
 * @constructor
 */
function Locale(requestLocale) {
    const currentLocale = locale.getLocale(requestLocale);
    const currentCountry = !currentLocale ? countries[0]
        : countries.filter(function (country) {
            return country.countryCode === currentLocale.country;
        })[0];
    this.locale = {
        countryCode: currentCountry.countryCode,
        name: currentCountry.name[currentLocale] || currentCountry.name.en_US,
        continent: currentCountry.continent,
        availableLocales: currentCountry.locales,
        currencyCode: currentCountry.currencyCode,
        tax: currentCountry.taxation.type
    };
}

module.exports = Locale;
