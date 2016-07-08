'use strict';

var URLUtils = require('dw/web/URLUtils');

var styles = [];
var scripts = [];

module.exports = {
    addCss: function (src) {
        if (/((http(s)?:)?\/\/).*.css/.test(src)) {
            styles.push(src);
        } else {
            styles.push(URLUtils.staticURL(src).toString());
        }
    },
    addJs: function (src) {
        if (/((http(s)?:)?\/\/).*.js/.test(src)) {
            scripts.push(src);
        } else {
            scripts.push(URLUtils.staticURL(src).toString());
        }
    },
    scripts: scripts,
    styles: styles
};
