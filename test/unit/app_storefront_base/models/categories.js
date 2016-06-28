'use strict';

const assert = require('chai').assert;
const Collection = require('../../../mocks/dw.util.Collection');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const util = require('../../../util');

const urlUtilsMock = {
    http: function (a, b, id) {
        return id;
    }
};

const createApiCategory = function (name, id) {
    return {
        custom: {
            showInMenu: true
        },
        getDisplayName: function () {
            return name;
        },
        getOnlineSubCategories: function () {
            return [];
        },
        getID: function () {
            return id;
        }
    };
};

describe('categories', function () {
    let Categories = null;
    beforeEach(function () {
        const helper = proxyquire('../../../../app_storefront_base/cartridge/scripts/dwHelpers', {
            'dw/util/Collection': Collection
        });
        Categories = proxyquire('../../../../app_storefront_base/cartridge/models/categories', {
            '~/cartridge/scripts/dwHelpers': helper,
            'dw/web/URLUtils': urlUtilsMock
        });
    });
    it('should convert API response to an object', function () {
        const apiCategories = [createApiCategory('foo', 1)];

        const result = new Categories(apiCategories);
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].name, 'foo');
        assert.equal(result.categories[0].url, 1);
    });
    it('should convert API response to nested object', function () {
        const category = createApiCategory('foo', 1);
        category.getOnlineSubCategories = function () {
            return util.toArrayList([createApiCategory('bar', 2), createApiCategory('baz', 3)]);
        };

        const result = new Categories([category]);
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].name, 'foo');
        assert.equal(result.categories[0].url, 1);
        assert.equal(result.categories[0].subCategories.length, 2);
        assert.isFalse(result.categories[0].complexSubCategories);
        assert.equal(result.categories[0].subCategories[0].name, 'bar');
        assert.equal(result.categories[0].subCategories[1].name, 'baz');
    });
    it('should convertAPI response to object with complex sub category', function () {
        const category = createApiCategory('foo', 1);
        category.getOnlineSubCategories = function () {
            const child = createApiCategory('bar', 2);
            child.getOnlineSubCategories = function () {
                return util.toArrayList([createApiCategory('baz', 3)]);
            };
            return util.toArrayList([child]);
        };

        const result = new Categories([category]);
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].subCategories.length, 1);
        assert.isTrue(result.categories[0].complexSubCategories);
        assert.equal(result.categories[0].subCategories[0].name, 'bar');
        assert.equal(result.categories[0].subCategories[0].subCategories[0].name, 'baz');
    });
    it('should not show menu that is marked as showInMenu false', function () {
        const category = createApiCategory('foo', 1);
        category.getOnlineSubCategories = function () {
            const child = createApiCategory('bar', 2);
            child.getOnlineSubCategories = function () {
                const subChild = createApiCategory('baz', 3);
                subChild.custom.showInMenu = false;
                return util.toArrayList([subChild]);
            };
            return util.toArrayList([child]);
        };

        const result = new Categories([category]);
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].subCategories.length, 1);
        assert.isFalse(result.categories[0].complexSubCategories);
        assert.equal(result.categories[0].subCategories[0].name, 'bar');
        assert.isUndefined(result.categories[0].subCategories[0].subCategories);
    });
    it('should use alternativeUrl', function () {
        const category = createApiCategory('foo', 1);
        category.custom.alternativeUrl = 22;
        const apiCategories = [category];

        const result = new Categories(apiCategories);
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].name, 'foo');
        assert.equal(result.categories[0].url, 22);
    });
    it('should not return any categories', function () {
        const category = createApiCategory('foo', 1);
        category.custom.showInMenu = false;
        const apiCategories = [category];

        const result = new Categories(apiCategories);
        assert.equal(result.categories.length, 0);
    });
});
