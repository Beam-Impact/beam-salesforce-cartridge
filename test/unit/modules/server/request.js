'use strict';

const Request = require('../../../../modules/server/request');
const assert = require('chai').assert;

function createFakeRequest(overrides) {
    overrides = overrides || {}; // eslint-disable-line no-param-reassign
    const globalRequest = {
        httpMethod: 'GET',
        host: 'localhost',
        path: '/Product-Show',
        httpQueryString: '',
        isHttpSecure: function () {
            return false;
        }
    };
    Object.keys(overrides).forEach(function (key) {
        globalRequest[key] = overrides[key];
    });
    return globalRequest;
}

describe('request', function () {
    it('should parse empty query string', function () {
        const req = new Request(createFakeRequest());
        assert.isObject(req.querystring);
        assert.equal(Object.keys(req.querystring).length, 0);
    });
    it('should parse simple query string', function () {
        const req = new Request(createFakeRequest({ httpQueryString: 'id=22&name=foo' }));
        assert.isObject(req.querystring);
        assert.equal(req.querystring.id, 22);
        assert.equal(req.querystring.name, 'foo');
    });
    it('should parse query string with variables', function () {
        const req = new Request(createFakeRequest({
            httpQueryString: 'dwvar_foo_color=1111&dwvar_bar_size=32'
        }));
        assert.equal(req.querystring.variables.color.id, 'foo');
        assert.equal(req.querystring.variables.color.value, '1111');
        assert.equal(req.querystring.variables.size.id, 'bar');
        assert.equal(req.querystring.variables.size.value, '32');
        assert.notProperty(req.querystring, 'dwvar_foo_color');
        assert.notProperty(req.querystring, 'dwvar_bar_size');
    });
    it('should parse query string with incorrectly formatted variables', function () {
        const req = new Request(createFakeRequest({
            httpQueryString: 'dwvar_color=1111&dwvar_size=32'
        }));
        assert.equal(req.querystring.dwvar_color, '1111');
        assert.equal(req.querystring.dwvar_size, '32');
        assert.notProperty(req.querystring, 'variables');
    });
});
