'use strict';

/**
 * Creates an array of objects containing store information
 * @param {dw.util.Set <dw.catalog.Store>} storesObject - results returned by the search
 * @returns {Array} an array of objects that contains store information
 */
function createStoresObject(storesObject) {
    return Object.keys(storesObject).map(function (key) {
        var store = storesObject[key];
        var storeObj = {
            name: store.name,
            address1: store.address1,
            address2: store.address2,
            city: store.city,
            postalCode: store.postalCode
        };

        if (store.phone) {
            storeObj.phone = store.phone;
        }

        if (store.stateCode) {
            storeObj.stateCode = store.stateCode;
        }
        return storeObj;
    });
}

/**
 * Creates an array of objects containing the coordinates of the store's returned by the search
 * @param {dw.util.Set <dw.catalog.Store>} storesObject - results returned by the search
 * @returns {Array} an array of coordinates  objects
 */
function createGeoLocationObject(storesObject) {
    return Object.keys(storesObject).map(function (key) {
        var store = storesObject[key];

        return {
            name: store.name,
            latitude: store.latitude,
            longitude: store.longitude
        };
    });
}

/**
 * The stores model
 * @param {dw.util.Set <dw.catalog.Store>} storesResultsObject - results returned by the search
 * @param {Object} searchKey - what the user searched by (location or postal code)
 * @param {Number} searchRadius - the radius used in the search
 * @param {dw.web.URL} actionUrl - a relative url
 * @param {String} apiKey - the google maps api key that is set in site preferences
 * @constructor
 */
function stores(storesResultsObject, searchKey, searchRadius, actionUrl, apiKey) {
    this.stores = createStoresObject(storesResultsObject);
    this.locations = createGeoLocationObject(storesResultsObject);
    this.searchKey = searchKey;
    this.radius = searchRadius;
    this.actionUrl = actionUrl;
    this.googleMapsApi = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey;
    this.radiusOptions = [15, 30, 50, 100, 300];
}

module.exports = stores;
