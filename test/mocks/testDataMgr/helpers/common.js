'use strict';

import _ from 'lodash';
import nodeUrl from 'url';

export const defaultLocale = 'x_default';
export const supportedLocales = [
    'en_US',
    'en_GB',
    'fr_FR',
    'it_IT',
    'ja_JP',
    'zh_CN'
];

// commonly used selectors
export const PRIMARY_H1 = '#primary h1';
export const BREADCRUMB_A = '.breadcrumb a';
export const LAST_BREADCRUMB = '.breadcrumb-element:last-of-type';
export const BTN_ADD_TO_CART = '#add-to-cart';
export const PRIMARY_CONTENT = '.primary-content';

export function getPageTitle() {
    return new Promise(resolve => {
        browser.getTitle()
            .then(title => resolve(title.split('|')[0].trim()));
    });
}

export function checkElementEquals(selector, value) {
    return browser.getText(selector)
        .then(text => text === value);
}

export function removeItems(removeLink) {
    let promises = [];

    return browser.elements(removeLink)
        .then(removeLinks => {
            // Because each Remove link results in a page reload,
            // it is necessary to wait for one remove operation
            // to complete before clicking on the next Remove
            // link
            if (!removeLinks.value.length) {
                return Promise.resolve();
            }
            removeLinks.value.forEach(() => promises.push(clickFirstRemoveLink(removeLink)));

            return Promise.resolve();
        })
        .then(() => Promise.all(promises));
}

export function clickCheckbox(selector) {
    return browser.click(selector)
        .isSelected(selector)
        .then(selected => {
            if (!selected) {
                return browser.click(selector);
            }
            return Promise.resolve();
        });
}

export function uncheckCheckbox(selector) {
    return browser.click(selector)
        .isSelected(selector)
        .then(selected => {
            if (selected) {
                return browser.click(selector);
            }
            return Promise.resolve();
        });
}


export function selectAttributeByIndex(attributeName, index, deselect) {
    let selector = '.swatches.' + attributeName + ' li:nth-child(' + index + ')';
    return browser.waitForVisible(selector)
        // Before clicking on an attribute value, we must check whether it has already been selected.
        // Clicking on an already selected value will deselect it.
        .then(() => isAttributeSelected(selector))
        .then(isAlreadySelected => {
            if (deselect && isAlreadySelected) {
                return browser.waitForVisible('.loader', 500, true)
                    .element(selector + ' a')
                    .click()
                    .waitForVisible('.swatches.' + attributeName + ' .selected-value', 5000, true);
            } else if (!isAlreadySelected) {
                return browser.click(selector + ' a')
                    .waitForVisible('.swatches.' + attributeName + ' .selected-value');
            }
            return Promise.resolve();
        });
}

function isAttributeSelected(selector) {
    return browser.getAttribute(selector, 'class')
        .then(classes => Promise.resolve(classes.indexOf('selectable') > -1 && classes.indexOf('selected') > -1));
}

/**
 * Adds a Product Variation to a Basket
 *
 * @param {Map} product Product Map comprised of the following:
 * @param {String} product.resourcePath - Product Detail Page URL resource path
 * @param {Number} [product.colorIndex] - If product variations with Color,
 *     this represents the index value for the color options
 * @param {number} [product.sizeIndex]  - If product variations with Size,
 *     this represents the index value for the size options
 * @param {String} btnAdd - selector for Add to { Cart | Wishlist | Registry } button
 */
export function addProductVariationToBasket(product, btnAdd) {
    return browser.url(product.get('resourcePath'))
        .then(() => {
            if (product.has('colorIndex')) {
                return selectAttributeByIndex('color', product.get('colorIndex'));
            }
            return Promise.resolve();
        })
        .then(() => {
            if (product.has('sizeIndex')) {
                return selectAttributeByIndex('size', product.get('sizeIndex'));
            }
            return Promise.resolve();
        })
        .then(() => {
            if (product.has('widthIndex')) {
                return selectAttributeByIndex('width', product.get('widthIndex'));
            }
            return Promise.resolve();
        })
        .then(() => browser.waitForVisible('.loader-bg', 5000, true)
            .waitForEnabled(btnAdd)
            .click(btnAdd)
        )
        .then(() => Promise.resolve());
}

/**
 * Clicks the first Remove link in a Cart or WishList
 *
 */
function clickFirstRemoveLink(removeLink) {
    return browser.elements(removeLink)
        .then(removeLinks => {
            if (removeLinks.value.length) {
                return browser.elementIdClick(removeLinks.value[0].ELEMENT);
            }
            return Promise.resolve();
        });
}

/**
 * Clicks on an selector and wait for the page to reload
 * @param selectorToClick
 * @param selectorToWait
 * @returns {*|Promise.<T>}
 */
export function clickAndWait(selectorToClick, selectorToWait) {
    return browser.click(selectorToClick)
        .waitForVisible(selectorToWait);
}

export function getSearchParams() {
    return browser.url()
        .then(url => {
            let parsedUrl = nodeUrl.parse(url.value);
            let search = parsedUrl.search ? parsedUrl.search.replace('?', '') : '';
            let params = _.fromPairs(
                _.map(search.split('&'), param => param.split('='))
            );
            return Promise.resolve(params);
        });
}

export function getLocale() {
    return getSearchParams()
        .then(params =>
            Promise.resolve(params && params.lang && supportedLocales.indexOf(params.lang) > -1 ? params.lang : defaultLocale)
        );
}

/**
 * Returns the current Site name
 *
 * Assumptions:
 *   - In BM > Merchant Tools > Storefront URLs, "Enable new rule-based storefront URLs to replaced
 *     legacy SEO URLs" is checked
 *   - When this function is called, a Webdriver.IO client has already been instantiated and has a URL with the
 *     following format, http[s]://<server>/s/<Site name>[/<path>]
 *
 *     i.e., https://myserver.com/s/SiteGenesis/mens/clothing/dress%20shirts/?lang=en_US
 *
 * @returns {String} - Site name (i.e., SiteGenesis or SiteGenesisGlobal)
 */
export function getCurrentSiteName() {
    return browser.url()
        .then(url => url.value.split('/s/')[1].split('/')[0]);
}
