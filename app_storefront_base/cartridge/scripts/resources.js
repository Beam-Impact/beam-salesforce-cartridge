'use strict';

var styles = [];
var scripts = [];

module.exports = {
    addCss: function (src) {
        if (/((http(s)?:)?\/\/).*.css/.test(src)) {
            styles.push(src);
        } else {
            styles.push(dw.web.URLUtils.staticURL(src).toString());
        }
    },
    addJs: function (src) {
        if (/((http(s)?:)?\/\/).*.js/.test(src)) {
            scripts.push(src);
        } else {
            scripts.push(dw.web.URLUtils.staticURL(src).toString());
        }
    },
    scripts: scripts,
    styles: styles
};
