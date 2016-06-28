'use strict';

var Response = require('../../../../modules/server/response');
var assert = require('chai').assert;

describe('response', function () {
    it('Should create response object with passed-in base', function () {
        var base = { redirect: function () {} };
        var response = new Response(base);
        assert.property(response, 'base');
        assert.property(response.base, 'redirect');
    });
    it('Should correctly set view and viewData', function () {
        var response = new Response({});
        response.render('test', { name: 'value' });
        assert.equal(response.view, 'test');
        assert.equal(response.viewData.name, 'value');
    });
    it('Should extend viewData', function () {
        var response = new Response({});
        response.setViewData({ name: 'value' });
        response.setViewData({ foo: 'bar' });
        response.render('test', { name: 'test' });
        assert.equal(response.viewData.name, 'test');
        assert.equal(response.viewData.foo, 'bar');
    });
    it('Should correctly set json', function () {
        var response = new Response({});
        response.json({ name: 'value' });
        assert.isTrue(response.isJson);
        assert.equal(response.viewData.name, 'value');
    });
    it('Should correctly set url', function () {
        var response = new Response({});
        response.redirect('hello');
        assert.equal(response.redirectUrl, 'hello');
    });
    it('Should set and retrieve data', function () {
        var response = new Response({});
        response.setViewData({ name: 'value' });
        assert.equal(response.getViewData().name, 'value');
    });
    it('Should log item', function () {
        var response = new Response({});
        response.log('one', 'two', 'three');
        assert.equal(response.messageLog.length, 1);
        assert.equal(response.messageLog[0], 'one two three');
    });
    it('Should convert log item to json', function () {
        var response = new Response({});
        response.log({ name: 'value' });
        assert.equal(response.messageLog.length, 1);
        assert.equal(response.messageLog[0], '{"name":"value"}');
    });
    it('Should try to print out a message', function (done) {
        var response = new Response({
            writer: { print: function (value) { assert.equal(value, 'hello'); done(); } }
        });
        response.print('hello');
    });
    it('Should set content type', function (done) {
        var response = new Response({
            setContentType: function (type) { assert.equal(type, 'text/html'); done(); }
        });
        response.setContentType('text/html');
    });
});
