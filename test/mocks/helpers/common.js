'use strict';

/**
 * Simple function that returns true
 */
function returnTrue() {
    return true;
}

/**
 * Simple function that returns false
 */
function returnFalse() {
    return false;
}

/**
 * Simple function that returns an empty list
 */
function returnList() {
    return [];
}

/**
 * Simple function that returns an object literal
 */
function returnObject() {
    return {};
}

/**
 * Simple function that returns an empty string
 */
function returnString() {
    return 'some string';
}

/**
 * Simple function that returns null
 */
function returnNull() {
    return null;
}

/**
 * Returns a provided or default function or property
 *
 * @param {Object|undefined} args - Hashmap of overridden methods.
 * @param {Function|String|Number|Object} args.<key> - A function definition for the <key> provided
 * @param {Object} defaults
 * @param {String} methodOrPropertyName - Name of the method or property
 * @returns {Function|String|Number|Object} - Either the defined method/property in "args" or in
 *     "defaultMethods" input param, that corresponds to "method"
 */
function getProvidedOrDefault(args, defaults, methodOrPropertyName) {
    return args && args.hasOwnProperty.call(args, methodOrPropertyName)
        ? args[methodOrPropertyName]
        : defaults[methodOrPropertyName];
}

module.exports = {
    returnFalse: returnFalse,
    returnList: returnList,
    returnNull: returnNull,
    returnObject: returnObject,
    returnString: returnString,
    returnTrue: returnTrue,
    getProvidedOrDefault: getProvidedOrDefault
};
