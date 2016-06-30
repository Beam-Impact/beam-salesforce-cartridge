'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const sinon = require('sinon');

describe('render', function () {
    let render = null;
    const ismlRender = sinon.spy();

    beforeEach(function () {
        render = proxyquire('../../../../modules/server/render', {
            'dw/template/ISML': {
                renderTemplate: ismlRender
            }
        });
    });

    afterEach(function () {
        ismlRender.reset();
    });

    it('should correctly render a template', function () {
        render.template('name', {}, {});

        assert.isTrue(ismlRender.calledOnce);
    });

    it('should pass data correctly to the view', function () {
        render.template('template', { name: 'value' }, {});

        assert.isTrue(ismlRender.calledWith('template', sinon.match({ name: 'value' })));
    });

    it('should render a json output', function () {
        const response = {
            print: sinon.spy(),
            setContentType: sinon.spy()
        };

        render.json({}, response);

        assert.isTrue(response.setContentType.calledWith('application/json'));
        assert.isTrue(response.print.calledOnce);
    });

    it('should render error page when template failed', function () {
        const renderMock = proxyquire('../../../../modules/server/render', {
            'dw/template/ISML': {
                renderTemplate: function () {
                    throw new Error('hello');
                }
            }
        });

        const response = {
            print: sinon.spy()
        };

        renderMock.template('template', {}, response);

        assert.isTrue(response.print.called);
        assert.equal(response.print.callCount, 4);
    });
});
