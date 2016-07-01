'use strict';

const assert = require('chai').assert;
const Content = require('../../../../app_storefront_base/cartridge/models/content');

describe('Content', function () {
    it('should return converted content model', function () {
        const contentValue = {
            custom: {
                body: 'Hello'
            },
            template: 'templateName',
            UUID: 22
        };

        const content = new Content(contentValue);

        assert.deepEqual(content, { body: 'Hello', template: 'templateName', UUID: 22 });
    });

    it('should return converted content model without a body', function () {
        const contentValue = {
            template: 'templateName',
            UUID: 22
        };

        const content = new Content(contentValue);

        assert.isNull(content.body);
    });

    it('should return converted content model with null for a body', function () {
        const contentValue = {
            custom: {},
            template: 'templateName',
            UUID: 22
        };

        const content = new Content(contentValue);

        assert.isNull(content.body);
    });

    it('should return converted content model with default template', function () {
        const contentValue = {
            custom: { body: 'Hello' },
            UUID: 22
        };

        const content = new Content(contentValue);

        assert.equal(content.template, 'components/content/contentassetinc');
    });
});
