'use strict';

var Collection = require('dw/util/Collection');

/**
 * Map method for dw.util.Collection
 * @param {dw.util.Collection} collection - Collection to map over
 * @param {Function} callback - Callback function for each item
 * @returns {Array} Array of results of map
 */
function map(collection, callback) {
    var iterator = collection.iterator();
    var index = 0;
    var item = null;
    var result = [];
    while (iterator.hasNext()) {
        item = iterator.next();
        result.push(callback(item, index, collection));
        index++;
    }
    return result;
}

/**
 * forEach method for dw.util.Collection
 * @param {dw.util.Collection} collection - Collection to map over
 * @param {Function} callback - Callback function for each item
 * @returns {void}
 */
function forEach(collection, callback) {
    var iterator = collection.iterator();
    var index = 0;
    var item = null;
    while (iterator.hasNext()) {
        item = iterator.next();
        callback(item, index, collection);
        index++;
    }
}

/**
 * concat method for dw.util.Collection
 * @param  {...dw.util.Collection} arguments - first collection to concatinate
 * @return {dw.util.Collection} Collection containing all passed collections
 */
function concat() {
    var result = new Collection();
    for (var i = 0, l = arguments.length; i < l; i++) {
        result.addAll(arguments[i]);
    }
    return result;
}

module.exports = {
    map: map,
    forEach: forEach,
    concat: concat
};
