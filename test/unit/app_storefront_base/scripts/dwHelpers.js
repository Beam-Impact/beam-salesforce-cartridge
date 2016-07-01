'use strict';

var assert = require('chai').assert;
var ArrayList = require('../../../mocks/dw.util.Collection.js');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('dwHelpers', function () {
    var helpers = null;

    beforeEach(function () {
        helpers = proxyquire('../../../../app_storefront_base/cartridge/scripts/dwHelpers', {
            'dw/util/ArrayList': ArrayList
        });
    });

    it('should map collection to an array', function () {
        var collection = new ArrayList([1, 2, 3]);
        var result = helpers.map(collection, function (item) {
            return item + 10;
        });

        assert.deepEqual(result, [11, 12, 13]);
    });

    it('should map empty collection to an empty array', function () {
        var collection = new ArrayList();
        var result = helpers.map(collection, function (item) {
            return item + 10;
        });

        assert.deepEqual(result, []);
    });

    it('should correctly iterate over collection', function () {
        var collection = new ArrayList([1, 2, 3]);
        var result = [];

        helpers.forEach(collection, function (item) {
            result.push(item);
        });

        assert.deepEqual(result, [1, 2, 3]);
    });

    it('should never call iterator function for empty collection', function () {
        var collection = new ArrayList();
        var called = false;

        helpers.forEach(collection, function () {
            called = true;
        });

        assert.isFalse(called);
    });

    it('should concatinate multiple collection into one', function () {
        var collection1 = new ArrayList([1, 2, 3]);
        var collection2 = new ArrayList([4, 5, 6]);
        var collection3 = new ArrayList([7, 8, 9]);

        var result = helpers.concat(collection1, collection2, collection3);

        assert.isFalse(Array.isArray(result));
        assert.deepEqual(result.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should not concatinate empty collections', function () {
        var collection1 = new ArrayList([1, 2, 3]);
        var collection2 = new ArrayList();

        var result = helpers.concat(collection1, collection2);

        assert.deepEqual(result.toArray(), [1, 2, 3]);
    });
});
