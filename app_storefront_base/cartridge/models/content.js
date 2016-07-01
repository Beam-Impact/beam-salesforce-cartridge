'use strict';

/**
 * Represents content model
 * @param  {dw.content.Content} contentValue - result of ContentMgr.getContent call
 * @return {void}
 * @constructor
 */
function content(contentValue) {
    this.body = contentValue && contentValue.custom && contentValue.custom.body || null;
    this.UUID = contentValue.UUID;
    this.template = contentValue.template || 'components/content/contentassetinc';
}

module.exports = content;
