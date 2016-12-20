'use strict';
/*
Query Search on General Product then do multiple refinements
- Search for 'pants'
- refine by Color, Price and New Arrival
- click on reset button
 */

import { assert } from 'chai';
import * as homePage from '../../mocks/testDataMgr/pageObjects/home';
import * as search from '../../mocks/testDataMgr/pageObjects/searchResult';
import * as common from '../../mocks/testDataMgr/helpers/common';
import { config } from '../webdriver/wdio.conf';
import * as testDataMgr from '../../mocks/testDataMgr/main';
import * as Resource from '../../mocks/dw/web/Resource';

describe('Query Search and multiple refinements -  general product', () => {
    const locale = config.locale;
    const product1ID = '25502038';
    const product2ID = '25502027';
    const baseUrl = config.baseUrl;
    const localeStr = locale === 'x_default' ? 'en_US' : locale;
    const productGeneral = {
        x_default: 'pants',
        en_GB: 'trousers',
        fr_FR: 'pantalon',
        it_IT: 'pantaloni',
        jp_JP: 'パンツ',
        zh_CN: '裤子'
    };

    var productMaster1;
    var expectedDisplayName1;
    var productMaster2;
    var expectedDisplayName2;

    const searchResultMsg = Resource.msgf('label.resultsfor', 'search', null, '79');
    const expectedString = searchResultMsg + ' ' + productGeneral[locale];
    let myQuerySelector;

    function verifySearchResults(selector, expectedResults) {
        return browser.getText(selector)
            .then(displayText => assert.equal(displayText, expectedResults));
    }

    before(() => testDataMgr.load()
        .then(() => homePage.navigateTo())
        .then(() => browser.waitForExist(search.searchForm))
        .then(() => {
            productMaster1 = testDataMgr.getProductById(product1ID);
            expectedDisplayName1 = productMaster1.getLocalizedProperty('displayName', locale);
            productMaster2 = testDataMgr.getProductById(product2ID);
            expectedDisplayName2 = productMaster2.getLocalizedProperty('displayName', locale);
        })
        .then(() => common.getVisibleSelector(search.searchQuerySelector1, search.searchQuerySelector2))
        .then(mySelector => {
            myQuerySelector = mySelector;
            return browser.setValue(myQuerySelector, productGeneral[locale]);
        })
        .then(() => browser.submitForm(myQuerySelector))
        // need this pause because other wait condition does not work
        .then(() => browser.pause(2000))
        .then(() => browser.isVisible(search.filterButton))
        .then((isTrue) => {
            if (isTrue) {
                // access mobile devices
                return browser.click(search.filterButton)
                    .then(() => browser.waitForExist(search.refinementBarColor))
                    .then(() => browser.click(search.refinementBarColor))
                    .then(() => browser.waitForExist(search.refinementBarColorActive))
                    .then(() => browser.click(search.blackColorRefinementSelector))
                    .then(() => common.waitUntilAjaxCallEnded())
                    .then(() => browser.waitForExist(search.refinementBarPrice))
                    .then(() => browser.click(search.refinementBarPrice))
                    .then(() => browser.waitForExist(search.refinementBarPriceActive))
                    .then(() => browser.click(search.priceRefinementSelector))
                    .then(() => common.waitUntilAjaxCallEnded())
                    .then(() => browser.waitForExist(search.refinementBarNewArrival))
                    .then(() => browser.click(search.refinementBarNewArrival))
                    .then(() => browser.waitForExist(search.refinementBarNewArrivalActive))
                    .then(() => browser.click(search.newArrivalRefinementUnchecked))
                    .then(() => common.waitUntilAjaxCallEnded())
                    .then(() => browser.click(search.buttonClose))
                    .then(() => common.waitUntilPageLoaded())
                    .then(() => browser.click(search.customSelect))
                    .then(() => browser.click(search.sortOrderProductAtoZ))
                    // need this pause since wait for other condition not working
                    .then(() => browser.pause(2000));
            }
            // access desktop/laptop
            return browser.click(search.blackColorRefinementSelector)
                .then(() => common.waitUntilAjaxCallEnded())
                .then(() => browser.click(search.priceRefinementSelector))
                .then(() => common.waitUntilAjaxCallEnded())
                .then(() => browser.click(search.newArrivalRefinementUnchecked))
                .then(() => common.waitUntilAjaxCallEnded())
                .then(() => browser.click(search.customSelect))
                .then(() => browser.click(search.sortOrderProductAtoZ))
                // need this pause since wait for other condition not working
                .then(() => browser.pause(2000));
        })
    );

    it('#1 should return 2 results for pants when refine by Color, Price and New Arrival', () => {
        const searchResultMsg2 = Resource.msgf('label.resultsfor', 'search', null, '2');
        const expectedString2 = searchResultMsg2 + ' ' + productGeneral[locale];
        return browser.isVisible(search.filterButton)
            .then((isTrue) => {
                if (isTrue) {
                    // access mobile devices
                    return verifySearchResults(search.searchResultCount, expectedString2);
                }
                // access desktop/laptop
                return common.getVisibleSelector(search.colorRefinementLarge, search.colorRefinementSmall)
                    .then(mySearchSelector => verifySearchResults(mySearchSelector, expectedString2));
            });
    });

    it('#2 should return the correct names of the products when refined by Color, Price and New Arrival', () => {
        return search.getNthProductTileProductName(1)
            .then(productName => {
                return assert.equal(productName, expectedDisplayName2, 'Expected: displayed product name = ' + expectedDisplayName2);
            })
            .then(() => search.getNthProductTileProductName(2))
            .then(productName2 => {
                return assert.equal(productName2, expectedDisplayName1, 'Expected: displayed product name = ' + expectedDisplayName1);
            });
    });

    it('#3 should return the correct images when refined by Color, Price and New Arrival', () => {
        const product1ImageSrc = 'images/medium/PG.10208949.JJ0NLA0.PZ.jpg';
        const product2ImageSrc = 'images/medium/PG.10208897.JJ0QRXX.PZ.jpg';
        return search.getNthProductTileImageSrc(2)
            .then(imageSrc => {
                return assert.isTrue(imageSrc.endsWith(product1ImageSrc),
                    'product image: url not end with ' + product1ImageSrc);
            })
            .then(() => search.getNthProductTileImageSrc(1))
            .then(imageSrc2 => {
                return assert.isTrue(imageSrc2.endsWith(product2ImageSrc),
                    'product image :url not end with ' + imageSrc2);
            });
    });

    it('#4 should return the correct href links when refined by Color, Price and New Arrival', () => {
        const expectedLink1 = baseUrl + '/' + common.convertToUrlFormat(expectedDisplayName1) + '/' + product1ID + '.html?lang=' + localeStr;
        const expectedLink2 = baseUrl + '/' + common.convertToUrlFormat(expectedDisplayName2) + '/' + product2ID + '.html?lang=' + localeStr;
        return search.getNthProductTileImageHref(2)
            .then(imageLink1 => {
                return assert.equal(imageLink1, expectedLink1, 'Expected image link not equal to ' + expectedLink1);
            })
            .then(() => search.getNthProductTileImageHref(1)
                .then(imageLink2 => {
                    return assert.equal(imageLink2, expectedLink2, 'Expected image link not equal to ' + expectedLink2);
                })
            );
    });


    it('#5 should return the correct color swatch count when refined by Color, Price and New Arrival', () => {
        return search.getNthProductTileColorSwatchCount(1)
            .then(count => {
                return assert.equal(count, 1, 'Expected: the number of color swatch to be 1.');
            })
            .then(() => search.getNthProductTileColorSwatchCount(2)
                .then(count => {
                    return assert.equal(count, 1, 'Expected: the number of color swatch to be 1.');
                })
            );
    });

    it('#6 should return 79 results for pants when reset button is clicked', () => {
        return browser.isVisible(search.filterButton)
            .then((isTrue) => {
                if (isTrue) {
                    // access mobile devices
                    return browser.click(search.filterButton)
                        .then(() => browser.waitForExist(search.buttonClose))
                        .then(() => browser.click(search.resetButton))
                        // need this pause since wait for other condition not working
                        .then(() => browser.pause(2000))
                        .then(() => verifySearchResults(search.searchResultCount, expectedString));
                }
                // access desktop/laptop
                return browser.click(search.resetButton)
                    .then(() => common.waitUntilAjaxCallEnded())
                    .then(() => common.getVisibleSelector(search.colorRefinementLarge,
                        search.colorRefinementSmall))
                    .then(mySearchSelector => verifySearchResults(mySearchSelector, expectedString));
            });
    });
});
